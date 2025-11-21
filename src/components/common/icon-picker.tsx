/**
 * Icon Picker Component
 * 图标选择器组件
 */

import { useState, useMemo } from 'react'
import { Check, X } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { getAvailableIcons } from '@/components/layout/utils/icon-mapper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import * as LucideIcons from 'lucide-react'

interface IconPickerProps {
  value?: string | null
  onChange: (value: string | null) => void
  disabled?: boolean
}

export function IconPicker({ value, onChange, disabled }: IconPickerProps) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  // 获取所有可用图标
  const availableIcons = useMemo(() => getAvailableIcons(), [])

  // 过滤图标
  const filteredIcons = useMemo(() => {
    if (!search) return availableIcons
    const searchLower = search.toLowerCase()
    return availableIcons.filter((icon) =>
      icon.toLowerCase().includes(searchLower)
    )
  }, [availableIcons, search])

  // 获取图标组件
  const getIconComponent = (iconName: string) => {
    return (LucideIcons as any)[iconName]
  }

  // 当前选中的图标组件
  const SelectedIcon = value ? getIconComponent(value) : null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          <div className="flex items-center gap-2">
            {SelectedIcon ? (
              <>
                <SelectedIcon className="h-4 w-4" />
                <span>{value}</span>
              </>
            ) : (
              <span className="text-muted-foreground">{t('menu.selectIcon')}</span>
            )}
          </div>
          {value && (
            <X
              className="ml-2 h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation()
                onChange(null)
                setOpen(false)
              }}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <div className="flex flex-col gap-2 p-2">
          <Input
            placeholder={t('menu.iconSearch')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9"
          />
          <ScrollArea className="h-[300px]">
            <div className="grid grid-cols-6 gap-2 p-2">
              {filteredIcons.map((iconName) => {
                const IconComponent = getIconComponent(iconName)
                const isSelected = value === iconName

                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => {
                      onChange(iconName)
                      setOpen(false)
                    }}
                    className={cn(
                      'flex flex-col items-center justify-center gap-1 rounded-md border p-2 hover:bg-accent hover:text-accent-foreground',
                      isSelected && 'bg-accent border-primary'
                    )}
                    title={iconName}
                  >
                    {IconComponent && <IconComponent className="h-5 w-5" />}
                    {isSelected && (
                      <Check className="absolute top-1 right-1 h-3 w-3 text-primary" />
                    )}
                  </button>
                )
              })}
            </div>
            {filteredIcons.length === 0 && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {t('menu.noData')}
              </div>
            )}
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  )
}
