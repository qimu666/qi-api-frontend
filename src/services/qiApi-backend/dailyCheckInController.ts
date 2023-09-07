// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** doDailyCheckIn POST /api/dailyCheckIn/doCheckIn */
export async function doDailyCheckInUsingPOST(options?: { [key: string]: any }) {
  return request<API.BaseResponseboolean>('/api/dailyCheckIn/doCheckIn', {
    method: 'POST',
    ...(options || {}),
  });
}
