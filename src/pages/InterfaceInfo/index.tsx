import {
  getInterfaceInfoByIdUsingGET,
  invokeInterfaceUsingPOST,
  updateInterfaceInfoUsingPOST,
} from '@/services/qiApi-backend/interfaceInfoController';
import {useModel, useParams} from '@@/exports';
import {Badge, Card, Descriptions, DescriptionsProps, Input, message, Spin, Tag, Watermark,} from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import React, {useEffect, useRef, useState} from 'react';
import ProCard from "@ant-design/pro-card";
import ReactJSONEditor from '@/components/JsonEditor/ReactJSONEditor';

const methodColorMap: any = {
  GET: 'blue',
  POST: 'red',
  PUT: 'green',
  DELETE: 'orange',
};

const statusEnum: any = {
  0: '审核中',
  1: '已上线',
  2: '已下线'
};
export const handleUpdate = async (fields: API.InterfaceInfoUpdateRequest) => {
  const hide = message.loading('Configuring');
  try {
    await updateInterfaceInfoUsingPOST({...fields});
    hide();
    message.success('修改成功');
    return true;
  } catch (error: any) {
    hide();
    message.error(error.message);
    return false;
  }
};

const InterfaceInfo: React.FC = () => {
  const params = useParams();
  const [data, setDate] = useState<API.InterfaceInfo>();
  const [requestUrl, setRequestUrl] = useState<string>();
  const {initialState} = useModel("@@initialState");
  const [loading, setLoading] = useState(false);
  const [responseLoading] = useState(false);

  const id = params.id;

  const jsonArrayRef = useRef<any>({});

  const handleJsonChange = (json: any) => {
    // 删除空值的属性
    for (const key in json) {
      if (json.hasOwnProperty(key) && json[key] === '') {
        delete jsonArrayRef.current[key];
      }
    }
    // 删除编辑器中删除的属性
    for (const key in jsonArrayRef.current) {
      if (!json.hasOwnProperty(key)) {
        delete jsonArrayRef.current[key];
      }
    }

    jsonArrayRef.current = {...jsonArrayRef.current, ...json};
  };

  const loadedData = async () => {
    if (!params.id) {
      message.error('参数不存在');
      return;
    }
    setLoading(true);
    try {
      // @ts-ignore
      const res = await getInterfaceInfoByIdUsingGET({id: id});
      if (res.data && res.code === 0) {
        setDate(res.data || {});
        setRequestUrl(res.data.url)
        let requestHeader;
        try {
          requestHeader = res.data.responseHeader ? JSON.parse(res.data.responseHeader) : {};
        } catch (error) {
          requestHeader = {};
        }
        if (requestHeader['Content-Type'] === 'application/json' && res.data.requestExample) {
          jsonArrayRef.current = JSON.parse(res.data.requestExample);
        } else {
          jsonArrayRef.current = {};
        }
      }
      setLoading(false);
    } catch (e: any) {
      message.error(e.message);
      setLoading(false);
    }
  };
  const copyable = (value: any) => {
    return value && value.length > 0;
  };

  const [resp, setResp] = useState();

  const invokeInterface = async () => {
    const res = await invokeInterfaceUsingPOST({
      id: data?.id,
      userRequestParams: JSON.stringify(jsonArrayRef.current)
    })
    if (res.data && res.code === 0) {
      setResp(res.data.data.name)
    }
  }

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: '接口名称',
      children: <Paragraph copyable={copyable(data?.name)}>{data?.name}</Paragraph>,
    },
    {
      key: '9',
      label: '请求类型',
      children: (
        <>
          <Tag color={methodColorMap[data?.method ?? 'default']}>{data?.method}</Tag>
        </>
      ),
    },
    {
      key: '2',
      label: '接口状态',
      children: (
        <p>
          {data && data.status === 0 ? (
            <Badge status="default" text={statusEnum[data.status]}/>
          ) : null}
          {data && data.status === 1 ? (
            <Badge status="processing" text={statusEnum[data.status]}/>
          ) : null}
          {data && data.status === 2 ? (
            <Badge status="error" text={statusEnum[data.status]}/>
          ) : null}
        </p>
      ),
    },
    {
      key: '3',
      label: '接口地址',
      children: <Paragraph copyable={copyable(data?.url)}>{data?.url}</Paragraph>,
    },
    {
      key: '6',
      label: '请求头',
      children: (
        <Paragraph code={true} copyable={copyable(data?.requestHeader)}>
          {data?.requestHeader}
        </Paragraph>
      ),
    },
    {
      key: '8',
      label: '响应头',
      children: (
        <Paragraph code={true} copyable={copyable(data?.responseHeader)}>
          {data?.responseHeader}
        </Paragraph>
      ),
    },
    {
      key: '7',
      label: '请求参数',
      children: (
        <Paragraph code={true} copyable={copyable(data?.requestParams)}>
          {data?.requestParams}
        </Paragraph>
      ),
    },
    {
      key: '5',
      label: '请求示例',
      children: (
        <Paragraph code={true} copyable={copyable(data?.requestExample)}>
          {data?.requestExample}
        </Paragraph>
      ),
    },
    {
      key: '4',
      label: '接口描述',
      children: <Paragraph>{data?.description}</Paragraph>,
    },
  ];

  useEffect(() => {
    loadedData();
  }, []);

  return (
    <Spin spinning={loading}>
      {/*// @ts-ignore*/}
      <Watermark content={['柒木接口', initialState?.loginUser?.userAccount]}>
        <Card title={'我的打卡信息'} hoverable>
          {data ? (
            <Descriptions column={{xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1}} items={items}/>
          ) : (
            <p>暂无信息</p>
          )}
        </Card>
        <br/>
        <ProCard hoverable bordered headerBordered wrap title={'在线调用'}><>
          <Input.Search
            allowClear
            defaultValue={data?.url || ""}
            placeholder="请输入请求参数"
            addonBefore={data?.method}
            value={requestUrl}
            enterButton="调 用"
            onChange={(e) => {
              setRequestUrl(e.target.value)
            }
            }
            addonAfter
            size={'large'}
            bordered
            onPressEnter={() => {
              invokeInterface()

            }}
            onSearch={() => {
              invokeInterface()
            }}
            // style={{maxWidth: '600px'}}
          />
          <br/>
          <br/>
          <ReactJSONEditor json={jsonArrayRef.current} name="properties" onJsonChange={handleJsonChange} mode="code"/>
        </>
        </ProCard>
        <br/>
        <Card hoverable title={'响应结果'}>
          <div style={{marginTop: 10, marginLeft: 20, minHeight: 80}}>
            <Spin tip={'加载中'} spinning={responseLoading} size="large">
              <Paragraph copyable={copyable(resp)}>{resp}</Paragraph>
            </Spin>
          </div>
        </Card>
      </Watermark>
    </Spin>
  );
};

export default InterfaceInfo;
