// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** errorHtml GET /api/error */
export async function errorHtmlUsingGET(options?: { [key: string]: any }) {
  return request<API.ModelAndView>('/api/error', {
    method: 'GET',
    ...(options || {}),
  });
}

/** errorHtml PUT /api/error */
export async function errorHtmlUsingPUT(options?: { [key: string]: any }) {
  return request<API.ModelAndView>('/api/error', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** errorHtml POST /api/error */
export async function errorHtmlUsingPOST(options?: { [key: string]: any }) {
  return request<API.ModelAndView>('/api/error', {
    method: 'POST',
    ...(options || {}),
  });
}

/** errorHtml DELETE /api/error */
export async function errorHtmlUsingDELETE(options?: { [key: string]: any }) {
  return request<API.ModelAndView>('/api/error', {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** errorHtml PATCH /api/error */
export async function errorHtmlUsingPATCH(options?: { [key: string]: any }) {
  return request<API.ModelAndView>('/api/error', {
    method: 'PATCH',
    ...(options || {}),
  });
}
