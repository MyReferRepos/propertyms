import { Logo } from '@/assets/logo'
import { LanguageSwitcher } from '@/components/i18n/language-switcher'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='container grid h-svh max-w-none items-center justify-center'>
      {/* 语言切换器 - 右上角 */}
      <div className='absolute right-4 top-4 md:right-8 md:top-8'>
        <LanguageSwitcher />
      </div>

      <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8'>
        <div className='mb-4 flex items-center justify-center'>
          <Logo className='me-2' />
          <h1 className='text-xl font-medium'>ZORAN Management System</h1>
        </div>
        {children}
      </div>
    </div>
  )
}
