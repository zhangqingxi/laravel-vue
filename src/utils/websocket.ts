// src/utils/websocket.ts
import { ResultEnum } from '@/enums/httpEnum';
import { useI18n } from '@/hooks/web/useI18n';
import { useMessage } from '@/hooks/web/useMessage';
import { useUserStore } from '@/store/modules/user';
import { computed, Ref, ref } from 'vue';
import { log } from './log';

export enum WebsokcetTypeEnum {
  CLOSE = 'close',
  OK = 'OK',
}

export interface WebsocketResponseModel<T = any> {
  code: number;
  message: string;
  type: WebsokcetTypeEnum;
  data: T;
}

const { createWarningModal } = useMessage();

class WebSocketClient {
  private static instance: WebSocketClient | null = null; // Singleton instance
  private socket: WebSocket | null;
  private reconnectFlag: boolean;
  private reconnectInterval: number;
  private reconnectTimer: NodeJS.Timeout | null;
  private url: string;
  private status: Ref<number>;
  private onOpenCallback: (() => void) | null; // 回调函数类型
  private userStore: any; // Vuex store 引用

  private constructor(url: string) {
    this.url = url;
    this.socket = null;
    this.reconnectFlag = true;
    this.reconnectInterval = 5000; // Reconnect interval in milliseconds
    this.reconnectTimer = null; // Initialize reconnect timer
    this.status = ref(WebSocket.CLOSED); // Reactive status of WebSocket
    this.onOpenCallback = null; // 初始化回调函数为 null
    this.userStore = useUserStore(); // 使用 useUserStore 动态获取 Vuex 的 store 实例
  }

  // 设置连接成功后的回调函数
  setOnOpenCallback(callback: () => void) {
    this.onOpenCallback = callback;
  }

  static getInstance(url: string): WebSocketClient {
    if (!WebSocketClient.instance) {
      WebSocketClient.instance = new WebSocketClient(url);
    }
    return WebSocketClient.instance;
  }

  connect() {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        log('WebSocket connected');
        this.status.value = WebSocket.OPEN;
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
        if (this.onOpenCallback) {
          this.onOpenCallback(); // 如果存在回调函数，则调用
        }
      };

      this.socket.onmessage = (event) => {
        // Handle incoming messages
        const data: WebsocketResponseModel = JSON.parse(event.data);
        log('Message from server', data);
        //关闭链接
        if (data.type === WebsokcetTypeEnum.CLOSE) {
          this.reconnectFlag = false;
          this.close();
        }
        switch (data.code) {
          case ResultEnum.TOKEN_EXPIRED_LOGIN_OTHER_DEVICE: //设备在其他地方登录
            this.handleOtherDeviceLogin(data);
            break;
          case ResultEnum.TOKEN_EXPIRED_REFRESH: //Token即将过期
            this.userStore.refreshToken();
            break;
          default:
        }
      };

      this.socket.onclose = () => {
        this.status.value = WebSocket.CLOSED;
        if (!this.reconnectTimer && this.reconnectFlag) {
          log('WebSocket connection closed, retrying in', this.reconnectInterval / 1000, 'seconds');

          this.reconnectTimer = setTimeout(() => {
            this.connect(); // Reconnect after reconnectInterval
          }, this.reconnectInterval);
        }
      };

      this.socket.onerror = (error) => {
        log('WebSocket error:', error);
      };
    }
  }

  setReconnectFlag(flag: boolean) {
    this.reconnectFlag = flag;
  }

  sendMessage(message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      log(
        'WebSocket is not open. Ready state:',
        this.socket ? this.socket.readyState : 'No socket',
      );
    }
  }

  //处理设备在其他地方登录
  handleOtherDeviceLogin(data: WebsocketResponseModel) {
    const { t } = useI18n();
    //TODO 这里一定要先undefined， 不然会去请求注销登录接口，验证会出错
    this.userStore.setToken(undefined);
    createWarningModal({
      title: t('sys.api.tip'),
      content: data.message,
      onOk: () => {
        this.reconnectFlag = false; //不允许重连
        this.userStore.logout(false);
      },
    });
  }

  close() {
    if (this.socket) {
      this.socket.close();
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer); // Clear reconnect timer if it exists
      this.reconnectTimer = null;
    }
    this.status.value = WebSocket.CLOSED;
  }

  getStatus() {
    return computed(() => this.status.value);
  }
}

export default WebSocketClient;

let websocket: WebSocketClient;

export async function setWebSocketConnect(wsUrl: string) {
  websocket = WebSocketClient.getInstance(wsUrl);
  websocket.connect();
}

export function sendWebsocketMessage(data: string) {
  if (websocket) {
    if (getWebsocketStatus() === WebSocket.OPEN) {
      websocket.sendMessage(data);
    } else {
      websocket.setOnOpenCallback(() => {
        websocket.sendMessage(data);
      });
    }
  }
}

export function getWebsocketStatus() {
  return websocket.getStatus().value;
}

export function closeWebsocket() {
  if (websocket) {
    websocket.setReconnectFlag(false);
    websocket.close();
  }
}
