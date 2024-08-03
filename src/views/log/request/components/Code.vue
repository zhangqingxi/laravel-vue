<template>
  <div class="json-viewer">
    <div class="title" v-if="title">{{ title }}</div>
    <div class="code-block" ref="codeBlock"></div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, watch, nextTick, defineProps } from 'vue';

  const props = defineProps({
    jsonData: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  });

  const codeBlock = ref<HTMLDivElement | null>(null);

  const highlightJson = (json: string) => {
    if (!json) return '';

    return json
      .replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        (match) => {
          let cls = 'text-purple-600'; // string
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = 'text-red-600'; // key
            }
          } else if (/true|false/.test(match)) {
            cls = 'text-blue-600'; // boolean
          } else if (/null/.test(match)) {
            cls = 'text-gray-600'; // null
          } else {
            cls = 'text-green-600'; // number
          }
          return `<span class="${cls}">${match}</span>`;
        },
      )
      .replace(/\n/g, '<br>');
  };

  // 初始化渲染
  onMounted(async () => {
    if (props.jsonData && codeBlock.value) {
      await nextTick(); // 确保 DOM 更新完成
      updateCodeBlock();
    }
  });

  // 监听 jsonData 变化
  watch(
    () => props.jsonData,
    async (newJson) => {
      if (newJson && codeBlock.value) {
        await nextTick(); // 确保 DOM 更新完成
        updateCodeBlock();
      }
    },
    { immediate: false },
  );

  const updateCodeBlock = () => {
    const highlighted = highlightJson(props.jsonData);
    codeBlock.value!.innerHTML = `<pre>${highlighted}</pre>`;
  };
</script>
<style scoped>
  .json-viewer {
    margin: 1rem;
    padding: 1rem;
    border-radius: 5px;
    background-color: #f5f5f5;
  }

  .title {
    margin-bottom: 1rem;
    color: #333;
    font-size: 16px;
    font-weight: bold;
  }

  .code-block {
    /* padding: 1rem; */
    overflow-x: auto;

    /* border-radius: 5px; */

    /* background-color: #e8e8e8; */
    color: #333;
  }

  pre {
    margin: 0;
    padding: 0;
    font-family: monospace;
    font-size: 14px;
    line-height: 1.5;
    white-space: pre-wrap;
  }
</style>
