<template>
  <BasicModal v-bind="$attrs" destroyOnClose @register="register" :title="t('sys.log.content')">
    <JsonViewer :jsonData="info.headers" :title="t('sys.log.headers')" />
    <JsonViewer :jsonData="info.requestData" :title="t('sys.log.requestData')" />
    <JsonViewer :jsonData="info.responseData" :title="t('sys.log.responseData')" />
    <JsonViewer
      v-if="info.exceptionData"
      :jsonData="info.exceptionData"
      :title="t('sys.log.exceptionData')"
    />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useI18n } from '@/hooks/web/useI18n';
  import JsonViewer from './Code.vue';

  const { t } = useI18n();

  const info = ref({
    headers: '',
    requestData: '',
    responseData: '',
    exceptionData: '',
  });

  const [register, { setModalProps }] = useModalInner(async (data) => {
    info.value = {
      headers: JSON.stringify(JSON.parse(data.record.headers), null, 2),
      requestData: JSON.stringify(JSON.parse(data.record.requestData), null, 2),
      responseData: JSON.stringify(JSON.parse(data.record.responseData), null, 2),
      exceptionData: data.record.exceptionData
        ? JSON.stringify(JSON.parse(data.record.exceptionData), null, 2)
        : '',
    };
    setModalProps({ loading: false });
  });
</script>
