<template>
  <div :class="`${prefixCls}`">
    <div :class="`${prefixCls}-avatar`">
      <CropperAvatar
        :uploadApi="uploadFile as any"
        :value="avatar"
        :showBtn="false"
        :btnProps="{ preIcon: 'ant-design:cloud-upload-outlined' }"
        @change="updateAvatar"
        width="150"
      />
    </div>

    <BasicForm @register="register" />

    <div :class="`${prefixCls}-submit`">
      <Button type="primary" class="enter-x" size="large" @click="handleSubmit" :loading="loading">
        {{ t('sys.user.updateUserInfo') }}
      </Button>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { Button } from 'ant-design-vue';
  import { uploadFile } from '@/api/sys/file';
  import { CropperAvatar } from '@/components/Cropper';
  import { computed, onMounted, ref, unref } from 'vue';
  import headerImg from '@/assets/images/header.jpg';
  import { useUserStore } from '@/store/modules/user';
  import { BasicForm, useForm } from '@/components/Form';
  import { userSchemas } from './data';
  import { useI18n } from '@/hooks/web/useI18n';
  import { updateUserInfo } from '@/api/sys/user';
  import { log } from '@/utils/log';

  const { t } = useI18n();

  //const ListItem = List.Item;

  const prefixCls = 'account-basic';

  const userStore = useUserStore();
  const fileId = ref(0);
  const fileUrl = ref('');
  const loading = ref(false);

  const [register, { setFieldsValue, validateFields, removeSchemaByField }] = useForm({
    labelWidth: 120,
    schemas: userSchemas,
    name: 'Info',
    showActionButtonGroup: false,
  });

  onMounted(async () => {
    removeSchemaByField(['code', 'oldPassword', 'newPassword', 'confirmNewPassword']);
    const userinfo = userStore.getUserInfo;
    // const data = await accountInfoApi();
    setFieldsValue(userinfo);
  });

  const avatar = computed(() => {
    const { avatar } = userStore.getUserInfo;
    return avatar || headerImg;
  });

  function updateAvatar({ data }) {
    // userinfo.avatar = src;
    // userStore.setUserInfo(userinfo);
    fileId.value = data.id;
    fileUrl.value = data.url;
  }

  // function handleSubmit() {
  // createMessage.success('更新成功！');
  // }

  async function handleSubmit() {
    try {
      const data = await validateFields();
      loading.value = true;

      const field = { nickname: data.nickname };

      if (fileId.value !== 0) {
        field['avatar'] = unref(fileId);
      }
      const result = await updateUserInfo(field);

      if (result) {
        //更新缓存
        const userinfo = userStore.getUserInfo;
        if (fileId.value !== 0) {
          userinfo.avatar = unref(fileUrl);
        }
        userinfo.nickname = data.nickname;
        userStore.setUserInfo(userinfo);
      }
    } catch (error) {
      log('update user info', error);
    } finally {
      loading.value = false;
    }
  }
</script>
<style lang="less">
  .account-basic {
    &-avatar {
      display: block;
      margin-right: 10%;
      margin-bottom: 15px;
      border-radius: 50%;
      text-align: center;
    }

    &-submit {
      margin-right: 10%;
      text-align: center;
    }
  }
</style>
