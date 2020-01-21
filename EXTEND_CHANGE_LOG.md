#### 源码修改记录

1. 添加custom文件夹,所有修改源码的操作都在这个文件中进行

2. src\custom\utils\rules.js 校验规则

3. src\rule\type.js
```js
    // const pattern = {...} // 源代码
    export const pattern = {...} // 修改后

    // const types = {...} // 源代码
    export const types = {...} // 修改后

```
4. src\index.js
```js
    // add 
    import custom from './custom';
    // add 暴露方法 
    Schema.custom = custom;

```