# `_dev-toolkit/` — 开发者周边工具箱

> **本目录不属于工业链业务 skill 集合**，仅供 BS-Skill-Buddy 维护者自身使用。
>
> 总监（factory-supervisor-skill）、三厂（BS / WDP / 数据接入）、业务重置（business-reset-skill）等运行时 skill **永远不会引用本目录**。

---

## 用途

存放仅维护者使用的周边 skill、静态资料、版本归档、企微/外部交付物模板等。常见类别：

| 子类 | 示例 | 是否对外发布 |
|---|---|---|
| 维护者用 skill | `enterprise-release-brief-skill/`（生成企微版本简报） | 否 |
| 版本简报归档 | `release-notes/v0.0.x-升级简报.md` | 仅企微/钉钉手动转发 |
| 企微/Word 样式权威源 | `release-notes/*.docx` | 否（仅作格式比对） |
| 维护者参考资料 | 设计稿、调研笔记、路线图等 | 否 |

---

## 命名约定

- 顶级文件夹以小写 + 连字符命名（`enterprise-release-brief-skill/`）
- 版本归档统一在 `release-notes/`，文件名 `v<X.Y.Z>-升级简报.md`
- 二进制权威源（docx/pdf）允许放在 `release-notes/` 根，不嵌套 `assets/`
- 任何加入到本目录的 skill **必须**在 SKILL.md 顶部 frontmatter 注明 `description` 中包含"维护者使用 / 不参与业务调度"字样

---

## 与业务 skill 的隔离铁律

1. ❌ 业务 skill 的 SKILL.md / brains / knowledge / templates / playbooks / checks **禁止** 反向引用 `_dev-toolkit/` 内的任何文件
2. ❌ `factory-supervisor-skill/state/STATE-SPEC.md` 与 `contracts/delivery-schema.md` 不感知本目录
3. ✅ 本目录内的工具可以引用业务 skill（单向依赖），用于读取版本号、变更规模等
4. ✅ 本目录可以独立改动，不需要 bump 业务 skill 版本

---

## 已沉淀内容

- [`enterprise-release-brief-skill/`](./enterprise-release-brief-skill/SKILL.md) — 把企微在线文档跑通的"架构生态升级专项"版式抽象成可复用生成器
- [`release-notes/`](./release-notes/) — 历次升级简报归档 + 企微样式权威源
