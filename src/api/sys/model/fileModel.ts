export interface UploadApiResult {
  id: string;
  url: string;
}

/**
 * @description: File search parameters
 */
export interface FileSearchParams {
  startDate?: string;
  endDate?: number;
  name?: string;
  type?: string;
}

/**
 * @description: Get request log list
 */
export interface GetFileInfoModel {
  id: string;
  // 文件名称
  name: string;
  // 文件类型
  type: string;
  //文件mineType
  mineType: string;
  szie: string;
  //文件扩展
  extension: string;
  //文件hash
  hash: string;
  //请求体
  uploaded_by: number;
  //上传时间
  createTime: string;
}

/**
 * @description: update file
 */
export interface UpdateFileModel {
  id: number;
  // 文件名称
  name?: string;
}

/**
 * @description: update file
 */
export interface BatchUpdateFileModel {
  ids: [];
  // 批量操作类型
  type: string;
}

/**
 * @description: delete File
 */
export interface DeleteFileModel {
  id: number;
}

/**
 * @description: unused File
 */
export interface UnusedFileModel {
  id: number;
}

/**
 * @description: unused File
 */
export interface UnusedFileModel {
  id: number;
}

/**
 * @description: Get File list return value
 */
export type getFileListResultModel = GetFileInfoModel[];
