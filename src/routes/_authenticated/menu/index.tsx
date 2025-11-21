import { createFileRoute } from '@tanstack/react-router'
import { MenuManagement } from '@/features/menu/menu-management'

export const Route = createFileRoute('/_authenticated/menu/')({
  component: MenuManagement,
})
