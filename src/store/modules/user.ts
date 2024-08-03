import type { UserInfo } from '#/store';
import type { ErrorMessageMode } from '#/axios';
import { defineStore } from 'pinia';
import { store } from '@/store';
import { RoleEnum } from '@/enums/roleEnum';
import { PageEnum } from '@/enums/pageEnum';
import {
  ROLES_KEY,
  TOKEN_KEY,
  USER_INFO_KEY,
  USER_MENUS_KEY,
  USER_NOLOGIN_KEY,
} from '@/enums/cacheEnum';
import { getAuthCache, getCache, setAuthCache, setCache } from '@/utils/auth';
import { GetUserInfoModel, LoginParams } from '@/api/sys/model/userModel';
import { doLogout, getUserInfo, loginApi, refreshToken } from '@/api/sys/user';
import { useI18n } from '@/hooks/web/useI18n';
import { useMessage } from '@/hooks/web/useMessage';
import { router } from '@/router';
import { usePermissionStore } from '@/store/modules/permission';
import { RouteRecordRaw } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '@/router/routes/basic';
import { isArray } from '@/utils/is';
import { h } from 'vue';
import { closeWebsocket, sendWebsocketMessage, setWebSocketConnect } from '@/utils/websocket';
import { getInitConfig } from '@/utils/initConfig';
import { setCacheTime } from '@/settings/encryptionSetting';
import { useGlobSetting } from '@/hooks/setting';
import { AppRouteRecordRaw } from '@/router/types';
import { log } from '@/utils/log';

interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  roleList: RoleEnum[];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
  timeoutId: NodeJS.Timeout | string | number | undefined | null; // 增加超时定时器ID
  nologin?: boolean;
  userMenus: AppRouteRecordRaw[];
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    // roleList
    roleList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,

    timeoutId: null, // 增加超时定时器ID
    nologin: false,
    userMenus: [],
  }),
  getters: {
    getUserInfo(state): UserInfo {
      return state.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getUserMenus(state): AppRouteRecordRaw[] {
      return state.userMenus || getAuthCache<AppRouteRecordRaw>(USER_MENUS_KEY) || {};
    },
    getNologin(state): boolean {
      return state.nologin || getCache<boolean>(USER_NOLOGIN_KEY);
    },
    getToken(state): string {
      return state.token || getAuthCache<string>(TOKEN_KEY);
    },
    getRoleList(state): RoleEnum[] {
      return state.roleList.length > 0 ? state.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
    getSessionTimeout(state): boolean {
      return !!state.sessionTimeout;
    },
    getLastUpdateTime(state): number {
      return state.lastUpdateTime;
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY, info);
    },
    setUserMenus(menus: AppRouteRecordRaw[]) {
      this.userMenus = menus ? menus : []; // for null or undefined value
      setAuthCache(USER_MENUS_KEY, menus);
    },
    setNologin(flag: boolean) {
      this.nologin = flag;
      setCache(USER_NOLOGIN_KEY, flag, null);
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.roleList = [];
      this.sessionTimeout = false;
    },
    //TOOD 设置会话定时器
    resetSessionTimeout() {
      //免登录不需要会话超时机制
      if (this.getNologin) return;
      // 清除旧的定时器
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      // 设置新的定时器
      this.timeoutId = setTimeout(
        () => {
          this.setSessionTimeout(true);
          //关闭ws连接
          closeWebsocket();
        },
        15 * 60 * 1000,
      ); // 15分钟
      log('timeout id', this.timeoutId);
    },

    /**
     * @description: refresh Token
     */
    async refreshToken() {
      //获取Token
      if (!this.getToken) {
        //关闭ws连接
        closeWebsocket();
        return null;
      }
      //刷新Token 即延长Token时间
      await refreshToken();
    },

    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ): Promise<GetUserInfoModel | null> {
      try {
        const { goHome = true, mode, ...loginParams } = params;
        const data = await loginApi(loginParams, mode);
        const { token } = data;
        //重新设置缓存过期时间
        if (loginParams.nologin) {
          setCacheTime(7 * 24 * 60 * 60);
        } else {
          const { cacheTime } = useGlobSetting();
          setCacheTime(cacheTime);
        }

        this.setNologin(loginParams.nologin);

        // save token
        this.setToken(token);

        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async afterLoginAction(goHome?: boolean): Promise<GetUserInfoModel | null> {
      if (!this.getToken) return null;
      // get user info
      const userInfo = await this.getUserInfoAction();

      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        const permissionStore = usePermissionStore();

        // 动态路由加载（首次）
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction();
          [...routes, PAGE_NOT_FOUND_ROUTE].forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          // 记录动态路由加载完成
          permissionStore.setDynamicAddedRoute(true);
        }

        goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME));
      }
      return userInfo as GetUserInfoModel;
    },
    async getUserInfoAction(): Promise<UserInfo | null> {
      if (!this.getToken) return null;
      const userInfo = await getUserInfo();
      const { roles = [] } = userInfo;
      if (isArray(roles)) {
        const roleList = roles.map((item) => item.name) as RoleEnum[];
        this.setRoleList(roleList);
      } else {
        userInfo.roles = [];
        this.setRoleList([]);
      }
      this.setUserInfo(userInfo);

      // 等待 WebSocket 连接成功后发送消息
      //TOOD 链接websocket
      const { wsUrl } = getInitConfig();
      await setWebSocketConnect(wsUrl);

      //发送消息
      sendWebsocketMessage(
        JSON.stringify({ type: 'userInfo', userid: userInfo.userid, token: this.getToken }),
      );

      return userInfo;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      // 清除定时器
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }

      if (this.getToken) {
        try {
          await doLogout();
        } catch {
          log('注销Token失败');
        }
      }
      this.setToken(undefined);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      if (goLogin) {
        // 直接回登陆页
        router.replace(PageEnum.BASE_LOGIN);
      } else {
        // 回登陆页带上当前路由地址
        router.replace({
          path: PageEnum.BASE_LOGIN,
          query: {
            redirect: encodeURIComponent(router.currentRoute.value.fullPath),
          },
        });
      }
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          // 主动登出，不带redirect地址
          await this.logout(true);
        },
      });
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
