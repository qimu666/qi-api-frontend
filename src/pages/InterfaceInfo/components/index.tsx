import React from "react";
import {ProColumns} from "@ant-design/pro-components";

/**
 * axios代码示例
 * @param url
 */
export const axiosExample = (url?: string) =>
  `axios.get('${url}')
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error('请求发生错误:', error);
    });`;
/**
 * 返回示例
 */
export const returnExample = '{\n' +
  '    "code": 0,\n' +
  '    "data": {} ,\n' +
  '    "message": "ok"\n' +
  '}'

export const responseParameters = [{
  fieldName: 'code',
  type: "int",
  desc: <>返回码</>,
  required: '是'
}, {
  fieldName: 'massage',
  type: "string",
  desc: "返回码描述",
  required: '是'
}, {
  fieldName: 'data',
  type: "Object",
  desc: "返回数据",
  required: '是'
}]

export const requestParameters = [{
  fieldName: '无',
  type: "string",
  desc: "无",
  required: '否'
}]

export const requestParam: ProColumns[] = [
  {
    title: '参数名称',
    dataIndex: 'fieldName',
    formItemProps: {
      rules: [
        {
          required: true,
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
          message: '此项是必填项',
        },
      ],
    },
  },]


export const DEFAULT_ADD_FIELD = {
  "fieldName": "fieldName",
  "value": ''
};
