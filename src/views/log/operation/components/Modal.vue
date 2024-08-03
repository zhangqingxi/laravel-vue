<template>
  <BasicModal v-bind="$attrs" destroyOnClose @register="register" :title="t('sys.log.content')">
    <JsonViewer :jsonData="info.content" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useI18n } from '@/hooks/web/useI18n';
  import JsonViewer from './Code.vue';

  const { t } = useI18n();

  const info = ref({
    content: '',
  });

  const [register, { setModalProps }] = useModalInner(async (data) => {
    info.value = {
      content: JSON.stringify(JSON.parse(data.record.content), null, 2),
    };
    setModalProps({ loading: false });
  });
</script>
