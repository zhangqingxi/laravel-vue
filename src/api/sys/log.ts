import { defHttp } from '@/utils/http/axios';
import { Api } from '@/api/sys/model/route';
import {
  DeleteLogModel,
  getOperationtLogListResultModel,
  getRequestLogListResultModel,
  LogSearchParams,
} from './model/logModel';

/**
 * @description: get request log list
 */
export function getRequestLogList(params: LogSearchParams) {
  return defHttp.get<getRequestLogListResultModel>(
    { url: Api.GetRequestLogList, data: params },
    { successMessageMode: 'none' },
  );
}

/**
 * @description: remove request log
 */
export function removeRequestLog(params: DeleteLogModel) {
  return defHttp.delete({ url: Api.RemoveRequestLog, data: params });
}

/**
 * @description: get operation log list
 */
export function getOperationLogList(params: LogSearchParams) {
  return defHttp.get<getOperationtLogListResultModel>(
    {
      url: Api.GetOperationLogList,
      data: params,
    },
    { successMessageMode: 'none' },
  );
}

/**
 * @description: remove operation log
 */
export function removeOperationLog(params: DeleteLogModel) {
  return defHttp.delete({ url: Api.RemoveOperationLog, data: params });
}
