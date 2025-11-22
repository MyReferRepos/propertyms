import { Settings, User, Bell, Shield, CreditCard, Mail, Globe } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useAuthStore } from '@/lib/auth/auth-store'
import { useI18n } from '@/lib/i18n'

export function SettingsPage() {
  const { user } = useAuthStore()
  const { t } = useI18n()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <Settings className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">{t('settings.title')}</h1>
        </div>
        <p className="text-muted-foreground mt-1">{t('settings.subtitle')}</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <CardTitle>{t('settings.profile.title')}</CardTitle>
          </div>
          <CardDescription>{t('settings.profile.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">{t('settings.profile.fullName')}</Label>
              <Input id="name" defaultValue={user?.displayName || 'Demo Property Manager'} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('settings.profile.email')}</Label>
              <Input id="email" type="email" defaultValue={user?.email || 'admin@example.com'} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t('settings.profile.phone')}</Label>
              <Input id="phone" type="tel" placeholder="+64 21 123 4567" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">{t('settings.profile.company')}</Label>
              <Input id="company" placeholder="PropertyHub NZ Ltd" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button>{t('common.save')}</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>{t('settings.notifications.title')}</CardTitle>
          </div>
          <CardDescription>{t('settings.notifications.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">{t('settings.notifications.email')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('settings.notifications.emailDesc')}
              </p>
            </div>
            <Switch id="email-notifications" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="lease-expiry">{t('settings.notifications.leaseReminders')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('settings.notifications.leaseRemindersDesc')}
              </p>
            </div>
            <Switch id="lease-expiry" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="maintenance-alerts">{t('settings.notifications.maintenanceAlerts')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('settings.notifications.maintenanceAlertsDesc')}
              </p>
            </div>
            <Switch id="maintenance-alerts" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="payment-alerts">{t('settings.notifications.paymentAlerts')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('settings.notifications.paymentAlertsDesc')}
              </p>
            </div>
            <Switch id="payment-alerts" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="ai-insights">AI Insights</Label>
              <p className="text-sm text-muted-foreground">
                Receive PropertyPilot AI recommendations
              </p>
            </div>
            <Switch id="ai-insights" defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>{t('settings.security.title')}</CardTitle>
          </div>
          <CardDescription>{t('settings.security.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">{t('settings.security.currentPassword')}</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">{t('settings.security.newPassword')}</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">{t('settings.security.confirmPassword')}</Label>
            <Input id="confirm-password" type="password" />
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-0.5">
              <Label htmlFor="two-factor">{t('settings.security.twoFactor')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('settings.security.twoFactorDesc')}
              </p>
            </div>
            <Switch id="two-factor" />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline">{t('common.cancel')}</Button>
            <Button>{t('settings.security.changePassword')}</Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <CardTitle>{t('settings.billing.title')}</CardTitle>
          </div>
          <CardDescription>{t('settings.billing.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-semibold">{t('settings.billing.professionalPlan')}</p>
              <p className="text-sm text-muted-foreground">{t('settings.billing.planDetails')}</p>
            </div>
            <Button variant="outline">{t('settings.billing.changePlan')}</Button>
          </div>

          <div className="space-y-2">
            <Label>{t('settings.billing.paymentMethod')}</Label>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{t('settings.billing.cardEnding')}</p>
                  <p className="text-sm text-muted-foreground">{t('settings.billing.cardExpires')}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                {t('common.update')}
              </Button>
            </div>
          </div>

          <div className="pt-2">
            <Button variant="outline" className="w-full">
              {t('settings.billing.viewBillingHistory')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Email Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <CardTitle>{t('settings.email.title')}</CardTitle>
          </div>
          <CardDescription>{t('settings.email.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing-emails">{t('settings.email.marketing')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('settings.email.marketingDesc')}
              </p>
            </div>
            <Switch id="marketing-emails" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="newsletter">{t('settings.email.newsletter')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('settings.email.newsletterDesc')}
              </p>
            </div>
            <Switch id="newsletter" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reports-email">{t('settings.email.reports')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('settings.email.reportsDesc')}
              </p>
            </div>
            <Switch id="reports-email" defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Language & Region */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <CardTitle>{t('settings.preferences.language')}</CardTitle>
          </div>
          <CardDescription>{t('settings.preferences.languageDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="language">{t('settings.preferences.language')}</Label>
              <select
                id="language"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="en">English</option>
                <option value="zh">中文</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">{t('settings.preferences.timezone')}</Label>
              <select
                id="timezone"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="Pacific/Auckland">New Zealand (NZST)</option>
                <option value="Australia/Sydney">Australia (AEST)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">{t('settings.preferences.currency')}</Label>
              <select
                id="currency"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="NZD">NZD ($)</option>
                <option value="AUD">AUD (A$)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-format">{t('settings.preferences.dateFormat')}</Label>
              <select
                id="date-format"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">{t('settings.dangerZone.title')}</CardTitle>
          <CardDescription>{t('settings.dangerZone.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4">
            <div>
              <p className="font-semibold text-red-900">{t('settings.dangerZone.deleteAccount')}</p>
              <p className="text-sm text-red-700">
                {t('settings.dangerZone.deleteAccountDesc')}
              </p>
            </div>
            <Button variant="destructive">{t('settings.dangerZone.deleteAccount')}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
