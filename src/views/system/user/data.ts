import { BasicColumn, FormSchema } from '@/components/Table';
import { useI18n } from '@/hooks/web/useI18n';

const { t } = useI18n();

export const columns: BasicColumn[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80,
    align: 'center',
    defaultHidden: true,
  },
  {
    title: t('sys.user.account'),
    dataIndex: 'account',
    width: 120,
  },
  {
    title: t('sys.user.avatar'),
    dataIndex: 'avatar',
    width: 120,
  },
  {
    title: t('sys.user.phone'),
    dataIndex: 'phone',
    width: 120,
  },
  {
    title: t('sys.user.email'),
    dataIndex: 'email',
    width: 150,
  },
  {
    title: t('sys.user.role'),
    dataIndex: 'roles',
    width: 120,
  },

  {
    title: t('sys.user.register'),
    dataIndex: 'registerTime',
    sorter: true,
    showSorterTooltip: false,
  },

  {
    title: t('sys.user.lastLoginTime'),
    dataIndex: 'lastLoginTime',
    sorter: true,
    showSorterTooltip: false,
  },

  {
    title: t('sys.user.status'),
    dataIndex: 'status',
    width: 80,
    // slots: { customRender: 'status' },
    // customRender: ({ record }) => {
    //   const status = record.status;
    //   const enable = status === 1;
    //   const color = enable ? 'green' : 'red';
    //   const text = enable ? t('sys.menu.enable') : t('sys.menu.disable');
    //   return h(Tag, { color: color }, () => text);
    // },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'keyword',
    label: t('sys.common.keyword'),
    component: 'Input',
    colProps: { span: 10 },
    componentProps: {
      autocomplete: 'off',
      placeholder:
        t('sys.common.pleaseInput') +
        t('sys.user.account') +
        '、' +
        t('sys.user.nickname') +
        '、' +
        t('sys.user.email'),
    },
  },
  {
    field: 'status',
    label: t('sys.menu.status'),
    component: 'Select',
    componentProps: {
      options: [
        { label: t('sys.user.enable'), value: 1 },
        { label: t('sys.user.disable'), value: 0 },
      ],
    },
    colProps: { span: 8 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    required: true,
    componentProps: {
      readonly: true,
      disabled: true,
      autocomplete: 'off',
    },
    ifShow: ({ values }) => !!values.id,
  },
  {
    field: 'account',
    label: t('sys.user.account'),
    component: 'Input',
    required: true,
    dynamicDisabled: ({ values }) => !!values.id,
    dynamicReadonly: ({ values }) => !!values.id,
    componentProps: {
      autocomplete: 'off',
    },
  },
  {
    field: 'nickname',
    label: t('sys.user.nickname'),
    component: 'Input',
    required: true,
    componentProps: {
      autocomplete: 'off',
    },
  },
  {
    field: 'roles',
    label: t('sys.user.role'),
    component: 'ApiSelect',
    required: true,
    ifShow: ({ values }) => !!values.id,
  },
  {
    field: 'password',
    component: 'StrengthMeter',
    label: t('sys.common.password'),
    colProps: { span: 20 },
    required: ({ values }) => !values.id,
    componentProps: {
      placeholder: t('sys.common.pleaseInput') + t('sys.common.password'),
      visibilityToggle: true,
      autocomplete: 'off',
    },
  },
  {
    field: 'confirmPassword',
    component: 'InputPassword',
    label: t('sys.common.confirmPassword'),
    colProps: { span: 20 },
    componentProps: {
      placeholder: t('sys.common.pleaseInput') + t('sys.common.confirmPassword'),
      autocomplete: 'off',
    },
    dynamicRules: ({ values }) => {
      if (values.id) {
        return [
          {
            required: false,
            validator: (_, value) => {
              if (value !== values.password) {
                return Promise.reject(t('sys.user.passwordsDoNotMatch'));
              }
              return Promise.resolve();
            },
          },
        ];
      } else {
        return [
          {
            required: true,
            validator: (_, value) => {
              if (!value) {
                return Promise.reject(
                  t('sys.common.pleaseInput') + t('sys.common.confirmPassword'),
                );
              }
              if (value !== values.password) {
                return Promise.reject(t('sys.user.passwordsDoNotMatch'));
              }
              return Promise.resolve();
            },
          },
        ];
      }
    },
  },

  {
    field: 'email',
    label: t('sys.user.email'),
    component: 'Input',
    required: true,
    componentProps: {
      autocomplete: 'off',
    },
  },

  {
    field: 'phone',
    label: t('sys.user.phone'),
    component: 'InputNumber',
    required: true,
  },
  {
    field: 'registerTime',
    label: t('sys.user.register'),
    component: 'DatePicker',
    required: true,
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    field: 'status',
    label: t('sys.menu.status'),
    component: 'RadioButtonGroup',
    defaultValue: 1,
    required: true,
    componentProps: {
      options: [
        { label: t('sys.user.enable'), value: 1 },
        { label: t('sys.user.disable'), value: 0 },
      ],
    },
  },
];
