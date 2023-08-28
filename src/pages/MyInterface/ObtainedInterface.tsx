import React, {useRef, useState} from "react";
import {Button, message, Popconfirm} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {
  addInterfaceInfoUsingPOST,
  deleteInterfaceInfoUsingPOST,
  listInterfaceInfoByPageUsingGET,
  updateInterfaceInfoUsingPOST
} from "@/services/qiApi-backend/interfaceInfoController";
import {ActionType, ProColumns, ProTable} from "@ant-design/pro-components";
import InterfaceInfoColumns from "@/pages/Admin/InterfaceInfoList/components/InterfaceInfoColumns";
import MyModalForm from "@/pages/Admin/InterfaceInfoList/components/MyModalForm";

const ObtainedInterface: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.InterfaceInfo>();
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

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
          续费
        </a>,
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


  return <>
    <ProTable<API.InterfaceInfo, API.InterfaceInfo>
      headerTitle={'接口管理'}
      actionRef={actionRef}
      rowKey="key"
      search={{
        labelWidth: 120,
      }}

      request={async (params) => {
        const res = await listInterfaceInfoByPageUsingGET({...params});
        if (res.data) {
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
}

export default ObtainedInterface;
