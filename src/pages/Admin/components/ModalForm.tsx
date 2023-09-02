import {BetaSchemaForm} from '@ant-design/pro-components';
import {Button} from 'antd';
import React, {useEffect, useRef} from 'react';
import {ProFormInstance} from "@ant-design/pro-form/lib";
import {SizeType} from "@ant-design/pro-form/es/BaseForm";

export type Props = {
  value?: API.InterfaceInfo;
  title: string
  open: () => boolean;
  width: string
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  onCancel: () => void;
  onSubmit: (values: API.InterfaceInfo) => Promise<void>;
  columns: any[]
  size?: SizeType
};

const ModalForm: React.FC<Props> = (props) => {
  const formRef = useRef<ProFormInstance>();
  const {width, open, onOpenChange, title, value, onSubmit, columns, size} = props;
  useEffect(() => {
    // 添加的时候id不存在,可以根据id清空表单
    const isAdd = value?.id
    if (!isAdd) {
      formRef.current?.resetFields()
    }
    if (formRef && isAdd) {
      formRef.current?.setFieldsValue(value);
    }
  }, [value]);
  return (
    <>
      <BetaSchemaForm<API.ProductInfo>
        width={width}
        title={title}
        size={size}
        open={open()}
        onOpenChange={onOpenChange}
        formRef={formRef}
        autoFocusFirstInput
        layoutType={'ModalForm'}
        onFinish={async (value) => {
          onSubmit?.(value);
        }}
        grid={true}
        rowProps={{
          gutter: [16, 16],
        }}
        colProps={{
          span: 12,
        }}
        submitter={{
          render: (props, defaultDoms) => {
            return [
              ...defaultDoms,
              <Button
                key="extra-reset"
                onClick={() => {
                  formRef.current?.resetFields();
                }}
              >
                重置
              </Button>,
            ];
          },
        }}
        columns={columns}
      />
    </>
  );
};

export default ModalForm
