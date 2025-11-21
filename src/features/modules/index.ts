/**
 * Modules Feature Exports
 * 模块管理功能导出
 */

// Pages
export { ModulesPage } from './pages/modules-page'

// Components
export { ModuleFormDialog } from './components/module-form-dialog'

// API
export { moduleApi } from './api/module-api'

// Types
export type {
  Module,
  ModuleListItem,
  CreateModuleRequest,
  UpdateModuleRequest,
  ModuleFormData,
} from './types'
