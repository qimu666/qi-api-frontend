import {Button, Modal, notification, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import gift from '@/../public/assets/Gift.png';
import ProCard from "@ant-design/pro-card";
import {Input} from "antd/lib";
import {SmileOutlined, SyncOutlined} from "@ant-design/icons";

export type Props = {
  open?: boolean;
  onCancel: () => void;
  invitationCode?: string
};

const SendGiftModal: React.FC<Props> = (props) => {
  const {open, onCancel, invitationCode} = props;
  const [api, contextHolder] = notification.useNotification();

  const randomTexts = ["注册即送100坤币💰奖励，Qi-API 接口开放平台为您提供稳定、安全、高效的接口调用服务！",
    "免费领取100坤币💰奖励，通过链接注册，Qi-API 接口开放平台为您提供稳定、安全、高效的接口调用服务！",
    "通过链接注册，即可获得100坤币💰奖励，Qi-API 接口开放平台为您提供稳定、安全、高效的接口调用服务！"];
  const [giftValue, setGiftValue] = useState(``);

  const generateRandomText = () => {
    const remainingTexts = randomTexts.filter(text => text !== giftValue);
    const randomIndex = Math.floor(Math.random() * remainingTexts.length);
    const randomText = remainingTexts[randomIndex];
    setGiftValue(randomText);
  };

  useEffect(() => {
    generateRandomText();
  }, []);

  const openNotification = () => {
    navigator.clipboard.writeText(giftValue + window.location.origin + '/' + invitationCode);
    api.open({
      message: '复制成功,快分享给好友吧',
      icon: <SmileOutlined style={{color: '#108ee9'}}/>,
    });
  };

  const handleClick = () => {
    generateRandomText();
  };

  return <Modal
    footer={null}
    centered
    open={open}
    width={800}
    onCancel={onCancel}
  >
    <ProCard direction={"column"}>
      <ProCard layout={"center"}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: 53,
          height: 53,
          borderRadius: '50%',
          backgroundColor: 'pink'
        }}>
          <img style={{width: 40}} src={gift}/>
        </div>
      </ProCard>
      <ProCard layout={"center"}>
        <div style={{fontSize: 18, marginTop: -15}}>邀请奖励</div>
      </ProCard>
      <ProCard>
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", alignContent: "center"}}>
          <div style={{marginRight: "20px", fontWeight: "bold"}}>每邀请一个用户注册，您和被邀请者都将获得
            “<strong>100坤币 </strong>💰奖励”
          </div>
          <div onClick={() => {
            handleClick()
          }
          } style={{marginRight: "20px", fontWeight: "bold", fontSize: 18, cursor: "pointer"}}>
            <Tooltip title={"刷新文案"}>
              <SyncOutlined/>
            </Tooltip>
          </div>
        </div>
      </ProCard>
      <ProCard layout={"center"}>
        <Input.TextArea
          style={{resize: 'none', height: 60, backgroundColor: "rgba(0,254,224,0.06)", marginTop: -15}}
          value={giftValue + window.location.origin + '/' + invitationCode}></Input.TextArea>
      </ProCard>
      <ProCard layout={"center"}>
        {contextHolder}
        <Button size={"large"} style={{marginTop: -15, backgroundColor: 'rgb(0,148,254)', color: 'white'}}
                onClick={() => openNotification()}>复制邀请文案</Button>
      </ProCard>
      <ProCard layout={"center"}>
        {contextHolder}
        <p style={{marginTop: -15, color: 'red'}}
        >异常刷取积分将永久封禁账号</p>
      </ProCard>
    </ProCard>
  </Modal>;
};

export default SendGiftModal;
