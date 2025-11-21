# Demo 页面访问指南

## 快速访问

### 1. 启动开发服务器

```bash
npm run dev
```

服务器会在可用端口启动（通常是 5173 或 5174）。

### 2. 访问Demo页面

在浏览器中打开：

```
http://localhost:5173/demo
```

或

```
http://localhost:5174/demo
```

> 注意：如果5173端口被占用，Vite会自动使用下一个可用端口。

## 页面内容

访问成功后，你应该看到：

### 1. 页面头部
- 标题："Framework Demo"
- 语言切换器（中/英文切换）

### 2. 认证状态卡片
显示当前认证状态（未登录状态下显示"Not Authenticated"）

### 3. AG Grid 表格演示区域

应该显示：
- **搜索框**：用于全局搜索
- **统计信息**：显示"Total: 20 users" 和 "Filtered: 20 users"
- **AG Grid 表格**：
  - 20行示例员工数据
  - 10个列（ID、姓名、邮箱、角色、部门、状态、入职日期、薪资、绩效、操作）
  - 分页控制器
  - 复选框选择

## 故障排查

### 问题1：看不到数据

**检查项：**

1. **查看统计信息**：应该显示 "Total: 20 users"
   - 如果显示 "Total: 0 users"，查看浏览器控制台错误

2. **打开浏览器开发者工具（F12）**
   - 控制台（Console）应该显示：`Generated sample data: 20 users`
   - 检查是否有红色错误信息

3. **检查 AG Grid CSS**
   - 表格应该有边框和清晰的列头
   - 如果表格样式混乱，可能是CSS未加载

4. **刷新页面**
   - 按 Ctrl+R（Windows）或 Cmd+R（Mac）刷新
   - 或按 Ctrl+Shift+R 强制刷新清除缓存

### 问题2：AG Grid 错误

**常见错误及解决方案：**

1. **错误：AG Grid 许可证警告**
   ```
   AG Grid: License key not found...
   ```
   - 这是正常的！我们使用的是Community Edition（免费版），此警告可以忽略
   - 功能完全正常，只是一个提示信息

2. **错误：找不到 ag-grid.css**
   ```
   Failed to load module 'ag-grid-community/styles/ag-grid.css'
   ```
   - 解决：重新安装依赖
   ```bash
   npm install ag-grid-react ag-grid-community
   ```

3. **错误：TypeError in cell renderer**
   - 打开浏览器控制台查看具体错误
   - 可能是某个自定义渲染器的问题

### 问题3：页面完全空白

1. **检查路由**
   - 确保访问的是 `/demo` 路径
   - 不是 `/_authenticated/demo`（这需要登录）

2. **检查控制台错误**
   - 打开浏览器开发者工具
   - 查看Console标签的错误信息

3. **重新构建**
   ```bash
   # 停止开发服务器（Ctrl+C）
   # 重新启动
   npm run dev
   ```

## 功能测试清单

访问成功后，测试以下功能：

- [ ] 看到20条用户数据
- [ ] 可以点击列头进行排序
- [ ] 可以使用搜索框过滤数据
- [ ] 可以选择表格行（复选框）
- [ ] 可以点击"编辑"按钮（显示Toast）
- [ ] 可以点击"删除"按钮（删除该行）
- [ ] 可以批量选择并删除
- [ ] 可以点击"Reset Data"重置数据
- [ ] 分页功能正常工作
- [ ] 状态列显示彩色Badge
- [ ] 绩效列显示进度条
- [ ] 薪资格式化显示（$50,000）

## 截图示例

正常显示应该看到：

```
Framework Demo                        [语言切换器]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[认证状态卡片]
Status: Not Authenticated

[AG Grid Advanced Table Demo]
                                    [Reset Data] [Delete Selected]

[搜索框: Search across all fields...]

Total: 20 users   Filtered: 20 users

┌────┬────────┬──────────────────┬───────┬────────┬────────┬──────────┬─────────┬────────────┬─────────┐
│ ☐  │ ID     │ Name             │ Email │ Role   │ Dept   │ Status   │ Join    │ Salary     │ Actions │
├────┼────────┼──────────────────┼───────┼────────┼────────┼──────────┼─────────┼────────────┼─────────┤
│ ☐  │ 1      │ John Doe         │ john@ │ Admin  │ Eng    │ [Active] │ 2020-01 │ $50,000    │ ✎ 🗑     │
│ ☐  │ 2      │ Jane Smith       │ jane@ │ User   │ Sales  │ [Active] │ 2021-02 │ $55,000    │ ✎ 🗑     │
...
```

## 需要帮助？

如果遇到问题：

1. **检查控制台**：打开浏览器开发者工具（F12）查看错误
2. **查看终端**：检查运行`npm run dev`的终端输出
3. **重新安装依赖**：
   ```bash
   rm -rf node_modules
   npm install
   npm run dev
   ```

## 下一步

成功访问demo页面后：

- 📖 阅读 [AG_GRID_DEMO.md](./AG_GRID_DEMO.md) 了解详细功能
- 📖 阅读 [FRAMEWORK.md](./FRAMEWORK.md) 了解框架使用
- 🚀 开始开发你自己的功能！
