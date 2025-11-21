import { createFileRoute } from '@tanstack/react-router'
import { MenuItems } from '@/features/menu/menu-items'

export const Route = createFileRoute('/_authenticated/menu/items')({
  component: MenuItems,
})
