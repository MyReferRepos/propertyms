# PropertyMS 业务架构图

> 版本: 3.0
> 更新日期: 2025-12-14
> 格式: draw.io (.drawio)

## 文件列表

| 文件名 | 描述 | 模块 |
|--------|------|------|
| `01-main-architecture.drawio` | 总业务架构图 | 全局 |
| `02-properties-module.drawio` | Properties 模块架构 | Properties (核心) |
| `03-tenancies-submodule.drawio` | Tenancies 子模块架构 | Properties > Tenancies |
| `04-leasing-process.drawio` | 租赁流程模块 | Leasing Process |
| `05-suppliers.drawio` | 供应商管理模块 | Suppliers |
| `06-accounting.drawio` | 财务会计模块 | Accounting (含 Audit) |
| `07-marketing.drawio` | 营销管理模块 | Marketing |
| `08-owners-tenants.drawio` | 业主与租客管理 | Owners & Tenants |
| `09-reports.drawio` | 报表管理模块 | Reports |

## 如何使用

### 方式一：使用 draw.io 在线编辑器

1. 访问 [draw.io](https://app.diagrams.net/)
2. 点击 **File → Open from → Device**
3. 选择要打开的 `.drawio` 文件
4. 编辑完成后，**File → Save** 保存

### 方式二：使用 VS Code 插件

1. 安装 VS Code 扩展: **Draw.io Integration** (hediet.vscode-drawio)
2. 直接双击 `.drawio` 文件即可在 VS Code 中打开编辑

### 方式三：使用 draw.io 桌面应用

1. 下载 [draw.io Desktop](https://github.com/jgraph/drawio-desktop/releases)
2. 直接打开 `.drawio` 文件

## 导出选项

在 draw.io 中，可以导出为以下格式：

- **PNG/JPG** - 用于文档嵌入
- **SVG** - 矢量图，适合网页
- **PDF** - 用于打印或分享
- **HTML** - 可嵌入网页的交互式图表

## 配色说明

| 颜色 | 含义 |
|------|------|
| 🔵 蓝色 (#dae8fc) | 现有模块 / 基础功能 |
| 🟡 黄色 (#fff2cc) | 新增模块 |
| 🟢 绿色 (#d5e8d4) | 人员管理 / 收入相关 |
| 🔴 红色 (#f8cecc) | 核心枢纽 / 支出相关 |
| 🟣 紫色 (#e1d5e7) | 租约相关 |
| 🟠 橙色 (#ffe6cc) | 次级功能 |

## 架构概览

```
PropertyMS v3.0
├── Dashboard (仪表盘)
├── Settings (设置)
├── Accounting (财务会计)
│   └── Audit (审计 - 可独立)
├── Marketing (营销)
│   ├── Potential Leads
│   └── Old Owners
├── Owners (业主管理)
├── Tenants (租客管理)
├── Properties ⭐ (核心枢纽)
│   ├── Keys, Floor Plan, Maintenance
│   ├── Ads & Photos, Settings
│   ├── Compliances, Tribunals
│   ├── Insurance Claim, Complicated Maintenance
│   ├── Debt Collection
│   └── Tenancies (租约核心)
│       ├── Documents, Bond, Rent & Bills
│       ├── Communications, Repayment Plan
│       ├── Handover, Inspections
│       └── Vacancy Status (Moving in/Current/Moving out)
├── Leasing Process (租赁流程)
│   └── Listing → Viewing → Application → Agreement
├── Suppliers (供应商)
│   └── Quote → Assign → Complete → Review
└── Reports (报表)
    └── IRD Related Reports (年度财务)
```

## 更新记录

- **2025-12-14** - 初始版本，包含 9 个架构图
