import { AppSidebar } from './app-sidebar'
import { AppHeader } from './app-header'
import { PropertyPilot } from '@/features/ai-features/property-pilot/property-pilot'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <AppHeader />

          {/* Page Content */}
          <main className="flex-1 overflow-auto bg-background p-6">{children}</main>
        </div>
      </div>

      {/* AI Assistant - Floating globally */}
      <PropertyPilot />
    </>
  )
}
