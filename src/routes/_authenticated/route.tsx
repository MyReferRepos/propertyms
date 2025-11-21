import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AppShell } from '@/components/layout-v2/app-shell'

export const Route = createFileRoute('/_authenticated')({
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
})
