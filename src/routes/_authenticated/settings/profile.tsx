/**
 * Profile Settings Page
 * 用户个人资料设置页面 - 编辑用户信息和修改密码
 */

import { createFileRoute } from '@tanstack/react-router'
import { User, Lock, Save, X } from 'lucide-react'
import { useState, useEffect } from 'react'

import { PageHeader } from '@/components/layout/page-header'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { useAuthStore } from '@/lib/auth'
import { useI18n } from '@/lib/i18n'
import { userService } from '@/features/users/services'

export const Route = createFileRoute('/_authenticated/settings/profile')({
  component: ProfileSettingsPage,
})

function ProfileSettingsPage() {
  const { t } = useI18n()
  const user = useAuthStore((state) => state.user)

  // 用户信息表单状态
  const [profileForm, setProfileForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
  })
  const [hasProfileChanges, setHasProfileChanges] = useState(false)

  // 密码修改表单状态
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // 同步用户信息
  useEffect(() => {
    if (user) {
      setProfileForm({
        username: user.username || '',
        email: user.email || '',
        avatar: user.avatar || '',
      })
    }
  }, [user])

  // 生成用户名称首字母作为 fallback
  const getUserInitials = () => {
    if (profileForm.username) {
      return profileForm.username.substring(0, 2).toUpperCase()
    }
    if (profileForm.email) {
      return profileForm.email.substring(0, 2).toUpperCase()
    }
    return 'U'
  }

  // 处理用户信息输入变化
  const handleProfileChange = (field: string, value: string) => {
    setProfileForm(prev => ({ ...prev, [field]: value }))
    setHasProfileChanges(true)
  }

  // 处理密码输入变化
  const handlePasswordChange = (field: string, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }))
  }

  // 保存用户信息
  const handleSaveProfile = async () => {
    try {
      // TODO: 调用 API 更新用户信息
      // await updateUserProfile(profileForm)

      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 500))

      // 更新成功后刷新用户状态
      // 这里需要更新 auth store 中的用户信息

      toast.success(t('profile.profileUpdated'))
      setHasProfileChanges(false)
    } catch (error) {
      toast.error(t('profile.profileUpdateFailed'))
      console.error('Failed to update profile:', error)
    }
  }

  // 取消用户信息修改
  const handleCancelProfile = () => {
    if (user) {
      setProfileForm({
        username: user.username || '',
        email: user.email || '',
        avatar: user.avatar || '',
      })
    }
    setHasProfileChanges(false)
  }

  // 修改密码
  const handleChangePassword = async () => {
    // 验证表单
    if (!passwordForm.currentPassword) {
      toast.error(t('profile.enterCurrentPassword'))
      return
    }
    if (!passwordForm.newPassword) {
      toast.error(t('profile.enterNewPassword'))
      return
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error(t('profile.passwordTooShort'))
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error(t('profile.passwordsDoNotMatch'))
      return
    }

    setIsChangingPassword(true)
    try {
      // 调用 API 修改密码
      await userService.changeOwnPassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      })

      toast.success(t('profile.passwordChanged'))

      // 清空密码表单
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error: any) {
      // 处理错误信息
      const errorMessage = error?.response?.data?.message || error?.message || t('profile.passwordChangeFailed')
      toast.error(errorMessage)
      console.error('Failed to change password:', error)
    } finally {
      setIsChangingPassword(false)
    }
  }

  // 取消密码修改
  const handleCancelPassword = () => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
  }

  return (
    <div className='flex flex-1 flex-col'>
      <PageHeader
        breadcrumbs={[
          { title: 'Home', href: '/' },
          { title: 'System Management' },
          { title: 'Settings' },
          { title: 'Profile' },
        ]}
      />

      <div className='flex-1 p-4 md:p-6 lg:p-8'>
        <div className='max-w-4xl space-y-6'>
          {/* 页面标题 */}
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>{t('profile.title')}</h1>
            <p className='text-muted-foreground mt-2'>
              {t('profile.description')}
            </p>
          </div>

          {/* 用户信息卡片 */}
          <Card>
            <CardHeader>
              <div className='flex items-center gap-2'>
                <User className='h-5 w-5 text-primary' />
                <CardTitle>{t('profile.personalInfo')}</CardTitle>
              </div>
              <CardDescription>
                {t('profile.personalInfoDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* 头像 */}
              <div className='flex items-center gap-6'>
                <Avatar className='h-20 w-20'>
                  <AvatarImage src={profileForm.avatar} alt={profileForm.username} />
                  <AvatarFallback className='text-2xl'>{getUserInitials()}</AvatarFallback>
                </Avatar>
                <div className='space-y-2'>
                  <Label htmlFor='avatar'>{t('profile.profilePictureUrl')}</Label>
                  <div className='flex gap-2'>
                    <Input
                      id='avatar'
                      type='url'
                      placeholder={t('profile.profilePictureUrlPlaceholder')}
                      value={profileForm.avatar}
                      onChange={(e) => handleProfileChange('avatar', e.target.value)}
                      className='w-full md:w-[400px]'
                    />
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    {t('profile.profilePictureDescription')}
                  </p>
                </div>
              </div>

              <Separator />

              {/* 用户名 */}
              <div className='space-y-2'>
                <Label htmlFor='username'>{t('profile.username')}</Label>
                <Input
                  id='username'
                  type='text'
                  placeholder={t('profile.usernamePlaceholder')}
                  value={profileForm.username}
                  onChange={(e) => handleProfileChange('username', e.target.value)}
                  className='w-full md:w-[400px]'
                />
                <p className='text-sm text-muted-foreground'>
                  {t('profile.usernameDescription')}
                </p>
              </div>

              {/* 邮箱 */}
              <div className='space-y-2'>
                <Label htmlFor='email'>{t('profile.email')}</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder={t('profile.emailPlaceholder')}
                  value={profileForm.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  className='w-full md:w-[400px]'
                />
                <p className='text-sm text-muted-foreground'>
                  {t('profile.emailDescription')}
                </p>
              </div>

              {/* 保存按钮 */}
              {hasProfileChanges && (
                <div className='flex items-center gap-3 pt-4 border-t'>
                  <Button onClick={handleSaveProfile}>
                    <Save className='mr-2 h-4 w-4' />
                    {t('settings.saveChanges')}
                  </Button>
                  <Button variant='outline' onClick={handleCancelProfile}>
                    <X className='mr-2 h-4 w-4' />
                    {t('common.cancel')}
                  </Button>
                  <p className='text-sm text-muted-foreground'>
                    {t('settings.unsavedChanges')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 密码修改卡片 */}
          <Card>
            <CardHeader>
              <div className='flex items-center gap-2'>
                <Lock className='h-5 w-5 text-primary' />
                <CardTitle>{t('profile.changePassword')}</CardTitle>
              </div>
              <CardDescription>
                {t('profile.changePasswordDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* 当前密码 */}
              <div className='space-y-2'>
                <Label htmlFor='currentPassword'>{t('profile.currentPassword')}</Label>
                <Input
                  id='currentPassword'
                  type='password'
                  placeholder={t('profile.currentPasswordPlaceholder')}
                  value={passwordForm.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  className='w-full md:w-[400px]'
                />
              </div>

              {/* 新密码 */}
              <div className='space-y-2'>
                <Label htmlFor='newPassword'>{t('profile.newPassword')}</Label>
                <Input
                  id='newPassword'
                  type='password'
                  placeholder={t('profile.newPasswordPlaceholder')}
                  value={passwordForm.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  className='w-full md:w-[400px]'
                />
                <p className='text-sm text-muted-foreground'>
                  {t('profile.newPasswordDescription')}
                </p>
              </div>

              {/* 确认新密码 */}
              <div className='space-y-2'>
                <Label htmlFor='confirmPassword'>{t('profile.confirmPassword')}</Label>
                <Input
                  id='confirmPassword'
                  type='password'
                  placeholder={t('profile.confirmPasswordPlaceholder')}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  className='w-full md:w-[400px]'
                />
              </div>

              {/* 密码修改按钮 */}
              <div className='flex items-center gap-3 pt-4 border-t'>
                <Button
                  onClick={handleChangePassword}
                  disabled={isChangingPassword}
                >
                  <Lock className='mr-2 h-4 w-4' />
                  {isChangingPassword ? t('profile.changingPassword') : t('profile.changePassword')}
                </Button>
                <Button
                  variant='outline'
                  onClick={handleCancelPassword}
                  disabled={isChangingPassword}
                >
                  <X className='mr-2 h-4 w-4' />
                  {t('common.cancel')}
                </Button>
              </div>

              {/* 密码安全提示 */}
              <div className='rounded-lg border bg-muted/50 p-4'>
                <h4 className='font-medium mb-2'>{t('profile.passwordSecurityTips')}</h4>
                <ul className='text-sm text-muted-foreground space-y-1 list-disc list-inside'>
                  <li>{t('profile.passwordTip1')}</li>
                  <li>{t('profile.passwordTip2')}</li>
                  <li>{t('profile.passwordTip3')}</li>
                  <li>{t('profile.passwordTip4')}</li>
                  <li>{t('profile.passwordTip5')}</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
