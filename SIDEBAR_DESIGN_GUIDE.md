# Sidebar Design Guide - Shadcn-Admin Compatibility

**Last Updated**: 2025-10-24
**Version**: 1.0

---

## 概述

本项目的 Sidebar 设计完全遵循 shadcn-admin 标准，使用 shadcn/ui 的官方 Sidebar 组件，确保现代化、响应式和可访问的导航体验。

---

## 🏗️ 组件架构

### 核心组件层次结构

```
SidebarProvider (context wrapper)
└── Sidebar (main container)
    ├── SidebarHeader (sticky top section)
    │   └── AppTitle (brand + toggle)
    ├── SidebarContent (scrollable area)
    │   └── NavGroup[] (menu sections)
    │       └── SidebarMenu
    │           ├── SidebarMenuItem (single link)
    │           └── Collapsible (for sub-menus)
    │               └── SidebarMenuSub
    ├── SidebarFooter (sticky bottom section)
    │   └── NavUser (user dropdown)
    └── SidebarRail (toggle affordance)
```

---

## 🎨 样式系统

### CSS 变量配置

已在 `src/styles/theme.css` 中配置完整的 sidebar CSS 变量：

**亮色模式** (`:root`):
```css
--sidebar: var(--background);
--sidebar-foreground: var(--foreground);
--sidebar-primary: var(--primary);
--sidebar-primary-foreground: var(--primary-foreground);
--sidebar-accent: var(--accent);
--sidebar-accent-foreground: var(--accent-foreground);
--sidebar-border: var(--border);
--sidebar-ring: var(--ring);
```

**暗色模式** (`.dark`):
```css
--sidebar: var(--background);
--sidebar-foreground: var(--foreground);
--sidebar-primary: var(--primary);
--sidebar-primary-foreground: var(--primary-foreground);
--sidebar-accent: var(--accent);
--sidebar-accent-foreground: var(--accent-foreground);
--sidebar-border: var(--border);
--sidebar-ring: var(--ring);
```

### 响应式尺寸

```javascript
SIDEBAR_WIDTH = '16rem'           // 桌面端默认宽度
SIDEBAR_WIDTH_MOBILE = '18rem'    // 移动端宽度
SIDEBAR_WIDTH_ICON = '3rem'       // 折叠状态宽度
```

---

## 📐 Collapsible 模式

支持三种折叠模式 (`collapsible` prop):

1. **"offcanvas"** - 侧边栏从屏幕外滑入/滑出
2. **"icon"** - 折叠为仅显示图标的窄边栏
3. **"none"** - 固定不可折叠

**状态持久化**:
- 使用 Cookie 存储状态: `sidebar_state`
- 有效期: 7天
- 自动读取初始状态

---

## ⌨️ 键盘快捷键

**切换 Sidebar**: `Cmd+B` (Mac) / `Ctrl+B` (Windows)

实现位置: `src/components/ui/sidebar.tsx:94-101`

---

## 🔧 实现细节

### 1. AppSidebar 组件

**位置**: `src/components/layout/app-sidebar.tsx`

**特性**:
- ✅ 从后端 API 动态加载菜单
- ✅ 基于权限自动过滤菜单项
- ✅ 支持国际化 (i18n)
- ✅ 加载状态处理
- ✅ 静态配置降级

**关键代码**:
```typescript
<Sidebar collapsible={collapsible} variant={variant}>
  <SidebarHeader>
    <AppTitle />
  </SidebarHeader>
  <SidebarContent>
    {translatedNavGroups.map((props, index) => (
      <NavGroup key={props.title || index} {...props} />
    ))}
  </SidebarContent>
  <SidebarFooter>
    <NavUser user={navUserData} />
  </SidebarFooter>
  <SidebarRail />
</Sidebar>
```

### 2. NavGroup 组件

**位置**: `src/components/layout/nav-group.tsx`

**特性**:
- ✅ 支持单级和多级菜单
- ✅ 折叠状态下显示下拉菜单
- ✅ 活动状态自动高亮
- ✅ Badge 支持
- ✅ 移动端友好

**菜单类型**:
1. **NavLink** - 单一导航链接
2. **NavCollapsible** - 可折叠的子菜单
3. **SidebarMenuCollapsedDropdown** - 折叠状态下拉菜单

### 3. AppTitle 组件

**位置**: `src/components/layout/app-title.tsx`

**特性**:
- ✅ 品牌名称和描述
- ✅ 内置切换按钮
- ✅ 移动端显示 "X"，桌面端显示 "≡"
- ✅ 点击标题返回首页

### 4. NavUser 组件

**位置**: `src/components/layout/nav-user.tsx`

**特性**:
- ✅ 用户头像 (支持 fallback)
- ✅ 用户名和邮箱显示
- ✅ 下拉菜单 (个人资料、登出)
- ✅ 响应式侧边定位
- ✅ 登出确认对话框

---

## 🎯 设计原则

### 1. **可访问性** (Accessibility)
- 使用语义化 HTML 和 ARIA 属性
- 键盘导航完全支持
- 屏幕阅读器友好
- 符合 WCAG 2.1 标准

### 2. **响应式设计** (Responsive)
- 移动端使用 Sheet 模式 (滑出式)
- 桌面端支持折叠/展开
- 触摸友好的交互区域
- 自适应不同屏幕尺寸

### 3. **性能优化** (Performance)
- 使用 React.memo 优化渲染
- 菜单数据缓存 (5分钟)
- 懒加载图标组件
- 避免不必要的重新渲染

### 4. **国际化** (i18n)
- 所有文本使用翻译键
- 支持 RTL (从右到左) 布局
- 动态语言切换
- 翻译降级处理

---

## 📊 与 Shadcn-Admin 的对比

| 特性 | Shadcn-Admin | 本项目实现 | 状态 |
|------|-------------|-----------|------|
| **组件结构** | shadcn/ui Sidebar | shadcn/ui Sidebar | ✅ 一致 |
| **CSS 变量** | 完整支持 | 完整支持 | ✅ 一致 |
| **暗色模式** | 支持 | 支持 | ✅ 一致 |
| **响应式** | 移动优先 | 移动优先 | ✅ 一致 |
| **RTL 支持** | 是 | 部分支持 | ⚠️ 可增强 |
| **键盘快捷键** | Cmd/Ctrl+B | Cmd/Ctrl+B | ✅ 一致 |
| **状态持久化** | Cookie | Cookie | ✅ 一致 |
| **动态菜单** | 静态 | API 驱动 | ✅ 更强大 |
| **权限过滤** | 无 | 完整支持 | ✅ 更强大 |

---

## 🔍 最佳实践

### 1. 菜单项命名
```typescript
// ✅ 推荐
{ title: t('nav.dashboard'), url: '/', icon: Home }

// ❌ 避免
{ title: 'Dashboard', url: '/', icon: Home }
```

### 2. 权限检查
```typescript
// ✅ 推荐 - 在菜单配置中声明权限
{
  title: 'Users',
  url: '/users',
  permission: ['user:view']
}

// ❌ 避免 - 在组件中硬编码权限
if (hasPermission('user:view')) { ... }
```

### 3. 图标使用
```typescript
// ✅ 推荐 - 使用 icon mapper
icon: getIconComponent('home')

// ✅ 也可以 - 直接传递组件
icon: Home
```

### 4. 子菜单结构
```typescript
// ✅ 推荐 - 使用 items 数组
{
  title: 'Settings',
  icon: Settings,
  items: [
    { title: 'Profile', url: '/settings/profile' },
    { title: 'Account', url: '/settings/account' }
  ]
}
```

---

## 🧪 测试清单

### 功能测试
- [ ] Sidebar 正常展开/折叠
- [ ] 移动端滑出菜单工作正常
- [ ] 键盘快捷键 Cmd/Ctrl+B 有效
- [ ] 菜单项点击导航正确
- [ ] 子菜单展开/折叠流畅
- [ ] 活动菜单项正确高亮

### 样式测试
- [ ] 亮色模式显示正常
- [ ] 暗色模式显示正常
- [ ] 折叠状态图标显示正确
- [ ] 用户头像和 fallback 正常
- [ ] Badge 数量显示正确
- [ ] 滚动条样式统一

### 权限测试
- [ ] 无权限菜单项被隐藏
- [ ] 部分权限子菜单正确过滤
- [ ] 登出后菜单清空
- [ ] 切换用户菜单更新

### 性能测试
- [ ] 初始加载时间 < 300ms
- [ ] 菜单切换无明显延迟
- [ ] 大量菜单项不卡顿
- [ ] 移动端性能良好

---

## 📝 常见问题

### Q: 如何添加新的菜单项？
A: 在后端 API 中添加菜单配置，前端会自动获取和渲染。

### Q: 如何自定义 Sidebar 颜色？
A: 修改 `src/styles/theme.css` 中的 `--sidebar-*` CSS 变量。

### Q: 如何禁用键盘快捷键？
A: 修改 `src/components/ui/sidebar.tsx` 中的快捷键监听代码。

### Q: 如何调整 Sidebar 宽度？
A: 修改 `SIDEBAR_WIDTH` 和 `SIDEBAR_WIDTH_MOBILE` 常量。

---

## 🚀 未来增强

### 计划中的功能
1. **搜索功能** - 全局菜单搜索 (Cmd+K)
2. **收藏菜单** - 用户自定义常用菜单
3. **拖拽排序** - 允许用户自定义菜单顺序
4. **主题切换器** - Sidebar 内置主题选择器
5. **通知中心** - Sidebar 底部通知面板

### 样式增强
1. **过渡动画** - 更流畅的展开/折叠动画
2. **微交互** - Hover 和 Active 状态细节
3. **加载骨架屏** - 优化加载体验
4. **自定义主题** - 支持更多配色方案

---

## 📚 参考资源

- [shadcn/ui Sidebar 文档](https://ui.shadcn.com/docs/components/sidebar)
- [shadcn-admin GitHub](https://github.com/satnaing/shadcn-admin)
- [TanStack Router 文档](https://tanstack.com/router)
- [Radix UI Primitives](https://www.radix-ui.com/)

---

**文档维护**: Development Team
**最后更新**: 2025-10-24
