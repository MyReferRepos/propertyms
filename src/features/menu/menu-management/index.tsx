/**
 * Menu Management Page
 * 菜单管理综合页面 - 整合菜单组和菜单项管理
 */

import { useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { PageHeader } from '@/components/layout/page-header'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MenuGroupsContent } from './menu-groups-content'
import { MenuItemsContent } from './menu-items-content'

export function MenuManagement() {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState('groups')

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        breadcrumbs={[
          { title: 'Home', href: '/' },
          { title: 'System Management' },
          { title: 'Menu Management' },
        ]}
      />

      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('menu.menuManagement')}</CardTitle>
            <CardDescription>管理系统菜单组和菜单项</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="groups">
                  {t('menu.menuGroups')}
                </TabsTrigger>
                <TabsTrigger value="items">
                  {t('menu.menuItems')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="groups" className="mt-6">
                <MenuGroupsContent />
              </TabsContent>

              <TabsContent value="items" className="mt-6">
                <MenuItemsContent />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
