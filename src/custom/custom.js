/**
 * 自定义扩展包
 *  2020-01-20
 *  author: tT
 **/

import { pattern as p, types as t } from '../rule/type'

const pattern = {
  ...p,
  positiveInteger: new RegExp(`^\\d+$`),                  //正整数
  negativeInteger: new RegExp(`^-\\d+$`),                 //负整数
  integer: new RegExp(`^-?\\d+$`),                        // 整数
  positiveFloat: new RegExp(`^\\d+\\.\\d+$`),             // 正小数
  minusFloat: new RegExp(`^-\\d+\\.\\d+$`),               // 负小数
  float: new RegExp(`^-?\\d+\\.\\d+$`),                   // 负数
  realNumber: new RegExp(`^-?\\d+\\.?\\d*$`),             // 实数
  retain: num => new RegExp(`^-?\d+\.?\d{0,${num}}$`),    // 保留小数
  date_1: new RegExp(`^(\\d{4})-(\\d{2})-(\\d{2})$`),       // 日期格式 yyyy-mm-dd
  date_2: new RegExp(`^(\\d{2})\\/(\\d{2})\\/(\\d{4})$`),   // 日期格式 mm/dd/yyyy
};

const types = {
  ...t,
  // 字符长度范围
  rangeChar: (str = '', range) => {
    const len = str.replace(/[\u0391-\uFFE5]/g, "aa").length;
    const [min = -Infinity, max = Infinity] = range;
    if (len >= min && len <= max) {
      return true
    }
    if (len < min || len > max) {
      return false
    }
  },
  // 校验身份证
  validatorIDCard(idcode) {
    if (typeof idcode !== 'string') {
      return {
        code: -1,
        msg: "为了避免javascript数值范围误差，idcode 必须是字符串"
      }
    }
    const idcard_patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;
    // 判断格式是否正确
    const format = idcard_patter.test(idcode);
    if (!format) {
      return {
        code: -1,
        msg: "身份证号码格式错误"
      }
    }
    // 加权因子
    const weight_factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    // 校验码
    const check_code = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    const code = idcode + "";
    const last = idcode[17];//最后一位
    const seventeen = code.substring(0, 17);
    // ISO 7064:1983.MOD 11-2
    // 判断最后一位校验码是否正确
    const arr = seventeen.split("");
    const len = arr.length;
    let num = 0;
    for (let i = 0; i < len; i++) {
      num += arr[i] * weight_factor[i];
    }
    // 获取余数
    const resisue = num % 11;
    const last_no = check_code[resisue];
    // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
    const result = last === last_no ? true : false;
    return {
      code: result ? 1 : -1,
      msg: !result ? "身份证号码格式错误" : ""
    }
  }
};

export default {
  pattern,
  types
}
