import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Book, Code, Layers } from 'lucide-react'

import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useI18n } from '@/lib/i18n'

function HomePage() {
  const { t } = useI18n()

  return (
    <div className='flex flex-1 flex-col'>
      <PageHeader
        breadcrumbs={[
          { title: 'Home' },
        ]}
      />

      <div className='flex-1 p-4 md:p-6 lg:p-8 space-y-8'>
      {/* Welcome Section */}
      <div className='text-center space-y-4 py-12'>
        <h1 className='text-4xl font-bold tracking-tight'>{t('dashboard.welcome')}</h1>
        <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
          {t('dashboard.description')}
        </p>
        <div className='flex gap-4 justify-center pt-4'>
          <Link to='/demo'>
            <Button size='lg'>
              {t('dashboard.viewDemo')}
              <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
          </Link>
          <a href='https://github.com/your-org/skuikit' target='_blank' rel='noopener noreferrer'>
            <Button size='lg' variant='outline'>
              <Code className='mr-2 h-4 w-4' />
              {t('dashboard.viewSource')}
            </Button>
          </a>
        </div>
      </div>

      {/* Feature Cards */}
      <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Layers className='h-5 w-5' />
              {t('dashboard.coreFeatures')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2 text-sm text-muted-foreground'>
              <li>{t('dashboard.apiIntegration')}</li>
              <li>{t('dashboard.authSystem')}</li>
              <li>{t('dashboard.i18n')}</li>
              <li>{t('dashboard.agGrid')}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.uiComponents')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2 text-sm text-muted-foreground'>
              <li>{t('dashboard.shadcnComponents')}</li>
              <li>{t('dashboard.themeSwitcher')}</li>
              <li>{t('dashboard.responsiveDesign')}</li>
              <li>{t('dashboard.accessibility')}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.developerExperience')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2 text-sm text-muted-foreground'>
              <li>{t('dashboard.typescript')}</li>
              <li>{t('dashboard.viteBuild')}</li>
              <li>{t('dashboard.tanstackRouter')}</li>
              <li>{t('dashboard.eslintPrettier')}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Book className='h-5 w-5' />
              {t('dashboard.documentation')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2 text-sm'>
              <li>
                <a href='/FRAMEWORK.md' className='text-primary hover:underline'>
                  {t('dashboard.frameworkGuide')}
                </a>
              </li>
              <li>
                <a href='/QUICKSTART.md' className='text-primary hover:underline'>
                  {t('dashboard.quickStart')}
                </a>
              </li>
              <li>
                <a href='/AG_GRID_DEMO.md' className='text-primary hover:underline'>
                  {t('dashboard.agGridDemo')}
                </a>
              </li>
              <li>
                <a href='/CLEANUP_GUIDE.md' className='text-primary hover:underline'>
                  {t('dashboard.cleanupGuide')}
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Quick Start Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.quickStartTitle')}</CardTitle>
          <CardDescription>{t('dashboard.quickStartDesc')}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid md:grid-cols-3 gap-4'>
            <div>
              <h3 className='font-semibold mb-2'>{t('dashboard.installDeps')}</h3>
              <code className='text-sm bg-muted p-2 rounded block'>npm install</code>
            </div>
            <div>
              <h3 className='font-semibold mb-2'>{t('dashboard.configureEnv')}</h3>
              <code className='text-sm bg-muted p-2 rounded block'>cp .env.example .env</code>
            </div>
            <div>
              <h3 className='font-semibold mb-2'>{t('dashboard.startDev')}</h3>
              <code className='text-sm bg-muted p-2 rounded block'>npm run dev</code>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/')({
  component: HomePage,
})
