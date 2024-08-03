<template>
  <div>
    <BasicTable @register="registerTable" @fetch-success="onFetchSuccess">
      <template #toolbar>
        <Button
          type="primary"
          v-if="hasPermission(t('sys.menu.user_manage'), MenuPermissionModeEnum.ADD)"
          @click="handleCreate"
        >
          {{ t('sys.user.userAdd') }}
        </Button>
      </template>
      <template
        #footer
        v-if="hasPermission(t('sys.menu.user_manage'), MenuPermissionModeEnum.BATCH)"
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

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
                ifShow: hasPermission.bind(
                  null,
                  t('sys.menu.user_manage'),
                  MenuPermissionModeEnum.UPDATE,
                ),
                tooltip: {
                  title: t('sys.common.update'),
                  color: '#0960bd',
                },
                disabled: record.id === 1,
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: t('sys.common.confirmDelete'),
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
                tooltip: {
                  title: t('sys.common.delete'),
                  color: '#0960bd',
                },
                loading: loading,
                ifShow: hasPermission.bind(
                  null,
                  t('sys.menu.user_manage'),
                  MenuPermissionModeEnum.DELETE,
                ),
                disabled: record.id === 1,
              },
            ]"
          />
        </template>

        <template v-else-if="column.key === 'avatar'">
          <Avatar :size="60" :src="record.avatar" />
        </template>

        <template v-else-if="column.key === 'roles'">
          <Flex gap="4px 0" vertical align="center">
            <template v-for="item in record.roles" :key="item['id']">
              <Tag color="green"> {{ item['name'] }} </Tag>
            </template>
          </Flex>
        </template>

        <template v-else-if="column.key === 'status'">
          <Switch
            :loading="loading"
            :checkedChildren="t('sys.user.enable')"
            :checked="record.status === 1"
            :unCheckedChildren="t('sys.user.disable')"
            :disabled="record.id === 1 || record.account === 'admin'"
            :onChange="handleChangeStatus.bind(null, record)"
          />
        </template>
      </template>
    </BasicTable>
    <Drawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { nextTick, ref, unref } from 'vue';

  import { BasicTable, useTable, TableAction } from '@/components/Table';

  import { useDrawer } from '@/components/Drawer';
  import Drawer from './components/Drawer.vue';
  import { Avatar, Tag, Switch, Button, Select, Flex } from 'ant-design-vue';
  import { columns, searchFormSchema } from './data';
  import { useI18n } from '@/hooks/web/useI18n';
  import { log } from '@/utils/log';
  import { BatchUpdateUser, deleteUser, getUserList, updateUser } from '@/api/sys/user';
  import { GetUserInfoModel } from '@/api/sys/model/userModel';
  import { useMessage } from '@/hooks/web/useMessage';
  import { MenuPermissionModeEnum, hasPermission } from '@/utils/permission';
  import { closeWebsocket } from '@/utils/websocket';

  defineOptions({ name: 'UserManagement' });
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const loading = ref(false);
  const options = ref([
    { label: t('sys.common.batch') + t('sys.common.enable'), value: 'enable' },
    { label: t('sys.common.batch') + t('sys.common.disable'), value: 'disable' },
    { label: t('sys.common.batch') + t('sys.common.delete'), value: 'delete' },
  ]);
  const batchValue = ref();

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerTable, { reload, expandAll, getSelectRows }] = useTable({
    title: t('sys.user.userList'),
    api: getUserList,
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
      width: 100,
      title: t('sys.common.action'),
      dataIndex: 'action',
      // slots: { customRender: 'action' },
    },
    rowSelection: {
      type: 'checkbox',
      getCheckboxProps: (record: GetUserInfoModel) => ({
        disabled: record.id === 1,
      }),
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

  function handleCreate() {
    openDrawer(true, {
      isUpdate: false,
    });
  }

  function handleEdit(record: Recordable) {
    openDrawer(true, {
      record,
      isUpdate: true,
    });
  }

  async function handleDelete(record: Recordable) {
    try {
      loading.value = true;
      // TODO custom api
      const result = await deleteUser({
        id: record.id,
      });

      if (result) {
        reload();
      }
    } catch (error) {
      log('delete user error', error);
    } finally {
      loading.value = false;
    }
  }

  function handleSuccess() {
    reload();
  }

  function onFetchSuccess() {
    // 演示默认展开所有表项
    nextTick(expandAll);
  }

  async function handleChangeStatus(record: any, status: any): Promise<void> {
    try {
      loading.value = true;

      status = status ? 1 : 0;

      const result = await updateUser({ id: record.id, status: status });

      if (result) {
        record.status = status;
      }
    } catch (error) {
      log('update user info', error);
    } finally {
      loading.value = false;
    }
  }

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

      const result = await BatchUpdateUser({ ids: ids, type: unref(batchValue.value) });

      if (result) {
        reload();
      }
    } catch (error) {
      log('batch update user info', error);
    } finally {
      loading.value = false;
    }
  }
</script>
