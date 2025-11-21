import { useNavigate, useLocation } from '@tanstack/react-router'
import { useAuthStore } from '@/lib/auth'
import { useI18n } from '@/lib/i18n'
import { ConfirmDialog } from '@/components/confirm-dialog'

interface SignOutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const logout = useAuthStore((state) => state.logout)
  const { t } = useI18n()

  const handleSignOut = () => {
    logout()
    // Preserve current location for redirect after sign-in
    const currentPath = location.href
    navigate({
      to: '/sign-in',
      search: { redirect: currentPath },
      replace: true,
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('user.signOutTitle')}
      desc={t('user.signOutDescription')}
      confirmText={t('user.signOutConfirm')}
      cancelBtnText={t('common.cancel')}
      handleConfirm={handleSignOut}
      className='sm:max-w-sm'
    />
  )
}
