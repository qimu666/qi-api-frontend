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

  type BaseResponseobject = {
    code?: number;
    data?: Record<string, any>;
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

  type BaseResponseUserVO = {
    code?: number;
    data?: UserVO;
    message?: string;
  };

  type DeleteRequest = {
    id?: number;
  };

  type Field = {
    fieldName?: string;
    value?: string;
  };

  type getCaptchaUsingGETParams = {
    /** emailAccount */
    emailAccount?: string;
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

  type getUserByInvitationCodeUsingPOSTParams = {
    /** invitationCode */
    invitationCode?: string;
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
    avatarUrl?: string;
    createTime?: string;
    description?: string;
    id?: number;
    isDelete?: number;
    method?: string;
    name?: string;
    reduceScore?: number;
    requestExample?: string;
    requestHeader?: string;
    requestParams?: string;
    responseHeader?: string;
    status?: number;
    totalInvokes?: number;
    updateTime?: string;
    url?: string;
    userId?: number;
  };

  type InterfaceInfoAddRequest = {
    description?: string;
    method?: string;
    name?: string;
    reduceScore?: number;
    requestExample?: string;
    requestHeader?: string;
    requestParams?: RequestParamsField[];
    responseHeader?: string;
    url?: string;
  };

  type InterfaceInfoUpdateRequest = {
    avatarUrl?: string;
    description?: string;
    id?: number;
    method?: string;
    name?: string;
    reduceScore?: number;
    requestExample?: string;
    requestHeader?: string;
    requestParams?: RequestParamsField[];
    responseHeader?: string;
    status?: number;
    url?: string;
  };

  type InvokeRequest = {
    fieldList?: Field[];
    id?: number;
    userRequestParams?: string;
  };

  type listInterfaceInfoByPageUsingGETParams = {
    current?: number;
    description?: string;
    method?: string;
    name?: string;
    pageSize?: number;
    reduceScore?: number;
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
    reduceScore?: number;
    sortField?: string;
    sortOrder?: string;
    status?: number;
    url?: string;
    userId?: number;
  };

  type listProductInfoByPageUsingGETParams = {
    addPoints?: number;
    current?: number;
    description?: string;
    name?: string;
    pageSize?: number;
    productType?: string;
    sortField?: string;
    sortOrder?: string;
    total?: number;
  };

  type listProductInfoBySearchTextPageUsingGETParams = {
    current?: number;
    pageSize?: number;
    searchText?: string;
    sortField?: string;
    sortOrder?: string;
  };

  type listProductInfoUsingGETParams = {
    addPoints?: number;
    current?: number;
    description?: string;
    name?: string;
    pageSize?: number;
    productType?: string;
    sortField?: string;
    sortOrder?: string;
    total?: number;
  };

  type listUserByPageUsingGETParams = {
    current?: number;
    gender?: string;
    id?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    userAccount?: string;
    userName?: string;
    userRole?: string;
  };

  type listUserUsingGETParams = {
    current?: number;
    gender?: string;
    id?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    userAccount?: string;
    userName?: string;
    userRole?: string;
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
    status?: number;
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

  type RequestParamsField = {
    desc?: string;
    fieldName?: string;
    id?: string;
    required?: string;
    type?: string;
  };

  type uploadFileUsingPOSTParams = {
    biz?: string;
  };

  type UserAddRequest = {
    balance?: number;
    gender?: string;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userPassword?: string;
    userRole?: string;
  };

  type UserBindEmailRequest = {
    captcha?: string;
    emailAccount?: string;
  };

  type UserEmailLoginRequest = {
    captcha?: string;
    emailAccount?: string;
  };

  type UserEmailRegisterRequest = {
    agreeToAnAgreement?: string;
    captcha?: string;
    emailAccount?: string;
    invitationCode?: string;
    userName?: string;
  };

  type UserLoginRequest = {
    userAccount?: string;
    userPassword?: string;
  };

  type UserRegisterRequest = {
    agreeToAnAgreement?: string;
    checkPassword?: string;
    invitationCode?: string;
    userAccount?: string;
    userName?: string;
    userPassword?: string;
  };

  type UserUpdateRequest = {
    balance?: number;
    gender?: string;
    id?: number;
    status?: number;
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
    email?: string;
    gender?: string;
    id?: number;
    invitationCode?: string;
    secretKey?: string;
    status?: number;
    updateTime?: string;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userRole?: string;
  };
}
