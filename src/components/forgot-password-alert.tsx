import { useI18n } from '@/lib/i18n'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

interface ForgotPasswordAlertProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ForgotPasswordAlert({ open, onOpenChange }: ForgotPasswordAlertProps) {
  const { t } = useI18n()

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className='sm:max-w-md'>
        <AlertDialogHeader className='text-start'>
          <AlertDialogTitle>{t('auth.forgotPasswordNotAvailable')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('auth.contactAdminForPasswordReset')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            {t('auth.understood')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
