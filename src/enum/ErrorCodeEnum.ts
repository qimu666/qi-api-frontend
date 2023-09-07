// 枚举类型定义
enum ErrorCode {
  SUCCESS = 0,
  PARAMS_ERROR = 40000,
  NOT_LOGIN_ERROR = 40100,
  NO_AUTH_ERROR = 40101,
  NOT_FOUND_ERROR = 40400,
  FORBIDDEN_ERROR = 40300,
  SYSTEM_ERROR = 50000,
  OPERATION_ERROR = 50001,
}


// 错误码和错误信息对象
const errorMessages = {
  [ErrorCode.SUCCESS]: "ok",
  [ErrorCode.PARAMS_ERROR]: "请求参数错误",
  [ErrorCode.NOT_LOGIN_ERROR]: "未登录",
  [ErrorCode.NO_AUTH_ERROR]: "无权限",
  [ErrorCode.NOT_FOUND_ERROR]: "请求数据不存在",
  [ErrorCode.FORBIDDEN_ERROR]: "禁止访问",
  [ErrorCode.SYSTEM_ERROR]: "系统内部异常",
  [ErrorCode.OPERATION_ERROR]: "操作失败",
};

export const errorCode = [
  {
    code: 0,
    name: 'SUCCESS',
    des: 'ok',
  },
  {
    code: 40000,
    name: 'PARAMS_ERROR',
    des: '请求参数错误',
  },
  {
    code: 40101,
    name: 'NO_AUTH_ERROR',
    des: '无权限',
  },
  {
    code: 40300,
    name: 'FORBIDDEN_ERROR',
    des: '禁止访问',
  },
  {
    code: 40400,
    name: 'NOT_FOUND_ERROR',
    des: '请求数据不存在',
  },
  {
    code: 50000,
    name: 'SYSTEM_ERROR',
    des: '系统内部异常',
  },
  {
    code: 50001,
    name: 'OPERATION_ERROR',
    des: '操作失败',
  },
];

export {ErrorCode, errorMessages};
