<template>
  <div v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef">
      <!-- <FormItem name="account" class="enter-x">
        <Input
          class="fix-auto-fill"
          size="large"
          v-model:value="formData.account"
          :placeholder="t('sys.login.userName')"
        />
      </FormItem> -->
      <FormItem name="email" class="enter-x">
        <Input size="large" v-model:value="formData.email" :placeholder="t('sys.login.email')" />
      </FormItem>
      <FormItem name="code" class="enter-x">
        <CountdownInput
          size="large"
          v-model:value="formData.code"
          :placeholder="t('sys.login.emailCode')"
          :send-code-api="sendMail"
          :send-code-params="{
            email: formData.email,
            type: EmailType.RESET_PASSWORD,
          }"
        />
      </FormItem>
      <FormItem name="password" class="enter-x">
        <StrengthMeter
          size="large"
          v-model:value="formData.password"
          :placeholder="t('sys.login.password')"
        />
      </FormItem>
      <FormItem name="confirmPassword" class="enter-x">
        <InputPassword
          size="large"
          visibilityToggle
          v-model:value="formData.confirmPassword"
          :placeholder="t('sys.login.confirmPassword')"
        />
      </FormItem>

      <Button
        type="primary"
        class="enter-x"
        size="large"
        block
        @click="handleReset"
        :loading="loading"
      >
        {{ t('common.resetText') }}
      </Button>
      <Button size="large" block class="mt-4 enter-x" @click="handleBackLogin">
        {{ t('sys.login.backSignIn') }}
      </Button>
    </Form>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref, unref, computed } from 'vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { Form, Input, Button } from 'ant-design-vue';
  import { StrengthMeter } from '@/components/StrengthMeter';
  import { CountdownInput } from '@/components/CountDown';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useLoginState, useFormRules, useFormValid, LoginStateEnum } from './useLogin';
  import { sendMail, verifyMail } from '@/api/sys/mail';
  import { EmailType } from '@/api/sys/model/mailModel';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useDesign } from '@/hooks/web/useDesign';
  import { forgetPassword } from '@/api/sys/user';

  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { handleBackLogin, getLoginState } = useLoginState();

  const formRef = ref();
  const loading = ref(false);

  const formData = reactive({
    password: '',
    confirmPassword: '',
    email: '',
    code: '',
  });

  const { getFormRules } = useFormRules(formData);
  const { validForm } = useFormValid(formRef);
  // const { prefixCls } = useDesign('login');
  // const { createErrorModal } = useMessage();
  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.RESET_PASSWORD);

  async function handleReset() {
    const data = await validForm();
    if (!data) return;
    try {
      loading.value = true;
      //先执行验证code
      await verifyMail({
        email: data.email,
        type: EmailType.RESET_PASSWORD,
        code: data.code,
      });

      //提交数据
      const result = await forgetPassword({
        email: data.email,
        password: data.password,
      });

      if (result) {
        const form = unref(formRef);
        await form.resetFields();
        handleBackLogin();
      }
    } catch (error) {
      console.error('forget password: ' + error);
      // createErrorModal({
      //   title: t('sys.api.errorTip'),
      //   content: (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
      //   getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
      // });
    } finally {
      loading.value = false;
    }
  }
</script>
