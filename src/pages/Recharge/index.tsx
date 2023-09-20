import React, {useEffect, useState} from 'react';
import {Button, Card, message, Spin, Tooltip} from "antd";
import ProCard, {CheckCard} from "@ant-design/pro-card";
import KunCoin from "@/components/Icon/KunCoin";
import {history, useModel} from "@umijs/max";
import {listProductInfoByPageUsingGET} from "@/services/qiApi-backend/productInfoController";
import wechat from "../../../public/assets/WeChat.jpg";
import {getLoginUserUsingGET} from "@/services/qiApi-backend/userController";
import Settings from "../../../config/defaultSettings";

const PayOrder: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [product, setProduct] = useState<API.ProductInfo[]>();
  const {initialState, setInitialState} = useModel('@@initialState');
  const {loginUser} = initialState || {}
  const [total, setTotal] = useState<any>("0.00");
  const [productId, setProductId] = useState<any>("");

  useEffect(() => {
    if (total === "0.00") {
      setProductId('')
    }
  }, [total])

  const loadData = async () => {
    const userdata = await getLoginUserUsingGET();
    if (userdata.data && userdata.code === 0) {
      if (initialState?.settings.navTheme === "light") {
        setInitialState({loginUser: userdata.data, settings: {...Settings, navTheme: "light"}})
      } else {
        setInitialState({loginUser: userdata.data, settings: {...Settings, navTheme: "realDark"}})
      }
    }
    setLoading(true)
    const res = await listProductInfoByPageUsingGET({});
    if (res.data && res.code === 0) {
      setProduct(res.data.records || [])
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <>
      <Spin spinning={loading}>
        <Card style={{minWidth: 360}}>
          <ProCard type={"inner"} headerBordered bordered tooltip={"用于平台接口调用"}
                   title={<strong>我的钱包</strong>}>
            <strong>坤币 : </strong><span
            style={{color: "red", fontSize: 18}}>{loginUser?.balance}</span>
          </ProCard>
          <br/>
          <Card type={"inner"} title={<strong>积分商城 💰️</strong>}>
            <ProCard wrap>
              <CheckCard.Group
                onChange={(checkedValue) => {
                  if (!checkedValue) {
                    setTotal("0.00")
                    return
                  }
                  setTotal(checkedValue)
                }}
              >
                {product && product.map((item) => (
                  <CheckCard
                    key={item.id}
                    onClick={() => {
                      setTotal(item.total)
                      setProductId(item.id)
                    }}
                    description={item.description}
                    extra={
                      <>
                        <h3
                          // @ts-ignore
                          style={{
                            color: "red",
                            fontSize: item.productType === "RECHARGEACTIVITY" ? 16 : 18,
                            fontWeight: "bold"
                          }
                          }>￥
                          {item.productType === "RECHARGEACTIVITY" ? "体验 " : null}
                          {/*// @ts-ignore*/}
                          {(item?.total) / 100}
                        </h3>
                      </>
                    }
                    // @ts-ignore
                    actions={<><KunCoin></KunCoin></>}
                    style={{width: 220, height: 330}}
                    title={<strong>💰 {item.addPoints} 坤币</strong>} value={item.total}/>
                ))}
              </CheckCard.Group>
            </ProCard>
            <br/>
            <ProCard style={{marginTop: -20}} layout={"center"}>
              <span>本商品为虚拟内容,用于平台接口调用,购买后不支持<strong
                style={{color: "red"}}>退换</strong>。确认支付表示您已阅读并接受<a
                target={"_blank"}
                href={"https://gitee.com/qimu6/statement/blob/master/%E6%9F%92%E6%9C%A8%E6%8E%A5%E5%8F%A3%E7%94%A8%E6%88%B7%E5%8D%8F%E8%AE%AE.md#%E6%9F%92%E6%9C%A8%E6%8E%A5%E5%8F%A3%E7%94%A8%E6%88%B7%E5%8D%8F%E8%AE%AE"}
                rel="noreferrer"> 用户协议 </a>
          ，如付款成功后10分钟后未到账，请联系站长微信：
             <Tooltip placement="bottom" title={<img src={wechat} alt="微信 code_nav" width="120"/>}>
               <a>aqimu66</a>
             </Tooltip>
            </span>
            </ProCard>
          </Card>
          <br/>
          <ProCard bordered headerBordered>
            <div style={{display: "flex", justifyContent: "flex-end", alignItems: "center", alignContent: "center"}}>
              <div style={{marginRight: "12px", fontWeight: "bold", fontSize: 18}}>实付</div>
              <div style={{marginRight: "20px", fontWeight: "bold", fontSize: 18, color: "red"}}>￥ {total / 100} 元
              </div>
              <Button style={{width: 100, padding: 5}} onClick={() => {
                if (!productId) {
                  message.error("请先选择积分规格哦")
                  return
                }
                message.loading("正在前往收银台,请稍后.....", 0.6)
                setTimeout(() => {
                  history.push(`/order/pay/${productId}`)
                }, 800)
              }} size={"large"} type={"primary"}>立即购买</Button>
            </div>
          </ProCard>
        </Card>
      </Spin>
    </>
  )
}

export default PayOrder;
