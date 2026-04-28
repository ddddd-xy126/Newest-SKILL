# Cross-Check: env-precheck

> 项目级环境预检。决定 `globalEnv` 各字段值，是协议 1 的执行细则。

---

## 检查清单

| 检查项 | 检查方式 | 通过标准 | 失败动作 |
|---|---|---|---|
| Node.js | 终端 `node -v` | 输出 v16+ 版本号 | 引导用户安装 LTS（不替用户装） |
| `package.json` | 读 projectPath/package.json | 存在且可解析 | 提示"未识别到 Vue 工程，确认 projectPath 是否正确" |
| `echarts` 依赖 | `package.json.dependencies.echarts` | 存在 | 提示 `npm install echarts` |
| `src/main.scss` | 文件存在且含 `html { font-size: Xvw; }` | 含 vw 单位的 font-size 声明 | 引导补齐，提供示例 |
| `src/utils/request.js` | 文件存在 | 含 axios.create + 响应拦截器 | 提示需先做 axios 封装，给出 BS-base-dev-skill 中的标准实现引用 |
| `src/assets/images/layout/` | 目录存在 | exists | 创建空目录（仅创建目录，不放文件） |
| MCP 状态（仅 3D 项目） | 探测 `wdp-knowledge-proxy` 是否注册 | 调用 `check_health` 或 `list_skills` 返回正常 | 走 wdp-secondary-dev-skill 阶段 -1 自检引导 |

---

## 检查产出

写入 `state.globalEnv`：
```jsonc
{
  "node": "ok | missing | unknown",
  "echarts": "ok | missing | unknown",
  "mainScss": "ok | missing | unknown",
  "requestUtil": "ok | missing | unknown",
  "layoutImagesDir": "ok | missing | unknown",
  "mcp": "ready | not-ready | not-applicable | unknown",
  "lastEnvCheckAt": "<ISO 8601>",
  "notes": [
    "echarts 已安装 v5.4.3",
    "main.scss 中 font-size: 0.36vw（推断 3840 屏）",
    "MCP 项目暂不需要（playbook=full-stack-2d）"
  ]
}
```

---

## 输出格式

```
🩺 环境预检报告
─────────────────────────────────────
工程: D:/your/project

✅ Node.js          v18.17.0
✅ package.json     已识别 Vue 2 工程
✅ echarts          v5.4.3
⚠️ main.scss        缺少 html { font-size: Xvw; } 声明
✅ request.js       已封装 axios
✅ layout 目录       已存在
ℹ️ MCP              本任务非 3D，跳过

修复清单（1 项）:
1. 在 src/main.scss 顶部添加：
   html { font-size: 0.36vw; }   /* 3840 屏 */
   或  html { font-size: 0.72vw; }  /* 1920 屏 */

完成后回复"已修复"，我会重跑预检。
```

---

## 失败硬阻断的项
- `node = missing` → **任何任务都不能启动**
- `mainScss = missing` → BS 厂任务不能启动
- `requestUtil = missing` → 数据接入厂任务不能启动
- `mcp = not-ready` 且 playbook 含 WDP → WDP 任务不能启动
