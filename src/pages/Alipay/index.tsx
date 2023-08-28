import React, {useEffect} from 'react';
import {createOrderUsingPOST1} from "@/services/qiApi-backend/payController";


/**
 * 每个单独的卡片，为了复用样式抽成了组件
 * @param param0
 * @returns
 */
const Alipay: () => void = () => {
  const lodaData = async () => {
    const res = await createOrderUsingPOST1()
    document.write(res.data as string);
  }
  useEffect(() => {
    lodaData()
  }, [])


}

export default Alipay;
