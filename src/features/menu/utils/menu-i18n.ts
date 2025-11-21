/**
 * Menu i18n Helper
 * 菜单国际化辅助函数
 */

/**
 * 根据菜单标题获取翻译键
 * 用于菜单管理界面显示多语言
 */
export function getMenuTitleTranslationKey(title: string): string | null {
  const titleMap: Record<string, string> = {
    // Groups
    'System Management': 'nav.system',
    'Examples': 'nav.examples',

    // Main items
    'Dashboard': 'nav.dashboard',
    'Framework Demo': 'nav.frameworkDemo',
    'User Management': 'nav.user',
    'Menu Management': 'nav.menu',
    'Settings': 'nav.settings',
    'Auth Pages': 'nav.authPages',
    'Error Pages': 'nav.errorPages',

    // Sub items - Users
    'User List': 'nav.users.list',
    'Role Management': 'nav.users.roles',
    'Permission Management': 'nav.users.permissions',
    'Roles': 'nav.roles',
    'Permissions': 'nav.permissions',

    // Sub items - Menu
    'Menu Groups': 'nav.menuGroups',
    'Menu Items': 'nav.menuItems',

    // Sub items - Settings
    'Profile': 'nav.profile',
    'Profile Settings': 'nav.profile',  // Alias for Profile
    'General': 'nav.general',
    'General Settings': 'nav.general',  // Alias for General

    // Auth Pages
    'Sign In': 'nav.signIn',
    'Sign Up': 'nav.signUp',
    'Forgot Password': 'nav.forgotPassword',
    'OTP': 'nav.otp',

    // Error Pages
    'Unauthorized': 'nav.unauthorized',
    'Forbidden': 'nav.forbidden',
    'Not Found': 'nav.notFound',
    'Internal Server Error': 'nav.internalServerError',
    'Maintenance Error': 'nav.maintenanceError',
  }

  return titleMap[title] || null
}

/**
 * 翻译菜单标题
 * 如果找到翻译键则使用翻译，否则返回原标题
 */
export function translateMenuTitle(
  title: string,
  t: (key: string, params?: Record<string, string | number>) => string
): string {
  const translationKey = getMenuTitleTranslationKey(title)
  if (translationKey) {
    try {
      return t(translationKey)
    } catch {
      return title
    }
  }
  return title
}
