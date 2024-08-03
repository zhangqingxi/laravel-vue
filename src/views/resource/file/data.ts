import { BasicColumn, FormSchema } from '@/components/Table';
import { useI18n } from '@/hooks/web/useI18n';
import { hasPermission, MenuPermissionModeEnum } from '@/utils/permission';

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
    title: t('sys.file.name'),
    dataIndex: 'name',
    edit: hasPermission(t('sys.menu.file_manage'), MenuPermissionModeEnum.UPDATE),
    editComponent: 'Input',
  },
  {
    title: t('sys.file.preview'),
    dataIndex: 'url',
  },
  {
    title: t('sys.file.type'),
    dataIndex: 'type',
    width: 100,
  },
  {
    title: t('sys.file.mimeType'),
    dataIndex: 'mimeType',
    width: 120,
  },
  {
    title: t('sys.file.size'),
    dataIndex: 'sizeText',
    width: 100,
    sorter: true,
    showSorterTooltip: false,
  },

  {
    title: t('sys.file.extension'),
    dataIndex: 'extension',
    width: 100,
  },

  {
    title: t('sys.file.association'),
    dataIndex: 'associations',
    width: 120,
  },

  {
    title: t('sys.file.createTime'),
    dataIndex: 'createTime',
    sorter: true,
    showSorterTooltip: false,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: t('sys.file.name'),
    component: 'Input',
    colProps: { span: 10 },
    componentProps: {
      autocomplete: 'off',
      placeholder: t('sys.common.pleaseInput') + t('sys.file.name'),
    },
  },
  {
    field: 'type',
    label: t('sys.file.type'),
    component: 'Select',
    componentProps: {
      options: [
        { label: 'Image', value: 'image' },
        { label: 'Video', value: 'video' },
        { label: 'Doc', value: 'doc' },
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
