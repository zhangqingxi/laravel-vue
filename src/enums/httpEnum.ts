/**
 * @description: Request result set
 */
export enum ResultEnum {
  SUCCESS = 1000,
  ERROR = -1,
  TIMEOUT = 401,

  // Request
  REQUEST_EXPIRED = 6400,
  REQUEST_DUPLICATE = 6401,
  TOO_MANY_REQUESTS = 6402,
  CROSS_DOMAIN_REQUEST = 6403,

  // 加密解密
  ENCRYPTION_FAILED = 6500,
  DECRYPTION_FAILED = 6501,

  ENCRYPTION_KEY_NOT_FOUND = 6502,

  //Token
  TOKEN_INVALID = 6600,
  TOKEN_NOT_PROVIDED = 6601,
  TOKEN_EXPIRED_REFRESH = 6602,
  TOKEN_EXPIRED_LOGIN_OTHER_DEVICE = 6603,
  //路由
  ROUTE_NOT_FOUND = 6700,

  //数据库错误
  DATABASE_ERROR = 6900,

  //数据校验错误
  VALIDATION_ERROR = 7000,

  //异常错误
  EXCEPTION_ERROR = 7100,
  NOT_FOUNT_EXCEPTION = 7101,
  METHOD_NOT_ALLOWED = 7102,
  TYPE = 'success',
}

/**
 * @description: request method
 */
export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/**
 * @description:  contentType
 */
export enum ContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // form-data qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data  upload
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}
