import React from "react";
import {ProColumns} from "@ant-design/pro-components";

/**
 * axios代码示例
 * @param url
 * @param method
 */
export const axiosExample = (url?: string, method?: string) =>
  `axios.${method}('${url}')
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error('请求发生错误:', error);
    });`;
export const javaExample = (url?: string, method?: string) =>
  `    @Resource
    private ApiService apiService;

    public Object request() {
        BaseResponse baseResponse;
        try {
            CurrencyRequest currencyRequest = new CurrencyRequest();
            currencyRequest.setPath("${url}");
            currencyRequest.setMethod("${method}");
            currencyRequest.setRequestParams("你的请求参数,详细请前往开发者在线文档📘查看");
            baseResponse = apiService.request(currencyRequest);
            System.out.println("data = " + baseResponse.getData());
        } catch (BusinessException e) {
            log.error(e.getMessage());
        }
        return baseResponse.getData();
    }`;
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
  required: '否',
  value:"暂无"
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
  "fieldName": "",
  "value": ''
};

export const convertResponseParams = (params?: [API.RequestParamsField]) => {
  if (!params || params.length <= 0) {
    return returnExample
  }
  const result = {};
  const codeObj = {};
  const messageObj = {};
  params.forEach((param) => {
    // @ts-ignore
    const keys = param.fieldName.split('.');
    // @ts-ignore
    let currentObj;
    if (keys[0] === 'code') {
      currentObj = codeObj;
    } else if (keys[0] === 'message') {
      currentObj = messageObj;
    } else {
      currentObj = result;
    }

    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        if (param.type === 'int' && key === 'code') {
          // @ts-ignore
          currentObj[key] = 0;
        } else {
          // @ts-ignore
          currentObj[key] = param.desc || '';
        }
      } else {
        // @ts-ignore
        currentObj[key] = currentObj[key] || {};
        // @ts-ignore
        currentObj = currentObj[key];
      }
    });
  });
  // @ts-ignore
  const mergedResult = {code: codeObj.code, ...result, message: messageObj.message};
  return JSON.stringify(mergedResult, null, 2);
};

