import {
  BarChart3,
  Building2,
  Calculator,
  ClipboardList,
  FileText,
  Home,
  LayoutDashboard,
  Megaphone,
  Settings,
  Truck,
  UserCircle,
  Users,
} from 'lucide-react'

export interface NavItem {
  title: string
  titleKey?: string // i18n key
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  disabled?: boolean
  children?: NavItem[]
}

export const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    titleKey: 'nav.dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'Workbench',
    titleKey: 'nav.workbench',
    href: '/workbench',
    icon: LayoutDashboard,
  },
  {
    title: 'Settings',
    titleKey: 'nav.settings',
    href: '/settings',
    icon: Settings,
  },
  {
    title: 'Accounting',
    titleKey: 'nav.accounting',
    href: '/accounting',
    icon: Calculator,
    children: [
      {
        title: 'Overview',
        titleKey: 'nav.accounting.overview',
        href: '/accounting',
        icon: Calculator,
      },
      {
        title: 'Audit',
        titleKey: 'nav.accounting.audit',
        href: '/accounting/audit',
        icon: ClipboardList,
      },
    ],
  },
  {
    title: 'Marketing',
    titleKey: 'nav.marketing',
    href: '/marketing',
    icon: Megaphone,
    children: [
      {
        title: 'Potential Leads',
        titleKey: 'nav.marketing.leads',
        href: '/marketing/leads',
        icon: Megaphone,
      },
      {
        title: 'Old Owners',
        titleKey: 'nav.marketing.oldOwners',
        href: '/marketing/old-owners',
        icon: UserCircle,
      },
    ],
  },
  {
    title: 'Owners',
    titleKey: 'nav.owners',
    href: '/owners',
    icon: UserCircle,
  },
  {
    title: 'Tenants',
    titleKey: 'nav.tenants',
    href: '/tenants',
    icon: Users,
  },
  {
    title: 'Properties',
    titleKey: 'nav.properties',
    href: '/properties',
    icon: Building2,
  },
  {
    title: 'Leasing Process',
    titleKey: 'nav.leasingProcess',
    href: '/leasing-process',
    icon: FileText,
    children: [
      {
        title: 'Listing Properties',
        titleKey: 'nav.leasing.listing',
        href: '/leasing-process/listing',
        icon: FileText,
      },
      {
        title: 'Viewing Tracker',
        titleKey: 'nav.leasing.viewing',
        href: '/leasing-process/viewing',
        icon: FileText,
      },
      {
        title: 'Applications',
        titleKey: 'nav.leasing.applications',
        href: '/leasing-process/applications',
        icon: FileText,
      },
      {
        title: 'Agreements',
        titleKey: 'nav.leasing.agreements',
        href: '/leasing-process/agreements',
        icon: FileText,
      },
    ],
  },
  {
    title: 'Suppliers',
    titleKey: 'nav.suppliers',
    href: '/suppliers',
    icon: Truck,
    children: [
      {
        title: 'Supplier List',
        titleKey: 'nav.suppliers.list',
        href: '/suppliers',
        icon: Truck,
      },
      {
        title: 'Quote Requests',
        titleKey: 'nav.suppliers.quotes',
        href: '/suppliers/quotes',
        icon: FileText,
      },
      {
        title: 'Work Assignments',
        titleKey: 'nav.suppliers.assignments',
        href: '/suppliers/assignments',
        icon: ClipboardList,
      },
      {
        title: 'Work Reviews',
        titleKey: 'nav.suppliers.reviews',
        href: '/suppliers/reviews',
        icon: ClipboardList,
      },
    ],
  },
  {
    title: 'Reports',
    titleKey: 'nav.reports',
    href: '/reports',
    icon: BarChart3,
  },
]
