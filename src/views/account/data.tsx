import { sendMail } from '@/api/sys/mail';
import { EmailType, sendMailParams } from '@/api/sys/model/mailModel';
import { FormSchema } from '@/components/Form';
import { useI18n } from '@/hooks/web/useI18n';
import { useUserStore } from '@/store/modules/user';

const { t } = useI18n();
export interface ListItem {
  title: string;
  icon: string;
  color?: string;
}

export interface TabItem {
  key: string;
  name: string;
  component: string;
}

export const achieveList: TabItem[] = [
  {
    key: '1',
    name: t('sys.user.basic'),
    component: 'Basic',
  },
  // {
  //   key: '2',
  //   name: t('sys.user.safe'),
  //   component: 'Safe',
  // },
  {
    key: '2',
    name: t('sys.user.password'),
    component: 'Password',
  },
];

// 基础设置 form
export const userSchemas: FormSchema[] = [
  {
    field: 'account',
    component: 'Input',
    label: t('sys.user.account'),
    colProps: { span: 20 },
    componentProps: {
      readonly: true,
      disabled: true,
      autocomplete: 'off',
    },
  },
  {
    field: 'phone',
    component: 'Input',
    label: t('sys.user.phone'),
    colProps: { span: 20 },
    componentProps: {
      readonly: true,
      disabled: true,
      autocomplete: 'off',
    },
  },
  {
    field: 'email',
    component: 'Input',
    label: t('sys.user.email'),
    colProps: { span: 20 },
    componentProps: {
      readonly: true,
      disabled: true,
      autocomplete: 'off',
    },
  },
  {
    field: 'nickname',
    component: 'Input',
    label: t('sys.user.nickname'),
    colProps: { span: 20 },
    componentProps: {
      placeholder: t('sys.common.pleaseInput') + t('sys.user.nickname'),
      autocomplete: 'off',
    },
    rules: [
      {
        required: true,
        message: t('sys.common.pleaseInput') + t('sys.user.nickname'),
      },
    ],
  },
  {
    field: 'registerTime',
    component: 'Input',
    label: t('sys.user.register'),
    colProps: { span: 20 },
    componentProps: {
      readonly: true,
      disabled: true,
      autocomplete: 'off',
    },
  },
  {
    field: 'lastLoginTime',
    component: 'Input',
    label: t('sys.user.lastLoginTime'),
    colProps: { span: 20 },
    componentProps: {
      readonly: true,
      disabled: true,
      autocomplete: 'off',
    },
  },
  {
    field: 'lastLoginAddress',
    component: 'Input',
    label: t('sys.user.lastLoginAddress'),
    colProps: { span: 20 },
    componentProps: {
      readonly: true,
      disabled: true,
    },
  },
  {
    field: 'code',
    component: 'InputCountDown',
    label: t('sys.common.emailCode'),
    colProps: { span: 20 },
    componentProps: {
      placeholder: t('sys.common.pleaseInput') + t('sys.common.emailCode'),
      sendCodeApi: sendMail,
      sendCodeParams: getSendCodeParams(),
    },
    rules: [
      {
        required: true,
        message: t('sys.common.pleaseInput') + t('sys.common.emailCode'),
      },
    ],
  },
  {
    field: 'oldPassword',
    component: 'InputPassword',
    label: t('sys.common.oldPassword'),
    colProps: { span: 20 },
    componentProps: {
      placeholder: t('sys.common.pleaseInput') + t('sys.common.oldPassword'),
    },
    rules: [
      {
        required: true,
        message: t('sys.common.pleaseInput') + t('sys.common.oldPassword'),
      },
    ],
  },
  {
    field: 'newPassword',
    component: 'StrengthMeter',
    label: t('sys.common.newPassword'),
    colProps: { span: 20 },
    componentProps: {
      placeholder: t('sys.common.pleaseInput') + t('sys.common.newPassword'),
      visibilityToggle: true,
    },
    dynamicRules: ({ values }) => {
      return [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject(t('sys.common.pleaseInput') + t('sys.common.newPassword'));
            }
            if (value === values.oldPassword) {
              return Promise.reject(t('sys.user.passwordsMatchOld'));
            }
            return Promise.resolve();
          },
        },
      ];
    },
  },
  {
    field: 'confirmNewPassword',
    component: 'InputPassword',
    label: t('sys.common.confirmNewPassword'),
    colProps: { span: 20 },
    componentProps: {
      placeholder: t('sys.common.pleaseInput') + t('sys.common.confirmNewPassword'),
    },
    dynamicRules: ({ values }) => {
      return [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject(
                t('sys.common.pleaseInput') + t('sys.common.confirmNewPassword'),
              );
            }
            if (value !== values.newPassword) {
              return Promise.reject(t('sys.user.passwordsDoNotMatch'));
            }
            return Promise.resolve();
          },
        },
      ];
    },
  },
];

function getSendCodeParams(): sendMailParams {
  const userStore = useUserStore();
  const userinfo = userStore.getUserInfo;

  return { email: userinfo['email'], type: EmailType.CHANGE_PASSWORD };
}
