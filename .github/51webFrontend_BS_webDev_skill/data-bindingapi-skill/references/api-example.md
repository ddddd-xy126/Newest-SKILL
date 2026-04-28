# API 接口文档示例 (User Input Example)

当用户需要使用本技能时，理想的输入格式应当包含**生成路径**、**环境配置（可选）**以及**接口详细说明**。这个文件提供了一个标准的 `Markdown` 示例，包含了各类请求（Query、JSON Body、FormData、路径传参、Mock）的标准写法。无论是 AI 处理还是用户参考，都可以以此为标准：

```markdown
# 综合业务模块接口文档

请帮我在 `src/utils/api/business.js` 中生成以下接口代码。

**生成要求**：请在生成的代码中，根据不同的模块名称添加明显的注释分隔符。

## 全局配置更新 (可选)
- **baseURL**: `http://192.168.1.100:8080/api/v1`
- **token**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2...`

---

## 接口说明

### 模块一：常规数据查询 (GET Query)

#### 1. 获取常规数据列表
- **路径**: `/admin/data/list`
- **方法**: `GET`
- **描述**: 分页获取常规数据列表
- **请求参数 (Query)**:
  - `pageNum` (Number): 当前页码
  - `pageSize` (Number): 每页条数
  - `keyword` (String): 搜索关键字

### 模块二：数据提交 (POST JSON)

#### 1. 创建新数据
- **路径**: `/admin/data/create`
- **方法**: `POST`
- **描述**: 提交 JSON 格式的表单数据
- **请求参数 (Body - JSON)**:
  - `name` (String): 数据名称
  - `type` (Number): 数据类型

### 模块三：文件或表单上传 (FormData)

#### 1. 上传相关凭证
- **路径**: `/admin/data/upload`
- **方法**: `POST`
- **描述**: 使用 FormData 上传文件或表单
- **请求参数 (FormData)**:
  - `file` (File): 凭证文件数据

### 模块四：动态路径传参 (Path Variables)

#### 1. 获取动态点位数据
- **路径**: `/admin/data/detail/{id}`
- **方法**: `GET`
- **描述**: 获取指定 ID 的详细数据，URL 中包含参数
- **请求参数 (Path)**:
  - `id` (String): 数据唯一标识ID
- **请求参数 (Query)**:
  - `history` (Boolean): 是否包含历史数据

### 模块五：Mock 接口请求

#### 1. 获取测试资产 Mock 数据
- **路径**: `/mock/assets/list`
- **方法**: `GET`
- **描述**: 前端 Mock 定义的获取资产列表数据（请按下划线命名规范生成）
- **请求参数 (Query)**: 无

---

## 响应数据示例（必需）

请提供至少一个接口的实际响应 JSON 数据，用于确定响应体结构和字段映射。

### 示例：获取常规数据列表 响应

\`\`\`json
{
  "success": true,
  "message": "",
  "code": 200,
  "result": {
    "total": 100,
    "list": [
      {
        "id": "1",
        "name": "示例数据",
        "type": 1,
        "createTime": "2026-01-01 12:00:00"
      }
    ]
  },
  "timestamp": 1776224510524
}
\`\`\`

> 注：通过响应示例可以确定：
> - 响应数据路径为 `res.data.result`
> - 列表数据在 `result.list` 中
> - 每条记录包含 `id`、`name`、`type`、`createTime` 等字段
```
