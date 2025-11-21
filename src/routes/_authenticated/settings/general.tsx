/**
 * General Settings Page
 * 通用设置页面 - 包含语言设置等
 */

import { createFileRoute } from '@tanstack/react-router'
import { Globe } from 'lucide-react'
import { useState, useEffect } from 'react'

import { PageHeader } from '@/components/layout/page-header'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useI18n, SUPPORTED_LANGUAGES, type Language } from '@/lib/i18n'

export const Route = createFileRoute('/_authenticated/settings/general')({
  component: GeneralSettingsPage,
})

function GeneralSettingsPage() {
  const { t, language: currentLanguage, setLanguage: setGlobalLanguage } = useI18n()
  const [language, setLanguage] = useState<Language>(currentLanguage)
  const [hasChanges, setHasChanges] = useState(false)

  // 同步全局语言状态
  useEffect(() => {
    setLanguage(currentLanguage)
  }, [currentLanguage])

  const handleLanguageChange = (value: string) => {
    setLanguage(value as Language)
    setHasChanges(true)
  }

  const handleSave = () => {
    // 更新全局语言设置
    setGlobalLanguage(language)

    const langInfo = SUPPORTED_LANGUAGES.find(l => l.value === language)
    toast.success(t('settings.languageChanged') + ' ' + langInfo?.label)

    setHasChanges(false)

    // 提示用户可能需要刷新页面
    toast.info(t('settings.refreshNotice'))
  }

  const handleReset = () => {
    setLanguage(currentLanguage)
    setHasChanges(false)
  }

  return (
    <div className='flex flex-1 flex-col'>
      <PageHeader
        breadcrumbs={[
          { title: 'Home', href: '/' },
          { title: 'System Management' },
          { title: 'Settings' },
          { title: 'General' },
        ]}
      />

      <div className='flex-1 p-4 md:p-6 lg:p-8'>
        <div className='max-w-4xl space-y-6'>
          {/* 页面标题 */}
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>{t('settings.title')}</h1>
            <p className='text-muted-foreground mt-2'>
              {t('settings.description')}
            </p>
          </div>

          {/* 语言设置卡片 */}
          <Card>
            <CardHeader>
              <div className='flex items-center gap-2'>
                <Globe className='h-5 w-5 text-primary' />
                <CardTitle>{t('settings.languageAndRegion')}</CardTitle>
              </div>
              <CardDescription>
                {t('settings.languageDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* 语言选择器 */}
              <div className='space-y-2'>
                <Label htmlFor='language'>{t('settings.interfaceLanguage')}</Label>
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger id='language' className='w-full md:w-[400px]'>
                    <SelectValue placeholder={t('settings.selectLanguage')} />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        <div className='flex items-center gap-2'>
                          <span>{lang.flag}</span>
                          <span>{lang.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className='text-sm text-muted-foreground'>
                  {t('settings.languageDescription')}
                </p>
              </div>

              {/* 当前语言信息 */}
              <div className='rounded-lg border bg-muted/50 p-4'>
                <div className='flex items-center gap-3'>
                  <div className='text-3xl'>
                    {SUPPORTED_LANGUAGES.find(l => l.value === language)?.flag}
                  </div>
                  <div>
                    <p className='font-medium'>
                      {t('settings.currentLanguage')}: {SUPPORTED_LANGUAGES.find(l => l.value === language)?.label}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      {t('settings.languageCode')}: {language}
                    </p>
                  </div>
                </div>
              </div>

              {/* 保存按钮 */}
              {hasChanges && (
                <div className='flex items-center gap-3 pt-4 border-t'>
                  <Button onClick={handleSave}>
                    {t('settings.saveChanges')}
                  </Button>
                  <Button variant='outline' onClick={handleReset}>
                    {t('common.cancel')}
                  </Button>
                  <p className='text-sm text-muted-foreground'>
                    {t('settings.unsavedChanges')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 未来可以在这里添加更多设置卡片 */}
          {/* 例如：时区设置、日期格式、数字格式等 */}
        </div>
      </div>
    </div>
  )
}
