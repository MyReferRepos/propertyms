import { useI18n } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Plus, Building2, Truck, DollarSign, Calendar } from 'lucide-react'

const mockQuotes = [
  {
    id: '1',
    supplier: 'ABC Plumbing',
    property: '123 Queen Street, Auckland CBD',
    description: 'Hot water cylinder replacement',
    amount: 1850,
    status: 'Pending',
    requestDate: '2024-12-10',
    validUntil: '2024-12-24',
  },
  {
    id: '2',
    supplier: 'Spark Electrical',
    property: '45 Ponsonby Road, Ponsonby',
    description: 'Rewiring kitchen and bathroom',
    amount: 2400,
    status: 'Approved',
    requestDate: '2024-12-08',
    validUntil: '2024-12-22',
  },
  {
    id: '3',
    supplier: 'Clean Team NZ',
    property: '78 Newmarket Ave, Newmarket',
    description: 'End of tenancy deep clean',
    amount: 450,
    status: 'Completed',
    requestDate: '2024-12-05',
    validUntil: '2024-12-19',
  },
  {
    id: '4',
    supplier: 'ABC Plumbing',
    property: '200 Broadway, Newmarket',
    description: 'Blocked drain clearing',
    amount: 280,
    status: 'Rejected',
    requestDate: '2024-12-09',
    validUntil: '2024-12-23',
  },
]

export function QuotesPage() {
  const { t } = useI18n()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Approved':
        return 'bg-green-100 text-green-800'
      case 'Rejected':
        return 'bg-red-100 text-red-800'
      case 'Completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const stats = {
    total: mockQuotes.length,
    pending: mockQuotes.filter((q) => q.status === 'Pending').length,
    approved: mockQuotes.filter((q) => q.status === 'Approved').length,
    totalValue: mockQuotes.reduce((acc, q) => acc + q.amount, 0),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('nav.suppliers.quotes')}</h1>
          <p className="text-muted-foreground">
            Manage quote requests from suppliers
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Request Quote
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total Quotes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total Value</p>
          </CardContent>
        </Card>
      </div>

      {/* Quotes List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Quote Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockQuotes.map((quote) => (
              <div
                key={quote.id}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/30 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-muted-foreground" />
                    <span className="font-semibold">{quote.supplier}</span>
                    <Badge className={getStatusColor(quote.status)}>
                      {quote.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    {quote.property}
                  </div>
                  <div className="text-sm">{quote.description}</div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Requested: {quote.requestDate}
                    </span>
                    <span>Valid until: {quote.validUntil}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-lg font-bold">
                      <DollarSign className="h-4 w-4" />
                      {quote.amount.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">Quote Amount</p>
                  </div>
                  {quote.status === 'Pending' && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="text-green-600">
                        Approve
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600">
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
