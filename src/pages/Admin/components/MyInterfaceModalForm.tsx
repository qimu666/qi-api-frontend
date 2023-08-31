import {ModalForm, ProForm, ProFormRadio, ProFormTextArea} from '@ant-design/pro-components';
import {ProFormInstance, ProFormText} from '@ant-design/pro-form/lib';
import '@umijs/max';
import {Button} from 'antd';
import React, {useEffect, useRef} from 'react';

export type Props = {
  value?: API.InterfaceInfo;
  title: string
  open: () => boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  onCancel: () => void;
  onSubmit: (values: API.InterfaceInfo) => Promise<void>;
};
const MyInterfaceModalForm: React.FC<Props> = (props) => {
  const formRef = useRef<ProFormInstance>();
  const {open, onOpenChange, title, value, onSubmit} = props;
  useEffect(() => {
    // 添加的时候id不存在,可以根据id清空表单
    const isAdd = !value?.id
    if (isAdd) {
      formRef.current?.resetFields()
    }
    if (formRef && !isAdd) {
      formRef.current?.setFieldsValue(value);
    }
  }, [value]);
  return (
    <ModalForm
      formRef={formRef}
      title={title}
      width="740px"
      open={open()}
      autoFocusFirstInput
      onOpenChange={onOpenChange}
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
      onFinish={async (value) => {
        onSubmit?.(value);
      }}
    >
      <ProForm.Group>
        <ProFormText hidden={true} width="md" name="id"/>
        <ProFormText
          label={'接口名称'}
          rules={[
            {
              required: true,
              message: '接口名称为必填项',
            },
          ]}
          width="md"
          name="name"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '接口地址为必填项',
            },
          ]}
          label={'接口地址'}
          width="md"
          name="url"
        />
      </ProForm.Group>
      <ProFormRadio.Group
        rules={[{required: true, message: '接口请求方法为必填项'}]}
        name="method"
        layout="horizontal"
        label="请求方法"
        options={[
          {
            label: 'GET',
            value: 'GET',
          },
          {
            label: 'POST',
            value: 'POST',
          },
          {
            label: 'PUT',
            value: 'PUT',
          },
          {
            label: 'DELETE',
            value: 'DELETE',
          },
        ]}
      />
      <ProForm.Group>
        <ProFormTextArea label={'接口描述'} width="md" name="description"/>
        <ProFormTextArea label={'请求参数'} width="md" name="requestParams"/>
      </ProForm.Group>
      <ProForm.Group>
        <ProFormTextArea label={'响应头'} width="md" name="responseHeader"/>
        <ProFormTextArea label={'请求头'} width="md" name="requestHeader"/>
      </ProForm.Group>
      <ProForm.Group>
        <ProFormTextArea label={'请求示例'} width="md" name="requestExample"/>
      </ProForm.Group>
    </ModalForm>
  );
};

export default MyInterfaceModalForm;