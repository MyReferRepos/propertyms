import { useI18n } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Phone, Mail, Star, MoreHorizontal } from 'lucide-react'

export function SuppliersPage() {
  const { t } = useI18n()

  const suppliers = [
    {
      id: 1,
      name: 'Auckland Plumbing Co',
      category: 'Plumber',
      contact: 'Mike Johnson',
      phone: '+64 9 123 4567',
      email: 'mike@akldplumbing.co.nz',
      rating: 4.8,
      jobs: 156,
      status: 'active',
    },
    {
      id: 2,
      name: 'Spark Electric Ltd',
      category: 'Electrician',
      contact: 'Sarah Lee',
      phone: '+64 9 234 5678',
      email: 'sarah@sparkelectric.co.nz',
      rating: 4.9,
      jobs: 203,
      status: 'active',
    },
    {
      id: 3,
      name: 'Clean & Shine Services',
      category: 'Cleaner',
      contact: 'Emma Wilson',
      phone: '+64 21 345 6789',
      email: 'emma@cleanshine.co.nz',
      rating: 4.6,
      jobs: 89,
      status: 'active',
    },
    {
      id: 4,
      name: 'Garden Masters',
      category: 'Gardener',
      contact: 'Tom Brown',
      phone: '+64 27 456 7890',
      email: 'tom@gardenmasters.co.nz',
      rating: 4.7,
      jobs: 124,
      status: 'inactive',
    },
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Plumber':
        return 'bg-blue-100 text-blue-800'
      case 'Electrician':
        return 'bg-yellow-100 text-yellow-800'
      case 'Cleaner':
        return 'bg-green-100 text-green-800'
      case 'Gardener':
        return 'bg-emerald-100 text-emerald-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('suppliers.title')}</h1>
          <p className="text-muted-foreground">
            {t('suppliers.subtitle')}
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t('suppliers.addSupplier')}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('suppliers.stats.totalSuppliers')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">86</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('suppliers.stats.activeSuppliers')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">78</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('suppliers.stats.pendingQuotes')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('suppliers.stats.activeJobs')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">24</div>
          </CardContent>
        </Card>
      </div>

      {/* Suppliers List */}
      <Card>
        <CardHeader>
          <CardTitle>{t('suppliers.supplierDirectory')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{supplier.name}</p>
                    <Badge className={getCategoryColor(supplier.category)}>
                      {supplier.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('suppliers.contact')}: {supplier.contact}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {supplier.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {supplier.email}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{supplier.rating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {supplier.jobs} {t('suppliers.jobs')}
                    </p>
                  </div>
                  <Badge
                    className={
                      supplier.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }
                  >
                    {t(`suppliers.status.${supplier.status}`)}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
