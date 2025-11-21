# AG Grid Demo 页面功能说明

访问路由：`/demo` 查看完整的AG Grid表格功能演示

## 实现的功能

### 1. 基础表格功能

#### 数据展示
- ✅ 20条示例员工数据
- ✅ 10个列：ID、姓名、邮箱、角色、部门、状态、入职日期、薪资、绩效、操作
- ✅ 响应式列宽（flex布局）
- ✅ 固定列宽选项

#### 排序功能
- ✅ 支持所有列的单列排序
- ✅ 点击列头进行升序/降序切换
- ✅ 多列排序支持

#### 过滤功能
- ✅ 文本列过滤（姓名、邮箱、角色、部门）
- ✅ 日期列过滤（入职日期）
- ✅ 数字列过滤（薪资、绩效）
- ✅ 列头过滤图标

#### 分页功能
- ✅ 每页10条数据
- ✅ 分页控制器
- ✅ 页码跳转
- ✅ 总页数显示

### 2. 高级功能

#### 行选择
- ✅ 复选框行选择
- ✅ 多行选择支持
- ✅ 全选/取消全选（列头复选框）
- ✅ 选中行数实时统计
- ✅ 批量删除选中行

#### 全局搜索
- ✅ 搜索框实时过滤
- ✅ 跨所有字段搜索
- ✅ 搜索结果统计
- ✅ 清除搜索按钮

#### 自定义单元格渲染器

**1. 状态Badge渲染器**
```typescript
// 使用Shadcn UI的Badge组件
- Active: 蓝色默认badge
- Inactive: 红色destructive badge
- Pending: 灰色secondary badge
```

**2. 薪资格式化**
```typescript
// 金额格式化显示
$50,000 → $50,000
$150,000 → $150,000
```

**3. 绩效进度条渲染器**
```typescript
// 带颜色的进度条
- >= 80%: 绿色
- 60-79%: 黄色
- < 60%: 红色
// 显示百分比数值和进度条
```

**4. 操作按钮渲染器**
```typescript
// 每行两个操作按钮
- Edit按钮：编辑功能（显示toast）
- Delete按钮：删除当前行（实时更新表格）
```

#### 列固定（Pinning）
- ✅ 操作列固定在右侧
- ✅ 滚动时操作列始终可见

### 3. 交互功能

#### 数据操作
- ✅ 单行删除（点击删除按钮）
- ✅ 批量删除（选中后点击批量删除）
- ✅ 重置数据（重新生成20条数据）
- ✅ 编辑操作（Toast提示）

#### 实时统计
- ✅ 总数据量显示
- ✅ 过滤后数量显示
- ✅ 选中行数显示

#### 用户体验
- ✅ 行动画效果
- ✅ 范围选择支持
- ✅ Toast通知反馈
- ✅ 主题自适应（亮/暗模式）

### 4. 数据模型

```typescript
interface DemoUser {
  id: string              // 员工ID
  name: string            // 姓名
  email: string           // 邮箱
  role: string            // 角色（Admin/User/Manager/Developer/Designer）
  department: string      // 部门（Engineering/Sales/Marketing/HR/Finance）
  status: 'active' | 'inactive' | 'pending'  // 状态
  joinDate: string        // 入职日期 (YYYY-MM-DD)
  salary: number          // 薪资 ($50,000 - $145,000)
  performance: number     // 绩效评分 (60% - 99%)
}
```

## 代码示例

### 使用自定义渲染器

```typescript
// 状态Badge渲染器
const StatusCellRenderer = (props: ICellRendererParams<DemoUser>) => {
  const status = props.value as 'active' | 'inactive' | 'pending'
  const variant = {
    active: 'default' as const,
    inactive: 'destructive' as const,
    pending: 'secondary' as const,
  }[status]

  return (
    <Badge variant={variant} className='capitalize'>
      {status}
    </Badge>
  )
}
```

### 列定义示例

```typescript
const columnDefs: ColDef<DemoUser>[] = [
  {
    field: 'id',
    headerName: 'ID',
    width: 80,
    // 复选框通过 gridOptions.rowSelection 配置
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    cellRenderer: StatusCellRenderer,  // 自定义渲染
    filter: true,                      // 启用过滤
  },
  {
    field: 'salary',
    headerName: 'Salary',
    width: 130,
    valueFormatter: currencyFormatter, // 格式化显示
    filter: 'agNumberColumnFilter',    // 数字过滤器
  },
  {
    headerName: 'Actions',
    width: 120,
    cellRenderer: ActionCellRenderer,
    pinned: 'right',      // 固定在右侧
    sortable: false,      // 禁用排序
    filter: false,        // 禁用过滤
  },
]
```

### AG Grid配置

```typescript
<AgGridTable
  rowData={filteredData}
  columnDefs={columnDefs}
  height='600px'
  pagination
  paginationPageSize={10}
  onSelectionChanged={setSelectedRows}
  gridOptions={{
    rowSelection: {                    // 行选择配置（v32.2+新API）
      mode: 'multiRow',               // 多行选择模式
      checkboxes: true,               // 启用复选框
      headerCheckbox: true,           // 列头全选框
      enableClickSelection: false,    // 禁用行点击选择
    },
    animateRows: true,                 // 行动画
    paginationPageSizeSelector: [10, 20, 50, 100],  // 分页大小选择器
  }}
/>
```

## 功能特点总结

| 功能 | 状态 | 说明 |
|------|------|------|
| 多列排序 | ✅ | 点击列头排序 |
| 列过滤 | ✅ | 文本/数字/日期过滤器 |
| 分页 | ✅ | 每页10条，可自定义 |
| 行选择 | ✅ | 单选/多选/全选 |
| 自定义渲染 | ✅ | Badge、进度条、按钮 |
| 行操作 | ✅ | 编辑、删除 |
| 固定列 | ✅ | 操作列固定右侧 |
| 全局搜索 | ✅ | 跨所有字段搜索 |
| 主题适配 | ✅ | 自动亮/暗模式 |
| 响应式 | ✅ | 自动调整列宽 |

## 扩展建议

可以进一步扩展的功能：
1. 导出Excel/CSV
2. 列隐藏/显示控制
3. 列拖拽排序
4. 行拖拽重排
5. 分组显示
6. 树形数据
7. 主从表格
8. 单元格编辑
9. 右键菜单
10. 工具面板

## 性能优化

- 使用 `useMemo` 缓存列定义
- 使用 `useMemo` 缓存过滤数据
- AG Grid内置虚拟滚动（大数据集）
- 分页减少DOM渲染

## 相关文档

- [AG Grid官方文档](https://www.ag-grid.com/react-data-grid/)
- [框架使用文档](./FRAMEWORK.md)
