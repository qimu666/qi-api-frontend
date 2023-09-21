import type {RequestOptions} from '@@/plugin-request/request';
import type {RequestConfig} from '@umijs/max';
import {history} from '@umijs/max';
import {message} from 'antd';

// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const requestConfig: RequestConfig = {
  baseURL: process.env.NODE_ENV === 'production' ? "https://api.qimuu.icu/" : 'http://localhost:7529/',
  withCredentials: true,

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // 拦截请求配置，进行个性化处理。
      const url = config?.url?.concat('?token = 123');
      return {...config, url};
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理
      const {data} = response as unknown as ResponseStructure;
      const {code} = data;
      if (data && code === 0) {
        return response;
      } else {
        switch (code) {
          case 40001: {
            if (location.pathname.includes("/interface_info/")) {
              break
            }
            message.error(data.message);
            history.push('/user/login');
          }
            break;
          case 40100:
            if (!/^\/\w+\/?$/.test(location.pathname) && location.pathname !== '/' && location.pathname !== '/interface/list') {
              message.error(data.message);
              history.push('/user/login');
            }
            break;
          default:
            if (location.pathname.includes("/interface_info/")) {
              break
            }
            message.error(data.message);
            break;
        }
      }
      return response;
    },
  ],
};
