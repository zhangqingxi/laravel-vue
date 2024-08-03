import { defHttp } from '@/utils/http/axios';
import { Api } from '@/api/sys/model/route';
import { sendMailParams, verifyMailParams } from './model/mailModel';

/**
 * @description: send Mail
 */
export function sendMail(params: sendMailParams) {
  return defHttp.post<boolean>({
    url: Api.SendMail,
    data: params,
  });
}

/**
 * @description: send Mail
 */
export function verifyMail(params: verifyMailParams) {
  return defHttp.post(
    {
      url: Api.VerifyMail,
      data: params,
    },
    {
      successMessageMode: 'none',
    },
  );
}
