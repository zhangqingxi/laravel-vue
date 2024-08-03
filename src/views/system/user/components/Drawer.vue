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
    <div
      style="margin-bottom: 5%; text-align: center"
      v-if="hasPermission(t('sys.menu.file_manage'), MenuPermissionModeEnum.UPLOAD)"
    >
      <CropperAvatar
        :uploadApi="uploadFile as any"
        :value="fileUrl"
        :showBtn="false"
        :size="2"
        :btnProps="{ preIcon: 'ant-design:cloud-upload-outlined' }"
        @change="updateAvatar"
        width="150"
      />
    </div>
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { uploadFile } from '@/api/sys/file';
  import { getRoleList } from '@/api/sys/role';
  import { ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '@/components/Form';
  import { formSchema } from '../data';
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { useI18n } from '@/hooks/web/useI18n';
  import { log } from '@/utils/log';
  import headerImg from '@/assets/images/header.jpg';
  import { CropperAvatar } from '@/components/Cropper';
  import { addUser, updateUser } from '@/api/sys/user';
  import { AddUserModel, UpdateUserInfoModel } from '@/api/sys/model/userModel';
  import { MenuPermissionModeEnum, hasPermission } from '@/utils/permission';

  defineOptions({ name: 'UserDrawer' });

  const { t } = useI18n();
  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref(true);
  const loading = ref(false);
  const fileId = ref(0);
  const fileUrl = ref(headerImg);

  const [registerForm, { resetFields, setFieldsValue, validate, updateSchema }] = useForm({
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
      // 预处理角色ID数组
      const { roles } = data.record;
      const roleIds = roles ? roles.map((role: { id: number }) => role.id) : [];
      setFieldsValue({
        ...data.record,
        roles: roleIds,
      });
      fileUrl.value = headerImg;
      if (data.record.avatar) {
        fileUrl.value = data.record.avatar;
      }
    }

    if (hasPermission(t('sys.menu.role_manage'), MenuPermissionModeEnum.VIEW)) {
      updateSchema([
        {
          field: 'roles',
          ifShow: true,
          componentProps: {
            api: getRoleList,
            showSearch: false,
            labelField: 'name',
            valueField: 'id',
            mode: 'multiple',
            maxTagCount: 3,
          },
        },
      ]);
    }
  });

  function updateAvatar({ src, data }) {
    log('upload file', src, data);
    fileId.value = data.id;
    fileUrl.value = data.url;
  }

  const getTitle = computed(() =>
    !unref(isUpdate) ? t('sys.user.addUser') : t('sys.user.updateUser'),
  );

  async function handleSubmit() {
    try {
      const data = await validate();
      setDrawerProps({ confirmLoading: true });
      loading.value = true;
      let result: any;
      let field = {
        email: data.email,
        nickname: data.nickname,
        password: data.password,
        phone: data.phone,
        registerTime: data.registerTime,
        status: data.status,
        roles: data.roles,
        account: data.account,
      };

      if (fileId.value > 0) {
        field['avatar'] = unref(fileId);
      }
      if (data.id) {
        field['id'] = data.id;
        result = await updateUser(field as UpdateUserInfoModel);
      } else {
        result = await addUser(field as AddUserModel);
      }

      if (result) {
        closeDrawer();
        emit('success');
      }
    } catch (error) {
      log('update user error', error);
    } finally {
      loading.value = false;
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
