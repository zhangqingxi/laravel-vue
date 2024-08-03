<template>
  <Button v-bind="$attrs" :disabled="isStart" @click="handleStart" :loading="loading">
    {{ getButtonText }}
  </Button>
</template>

<script lang="ts" setup>
  import { ref, watchEffect, computed, unref } from 'vue';
  import { Button } from 'ant-design-vue';
  import { useCountdown } from './useCountdown';
  import { isFunction } from '@/utils/is';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useMessage } from '@/hooks/web/useMessage';
  import { sendMailParams } from '@/api/sys/model/mailModel';

  defineOptions({ name: 'CountButton' });

  const props = defineProps({
    value: { type: [Object, Number, String, Array] },
    count: { type: Number, default: 60 },
    beforeStartFunc: {
      type: Function as PropType<(params: sendMailParams) => Promise<boolean>>,
      default: null,
    },
    funcParams: { type: Object as PropType<sendMailParams>, default: () => ({}) },
  });

  const { t } = useI18n();
  const loading = ref(false);
  const { currentCount, isStart, start, reset } = useCountdown(props.count);

  const getButtonText = computed(() => {
    return !unref(isStart)
      ? t('component.countdown.normalText')
      : t('component.countdown.sendText', [unref(currentCount)]);
  });

  watchEffect(() => {
    if (props.value === undefined) {
      reset();
    }
  });

  async function handleStart() {
    const { beforeStartFunc, funcParams } = props;
    if (beforeStartFunc && isFunction(beforeStartFunc)) {
      const { createMessage } = useMessage();
      if (!funcParams?.email) {
        createMessage.error(t('sys.login.emailRequired'));
        return;
      }
      loading.value = true;
      try {
        const result = (await beforeStartFunc(funcParams)) as boolean;
        if (result) {
          start();
        }
      } catch (error) {
        console.error('send email:', error);
      } finally {
        loading.value = false;
      }
    } else {
      start();
    }
  }
</script>
