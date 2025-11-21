/**
 * Navigation i18n Helper
 * 导航国际化辅助函数
 */

import type { SidebarData, NavGroup, NavItem } from '../types'

/**
 * 翻译导航项
 */
export function translateNavItem(
  item: NavItem,
  t: (key: string, fallback?: string) => string
): NavItem {
  // 翻译标题
  const titleKey = getTitleTranslationKey(item.title)
  const translatedTitle = titleKey ? t(titleKey, item.title) : item.title

  // 如果有子项，返回 NavCollapsible 类型
  if ('items' in item && item.items) {
    return {
      ...item,
      title: translatedTitle,
      items: item.items.map(subItem => ({
        ...subItem,
        title: getTitleTranslationKey(subItem.title)
          ? t(getTitleTranslationKey(subItem.title)!, subItem.title)
          : subItem.title,
      })),
    }
  }

  // 否则返回 NavLink 类型
  return {
    ...item,
    title: translatedTitle,
  }
}

/**
 * 翻译导航组
 */
export function translateNavGroup(
  group: NavGroup,
  t: (key: string, fallback?: string) => string
): NavGroup {
  const translated = { ...group }
  
  // 翻译组标题
  const titleKey = getTitleTranslationKey(group.title)
  if (titleKey) {
    translated.title = t(titleKey, group.title)
  }
  
  // 翻译组内的所有导航项
  translated.items = group.items.map(item => translateNavItem(item, t))
  
  return translated
}

/**
 * 翻译整个导航数据
 */
export function translateSidebarData(
  data: SidebarData,
  t: (key: string, fallback?: string) => string
): SidebarData {
  return {
    ...data,
    navGroups: data.navGroups.map(group => translateNavGroup(group, t))
  }
}

/**
 * 根据标题获取翻译键
 */
function getTitleTranslationKey(title: string): string | null {
  const titleMap: Record<string, string> = {
    // Groups
    'System Management': 'nav.systemManagement',
    'Examples': 'nav.examples',

    // Main items
    'Dashboard': 'nav.dashboard',
    'Framework Demo': 'nav.frameworkDemo',
    'User Management': 'nav.userManagement',
    'Menu Management': 'nav.menuManagement',
    'Settings': 'nav.settings',
    'Auth Pages': 'nav.authPages',
    'Error Pages': 'nav.errorPages',

    // Sub items - Users
    'User List': 'nav.users.list',
    'Role Management': 'nav.users.roles',
    'Permission Management': 'nav.users.permissions',
    'Roles': 'nav.roles',
    'Permissions': 'nav.permissions',
    'Menu Groups': 'nav.menuGroups',
    'Menu Items': 'nav.menuItems',
    'General': 'nav.general',
    'Profile': 'nav.profile',
    'Sign In': 'nav.signIn',
    'Sign Up': 'nav.signUp',
    'Forgot Password': 'nav.forgotPassword',
    'OTP': 'nav.otp',
    'Unauthorized': 'nav.unauthorized',
    'Forbidden': 'nav.forbidden',
    'Not Found': 'nav.notFound',
    'Internal Server Error': 'nav.internalServerError',
    'Maintenance Error': 'nav.maintenanceError',
  }

  return titleMap[title] || null
}
