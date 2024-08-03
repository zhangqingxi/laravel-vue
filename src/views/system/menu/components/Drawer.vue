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
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '@/components/Form';
  import { formSchema } from '../data';
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { updateMenu } from '@/api/sys/menu';
  import { useI18n } from '@/hooks/web/useI18n';
  import { log } from '@/utils/log';

  defineOptions({ name: 'MenuDrawer' });

  const { t } = useI18n();
  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref(true);
  const loading = ref(false);

  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 100,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { lg: 12, md: 24 },
  });

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      setFieldsValue({
        ...data.record,
      });
    }
    // const treeData = await getMenuList();
    // updateSchema({
    //   field: 'parentMenu',
    //   componentProps: { treeData },
    // });
  });

  const getTitle = computed(() =>
    !unref(isUpdate) ? t('sys.menu.addMenu') : t('sys.menu.updateMenu'),
  );

  async function handleSubmit() {
    try {
      const data = await validate();
      setDrawerProps({ confirmLoading: true });
      loading.value = true;
      // TODO custom api
      const result = await updateMenu({
        sort: data.sort,
        icon: data.icon,
        id: data.id,
      });

      if (result) {
        closeDrawer();
        emit('success');
      }
    } catch (error) {
      log('update menu error', error);
    } finally {
      loading.value = false;
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
