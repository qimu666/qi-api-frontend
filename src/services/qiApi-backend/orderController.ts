// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** createOrder POST /api/order/create */
export async function createOrderUsingPOST(
  body: API.PayCreateRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseProductOrderVo>('/api/order/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** parseOrderNotifyResult POST /api/order/notify/order */
export async function parseOrderNotifyResultUsingPOST(
  body: string,
  options?: { [key: string]: any },
) {
  return request<string>('/api/order/notify/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** queryOrderStatus POST /api/order/query/status */
export async function queryOrderStatusUsingPOST(
  body: API.ProductOrderQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseboolean>('/api/order/query/status', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
