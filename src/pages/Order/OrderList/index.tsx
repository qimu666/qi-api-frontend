import {ActionType, ProColumns} from '@ant-design/pro-components';
import React, {useRef, useState} from "react";
import {
  closedProductOrderUsingPOST,
  deleteProductOrderUsingPOST,
  listProductOrderByPageUsingGET
} from "@/services/qiApi-backend/orderController";
import {ProTable} from "@ant-design/pro-table/lib";
import {message, Popconfirm} from "antd";
import OrderColumns from "@/pages/Order/Columns/OrderColumns";
import {history} from "@@/core/history";

export default () => {
  const [loading, setLoading] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.ProductOrderVo>();
  /**
   *  Delete node
   * @zh-CN 正在取消订单
   *
   * @param record
   */
  const handleClosed = async (record: API.ProductOrderVo) => {
    const hide = message.loading('正在取消订单');
    if (!record) return true;
    try {
      const res = await closedProductOrderUsingPOST({
        orderNo: record.orderNo
      });
      hide();
      if (res.data) {
        message.success('取消订单成功');
        actionRef.current?.reload();
      }
      return true;
    } catch (error: any) {
      hide();
      message.error('取消订单失败', error.message);
      return false;
    }
  };
  /**
   *  Delete node
   * @zh-CN 正在取消订单
   *
   * @param record
   */
  const handleDelete = async (record: API.ProductOrderVo) => {
    const hide = message.loading('正在删除订单');
    if (!record) return true;
    try {
      const res = await deleteProductOrderUsingPOST({
        id: record.id
      });
      hide();
      if (res.data) {
        message.success('删除订单成功');
        actionRef.current?.reload();
      }
      return true;
    } catch (error: any) {
      hide();
      message.error('删除订单失败', error.message);
      return false;
    }
  };

  const toPay = (record: API.ProductOrderVo) => {
    if (record.payType === "WX") {
      if (!record.codeUrl) {
        message.error("订单获取失败")
        return
      }
      // 判断是否为手机设备
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = record.codeUrl
      } else {
        message.loading("正在前往收银台,请稍后.....", 0.6)
        setTimeout(() => {
          history.push(`/order/pay/${record.id}?codeUrl=${record?.codeUrl?.trim()}&payType=${record?.payType?.trim()}`)
        }, 800)
      }
    } else {
      message.loading("正在前往收银台,请稍后....")
      setTimeout(() => {
        if (!record.formData) {
          message.error("订单获取失败")
          return
        }
        document.write(record.formData);
        setLoading(false)
      }, 2000)
    }
  }
  const deleteConfirm = async () => {
    await handleDelete(currentRow as API.ProductOrderVo);
  };
  const closedConfirm = async () => {
    await handleClosed(currentRow as API.ProductOrderVo);
  };
  const orderColumns: ProColumns<API.ProductOrderVo>[] = [
    ...OrderColumns, {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="SUCCESS"
          onClick={() => {
            location.href = `/order/info/${record.id}`
          }}
        >
          查看
        </a>,
        record?.status !== "NOTPAY" &&
        <Popconfirm
          key={'Delete'}
          title="请确认是否删除该订单!"
          onConfirm={deleteConfirm}
          okText="Yes"
          cancelText="No"
        >
          <a
            key="SUCCESS"
            style={{color: "red"}}
            onClick={async () => {
              setCurrentRow(record);
            }}
          >
            删除
          </a>
        </Popconfirm>,
        record.status === "NOTPAY" && (
          <>
            <a
              key="Pay"
              onClick={() => {
                toPay(record)
              }
              }
            >
              付款
            </a>
            <Popconfirm
              key={'Closed'}
              title="请确认是否取消该订单!"
              onConfirm={closedConfirm}
              okText="Yes"
              cancelText="No"
            >
              <a
                key="Closed"
                style={{color: "rgba(150,151,153,0.76)"}}
                onClick={async () => {
                  setCurrentRow(record);
                }}
              >
                取消
              </a>
            </Popconfirm>
          </>
        ),
      ],
    },
  ]

  return (
    <ProTable<API.ProductOrderVo>
      loading={loading}
      rowKey="name"
      actionRef={actionRef}
      columns={orderColumns}
      pagination={{defaultPageSize: 10}}
      request={async (params) => {
        setLoading(true)
        const res = await listProductOrderByPageUsingGET({...params});
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
    />
  );
};
