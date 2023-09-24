import InterfaceInfoColumns, {InterfaceInfoModalFormColumns} from '@/pages/Admin/Columns/InterfaceInfoColumns';
import {
  addInterfaceInfoUsingPOST,
  deleteInterfaceInfoUsingPOST,
  listInterfaceInfoByPageUsingGET,
  offlineInterfaceInfoUsingPOST,
  onlineInterfaceInfoUsingPOST,
  updateInterfaceInfoAvatarUrlUsingPOST,
  updateInterfaceInfoUsingPOST,
} from '@/services/qiApi-backend/interfaceInfoController';
import {PlusOutlined} from '@ant-design/icons';
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {ProTable} from '@ant-design/pro-components';
import '@umijs/max';
import {Button, Card, message, Popconfirm} from 'antd';
import React, {useRef, useState} from 'react';
import ModalForm from "@/pages/Admin/Components/ModalForm";
import UploadModal from "@/components/UploadModal";

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
  const [modalOpen, setModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<API.InterfaceInfo>();

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
      if (fields) {
        if (fields.responseParams) {
          if (typeof fields.responseParams === "string") {
            const parseValue = JSON.parse(fields.responseParams);
            fields.responseParams = [...parseValue];
          }
        }else {
          fields.responseParams=[]
        }
        if (fields.requestParams) {
          if (typeof fields.requestParams === "string") {
            const parseValue = JSON.parse(fields.requestParams);
            fields.requestParams = [...parseValue];
          }
        }else {
          fields.requestParams=[]
        }

        const res = await updateInterfaceInfoUsingPOST({id: currentRow?.id, ...fields});
        if (res.data && res.code === 0) {
          hide();
          message.success('修改成功');
          return true;
        }
      }

    } catch (error: any) {
      hide();
      message.error('修改失败' + error.message);
      return false;
    }
  };


  /**
   * @en-US Update node
   * @zh-CN 更新接口图片
   *
   */
  const handleUpdateAvatar = async (url: string) => {
    const hide = message.loading('修改中');
    try {
      const res = await updateInterfaceInfoAvatarUrlUsingPOST(
        {
          id: currentRow?.id,
          avatarUrl: url
        }
      );
      if (res.data && res.code === 0) {
        hide();
        message.success('修改成功');
        actionRef.current?.reload()
        return true;
      }
    } catch (error: any) {
      hide();
      message.error('修改失败' + error.message);
      return false;
    }
  };

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
            key="auditing"
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
            key="online"
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
            style={{color: "red"}}
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
          onConfirm={confirm}
          onCancel={cancel}
          okText="Yes"
          cancelText="No"
        >
          <a
            key="Remove"
            style={{color: "red"}}
            onClick={async () => {
              setCurrentRow(record);
            }}
          >
            删除
          </a>
        </Popconfirm>,
        <a
          key="upload"
          onClick={async () => {
            setCurrentRow(record);
            setModalOpen(true)
          }}
        >
          更新图片
        </a>
      ],
    },
  ];
  return (
    <Card>
      <ProTable<API.InterfaceInfo>
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
        pagination={{defaultPageSize: 10}}
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
      <ModalForm
        title={"添加接口"}
        value={{}}
        open={() => {
          return createModalOpen;
        }}
        onOpenChange={handleModalOpen}
        onSubmit={async (value) => {
          const success = await handleAdd(value as API.InterfaceInfoAddRequest);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => handleModalOpen(false)}
        columns={InterfaceInfoModalFormColumns} width={"840px"}
      />
      <ModalForm
        title={"修改接口"}
        open={() => {
          return updateModalOpen;
        }}
        value={currentRow}
        onOpenChange={handleUpdateModalOpen}
        onSubmit={async (value) => {
          const success = await handleUpdate(value as API.InterfaceInfoUpdateRequest);
          if (success) {
            handleUpdateModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => handleUpdateModalOpen(false)}
        columns={InterfaceInfoModalFormColumns} width={"840px"}
      />
      <UploadModal
        url={currentRow?.avatarUrl}
        onCancel={() => setModalOpen(false)}
        open={modalOpen}
        onSubmit={handleUpdateAvatar}
      />
    </Card>
  );
};
export default InterfaceInfoList;
