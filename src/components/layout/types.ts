import { type LinkProps } from '@tanstack/react-router'

type User = {
  name: string
  email: string
  avatar: string
}

type Team = {
  name: string
  logo: React.ElementType
  plan: string
}

type BaseNavItem = {
  title: string
  badge?: string
  icon?: React.ElementType
  /**
   * 访问此导航项所需的权限（权限代码）
   * 如果未设置，表示所有已认证用户都可以访问
   * 支持单个权限或权限数组（满足任一权限即可）
   */
  permission?: string | string[]
  /**
   * 访问此导航项所需的角色（角色代码）
   * 如果未设置，表示所有角色都可以访问
   * 支持单个角色或角色数组（满足任一角色即可）
   */
  role?: string | string[]
}

type NavLink = BaseNavItem & {
  url: LinkProps['to'] | (string & {})
  items?: never
}

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & {
    url: LinkProps['to'] | (string & {})
    permission?: string | string[]
    role?: string | string[]
  })[]
  url?: never
}

type NavItem = NavCollapsible | NavLink

type NavGroup = {
  title: string
  items: NavItem[]
}

type SidebarData = {
  user: User
  teams: Team[]
  navGroups: NavGroup[]
}

export type { SidebarData, NavGroup, NavItem, NavCollapsible, NavLink }
