/**
 * Demo Page
 * 演示页面 - 展示框架的各项功能
 */

import type { ColDef, ICellRendererParams } from 'ag-grid-community'
import { createFileRoute } from '@tanstack/react-router'
import { Edit, Table2, Trash2, User } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { AgGridTable } from '@/components/data-table'
import { PageHeader } from '@/components/layout/page-header'
import { LanguageSwitcher } from '@/components/i18n/language-switcher'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/lib/auth'
import { useI18n } from '@/lib/i18n'

// 示例数据类型
interface DemoUser {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: 'active' | 'inactive' | 'pending'
  joinDate: string
  salary: number
  performance: number
}

// 生成更丰富的示例数据
const generateSampleData = (): DemoUser[] => {
  const roles = ['Admin', 'User', 'Manager', 'Developer', 'Designer']
  const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance']
  const statuses: Array<'active' | 'inactive' | 'pending'> = ['active', 'inactive', 'pending']
  const names = [
    'John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams', 'Charlie Brown',
    'Diana Prince', 'Edward Norton', 'Fiona Apple', 'George Martin', 'Hannah Montana',
    'Ivan Petrov', 'Julia Roberts', 'Kevin Hart', 'Laura Palmer', 'Michael Scott',
    'Nancy Drew', 'Oscar Wilde', 'Patricia Hill', 'Quinn Mallory', 'Rachel Green',
  ]

  return names.map((name, index) => ({
    id: (index + 1).toString(),
    name,
    email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
    role: roles[index % roles.length],
    department: departments[index % departments.length],
    status: statuses[index % statuses.length],
    joinDate: new Date(2020 + (index % 5), (index % 12), (index % 28) + 1).toISOString().split('T')[0],
    salary: 50000 + (index * 5000),
    performance: 60 + (index % 40),
  }))
}

export const Route = createFileRoute('/_authenticated/demo')({
  component: DemoPage,
})

function DemoPage() {
  const { t } = useI18n()
  const { user, isAuthenticated } = useAuthStore()
  const [tableData, setTableData] = useState<DemoUser[]>(() => {
    const data = generateSampleData()
    // eslint-disable-next-line no-console
    console.log('Generated sample data:', data.length, 'users')
    return data
  })
  const [selectedRows, setSelectedRows] = useState<DemoUser[]>([])
  const [searchText, setSearchText] = useState('')

  // 处理行操作
  const handleEdit = (rowData: DemoUser) => {
    toast.success(`${t('common.edit')} ${t('auth.username')}: ${rowData.name}`)
  }

  const handleDelete = (rowData: DemoUser) => {
    setTableData(prev => prev.filter(item => item.id !== rowData.id))
    toast.success(`${t('common.delete')} ${t('auth.username')}: ${rowData.name}`)
  }

  // 状态Badge渲染器
  const StatusCellRenderer = (props: ICellRendererParams<DemoUser>) => {
    const status = props.value as 'active' | 'inactive' | 'pending'
    const variant = {
      active: 'default' as const,
      inactive: 'destructive' as const,
      pending: 'secondary' as const,
    }[status]

    return (
      <Badge variant={variant} className='capitalize'>
        {status}
      </Badge>
    )
  }

  // 操作按钮渲染器
  const ActionCellRenderer = (props: ICellRendererParams<DemoUser>) => {
    if (!props.data) return null

    return (
      <div className='flex gap-2'>
        <Button
          size='sm'
          variant='ghost'
          onClick={() => handleEdit(props.data!)}
        >
          <Edit className='h-4 w-4' />
        </Button>
        <Button
          size='sm'
          variant='ghost'
          onClick={() => handleDelete(props.data!)}
        >
          <Trash2 className='h-4 w-4 text-destructive' />
        </Button>
      </div>
    )
  }

  // 金额格式化
  const currencyFormatter = (params: { value: number }) => {
    return `$${params.value.toLocaleString()}`
  }

  // 性能评分渲染器
  const PerformanceCellRenderer = (props: ICellRendererParams<DemoUser>) => {
    const value = props.value as number
    const color = value >= 80 ? 'text-green-600' : value >= 60 ? 'text-yellow-600' : 'text-red-600'

    return (
      <div className='flex items-center gap-2'>
        <div className='w-full bg-muted rounded-full h-2'>
          <div
            className={`h-2 rounded-full ${value >= 80 ? 'bg-green-600' : value >= 60 ? 'bg-yellow-600' : 'bg-red-600'}`}
            style={{ width: `${value}%` }}
          />
        </div>
        <span className={`text-sm font-medium ${color}`}>{value}%</span>
      </div>
    )
  }

  // 定义表格列
  const columnDefs: ColDef<DemoUser>[] = useMemo(() => [
    {
      field: 'id',
      headerName: t('demo.columnId'),
      width: 80,
    },
    {
      field: 'name',
      headerName: t('auth.username'),
      flex: 1,
      filter: true,
    },
    {
      field: 'email',
      headerName: t('auth.email'),
      flex: 1.2,
      filter: true,
    },
    {
      field: 'role',
      headerName: t('demo.columnRole'),
      width: 120,
      filter: true,
    },
    {
      field: 'department',
      headerName: t('demo.columnDepartment'),
      width: 130,
      filter: true,
    },
    {
      field: 'status',
      headerName: t('demo.columnStatus'),
      width: 120,
      cellRenderer: StatusCellRenderer,
      filter: true,
    },
    {
      field: 'joinDate',
      headerName: t('demo.columnJoinDate'),
      width: 130,
      filter: 'agDateColumnFilter',
    },
    {
      field: 'salary',
      headerName: t('demo.columnSalary'),
      width: 130,
      valueFormatter: currencyFormatter,
      filter: 'agNumberColumnFilter',
    },
    {
      field: 'performance',
      headerName: t('demo.columnPerformance'),
      width: 180,
      cellRenderer: PerformanceCellRenderer,
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: t('demo.columnActions'),
      width: 120,
      cellRenderer: ActionCellRenderer,
      pinned: 'right',
      sortable: false,
      filter: false,
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [t])

  // 过滤数据
  const filteredData = useMemo(() => {
    if (!searchText) return tableData

    return tableData.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(searchText.toLowerCase())
      )
    )
  }, [tableData, searchText])

  return (
    <div className='flex flex-1 flex-col'>
      <PageHeader
        breadcrumbs={[
          { title: 'Home', href: '/' },
          { title: 'Framework Demo' },
        ]}
        actions={<LanguageSwitcher />}
      />

      <div className='flex-1 space-y-4 p-4 md:p-6 lg:p-8'>
        {/* 认证状态卡片 */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <User className='h-5 w-5' />
              {t('demo.authCardTitle')}
            </CardTitle>
            <CardDescription>
              {t('demo.authCardDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <p>
                <strong>{t('demo.status')}:</strong>{' '}
                {isAuthenticated ? (
                  <span className='text-green-600'>{t('demo.authenticated')}</span>
                ) : (
                  <span className='text-red-600'>{t('demo.notAuthenticated')}</span>
                )}
              </p>
              {user && (
                <>
                  <p>
                    <strong>{t('auth.username')}:</strong> {user.username}
                  </p>
                  <p>
                    <strong>{t('auth.email')}:</strong> {user.email}
                  </p>
                  <p>
                    <strong>{t('demo.role')}:</strong> {user.roles?.join(',')}
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* AG Grid表格演示 */}
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle className='flex items-center gap-2'>
                  <Table2 className='h-5 w-5' />
                  {t('demo.tableTitle')}
                </CardTitle>
                <CardDescription>
                  {t('demo.tableDesc')}
                </CardDescription>
              </div>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setTableData(generateSampleData())}
                >
                  {t('demo.resetData')}
                </Button>
                {selectedRows.length > 0 && (
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => {
                      setTableData(prev =>
                        prev.filter(item => !selectedRows.some(selected => selected.id === item.id))
                      )
                      setSelectedRows([])
                      toast.success(t('demo.deleteSelected').replace('{count}', selectedRows.length.toString()))
                    }}
                  >
                    {t('demo.deleteSelected').replace('{count}', selectedRows.length.toString())}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {/* 搜索框 */}
              <div className='flex items-center gap-4'>
                <Input
                  placeholder={t('demo.searchPlaceholder')}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className='max-w-sm'
                />
                {searchText && (
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setSearchText('')}
                  >
                    {t('demo.clear')}
                  </Button>
                )}
              </div>

              {/* 数据调试信息 */}
              {tableData.length === 0 && (
                <div className='rounded-lg border border-yellow-500 p-4 bg-yellow-50 dark:bg-yellow-900/20'>
                  <p className='text-sm font-medium text-yellow-800 dark:text-yellow-200'>
                    {t('demo.noDataWarning')}
                  </p>
                </div>
              )}

              {/* 统计信息 */}
              <div className='flex gap-4 text-sm text-muted-foreground'>
                <span className='font-medium'>{t('demo.totalUsers').replace('{count}', tableData.length.toString())}</span>
                <span>{t('demo.filteredUsers').replace('{count}', filteredData.length.toString())}</span>
                {selectedRows.length > 0 && (
                  <span className='text-primary font-medium'>
                    {t('demo.selectedUsers').replace('{count}', selectedRows.length.toString())}
                  </span>
                )}
              </div>

              {/* AG Grid表格 */}
              {filteredData.length > 0 ? (
                <>
                  <AgGridTable
                    rowData={filteredData}
                    columnDefs={columnDefs}
                    height='600px'
                    pagination
                    paginationPageSize={10}
                    onSelectionChanged={setSelectedRows}
                    gridOptions={{
                      rowSelection: {
                        mode: 'multiRow',
                        checkboxes: true,
                        headerCheckbox: true,
                        enableClickSelection: false,  // 禁用行点击选择
                      },
                      animateRows: true,
                      paginationPageSizeSelector: [10, 20, 50, 100],  // 包含当前页面大小
                    }}
                  />

                  {/* 功能说明 */}
                  <div className='rounded-lg border p-4 bg-muted/50'>
                    <h4 className='font-semibold mb-2'>{t('demo.tableFeatures')}</h4>
                    <div className='grid grid-cols-2 gap-2 text-sm text-muted-foreground'>
                      <div>{t('demo.featureMultiSort')}</div>
                      <div>{t('demo.featureFiltering')}</div>
                      <div>{t('demo.featurePagination')}</div>
                      <div>{t('demo.featureSelection')}</div>
                      <div>{t('demo.featureRenderers')}</div>
                      <div>{t('demo.featureRowActions')}</div>
                      <div>{t('demo.featurePinnedColumns')}</div>
                      <div>{t('demo.featureGlobalSearch')}</div>
                      <div>{t('demo.featureThemeAdapt')}</div>
                      <div>{t('demo.featureResponsive')}</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className='rounded-lg border p-8 text-center'>
                  <p className='text-lg font-medium text-muted-foreground'>
                    {t('demo.noData')}
                  </p>
                  <p className='text-sm text-muted-foreground mt-2'>
                    {searchText ? t('demo.noResults') : t('demo.clickReset')}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* API交互演示 */}
        <Card>
          <CardHeader>
            <CardTitle>{t('demo.apiTitle')}</CardTitle>
            <CardDescription>
              {t('demo.apiDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <p className='text-sm text-muted-foreground'>
                {t('demo.apiFeatures')}
              </p>
              <ul className='list-inside list-disc space-y-1 text-sm'>
                <li>{t('demo.apiFeature1')}</li>
                <li>{t('demo.apiFeature2')}</li>
                <li>{t('demo.apiFeature3')}</li>
                <li>{t('demo.apiFeature4')}</li>
                <li>{t('demo.apiFeature5')}</li>
              </ul>
              <div className='pt-2'>
                <Button variant='outline' size='sm'>
                  {t('demo.testApi')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* i18n国际化演示 */}
        <Card>
          <CardHeader>
            <CardTitle>{t('demo.i18nTitle')}</CardTitle>
            <CardDescription>
              {t('demo.i18nDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <p className='text-sm text-muted-foreground'>
                {t('demo.currentTranslations')}
              </p>
              <ul className='list-inside list-disc space-y-1 text-sm'>
                <li>{t('common.confirm')}</li>
                <li>{t('common.cancel')}</li>
                <li>{t('common.save')}</li>
                <li>{t('auth.login')}</li>
                <li>{t('auth.logout')}</li>
              </ul>
              <p className='pt-2 text-sm text-muted-foreground'>
                {t('demo.useSwitcher')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
