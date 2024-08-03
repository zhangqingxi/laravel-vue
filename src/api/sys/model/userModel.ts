/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  account: string;
  password: string;
  nologin: boolean;
}

/**
 * @description: Login interface parameters
 */
export interface UserSearchParams {
  keyword?: string;
  status?: number;
}

/**
 * @description: Forget Pasword interface parameters
 */
export interface forgetPasswordParams {
  email: string;
  password: string;
}

export interface changePasswordParams {
  email: string;
  oldPassword: string;
  newPassword: string;
}

export interface RoleInfo {
  id: string;
  name: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number;
  token: string;
  roles: RoleInfo[];
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  id: number;
  roles: RoleInfo[];
  // 用户id
  userid: string | number;
  // 账号
  account: string;
  // 用户昵称
  nickname: string;
  // 头像
  avatar: string;
  // 介绍
  desc?: string;
  status?: number;
  email?: string;
  lastLoginTime?: string;
  lastLoginAddress?: string;
  registerTime?: string;
  phone?: string;
}

/**
 * @description: update user
 */
export interface UpdateUserInfoModel {
  id?: number;
  // 用户昵称
  nickname?: string;
  // 头像 = 文件ID
  avatar?: number;
  //邮箱
  email?: string;
  //邮箱
  phone?: string;
  //注册时间
  registerTime?: string;
  //状态
  status?: number;
  password?: string;
}

/**
 * @description: update user
 */
export interface BatchUpdateUserModel {
  ids: [];
  // 批量操作类型
  type: string;
}

/**
 * @description: add user
 */
export interface AddUserModel {
  // 用户昵称
  nickname: string;
  // 头像 = 文件ID
  avatar?: number;
  // 账号
  account: string;
  //密码
  password: string;
  //邮箱
  email: string;
  //手机
  phone: string;
  //注册时间
  registerTime: string;
  //状态
  status?: number;
}

/**
 * @description: delete user
 */
export interface DeleteUserModel {
  id: number;
}

/**
 * @description: update user roles
 */
export interface UpdateUserRolesModel {
  // 角色
  roles: [];
}

/**
 * @description: Get menu return value
 */
export type getUserListResultModel = GetUserInfoModel[];
