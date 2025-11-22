import { Link, useLocation } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { navigationItems } from '@/lib/navigation'
import { Badge } from '@/components/ui/badge'
import { Building2 } from 'lucide-react'
import { LanguageSwitcher } from '@/components/i18n/language-switcher'
import { useI18n } from '@/lib/i18n'

export function AppSidebar() {
  const location = useLocation()
  const { t } = useI18n()

  // Map navigation item titles to translation keys
  const getTranslatedTitle = (title: string) => {
    const keyMap: Record<string, string> = {
      'Dashboard': 'nav.dashboard',
      'Properties': 'nav.properties',
      'Compliance': 'nav.compliance',
      'Investor Dashboard': 'nav.investors',
      'Tenancies': 'nav.tenancies',
      'Tenants': 'Tenants',
      'Maintenance': 'nav.maintenance',
      'Inspections': 'nav.inspections',
      'Financials': 'nav.financials',
      'Reports': 'nav.reports',
      'AI Insights': 'nav.aiInsights',
      'Settings': 'nav.settings',
    }
    const key = keyMap[title]
    return key ? t(key) : title
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
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/')
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              to={item.href}
              disabled={item.disabled}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                item.disabled && 'pointer-events-none opacity-50',
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1">{getTranslatedTitle(item.title)}</span>
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
        })}
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
