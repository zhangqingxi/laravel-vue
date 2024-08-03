import {
  BatchUpdateFileModel,
  DeleteFileModel,
  FileSearchParams,
  getFileListResultModel,
  UnusedFileModel,
  UpdateFileModel,
  UploadApiResult,
} from './model/fileModel';
import { defHttp } from '@/utils/http/axios';
import { UploadFileParams } from '#/axios';
import { AxiosProgressEvent } from 'axios';

import { Api } from '@/api/sys/model/route';

/**
 * @description: Upload File
 */
export function uploadFile(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void,
) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: Api.FileUpload,
      onUploadProgress,
    },
    params,
  );
}

/**
 * @description: get file list
 */
export function getFileList(params: FileSearchParams) {
  return defHttp.get<getFileListResultModel>(
    { url: Api.GetFileList, data: params },
    { successMessageMode: 'none' },
  );
}

/**
 * @description: update file
 */
export function UpdateFile(params: UpdateFileModel) {
  return defHttp.put({ url: Api.UpdateFile, data: params });
}

/**
 * @description: delete file
 */
export function DeleteFile(params: DeleteFileModel) {
  return defHttp.delete({ url: Api.DeleteFile, data: params });
}

/**
 * @description: batch update file
 */
export function BatchUpdateFile(params: BatchUpdateFileModel) {
  return defHttp.post({ url: Api.BatchUpdateFile, data: params });
}

/**
 * @description: unused file
 */
export function UnusedFile(params: UnusedFileModel) {
  return defHttp.put({ url: Api.UnusedFile, data: params });
}
