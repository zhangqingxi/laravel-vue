import { defHttp } from '@/utils/http/axios';
import { getInitModel } from '@/api/sys/model/initModel';
import { Api } from '@/api/sys/model/route';

/**
 * @description: Get user menu based on id
 */

export const initAdmin = () => {
  return defHttp.get<getInitModel>({ url: Api.InitAdmin }, { successMessageMode: 'none' });
};
