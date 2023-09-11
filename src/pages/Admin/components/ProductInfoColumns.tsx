import {ProColumns, ProFormColumnsType} from '@ant-design/pro-components';

export const ProductInfoModalFormColumns: ProFormColumnsType<API.ProductInfo, "text">[] = [
  {
    title: 'id',
    valueType: 'index',
    dataIndex: 'id',
    hideInTable: true,
    key: "id"
  },
  {
    title: '商品名称',
    dataIndex: 'name',
    tooltip: "商品名称",
    key: "name",
    formItemProps: {
      rules: [
        {
          required: true,
          message: '商品名称为必填项',
        },
      ],
    },
    width: 'lg',
    colProps: {
      span: 24,
    },
  },
  {
    title: '产品类型',
    dataIndex: 'productType',
    key: 'productType',
    valueEnum: {
      VIP: {
        text: 'VIP会员',
      },
      RECHARGE: {
        text: '积分充值',
      },
      RECHARGEACTIVITY: {
        text: "充值活动"
      }
    }
  },
  {
    tooltip: "本商品购买后增加的积分数",
    title: '增加积分数 (单位：个)',
    dataIndex: 'addPoints',
    key: "addPoints",
    formItemProps: {
      rules: [
        () => ({
          validator(_, value) {
            if (!value) {
              return Promise.reject(new Error("增加积分数为必填项"));
            }
            if (value < 0) {
              return Promise.reject(new Error("增加积分数不能为负数"));
            }
            return Promise.resolve();
          },
          required: true,
        })],
    },
    width: 'lg',
    colProps: {
      span: 24,
    },
  }, {
    tooltip: "本商品的售卖金额,1元等于100分",
    title: '售卖金额 (单位：分)',
    dataIndex: 'total',
    key: "total",
    formItemProps: {
      rules: [
        () => ({
          validator(_, value) {
            if (!value) {
              return Promise.reject(new Error("售卖金额为必填项"));
            }
            if (value < 0) {
              return Promise.reject(new Error("售卖金额不能为负数"));
            }
            return Promise.resolve();
          },
          required: true,
        })],
    },
    width: 'lg',
    colProps: {
      span: 24,
    },
  },
  {
    tooltip: "商品的描述信息",
    title: '商品描述信息',
    key: "description",
    dataIndex: 'description',
    width: 'lg',
    colProps: {
      span: 24,
    },
  },
];

export const ProductInfoColumns: ProColumns<API.ProductInfo>[] = [
  {
    dataIndex: 'id',
    valueType: 'index',
    hideInTable: true,
    key: 'id',
  },
  {
    title: '商品名称',
    dataIndex: 'name',
    copyable: true,
    valueType: 'text',
    ellipsis: true,
    key: 'name',
  },
  {
    title: '商品金额 (分)',
    dataIndex: 'total',
    valueType: 'text',
    key: 'total',
  },
  {
    title: '增加积分数 (个)',
    dataIndex: 'addPoints',
    valueType: 'text',
    key: 'addPoints',
  },
  {
    title: '商品描述',
    dataIndex: 'description',
    valueType: 'textarea',
    copyable: true,
    ellipsis: true,
    key: 'description',
  },
  {
    title: '商品状态',
    filters: true,
    onFilter: true,
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
    }
  },
  {
    title: '产品类型',
    dataIndex: 'productType',
    filters: true,
    onFilter: true,
    valueType: 'text',
    key: 'productType',
    valueEnum: {
      VIP: {
        text: 'VIP会员',
      },
      RECHARGE: {
        text: '积分充值',
      },
      RECHARGEACTIVITY: {
        text: "充值活动"
      }
    }
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    valueType: 'dateTime',
    search: false,
    key: 'updateTime',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    valueType: 'dateTime',
    search: false,
    key: 'createTime',
  },
];

export default ProductInfoModalFormColumns;
