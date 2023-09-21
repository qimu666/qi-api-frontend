import {GithubOutlined, InfoCircleOutlined, WechatOutlined} from '@ant-design/icons';
import {DefaultFooter} from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';
import {Tooltip} from "antd";
import wechat from '@/../public/assets/WeChat.jpg';

const Footer: React.FC = () => {
  const defaultMessage = '柒木工作室出品';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      // @ts-ignore
      copyright={<>
        {`${currentYear} ${defaultMessage}`} |{' '}
        <a target={'_blank'} href={"https://beian.miit.gov.cn/"} rel="noreferrer"> 豫ICP备2023004098号-1</a>
        {" | "}
        <a target={'_blank'} href={'https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=41172702000163'}
           rel="noreferrer">
          <img src="https://img.qimuu.icu/typory/%E5%A4%87%E6%A1%88%E5%9B%BE%E6%A0%87.png"
               alt={'豫公网安备 41172702000163号'}/> 豫公网安备 41172702000163号
        </a>

      </>}
      links={[
        {
          key: 'github',
          title: (
            <Tooltip title="查看本站技术及源码，欢迎 star">
              <GithubOutlined/> 支持项目
            </Tooltip>
          ),
          href: 'https://github.com/qimu666/qi-api',
          blankTarget: true,
        },
        {
          key: 'contact',
          title: (
            <Tooltip title={<img src={wechat} alt="微信 code_nav" width="120"/>}>
              <WechatOutlined/> 联系作者
            </Tooltip>
          ),
          href: 'https://img.qimuu.icu/typory/WeChat.jpg',
          blankTarget: true,
        },
        {
          key: 'info',
          title: (
            <>
              <InfoCircleOutlined/> 免责声明
            </>
          ),
          href: 'https://gitee.com/qimu6/statement/blob/master/%E6%9F%92%E6%9C%A8%E6%8E%A5%E5%8F%A3%E7%94%A8%E6%88%B7%E5%8D%8F%E8%AE%AE.md#%E4%B8%83%E5%85%8D%E8%B4%A3%E5%A3%B0%E6%98%8E',
          blankTarget: true,
        }
      ]}
    />
  );
};
export default Footer;
