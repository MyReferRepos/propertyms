import { useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { ChevronDown, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { navigationItems, type NavItem } from '@/lib/navigation'
import { Badge } from '@/components/ui/badge'
import { LanguageSwitcher } from '@/components/i18n/language-switcher'
import { useI18n } from '@/lib/i18n'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

export function AppSidebar() {
  const location = useLocation()
  const { t } = useI18n()
  const [openMenus, setOpenMenus] = useState<string[]>([])

  const toggleMenu = (href: string) => {
    setOpenMenus((prev) =>
      prev.includes(href)
        ? prev.filter((h) => h !== href)
        : [...prev, href]
    )
  }

  const getTranslatedTitle = (item: NavItem) => {
    if (item.titleKey) {
      const translated = t(item.titleKey)
      // If translation returns the key itself, fallback to title
      return translated === item.titleKey ? item.title : translated
    }
    return item.title
  }

  const isItemActive = (item: NavItem): boolean => {
    if (location.pathname === item.href) return true
    if (item.children) {
      return item.children.some((child) => location.pathname === child.href)
    }
    return location.pathname.startsWith(item.href + '/')
  }

  const renderNavItem = (item: NavItem, isChild = false) => {
    const isActive = isItemActive(item)
    const Icon = item.icon
    const hasChildren = item.children && item.children.length > 0
    const isOpen = openMenus.includes(item.href)

    if (hasChildren) {
      return (
        <Collapsible
          key={item.href}
          open={isOpen || isActive}
          onOpenChange={() => toggleMenu(item.href)}
        >
          <CollapsibleTrigger asChild>
            <button
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1 text-left">{getTranslatedTitle(item)}</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  (isOpen || isActive) && 'rotate-180'
                )}
              />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4 pt-1">
            <div className="space-y-1 border-l border-border pl-3">
              {item.children?.map((child) => renderNavItem(child, true))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )
    }

    return (
      <Link
        key={item.href}
        to={item.href}
        disabled={item.disabled}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? isChild
              ? 'bg-primary/10 text-primary'
              : 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          item.disabled && 'pointer-events-none opacity-50',
        )}
      >
        <Icon className="h-4 w-4" />
        <span className="flex-1">{getTranslatedTitle(item)}</span>
        {item.badge && (
          <Badge
            variant={isActive ? 'secondary' : 'default'}
            className="h-5 min-w-5 px-1 text-xs"
          >
            {item.badge}
          </Badge>
        )}
      </Link>
    )
  }

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Building2 className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">PropertyHub</span>
          <span className="text-xs text-muted-foreground">NZ Edition</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navigationItems.map((item) => renderNavItem(item))}
      </nav>

      {/* Footer */}
      <div className="border-t p-4 space-y-3">
        <div className="flex items-center justify-center">
          <LanguageSwitcher />
        </div>
        <div className="rounded-lg bg-muted p-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              PM
            </div>
            <div className="flex-1 text-sm">
              <div className="font-medium">Property Manager</div>
              <div className="text-xs text-muted-foreground">Demo Account</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
