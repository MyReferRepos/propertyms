# PropertyMS 业务架构文档

> 版本: 3.0
> 更新日期: 2025-12-14
> 状态: 产品需求重新定义

---

## 一、新旧导航结构对比

### 现有结构 (Current)

```
├── Dashboard
├── Properties
├── Compliance
├── Investor Dashboard
├── Tenancies
├── Tenants
├── Maintenance
├── Inspections
├── Financials
├── Reports
├── AI Insights
└── Settings
```

### 新结构 (New)

```
├── Dashboard
├── Settings
├── Accounting (含 Audit 模块)
├── Marketing
│   ├── Potential Leads
│   └── Old Owners
├── Owners
├── Tenants
├── Properties ⭐ (核心扩展)
│   ├── Keys Management
│   ├── Floor Plan
│   ├── Maintenance
│   ├── Tenancies (大幅扩展)
│   │   ├── Moving in / Current / Moving out
│   │   ├── Documents (Lease, Application, Bond Form)
│   │   ├── Bond (Lodge / Release)
│   │   ├── Rent & Bills
│   │   ├── Communications
│   │   ├── Repayment Plan
│   │   ├── Handover Information
│   │   ├── Vacancy Status
│   │   └── Inspections
│   ├── Tribunals (Quote)
│   ├── Ads & Photos
│   ├── Settings (Bedrooms, Details)
│   ├── Compliances (Healthy Homes, Smoke Alarm, Pool)
│   ├── Insurance Claim (Quote)
│   ├── Complicated Maintenance (Quote)
│   └── Debt Collection (Company)
├── Leasing Process
│   ├── Listing Properties
│   ├── Viewing Tracker
│   ├── Application & Credit Checks
│   └── Agreement & Bond Form
├── Suppliers
│   ├── Quote Request
│   ├── Work Assignment
│   ├── Work Complete
│   └── Work Review
└── Reports
    └── IRD Related Reports (Yearly Financial)
```

---

## 二、变更分析

### 新增模块 (New)

| 模块 | 说明 | 优先级 |
|------|------|--------|
| **Accounting** | 财务会计模块，含 Audit 子模块 | P1 |
| **Marketing** | 营销获客模块 | P2 |
| **Owners** | 业主管理（独立模块） | P1 |
| **Leasing Process** | 租赁流程管理（全新） | P1 |
| **Suppliers** | 供应商管理（全新） | P1 |
| **Tribunals** | 仲裁管理 | P2 |
| **Debt Collection** | 债务追收 | P2 |
| **Insurance Claim** | 保险理赔 | P2 |

### 移除/合并模块 (Removed/Merged)

| 原模块 | 处理方式 |
|--------|----------|
| **Investor Dashboard** | 移除（或合并到 Owners） |
| **AI Insights** | 移除（暂不体现在主导航） |
| **Financials** | 合并到 Accounting |
| **独立的 Compliance** | 移入 Properties 子模块 |
| **独立的 Maintenance** | 移入 Properties 子模块 |
| **独立的 Inspections** | 移入 Properties > Tenancies 子模块 |

### 重大重构 (Major Restructure)

**Properties 模块** 从简单列表变为核心业务枢纽：
- 原来: 仅有 Properties List + Property Detail
- 现在: 包含 12+ 子模块，以房产为中心组织所有相关业务

**Tenancies** 从独立模块变为 Properties 的核心子模块：
- 原来: 独立的 /tenancies 路由
- 现在: /properties/:id/tenancies 下的复杂子系统

---

## 三、总业务架构图

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           PropertyMS 业务架构 v3.0                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐          │
│  │  Dashboard  │   │  Settings   │   │ Accounting  │   │  Marketing  │          │
│  │   仪表盘    │   │    设置     │   │   财务会计   │   │    营销     │          │
│  └─────────────┘   └─────────────┘   └──────┬──────┘   └──────┬──────┘          │
│                                             │                  │                 │
│                                        ┌────┴────┐       ┌─────┴─────┐          │
│                                        │  Audit  │       │  Leads    │          │
│                                        │  审计   │       │ Old Owners│          │
│                                        └─────────┘       └───────────┘          │
│                                                                                  │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐                            │
│  │   Owners    │   │   Tenants   │   │  Suppliers  │                            │
│  │   业主管理   │   │   租客管理   │   │  供应商管理  │                            │
│  └─────────────┘   └─────────────┘   └──────┬──────┘                            │
│                                             │                                    │
│                                   ┌─────────┴─────────┐                         │
│                                   │ Quote → Assign →  │                         │
│                                   │ Complete → Review │                         │
│                                   └───────────────────┘                         │
│                                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │                        ⭐ Properties (核心业务枢纽)                        │   │
│  ├──────────────────────────────────────────────────────────────────────────┤   │
│  │                                                                           │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │   │
│  │  │   Keys   │ │  Floor   │ │Maintenance│ │   Ads    │ │ Settings │       │   │
│  │  │  钥匙管理 │ │   Plan   │ │   维护    │ │  广告照片 │ │  房产设置 │       │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘       │   │
│  │                                                                           │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │   │
│  │  │Compliances│ │Tribunals │ │Insurance │ │Complicated│ │   Debt   │       │   │
│  │  │  合规检查 │ │   仲裁   │ │ Claim    │ │Maintenance│ │Collection│       │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘       │   │
│  │                                                                           │   │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │   │
│  │  │                      Tenancies (租约管理)                           │  │   │
│  │  ├────────────────────────────────────────────────────────────────────┤  │   │
│  │  │ Status │ Documents │ Bond │ Rent │ Comms │ Handover │ Inspections │  │   │
│  │  │ 状态   │   文档    │ 押金 │ 账单 │ 沟通  │   交接    │    检查     │  │   │
│  │  └────────────────────────────────────────────────────────────────────┘  │   │
│  │                                                                           │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│  ┌────────────────────────────────┐   ┌────────────────────────────────┐        │
│  │      Leasing Process           │   │           Reports              │        │
│  │         租赁流程                │   │            报表                │        │
│  ├────────────────────────────────┤   ├────────────────────────────────┤        │
│  │ Listing → Viewing → Application│   │     IRD Related Reports        │        │
│  │         → Agreement            │   │      (Yearly Financial)        │        │
│  └────────────────────────────────┘   └────────────────────────────────┘        │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 四、模块详细架构图

### 4.1 Properties 模块架构

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Properties 模块架构                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  /properties                                                                 │
│  ├── /properties (列表)                                                      │
│  │                                                                           │
│  └── /properties/:propertyId (详情)                                          │
│      │                                                                       │
│      ├── /keys              钥匙管理                                         │
│      │                                                                       │
│      ├── /floor-plan        平面图                                           │
│      │                                                                       │
│      ├── /maintenance       维护管理                                         │
│      │                                                                       │
│      ├── /ads-photos        广告与照片                                       │
│      │                                                                       │
│      ├── /settings          房产设置                                         │
│      │   ├── Bedrooms                                                        │
│      │   └── Other Property Details                                          │
│      │                                                                       │
│      ├── /compliances       合规检查                                         │
│      │   ├── Healthy Homes                                                   │
│      │   ├── Smoke Alarm                                                     │
│      │   └── Swimming Pool                                                   │
│      │                                                                       │
│      ├── /tribunals         仲裁法庭                                             │
│      │   └── Quote                                                           │
│      │                                                                       │
│      ├── /insurance-claim   保险理赔                                         │
│      │   └── Quote                                                           │
│      │                                                                       │
│      ├── /complicated-maintenance  复杂维护                                  │
│      │   └── Quote                                                           │
│      │                                                                       │
│      ├── /debt-collection   债务追收                                         │
│      │   └── Company                                                         │
│      │                                                                       │
│      └── /tenancies         租约管理 ⭐                                       │
│          └── (详见 4.2)                                                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Tenancies 子模块架构

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Tenancies 子模块架构                                 │
│                    /properties/:propertyId/tenancies                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      Vacancy Status 租约状态                         │    │
│  ├─────────────────────────────────────────────────────────────────────┤    │
│  │   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐              │    │
│  │   │  Moving In  │ → │   Current   │ → │ Moving Out  │              │    │
│  │   │   入住中    │   │   在租中    │   │   退租中    │              │    │
│  │   └─────────────┘   └─────────────┘   └─────────────┘              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  /tenancies/:tenancyId                                                       │
│  │                                                                           │
│  ├── /documents           文档管理                                           │
│  │   ├── Lease Agreement       租约合同                                      │
│  │   ├── Application Form      申请表                                        │
│  │   └── Signed Bond Form      已签押金表                                    │
│  │                                                                           │
│  ├── /bond                押金管理                                           │
│  │   ├── Lodge                 押金托管                                      │
│  │   └── Release               押金释放                                      │
│  │                                                                           │
│  ├── /rent-bills          租金与账单                                         │
│  │                                                                           │
│  ├── /communications      沟通记录                                           │
│  │                                                                           │
│  ├── /repayment-plan      还款计划                                           │
│  │                                                                           │
│  ├── /handover            交接信息                                           │
│  │   ├── Keys                  钥匙                                          │
│  │   ├── Bins                  垃圾桶                                        │
│  │   ├── Remotes               遥控器                                        │
│  │   └── Chattels              动产                                          │
│  │                                                                           │
│  └── /inspections         检查记录                                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.3 Leasing Process 模块架构

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Leasing Process 模块架构                               │
│                           租赁流程管理                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│     ┌──────────────┐    ┌──────────────┐    ┌──────────────┐               │
│     │   Listing    │    │   Viewing    │    │ Application  │               │
│     │  Properties  │ →  │   Tracker    │ →  │    & Credit  │               │
│     │   房源上架    │    │   看房跟踪    │    │  Checks 审核 │               │
│     └──────────────┘    └──────────────┘    └──────────────┘               │
│                                                     │                        │
│                                                     ▼                        │
│                                            ┌──────────────┐                 │
│                                            │  Agreement   │                 │
│                                            │  & Bond Form │                 │
│                                            │  合同与押金   │                 │
│                                            └──────────────┘                 │
│                                                                              │
│  /leasing-process                                                            │
│  ├── /listing           房源上架管理                                         │
│  ├── /viewing-tracker   看房预约跟踪                                         │
│  ├── /applications      申请与信用检查                                       │
│  └── /agreements        合同与押金表签署                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.4 Suppliers 模块架构

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Suppliers 模块架构                                   │
│                          供应商管理                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│     ┌──────────────┐    ┌──────────────┐    ┌──────────────┐               │
│     │    Quote     │    │     Work     │    │     Work     │               │
│     │   Request    │ →  │  Assignment  │ →  │   Complete   │               │
│     │   报价请求    │    │   工作分配    │    │   完工确认   │               │
│     └──────────────┘    └──────────────┘    └──────────────┘               │
│                                                     │                        │
│                                                     ▼                        │
│                                            ┌──────────────┐                 │
│                                            │     Work     │                 │
│                                            │    Review    │                 │
│                                            │    工作评价   │                 │
│                                            └──────────────┘                 │
│                                                                              │
│  /suppliers                                                                  │
│  ├── /suppliers (列表)      供应商列表                                       │
│  ├── /quote-requests        报价请求管理                                     │
│  ├── /work-assignments      工作分配管理                                     │
│  ├── /work-complete         完工确认管理                                     │
│  └── /work-reviews          工作评价管理                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.5 Accounting 模块架构

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Accounting 模块架构                                   │
│                           财务会计                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  /accounting                                                                 │
│  │                                                                           │
│  ├── /accounting (Dashboard)     财务概览                                    │
│  │   ├── 收入统计                                                            │
│  │   ├── 支出统计                                                            │
│  │   └── 账户余额                                                            │
│  │                                                                           │
│  ├── /transactions              交易记录                                     │
│  │   ├── Income (收入)                                                       │
│  │   └── Expense (支出)                                                      │
│  │                                                                           │
│  ├── /invoices                  发票管理                                     │
│  │                                                                           │
│  ├── /reconciliation            账户对账                                     │
│  │                                                                           │
│  └── /audit ⭐                  审计模块 (可独立)                             │
│      ├── Audit Logs             审计日志                                     │
│      ├── Compliance Reports     合规报告                                     │
│      └── Financial Audits       财务审计                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.6 Marketing 模块架构

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Marketing 模块架构                                   │
│                            营销管理                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  /marketing                                                                  │
│  │                                                                           │
│  ├── /marketing (Dashboard)     营销概览                                     │
│  │   ├── Lead Statistics        线索统计                                     │
│  │   └── Conversion Rate        转化率                                       │
│  │                                                                           │
│  ├── /potential-leads           潜在客户                                     │
│  │   ├── Lead List              线索列表                                     │
│  │   ├── Lead Sources           来源渠道                                     │
│  │   └── Follow-up Tasks        跟进任务                                     │
│  │                                                                           │
│  └── /old-owners                老业主管理                                   │
│      ├── Owner List             业主列表                                     │
│      ├── Re-engagement          重新激活                                     │
│      └── Historical Data        历史数据                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.7 Owners & Tenants 模块架构

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Owners & Tenants 模块架构                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐  │
│  │           Owners                │  │           Tenants               │  │
│  │           业主管理               │  │           租客管理               │  │
│  ├─────────────────────────────────┤  ├─────────────────────────────────┤  │
│  │                                 │  │                                 │  │
│  │  /owners                        │  │  /tenants                       │  │
│  │  ├── /owners (列表)             │  │  ├── /tenants (列表)            │  │
│  │  │                              │  │  │                              │  │
│  │  └── /owners/:ownerId (详情)    │  │  └── /tenants/:tenantId (详情)  │  │
│  │      ├── Profile    基本信息    │  │      ├── Profile    基本信息    │  │
│  │      ├── Properties 名下房产    │  │      ├── Tenancies  租约历史    │  │
│  │      ├── Financials 财务信息    │  │      ├── Documents  文档        │  │
│  │      ├── Documents  文档        │  │      ├── Payments   付款记录    │  │
│  │      └── Communications 沟通    │  │      ├── Credit     信用记录    │  │
│  │                                 │  │      └── Communications 沟通    │  │
│  │                                 │  │                                 │  │
│  └─────────────────────────────────┘  └─────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.8 Reports 模块架构

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Reports 模块架构                                    │
│                             报表管理                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  /reports                                                                    │
│  │                                                                           │
│  ├── /reports (Dashboard)        报表中心                                    │
│  │                                                                           │
│  └── /ird-reports                IRD 相关报表                                │
│      ├── Yearly Financial        年度财务报表                                │
│      │   ├── Income Statement    收入报表                                    │
│      │   ├── Expense Statement   支出报表                                    │
│      │   └── Tax Summary         税务摘要                                    │
│      │                                                                       │
│      └── Export Options          导出选项                                    │
│          ├── PDF                                                             │
│          ├── Excel                                                           │
│          └── CSV                                                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 五、路由结构规划

### 5.1 一级路由

```typescript
// 主导航路由
/dashboard              // 仪表盘
/settings               // 系统设置
/accounting             // 财务会计
/marketing              // 营销管理
/owners                 // 业主管理
/tenants                // 租客管理
/properties             // 房产管理 (核心)
/leasing-process        // 租赁流程
/suppliers              // 供应商管理
/reports                // 报表中心
```

### 5.2 Properties 子路由

```typescript
/properties                                    // 房产列表
/properties/:propertyId                        // 房产详情
/properties/:propertyId/keys                   // 钥匙管理
/properties/:propertyId/floor-plan             // 平面图
/properties/:propertyId/maintenance            // 维护管理
/properties/:propertyId/ads-photos             // 广告照片
/properties/:propertyId/settings               // 房产设置
/properties/:propertyId/compliances            // 合规检查
/properties/:propertyId/tribunals              // 仲裁
/properties/:propertyId/insurance-claim        // 保险理赔
/properties/:propertyId/complicated-maintenance // 复杂维护
/properties/:propertyId/debt-collection        // 债务追收

// Tenancies 嵌套路由
/properties/:propertyId/tenancies                           // 租约列表
/properties/:propertyId/tenancies/:tenancyId                // 租约详情
/properties/:propertyId/tenancies/:tenancyId/documents      // 文档
/properties/:propertyId/tenancies/:tenancyId/bond           // 押金
/properties/:propertyId/tenancies/:tenancyId/rent-bills     // 租金账单
/properties/:propertyId/tenancies/:tenancyId/communications // 沟通
/properties/:propertyId/tenancies/:tenancyId/repayment-plan // 还款计划
/properties/:propertyId/tenancies/:tenancyId/handover       // 交接
/properties/:propertyId/tenancies/:tenancyId/inspections    // 检查
```

---

## 六、数据模型关系图

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           数据模型关系                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                              ┌─────────┐                                    │
│                              │  Owner  │                                    │
│                              │  业主   │                                    │
│                              └────┬────┘                                    │
│                                   │ 1:N                                      │
│                                   ▼                                          │
│  ┌─────────┐   N:1    ┌──────────────────┐   1:N    ┌─────────────┐        │
│  │Marketing│ ──────── │     Property     │ ──────── │  Tenancy    │        │
│  │ Leads   │          │      房产        │          │    租约     │        │
│  └─────────┘          └────────┬─────────┘          └──────┬──────┘        │
│                                │                            │               │
│            ┌───────────────────┼───────────────────┐        │               │
│            │                   │                   │        │               │
│            ▼                   ▼                   ▼        ▼               │
│     ┌────────────┐     ┌────────────┐     ┌────────────┐ ┌────────┐        │
│     │ Compliance │     │Maintenance │     │ Insurance  │ │ Tenant │        │
│     │   合规     │     │    维护    │     │   Claim    │ │  租客  │        │
│     └────────────┘     └──────┬─────┘     └────────────┘ └────────┘        │
│                               │                                             │
│                               │ N:1                                         │
│                               ▼                                             │
│                        ┌────────────┐                                       │
│                        │  Supplier  │                                       │
│                        │   供应商   │                                       │
│                        └────────────┘                                       │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     Tenancy 关联实体                                 │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Document │ Bond │ Rent/Bill │ Communication │ Handover │ Inspection │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 七、实施建议

### Phase 1: 核心重构 (优先级 P0)

1. **重构 Properties 路由结构**
   - 将 Properties 改为支持多层嵌套的路由
   - 新增 Property Detail 的子页面框架

2. **迁移 Tenancies 到 Properties 下**
   - 路由从 `/tenancies` 改为 `/properties/:id/tenancies`
   - 保持现有功能，调整数据关联

3. **迁移 Compliance, Maintenance, Inspections**
   - 从独立模块移入 Properties 子模块

### Phase 2: 新模块开发 (优先级 P1)

1. **Owners 模块** - 独立业主管理
2. **Leasing Process 模块** - 全新租赁流程
3. **Suppliers 模块** - 供应商管理
4. **Accounting 模块** - 财务会计（合并 Financials）

### Phase 3: 扩展功能 (优先级 P2)

1. **Marketing 模块** - 营销获客
2. **Tribunals, Insurance, Debt Collection** - Properties 子功能
3. **Reports 重构** - IRD 相关报表
4. **Audit 模块** - 可独立或作为 Accounting 子模块

---

## 八、文件目录结构建议

```
src/
├── features/
│   ├── dashboard/
│   ├── settings/
│   ├── accounting/
│   │   ├── pages/
│   │   ├── components/
│   │   └── audit/           # Audit 子模块
│   ├── marketing/
│   │   ├── pages/
│   │   ├── components/
│   │   └── locales/
│   ├── owners/
│   │   ├── pages/
│   │   ├── components/
│   │   └── locales/
│   ├── tenants/
│   ├── properties/          # 核心扩展
│   │   ├── pages/
│   │   ├── components/
│   │   ├── keys/
│   │   ├── floor-plan/
│   │   ├── maintenance/
│   │   ├── ads-photos/
│   │   ├── compliances/
│   │   ├── tribunals/
│   │   ├── insurance-claim/
│   │   ├── debt-collection/
│   │   └── tenancies/       # Tenancies 子模块
│   │       ├── pages/
│   │       ├── components/
│   │       ├── documents/
│   │       ├── bond/
│   │       ├── rent-bills/
│   │       ├── communications/
│   │       ├── repayment-plan/
│   │       ├── handover/
│   │       └── inspections/
│   ├── leasing-process/
│   │   ├── pages/
│   │   ├── components/
│   │   └── locales/
│   ├── suppliers/
│   │   ├── pages/
│   │   ├── components/
│   │   └── locales/
│   └── reports/
│       ├── pages/
│       ├── components/
│       └── ird-reports/
│
└── routes/
    └── _authenticated/
        ├── dashboard.tsx
        ├── settings.tsx
        ├── accounting.tsx
        ├── accounting/
        ├── marketing.tsx
        ├── marketing/
        ├── owners.tsx
        ├── owners/
        ├── tenants.tsx
        ├── tenants/
        ├── properties.tsx
        ├── properties/
        │   ├── index.tsx
        │   ├── $propertyId.tsx
        │   └── $propertyId/
        │       ├── keys.tsx
        │       ├── floor-plan.tsx
        │       ├── maintenance.tsx
        │       ├── tenancies.tsx
        │       └── tenancies/
        ├── leasing-process.tsx
        ├── leasing-process/
        ├── suppliers.tsx
        ├── suppliers/
        └── reports.tsx
```

---

**文档版本**: 3.0
**创建日期**: 2025-12-14
**状态**: 待确认实施
