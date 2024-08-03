import { defHttp } from '@/utils/http/axios';
import { Api } from '@/api/sys/model/route';
import {
  AddRoleModel,
  BatchUpdateRoleModel,
  DeleteRoleModel,
  GetRoleInfoModel,
  RoleSearchParams,
  UpdateRoleModel,
  UpdateRolePermissionModel,
} from './model/roleModel';

/**
 * @description: get role list
 */
export function getRoleList(params: RoleSearchParams) {
  return defHttp.get<GetRoleInfoModel>(
    { url: Api.GetRoleList, data: params },
    { successMessageMode: 'none' },
  );
}

/**
 * @description: add role
 */
export function addRole(params: AddRoleModel) {
  return defHttp.post({ url: Api.AddRole, data: params });
}
/**
 * @description: delete role
 */
export function deleteRole(params: DeleteRoleModel) {
  return defHttp.delete({ url: Api.DeleteRole, data: params });
}

/**
 * @description: batch update role
 */
export function BatchUpdateRole(params: BatchUpdateRoleModel) {
  return defHttp.post({ url: Api.BatchUpdateRole, data: params });
}

/**
 * @description: update role
 */
export function updateRole(params: UpdateRoleModel) {
  return defHttp.put({ url: Api.UpdateRole, data: params });
}
