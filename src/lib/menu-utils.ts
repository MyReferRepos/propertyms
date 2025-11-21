/**
 * Menu Utilities
 * 菜单工具函数 - 支持国际化
 */

import type { Menu, MenuGroup, MenuType } from '@/features/menu/types'

/**
 * 翻译函数类型
 * 匹配 useI18n 的 t 函数签名
 */
export type TranslateFn = (key: string, params?: Record<string, string | number>) => string

/**
 * 获取菜单标题（支持国际化）
 *
 * 优先级：
 * 1. i18nKey 存在 -> 使用翻译
 * 2. i18nKey 不存在 -> 使用 title 作为降级
 *
 * @param menu - 菜单对象
 * @param t - 翻译函数
 * @returns 翻译后的菜单标题
 *
 * @example
 * const title = getMenuTitle(menu, t)
 * // 如果 menu.i18nKey = "nav.dashboard" -> t("nav.dashboard") -> "仪表盘"
 * // 如果 menu.i18nKey 为空 -> menu.title -> "Dashboard"
 */
export function getMenuTitle(menu: Menu, t: TranslateFn): string {
  if (menu.i18nKey) {
    const translated = t(menu.i18nKey)
    // 如果翻译结果等于key本身，说明没有找到翻译，使用title作为fallback
    return translated !== menu.i18nKey ? translated : menu.title
  }
  return menu.title
}

/**
 * 获取菜单组名称（支持国际化）
 *
 * @param group - 菜单组对象
 * @param t - 翻译函数
 * @returns 翻译后的菜单组名称
 *
 * @example
 * const name = getMenuGroupName(group, t)
 * // 如果 group.i18nKey = "nav.system" -> t("nav.systemManagement") -> "系统管理"
 * // 如果 group.i18nKey 为空 -> group.name -> "System Management"
 */
export function getMenuGroupName(group: MenuGroup, t: TranslateFn): string {
  if (group.i18nKey) {
    const translated = t(group.i18nKey)
    // 如果翻译结果等于key本身，说明没有找到翻译，使用name作为fallback
    return translated !== group.i18nKey ? translated : group.name
  }
  return group.name
}

/**
 * 获取菜单类型标签（支持国际化）
 *
 * @param menuType - 菜单类型
 * @param t - 翻译函数
 * @returns 翻译后的类型标签
 *
 * @example
 * const label = getMenuTypeLabel('directory', t)
 * // 中文: "目录"
 * // 英文: "Directory"
 */
export function getMenuTypeLabel(menuType: MenuType | string, t: TranslateFn): string {
  const key = `menu.menuType.${menuType}`
  const translated = t(key)
  // 如果翻译结果等于key本身，说明没有找到翻译，使用menuType作为fallback
  return translated !== key ? translated : menuType
}

/**
 * 递归翻译菜单树
 *
 * @param menus - 菜单树数组
 * @param t - 翻译函数
 * @returns 翻译后的菜单树（不修改原数组）
 *
 * @example
 * const translatedMenus = translateMenuTree(menus, t)
 */
export function translateMenuTree(menus: Menu[], t: TranslateFn): Menu[] {
  return menus.map(menu => ({
    ...menu,
    // 使用翻译后的标题
    title: getMenuTitle(menu, t),
    // 递归翻译子菜单
    children: menu.children ? translateMenuTree(menu.children, t) : undefined,
  }))
}

/**
 * 获取菜单的完整路径（面包屑）
 *
 * @param menuId - 菜单ID
 * @param allMenus - 所有菜单的扁平列表
 * @param t - 翻译函数
 * @returns 面包屑路径数组
 *
 * @example
 * const breadcrumbs = getMenuBreadcrumbs('menu-id', allMenus, t)
 * // [{ id: '1', title: '系统管理' }, { id: '2', title: '用户管理' }]
 */
export function getMenuBreadcrumbs(
  menuId: string,
  allMenus: Menu[],
  t: TranslateFn
): Array<{ id: string; title: string; path?: string }> {
  const breadcrumbs: Array<{ id: string; title: string; path?: string }> = []

  const findPath = (currentId: string): boolean => {
    const menu = allMenus.find(m => m.id === currentId)
    if (!menu) return false

    // 如果有父菜单，先递归找父菜单
    if (menu.parentId) {
      findPath(menu.parentId)
    }

    // 不在面包屑中隐藏的菜单才添加
    if (!menu.hiddenInBreadcrumb) {
      breadcrumbs.push({
        id: menu.id,
        title: getMenuTitle(menu, t),
        path: menu.path,
      })
    }

    return true
  }

  findPath(menuId)
  return breadcrumbs
}

/**
 * 检查菜单是否可见
 *
 * @param menu - 菜单对象
 * @returns 是否可见
 */
export function isMenuVisible(menu: Menu): boolean {
  return menu.isActive && menu.visible
}

/**
 * 过滤可见菜单
 *
 * @param menus - 菜单数组
 * @returns 过滤后的菜单数组
 */
export function filterVisibleMenus(menus: Menu[]): Menu[] {
  return menus
    .filter(isMenuVisible)
    .map(menu => ({
      ...menu,
      children: menu.children ? filterVisibleMenus(menu.children) : undefined,
    }))
}

/**
 * 将扁平菜单列表转换为树形结构
 *
 * @param flatMenus - 扁平菜单列表
 * @returns 树形菜单结构
 */
export function buildMenuTree(flatMenus: Menu[]): Menu[] {
  const menuMap = new Map<string, Menu>()
  const rootMenus: Menu[] = []

  // 创建映射并初始化 children
  flatMenus.forEach(menu => {
    menuMap.set(menu.id, { ...menu, children: [] })
  })

  // 构建树形结构
  flatMenus.forEach(menu => {
    const currentMenu = menuMap.get(menu.id)!

    if (menu.parentId) {
      const parent = menuMap.get(menu.parentId)
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }
        parent.children.push(currentMenu)
      } else {
        // 父菜单不存在，视为根菜单
        rootMenus.push(currentMenu)
      }
    } else {
      rootMenus.push(currentMenu)
    }
  })

  // 清理空的 children 数组
  const cleanEmptyChildren = (menus: Menu[]) => {
    menus.forEach(menu => {
      if (menu.children && menu.children.length === 0) {
        delete menu.children
      } else if (menu.children) {
        cleanEmptyChildren(menu.children)
      }
    })
  }

  cleanEmptyChildren(rootMenus)

  return rootMenus
}

/**
 * 根据排序值对菜单排序
 *
 * @param menus - 菜单数组
 * @returns 排序后的菜单数组
 */
export function sortMenus(menus: Menu[]): Menu[] {
  const sorted = [...menus].sort((a, b) => a.sortOrder - b.sortOrder)

  return sorted.map(menu => ({
    ...menu,
    children: menu.children ? sortMenus(menu.children) : undefined,
  }))
}

/**
 * 查找菜单项
 *
 * @param menus - 菜单树
 * @param predicate - 查找条件
 * @returns 找到的菜单项或 undefined
 */
export function findMenu(
  menus: Menu[],
  predicate: (menu: Menu) => boolean
): Menu | undefined {
  for (const menu of menus) {
    if (predicate(menu)) {
      return menu
    }

    if (menu.children) {
      const found = findMenu(menu.children, predicate)
      if (found) {
        return found
      }
    }
  }

  return undefined
}

/**
 * 通过路径查找菜单
 *
 * @param menus - 菜单树
 * @param path - 路径
 * @returns 找到的菜单项或 undefined
 */
export function findMenuByPath(menus: Menu[], path: string): Menu | undefined {
  return findMenu(menus, menu => menu.path === path)
}

/**
 * 通过名称查找菜单
 *
 * @param menus - 菜单树
 * @param name - 名称
 * @returns 找到的菜单项或 undefined
 */
export function findMenuByName(menus: Menu[], name: string): Menu | undefined {
  return findMenu(menus, menu => menu.name === name)
}
