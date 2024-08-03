export enum Api {
  InitAdmin = '/init/admin',

  //Auth
  Login = '/auth/login',
  Logout = '/auth/logout',
  Refresh = '/auth/refresh',

  //User
  GetUserInfo = '/user/info',
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  UpdateUserInfo = '/user/info',
  ForgetPassword = '/user/forget',
  UpdatePassword = '/user/password',
  GetUserMenuList = '/user/menus',
  GetUserList = '/user',
  AddUser = '/user/add',
  UpdateUser = '/user/update',
  DeleteUser = '/user/delete',
  UpdateUserRoles = '/user/roles',
  BatchUpdateUser = '/user/batch',

  //File
  FileUpload = '/file/upload',
  GetFileList = '/file',
  UpdateFile = '/file/update',
  DeleteFile = '/file/delete',
  BatchUpdateFile = '/file/batch',
  UnusedFile = '/file/unused',

  GetPermCode = '/getPermCode',
  TestRetry = '/testRetry',

  //Menu
  GetMenuList = '/menu',
  UpdateMenu = '/menu/update',
  DeleteMenu = '/menu/delete',

  //Role
  GetRoleList = '/role',
  AddRole = '/role/add',
  UpdateRole = '/role/update',
  DeleteRole = '/role/delete',
  RolePermission = '/role/permisssion',
  BatchUpdateRole = '/role/batch',

  SendMail = '/mail/send',
  VerifyMail = '/mail/verify',

  //log
  GetRequestLogList = '/log/request/',
  GetOperationLogList = '/log/operation/',
  RemoveRequestLog = '/log/request/delete',
  RemoveOperationLog = '/log/operation/delete',

  //recycleBin
  GetRecycleBinList = '/recycle',
  RestoreRecycleBin = '/recycle/restore',
  DeleteRecycleBin = '/recycle/delete',
  BatchRecycleBin = '/recycle/batch',
}
