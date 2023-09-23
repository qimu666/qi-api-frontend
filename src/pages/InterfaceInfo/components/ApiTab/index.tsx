import '@umijs/max';
import React from 'react';
import {Table} from "antd";
import {requestParameters, responseParameters} from "@/pages/InterfaceInfo/components/CodeTemplate";
import {Column} from "rc-table";
import CodeHighlighting from "@/components/CodeHighlighting";

export type Props = {
  requestParams?: [];
  responseParams?: [];
  errorCodeTab: () => void;
  sampleCode: () => void;
  returnCode: string
};
const ApiTab: React.FC<Props> = (props) => {
  const {requestParams, errorCodeTab, sampleCode, responseParams, returnCode} = props;

  return <>
    <p className="highlightLine" style={{marginTop: 15}}>请求参数说明：</p>
    <Table dataSource={requestParams && requestParams.length > 0 ? requestParams : requestParameters}
           pagination={false}
           style={{maxWidth: 800}} size={"small"}>
      <Column title="参数名称" dataIndex="fieldName" key="fieldName"/>
      <Column title="必选" dataIndex="required" key="required"/>
      <Column title="类型" dataIndex="type" key="type"/>
      <Column title="描述" dataIndex="desc" key="desc"/>
    </Table>
    <p className="highlightLine" style={{marginTop: 15}}>响应参数说明：<a
      onClick={() => errorCodeTab?.()}>错误码参照</a></p>
    <Table dataSource={responseParams && responseParams?.length > 0 ? responseParams : responseParameters}
           pagination={false}
           style={{maxWidth: 800}}
           size={"small"}>
      <Column title="参数名称" dataIndex="fieldName" key="fieldName"/>
      <Column title="类型" dataIndex="type" key="type"/>
      <Column title="描述" dataIndex="desc" key="desc"/>
    </Table>
    {/*<p className="highlightLine" style={{marginTop: 15}}>请求示例：</p>*/}
    <a onClick={() => sampleCode?.()}>见示例代码</a>
    <p className="highlightLine" style={{marginTop: 15}}>返回示例：</p>
    <CodeHighlighting codeString={returnCode} language={'javascript'}/>
  </>
};
export default ApiTab;
