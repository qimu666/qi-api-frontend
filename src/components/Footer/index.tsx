import wechat from '@/../public/assets/WeChat.jpg';
import { GithubOutlined, InfoCircleOutlined, WechatOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import '@umijs/max';
import { Tooltip } from 'antd';
import React from 'react';

const Footer: React.FC = () => {
  const defaultMessage = '柒木工作室出品';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      // @ts-ignore
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'github',
          title: (
            <Tooltip title="查看本站技术及源码，欢迎 star">
              <GithubOutlined /> 支持项目
            </Tooltip>
          ),
          href: 'https://github.com/qimu666/qi-api',
          blankTarget: true,
        },
        {
          key: 'contact',
          title: (
            <Tooltip title={<img src={wechat} alt="微信 code_nav" width="120" />}>
              <WechatOutlined /> 联系作者
            </Tooltip>
          ),
          href: 'https://img.qimuu.icu/typory/WeChat.jpg',
          blankTarget: true,
        },
        {
          key: 'info',
          title: (
            <>
              <InfoCircleOutlined /> 免责声明
            </>
          ),
          href: 'https://gitee.com/qimu6/statement/blob/master/%E6%9F%92%E6%9C%A8%E6%8E%A5%E5%8F%A3%E7%94%A8%E6%88%B7%E5%8D%8F%E8%AE%AE.md#%E4%B8%83%E5%85%8D%E8%B4%A3%E5%A3%B0%E6%98%8E',
          blankTarget: true,
        },
        {
          key: 'beian',
          title: (
            <span className={'text-blue-500'}>
               豫ICP备2023004098号-1
            </span>
          ),
          href: 'https://beian.miit.gov.cn/',
          blankTarget: true,
        },
      ]}
    />
  );
};
export default Footer;
