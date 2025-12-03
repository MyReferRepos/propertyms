import { useState, useEffect } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import {
  Building2,
  MapPin,
  DollarSign,
  TrendingUp,
  Calendar,
  Edit,
  FileText,
  AlertCircle,
  Wrench,
  Users,
  Shield,
  Lightbulb,
  ChevronLeft,
  CheckCircle2,
  Home,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Property } from '@/types'
import { PropertyDetailComprehensive } from '../components/property-detail-comprehensive'
import { propertiesAPI } from '@/services/api'

// Mock data - In real app, fetch from API based on propertyId
const mockPropertyData = {
  'prop-001': {
    id: 'prop-001',
    address: '123 Queen Street, Auckland CBD, Auckland 1010',
    type: 'Apartment',
    status: 'occupied' as const,
    bedrooms: 2,
    bathrooms: 1,
    parkingSpaces: 1,
    floorArea: 75,
    landArea: null,
    yearBuilt: 2018,
    purchasePrice: 650000,
    currentValue: 720000,
    weeklyRent: 650,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    ],
    tenant: {
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+64 21 234 5678',
      leaseStart: '2024-01-15',
      leaseEnd: '2025-01-14',
      bondAmount: 2600,
      weeklyRent: 650,
      paymentStatus: 'current',
    },
    financials: {
      totalIncome: 33800,
      totalExpenses: 12500,
      netIncome: 21300,
      yieldPercentage: 4.8,
      expenses: [
        { category: 'Insurance', amount: 1200, date: '2024-01-01' },
        { category: 'Rates', amount: 2800, date: '2024-02-15' },
        { category: 'Body Corporate', amount: 5500, date: '2024-03-01' },
        { category: 'Maintenance', amount: 3000, date: '2024-06-10' },
      ],
    },
    maintenance: [
      {
        id: 'maint-001',
        title: 'Fix leaking tap',
        date: '2024-10-15',
        status: 'completed',
        cost: 180,
        contractor: "Mike's Plumbing",
      },
      {
        id: 'maint-002',
        title: 'Annual heat pump service',
        date: '2024-08-22',
        status: 'completed',
        cost: 250,
        contractor: 'Climate Control Ltd',
      },
      {
        id: 'maint-003',
        title: 'Repaint bedroom',
        date: '2024-06-10',
        status: 'completed',
        cost: 1200,
        contractor: 'Pro Painters Auckland',
      },
    ],
    inspections: [
      {
        id: 'insp-001',
        type: 'routine',
        date: '2024-11-01',
        inspector: 'John Smith',
        rating: 'good',
        notes: 'Property well maintained. Minor wear on carpet.',
      },
      {
        id: 'insp-002',
        type: 'routine',
        date: '2024-08-01',
        inspector: 'John Smith',
        rating: 'excellent',
        notes: 'No issues found. Tenant keeping property in excellent condition.',
      },
    ],
    compliance: {
      healthyHomes: {
        heating: { compliant: true, date: '2024-01-15' },
        insulation: { compliant: true, date: '2024-01-15' },
        ventilation: { compliant: true, date: '2024-01-15' },
        moisture: { compliant: true, date: '2024-01-15' },
        draught: { compliant: true, date: '2024-01-15' },
      },
      insurance: {
        provider: 'NZ Insurance Co',
        policyNumber: 'INS-12345678',
        expiryDate: '2025-06-30',
        coverAmount: 720000,
      },
      buildingWof: null,
    },
    aiInsights: [
      {
        type: 'opportunity',
        title: 'Rent increase opportunity',
        description:
          'Market analysis shows similar properties renting for $680-$700/week. Consider 5% increase at lease renewal.',
        confidence: 85,
        potentialValue: 1560,
      },
      {
        type: 'warning',
        title: 'Insurance renewal due soon',
        description: 'Insurance policy expires in 45 days. Review coverage and shop around for better rates.',
        confidence: 100,
        action: 'Review insurance',
      },
      {
        type: 'recommendation',
        title: 'Energy efficiency upgrade',
        description:
          'Installing LED lighting and smart thermostat could reduce tenant energy costs and increase appeal.',
        confidence: 70,
        estimatedCost: 800,
      },
    ],
  },
}

export function PropertyDetailPage() {
  const { propertyId } = useParams({ from: '/_authenticated/properties/$propertyId' })
  const [activeTab, setActiveTab] = useState('overview')
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPropertyDetail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId])

  const loadPropertyDetail = async () => {
    try {
      setLoading(true)
      const response = await propertiesAPI.getAll({})
      if (response.success) {
        const foundProperty = response.data.find((p) => p.id === propertyId)
        setProperty(foundProperty || null)
      }
    } catch (error) {
      console.error('Failed to load property:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get extended mock data for tabs (financials, maintenance, etc.)
  const mockExtendedData = mockPropertyData[propertyId as keyof typeof mockPropertyData]

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Property Not Found</h2>
        <p className="text-muted-foreground mb-4">The property you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/properties">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Link>
        </Button>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    vacant: 'bg-green-100 text-green-700 border-green-200',
    occupied: 'bg-blue-100 text-blue-700 border-blue-200',
    maintenance: 'bg-orange-100 text-orange-700 border-orange-200',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2">
            <Link to="/properties">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Properties
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{property.address}</h1>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{property.type}</span>
                <Badge variant="outline" className={statusColors[property.status] || statusColors.vacant}>
                  {property.status === 'occupied' ? 'Occupied' : property.status === 'vacant' ? 'Available' : property.status === 'maintenance' ? 'Maintenance' : 'Available'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Camera className="h-4 w-4 mr-2" />
            Photos
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Reports
          </Button>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Property
          </Button>
        </div>
      </div>

      {/* Key Metrics - only show if extended mock data available */}
      {mockExtendedData && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Rent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${mockExtendedData.weeklyRent}</div>
              <p className="text-xs text-muted-foreground">${(mockExtendedData.weeklyRent * 52).toLocaleString()}/year</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Yield</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockExtendedData.financials.yieldPercentage}%</div>
              <p className="text-xs text-muted-foreground">Annual gross yield</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Property Value</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(mockExtendedData.currentValue / 1000).toFixed(0)}k</div>
              <p className="text-xs text-green-600">
                +${((mockExtendedData.currentValue - mockExtendedData.purchasePrice) / 1000).toFixed(0)}k (
                {(((mockExtendedData.currentValue - mockExtendedData.purchasePrice) / mockExtendedData.purchasePrice) * 100).toFixed(1)}%)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Inspection</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Feb 1</div>
              <p className="text-xs text-muted-foreground">Routine inspection</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="tenancy">Tenancy</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="inspections">Inspections</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Comprehensive Property Information */}
          <PropertyDetailComprehensive property={property} />
        </TabsContent>

        {/* Financials Tab */}
        <TabsContent value="financials" className="space-y-4">
          {mockExtendedData ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Income & Expenses</CardTitle>
                  <CardDescription>Annual financial summary</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Income</span>
                      <span className="text-lg font-bold text-green-600">${mockExtendedData.financials.totalIncome.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Expenses</span>
                      <span className="text-lg font-bold text-red-600">${mockExtendedData.financials.totalExpenses.toLocaleString()}</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Net Income</span>
                        <span className="text-xl font-bold">${mockExtendedData.financials.netIncome.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Expense Breakdown</CardTitle>
                  <CardDescription>Year to date expenses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockExtendedData.financials.expenses.map((expense, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">{expense.category}</p>
                          <p className="text-xs text-muted-foreground">{expense.date}</p>
                        </div>
                        <span className="text-sm font-medium">${expense.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Financial details coming soon...
            </div>
          )}
        </TabsContent>

        {/* Tenancy Tab */}
        <TabsContent value="tenancy" className="space-y-4">
          {mockExtendedData?.tenant ? (
            <Card>
              <CardHeader>
                <CardTitle>Current Tenant</CardTitle>
                <CardDescription>Active tenancy information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-semibold">
                    {mockExtendedData.tenant.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold">{mockExtendedData.tenant.name}</p>
                    <p className="text-sm text-muted-foreground">{mockExtendedData.tenant.email}</p>
                    <p className="text-sm text-muted-foreground">{mockExtendedData.tenant.phone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Lease Start</p>
                    <p className="font-medium">{new Date(mockExtendedData.tenant.leaseStart).toLocaleDateString('en-NZ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lease End</p>
                    <p className="font-medium">{new Date(mockExtendedData.tenant.leaseEnd).toLocaleDateString('en-NZ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Weekly Rent</p>
                    <p className="font-medium">${mockExtendedData.tenant.weeklyRent}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bond Amount</p>
                    <p className="font-medium">${mockExtendedData.tenant.bondAmount}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Payment Status</p>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Current
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No Current Tenant</p>
                <p className="text-sm text-muted-foreground mb-4">This property is currently vacant</p>
                <Button>List Property</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="space-y-4">
          {mockExtendedData?.maintenance ? (
            <Card>
              <CardHeader>
                <CardTitle>Maintenance History</CardTitle>
                <CardDescription>All maintenance and repairs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockExtendedData.maintenance.map((item: any) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Wrench className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-muted-foreground">{item.contractor}</p>
                          </div>
                          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                            {item.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{new Date(item.date).toLocaleDateString('en-NZ')}</span>
                          <span>•</span>
                          <span className="font-medium">${item.cost}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Wrench className="h-4 w-4 mr-2" />
                  Add Maintenance Request
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Maintenance history coming soon...
            </div>
          )}
        </TabsContent>

        {/* Inspections Tab */}
        <TabsContent value="inspections" className="space-y-4">
          {mockExtendedData?.inspections ? (
            <Card>
              <CardHeader>
                <CardTitle>Inspection History</CardTitle>
                <CardDescription>Property inspection reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockExtendedData.inspections.map((inspection: any) => (
                    <div key={inspection.id} className="flex gap-4 pb-4 border-b last:border-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
                        <CheckCircle2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium capitalize">{inspection.type} Inspection</p>
                            <p className="text-sm text-muted-foreground">Inspector: {inspection.inspector}</p>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              inspection.rating === 'excellent'
                                ? 'bg-green-100 text-green-700 border-green-200'
                                : 'bg-blue-100 text-blue-700 border-blue-200'
                            }
                          >
                            {inspection.rating}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{inspection.notes}</p>
                        <p className="text-xs text-muted-foreground">{new Date(inspection.date).toLocaleDateString('en-NZ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Schedule Inspection
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Inspection history coming soon...
            </div>
          )}
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-4">
          {mockExtendedData?.compliance ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Healthy Homes Standards</CardTitle>
                  <CardDescription>NZ Healthy Homes compliance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(mockExtendedData.compliance.healthyHomes).map(([key, value]: [string, any]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-sm capitalize">{key}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Since {new Date(value.date).toLocaleDateString('en-NZ')}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Insurance</CardTitle>
                  <CardDescription>Property insurance details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Provider</span>
                    <span className="text-sm font-medium">{mockExtendedData.compliance.insurance.provider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Policy Number</span>
                    <span className="text-sm font-medium">{mockExtendedData.compliance.insurance.policyNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Cover Amount</span>
                    <span className="text-sm font-medium">${mockExtendedData.compliance.insurance.coverAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Expiry Date</span>
                    <span className="text-sm font-medium">{new Date(mockExtendedData.compliance.insurance.expiryDate).toLocaleDateString('en-NZ')}</span>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    <Shield className="h-4 w-4 mr-2" />
                    Renew Insurance
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Compliance information coming soon...
            </div>
          )}
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documents & Files</CardTitle>
              <CardDescription>Property-related documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Tenancy Agreement</p>
                      <p className="text-xs text-muted-foreground">Signed 15 Jan 2024</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Healthy Homes Certificate</p>
                      <p className="text-xs text-muted-foreground">Issued 10 Jan 2024</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Insurance Policy</p>
                      <p className="text-xs text-muted-foreground">Valid until 30 Jun 2025</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Upload Document
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="ai-insights" className="space-y-4">
          {mockExtendedData?.aiInsights ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  PropertyPilot AI Insights
                </CardTitle>
                <CardDescription>AI-powered recommendations for this property</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockExtendedData.aiInsights.map((insight: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border ${
                      insight.type === 'opportunity'
                        ? 'bg-green-50 border-green-200'
                        : insight.type === 'warning'
                        ? 'bg-orange-50 border-orange-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {insight.type === 'opportunity' ? (
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        ) : insight.type === 'warning' ? (
                          <AlertCircle className="h-5 w-5 text-orange-600" />
                        ) : (
                          <Lightbulb className="h-5 w-5 text-blue-600" />
                        )}
                        <p className="font-semibold">{insight.title}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {insight.confidence}% confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                    {insight.potentialValue && (
                      <p className="text-sm font-medium text-green-600">Potential annual value: ${insight.potentialValue}</p>
                    )}
                    {insight.estimatedCost && (
                      <p className="text-sm font-medium text-muted-foreground">Estimated cost: ${insight.estimatedCost}</p>
                    )}
                    {insight.action && (
                      <Button size="sm" className="mt-3">
                        {insight.action}
                      </Button>
                    )}
                  </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              AI insights coming soon...
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
