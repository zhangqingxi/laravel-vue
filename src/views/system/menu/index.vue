<template>
  <div>
    <BasicTable @register="registerTable" @fetch-success="onFetchSuccess">
      <!-- <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增菜单 </a-button>
      </template> -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
                ifShow: hasPermission.bind(
                  null,
                  t('sys.menu.menu_manage'),
                  MenuPermissionModeEnum.UPDATE,
                ),
                tooltip: {
                  title: t('sys.common.update'),
                  color: '#0960bd',
                },
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
                  t('sys.menu.menu_manage'),
                  MenuPermissionModeEnum.DELETE,
                ),
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <Drawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { nextTick, ref } from 'vue';

  import { BasicTable, useTable, TableAction } from '@/components/Table';

  import { useDrawer } from '@/components/Drawer';
  import Drawer from './components/Drawer.vue';

  import { columns, searchFormSchema } from './data';
  import { deleteMenu, getMenuList } from '@/api/sys/menu';
  import { useI18n } from '@/hooks/web/useI18n';
  import { log } from '@/utils/log';
  import { MenuPermissionModeEnum, hasPermission } from '@/utils/permission';

  defineOptions({ name: 'MenuManagement' });
  const { t } = useI18n();
  const loading = ref(false);

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerTable, { reload, expandAll }] = useTable({
    title: t('sys.menu.menuList'),
    api: getMenuList,
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
    },
    isTreeTable: true,
    pagination: false,
    striped: false,
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: false,
    canResize: false,
    childrenColumnName: 'allChildren',
    actionColumn: {
      width: 100,
      title: t('sys.common.action'),
      dataIndex: 'action',
      // slots: { customRender: 'action' },
    },
  });

  // function handleCreate() {
  //   openDrawer(true, {
  //     isUpdate: false,
  //   });
  // }

  function handleEdit(record: Recordable) {
    record.name = t('sys.menu.' + record.name);
    openDrawer(true, {
      record,
      isUpdate: true,
    });
  }

  async function handleDelete(record: Recordable) {
    try {
      loading.value = true;
      // TODO custom api
      const result = await deleteMenu({
        id: record.id,
      });

      if (result) {
        reload();
      }
    } catch (error) {
      log('delete menu error', error);
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
</script>
