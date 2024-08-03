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
    title: t('sys.log.requestId'),
    dataIndex: 'requestId',
    width: 140,
  },
  // {
  //   title: t('sys.log.host'),
  //   dataIndex: 'host',
  //   width: 120,
  // },
  {
    title: t('sys.log.url'),
    dataIndex: 'url',
  },
  {
    title: t('sys.log.method'),
    dataIndex: 'method',
    width: 100,
  },
  {
    title: t('sys.log.ip'),
    dataIndex: 'ip',
    width: 140,
  },
  // {
  //   title: t('sys.log.ipAddress'),
  //   dataIndex: 'ipAddress',
  //   width: 120,
  // },
  {
    title: t('sys.log.content'),
    dataIndex: 'content',
    width: 140,
  },
  // {
  //   title: t('sys.log.headers'),
  //   dataIndex: 'headers',
  //   width: 40,
  // },

  // {
  //   title: t('sys.log.requestData'),
  //   dataIndex: 'requestData',
  //   width: 40,
  // },

  // {
  //   title: t('sys.log.responseData'),
  //   dataIndex: 'requestData',
  //   width: 40,
  // },

  // {
  //   title: t('sys.log.exceptionData'),
  //   dataIndex: 'exceptionData',
  //   width: 40,
  // },
  {
    title: t('sys.log.createTime'),
    dataIndex: 'createTime',
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
        { label: 'GET', value: 'get' },
        { label: 'POST', value: 'post' },
        { label: 'PUT', value: 'put' },
        { label: 'DELETE', value: 'delete' },
      ],
    },
    colProps: { span: 8 },
  },
];
