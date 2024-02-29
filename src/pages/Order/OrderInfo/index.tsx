import {history, useParams} from "@@/exports";
import React, {useEffect, useState} from "react";
import {Badge, Button, Card, Descriptions, message, Popconfirm, Spin, Tag, Tooltip} from "antd";
import {
  closedProductOrderUsingPOST,
  deleteProductOrderUsingPOST,
  getProductOrderByIdUsingGET
} from "@/services/qiApi-backend/orderController";
import {orderPayTypeEnum, orderStatusEnum} from "@/enum/commonEnum";
import ProCard from "@ant-design/pro-card";
import wechat from "../../../../public/assets/WeChat.jpg";

const formatDate = (dateString: any) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
export default () => {
  const [data, setData] = useState<API.ProductOrderVo>()
  const [loading, setLoading] = useState<boolean>(false)

  const params = useParams()
  const loadData = async () => {
    if (!params.id) {
      message.error("参数不存在")
      return
    }
    setLoading(true)
    const res = await getProductOrderByIdUsingGET({id: params.id})
    if (res.data && res.code === 0) {
      setData(res.data)

      setLoading(false)
    } else {
      setLoading(false)
    }
  }
  useEffect(() => {
    loadData()
  }, [])
  /**
   *  Delete node
   * @zh-CN 正在取消订单
   *
   * @param record
   */
  const handleClosed = async (record?: API.ProductOrderVo) => {
    const hide = message.loading('正在取消订单');
    if (!record) return true;
    try {
      const res = await closedProductOrderUsingPOST({
        orderNo: record.orderNo
      });
      hide();
      if (res.data) {
        message.success('取消订单成功');
        setTimeout(() => {
          location.href = "/order/list"
        }, 800)
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
  const handleDelete = async (record?: API.ProductOrderVo) => {
    const hide = message.loading('正在删除订单');
    if (!record) return true;
    try {
      const res = await deleteProductOrderUsingPOST({
        id: record.id
      });
      hide();
      if (res.data) {
        message.success('删除订单成功');
        setTimeout(() => {
          location.href = "/order/list"
        }, 800)
      }
      return true;
    } catch (error: any) {
      hide();
      message.error('删除订单失败', error.message);
      return false;
    }
  };

  const deleteConfirm = async () => {
    await handleDelete(data);
  };
  const closedConfirm = async () => {
    await handleClosed(data);
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
  return (
    <Spin spinning={loading}>
      <Card title={"订单信息"} extra={data?.status !== "NOTPAY" &&
        <Popconfirm
          key={'Delete'}
          title="请确认是否删除该订单!"
          onConfirm={deleteConfirm}
          okText="Yes"
          cancelText="No"
        >
          <Button
            key="SUCCESS"
            danger
            style={{color: "red"}}
            onClick={() => {
              handleDelete(data)
            }}
          >
            删除订单
          </Button>
        </Popconfirm>
      }>
        <Descriptions>
          <Descriptions.Item key={"orderName"} label={"订单名称"}>{data?.orderName}</Descriptions.Item>
          <Descriptions.Item key={"total"} label="订单金额 (元)">{data?.total}</Descriptions.Item>
          <Descriptions.Item key={"addPoints"} label="增加积分数量 (个)">{data?.addPoints}</Descriptions.Item>
          <Descriptions.Item key={"payType"} label="支付类型">
            <Tag
              color={orderPayTypeEnum[data?.payType ?? 'default']}>{data?.payType}</Tag>
          </Descriptions.Item>
          <Descriptions.Item key={"status"} label="订单状态">
            {data && data.status === "SUCCESS" ? (
              <Badge status="success" text={orderStatusEnum[data.status]}/>
            ) : null}
            {data && data.status === "CLOSED" ? (
              <Badge status="default" text={orderStatusEnum[data.status]}/>
            ) : null}
            {data && data.status === "NOTPAY" ? (
              <Badge status="error" text={orderStatusEnum[data.status]}/>
            ) : null}
          </Descriptions.Item>
          <Descriptions.Item key={"productType"} label="商品类别">
            {data && data.productType === "RECHARGEACTIVITY" && "充值活动"}
            {data && data.productType === "RECHARGE" && "积分充值"}
            {data && data.productType === "VIP" && "VIP会员"}
          </Descriptions.Item>
          <Descriptions.Item key={"expirationTime"}
                             label="过期时间">{formatDate(data?.expirationTime)}</Descriptions.Item>
          <Descriptions.Item key={"createTime"} label="创建时间">{formatDate(data?.createTime)}</Descriptions.Item>
          <Descriptions.Item key={"description"} label="商品描述">{data?.description}</Descriptions.Item>
          <Descriptions.Item key={"orderNo"} label="订单号">{data?.orderNo}</Descriptions.Item>
        </Descriptions>
      </Card>
      {
        data?.status === "NOTPAY" && (
          <>
            <br/>
            <Card>
              <div style={{display: "flex", alignItems: "center"}}>
                <Button style={{marginRight: 10, marginLeft: 10, height: 40}} block
                        onClick={() => {
                          toPay(data)
                        }}>前往支付</Button>
                <Popconfirm
                  key={'Closed'}
                  title="请确认是否取消该订单!"
                  onConfirm={closedConfirm}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button block style={{height: 40}}>取消订单</Button>
                </Popconfirm>
              </div>
            </Card>
          </>
        )
      }
      <ProCard style={{marginTop: 20}} layout={"center"}>
            <span> 本商品为虚拟内容，购买后不支持<strong
              style={{color: "red"}}>退换</strong>。确认支付表示您已阅读并接受<a
              target={"_blank"}
              href={"https://gitee.com/qimu6/statement/blob/master/%E6%9F%92%E6%9C%A8%E6%8E%A5%E5%8F%A3%E7%94%A8%E6%88%B7%E5%8D%8F%E8%AE%AE.md#%E6%9F%92%E6%9C%A8%E6%8E%A5%E5%8F%A3%E7%94%A8%E6%88%B7%E5%8D%8F%E8%AE%AE"}
              rel="noreferrer"> 用户协议 </a>
            如付款成功后10分钟后未到账，请联系站长微信：
            <Tooltip placement="bottom" title={<img src={wechat} alt="微信 code_nav" width="120"/>}>
              <a>aqimu66</a>
            </Tooltip>
          </span>
      </ProCard>
    </Spin>
  )
};
