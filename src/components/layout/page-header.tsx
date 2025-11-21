/**
 * Page Header Component
 * 页面顶部操作栏 - 包含面包屑导航、搜索、主题切换、配置和个人信息
 */

import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'

export interface BreadcrumbItem {
  title: string
  href?: string
}

interface PageHeaderProps {
  breadcrumbs?: BreadcrumbItem[]
  title?: string
  description?: string
  actions?: React.ReactNode
  showSearch?: boolean
  showThemeSwitch?: boolean
  showConfig?: boolean
  showProfile?: boolean
  className?: string
}

/**
 * 根据面包屑标题获取翻译键
 */
function getBreadcrumbTranslationKey(title: string): string | null {
  const titleMap: Record<string, string> = {
    'Home': 'breadcrumb.home',
    'System Management': 'breadcrumb.systemManagement',
    'User Management': 'breadcrumb.userManagement',
    'Users': 'breadcrumb.users',
    'Roles': 'breadcrumb.roles',
    'Permissions': 'breadcrumb.permissions',
    'Settings': 'breadcrumb.settings',
    'General': 'breadcrumb.general',
    'Profile': 'breadcrumb.profile',
    'Dashboard': 'nav.dashboard',
    'Framework Demo': 'nav.frameworkDemo',
  }
  return titleMap[title] || null
}

export function PageHeader({
  breadcrumbs,
  title,
  description,
  actions,
  showSearch = true,
  showThemeSwitch = true,
  showConfig = true,
  showProfile = true,
  className,
}: PageHeaderProps) {
  const { t } = useI18n()
  return (
    <header
      className={cn(
        'sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12',
        className
      )}
    >
      <div className='flex w-full items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 h-4' />

        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className='flex items-center space-x-1 text-sm text-muted-foreground'>
            {breadcrumbs.map((item, index) => {
              const translationKey = getBreadcrumbTranslationKey(item.title)
              const displayTitle = translationKey ? t(translationKey) : item.title

              return (
                <div key={index} className='flex items-center'>
                  {index > 0 && <ChevronRight className='h-4 w-4 mx-1' />}
                  {item.href ? (
                    <Link
                      to={item.href}
                      className='hover:text-foreground transition-colors'
                    >
                      {displayTitle}
                    </Link>
                  ) : (
                    <span className='font-medium text-foreground'>{displayTitle}</span>
                  )}
                </div>
              )
            })}
          </nav>
        )}

        {/* Title (if no breadcrumbs) */}
        {!breadcrumbs && title && (
          <div>
            <h1 className='text-lg font-semibold'>{title}</h1>
            {description && (
              <p className='text-sm text-muted-foreground'>{description}</p>
            )}
          </div>
        )}

        {/* Spacer */}
        <div className='flex-1' />

        {/* Right side navigation */}
        <div className='flex items-center gap-2'>
          {/* Search */}
          {showSearch && <Search />}

          {/* Custom actions slot */}
          {actions}

          {/* Theme Switch */}
          {showThemeSwitch && <ThemeSwitch />}

          {/* Config Drawer */}
          {showConfig && <ConfigDrawer />}

          {/* Profile Dropdown */}
          {showProfile && <ProfileDropdown />}
        </div>
      </div>
    </header>
  )
}
