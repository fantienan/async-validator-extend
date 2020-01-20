# async-validator-extend

> 基于[async-validator](https://github.com/yiminghe/async-validator)添加扩展功能。

## example
```js

// 自定义验证规则
const {types, pattern} = schema.custom;

// 校验字符长度范围
types.rangeChar(value, [2, 20]);

// 校验身份证号码
const idCode = 'xxxxxxxxxxxxxxxxxx';
const {code, msg} = types.validatorIDCard(idCode);

```