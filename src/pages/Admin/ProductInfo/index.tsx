import {PlusOutlined} from '@ant-design/icons';
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {ProTable} from '@ant-design/pro-components';
import '@umijs/max';
import {Button, Card, message, Popconfirm, Watermark} from 'antd';
import React, {useRef, useState} from 'react';
import ModalForm from "@/pages/Admin/components/ModalForm";
import ProductInfoModalFormColumns, {ProductInfoColumns} from "@/pages/Admin/components/ProductInfoColumns";
import {
  addProductInfoUsingPOST,
  deleteProductInfoUsingPOST,
  listProductInfoByPageUsingGET,
  updateProductInfoUsingPOST
} from "@/services/qiApi-backend/productInfoController";
import {useModel} from "@umijs/max";

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.ProductInfoAddRequest) => {
  const hide = message.loading('正在添加');
  try {
    const res = await addProductInfoUsingPOST({
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
const handleUpdate = async (fields: API.ProductInfoUpdateRequest) => {
  const hide = message.loading('修改中');
  try {
    const res = await updateProductInfoUsingPOST({...fields});
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

const ProductInfoList: React.FC = () => {

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
  const {initialState} = useModel("@@initialState");
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.InterfaceInfo>();

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
      const res = await deleteProductInfoUsingPOST({
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
    ...ProductInfoColumns,
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
        <Popconfirm
          key={'Delete'}
          title="请确认是否删除该商品!"
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
    <Card>
      {/*// @ts-ignore*/}
      <Watermark content={['柒木接口', initialState?.loginUser?.userAccount]}>
        <ProTable<API.InterfaceInfo>
          headerTitle={'商品管理'}
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
            const res = await listProductInfoByPageUsingGET({...params});
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
          title={"添加商品"}
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
          columns={ProductInfoModalFormColumns} width={"480px"}
          size={"large"}
        />
        <ModalForm
          title={"修改商品信息"}
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
          columns={ProductInfoModalFormColumns} width={"480px"}
          size={"large"}
        />
      </Watermark>
    </Card>
  );
};
export default ProductInfoList;
