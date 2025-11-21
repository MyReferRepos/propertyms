/**
 * App Sidebar
 * 应用侧边栏 - 支持动态菜单和国际化
 *
 * 更新说明：
 * - 支持从后端 API 获取动态菜单
 * - 支持基于 i18nKey 的国际化
 * - 自动权限过滤
 * - 降级到静态配置（开发模式）
 */

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useLayout } from '@/context/layout-provider'
import { useAuthStore } from '@/lib/auth'
import { useI18n } from '@/lib/i18n'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { AppTitle } from './app-title'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { translateSidebarData } from './data/navigation-i18n'
import { menuService } from '@/services/menu-service'
import { getIconComponent } from './utils/icon-mapper'
import { filterMenuByPermissions } from '@/lib/auth/menu-filter'
import { getMenuTitle, getMenuGroupName } from '@/lib/menu-utils'
import type { NavGroup as NavGroupType } from './types'
import type { Menu, MenuGroup } from '@/features/menu/types'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const accessToken = useAuthStore((state) => state.accessToken)
  const { t } = useI18n()

  // 从后端API获取菜单数据
  const { data: menuData, isLoading, isError, error } = useQuery({
    queryKey: ['sidebar-menu', user?.id, accessToken],
    queryFn: menuService.getSidebarMenu,
    enabled: !!(user && isAuthenticated && accessToken), // 确保用户已登录且有有效token
    staleTime: 5 * 60 * 1000, // 缓存5分钟
    gcTime: 10 * 60 * 1000, // 10分钟后清理
    retry: false, // 禁用重试，避免重复请求
    refetchOnMount: false, // 防止组件挂载时重复获取
    refetchOnWindowFocus: false, // 防止窗口聚焦时重复获取
  })

  // 将API返回的菜单数据转换为组件需要的格式
  const translatedNavGroups = useMemo(() => {
    // 创建翻译适配器函数
    const translateFn = (key: string, fallback?: string): string => {
      return t(key) || fallback || key
    }

    // 只有在查询失败或未启用时才使用静态数据作为fallback
    // 避免先显示静态数据再切换到API数据造成的闪烁
    if (!menuData) {
      // 如果查询未启用（用户未登录）或查询失败，使用静态配置
      if (!isAuthenticated || isError) {
        console.warn('Using static sidebar data as fallback', { isAuthenticated, isError, error })
        const translated = translateSidebarData(sidebarData, translateFn)
        return filterMenuByPermissions(translated.navGroups)
      }
      // 如果正在加载中，返回空数组（让loading状态显示）
      return []
    }

    // 转换API数据格式（新格式支持i18nKey）
    const navGroups: NavGroupType[] = menuData.menuGroups.map((group: MenuGroup & { menus: Menu[] }) => {
      // 使用 getMenuGroupName 获取翻译后的组名
      const groupTitle = getMenuGroupName(group, t)

      return {
        title: groupTitle,
        items: group.menus?.map((menu: Menu) => {
          // 使用 getMenuTitle 获取翻译后的菜单标题
          const menuTitle = getMenuTitle(menu, t)

          // 处理图标 - 确保图标名称正确映射
          const menuIcon = menu.icon ? getIconComponent(menu.icon) : undefined

          // 如果有子菜单，返回 NavCollapsible 类型
          if (menu.children && menu.children.length > 0) {
            return {
              title: menuTitle,
              icon: menuIcon,
              badge: menu.badge || menu.meta?.badge,
              permission: menu.permission?.code ? [menu.permission.code] : undefined,
              items: menu.children.map((subMenu: Menu) => ({
                title: getMenuTitle(subMenu, t),
                url: subMenu.path,
                icon: subMenu.icon ? getIconComponent(subMenu.icon) : undefined,
                badge: subMenu.badge || subMenu.meta?.badge,
                permission: subMenu.permission?.code ? [subMenu.permission.code] : undefined,
              })),
            }
          }

          // 否则返回 NavLink 类型
          return {
            title: menuTitle,
            url: menu.path,
            icon: menuIcon,
            badge: menu.badge || menu.meta?.badge,
            permission: menu.permission?.code ? [menu.permission.code] : undefined,
          }
        }) || [],
      }
    })

    // 根据权限过滤菜单
    return filterMenuByPermissions(navGroups)
  }, [menuData, t, user, isAuthenticated, isError, error])

  // 构建用户信息用于 NavUser 组件
  const navUserData = useMemo(() => {
    if (user) {
      return {
        name: user.displayName || user.username || user.email,
        email: user.email,
        avatar: user.avatar || '/avatars/default.png',
      }
    }

    return sidebarData.user
  }, [user])

  // 加载状态
  if (isLoading) {
    return (
      <Sidebar collapsible={collapsible} variant={variant}>
        <SidebarHeader>
          <AppTitle />
        </SidebarHeader>
        <SidebarContent>
          <div className="flex items-center justify-center p-4 text-muted-foreground">
            {t('common.loading') || 'Loading menus...'}
          </div>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    )
  }

  return (
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
  )
}
