<template>
  <div :class="`${prefixCls}`">
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
  import { onMounted, ref } from 'vue';
  import { useUserStore } from '@/store/modules/user';
  import { BasicForm, useForm } from '@/components/Form';
  import { userSchemas } from './data';
  import { useI18n } from '@/hooks/web/useI18n';
  import { verifyMail } from '@/api/sys/mail';
  import { EmailType } from '@/api/sys/model/mailModel';
  import { changePassword } from '@/api/sys/user';
  import { log } from '@/utils/log';

  const { t } = useI18n();

  //const ListItem = List.Item;

  const prefixCls = 'account-basic';

  const userStore = useUserStore();
  const loading = ref(false);

  const [register, { setFieldsValue, removeSchemaByField, validateFields }] = useForm({
    labelWidth: 120,
    schemas: userSchemas,
    name: 'Password',
    showActionButtonGroup: false,
  });

  onMounted(async () => {
    removeSchemaByField([
      'account',
      'phone',
      'nickname',
      'registerTime',
      'lastLoginTime',
      'lastLoginAddress',
    ]);
    const userinfo = userStore.getUserInfo;
    setFieldsValue(userinfo);
  });

  async function handleSubmit() {
    try {
      const data = await validateFields();
      loading.value = true;

      //先执行验证code
      await verifyMail({
        email: data.email,
        type: EmailType.CHANGE_PASSWORD,
        code: data.code,
      });

      //提交数据
      const result = await changePassword({
        email: data.email,
        newPassword: data.newPassword,
        oldPassword: data.oldPassword,
      });

      if (result) {
        //退出登录
        userStore.logout(true);
      }
    } catch (error) {
      log('update password error', error);
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
