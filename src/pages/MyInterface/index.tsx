import {PageContainer} from '@ant-design/pro-components';
import '@umijs/max';
import React, {useState} from 'react';
import ObtainedInterface from "@/pages/MyInterface/ObtainedInterface";
import UploadInterface from "@/pages/MyInterface/UploadInterface";

const MyInterface: React.FC = () => {
  const [tabKey, setTabKey] = useState<string>('1');

  const pageContainerBody = () => {
    if (tabKey === '1') {
      return <ObtainedInterface/>
    } else if (tabKey === '2') {
      return <UploadInterface/>
    }
  }

  return (
    <PageContainer
      onTabChange={(val) => {
        setTabKey(val)
      }}
      tabList={[
        {
          tab: '我的购买',
          key: '1',
        },
        {
          tab: '我的发布',
          key: '2',
        }
      ]}
    >
      {
        pageContainerBody()
      }
    </PageContainer>
  );
};
export default MyInterface;


