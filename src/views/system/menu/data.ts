import { BasicColumn, FormSchema } from '@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import Icon from '@/components/Icon/Icon.vue';
import { useI18n } from '@/hooks/web/useI18n';

const { t } = useI18n();

export const columns: BasicColumn[] = [
  {
    title: t('sys.menu.name'),
    dataIndex: 'name',
    width: 200,
    align: 'left',
    customRender: ({ record }) => {
      return t('sys.menu.' + record.name);
    },
  },
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80,
    align: 'center',
    defaultHidden: true,
  },
  {
    title: t('sys.menu.icon'),
    dataIndex: 'icon',
    width: 50,
    customRender: ({ record }) => {
      return h(Icon, { icon: record.icon });
    },
  },
  {
    title: t('sys.menu.component'),
    dataIndex: 'component',
    customRender: ({ record }) => {
      if (record.pid === 0) {
        return 'LAYOUT';
      }
    },
  },
  {
    title: t('sys.menu.sort'),
    dataIndex: 'sort',
    width: 50,
  },
  {
    title: t('sys.menu.visible'),
    dataIndex: 'visible',
    width: 80,
    customRender: ({ record }) => {
      const visible = record.visible;
      const show = visible === 1;
      const color = show ? 'green' : 'red';
      const text = show ? t('sys.menu.show') : t('sys.menu.hidden');
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: t('sys.menu.status'),
    dataIndex: 'status',
    width: 80,
    customRender: ({ record }) => {
      const status = record.status;
      const enable = status === 1;
      const color = enable ? 'green' : 'red';
      const text = enable ? t('sys.menu.enable') : t('sys.menu.disable');
      return h(Tag, { color: color }, () => text);
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: t('sys.menu.name'),
    component: 'Input',
    colProps: { span: 8 },
    componentProps: {
      autocomplete: 'off',
    },
  },
  {
    field: 'status',
    label: t('sys.menu.status'),
    component: 'Select',
    componentProps: {
      options: [
        { label: t('sys.menu.enable'), value: 1 },
        { label: t('sys.menu.disable'), value: 0 },
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
    componentProps: {
      readonly: true,
      disabled: true,
      autocomplete: 'off',
    },
  },
  {
    field: 'name',
    label: t('sys.menu.name'),
    component: 'Input',
    componentProps: {
      readonly: true,
      disabled: true,
      autocomplete: 'off',
    },
  },

  {
    field: 'sort',
    label: t('sys.menu.sort'),
    component: 'InputNumber',
    required: true,
  },
  {
    field: 'icon',
    label: t('sys.menu.icon'),
    component: 'IconPicker',
    required: true,
  },

  {
    field: 'component',
    label: t('sys.menu.component'),
    component: 'Input',
    componentProps: {
      readonly: true,
      disabled: true,
      autocomplete: 'off',
    },
  },
  {
    field: 'visible',
    label: t('sys.menu.visible'),
    component: 'RadioButtonGroup',
    componentProps: {
      disabled: true,
      options: [
        { label: t('sys.menu.show'), value: 1 },
        { label: t('sys.menu.hidden'), value: 0 },
      ],
    },
  },
  {
    field: 'status',
    label: t('sys.menu.status'),
    component: 'RadioButtonGroup',
    componentProps: {
      options: [
        { label: t('sys.menu.enable'), value: 1 },
        { label: t('sys.menu.disable'), value: 0 },
      ],
      disabled: true,
    },
  },
];
