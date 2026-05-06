# API 接口模板和规范

参考项目内 `src/utils/api/test.js` 和 `src/utils/request.js`：

## 基础架构引用
```javascript
import request from '@/utils/request'
```

## 默认 GET 请求 (Query)
```javascript
// [接口中文说明]
export function [functionName]API(params) {
    return request({
        url: '[/api/path]',
        method: 'get',
        params // 参数放 params 中
    })
}
```

## 默认 POST 请求 (JSON Body)
```javascript
// [接口中文说明]
export function [functionName]API(data) {
    return request({
        url: '[/api/path]',
        method: 'post',
        data, // 参数放 data 中
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}
```

## FormData POST / PUT 请求
```javascript
// [接口中文说明]
export function [functionName]API(data) {
    return request({
        url: '[/api/path]',
        method: 'post', // 或 'put'
        data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}
```

## 路径传参 (Path 参数) 请求
当文档中路径形式为 `/api/some/{id}` 或要求通过 URL Path 传参时，使用 ES6 模板字符串：
```javascript
// [接口中文说明]
export function [functionName]API(id, params) { // 如果除了 path 还需要 query，则参数连写
    return request({
        url: `[/api/path/]${id}`, // 使用反引号模板字符串拼接
        method: 'get', // 或者其他对应的请求方法
        params // 如果有普通 Query 参数，仍在这里传递
    })
}
```

## MOCK API 请求
Mock 接口前面加一个下划线表示 MOCK:
```javascript
// Mock [接口中文说明]
export function _[functionName]API(params) {
    return request({
        url: '[mock server url]/[api/path]',
        method: 'get', // 或者对应的请求方法
        params
    })
}
```