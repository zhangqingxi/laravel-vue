<template>
  <div>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'method'">
          <Flex gap="4px 0" vertical align="center">
            <Tag color="green" v-if="record.method === 'GET'"> {{ record.method }} </Tag>
            <Tag color="orange" v-else-if="record.method === 'POST'"> {{ record.method }} </Tag>
            <Tag color="magenta" v-else-if="record.method === 'PUT'"> {{ record.method }} </Tag>
            <Tag color="red" v-else-if="record.method === 'DELETE'"> {{ record.method }} </Tag>
          </Flex>
        </template>

        <template v-else-if="column.key === 'ip'">
          <Flex gap="4px 0" vertical align="center">
            {{ record.ip }}
            <Tag color="red"> {{ record.ipAddress }} </Tag>
          </Flex>
        </template>

        <template v-else-if="column.key === 'content'">
          <Button type="primary" @click="openModalLoading(record)">
            {{ t('sys.common.look') + t('sys.common.content') }}
          </Button>
        </template>

        <!-- <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:info-standard-line',
                onClick: handleView.bind(null, record),
                ifShow: hasPermission.bind(
                  null,
                  t('sys.menu.request_log'),
                  MenuPermissionModeEnum.VIEW,
                ),
                tooltip: t('sys.log.info'),
              },
            ]"
          />
        </template> -->
      </template>
      <template
        #footer
        v-if="hasPermission(t('sys.menu.request_log'), MenuPermissionModeEnum.DELETE)"
      >
        <Button type="primary" width="120" :loading="loading" @click="handleBatch" class="ml-4">
          {{ t('sys.common.batch') + t('sys.common.action') }}
        </Button>

        <Select
          :options="options"
          style="width: 20%; padding-left: 1%"
          :allowClear="true"
          :dropdownMatchSelectWidth="true"
          v-model:value="batchValue"
          :placeholder="
            t('sys.common.pleaseChoose') + t('sys.common.batch') + t('sys.common.action')
          "
        />
      </template>
    </BasicTable>
    <!-- <Drawer @register="registerDrawer" @success="handleSuccess" /> -->
    <Modal @register="registerModal" :width="'60%'" />
  </div>
</template>
<script lang="ts" setup>
  import { ref, unref } from 'vue';

  import { BasicTable, useTable } from '@/components/Table';

  // import { useDrawer } from '@/components/Drawer';
  // import Drawer from './components/Drawer.vue';
  import Modal from './components/Modal.vue';
  import { Avatar, Tag, Button, Flex, Select } from 'ant-design-vue';
  import { columns, searchFormSchema } from './data';
  import { useI18n } from '@/hooks/web/useI18n';
  import { log } from '@/utils/log';
  import { MenuPermissionModeEnum, hasPermission } from '@/utils/permission';
  import { getRequestLogList, removeRequestLog } from '@/api/sys/log';
  import { useModal } from '@/components/Modal';
  import { useMessage } from '@/hooks/web/useMessage';

  defineOptions({ name: 'RequestLogManagement' });
  const { t } = useI18n();
  const loading = ref(false);
  const [registerModal, { openModal: openModal, setModalProps }] = useModal();
  const { createMessage } = useMessage();
  const batchValue = ref();
  const options = ref([
    {
      label: t('sys.common.batch') + t('sys.common.remove') + 'GET' + t('sys.common.log'),
      value: 'get',
    },
    {
      label: t('sys.common.batch') + t('sys.common.remove') + 'POST' + t('sys.common.log'),
      value: 'post',
    },
    {
      label: t('sys.common.batch') + t('sys.common.remove') + 'PUT' + t('sys.common.log'),
      value: 'put',
    },
    {
      label: t('sys.common.batch') + t('sys.common.remove') + 'DELETE' + t('sys.common.log'),
      value: 'delete',
    },
    {
      label:
        t('sys.common.batch') + t('sys.common.remove') + t('sys.common.all') + t('sys.common.log'),
      value: 'all',
    },
  ]);
  function openModalLoading(record: Recordable) {
    openModal(true, {
      record,
    });
    setModalProps({ loading: true });
  }

  // const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerTable, { reload }] = useTable({
    title: t('sys.log.requestLogList'),
    api: getRequestLogList,
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
    },
    pagination: true,
    striped: false,
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: false,
    canResize: false,
    // actionColumn: {
    // width: 60,
    // title: t('sys.common.action'),
    // dataIndex: 'action',
    // slots: { customRender: 'action' },
    // },
    // rowSelection: {
    //   type: 'checkbox',
    // },
    // 请求之前处理参数
    beforeFetch: (data) => {
      if (data.date) {
        data['start_date'] = data.date[0];
        data['end_date'] = data.date[1];
        delete data.date;
      }
      return data;
    },
  });

  async function handleBatch() {
    try {
      loading.value = true;

      if (!batchValue.value) {
        createMessage.warn(
          t('sys.common.pleaseChoose') + t('sys.common.batch') + t('sys.common.action'),
        );
        return;
      }

      const result = await removeRequestLog({ type: unref(batchValue) });

      if (result) {
        reload();
      }
    } catch (error) {
      log('batch remove log', error);
    } finally {
      loading.value = false;
    }
  }
</script>
