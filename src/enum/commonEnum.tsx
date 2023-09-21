export const InterfaceRequestMethodEnum: any = {
  GET: 'blue',
  POST: 'red',
  PUT: 'green',
  DELETE: 'orange',
};

export const InterfaceStatusEnum: any = {
  0: {
    text: '审核中',
    status: 'default',
  },
  2: {
    text: '已下线',
    status: 'error',
  },
  1: {
    text: '已上线',
    status: 'processing',
  },
}

export const statusEnum: any = {
  0: '审核中',
  1: '已上线',
  2: '已下线'
};

export const productTypeColorEnum: any = {
  VIP: 'red',
  RECHARGE: 'blue',
};

export const orderStatusEnum: any = {
  "SUCCESS": '支付成功',
  "NOTPAY": '未支付',
  "CLOSED": '已取消'
};

export const orderPayTypeEnum: any = {
  WX: 'blue',
  ALIPAY: 'green',
};

export const productTypeEnum: any = {
  RECHARGEACTIVITY: "充值活动",
  RECHARGE: "积分充值",
  VIP:"VIP会员"
};
