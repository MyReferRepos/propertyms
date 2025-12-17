import { createFileRoute } from '@tanstack/react-router'

import { WorkbenchPage } from '@/features/workbench'

export const Route = createFileRoute('/_authenticated/workbench')({
  component: WorkbenchPage,
})
