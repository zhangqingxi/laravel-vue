/**
 * @description: role search parameters
 */
export interface RoleSearchParams {
  keyword?: string;
  status?: number;
}

/**
 * @description: Get role list
 */
export interface GetRoleInfoModel {
  id: number;
  // 角色名称
  name: string;
  // 角色状态
  status: number;
  //备注
  remark: string;
  createTime: string;
}

/**
 * @description: update role
 */
export interface UpdateRoleModel {
  id: number;
  // 角色名称
  name?: string;

  //状态
  status?: number;
  remark?: string;
  menus?: [];
}

/**
 * @description: update role
 */
export interface BatchUpdateRoleModel {
  ids: [];
  // 批量操作类型
  type: string;
}

/**
 * @description: add role
 */
export interface AddRoleModel {
  // 角色名称
  name: string;
  // 角色状态
  status: number;
  //备注
  remark: string;
  menus?: [];
}

/**
 * @description: delete role
 */
export interface DeleteRoleModel {
  id: number;
}

/**
 * @description: update role permission
 */
export interface UpdateRolePermissionModel {
  // 角色
  id: number;
  menus: [];
}

/**
 * @description: Get menu return value
 */
export type getRoleListResultModel = GetRoleInfoModel[];
