import { defHttp } from '@/utils/http/axios';
import { GetAccountInfoModel } from './model/accountModel';

enum Api {
  ACCOUNT_INFO = '/account/getAccountInfo',
  SESSION_TIMEOUT = '/user/info',
  TOKEN_EXPIRED = '/user/info',
}

// Get personal center-basic settings

export const accountInfoApi = () => defHttp.get<GetAccountInfoModel>({ url: Api.ACCOUNT_INFO });

export const sessionTimeoutApi = () => defHttp.get<void>({ url: Api.SESSION_TIMEOUT });

export const tokenExpiredApi = () => defHttp.get<void>({ url: Api.TOKEN_EXPIRED });
