<template>
  <div>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:backup-restore-line',
                popConfirm: {
                  title: t('sys.common.confirmRestore'),
                  placement: 'left',
                  confirm: handleAction.bind(null, 'Restore', record),
                },
                ifShow: hasPermission.bind(
                  null,
                  t('sys.menu.recycle_manage'),
                  MenuPermissionModeEnum.RESTORE,
                ),
                tooltip: {
                  title: t('sys.common.restore'),
                  color: '#0960bd',
                },
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: t('sys.common.confirmDelete'),
                  placement: 'left',
                  confirm: handleAction.bind(null, 'Delete', record),
                },
                tooltip: {
                  title: t('sys.common.delete'),
                  color: '#0960bd',
                },
                loading: loading,
                ifShow: hasPermission.bind(
                  null,
                  t('sys.menu.recycle_manage'),
                  MenuPermissionModeEnum.DELETE,
                ),
              },
            ]"
          />
        </template>
        <template v-else-if="column.key === 'content'">
          <Button type="primary" @click="openModalLoading(record)">
            {{ t('sys.common.look') + t('sys.common.content') }}
          </Button>
        </template>
      </template>
      <template
        #footer
        v-if="hasPermission(t('sys.menu.recycle_manage'), MenuPermissionModeEnum.BATCH)"
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

  import { BasicTable, useTable, TableAction } from '@/components/Table';

  // import { useDrawer } from '@/components/Drawer';
  // import Drawer from './components/Drawer.vue';
  import Modal from './components/Modal.vue';
  import { Button, Select } from 'ant-design-vue';
  import { columns, searchFormSchema } from './data';
  import { useI18n } from '@/hooks/web/useI18n';
  import { log } from '@/utils/log';
  import { MenuPermissionModeEnum, hasPermission } from '@/utils/permission';
  import { useModal } from '@/components/Modal';
  import { useMessage } from '@/hooks/web/useMessage';
  import {
    batchRecycleBin,
    deleteRecycleBin,
    getRecycleBinList,
    restoreRecycleBin,
  } from '@/api/sys/recycleBin';

  defineOptions({ name: 'RequestLogManagement' });
  const { t } = useI18n();
  const loading = ref(false);
  const [registerModal, { openModal: openModal, setModalProps }] = useModal();
  const { createMessage } = useMessage();
  const batchValue = ref();
  const options = ref([
    {
      label: t('sys.common.batch') + t('sys.common.restore'),
      value: 'restore',
    },
    {
      label: t('sys.common.batch') + t('sys.common.delete'),
      value: 'delete',
    },
  ]);
  function openModalLoading(record: Recordable) {
    openModal(true, {
      record,
    });
    setModalProps({ loading: true });
  }

  // const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerTable, { reload, getSelectRows }] = useTable({
    title: t('sys.recycleBin.recycleBinList'),
    api: getRecycleBinList,
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
    actionColumn: {
      width: 120,
      title: t('sys.common.action'),
      dataIndex: 'action',
      // slots: { customRender: 'action' },
    },
    rowSelection: {
      type: 'checkbox',
    },
    // 请求之前处理参数
    beforeFetch: (data) => {
      if (data.order) {
        data['sort'] = data.order === 'ascend' ? 'asc' : 'desc';
        delete data.order;
      }
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

      const data = getSelectRows();

      const ids = data.map((item) => item.id) as [];

      if (ids.length === 0) {
        createMessage.warn(
          t('sys.common.pleaseChoose') + t('sys.common.batch') + t('sys.common.action') + 'ID',
        );
        return;
      }

      if (!batchValue.value) {
        createMessage.warn(
          t('sys.common.pleaseChoose') + t('sys.common.batch') + t('sys.common.action'),
        );
        return;
      }

      const result = await batchRecycleBin({ ids: ids, type: unref(batchValue.value) });

      if (result) {
        reload();
      }
    } catch (error) {
      log('batch update recycle bin', error);
    } finally {
      loading.value = false;
    }
  }

  async function handleAction(type: string, record: Recordable) {
    try {
      loading.value = true;

      let result: any;
      if (type === 'Restore') {
        // TODO custom api
        result = await restoreRecycleBin({
          id: record.id,
        });
      } else {
        result = await deleteRecycleBin({
          id: record.id,
        });
      }

      if (result) {
        reload();
      }
    } catch (error) {
      log('recycle bin action error', error);
    } finally {
      loading.value = false;
    }
  }
</script>
