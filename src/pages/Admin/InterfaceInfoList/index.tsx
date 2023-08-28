import InterfaceInfoColumns from '@/pages/Admin/InterfaceInfoList/components/InterfaceInfoColumns';
import {
  addInterfaceInfoUsingPOST,
  deleteInterfaceInfoUsingPOST,
  listInterfaceInfoByPageUsingGET,
  offlineInterfaceInfoUsingPOST,
  onlineInterfaceInfoUsingPOST,
  updateInterfaceInfoUsingPOST,
} from '@/services/qiApi-backend/interfaceInfoController';
import {PlusOutlined} from '@ant-design/icons';
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProTable} from '@ant-design/pro-components';
import '@umijs/max';
import {Button, message, Popconfirm} from 'antd';
import React, {useRef, useState} from 'react';
import MyModalForm from './components/MyModalForm';

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
    if (res.data && res.code === 0) {
      hide();
      message.success('添加成功');
      return true;
    }
  } catch (error: any) {
    hide();
    message.error('添加失败! ' + error.message);
    return false;
  }
};

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: API.InterfaceInfoUpdateRequest) => {
  const hide = message.loading('修改中');
  try {
    const res = await updateInterfaceInfoUsingPOST({...fields});
    if (res.data && res.code === 0) {
      hide();
      message.success('修改成功');
      return true;
    }
  } catch (error: any) {
    hide();
    message.error('修改失败' + error.message);
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
  const [loading, setLoading] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.InterfaceInfo>();

  /**
   * @en-US Update node
   * @zh-CN 发布
   *
   * @param record
   */
  const handleOnline = async (record: API.IdRequest) => {
    const hide = message.loading('发布中');
    if (!record) return true;
    try {
      const res = await onlineInterfaceInfoUsingPOST({
        id: record.id,
      });
      hide();
      if (res.data) {
        message.success('发布成功');
        actionRef.current?.reload();
      }
      return true;
    } catch (error: any) {
      hide();
      message.error(error.message);
      return false;
    }
  };

  /**
   * @en-US Update node
   * @zh-CN 下线
   *
   * @param record
   */
  const handleOffline = async (record: API.IdRequest) => {
    const hide = message.loading('下线中');
    if (!record) return true;
    try {
      const res = await offlineInterfaceInfoUsingPOST({
        id: record.id,
      });
      hide();
      if (res.data) {
        message.success('下线成功');
        actionRef.current?.reload();
      }
      return true;
    } catch (error: any) {
      hide();
      message.error(error.message);
      return false;
    }
  };

  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param record
   */
  const handleRemove = async (record: API.InterfaceInfo) => {
    const hide = message.loading('正在删除');
    if (!record) return true;
    try {
      const res = await deleteInterfaceInfoUsingPOST({
        id: record.id,
      });
      hide();
      if (res.data) {
        message.success('删除成功');
        actionRef.current?.reload();
      }
      return true;
    } catch (error: any) {
      hide();
      message.error('删除失败', error.message);
      return false;
    }
  };

  const confirm = async () => {
    await handleRemove(currentRow as API.InterfaceInfo);
  };

  const cancel = () => {
    message.success('取消成功');
  };

  const columns: ProColumns<API.InterfaceInfo>[] = [
    ...InterfaceInfoColumns,
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="update"
          onClick={() => {
            setCurrentRow(record);
            handleUpdateModalOpen(true);
          }}
        >
          修改
        </a>,
        record.status === 0 ? (
          <a
            type="text"
            key="online"
            onClick={() => {
              handleOnline(record);
            }}
          >
            审核通过
          </a>
        ) : null,
        record.status === 2 ? (
          <a
            type="text"
            key="offline"
            onClick={() => {
              handleOnline(record);
            }}
          >
            上线
          </a>
        ) : null,
        record.status === 1 ? (
          <a
            type="text"
            key="offline"
            onClick={() => {
              handleOffline(record);
            }}
          >
            下线
          </a>
        ) : null,


        <Popconfirm
          key={'Delete'}
          title="请确认是否删除该接口!"
          // description="请勿误删接口"
          onConfirm={confirm}
          onCancel={cancel}
          okText="Yes"
          cancelText="No"
        >
          <a
            key="Remove"
            onClick={async () => {
              setCurrentRow(record);
            }}
          >
            删除
          </a>
        </Popconfirm>,
      ],
    },
  ];
  return (
    <>
      <ProTable<API.InterfaceInfo, API.InterfaceInfo>
        headerTitle={'接口管理'}
        actionRef={actionRef}
        rowKey="key"
        loading={loading}
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
          setLoading(true)
          const res = await listInterfaceInfoByPageUsingGET({...params});
          if (res.data) {
            setLoading(false)
            return {
              data: res.data.records || [],
              success: true,
              total: res.data.total,
            };
          } else {
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
      />
      <MyModalForm
        title={"添加接口"}
        value={{}}
        open={() => {
          return createModalOpen;
        }}
        onOpenChange={handleModalOpen}
        onSubmit={async (value) => {
          const success = await handleAdd(value as API.InterfaceInfo);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => handleModalOpen(false)}
      />
      <MyModalForm
        title={"修改接口"}
        open={() => {
          return updateModalOpen;
        }}
        value={currentRow}
        onOpenChange={handleUpdateModalOpen}
        onSubmit={async (value) => {
          const success = await handleUpdate(value as API.InterfaceInfo);
          if (success) {
            handleUpdateModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => handleUpdateModalOpen(false)}
      />
    </>
  );
};
export default InterfaceInfoList;
