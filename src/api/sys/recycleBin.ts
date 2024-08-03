import { defHttp } from '@/utils/http/axios';
import { Api } from '@/api/sys/model/route';
import {
  BatchRecycleBinModel,
  DeleteRecycleBinModel,
  getRecycleBinListResultModel,
  LogSearchParams,
  RestoreRecycleBinModel,
} from './model/recycleBInModel';

/**
 * @description: get recycle bin list
 */
export function getRecycleBinList(params: LogSearchParams) {
  return defHttp.get<getRecycleBinListResultModel>(
    { url: Api.GetRecycleBinList, data: params },
    { successMessageMode: 'none' },
  );
}

/**
 * @description: restore recylce bin
 */
export function restoreRecycleBin(params: RestoreRecycleBinModel) {
  return defHttp.put({ url: Api.RestoreRecycleBin, data: params });
}

/**
 * @description: delete recylce bin
 */
export function deleteRecycleBin(params: DeleteRecycleBinModel) {
  return defHttp.delete({ url: Api.DeleteRecycleBin, data: params });
}

/**
 * @description: batch recylce bin
 */
export function batchRecycleBin(params: BatchRecycleBinModel) {
  return defHttp.post({ url: Api.BatchRecycleBin, data: params });
}
