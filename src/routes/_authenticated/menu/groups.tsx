import { createFileRoute } from '@tanstack/react-router'
import { MenuGroups } from '@/features/menu/menu-groups'

export const Route = createFileRoute('/_authenticated/menu/groups')({
  component: MenuGroups,
})
