import {Card, message, QRCode, Spin, Tooltip} from 'antd';
import React, {useEffect, useState} from 'react';
import {history} from '@umijs/max';
import {createOrderUsingPOST, queryOrderStatusUsingPOST} from "@/services/qiApi-backend/payController";
import {ArrowLeftOutlined} from "@ant-design/icons";
import wechat from "../../../public/assets/WeChat.jpg";
import WxPay from "@/components/Icon/WxPay";
import {useParams} from "@@/exports";


/**
 * 每个单独的卡片，为了复用样式抽成了组件
 * @param param0
 * @returns
 */
const PayOrder: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [order, setOrder] = useState<API.InterfaceOrderVo>();

  const [total, setTotal] = useState<any>("0.00");
  const [status, setStatus] = useState<string>('active');
  const params = useParams();

  const createOrder = async () => {
    setLoading(true)
    if (!params.id) {
      console.log(params)
      message.error('参数不存在');
      return;
    }
    setStatus("loading")
    const res = await createOrderUsingPOST({interfaceId: Number(params.id)})
    if (res.data) {
      setOrder(res.data)
      // @ts-ignore
      setTotal((res.data.total) / 100)
      setStatus("active")
    }
    setLoading(false)
  }
  const queryOrderStatus = async () => {
    const currentTime = new Date();
    const expirationTime = new Date(order?.expirationTime as any);
    if (currentTime > expirationTime) {
      setStatus("expired")
    }
    return await queryOrderStatusUsingPOST({orderNo: order?.orderNo})
  }


  useEffect(() => {
    createOrder()
  }, [])

  useEffect(() => {
    if (order && order.orderNo && order.codeUrl) {
      const intervalId = setInterval(async () => {
        // 定时任务逻辑
        const res = await queryOrderStatus()
        if (res.data && res.code === 0) {
          setLoading(true)
          clearInterval(intervalId);
          setTimeout(function () {
            message.success("支付成功")
            setLoading(false)
            history.push(`/interface_info/${params.id}`)
          }, 2000);
        } else {
          console.log("支付中...")
        }
      }, 3000);
      if (status === "expired") {
        clearInterval(intervalId);
      }
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [order, status])

  return (
    <>
      <Spin spinning={loading}>
        <Card title={<span style={{cursor: "pointer"}} onClick={() => {
          message.success("22")
        }}><ArrowLeftOutlined/> {"返回"}</span>}>
          <div style={{marginLeft: 10}}>
            <h2>{order?.orderName}</h2>
            <h3>{"获得300积分"}</h3>
          </div>
        </Card>
        <br/>
        <Card title={"支付二维码"} style={{minHeight: 400}}>

          <div>
            <div style={{
              width: 200,
              alignItems: "center",
              borderRadius: 4,
              justifyContent: "flex-start",
              height: 56,
              margin: "0 10px 16px",
              padding: "0 12px",
              border: "1px solid #1890ff",
              borderWidth: 1
            }}>
              <div style={{margin: 10, display: "flex", flexDirection: "row"}}>
                <WxPay/><span
                style={{
                  marginLeft: 8,
                  lineHeight: "1.5",
                  color: "#333",
                  fontSize: 20
                }}> 微信支付</span></div>
            </div>
          </div>
          <div style={{display: 'flex', justifyContent: 'center', justifyItems: 'center'}}>
            <QRCode
              errorLevel="H"
              size={240}
              value={order?.codeUrl || '-'}
              // @ts-ignore
              status={status}
              onRefresh={() => {
                createOrder()
              }}
            />
          </div>
          <div style={{
            color: "#f55f4e",
            fontSize: 20,
            display: 'flex',
            fontWeight: "bold",
            justifyContent: 'center',
            justifyItems: 'center'
          }}>
            ￥{total}
          </div>
          <br/>
          <div style={{display: 'flex', justifyContent: 'center', justifyItems: 'center'}}>
          <span>
            本商品为虚拟内容，购买后不支持<strong
            style={{color: "red"}}>退换</strong>。确认支付表示您已阅读并接受<a
            target={"_blank"}
            href={"https://gitee.com/qimu6/statement/blob/master/%E6%9F%92%E6%9C%A8%E6%8E%A5%E5%8F%A3%E7%94%A8%E6%88%B7%E5%8D%8F%E8%AE%AE.md#%E6%9F%92%E6%9C%A8%E6%8E%A5%E5%8F%A3%E7%94%A8%E6%88%B7%E5%8D%8F%E8%AE%AE"}
            rel="noreferrer"> 用户协议 </a>
          如付款成功后未收到商品，请联系站长微信：
             <Tooltip title={<img src={wechat} alt="微信 code_nav" width="120"/>}>
               <a>aqimu66</a>
             </Tooltip>
            </span>
          </div>
        </Card>
      </Spin>
    </>
  )
}

export default PayOrder;
