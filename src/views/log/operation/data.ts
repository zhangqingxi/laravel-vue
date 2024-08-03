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
    title: t('sys.log.adminID'),
    dataIndex: 'adminId',
    width: 80,
  },
  {
    title: t('sys.log.url'),
    dataIndex: 'url',
  },
  {
    title: t('sys.log.method'),
    dataIndex: 'method',
    width: 120,
  },
  {
    title: t('sys.log.tableName'),
    dataIndex: 'tableName',
    width: 220,
  },
  {
    title: t('sys.log.tableId'),
    dataIndex: 'tableId',
    width: 120,
  },

  {
    title: t('sys.log.ip'),
    dataIndex: 'ip',
    width: 120,
  },
  {
    title: t('sys.log.content'),
    dataIndex: 'content',
    width: 140,
  },
  {
    title: t('sys.log.createTime'),
    dataIndex: 'createTime',
    width: 180,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'date',
    label: t('sys.common.rangeDate'),
    component: 'RangePicker',
    colProps: { span: 8 },
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
    },
  },
  {
    field: 'method',
    label: t('sys.log.method'),
    component: 'Select',
    componentProps: {
      options: [
        // { label: 'GET', value: 'get' },
        { label: 'POST', value: 'post' },
        { label: 'PUT', value: 'put' },
        { label: 'DELETE', value: 'delete' },
      ],
    },
    colProps: { span: 8 },
  },
];
