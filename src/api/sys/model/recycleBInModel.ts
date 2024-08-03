/**
 * @description: log search parameters
 */
export interface LogSearchParams {
  startDate?: string;
  endDate?: number;
}

/**
 * @description: Get recycle bin list
 */
export interface GetRecycleBinInfoModel {
  adminId: number;
  // 数据模型
  tableName: string;
  // 模型ID
  tableId: number;
  //内容
  content: [];
  //请求时间
  createTime: string;
}

/**
 * @description: batch recycle bin
 */
export interface BatchRecycleBinModel {
  ids: [];
  type: string;
}

/**
 * @description: delete recycle bin
 */
export interface DeleteRecycleBinModel {
  id: number;
}

/**
 * @description: restore recycle bin
 */
export interface RestoreRecycleBinModel {
  id: number;
}

/**
 * @description: Get recycle bin return value
 */
export type getRecycleBinListResultModel = GetRecycleBinInfoModel[];
