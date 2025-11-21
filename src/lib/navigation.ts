import { Home, Building2, Users, FileText, Wrench, ClipboardCheck, DollarSign, BarChart3, Settings, Sparkles } from 'lucide-react'

export interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  disabled?: boolean
}

export const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'Properties',
    href: '/properties',
    icon: Building2,
  },
  {
    title: 'Tenancies',
    href: '/tenancies',
    icon: FileText,
  },
  {
    title: 'Tenants',
    href: '/tenants',
    icon: Users,
  },
  {
    title: 'Maintenance',
    href: '/maintenance',
    icon: Wrench,
    badge: '3',
  },
  {
    title: 'Inspections',
    href: '/inspections',
    icon: ClipboardCheck,
  },
  {
    title: 'Financials',
    href: '/financials',
    icon: DollarSign,
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: BarChart3,
  },
  {
    title: 'AI Insights',
    href: '/ai-insights',
    icon: Sparkles,
    badge: '7',
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]
