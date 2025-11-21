/**
 * Menu Management Page
 * 菜单管理页面 - 整合菜单组和菜单项管理
 */

import { useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { PageHeader } from '@/components/layout/page-header'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MenuGroups } from './menu-groups'
import { MenuItems } from './menu-items'

export function MenuManagement() {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState('groups')

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title={t('menu.menuManagement')}
        description="管理系统菜单组和菜单项"
      />

      <Card>
        <CardContent className="pt-6">
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
              <MenuGroups />
            </TabsContent>

            <TabsContent value="items" className="mt-6">
              <MenuItems />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
