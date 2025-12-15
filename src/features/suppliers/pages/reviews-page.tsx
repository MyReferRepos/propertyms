import { useI18n } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, Truck, Building2, Calendar, ThumbsUp, MessageSquare } from 'lucide-react'

const mockReviews = [
  {
    id: '1',
    supplier: 'ABC Plumbing',
    property: '78 Newmarket Ave, Newmarket',
    workOrder: 'WO-2024-003',
    description: 'Hot water cylinder installation',
    completedDate: '2024-12-10',
    rating: 5,
    quality: 'Excellent',
    timeliness: 'On Time',
    communication: 'Excellent',
    comment: 'Professional service, clean work. Highly recommended.',
    reviewed: true,
  },
  {
    id: '2',
    supplier: 'Spark Electrical',
    property: '123 Queen Street, Auckland CBD',
    workOrder: 'WO-2024-002',
    description: 'Kitchen rewiring',
    completedDate: '2024-12-08',
    rating: 4,
    quality: 'Good',
    timeliness: 'On Time',
    communication: 'Good',
    comment: 'Good work, minor cleanup needed.',
    reviewed: true,
  },
  {
    id: '3',
    supplier: 'Clean Team NZ',
    property: '45 Ponsonby Road, Ponsonby',
    workOrder: 'WO-2024-005',
    description: 'End of tenancy clean',
    completedDate: '2024-12-12',
    rating: 0,
    quality: null,
    timeliness: null,
    communication: null,
    comment: null,
    reviewed: false,
  },
  {
    id: '4',
    supplier: 'Green Gardens',
    property: '200 Broadway, Newmarket',
    workOrder: 'WO-2024-001',
    description: 'Garden maintenance',
    completedDate: '2024-12-05',
    rating: 3,
    quality: 'Average',
    timeliness: 'Delayed',
    communication: 'Poor',
    comment: 'Work done but communication could be better. Arrived late.',
    reviewed: true,
  },
]

export function ReviewsPage() {
  const { t } = useI18n()

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const getQualityColor = (quality: string | null) => {
    switch (quality) {
      case 'Excellent':
        return 'bg-green-100 text-green-800'
      case 'Good':
        return 'bg-blue-100 text-blue-800'
      case 'Average':
        return 'bg-yellow-100 text-yellow-800'
      case 'Poor':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const reviewedCount = mockReviews.filter((r) => r.reviewed).length
  const pendingCount = mockReviews.filter((r) => !r.reviewed).length
  const averageRating =
    mockReviews.filter((r) => r.reviewed).reduce((acc, r) => acc + r.rating, 0) / reviewedCount

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('nav.suppliers.reviews')}</h1>
          <p className="text-muted-foreground">
            Review completed work and rate suppliers
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{mockReviews.length}</div>
            <p className="text-xs text-muted-foreground">Total Completed Jobs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{reviewedCount}</div>
            <p className="text-xs text-muted-foreground">Reviewed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </div>
            <p className="text-xs text-muted-foreground">Average Rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Reviews */}
      {pendingCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <MessageSquare className="h-5 w-5" />
              Pending Reviews ({pendingCount})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockReviews
                .filter((r) => !r.reviewed)
                .map((review) => (
                  <div
                    key={review.id}
                    className="flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 p-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{review.supplier}</span>
                        <span className="text-sm text-muted-foreground">
                          ({review.workOrder})
                        </span>
                      </div>
                      <div className="text-sm">{review.description}</div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {review.property}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Completed: {review.completedDate}
                        </span>
                      </div>
                    </div>
                    <Button>
                      <Star className="mr-1 h-4 w-4" />
                      Write Review
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ThumbsUp className="h-5 w-5" />
            Completed Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockReviews
              .filter((r) => r.reviewed)
              .map((review) => (
                <div
                  key={review.id}
                  className="rounded-lg border p-4 hover:bg-accent/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5 text-muted-foreground" />
                        <span className="font-semibold">{review.supplier}</span>
                        {renderStars(review.rating)}
                      </div>
                      <div className="text-sm">{review.description}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        {review.property}
                      </div>
                      <div className="flex items-center gap-2">
                        {review.quality && (
                          <Badge className={getQualityColor(review.quality)}>
                            Quality: {review.quality}
                          </Badge>
                        )}
                        {review.timeliness && (
                          <Badge
                            className={
                              review.timeliness === 'On Time'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }
                          >
                            {review.timeliness}
                          </Badge>
                        )}
                      </div>
                      {review.comment && (
                        <div className="mt-2 rounded-lg bg-muted p-3 text-sm italic">
                          &ldquo;{review.comment}&rdquo;
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      {review.completedDate}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
