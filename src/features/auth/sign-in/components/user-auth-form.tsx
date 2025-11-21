import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import useDialogState from '@/hooks/use-dialog-state'
import { useAuthStore } from '@/lib/auth'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { ForgotPasswordAlert } from '@/components/forgot-password-alert'

const createFormSchema = (t: (key: string) => string) => z.object({
  email: z.string().email(t('auth.invalidEmail')),
  password: z
    .string()
    .min(1, t('auth.passwordRequired'))
    .min(6, t('auth.passwordTooShort')),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [forgotPasswordOpen, setForgotPasswordOpen] = useDialogState()
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const { t } = useI18n()

  const formSchema = createFormSchema(t)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      // 调用真实的登录API
      await login({ email: data.email, password: data.password })

      const user = useAuthStore.getState().user
      const username = user?.username || data.email
      toast.success(t('auth.welcomeBack', { username }))

      // Redirect to the stored location or default to dashboard
      const targetPath = redirectTo || '/'
      navigate({ to: targetPath, replace: true })
    } catch (error: any) {
      // 智能错误处理
      let errorMessage = t('auth.loginError')

      if (error?.response?.status === 401) {
        // 401错误 - 认证失败
        const backendMessage = error?.response?.data?.error?.message ||
                               error?.response?.data?.message

        // 如果后端返回了具体错误消息，使用后端消息
        if (backendMessage) {
          errorMessage = backendMessage
        } else {
          // 否则使用友好的默认消息
          errorMessage = t('auth.loginErrorInvalidCredentials')
        }
      } else if (error?.response?.status === 403) {
        // 403错误 - 账户被禁用或锁定
        errorMessage = error?.response?.data?.message || t('auth.loginErrorAccountDisabled')
      } else if (error?.response?.status >= 500) {
        // 5xx错误 - 服务器错误
        errorMessage = t('auth.serverError')
      } else if (!error?.response) {
        // 网络错误
        errorMessage = t('auth.networkError')
      } else if (error?.message) {
        // 其他错误，使用错误消息
        errorMessage = error.message
      }

      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn('grid gap-3', className)}
          {...props}
        >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.email')}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder={t('auth.emailPlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>{t('auth.password')}</FormLabel>
              <FormControl>
                <PasswordInput
                  autoComplete="current-password"
                  placeholder={t('auth.passwordPlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <button
                type='button'
                onClick={() => setForgotPasswordOpen(true)}
                className='text-muted-foreground absolute end-0 -top-0.5 text-sm font-medium hover:opacity-75'
              >
                {t('auth.forgotPasswordLink')}
              </button>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
          {t('auth.signIn')}
        </Button>

        {/* 第三方登录按钮已隐藏 */}
        {/* <div className='relative my-2'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background text-muted-foreground px-2'>
              Or continue with
            </span>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-2'>
          <Button variant='outline' type='button' disabled={isLoading}>
            <Github className='h-4 w-4' /> GitHub
          </Button>
          <Button variant='outline' type='button' disabled={isLoading}>
            <Facebook className='h-4 w-4' /> Facebook
          </Button>
        </div> */}
        </form>
      </Form>

      <ForgotPasswordAlert
        open={!!forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
      />
    </>
  )
}
