<template>
  <div :class="`${prefixCls}-top`">
    <Tabs>
      <template v-for="item in achieveList" :key="item.key">
        <TabPane :tab="item.name">
          <component :is="tabs[item.component]" />
        </TabPane>
      </template>
    </Tabs>
  </div>
</template>

<script lang="ts" setup>
  import { Tabs } from 'ant-design-vue';
  import Password from './Password.vue';
  import Basic from './Basic.vue';
  import { achieveList } from './data';

  const TabPane = Tabs.TabPane;
  const tabs = {
    Basic,
    Password,
  };
  const prefixCls = 'account-center';
</script>
<style lang="less" scoped>
  .account-center {
    &-col:not(:last-child) {
      padding: 0 10px;

      &:not(:last-child) {
        border-right: 1px dashed rgb(206 206 206 / 50%);
      }
    }

    &-top {
      margin: 16px 16px 12px;
      padding: 10px;
      border-radius: 3px;
      background-color: @component-background;
    }
  }
</style>
