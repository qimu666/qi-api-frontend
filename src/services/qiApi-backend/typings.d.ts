declare namespace API {
  type BaseResponseboolean = {
    code?: number;
    data?: boolean;
    message?: string;
  };

  type BaseResponseImageVo = {
    code?: number;
    data?: ImageVo;
    message?: string;
  };

  type BaseResponseInterfaceInfo = {
    code?: number;
    data?: InterfaceInfo;
    message?: string;
  };

  type BaseResponseListInterfaceInfo = {
    code?: number;
    data?: InterfaceInfo[];
    message?: string;
  };

  type BaseResponseListProductInfo = {
    code?: number;
    data?: ProductInfo[];
    message?: string;
  };

  type BaseResponseListUserVO = {
    code?: number;
    data?: UserVO[];
    message?: string;
  };

  type BaseResponselong = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponsePageInterfaceInfo = {
    code?: number;
    data?: PageInterfaceInfo;
    message?: string;
  };

  type BaseResponsePageProductInfo = {
    code?: number;
    data?: PageProductInfo;
    message?: string;
  };

  type BaseResponsePageUserVO = {
    code?: number;
    data?: PageUserVO;
    message?: string;
  };

  type BaseResponseProductInfo = {
    code?: number;
    data?: ProductInfo;
    message?: string;
  };

  type BaseResponseProductOrderVo = {
    code?: number;
    data?: ProductOrderVo;
    message?: string;
  };

  type BaseResponseUser = {
    code?: number;
    data?: User;
    message?: string;
  };

  type BaseResponseUserVO = {
    code?: number;
    data?: UserVO;
    message?: string;
  };

  type DeleteRequest = {
    id?: number;
  };

  type getInterfaceInfoByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getProductInfoByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getUserByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type IdRequest = {
    id?: number;
  };

  type ImageVo = {
    name?: string;
    status?: string;
    uid?: string;
    url?: string;
  };

  type InterfaceInfo = {
    createTime?: string;
    description?: string;
    id?: number;
    isDelete?: number;
    method?: string;
    name?: string;
    requestExample?: string;
    requestHeader?: string;
    requestParams?: string;
    responseHeader?: string;
    status?: number;
    total?: number;
    updateTime?: string;
    url?: string;
    userId?: number;
    userVO?: UserVO;
  };

  type InterfaceInfoAddRequest = {
    description?: string;
    method?: string;
    name?: string;
    requestExample?: string;
    requestHeader?: string;
    requestParams?: string;
    responseHeader?: string;
    total?: number;
    url?: string;
  };

  type InterfaceInfoUpdateRequest = {
    description?: string;
    id?: number;
    method?: string;
    name?: string;
    requestExample?: string;
    requestHeader?: string;
    requestParams?: string;
    responseHeader?: string;
    status?: number;
    total?: number;
    url?: string;
  };

  type listInterfaceInfoByPageUsingGETParams = {
    current?: number;
    description?: string;
    method?: string;
    name?: string;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    status?: number;
    url?: string;
    userId?: number;
  };

  type listInterfaceInfoBySearchTextPageUsingGETParams = {
    current?: number;
    pageSize?: number;
    searchText?: string;
    sortField?: string;
    sortOrder?: string;
  };

  type listInterfaceInfoUsingGETParams = {
    current?: number;
    description?: string;
    method?: string;
    name?: string;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    status?: number;
    url?: string;
    userId?: number;
  };

  type listProductInfoByPageUsingGETParams = {
    current?: number;
    description?: string;
    expirationTime?: string;
    name?: string;
    pageSize?: number;
    productType?: string;
    sortField?: string;
    sortOrder?: string;
    total?: number;
    userId?: number;
  };

  type listProductInfoBySearchTextPageUsingGETParams = {
    current?: number;
    pageSize?: number;
    searchText?: string;
    sortField?: string;
    sortOrder?: string;
  };

  type listProductInfoUsingGETParams = {
    current?: number;
    description?: string;
    expirationTime?: string;
    name?: string;
    pageSize?: number;
    productType?: string;
    sortField?: string;
    sortOrder?: string;
    total?: number;
    userId?: number;
  };

  type listUserByPageUsingGETParams = {
    createTime?: string;
    current?: number;
    gender?: number;
    id?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    updateTime?: string;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userRole?: string;
  };

  type listUserUsingGETParams = {
    createTime?: string;
    current?: number;
    gender?: number;
    id?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    updateTime?: string;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userRole?: string;
  };

  type ModelAndView = {
    empty?: boolean;
    model?: Record<string, any>;
    modelMap?: Record<string, any>;
    reference?: boolean;
    status?:
      | 'ACCEPTED'
      | 'ALREADY_REPORTED'
      | 'BAD_GATEWAY'
      | 'BAD_REQUEST'
      | 'BANDWIDTH_LIMIT_EXCEEDED'
      | 'CHECKPOINT'
      | 'CONFLICT'
      | 'CONTINUE'
      | 'CREATED'
      | 'DESTINATION_LOCKED'
      | 'EXPECTATION_FAILED'
      | 'FAILED_DEPENDENCY'
      | 'FORBIDDEN'
      | 'FOUND'
      | 'GATEWAY_TIMEOUT'
      | 'GONE'
      | 'HTTP_VERSION_NOT_SUPPORTED'
      | 'IM_USED'
      | 'INSUFFICIENT_SPACE_ON_RESOURCE'
      | 'INSUFFICIENT_STORAGE'
      | 'INTERNAL_SERVER_ERROR'
      | 'I_AM_A_TEAPOT'
      | 'LENGTH_REQUIRED'
      | 'LOCKED'
      | 'LOOP_DETECTED'
      | 'METHOD_FAILURE'
      | 'METHOD_NOT_ALLOWED'
      | 'MOVED_PERMANENTLY'
      | 'MOVED_TEMPORARILY'
      | 'MULTIPLE_CHOICES'
      | 'MULTI_STATUS'
      | 'NETWORK_AUTHENTICATION_REQUIRED'
      | 'NON_AUTHORITATIVE_INFORMATION'
      | 'NOT_ACCEPTABLE'
      | 'NOT_EXTENDED'
      | 'NOT_FOUND'
      | 'NOT_IMPLEMENTED'
      | 'NOT_MODIFIED'
      | 'NO_CONTENT'
      | 'OK'
      | 'PARTIAL_CONTENT'
      | 'PAYLOAD_TOO_LARGE'
      | 'PAYMENT_REQUIRED'
      | 'PERMANENT_REDIRECT'
      | 'PRECONDITION_FAILED'
      | 'PRECONDITION_REQUIRED'
      | 'PROCESSING'
      | 'PROXY_AUTHENTICATION_REQUIRED'
      | 'REQUESTED_RANGE_NOT_SATISFIABLE'
      | 'REQUEST_ENTITY_TOO_LARGE'
      | 'REQUEST_HEADER_FIELDS_TOO_LARGE'
      | 'REQUEST_TIMEOUT'
      | 'REQUEST_URI_TOO_LONG'
      | 'RESET_CONTENT'
      | 'SEE_OTHER'
      | 'SERVICE_UNAVAILABLE'
      | 'SWITCHING_PROTOCOLS'
      | 'TEMPORARY_REDIRECT'
      | 'TOO_EARLY'
      | 'TOO_MANY_REQUESTS'
      | 'UNAUTHORIZED'
      | 'UNAVAILABLE_FOR_LEGAL_REASONS'
      | 'UNPROCESSABLE_ENTITY'
      | 'UNSUPPORTED_MEDIA_TYPE'
      | 'UPGRADE_REQUIRED'
      | 'URI_TOO_LONG'
      | 'USE_PROXY'
      | 'VARIANT_ALSO_NEGOTIATES';
    view?: View;
    viewName?: string;
  };

  type OrderItem = {
    asc?: boolean;
    column?: string;
  };

  type PageInterfaceInfo = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: InterfaceInfo[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageProductInfo = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: ProductInfo[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageUserVO = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: UserVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PayCreateRequest = {
    payType?: string;
    productId?: string;
  };

  type ProductInfo = {
    addPoints?: number;
    createTime?: string;
    description?: string;
    expirationTime?: string;
    id?: number;
    isDelete?: number;
    name?: string;
    productType?: string;
    total?: number;
    updateTime?: string;
    userId?: number;
  };

  type ProductInfoAddRequest = {
    addPoints?: number;
    description?: string;
    expirationTime?: string;
    name?: string;
    productType?: string;
    total?: number;
  };

  type ProductInfoUpdateRequest = {
    addPoints?: number;
    description?: string;
    expirationTime?: string;
    id?: number;
    name?: string;
    productType?: string;
    total?: number;
  };

  type ProductOrderQueryRequest = {
    orderNo?: string;
  };

  type ProductOrderVo = {
    addPoints?: number;
    codeUrl?: string;
    expirationTime?: string;
    formData?: string;
    id?: number;
    orderName?: string;
    orderNo?: string;
    payType?: string;
    productId?: number;
    productInfo?: ProductInfo;
    status?: string;
    total?: number;
  };

  type uploadFileUsingPOSTParams = {
    biz?: string;
  };

  type User = {
    accessKey?: string;
    balance?: number;
    createTime?: string;
    gender?: number;
    id?: number;
    isDelete?: number;
    secretKey?: string;
    updateTime?: string;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userPassword?: string;
    userRole?: string;
  };

  type UserAddRequest = {
    gender?: number;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userPassword?: string;
    userRole?: string;
  };

  type UserLoginRequest = {
    userAccount?: string;
    userPassword?: string;
  };

  type UserRegisterRequest = {
    checkPassword?: string;
    userAccount?: string;
    userName?: string;
    userPassword?: string;
  };

  type UserUpdateRequest = {
    gender?: number;
    id?: number;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userPassword?: string;
    userRole?: string;
  };

  type UserVO = {
    accessKey?: string;
    balance?: number;
    createTime?: string;
    gender?: number;
    id?: number;
    secretKey?: string;
    updateTime?: string;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userRole?: string;
  };

  type View = {
    contentType?: string;
  };
}
