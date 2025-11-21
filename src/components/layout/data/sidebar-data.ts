/**
 * Sidebar Static Data
 * 侧边栏静态数据
 *
 * ⚠️ DEPRECATION NOTICE / 废弃警告:
 * 此文件为静态导航数据，仅作为开发期间的临时数据。
 * 生产环境应该从后端 API 动态获取菜单数据（基于用户权限）。
 *
 * TODO: 迁移到动态菜单系统
 * - 使用 /api/menus/user-navigation 获取用户菜单
 * - 支持国际化（i18nKey）
 * - 支持权限过滤
 * - 支持菜单组
 *
 * This file contains static navigation data for development purposes only.
 * Production should use dynamic menus from backend API based on user permissions.
 */

import {
  Construction,
  LayoutDashboard,
  Bug,
  FileX,
  Lock,
  ServerOff,
  UserX,
  ShieldCheck,
  Command,
  Layers,
  Users,
  Settings,
  Menu,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'SKUIKIT User',
    email: 'user@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'SKUIKIT',
      logo: Command,
      plan: 'Enterprise Framework',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
          // Dashboard 所有已认证用户都可访问
        },
        {
          title: 'Framework Demo',
          url: '/demo',
          icon: Layers,
          // Demo 所有已认证用户都可访问
        },
      ],
    },
    {
      title: 'System',
      items: [
        {
          title: 'User',
          icon: Users,
          permission: ['user:detail', 'role:detail'], // 至少需要查看用户或角色的权限
          items: [
            {
              title: 'Users',
              url: '/users',
              permission: 'user:detail', // 需要查看用户权限
            },
            {
              title: 'Roles',
              url: '/users/roles',
              permission: 'role:detail', // 需要查看角色权限
            },
            {
              title: 'Permissions',
              url: '/users/permissions',
              permission: 'permission:detail', // 需要查看权限权限
            },
          ],
        },
        {
          title: 'Menu',
          url: '/menu',
          icon: Menu,
          // 临时添加，所有已认证用户都可访问
        },
        {
          title: 'Settings',
          icon: Settings,
          permission: 'settings:detail', // 需要查看设置权限
          items: [
            {
              title: 'General',
              url: '/settings/general',
              permission: 'settings:detail',
            },
            {
              title: 'Profile',
              url: '/settings/profile',
              // Profile 所有已认证用户都可访问
            },
          ],
        },
      ],
    },
    {
      title: 'Examples',
      items: [
        {
          title: 'Auth Pages',
          icon: ShieldCheck,
          items: [
            {
              title: 'Sign In',
              url: '/sign-in',
            },
            {
              title: 'Sign Up',
              url: '/sign-up',
            },
            {
              title: 'Forgot Password',
              url: '/forgot-password',
            },
            {
              title: 'OTP',
              url: '/otp',
            },
          ],
        },
        {
          title: 'Error Pages',
          icon: Bug,
          items: [
            {
              title: 'Unauthorized',
              url: '/errors/unauthorized',
              icon: Lock,
            },
            {
              title: 'Forbidden',
              url: '/errors/forbidden',
              icon: UserX,
            },
            {
              title: 'Not Found',
              url: '/errors/not-found',
              icon: FileX,
            },
            {
              title: 'Internal Server Error',
              url: '/errors/internal-server-error',
              icon: ServerOff,
            },
            {
              title: 'Maintenance Error',
              url: '/errors/maintenance-error',
              icon: Construction,
            },
          ],
        },
      ],
    },
  ],
}
