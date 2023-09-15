import {Badge, Button, Card, Descriptions, Empty, Form, message, Select, Space, Spin, Table, Tabs, Tag} from 'antd';
import React, {useEffect, useState} from 'react';
import {getInterfaceInfoByIdUsingGET, invokeInterfaceUsingPOST} from "@/services/qiApi-backend/interfaceInfoController";

import CodeHighlighting from "@/components/CodeHighlighting";
import {InterfaceRequestMethodEnum, statusEnum} from "@/enum/commonEnum";
import {
  BugOutlined,
  CodeOutlined,
  FileExclamationOutlined,
  FileTextOutlined,
  LoginOutlined,
  VerticalAlignBottomOutlined
} from "@ant-design/icons";
import {Column} from "rc-table";
import './index.less'
import ProCard from "@ant-design/pro-card";
import {errorCode} from "@/enum/ErrorCodeEnum";
import Search from "antd/es/input/Search";
import {Link, useParams} from "@@/exports";
import {axiosExample, returnExample} from "@/pages/InterfaceInfo/components";
import RequestParamTable from "@/components/RequestParamTable";
import {ProColumns} from "@ant-design/pro-components";

const InterfaceInfo: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setDate] = useState<API.InterfaceInfo>();
  const [requestParams, setRequestParams] = useState<[]>();

  const [requestExampleActiveTabKey, setRequestExampleActiveTabKey] = useState<string>('javadoc');
  const [activeTabKey, setActiveTabKey] = useState<'tools' | 'api' | 'errorCode' | 'sampleCode' | string>('api');
  const [result, setResult] = useState<string>();
  const [resultLoading, setResultLoading] = useState<boolean>(false);
  const params = useParams();

  const axiosCode = axiosExample(data?.url)

  const loadedData = async () => {
    if (!params.id) {
      message.error('参数不存在');
      return;
    }
    setLoading(true);
    try {
      // @ts-ignore
      const res = await getInterfaceInfoByIdUsingGET({id: params.id});
      if (res.data && res.code === 0) {
        setDate(res.data || {});
        let requestParams = res.data.requestParams
        // @ts-ignore
        try {
          setRequestParams(requestParams ? JSON.parse(requestParams) : [])
        } catch (e: any) {
          setRequestParams([])
        }
      }
      setLoading(false);
    } catch (e: any) {
      message.error(e.message);
    }
  };
  useEffect(() => {
    loadedData();
  }, []);

  const requestExampleTabChange = (key: string) => {
    setRequestExampleActiveTabKey(key);
  };

  const responseExampleTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  const responseExampleTabList = [
    {
      key: 'api',
      label: <><FileTextOutlined/>API文档</>,
    },
    {
      key: 'tools',
      label: <><BugOutlined/>在线调试工具</>,
    }, {
      key: 'errorCode',
      label: <><FileExclamationOutlined/>错误码参照</>,
    }, {
      key: 'sampleCode',
      label: <><CodeOutlined/>示例代码</>,
    }
  ];
  const responseParameters = [{
    fieldName: 'code',
    type: "int",
    desc: <>返回码：<a onClick={() => setActiveTabKey("errorCode")}>错误码参照</a></>,
    required: '是'
  }, {
    fieldName: 'massage',
    type: "string",
    desc: "返回码描述",
    required: '是'
  }, {
    fieldName: 'data',
    type: "string",
    desc: "返回数据",
    required: '是'
  }]

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const DEFAULT_ADD_FIELD = {
    fieldName: 'userName',
    value: ''
  };

  const [form] = Form.useForm();

  const selectAfter = (
    <Select
      disabled
      defaultValue={data?.method}
      style={{width: 120}}
      onChange={handleChange}
      options={[
        {value: 'GET', label: 'GET', disabled: true},
        {value: 'POST', label: 'POST', disabled: true},
        {value: 'PUT', label: 'PUT', disabled: true},
        {value: 'DELETE', label: 'DELETE', disabled: true},
      ]}
    />
  );

  const onSearch = async (values: any) => {
    setResultLoading(true)
    console.log(values)
    const res = await invokeInterfaceUsingPOST({
      id: data?.id,
      ...values
    })
    setResult(res.data ? JSON.stringify(res.data, null, 4) : JSON.stringify(res, null, 4))
    setTimeout(() => setResultLoading(false), 1000)
  };

  const requestParam: ProColumns[] = [
    {
      title: '参数名称',
      dataIndex: 'fieldName',
      formItemProps: {
        rules: [
          {
            required: true,
            whitespace: true,
            message: '此项是必填项',
          },
        ],
      },
    }, {
      title: '参数值',
      dataIndex: 'value',
      formItemProps: {
        rules: [
          {
            required: true,
            whitespace: true,
            message: '此项是必填项',
          },
        ],
      },
    },]

  const responseExampleContentList: Record<string, React.ReactNode> = {
    api: <>
      <p className="highlightLine">开发者文档：</p>
      <a href={"https://doc.qimuu.icu/"} target={"_blank"} rel="noreferrer">📘 开发者文档</a>
      <p className="highlightLine" style={{marginTop: 15}}>请求参数说明：</p>
      <Table dataSource={requestParams} pagination={false} style={{maxWidth: 800}} size={"small"}>
        <Column title="名称" dataIndex="fieldName" key="fieldName"/>
        <Column title="必选" dataIndex="required" key="required"/>
        <Column title="类型" dataIndex="type" key="type"/>
        <Column title="描述" dataIndex="desc" key="desc"/>
      </Table>
      <p className="highlightLine" style={{marginTop: 15}}>响应参数说明：</p>
      <Table dataSource={responseParameters} pagination={false} style={{maxWidth: 800}} size={"small"}>
        <Column title="名称" dataIndex="fieldName" key="fieldName"/>
        <Column title="必选" dataIndex="required" key="required"/>
        <Column title="类型" dataIndex="type" key="type"/>
        <Column title="描述" dataIndex="desc" key="desc"/>
      </Table>
      <p className="highlightLine" style={{marginTop: 15}}>请求示例：</p>
      <a onClick={() => setActiveTabKey("sampleCode")}>见示例代码</a>
      <p className="highlightLine" style={{marginTop: 15}}>返回示例：</p>
      <CodeHighlighting codeString={returnExample} language={'javascript'}/>
    </>,
    tools:
      <>
        <Form
          className="form-input"
          form={form}
          onFinish={onSearch}
          scrollToFirstError
          onReset={() => {
            form.resetFields(['fieldList']);
          }}
        >
          <div style={{display: 'flex', justifyContent: 'center', justifyItems: 'center',}}>
            <Search size={"large"} readOnly style={{maxWidth: 600}} value={data?.url} addonBefore={selectAfter}
                    enterButton="发起请求" onSearch={form.submit}/>
          </div>
          <p className="highlightLine" style={{marginTop: 25}}>请求参数设置：</p>
          <Form.Item name={"requestParams"}>
            <RequestParamTable defaultNewColumn={DEFAULT_ADD_FIELD} column={requestParam}/>
          </Form.Item>
          <Form.Item>
            <Space size="large" wrap>
              <Button type="primary" htmlType="reset" style={{width: 180}}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
        <p className="highlightLine" style={{marginTop: 25}}>返回结果：</p>
        <Spin spinning={resultLoading}>
          {result ?
            <CodeHighlighting codeString={result} language={requestExampleActiveTabKey}/>
            : <Empty description={"未发起调用，暂无请求信息"}/>
          }
        </Spin>
      </>,
    errorCode: <>
      <p className="highlightLine">错误码：</p>
      <Table dataSource={errorCode} pagination={false} style={{maxWidth: 800}} size={"small"}>
        <Column title="名称" dataIndex="name" key="name"/>
        <Column title="错误码" dataIndex="code" key="code"/>
        <Column title="描述" dataIndex="des" key="des"/>
      </Table>
    </>,
    sampleCode:
      <>
        <Tabs
          style={{marginTop: -20}}
          defaultActiveKey="javadoc"
          centered
          onChange={requestExampleTabChange}
          items={[
            {
              key: 'javadoc',
              label: 'java',
              children: <CodeHighlighting codeString={axiosCode} language={requestExampleActiveTabKey}/>
            },
            {
              key: 'javascript',
              label: 'axios',
              children: <CodeHighlighting codeString={axiosCode} language={requestExampleActiveTabKey}/>
            },
          ]}
        />
      </>
  };

  return (
    <Spin spinning={loading}>
      <Card title={data?.name}>
        <Descriptions column={1}>
          <Descriptions.Item key={"url"} label={"接口地址"}><a target={"_blank"} href={data?.url}
                                                               rel="noreferrer">{data?.url}</a></Descriptions.Item>
          <Descriptions.Item key={"json"} label="返回格式">{"JSON"}</Descriptions.Item>
          <Descriptions.Item key={"reduceScore"} label="消费积分">{data?.reduceScore}个</Descriptions.Item>
          <Descriptions.Item key={"request"} label="请求方式"> <Tag
            color={InterfaceRequestMethodEnum[data?.method ?? 'default']}>{data?.method}</Tag></Descriptions.Item>
          <Descriptions.Item key={"totalInvokes"} label="调用次数">{data?.totalInvokes}次</Descriptions.Item>
          <Descriptions.Item key={"status"} label={"接口状态"}>
            {data && data.status === 0 ? (
              <Badge status="default" text={statusEnum[data.status]}/>
            ) : null}
            {data && data.status === 1 ? (
              <Badge status="processing" text={statusEnum[data.status]}/>
            ) : null}
            {data && data.status === 2 ? (
              <Badge status="error" text={statusEnum[data.status]}/>
            ) : null}
          </Descriptions.Item>
          <Descriptions.Item key={"请求示例"}
                             label="请求示例">{data?.requestExample ?? '该接口暂无请求示例'}</Descriptions.Item>
          <Descriptions.Item key={"description"}
                             label="接口描述">{data?.description ?? '该接口暂无描述信息'}</Descriptions.Item>
        </Descriptions>
      </Card>
      <br/>
      <Card
        style={{width: '100%'}}
        tabList={responseExampleTabList}
        activeTabKey={activeTabKey}
        onTabChange={responseExampleTabChange}
      >
        {responseExampleContentList[activeTabKey]}
      </Card>
      <br/>
      {(activeTabKey === "sampleCode" && requestExampleActiveTabKey === "javadoc") && (<ProCard
        type="inner"
        title={<strong>开发者 SDK（快速接入API接口）</strong>}
        bordered
        extra={<Link to="/account/center">
          <LoginOutlined/> 前往获取开发者凭证
        </Link>}
      >
        <p className="highlightLine">开发者文档：</p>
        <a href={"https://doc.qimuu.icu/"} target={"_blank"} rel="noreferrer">📘 开发者文档</a>
        <p className="highlightLine" style={{marginTop: 20}}>开发者SDK：</p>
        <Button size={"large"}>
          <a target={"_blank"} href={"https://github.com/qimu666/api-frontend"}
             rel="noreferrer"><VerticalAlignBottomOutlined/> Java SDK</a>
        </Button>
      </ProCard>)}
    </Spin>
  )
}

export default InterfaceInfo;
