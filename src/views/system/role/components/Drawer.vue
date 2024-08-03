<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="50%"
    :loading="loading"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #menu="{ model, field }">
        <BasicTree
          v-model:value="model[field]"
          :treeData="treeData"
          :fieldNames="{ title: 'name', key: 'id' }"
          :expandedKeys="expandedKeys"
          checkable
          toolbar
          :title="t('sys.menu.allocation')"
        />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '@/components/Form';
  import { formSchema } from '../data';
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { useI18n } from '@/hooks/web/useI18n';
  import { log } from '@/utils/log';
  import { MenuPermissionModeEnum, hasPermission } from '@/utils/permission';
  import { BasicTree, TreeItem } from '@/components/Tree';
  import { getMenuList } from '@/api/sys/menu';
  import { addRole, updateRole } from '@/api/sys/role';
  import { AddRoleModel, UpdateRoleModel } from '@/api/sys/model/roleModel';

  defineOptions({ name: 'RoleDrawer' });

  const { t } = useI18n();
  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref(true);
  const loading = ref(false);
  const treeData = ref<TreeItem[]>([]);
  const expandedKeys = ref<any>([]);

  const [registerForm, { resetFields, setFieldsValue, validate, updateSchema }] = useForm({
    labelWidth: 100,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { lg: 12, md: 24 },
  });

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });

    // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告
    if (
      unref(treeData).length === 0 &&
      hasPermission(t('sys.menu.menu_manage'), MenuPermissionModeEnum.VIEW)
    ) {
      const menuList = await getMenuList();

      treeData.value = transformMenuData(menuList);

      updateSchema([
        {
          field: 'menu',
          ifShow: true,
        },
      ]);
    }

    isUpdate.value = !!data?.isUpdate;

    if (unref(isUpdate)) {
      // 预处理菜单ID数组
      const { menus } = data.record;
      const menuIds = menus ? menus.map((menu: { id: number }) => menu.id) : [];
      expandedKeys.value = menuIds;
      // 预处理菜单ID数组
      setFieldsValue({
        ...data.record,
        menus: menuIds,
      });
    }
  });

  const getTitle = computed(() =>
    !unref(isUpdate) ? t('sys.role.roleAdd') : t('sys.role.roleUpdate'),
  );

  async function handleSubmit() {
    try {
      const data = await validate();
      setDrawerProps({ confirmLoading: true });
      loading.value = true;
      let result: any;
      let field = {
        name: data.name,
        status: data.status,
        remark: data.remark,
        menus: data.menus,
      };

      if (data.id) {
        field['id'] = data.id;
        result = await updateRole(field as UpdateRoleModel);
      } else {
        result = await addRole(field as AddRoleModel);
      }

      if (result) {
        closeDrawer();
        emit('success');
      }
    } catch (error) {
      log('update role error', error);
    } finally {
      loading.value = false;
      setDrawerProps({ confirmLoading: false });
    }
  }

  // 转换菜单数据，将 allChildren 字段重命名为 children
  function transformMenuData(data: any[]): TreeItem[] {
    return data.map((item) => {
      const transformedItem: TreeItem = {
        ...item,
        children: transformMenuData(item.allChildren || []),
        name: t('sys.menu.' + item.name),
      };

      // 将当前项的 id 添加到 expandedKeys 中
      // expandedKeys.value.push(item.id);

      return transformedItem;
    });
  }
</script>
