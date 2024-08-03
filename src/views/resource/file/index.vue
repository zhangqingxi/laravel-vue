<template>
  <div>
    <BasicTable @register="registerTable" @edit-end="handleEditEnd">
      <template #toolbar>
        <Button
          type="primary"
          v-if="hasPermission(t('sys.menu.file_manage'), MenuPermissionModeEnum.UPLOAD)"
          @click="openFileUploadModal"
        >
          {{ t('sys.log.upload') }}
        </Button>
      </template>
      <template
        #footer
        v-if="hasPermission(t('sys.menu.user_manage'), MenuPermissionModeEnum.BATCH)"
      >
        <Button type="primary" width="120" :loading="loading" @click="handleBatch" class="ml-4">
          {{ t('sys.common.batch') + t('sys.common.action') }}
        </Button>

        <Select
          :options="options"
          style="width: 20%; padding-left: 1%"
          :allowClear="true"
          :dropdownMatchSelectWidth="true"
          v-model:value="batchValue"
          :placeholder="
            t('sys.common.pleaseChoose') + t('sys.common.batch') + t('sys.common.action')
          "
        />
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:cancel-line',
                onClick: handleUnassociation.bind(null, record),
                ifShow:
                  record.associations.length > 0 &&
                  hasPermission.bind(
                    null,
                    t('sys.menu.file_manage'),
                    MenuPermissionModeEnum.UPDATE,
                  ),
                tooltip: {
                  title: t('sys.common.unassociation'),
                  color: '#0960bd',
                },
                disabled: record.id === 1,
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                tooltip: {
                  title: t('sys.common.delete'),
                  color: '#0960bd',
                },
                popConfirm: {
                  title: t('sys.common.confirmDelete'),
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
                loading: loading,
                ifShow: hasPermission.bind(
                  null,
                  t('sys.menu.file_manage'),
                  MenuPermissionModeEnum.DELETE,
                ),
              },
              {
                icon: 'ant-design:download-outlined',
                tooltip: {
                  title: t('sys.common.download'),
                  color: '#0960bd',
                },
                loading: loading,
                // ifShow: hasPermission.bind(
                //   null,
                //   t('sys.menu.file_manage'),
                //   MenuPermissionModeEnum.DOWNLOAD,
                // ),
                onClick: handleDownloadByUrl.bind(null, record),
              },
            ]"
          />
        </template>

        <template v-else-if="column.key === 'url'">
          <TableImg
            v-if="record.type === 'image'"
            :size="60"
            :simpleShow="true"
            :imgList="[record.url]"
          />

          <Icon size="60" icon="ion:document-text-outline" v-else-if="record.type === 'text'" />
          <Icon size="60" icon="ion:film" v-else-if="record.type === 'video'" />
          <Icon size="60" icon="ion:volume-high-outline" v-else-if="record.type === 'audio'" />
          <Icon size="60" icon="ion:documents-outline" v-else-if="record.type === 'application'" />
        </template>

        <template v-else-if="column.key === 'associations'">
          <Button
            v-if="record.associations.length > 0"
            type="primary"
            @click="openCheckModal(record)"
          >
            {{ t('sys.common.look') + t('sys.common.content') }}
          </Button>
          <Button v-else type="primary">
            {{ t('sys.log.unassociation') }}
          </Button>
          <!-- <Flex gap="4px 0" vertical align="center">
            <template v-for="item in record.associations" :key="item['fileId']">
              <Tag color="green"> {{ item['modelName'] }}: {{ item['modelId'] }} </Tag>
            </template>
          </Flex> -->
        </template>
      </template>
    </BasicTable>
    <UploadModal
      :api="uploadFile as any"
      :maxSize="20"
      :maxNumber="10"
      :multiple="true"
      :loading="loading"
      @register="registerUploadModal"
      @delete="handleRemove"
      @change="handleChange"
    />
    <Modal @register="registerModal" :width="'60%'" />
  </div>
</template>
<script lang="ts" setup>
  import { ref, unref } from 'vue';

  import { BasicTable, useTable, TableAction, TableImg } from '@/components/Table';
  import { useModal } from '@/components/Modal';
  import UploadModal from '@/components/Upload/src/components/UploadModal.vue';
  import { Button, Select } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { columns, searchFormSchema } from './data';
  import { useI18n } from '@/hooks/web/useI18n';
  import { log } from '@/utils/log';
  import { GetUserInfoModel } from '@/api/sys/model/userModel';
  import { useMessage } from '@/hooks/web/useMessage';
  import { MenuPermissionModeEnum, hasPermission } from '@/utils/permission';
  import {
    BatchUpdateFile,
    DeleteFile,
    getFileList,
    UnusedFile,
    UpdateFile,
    uploadFile,
  } from '@/api/sys/file';
  import Modal from './components/Modal.vue';
  import { downloadByUrl } from '@/utils/file/download';
  // 上传modal
  const [registerUploadModal, { openModal: openUploadModal }] = useModal();

  defineOptions({ name: 'UserManagement' });
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const loading = ref(false);
  const options = ref([
    { label: t('sys.common.batch') + t('sys.common.unused'), value: 'unused' },
    { label: t('sys.common.batch') + t('sys.common.delete'), value: 'delete' },
  ]);
  const batchValue = ref();

  const [registerTable, { reload, getSelectRows }] = useTable({
    title: t('sys.file.fileList'),
    api: getFileList,
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
    },
    pagination: true,
    striped: false,
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: false,
    canResize: false,
    actionColumn: {
      width: 120,
      title: t('sys.common.action'),
      dataIndex: 'action',
      // slots: { customRender: 'action' },
    },
    rowSelection: {
      type: 'checkbox',
      getCheckboxProps: (record: GetUserInfoModel) => ({
        disabled: record.id === 1,
      }),
    },
    // 请求之前处理参数
    beforeFetch: (data) => {
      if (data.order) {
        data['sort'] = data.order === 'ascend' ? 'asc' : 'desc';
        delete data.order;
      }
      if (data.date) {
        data['start_date'] = data.date[0];
        data['end_date'] = data.date[1];
        delete data.date;
      }
      return data;
    },
  });
  const [registerModal, { openModal: openModal, setModalProps }] = useModal();

  async function handleEditEnd({ record, key, value }: Recordable) {
    try {
      loading.value = true;
      let data = { id: record.id };
      data[key] = value;
      const result = await UpdateFile(data);

      if (result) {
        reload();
      }
    } catch (error) {
      log('file update error', error);
    } finally {
      loading.value = false;
    }
  }

  function openFileUploadModal(record: Recordable) {
    openUploadModal(true, {
      record,
    });
  }

  function openCheckModal(record: Recordable) {
    openModal(true, {
      record,
    });
    setModalProps({ loading: true });
  }

  async function handleUnassociation(record: Recordable) {
    try {
      loading.value = true;
      // TODO custom api
      const result = await UnusedFile({
        id: record.id,
      });

      if (result) {
        reload();
      }
    } catch (error) {
      log('file delete error', error);
    } finally {
      loading.value = false;
    }
  }

  function handleRemove(record: Recordable) {
    if (record.status === 'success') {
      record.id = record.response.id;
      handleDelete(record);
    }
  }

  function handleDownloadByUrl(record: Recordable) {
    downloadByUrl({
      url: record.url,
      target: '_self',
      fileName: record.name,
    });
  }

  function handleChange(files) {
    log('file list', files);
    reload();
  }

  async function handleDelete(record: Recordable) {
    try {
      loading.value = true;
      // TODO custom api
      const result = await DeleteFile({
        id: record.id,
      });

      if (result) {
        reload();
      }
    } catch (error) {
      log('file delete error', error);
    } finally {
      loading.value = false;
    }
  }

  async function handleBatch() {
    try {
      loading.value = true;

      const data = getSelectRows();

      const ids = data.map((item) => item.id) as [];

      if (ids.length === 0) {
        createMessage.warn(
          t('sys.common.pleaseChoose') + t('sys.common.batch') + t('sys.common.action') + 'ID',
        );
        return;
      }

      if (!batchValue.value) {
        createMessage.warn(
          t('sys.common.pleaseChoose') + t('sys.common.batch') + t('sys.common.action'),
        );
        return;
      }

      const result = await BatchUpdateFile({ ids: ids, type: unref(batchValue.value) });

      if (result) {
        reload();
      }
    } catch (error) {
      log('batch update file', error);
    } finally {
      loading.value = false;
    }
  }
</script>
