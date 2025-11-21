# i18n 快速开始

## 🚀 5 分钟快速上手

### 场景 1：我是新功能开发者，需要添加翻译

**只需 3 步：**

#### 1. 在你的功能模块下创建翻译文件

```bash
# 假设你在开发 orders 模块
mkdir -p src/features/orders/locales
```

#### 2. 创建翻译文件

**`src/features/orders/locales/zh-CN.json`**
```json
{
  "title": "订单管理",
  "createOrder": "创建订单",
  "orderList": "订单列表"
}
```

**`src/features/orders/locales/en.json`**
```json
{
  "title": "Order Management",
  "createOrder": "Create Order",
  "orderList": "Order List"
}
```

#### 3. 在组件中使用

```tsx
import { useI18n } from '@/lib/i18n'

function OrdersPage() {
  const { t } = useI18n()

  return (
    <div>
      <h1>{t('orders.title')}</h1>
      <button>{t('orders.createOrder')}</button>
    </div>
  )
}
```

**✅ 完成！** 无需任何配置或注册，系统自动加载你的翻译。

---

### 场景 2：我需要使用通用词汇

**直接使用全局翻译：**

```tsx
import { useI18n } from '@/lib/i18n'

function MyComponent() {
  const { t } = useI18n()

  return (
    <div>
      <button>{t('common.save')}</button>
      <button>{t('common.cancel')}</button>
      <button>{t('common.delete')}</button>
    </div>
  )
}
```

**常用全局翻译键：**

| 键名 | 中文 | 英文 |
|------|------|------|
| `common.save` | 保存 | Save |
| `common.cancel` | 取消 | Cancel |
| `common.delete` | 删除 | Delete |
| `common.edit` | 编辑 | Edit |
| `common.create` | 创建 | Create |
| `common.search` | 搜索 | Search |
| `common.loading` | 加载中... | Loading... |

---

### 场景 3：我需要添加新的全局翻译

**只有核心团队成员才需要做这个！**

#### 1. 在全局翻译目录添加

**`src/locales/zh-CN/common.json`**
```json
{
  // 添加新键
  "export": "导出",
  "import": "导入"
}
```

**`src/locales/en/common.json`**
```json
{
  // 对应的英文翻译
  "export": "Export",
  "import": "Import"
}
```

#### 2. 使用

```tsx
<button>{t('common.export')}</button>
```

---

## 💡 翻译键命名规范

### ✅ 好的命名

```json
{
  "title": "用户管理",
  "addUser": "添加用户",
  "deleteUser": "删除用户",
  "confirmDelete": "确认删除"
}
```

### ❌ 不好的命名

```json
{
  "user_title": "用户管理",        // 不要用下划线
  "add_user": "添加用户",
  "user": {                        // 避免深层嵌套
    "actions": {
      "delete": "删除用户"
    }
  }
}
```

---

## 🔧 常见问题

### Q: 翻译不生效？

**检查清单：**
1. ✅ 文件路径正确？`src/features/{模块}/locales/{语言}.json`
2. ✅ JSON 格式正确？（没有多余逗号、引号配对）
3. ✅ 使用的键名正确？`t('模块名.键名')`
4. ✅ 重启开发服务器？（有时需要）

### Q: 如何使用动态值？

```tsx
// 翻译文件
{
  "welcomeUser": "欢迎，{name}！",
  "itemCount": "共 {count} 项"
}

// 使用
t('users.welcomeUser').replace('{name}', userName)
t('users.itemCount').replace('{count}', '10')
```

### Q: 如何切换语言？

```tsx
import { useI18n } from '@/lib/i18n'

function LanguageSwitcher() {
  const { language, setLanguage } = useI18n()

  return (
    <select value={language} onChange={(e) => setLanguage(e.target.value)}>
      <option value="zh-CN">中文</option>
      <option value="en">English</option>
    </select>
  )
}
```

---

## 📚 更多文档

- 📖 [完整架构指南](./I18N_MODULAR_GUIDE.md) - 深入了解架构设计
- 🔄 [迁移指南](./I18N_MODULAR_GUIDE.md#迁移指南) - 从旧版迁移
- 🎯 [最佳实践](./I18N_MODULAR_GUIDE.md#最佳实践) - 提高效率

---

## ⚡ 示例代码

### 完整的功能模块示例

```tsx
// src/features/products/pages/index.tsx
import { useI18n } from '@/lib/i18n'
import { Button } from '@/components/ui/button'

function ProductsPage() {
  const { t } = useI18n()

  return (
    <div>
      {/* 使用模块翻译 */}
      <h1>{t('products.title')}</h1>
      <p>{t('products.description')}</p>

      {/* 使用全局翻译 */}
      <div className="actions">
        <Button>{t('common.create')}</Button>
        <Button>{t('common.search')}</Button>
      </div>

      {/* 动态值 */}
      <p>{t('products.totalItems').replace('{count}', '100')}</p>
    </div>
  )
}
```

**对应的翻译文件：**

```json
// src/features/products/locales/zh-CN.json
{
  "title": "产品管理",
  "description": "管理所有产品信息",
  "totalItems": "共 {count} 个产品"
}
```

---

**需要帮助？** 查看 [完整文档](./I18N_MODULAR_GUIDE.md) 或联系团队负责人。
