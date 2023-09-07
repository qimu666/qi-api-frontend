import {Link} from '@@/exports';
import {ProColumns, ProFormColumnsType} from '@ant-design/pro-components';
import {Tag} from 'antd';
import {InterfaceRequestMethodEnum} from "@/enum/commonEnum";


export const InterfaceInfoModalFormColumns: ProFormColumnsType<API.ProductInfo, "text">[] = [
  {
    dataIndex: 'id',
    valueType: 'index',
    hideInTable: true,
    key: 'id',
  },
  {
    title: '接口名称',
    dataIndex: 'name',
    tooltip: "接口名称",
    key: 'name',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '接口名称为必填项',
        },
      ],
    },
    width: 'lg',
  }, {
    title: '接口地址',
    dataIndex: 'url',
    tooltip: "接口地址",
    formItemProps: {
      rules: [
        {
          required: true,
          message: '接口地址为必填项',
        },
      ],
    },
    key: "url",
    width: 'lg',
  },
  {
    title: '请求方法',
    dataIndex: 'method',
    tooltip: "请求方法",
    valueType: "radio",
    key: "method",
    valueEnum: {
      GET: {
        text: 'GET',
      },
      POST: {
        text: 'POST',
      },
      PUT: {
        text: 'PUT',
      },
      DELETE: {
        text: 'DELETE',
      },
    },
    formItemProps: {
      rules: [
        {
          required: true,
          message: '请求方法为必填项',
        },
      ],
    },
    width: 'lg',
    colProps: {
      span: 12,
    },
  },
  {
    title: '扣除积分个数',
    dataIndex: 'reduceScore',
    tooltip: "扣除积分个数",
    width: 'lg',
    key: "reduceScore",
    colProps: {
      span: 12,
    },
  },
  {
    title: '请求参数',
    dataIndex: 'requestParams',
    tooltip: "请求参数",
    width: 'lg',
    key: "requestParams",
    valueType: "jsonCode",
    colProps: {
      span: 12,
    },
  },
  {
    title: '响应头,需包含 {"Content-Type":"application/json"}',
    dataIndex: 'responseHeader',
    tooltip: '响应头,需包含 {"Content-Type":"application/json"}',
    width: 'lg',
    key: "responseHeader",
    valueType: "jsonCode"
  },
  {
    title: '请求头,需包含 {"Content-Type":"application/json"}',
    dataIndex: 'requestHeader',
    tooltip: '请求头,需包含 {"Content-Type":"application/json"}',
    width: 'lg',
    key: "requestHeader",
    valueType: "jsonCode"
  },
  {
    title: '请求示例',
    dataIndex: 'requestExample',
    tooltip: "请求示例",
    width: 'lg',
    key: "requestExample",
    valueType: "jsonCode"
  },
  {
    title: '接口描述',
    key: "description",
    dataIndex: 'description',
    tooltip: "接口描述",
    width: 'lg',
    valueType: "textarea",
    colProps: {
      span: 12,
    },
  },
];


const InterfaceInfoColumns: ProColumns<API.InterfaceInfo>[] = [
  {
    dataIndex: 'id',
    valueType: 'index',
    hideInTable: true,
    key: 'id',
  },
  {
    title: '接口名称',
    width: 120,
    dataIndex: 'name',
    copyable: true,
    valueType: 'text',
    render: (_, record) => (
      <Link key={record.id} to={`/interface_info/${record.id}`}>
        {record.name}
      </Link>
    ),
    ellipsis: true,
    key: 'name',
  },
  {
    title: '接口地址',
    dataIndex: 'url',
    valueType: 'text',
    ellipsis: true,
    copyable: true,
    key: 'url',
  },
  {
    title: '扣除积分个数',
    dataIndex: 'reduceScore',
    valueType: 'text',
    key: "reduceScore",
  },
  {
    title: '总调用次数',
    dataIndex: 'totalInvokes',
    valueType: 'text',
    search:false,
    key: "totalInvokes",
  },
  {
    title: '描述',
    dataIndex: 'description',
    valueType: 'textarea',
    copyable: true,
    ellipsis: true,
    key: 'description',
  },
  {
    title: '请求示例',
    dataIndex: 'requestExample',
    key: 'requestExample',
    valueType: 'text',
    width: 120,
    search: false,
    copyable: true,
    ellipsis: true,
  },
  {
    title: '请求头',
    dataIndex: 'requestHeader',
    valueType: 'text',
    search: false,
    width: 120,
    ellipsis: true,
    copyable: true,
    key: 'requestHeader',
  },
  {
    title: '请求参数',
    dataIndex: 'requestParams',
    valueType: 'text',
    search: false,
    width: 120,
    ellipsis: true,
    copyable: true,
    key: 'requestParams',
  },
  {
    title: '响应头',
    dataIndex: 'responseHeader',
    valueType: 'text',
    search: false,
    width: 120,
    copyable: true,
    ellipsis: true,
    key: 'responseHeader',
  },
  {
    title: '状态',
    filters: true,
    onFilter: true,
    width: 100,
    dataIndex: 'status',
    key: 'status',
    valueEnum: {
      0: {
        text: '审核中',
        status: 'Default',
      },
      2: {
        text: '已下线',
        status: 'Error',
      },
      1: {
        text: '已上线',
        status: 'Processing',
      },
    },
  },
  {
    title: '请求类型',
    dataIndex: 'method',
    filters: true,
    width: 100,
    onFilter: true,
    valueType: 'text',
    key: 'method',
    render: (_, record) => (
      <Tag color={InterfaceRequestMethodEnum[record.method ?? 'default']}>{record.method}</Tag>
    ),
    valueEnum: {
      GET: {
        text: 'GET',
      },
      POST: {
        text: 'POST',
      },
      PUT: {
        text: 'PUT',
      },
      DELETE: {
        text: 'DELETE',
      },
    },
  },
  // {
  //   title: '更新时间',
  //   dataIndex: 'updateTime',
  //   valueType: 'dateTime',
  //   key: 'updateTime',
  // },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    valueType: 'dateTime',
    key: 'createTime',
    search: false,
  },
];

export default InterfaceInfoColumns;
