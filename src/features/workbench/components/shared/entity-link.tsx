import { Building2, Users, FileText, Wrench, ShieldCheck, ClipboardList, User, Truck } from 'lucide-react'

import { cn } from '@/lib/utils'

import type { RelatedEntity } from '../../types/workbench'

interface EntityLinkProps {
  entity?: RelatedEntity
  className?: string
}

const entityIcons: Record<RelatedEntity['type'], typeof Building2> = {
  property: Building2,
  tenant: Users,
  tenancy: FileText,
  maintenance: Wrench,
  compliance: ShieldCheck,
  inspection: ClipboardList,
  owner: User,
  supplier: Truck,
}

export function EntityLink({ entity, className }: EntityLinkProps) {
  if (!entity) return null

  const Icon = entityIcons[entity.type]

  return (
    <span
      className={cn(
        'text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs transition-colors',
        className
      )}
    >
      <Icon className="h-3 w-3" />
      <span className="truncate">{entity.name}</span>
    </span>
  )
}
