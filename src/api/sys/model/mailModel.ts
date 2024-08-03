/**
 * @description: Enum for different types of emails that can be sent.
 */
export enum EmailType {
  RESET_PASSWORD = 1,
  CHANGE_PASSWORD = 2,
  BIND_EMAIL = 3,
}

/**
 * @description: Login interface parameters
 */
export interface sendMailParams {
  email: string;
  type: EmailType;
}

/**
 * @description: Login interface parameters
 */
export interface verifyMailParams {
  email: string;
  type: EmailType;
  code: number;
}
