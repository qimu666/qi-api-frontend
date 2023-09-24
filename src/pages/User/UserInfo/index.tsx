import {history, useModel} from '@umijs/max';
import {
  Button,
  Descriptions,
  message,
  Modal,
  Spin,
  Tooltip,
  Tour,
  TourProps,
  Upload,
  UploadFile,
  UploadProps
} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {RcFile} from "antd/es/upload";
import {EditOutlined, PlusOutlined, VerticalAlignBottomOutlined} from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import {
  getLoginUserUsingGET,
  updateUserUsingPOST,
  updateVoucherUsingPOST,
  userBindEmailUsingPOST,
  userUnBindEmailUsingPOST
} from "@/services/qiApi-backend/userController";
import Settings from '../../../../config/defaultSettings';
import Paragraph from "antd/lib/typography/Paragraph";
import ProCard from "@ant-design/pro-card";
import {requestConfig} from "@/requestConfig";
import {doDailyCheckInUsingPOST} from "@/services/qiApi-backend/dailyCheckInController";
import SendGiftModal from "@/components/Gift/SendGift";
import EmailModal from "@/components/EmailModal";

export const valueLength = (val: any) => {
  return val && val.trim().length > 0
}
const UserInfo: React.FC = () => {
  const unloadFileTypeList = ["image/jpeg", "image/jpg", "image/svg", "image/png", "image/webp", "image/jfif"]
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
  const [openEmailModal, setOpenEmailModal] = useState(false);

  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);

  const [openTour, setOpenTour] = useState<boolean>(false);

  const steps: TourProps['steps'] = [
    {
      title: '个人信息设置',
      description: <span>这里是你的账号信息，您可以便捷的查看您的基本信息。<br/>您还可以修改和更新昵称和头像。
        <br/>邮箱主要用于接收<strong>支付订单信息</strong>，不绑定无法接收哦，快去绑定吧！！🥰</span>,
      target: () => ref1.current,
    },
    {
      title: '我的钱包',
      description: <span>这里是您的钱包，坤币用于平台接口的调用费用。<br/>除了充值坤币外，您还可以每日签到或者邀请好友注册来获得坤币</span>,
      target: () => ref2.current,
    },
    {
      title: '接口调用凭证',
      description: '这里是您调用接口的凭证，没有凭证将无法调用接口',
      target: () => ref3.current,
    },
    {
      title: '开发者SDK',
      description: '您可以使用开发者SDK，快速高效的接入接口到您的项目中',
      target: () => ref4.current,
    }
  ];

  const loadData = async () => {
    setLoading(true)
    const res = await getLoginUserUsingGET();
    if (res.data && res.code === 0) {
      if (initialState?.settings.navTheme === "light") {
        setInitialState({loginUser: res.data, settings: {...Settings, navTheme: "light"}})
      } else {
        setInitialState({loginUser: res.data, settings: {...Settings, navTheme: "realDark"}})
      }
      const updatedFileList = [...fileList];
      if (loginUser && loginUser.userAvatar) {
        updatedFileList[0] = {
          // @ts-ignore
          uid: loginUser?.userAccount,
          // @ts-ignore
          name: loginUser?.userAvatar?.substring(loginUser?.userAvatar!.lastIndexOf('-') + 1),
          status: "done",
          percent: 100,
          url: loginUser?.userAvatar
        }
        setFileList(updatedFileList);
      }
      setUserName(loginUser?.userName)
      setLoading(false)
    }
    // PC端显示指引
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      setOpenTour(false)
    } else {
      const tour = localStorage.getItem('tour');
      if (!tour) {
        setOpenTour(true)
      }
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
    const fileType = unloadFileTypeList.includes(file.type)
    if (!fileType) {
      message.error('图片类型有误,请上传jpg/png/svg/jpeg/webp格式!');
    }
    const isLt2M = file.size / 1024 / 1024 < 1;
    if (!isLt2M) {
      message.error('文件大小不能超过 1M !');
    }
    if (!isLt2M && !fileType) {
      const updatedFileList = [...fileList];
      updatedFileList[0] = {
        // @ts-ignore
        uid: loginUser?.userAccount,
        // @ts-ignore
        name:  "error",
        status: "error",
        percent: 100
      }
      setFileList(updatedFileList);
      return false
    }
    return fileType && isLt2M;
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
          message.error(response.message);
          file.status = "error"
          updatedFileList[0] = {
            // @ts-ignore
            uid: loginUser?.userAccount,
            // @ts-ignore
            name: loginUser?.userAvatar ? loginUser?.userAvatar?.substring(loginUser?.userAvatar!.lastIndexOf('-') + 1) : "error",
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

  const handleBindEmailSubmit = async (values: API.UserBindEmailRequest) => {
    try {
      // 绑定邮箱
      const res = await userBindEmailUsingPOST({
        ...values,
      });
      if (res.data && res.code === 0) {
        if (initialState?.settings.navTheme === "light") {
          setInitialState({loginUser: res.data, settings: {...Settings, navTheme: "light"}})
        } else {
          setInitialState({loginUser: res.data, settings: {...Settings, navTheme: "realDark"}})
        }
        setOpenEmailModal(false)
        message.success('绑定成功');
      }
    } catch (error) {
      const defaultLoginFailureMessage = '操作失败！';
      message.error(defaultLoginFailureMessage);
    }
  };
  const handleUnBindEmailSubmit = async (values: API.UserUnBindEmailRequest) => {
    try {
      // 绑定邮箱
      const res = await userUnBindEmailUsingPOST({...values});
      if (res.data && res.code === 0) {
        if (initialState?.settings.navTheme === "light") {
          setInitialState({loginUser: res.data, settings: {...Settings, navTheme: "light"}})
        } else {
          setInitialState({loginUser: res.data, settings: {...Settings, navTheme: "realDark"}})
        }
        setOpenEmailModal(false)
        message.success('解绑成功');
      }
    } catch (error) {
      const defaultLoginFailureMessage = '操作失败！';
      message.error(defaultLoginFailureMessage);
    }
  };
  return (
    <Spin spinning={loading}>
      <ProCard
        type="inner"
        bordered
        direction="column"
      >
        <ProCard
          ref={ref1}
          extra={
            <>
              <Tooltip title={"用于接收订单信息"}>
                <Button onClick={() => {
                  setOpenEmailModal(true)
                }
                }>{loginUser?.email ? '更新邮箱' : "绑定邮箱"}</Button>
              </Tooltip>
              <Tooltip title={"提交修改的信息"}>
                <Button style={{marginLeft: 10}} onClick={updateUserInfo}>提交修改</Button>
              </Tooltip>
            </>
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
                {valueLength(userName) ? userName : '无名氏'}
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
            <div>
              <h4>我的id：</h4>
              <Paragraph
                copyable={valueLength(loginUser?.id)}
              >
                {loginUser?.id}
              </Paragraph>
            </div>
            <div>
              <h4>我的邮箱：</h4>
              <Paragraph
                copyable={valueLength(loginUser?.email)}
              >
                {valueLength(loginUser?.email) ? loginUser?.email : '未绑定邮箱'}
              </Paragraph>
            </div>
          </Descriptions>
        </ProCard>
        <br/>
        <ProCard ref={ref2} type={"inner"} bordered tooltip={"用于平台接口调用"} title={<strong>我的钱包</strong>}
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
          ref={ref3}
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
          ref={ref4}
          type="inner"
          title={<strong>开发者 SDK（快速接入API接口）</strong>}
          bordered
        >
          <Button size={"large"}>
            <a target={"_blank"} href={"https://github.com/qimu666/qi-api-sdk"}
               rel="noreferrer"><VerticalAlignBottomOutlined/> Java SDK</a>
          </Button>
        </ProCard>
      </ProCard>
      <SendGiftModal invitationCode={loginUser?.invitationCode} onCancel={() => {
        setOpen(false)
      }} open={open}/>
      <EmailModal unbindSubmit={handleUnBindEmailSubmit} bindSubmit={handleBindEmailSubmit} data={loginUser}
                  onCancel={() => setOpenEmailModal(false)}
                  open={openEmailModal}/>
      <Tour open={openTour} onClose={() => {
        setOpenTour(false)
        localStorage.setItem('tour', "true");
      }} steps={steps}/>
    </Spin>
  );
};

export default UserInfo;
