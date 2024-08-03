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
    title: t('sys.role.name'),
    dataIndex: 'name',
  },
  {
    title: t('sys.role.remark'),
    dataIndex: 'remark',
  },

  {
    title: t('sys.role.createTime'),
    dataIndex: 'createTime',
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('sys.user.status'),
    dataIndex: 'status',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'keyword',
    label: t('sys.common.keyword'),
    component: 'Input',
    colProps: { span: 10 },
    componentProps: {
      placeholder: t('sys.common.pleaseInput') + t('sys.role.name'),
      autocomplete: 'off',
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
    field: 'name',
    label: t('sys.role.name'),
    component: 'Input',
    required: true,
    componentProps: {
      autocomplete: 'off',
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

  {
    label: t('sys.role.remark'),
    field: 'remark',
    component: 'InputTextArea',
    required: true,
  },
  {
    label: ' ',
    field: 'menus',
    slot: 'menu',
  },
];
