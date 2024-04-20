import React, {useEffect, useState} from 'react';
import {RcFile} from "antd/es/upload";
import {Button, message, Modal, Upload, UploadFile, UploadProps} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {requestConfig} from "@/requestConfig";
import ImgCrop from "antd-img-crop";
import ProCard from "@ant-design/pro-card";

export type Props = {
  open: boolean;
  onCancel: () => void;
  url?: string
  onSubmit: (url: any) => Promise<any>;
};

const UploadModal: React.FC<Props> = (props) => {
  const {open, onCancel, url, onSubmit} = props;
  const unloadFileTypeList = ["image/jpeg", "image/jpg", "image/svg", "image/png", "image/webp", "image/jfif"]
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [resUrl, setResUrl] = useState<string | undefined>();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const handleCancel = () => setPreviewOpen(false);

  useEffect(() => {
    const updatedFileList = [...fileList];
    if (url) {
      updatedFileList[0] = {
        // @ts-ignore
        uid: '1',
        // @ts-ignore
        name: url?.substring(url!.lastIndexOf('-') + 1),
        status: "done",
        percent: 100,
        url: url
      }
      setFileList(updatedFileList);
    } else {
      setFileList([])
    }
  }, [url])

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
      return Upload.LIST_IGNORE
    }
    const isLt2M = file.size / 1024 / 1024 < 1;
    if (!isLt2M) {
      message.error('文件大小不能超过 1M !');
      return Upload.LIST_IGNORE
    }
    if (!isLt2M && !fileType) {
      const updatedFileList = [...fileList];
      updatedFileList[0] = {
        // @ts-ignore
        uid: loginUser?.userAccount,
        // @ts-ignore
        name: "error",
        status: "error",
        percent: 100
      }
      setFileList(updatedFileList);
      return Upload.LIST_IGNORE
    }
    return fileType && isLt2M;
  };

  const prop: UploadProps = {
    name: 'file',
    withCredentials: true,
    action: `${requestConfig.baseURL}api/file/upload?biz=interface_avatar`,
    onChange: async ({file, fileList: newFileList}) => {
      const {response} = file;
      if (file.response && response.data) {
        const {data: {status, url, name, uid}} = response
        const updatedFileList = [...fileList];
        if (response.code !== 0 || status === 'error') {
          message.error(response.message);
          file.status = "error"
          updatedFileList[0] = {
            // @ts-ignore
            uid: '-1',
            // @ts-ignore
            name: 'error',
            status: "error",
            percent: 100
          }
          setFileList(updatedFileList);
          return
        }
        file.status = status
        updatedFileList[0] = {
          // @ts-ignore
          uid: uid,
          // @ts-ignore
          name: name,
          status: status,
          url: url,
          percent: 100
        }
        setFileList(updatedFileList);
        setResUrl(url)
      } else {
        setFileList(newFileList);
        setResUrl("")
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
      size: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
  };

  return (
    <>
      <Modal
        centered
        open={open}
        footer={null}
        onCancel={onCancel}
      >
        <ProCard style={{display: "flex", alignItems: "center", height: 120}}>
          <ImgCrop
            rotationSlider
            quality={1}
            aspectSlider
            maxZoom={4}
            cropShape={"round"}
            zoomSlider
            showReset
          >
            <Upload {...prop}>
              {fileList.length >= 1 ? undefined : uploadButton()}
            </Upload>
          </ImgCrop>
        </ProCard>
        <ProCard layout={"center"}>
          <Button size={"large"} style={{width: 100}} type={"primary"} onClick={async () => {
            onSubmit?.(resUrl);
          }}>更新图片</Button>
        </ProCard>
        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
          <img alt="example" style={{width: '100%'}} src={previewImage}/>
        </Modal>
      </Modal>
    </>
  );
};

export default UploadModal
