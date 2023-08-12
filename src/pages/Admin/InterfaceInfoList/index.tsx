import {PlusOutlined} from '@ant-design/icons';
import type {ActionType, ProColumns, ProDescriptionsItemProps} from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProForm,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import {Button, Drawer, message, Tag} from 'antd';
import React, {useRef, useState} from 'react';
import type {FormValueType} from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import {removeRule, updateRule} from "@/services/ant-design-pro/rule";
import {
  addInterfaceInfoUsingPOST,
  listInterfaceInfoByPageUsingGET
} from "@/services/qiApi-backend/interfaceInfoController";


const methodColorMap: any = {
  GET: 'blue',
  POST: 'red',
  PUT: 'green',
  DELETE: 'orange',
};

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.InterfaceInfoAddRequest) => {
  const hide = message.loading('正在添加');
  try {
    const res = await addInterfaceInfoUsingPOST({
      ...fields,
    });
    console.log(res, 'handleAdd')

    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('Configuring');
  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();
    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.RuleListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};
const InterfaceInfoList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const columns: ProColumns<API.InterfaceInfo>[] = [
    {
      title: '接口名称',
      dataIndex: 'name',
      copyable: true,
      valueType: 'text',
      ellipsis: true,
      key: 'name'
    },
    {
      title: '接口地址',
      dataIndex: 'url',
      valueType: 'text',
      ellipsis: true,
      copyable: true,
      key: 'url'
    },
    {
      title: '描述',
      dataIndex: 'description',
      valueType: 'textarea',
      copyable: true,
      ellipsis: true,
      key: 'description'
    },
    {
      title: '请求示例',
      dataIndex: 'requestExample',
      key: 'requestExample',
      valueType: 'text',
      copyable: true,
      ellipsis: true,
    }, {
      title: '请求头',
      dataIndex: 'requestHeader',
      valueType: 'text',
      ellipsis: true,
      copyable: true,
      key: 'requestHeader'
    },
    {
      title: '请求参数',
      dataIndex: 'requestParams',
      valueType: 'text',
      ellipsis: true,
      copyable: true,
      key: 'requestParams'
    },
    {
      title: '响应头',
      dataIndex: 'responseHeader',
      valueType: 'text',
      copyable: true,
      ellipsis: true,
      key: 'responseHeader'
    },
    {
      title: '状态',
      filters: true,
      onFilter: true,
      dataIndex: 'status',
      key: 'status',
      valueEnum: {
        0: {
          text: '已下线',
          status: 'Error',
        },
        1: {
          text: '已上线',
          status: 'Processing',
        },
      },
    },
    {
      title: '请求类型',
      dataIndex: 'method',
      valueType: 'text',
      key: 'method',
      render: (_, record) => (
        <Tag color={methodColorMap[record.method ?? 'default']}>{record.method}</Tag>
      ),
      valueEnum: {
        GET: {
          text: 'GET',
        },
        POST: {
          text: 'POST',
        },
        PUT: {
          text: 'PUT',
        },
        DELETE: {
          text: 'DELETE',
        },
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      key: 'updateTime',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      key: 'createTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          配置
        </a>,
        <a key="subscribeAlert" href="@/pages/Admin/InterfaceInfoList/index">
          订阅警报
        </a>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.InterfaceInfo, API.InterfaceInfo>
        headerTitle={'接口管理'}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined/> 新建
          </Button>,
        ]}
        request={async (params) => {
          const res = await listInterfaceInfoByPageUsingGET({...params})
          if (res.data) {
            return {
              data: res.data.records || [],
              success: true,
              total: res.data.total,
            }
          } else {
            return {
              data: [],
              success: false,
              total: 0,
            }
          }
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项 &nbsp;&nbsp;
              <span>
                服务调用次数总计 {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)} 万
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )}
      <ModalForm
        title={'添加接口'}
        width="740px"
        open={createModalOpen}
        autoFocusFirstInput
        onOpenChange={handleModalOpen}
        submitter={{
          render: (props, defaultDoms) => {
            return [
              ...defaultDoms,
              <Button
                key="extra-reset"
                onClick={() => {
                  props.reset();
                }}
              >
                重置
              </Button>,
            ];
          },
        }}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.InterfaceInfoAddRequest);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProForm.Group>
          <ProFormText
            label={'接口名称'}
            rules={[
              {
                required: true,
                message: '接口名称为必填项',
              },
            ]}
            width="md"
            name="name"
          />
          <ProFormText
            rules={[
              {
                required: true,
                message: '接口地址为必填项',
              },
            ]}
            label={'接口地址'}
            width="md"
            name="url"
          />
        </ProForm.Group>
        <ProFormRadio.Group
          rules={[{required: true, message: '接口请求方法为必填项'}]}
          name="method"
          layout="horizontal"
          label="请求方法"
          initialValue={'GET'}
          options={[
            {
              label: 'GET',
              value: 'GET',
            },
            {
              label: 'POST',
              value: 'POST',
            },
            {
              label: 'PUT',
              value: 'PUT',
            },
            {
              label: 'DELETE',
              value: 'DELETE',
            }
          ]}
        />
        <ProForm.Group>
          <ProFormTextArea
            label={'接口描述'}
            width="md"
            name="description"
          />
          <ProFormTextArea
            label={'请求参数'}
            width="md"
            name="requestParams"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormTextArea
            label={'响应头'}
            width="md"
            name="responseHeader"
          />
          <ProFormTextArea
            label={'请求头'}
            width="md"
            name="requestHeader"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormTextArea
            label={'请求示例'}
            width="md"
            name="requestExample"
          /></ProForm.Group>
      </ModalForm>
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        updateModalOpen={updateModalOpen}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.InterfaceInfo>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.InterfaceInfo>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};
export default InterfaceInfoList;
