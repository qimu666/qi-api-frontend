/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
import {InitialState} from "@/typings";

export default function access(initialState: InitialState | undefined) {
  const {loginUser} = initialState ?? {};
  return {
    canAdmin: loginUser && loginUser.userRole === 'admin',
  };
}
