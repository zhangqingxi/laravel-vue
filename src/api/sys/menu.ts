import { defHttp } from '@/utils/http/axios';
import {
  DeleteMenuParams,
  getMenuListResultModel,
  MenuParams,
  UpdateMenuParams,
} from './model/menuModel';
import { Api } from '@/api/sys/model/route';

/**
 * @description: Get user menu based on id
 */

export const getMenuList = (params?: MenuParams) => {
  return defHttp.get<getMenuListResultModel>(
    { url: Api.GetMenuList, data: params },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * @description: Get user menu based on id
 */

export const updateMenu = (params?: UpdateMenuParams) => {
  return defHttp.put({ url: Api.UpdateMenu, data: params });
};

/**
 * @description: Get user menu based on id
 */

export const deleteMenu = (params?: DeleteMenuParams) => {
  return defHttp.delete({ url: Api.DeleteMenu, data: params });
};
