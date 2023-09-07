import {history, useModel} from '@umijs/max';
import {Button, Descriptions, message, Modal, Spin, Tooltip, Upload, UploadFile, UploadProps} from 'antd';
import React, {useEffect, useState} from 'react';
import {RcFile} from "antd/es/upload";
import {EditOutlined, PlusOutlined, VerticalAlignBottomOutlined} from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import {
  getLoginUserUsingGET,
  updateUserUsingPOST,
  updateVoucherUsingPOST
} from "@/services/qiApi-backend/userController";
import Settings from '../../../../config/defaultSettings';
import Paragraph from "antd/lib/typography/Paragraph";
import ProCard from "@ant-design/pro-card";
import {requestConfig} from "@/requestConfig";
import {doDailyCheckInUsingPOST} from "@/services/qiApi-backend/dailyCheckInController";
import SendGiftModal from "@/components/Gift/SendGift";

export const valueLength = (val: any) => {
  return val && val.trim().length > 0
}
const UserInfo: React.FC = () => {
  const unloadFileTypeList = ["jpeg", "jpg", "svg", "png", "webp"]
  const {initialState, setInitialState} = useModel('@@initialState');
  const {loginUser} = initialState || {}
  const [previewOpen, setPreviewOpen] = useState(false);
  const [voucherLoading, setVoucherLoading] = useState<boolean>(false);
  const [dailyCheckInLoading, setDailyCheckInLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const handleCancel = () => setPreviewOpen(false);
  const [userName, setUserName] = useState<string | undefined>('');
  const [open, setOpen] = useState(false);

  const loadData = async () => {
    setLoading(true)
    const res = await getLoginUserUsingGET();
    if (res.data && res.code === 0) {
      setInitialState({loginUser: res.data, settings: Settings})
      const updatedFileList = [...fileList];
      if (loginUser && loginUser.userAvatar) {
        updatedFileList[0] = {
          // @ts-ignore
          uid: loginUser?.userAccount,
          // @ts-ignore
          name: loginUser?.userAvatar?.substring(loginUser?.userAvatar!.lastIndexOf('-') + 1),
          status: "success",
          percent: 100,
          url: loginUser?.userAvatar
        }
        setFileList(updatedFileList);
      }
      setUserName(loginUser?.userName)
      setLoading(false)
    }
  }

  useEffect(() => {
      loadData()

    },
    [])

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('-') + 1));
  };

  const uploadButton = () => {
    return (
      <div>
        <PlusOutlined/>
        <div style={{marginTop: 8}}>Upload</div>
      </div>
    );
  }

  const beforeUpload = async (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!unloadFileTypeList.concat(file.type)) {
      message.error('图片类型有误,请上传jpg/png/svg/jpeg/webp格式!');
    }
    const isLt2M = file.size / 1024 / 1024 < 1;
    if (!isLt2M) {
      message.error('文件大小不能超过 1M !');
    }
    return isJpgOrPng && isLt2M;
  };

  const updateVoucher = async () => {
    setVoucherLoading(true)
    const res = await updateVoucherUsingPOST();
    if (res.data && res.code === 0) {
      setInitialState({loginUser: res.data, settings: Settings})
      setTimeout(() => {
        message.success(`凭证更新成功`);
        setVoucherLoading(false)
      }, 800);
    }
  }

  const updateUserInfo = async () => {
    let avatarUrl = ''
    if (fileList && fileList[0] && valueLength(fileList[0].url)) {
      // @ts-ignore
      avatarUrl = fileList[0].url
    }
    const res = await updateUserUsingPOST({
      // @ts-ignore
      userAvatar: avatarUrl,
      id: loginUser?.id,
      userName: userName
    })
    if (res.data && res.code === 0) {
      setInitialState({loginUser: res.data, settings: Settings})
      message.success(`信息更新成功`);
    }
  }

  const props: UploadProps = {
    name: 'file',
    withCredentials: true,
    action: `${requestConfig.baseURL}api/file/upload?biz=user_avatar`,
    onChange: async function ({file, fileList: newFileList}) {
      const {response} = file;
      if (file.response && response.data) {
        const {data: {status, url}} = response
        const updatedFileList = [...fileList];
        if (response.code !== 0 || status === 'error') {
          message.error(`头像更新失败`);
          file.status = "error"
          updatedFileList[0] = {
            // @ts-ignore
            uid: loginUser?.userAccount,
            // @ts-ignore
            name: loginUser?.userAvatar?.substring(loginUser?.userAvatar!.lastIndexOf('-') + 1),
            status: "error",
            percent: 100
          }
          setFileList(updatedFileList);
          return
        }
        file.status = status
        updatedFileList[0] = {
          // @ts-ignore
          uid: loginUser?.userAccount,
          // @ts-ignore
          name: loginUser?.userAvatar?.substring(loginUser?.userAvatar!.lastIndexOf('-') + 1),
          status: status,
          url: url,
          percent: 100
        }
        setFileList(updatedFileList);
      } else {
        setFileList(newFileList);
      }
    },
    listType: "picture-circle",
    onPreview: handlePreview,
    fileList: fileList,
    beforeUpload: beforeUpload,
    maxCount: 1,
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
  };

  return (
    <Spin spinning={loading}>

      <ProCard
        type="inner"
        bordered
        direction="column"
      >
        <ProCard
          extra={<Button onClick={updateUserInfo}>提交修改</Button>
          }
          title={<strong>个人信息设置</strong>}
          type="inner"
          bordered
        >
          <Descriptions.Item>
            <ImgCrop
              rotationSlider
              quality={1}
              aspectSlider
              maxZoom={4}
              cropShape={"round"}
              zoomSlider
              showReset
            >
              <Upload {...props}>
                {fileList.length >= 1 ? undefined : uploadButton()}
              </Upload>
            </ImgCrop>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
              <img alt="example" style={{width: '100%'}} src={previewImage}/>
            </Modal>
          </Descriptions.Item>
          <Descriptions column={1}>
            <div>
              <h4>昵称：</h4>
              <Paragraph
                editable={
                  {
                    icon: <EditOutlined/>,
                    tooltip: '编辑',
                    onChange: (value) => {
                      setUserName(value)
                    }
                  }
                }
              >
                {userName}
              </Paragraph>
            </div>
            <div>
              <h4>我的id：</h4>
              <Paragraph
                copyable={valueLength(loginUser?.id)}
              >
                {loginUser?.id}
              </Paragraph>
            </div>
            <div>
              <Tooltip title={"邀请好友注册双方都可获得100积分"}>
                <h4>我的邀请码：</h4>
              </Tooltip>
              <Paragraph
                copyable={valueLength(loginUser?.invitationCode)}
              >
                {loginUser?.invitationCode}
              </Paragraph>
            </div>
          </Descriptions>
        </ProCard>
        <br/>
        <ProCard type={"inner"} bordered tooltip={"用于平台接口调用"} title={<strong>我的钱包</strong>}
                 extra={
                   <>
                     <Button onClick={() => {
                       history.push("/recharge/list")
                     }}>充值余额</Button>
                   </>
                 }
        >
          <strong>坤币 💰: </strong> <span
          style={{color: "red", fontSize: 18}}>{loginUser?.balance}</span>
          <br/>
          <strong>获取更多：</strong>
          <br/>
          <Button style={{marginRight: 10, marginBottom: 10}} type={"primary"} onClick={() => {
            setOpen(true)
          }}>邀请好友</Button>
          <Button loading={dailyCheckInLoading}
                  style={{marginRight: 10}} type={"primary"} onClick={async () => {
            setDailyCheckInLoading(true)
            const res = await doDailyCheckInUsingPOST()
            if (res.data && res.code === 0) {
              const res = await getLoginUserUsingGET();
              if (res.data && res.code === 0) {
                message.success("签到成功")
                setInitialState({loginUser: res.data, settings: Settings})
              }
            }
            setTimeout(() => {
              setDailyCheckInLoading(false)
            }, 1000)
          }}>
            <Tooltip title={<>
              <p>每日签到可获取10积分</p>
              {/*<p>普通用户上限100</p>*/}
              {/*<p>VPI会员上限1000</p>*/}
            </>}>
              每日签到
            </Tooltip>
          </Button>
        </ProCard>
        <br/>
        <ProCard
          bordered
          type="inner"
          title={"开发者凭证（调用接口的凭证）"}
          extra={
            <Button
              loading={voucherLoading}
              onClick={updateVoucher}>{(loginUser?.accessKey && loginUser?.secretKey) ? "更新" : "生成"}凭证</Button>
          }
        >
          {
            (loginUser?.accessKey && loginUser?.secretKey) ? (
              <Descriptions column={1}>
                <Descriptions.Item label="AccessKey">
                  <Paragraph copyable={valueLength(loginUser?.accessKey)}>
                    {loginUser?.accessKey}
                  </Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="SecretKey">
                  <Paragraph copyable={valueLength(loginUser?.secretKey)}>
                    {loginUser?.secretKey}
                  </Paragraph>
                </Descriptions.Item>
              </Descriptions>) : "暂无凭证,请先生成凭证"
          }
        </ProCard>
        <br/>
        <ProCard
          type="inner"
          title={<strong>开发者 SDK（快速接入API接口）</strong>}
          bordered
        >
          <Button size={"large"}>
            <a target={"_blank"} href={"https://github.com/qimu666/api-frontend"}
               rel="noreferrer"><VerticalAlignBottomOutlined/> Java SDK</a>
          </Button>
        </ProCard>
      </ProCard>
      <SendGiftModal invitationCode={loginUser?.invitationCode} onCancel={() => {
        setOpen(false)
      }} open={open}/>

    </Spin>
  );
};

export default UserInfo;
