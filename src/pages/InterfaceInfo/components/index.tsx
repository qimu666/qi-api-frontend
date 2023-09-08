
/**
 * axios代码示例
 * @param url
 */
export const axiosExample = (url?: string) =>
  `axios.get('${url}')
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error('请求发生错误:', error);
    });`;
/**
 * 返回示例
 */
export const returnExample = '{\n' +
  '    "code": 0,\n' +
  '    "data": {} ,\n' +
  '    "message": "ok"\n' +
  '}'
