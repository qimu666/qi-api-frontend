import {BarsOutlined, ExportOutlined, FileTextOutlined, GithubOutlined, WechatOutlined} from '@ant-design/icons';
import {SettingDrawer} from '@ant-design/pro-components';
import type {RunTimeLayoutConfig} from '@umijs/max';
import {history} from '@umijs/max';
import {AvatarDropdown, AvatarName} from './components/RightContent/AvatarDropdown';
import logo from '../public/logo.gif';
import Footer from '@/components/Footer';
import {requestConfig} from '@/requestConfig';
import Settings from '../config/defaultSettings';
import {valueLength} from "@/pages/User/UserInfo";
import {getLoginUserUsingGET} from "@/services/qiApi-backend/userController";
import {FloatButton, message} from 'antd';
import React from "react";
import wechat from '@/../public/assets/WeChat.jpg';
import LightColor from "@/components/Icon/LightColor";
import {Docs, helloWord} from "@/components/RightContent";
import SendGift from "@/components/Gift/SendGift";
import NoFoundPage from "@/pages/404";

const loginPath = '/user/login';
const whiteList = [loginPath, "/", "/account/center"]

const baiduStatistics = () => {
  const hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?1c3c7a064d6a39da5a90bf71821b4a9a";
  const s = document.getElementsByTagName("script")[0];
  // @ts-ignore
  s.parentNode.insertBefore(hm, s);
};


const stats: InitialState = {
  loginUser: undefined,
  settings: Settings,
  open: false
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
    actionsRender: () => [<Docs key="doc"/>],
    waterMarkProps: {
      content: initialState?.loginUser?.userName,
    },
    logo: logo,
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
          tooltip={"📘 接口在线文档"}
          icon={<FileTextOutlined/>}
          onClick={() => {
            location.href = "https://doc.qimuu.icu/"
          }
          }
        />
        <FloatButton
          tooltip={"分享此网站"}
          icon={<ExportOutlined/>}
          onClick={() => {
            if (!initialState?.loginUser && location.pathname !== loginPath) {
              message.error("请先登录")
              history.push(loginPath);
              return
            }
            setInitialState({loginUser: initialState?.loginUser, settings: Settings, open: true})
          }
          }/>
        <FloatButton
          tooltip={"查看本站技术及源码，欢迎 star"}
          icon={<GithubOutlined/>}
          onClick={() => {
            location.href = "https://github.com/qimu666/qi-api"
          }
          }
        />
        <FloatButton
          tooltip={"切换主题"}
          icon={<LightColor/>}
          onClick={() => {
            if (initialState?.settings.navTheme === "light") {
              setInitialState({loginUser: initialState?.loginUser, settings: {...Settings, navTheme: "realDark"}})
            } else {
              setInitialState({loginUser: initialState?.loginUser, settings: {...Settings, navTheme: "light"}})
            }
          }
          }
        />
      </FloatButton.Group>
      <SendGift
        invitationCode={initialState?.loginUser?.invitationCode}
        open={initialState?.open}
        onCancel={() => setInitialState({loginUser: initialState?.loginUser, settings: Settings, open: false})
        }></SendGift>
    </>,
    avatarProps: {
      src: valueLength(initialState?.loginUser?.userAvatar) ? initialState?.loginUser?.userAvatar :
        "https://img.qimuu.icu/typory/notLogin.png",
      title: initialState?.loginUser ? <AvatarName/> : "游客",
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>
      },
    },
    onPageChange: () => {
      // 百度统计
      baiduStatistics()
      const {location} = history;
      // if (!whiteList.includes(location.pathname)) {
      //   getInitialState();
      // }
      // 如果没有登录，重定向到 login
      if (!initialState?.loginUser && !/^\/\w+\/?$/.test(location.pathname) && location.pathname !== '/'
        && location.pathname !== '/interface/list' && !location.pathname.includes("/interface_info/")) {
        history.push(loginPath);
      }
    },
    // 自定义 403 页面
    unAccessible: <NoFoundPage/>,
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
