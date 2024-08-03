/**
 * @description: log search parameters
 */
export interface LogSearchParams {
  startDate?: string;
  endDate?: number;
}

/**
 * @description: Get request log list
 */
export interface GetRequestLogInfoModel {
  requestId: string;
  // 请求Host
  host: string;
  // 请求日志
  url: string;
  //请求ip
  ip: string;
  ipAddress: string;
  //请求方法
  method: string;
  //请求User_agent
  userAgent: string;
  //请求体
  requestData: [];
  //相应体
  responseData: [];
  //请求异常
  exceptionData?: [];
  //请求时间
  createTime: string;
}

/**
 * @description: Get operation log list
 */
export interface GetOperationLogInfoModel {
  id: string;
  // 路由
  route: string;
  //ip
  ip: string;
  ipAddress: string;
  //方法
  method: string;
  //表
  tableName: string;
  //表ID
  tableId: number;
  //内容
  content: [];
  //时间
  createTime: string;
}

/**
 * @description: delete log
 */
export interface DeleteLogModel {
  type: string;
}

/**
 * @description: Get request log return value
 */
export type getRequestLogListResultModel = GetRequestLogInfoModel[];

/**
 * @description: Get request log return value
 */
export type getOperationtLogListResultModel = GetOperationLogInfoModel[];
