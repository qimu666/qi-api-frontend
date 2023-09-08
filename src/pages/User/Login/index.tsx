import Footer from '@/components/Footer';
import {Link} from '@@/exports';
import {
  AlipayCircleOutlined,
  LockOutlined,
  MailOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import {LoginForm, ProFormCheckbox, ProFormText} from '@ant-design/pro-components';
import {useEmotionCss} from '@ant-design/use-emotion-css';
import {Helmet, history, useModel} from '@umijs/max';
import {message, Tabs} from 'antd';
import React, {useState} from 'react';
import Settings from '../../../../config/defaultSettings';
import {ProFormCaptcha} from "@ant-design/pro-form";
import {getCaptchaUsingGET, userEmailLoginUsingPOST, userLoginUsingPOST} from "@/services/qiApi-backend/userController";

const ActionIcons = () => {
  const langClassName = useEmotionCss(({token}) => {
    return {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    };
  });
  return (
    <>
      <AlipayCircleOutlined key="AlipayCircleOutlined" className={langClassName}/>
      <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={langClassName}/>
      <WeiboCircleOutlined key="WeiboCircleOutlined" className={langClassName}/>
    </>
  );
};

const Login: React.FC = () => {
  const [type, setType] = useState<string>('email');
  const {setInitialState} = useModel('@@initialState');
  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });
  const doLogin = (res: any) => {
    if (res.data && res.code === 0) {
      message.success('登陆成功');
      setTimeout(() => {
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
      }, 100);
      setInitialState({loginUser: res.data, settings: Settings});
    }
  }
  const handleSubmit = async (values: API.UserLoginRequest) => {
    try {
      // 登录
      const res = await userLoginUsingPOST({
        ...values,
      });
      doLogin(res)
    } catch (error) {
      const defaultLoginFailureMessage = '登录失败，请重试！';
      message.error(defaultLoginFailureMessage);
    }
  };

  const handleEmailSubmit = async (values: API.UserEmailLoginRequest) => {
    try {
      // 登录
      const res = await userEmailLoginUsingPOST({
        ...values,
      });
      doLogin(res)
    } catch (error) {
      const defaultLoginFailureMessage = '登录失败，请重试！';
      message.error(defaultLoginFailureMessage);
    }
  };

  return (
    <div className={containerClassName}>
      <Helmet>
        <title>
          {'登录'}- {Settings.title}
        </title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/logo.gif"/>}
          title="Qi-API 接口开放平台"
          subTitle={'Qi-API 接口开放平台致力于提供稳定、安全、高效的接口调用服务'}
          initialValues={{
            autoLogin: true,
          }}
          actions={['其他登录方式 :', <ActionIcons key="icons"/>]}
          onFinish={async (values) => {
            if (type === "account") {
              await handleSubmit(values as API.UserLoginRequest);
            } else {
              await handleEmailSubmit(values as API.UserEmailLoginRequest);
            }
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'email',
                label: '邮箱账号登录',
              },
              {
                key: 'account',
                label: '账户密码登录',
              },

            ]}
          />
          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined/>,
                }}
                placeholder={'请输入账号'}
                rules={[
                  {
                    required: true,
                    message: '账号是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                ]}
              />
            </>
          )}
          {type === 'email' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MailOutlined/>,
                }}
                name="emailAccount"
                placeholder={'请输入邮箱账号！'}
                rules={[
                  {
                    required: true,
                    message: '邮箱账号是必填项！',
                  },
                  {
                    pattern: /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/,
                    message: '不合法的邮箱账号！',
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={'请输入验证码！'}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${'秒后重新获取'}`;
                  }
                  return '获取验证码';
                }}
                phoneName={"emailAccount"}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: '验证码是必填项！',
                  },
                ]}
                onGetCaptcha={async (emailAccount) => {
                  const res = await getCaptchaUsingGET({emailAccount})
                  if (res.data && res.code === 0) {
                    message.success("验证码发送成功")
                    return
                  }
                }}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>
            <Link
              to={'/user/register'}
              style={{
                float: 'right',
              }}
            >
              还没账号?点击前往注册
            </Link>
          </div>
        </LoginForm>
      </div>
      <Footer/>
    </div>
  );
};
export default Login;
