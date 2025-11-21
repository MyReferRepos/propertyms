/**
 * Language Switcher Component
 * 语言切换组件
 */

import { Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useI18n, SUPPORTED_LANGUAGES } from '@/lib/i18n'

/**
 * 语言切换器组件
 */
export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n()

  // 获取当前语言信息
  const currentLang = SUPPORTED_LANGUAGES.find(lang => lang.value === language)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='sm'>
          {currentLang?.flag} {currentLang?.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.value}
            onClick={() => setLanguage(lang.value)}
            className='cursor-pointer'
          >
            <span className='mr-2'>{lang.flag}</span>
            <span>{lang.label}</span>
            {language === lang.value && (
              <Check className='ml-auto h-4 w-4' />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
