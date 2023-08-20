import {useModel} from '@umijs/max';
import {Button, Descriptions, message, Modal, Upload, UploadFile, UploadProps} from 'antd';
import React, {useEffect, useState} from 'react';
import {RcFile} from "antd/es/upload";
import {EditOutlined, PlusOutlined, VerticalAlignBottomOutlined} from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import {updateUserUsingPOST} from "@/services/qiApi-backend/userController";
import Settings from '../../../../config/defaultSettings';
import Paragraph from "antd/lib/typography/Paragraph";
import ProCard from "@ant-design/pro-card";
import {PageContainer} from "@ant-design/pro-components";

export const valueLength = (val: any) => {
  return val && val.length > 0
}
const UserInfo: React.FC = () => {
  const unloadFileTypeList = ["jpeg", "jpg", "svg", "png", "webp"]
  const {initialState, setInitialState} = useModel('@@initialState');
  const {loginUser} = initialState || {}
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const handleCancel = () => setPreviewOpen(false);
  const [user, setUser] = useState<API.UserVO>();

  useEffect(() => {
      setLoading(true)
      const updatedFileList = [...fileList];
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
      setLoading(false)
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

  const updateUserInfo = async () => {
    const res = await updateUserUsingPOST({
      // @ts-ignore
      userAvatar: fileList[0].url
    })
    if (res.data && res.code === 0) {
      setInitialState({loginUser: res.data, settings: Settings})
      message.success(`信息更新成功`);
    }
  }

  const props: UploadProps = {
    name: 'file',
    action: 'http://localhost:7529/api/file/upload?biz=user_avatar',
    onChange: async function ({file, fileList: newFileList}) {
      const {response} = file;
      if (file.response && response.data) {
        const {data: {status, url}} = response
        if (status === 'error') {
          message.error(`头像更新失败`);
        }
        file.status = status
        const updatedFileList = [...fileList];
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
    <PageContainer loading={loading}>
      <ProCard
        type="inner"
        bordered
        direction="column"
      >
        <ProCard
          extra={<Button size={"large"} onClick={updateUserInfo}>提交修改</Button>
          }
          title={"个人信息设置"}
          type="inner"
          bordered
        >
          <Descriptions column={1}>
            <Descriptions.Item label="昵称">
              <Paragraph
                editable={
                  {
                    icon: <EditOutlined/>,
                    tooltip: '编辑',
                    onChange: (value) => {
                      setUser({userName: value})
                    }
                  }
                }
              >
                {user?.userName}
              </Paragraph>
            </Descriptions.Item>
            <Descriptions.Item label="头像">
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
          </Descriptions>
        </ProCard>
        <br/>

        <ProCard
          bordered
          type="inner"
          title={"开发者凭证（调用接口的凭证）"}
          extra={<Button>更换凭证</Button>}
        >
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
          </Descriptions>
        </ProCard>
        <br/>
        <ProCard
          type="inner"
          title={"开发者 SDK（快速接入API接口）"}
          bordered
        >
          <Button size={"large"}><VerticalAlignBottomOutlined/> Java SDK</Button>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};

export default UserInfo;
