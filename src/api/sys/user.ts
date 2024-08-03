import { defHttp } from '@/utils/http/axios';
import {
  LoginParams,
  LoginResultModel,
  GetUserInfoModel,
  forgetPasswordParams,
  UpdateUserInfoModel,
  changePasswordParams,
  getUserListResultModel,
  AddUserModel,
  DeleteUserModel,
  UpdateUserRolesModel,
  UserSearchParams,
  BatchUpdateUserModel,
} from './model/userModel';

import { Api } from '@/api/sys/model/route';
import { ErrorMessageMode } from '#/axios';
import { getMenuListResultModel } from './model/menuModel';

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      data: params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}

/**
 * @description: user token refresh api
 */
export function refreshToken() {
  return defHttp.put({ url: Api.Refresh }, { successMessageMode: 'none' });
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { successMessageMode: 'none' });
}

/**
 * @description: getUserList
 */
export function getUserList(params: UserSearchParams) {
  return defHttp.get<getUserListResultModel>(
    { url: Api.GetUserList, data: params },
    { successMessageMode: 'none' },
  );
}

/**
 * @description: add user
 */
export function addUser(params: AddUserModel) {
  return defHttp.post({ url: Api.AddUser, data: params });
}
/**
 * @description: delete user
 */
export function deleteUser(params: DeleteUserModel) {
  return defHttp.delete({ url: Api.DeleteUser, data: params });
}

/**
 * @description: update user roles
 */
export function updateUserRoles(params: UpdateUserRolesModel) {
  return defHttp.put({ url: Api.UpdateUserRoles, data: params });
}

/**
 * @description: batch update user
 */
export function BatchUpdateUser(params: BatchUpdateUserModel) {
  return defHttp.post({ url: Api.BatchUpdateUser, data: params });
}

/**
 * @description: updateUserInfo - 个人信息更新
 */
export function updateUserInfo(params: UpdateUserInfoModel) {
  return defHttp.put({ url: Api.UpdateUserInfo, data: params });
}

/**
 * @description: updateUser
 */
export function updateUser(params: UpdateUserInfoModel) {
  return defHttp.put({ url: Api.UpdateUser, data: params });
}

/**
 * @description: getUserInfo
 */
export function forgetPassword(params: forgetPasswordParams) {
  return defHttp.put({ url: Api.ForgetPassword, data: params });
}

/**
 * @description: getUserInfo
 */
export function changePassword(params: changePasswordParams) {
  return defHttp.put({ url: Api.UpdatePassword, data: params });
}

export function getPermCode() {
  // return defHttp.get<string[]>({ url: Api.GetPermCode });
}

/**
 * @description: Get user menu based on id
 */

export const getUserMenuList = () => {
  return defHttp.get<getMenuListResultModel>(
    { url: Api.GetUserMenuList },
    {
      successMessageMode: 'none',
    },
  );
};

export function doLogout() {
  return defHttp.post({ url: Api.Logout });
}

export function testRetry() {
  return defHttp.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    },
  );
}
