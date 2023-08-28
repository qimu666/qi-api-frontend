import {BarsOutlined, ExportOutlined, GithubOutlined, PlusOutlined, WechatOutlined} from '@ant-design/icons';
import {SettingDrawer} from '@ant-design/pro-components';
import type {RunTimeLayoutConfig} from '@umijs/max';
import {history} from '@umijs/max';
import {AvatarDropdown, AvatarName} from './components/RightContent/AvatarDropdown';

import Footer from '@/components/Footer';
import {requestConfig} from '@/requestConfig';
import Settings from '../config/defaultSettings';
import {valueLength} from "@/pages/User/UserInfo";
import NotAvatar from "@/components/Icon/NotAvatar";
import {getLoginUserUsingGET} from "@/services/qiApi-backend/userController";
import {FloatButton, message} from 'antd';
import React from "react";
import wechat from '@/../public/assets/WeChat.jpg';
import LightColor from "@/components/Icon/LightColor";
import {helloWord} from "@/components/RightContent";

const loginPath = '/user/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */

const stats: InitialState = {
  loginUser: undefined,
  settings: Settings
};

export async function getInitialState(): Promise<InitialState> {
  console.log(`%c${helloWord}`, 'color:#e59de3')

  try {
    const res = await getLoginUserUsingGET();
    if (res.data && res.code === 0) {
      stats.loginUser = res.data;
    }
  } catch (error) {
    history.push(loginPath);
  }
  return stats;
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({initialState, setInitialState}) => {

  return {
    footerRender: () => <>
      <Footer/>
      <FloatButton.Group
        trigger="hover"
        style={{right: 94}}
        icon={<BarsOutlined/>}
      >
        <FloatButton
          tooltip={<img src={wechat} alt="微信 code_nav" width="120"/>}
          icon={<WechatOutlined/>}
        />
        <FloatButton
          tooltip={"发布接口"}
          icon={<PlusOutlined/>}
        />
        <FloatButton
          tooltip={"分享此网站"}
          icon={<ExportOutlined/>}
          onClick={() => {
            navigator.clipboard.writeText(window.location.origin);
            message.success("复制成功")
          }
          }/>
        <FloatButton
          tooltip={"查看本站技术及源码，欢迎 star"}
          icon={<GithubOutlined/>}
          onClick={() => {
            location.href = "https://github.com/qimu666"
          }
          }
        />
        <FloatButton
          tooltip={"切换主题"}
          icon={<LightColor/>}
          onClick={() => {
            console.log(initialState?.settings)
            if (initialState?.settings.navTheme === "light") {
              setInitialState({loginUser: initialState?.loginUser, settings: {...Settings, navTheme: "realDark"}})
            } else {
              setInitialState({loginUser: initialState?.loginUser, settings: {...Settings, navTheme: "light"}})
            }
          }
          }
        />
      </FloatButton.Group>
    </>,
    // actionsRender: () => [<Release key="interface"/>],
    avatarProps: {
      src: initialState?.loginUser?.userAvatar,
      icon: valueLength(initialState?.loginUser?.userAvatar) ??
        <NotAvatar/>,
      title: <AvatarName/>,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>
      },
    },
    waterMarkProps: {
      content: initialState?.loginUser?.userName,
    },
    onPageChange: () => {
      // getInitialState();
      const {location} = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.loginUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    // 自定义 403 页面
    unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading/>;
      return (
        <>
          {children}
          <SettingDrawer
            disableUrlParams
            enableDarkTheme
            settings={initialState?.settings}
            onSettingChange={(settings) => {
              setInitialState((preInitialState) => ({
                ...preInitialState,
                settings,
              }));
            }}
          />
        </>
      );
    },
    ...initialState?.settings
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = requestConfig;
