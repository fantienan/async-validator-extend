#### 源码修改记录

1. 添加custom.js,所有修改源码的操作都在这个文件中进行

2. src/rule/type.js
```js
    // const pattern = {...} // 源代码
    export const pattern = {...} // 修改后

    // const types = {...} // 源代码
    export const types = {...} // 修改后

```
3. index.js
```js
    // add 
    import custom from './custom';
    // add 暴露方法 
    Schema.custom = custom;

```