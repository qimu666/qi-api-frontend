import {
  listInterfaceInfoByPageUsingGET,
  listInterfaceInfoBySearchTextPageUsingGET,
} from '@/services/qiApi-backend/interfaceInfoController';
import {Link} from '@@/exports';
import {PageContainer} from '@ant-design/pro-components';
import {Button, Card, Input} from 'antd';
import VirtualList from 'rc-virtual-list';
import React, {useEffect, useState} from 'react';

const ContainerHeight = 760;

const InterfaceSquare: React.FC = () => {
  const [data, setData] = useState<API.InterfaceInfo[]>([]);
  const [current, setCurrent] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>('');

  const appendData = async () => {
    const res = await listInterfaceInfoByPageUsingGET({
      current: current,
      name: searchText,
      description: searchText,
    });
    if (res.data) {
      setCurrent(current + 1);
      setData(data.concat(res?.data?.records || []));
    }
  };

  useEffect(() => {
    appendData();
  }, []);

  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === ContainerHeight) {
      appendData();
    }
  };

  const onSearch = async () => {
    const res = await listInterfaceInfoBySearchTextPageUsingGET({
      current: 1,
      searchText: searchText,
    });
    if (res.data) {
      setData(res?.data?.records || []);
    }
  };
  return (
    <PageContainer>
      <Card>
        <div style={{display: 'flex', justifyContent: 'center', justifyItems: 'center'}}>
          <Input.Search
            allowClear
            placeholder="没找到心仪的接口 ？搜索一下吧"
            value={searchText}
            size="large"
            maxLength={40}
            enterButton="搜 索"
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            addonAfter
            bordered
            onPressEnter={() => {
              setCurrent(2);
              onSearch();
            }}
            onSearch={() => {
              setCurrent(2);
              onSearch();
            }}
            style={{
              maxWidth: 670,
            }}
          />
        </div>
      </Card>
      <br/>
      <Card>
        <VirtualList
          data={data}
          height={ContainerHeight}
          itemHeight={1000}
          itemKey="email"
          onScroll={onScroll}
        >
          {(item: API.InterfaceInfo) => (
            <Card
              key={item.id}
              title={
                <Link key={item.id} to={`/interface_info/${item.id}`}>
                  {item.name}
                </Link>
              }
              bordered
              hoverable
              extra={<Button type={'primary'}>获取</Button>}
            >
              {item?.description.trim().length <= 0
                ? '暂无描述信息'
                : item?.description.length > 50
                  ? item.description?.slice(0, 50) + '...'
                  : item.description}
            </Card>
          )}
        </VirtualList>
      </Card>
    </PageContainer>
  );
};

export default InterfaceSquare;
