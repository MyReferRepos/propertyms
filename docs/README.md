# PropertyMS 文档索引

> 最后更新: 2025-12-17

本目录包含 PropertyMS (ZoranMS) 项目的所有设计文档和分析报告。

---

## 目录结构

```
docs/
├── README.md                      # 本文件 - 文档索引
├── BUSINESS_ARCHITECTURE.md       # 业务架构文档 v3.0
├── WORKBENCH_DESIGN_ANALYSIS.md   # 工作台设计分析
└── diagrams/
    └── README.md                  # 图表说明
```

---

## 文档列表

### 架构设计

| 文档 | 描述 | 版本 | 状态 |
|------|------|------|------|
| [BUSINESS_ARCHITECTURE.md](./BUSINESS_ARCHITECTURE.md) | PropertyMS 完整业务架构，包含模块划分、路由结构、数据模型关系 | v3.0 | 待确认实施 |
| [WORKBENCH_DESIGN_ANALYSIS.md](./WORKBENCH_DESIGN_ANALYSIS.md) | 工作台功能设计分析，包含 Reminder/Task/Message 模型设计 | v1.0 | 设计分析完成 |

### 项目根目录文档

| 文档 | 路径 | 描述 |
|------|------|------|
| COMPETITIVE_ANALYSIS_DETAILED.md | `/` | 详细竞品分析报告 |
| DATA_STRUCTURE_ANALYSIS.md | `/` | 数据结构分析 |
| MARKET_ANALYSIS_NZ.md | `/` | 新西兰市场分析 |
| SIDEBAR_DESIGN_GUIDE.md | `/` | 侧边栏设计指南 |
| API_SPEC.md | `/` | API 接口规范 |
| AUTH_ARCHITECTURE_EXPLANATION.md | `/` | 认证架构说明 |
| ROUTES_DOCUMENTATION.md | `/` | 路由文档 |
| I18N_MODULAR_GUIDE.md | `/` | 模块化 i18n 指南 |
| I18N_QUICK_START.md | `/` | i18n 快速开始 |
| AG_GRID_DEMO.md | `/` | AG Grid 使用示例 |
| SERVER_PAGINATION_GUIDE.md | `/` | 服务端分页指南 |
| BACKEND_API_SPECIFICATION.md | `/` | 后端 API 规范 |
| BACKEND_DATABASE_SCHEMA_GUIDE.md | `/` | 后端数据库模式 |
| DEVELOPMENT_GUIDELINES.md | `/` | 开发指南 |
| QUICKSTART.md | `/` | 快速开始 |
| FRAMEWORK.md | `/` | 框架说明 |

---

## 关键设计文档摘要

### 1. 业务架构 (BUSINESS_ARCHITECTURE.md)

**核心变更：**
- Properties 模块从简单列表变为核心业务枢纽
- Tenancies 从独立模块移入 Properties 子模块
- 新增 Owners、Leasing Process、Suppliers、Accounting 等模块

**模块清单：**
- Dashboard - 仪表盘
- Settings - 系统设置
- Accounting - 财务会计（含 Audit）
- Marketing - 营销管理
- Owners - 业主管理
- Tenants - 租客管理
- Properties - 房产管理（核心）
- Leasing Process - 租赁流程
- Suppliers - 供应商管理
- Reports - 报表中心

### 2. 工作台设计 (WORKBENCH_DESIGN_ANALYSIS.md)

**核心决策：**
- Reminder 和 Task 不完全合并，但在同一工作台展示
- 统一基础数据模型，通过 `itemType` 区分类型
- 支持提醒 → 任务、消息 → 任务/提醒的转化

**功能模块：**
- Today's Focus - 今日聚焦（智能优先级排序）
- Action Items - 行动项（任务 + 提醒）
- Messages - 消息中心（未读 + 待处理）

**数据类型：**
- Task - 任务（状态流转：pending → in_progress → completed）
- Reminder - 提醒（支持单次/循环，来源：手动/系统/工作流）
- Message - 消息（租客/业主/供应商/系统/团队）

---

## 文档维护指南

### 添加新文档

1. 在 `docs/` 目录创建 Markdown 文件
2. 使用统一的文档头格式：
   ```markdown
   # 文档标题

   > 版本: x.x
   > 创建日期: YYYY-MM-DD
   > 状态: 草稿/设计中/完成/已实施
   ```
3. 更新本 README.md 的文档列表

### 文档命名规范

- 使用大写 SNAKE_CASE：`FEATURE_NAME_DESCRIPTION.md`
- 设计文档：`*_DESIGN_*.md`
- 分析报告：`*_ANALYSIS_*.md`
- 指南文档：`*_GUIDE.md`
- 规范文档：`*_SPEC.md` 或 `*_SPECIFICATION.md`

### 版本管理

- 主版本号：重大架构变更
- 次版本号：功能扩展
- 修订号：小修改和修复

---

**维护者**: Development Team
**最后更新**: 2025-12-17
