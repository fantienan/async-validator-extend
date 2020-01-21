/*
*  自定义验证规则
*/
import { types, pattern } from '../custom';
// 消息提示模板
const messgaes = {
  required: () => '不允许为空',
  email: () => '必须是邮箱地址',
  float: () => '必须是数字(float)',
  url: () => '必须是URL',
  integer: () => '必须是整数(int)',
  maxLength: max => `字符串长度(<=${max})`,
  minLength: min => `字符串长度(>=${min})`,
  rangeLength: range => `字符串长度(${range[0]}-${range[1]})`,
  rangeChar: range => `字符长度(${range[0]}-${range[1]})`,
  date: str => `必须是日期类型(yyyy-MM-dd|MM/dd/yyyy)`,
  english: () => `必须输入英文`,
  englishAndNumber: () => `必须输入英文+数字`,
  chinese: () => `必须输入中文`,
  idCards: () => `身份证验证15~18位`,
};

// 消息提示
const createMessage = (type, required = false, variate = '') => {
  const msg = messgaes[type] ? `${messgaes[type](variate)}` : '';
  const prefix = required ? '不能为空 ' : '';
  return `${prefix}${msg}`
};

// 非空
const required = () => ([{
  required: true,
  message: messgaes.required
}]);

// 邮件
const email = ({ required = false } = {}) => ([
  { type: "email", required, message: messgaes.email },
]);

// 浮点数
const float = ({ required = false } = {}) => ([
  { type: "string", required, pattern: pattern.float, message: createMessage('float', required) },
]);

// url
const url = ({ required = false } = {}) => ([
  { type: "string", required, pattern: pattern.url, message: createMessage('url', required) },
]);

// 整数
const integer = ({ required = false } = {}) => ([
  { type: "string", required, pattern: pattern.integer, message: createMessage('integer', required) },
]);

// 字符串长度范围
const rangeLength = ({ required = false, rules = '' } = {}) => {
  const pattern = new RegExp(`^(rangeLength:)(\\d+)(,)(\\d+)$`);
  const type = pattern.test(rules);
  let min, max;
  if (type) {
    const { $2, $4 } = RegExp;
    const arr = [$2, $4].sort((a, b) => a - b);
    min = Number(arr[0]);
    max = Number(arr[1]);
  }
  return [
    { type: "string", required, min, max, message: createMessage('rangeLength', required, [min, max]) },
  ]
};

// 最大字符串长度
const maxLength = ({ required = false, rules = '' } = {}) => {
  let max;
  const pattern = new RegExp(`^(maxLength:)(\\d+)$`);
  const type = pattern.test(rules);
  if (type) {
    max = Number(RegExp.$2);
  }
  return [
    { type: "string", required, max, message: createMessage('maxLength', required, max) },
  ]
};

// 最小字符串长度
const minLength = ({ required = false, rules = '' } = {}) => {
  let min;
  const pattern = new RegExp(`^(minLength:)(\\d+)$`);
  const type = pattern.test(rules);
  if (type) {
    min = Number(RegExp.$2);
  }
  return [
    { type: "string", required, min, message: createMessage('minLength', required, min) },
  ]
};

// 字符长度
const rangeChar = ({ required = false, rules = '' } = {}) => ([
  {
    type: "string",
    required,
    validator(rule, value, callback, source, options) {
      const pattern = new RegExp(`^(rangeChar:)(\\d+)(,)(\\d+)$`);
      const type = pattern.test(rules);
      if (type) {
        const { $2, $4 } = RegExp;
        let arr = [$2, $4].sort((a, b) => a - b);
        const min = Number(arr[0]);
        const max = Number(arr[1]);
        arr = [min, max];
        const result = types.rangeChar(value, arr);
        const errors = !result ? [createMessage('rangeChar', required, arr)] : [];
        callback(errors)
      }
    },
  }
]);

// 日期类型
const date = ({ required = false, rules = '' } = {}) => ([
  {
    type: "string",
    required,
    validator(rule, value, callback, source, options) {
      let result;
      if (pattern.date_1.test(value)) {
        const { $2, $3 } = RegExp;
        result = $2 <= 12 && $3 <= 31 && $2 != '00' && $3 != '00';
      } else if (pattern.date_2.test(value)) {
        const { $1, $2 } = RegExp;
        result = $1 <= 12 && $2 <= 31 && $1 != '00' && $2 != '00';
      }
      const errors = !result ? [createMessage('date', required)] : [];
      callback(errors)
    }
  },
]);

// 必须输入英文
const english = ({ required = false, rules = '' } = {}) => ([
  {
    type: "string",
    required,
    validator(rule, value, callback, source, options) {
      const enStr = value.replace(/[^A-Za-z\s]/g, '');
      let result = enStr.length == value.length;
      const errors = !result ? [createMessage('english', required)] : [];
      callback(errors)
    }
  },
]);

// 必须输入英文+数字
const englishAndNumber = ({ required = false, rules = '' } = {}) => ([
  {
    type: "string",
    required,
    validator(rule, value, callback, source, options) {
      const enAndNumStr = value.replace(/[^A-Za-z0-9\s]/g, '');
      let result = (
        /[A-Za-z]/.test(value) && // 有英文
        /[0-9]/.test(value) && // 有中文
        enAndNumStr.length == value.length // 只有中英文
      );
      const errors = !result ? [createMessage('englishAndNumber', required)] : [];
      callback(errors)
    }
  },
]);

// 只能输入中文
const chinese = ({ required = false, rules = '' } = {}) => ([
  {
    type: "string",
    required,
    validator(rule, value, callback, source, options) {
      const chStr = value.replace(/[^\u4e00-\u9fa5]/ug, '');
      let result = chStr.length == value.length;
      const errors = !result ? [createMessage('chinese', required)] : [];
      callback(errors)
    }
  },
]);

// 身份证号校验
const idCards = ({ required = false, rules = '' } = {}) => ([
  {
    type: "string",
    required,
    validator(rule, value, callback, source, options) {
      const errors = [];
      if (required && !value) {
        errors.push(messgaes['idCards']())
      } else if (!required && !value) {

      } else {
        let { code, msg } = types.validatorIDCard(value);
        msg && errors.push(msg)
      }
      callback(errors)
    }
  },
]);


export default {
  required, 
  email, 
  float, 
  url, 
  integer, 
  rangeLength, 
  maxLength, 
  minLength, 
  rangeChar, 
  date, 
  english,
  englishAndNumber, 
  chinese, 
  idCards
}
