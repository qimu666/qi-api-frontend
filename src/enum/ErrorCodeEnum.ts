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

export {ErrorCode, errorMessages};
