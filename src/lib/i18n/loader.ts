/**
 * i18n Translation Loader
 * 翻译文件自动加载器 - 支持模块化和自动发现
 *
 * 特性：
 * 1. 自动发现并加载所有翻译文件
 * 2. 支持全局翻译和功能模块翻译
 * 3. 运行时自动合并翻译
 * 4. 支持懒加载和代码分割
 *
 * 目录结构：
 * src/
 * ├── locales/                     # 全局翻译
 * │   ├── en/
 * │   │   ├── common.json
 * │   │   ├── nav.json
 * │   │   └── auth.json
 * │   └── zh-CN/
 * │       ├── common.json
 * │       ├── nav.json
 * │       └── auth.json
 * └── features/                     # 功能模块翻译
 *     ├── users/
 *     │   └── locales/
 *     │       ├── en.json
 *     │       └── zh-CN.json
 *     └── dashboard/
 *         └── locales/
 *             ├── en.json
 *             └── zh-CN.json
 */

import type { Language } from './types'

/**
 * 翻译模块信息
 */
interface TranslationModule {
  path: string
  locale: Language
  moduleName: string // 模块名称，如 'users', 'dashboard'
  isGlobal: boolean // 是否为全局翻译
  content: Record<string, unknown>
}

/**
 * 解析翻译文件路径，提取模块信息
 *
 * 示例路径：
 * - /src/locales/en/common.json -> { locale: 'en', moduleName: 'common', isGlobal: true }
 * - /src/features/users/locales/zh-CN.json -> { locale: 'zh-CN', moduleName: 'users', isGlobal: false }
 */
function parseTranslationPath(path: string): Omit<TranslationModule, 'content'> | null {
  // 全局翻译: /src/locales/{locale}/{module}.json
  const globalMatch = path.match(/\/locales\/([^/]+)\/([^/]+)\.json$/)
  if (globalMatch) {
    return {
      path,
      locale: globalMatch[1] as Language,
      moduleName: globalMatch[2],
      isGlobal: true,
    }
  }

  // 功能模块翻译: /src/features/{module}/locales/{locale}.json
  const featureMatch = path.match(/\/features\/([^/]+)\/locales\/([^/]+)\.json$/)
  if (featureMatch) {
    return {
      path,
      locale: featureMatch[2] as Language,
      moduleName: featureMatch[1],
      isGlobal: false,
    }
  }

  return null
}

/**
 * 加载所有翻译文件
 * 使用 Vite 的 import.meta.glob 自动发现翻译文件
 */
function loadAllTranslations(): TranslationModule[] {
  const modules: TranslationModule[] = []

  try {
    // 加载全局翻译 (eager: true 表示立即加载，不分割代码)
    const globalTranslations = import.meta.glob('/src/locales/**/*.json', {
      eager: true,
      import: 'default'
    })

    // 加载功能模块翻译
    const featureTranslations = import.meta.glob('/src/features/**/locales/*.json', {
      eager: true,
      import: 'default'
    })

    // 合并所有翻译
    const allTranslations = { ...globalTranslations, ...featureTranslations }

    // 解析并整理翻译模块
    for (const [path, content] of Object.entries(allTranslations)) {
      const moduleInfo = parseTranslationPath(path)
      if (moduleInfo && content) {
        modules.push({
          ...moduleInfo,
          content: content as Record<string, unknown>,
        })
      }
    }

    console.log(`[i18n] Loaded ${modules.length} translation modules`)
  } catch (error) {
    console.error('[i18n] Failed to load translations:', error)
  }

  return modules
}

/**
 * 按语言合并翻译
 *
 * 合并策略：
 * 1. 全局翻译直接放在根级别 (common.*, nav.*, auth.*)
 * 2. 功能模块翻译放在模块命名空间下 (users.*, dashboard.*)
 *
 * 示例结果：
 * {
 *   common: { save: '保存', cancel: '取消' },
 *   nav: { dashboard: '仪表盘' },
 *   users: { title: '用户管理' },
 *   dashboard: { welcome: '欢迎' }
 * }
 */
function mergeTranslationsByLocale(
  modules: TranslationModule[],
  locale: Language
): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  // 筛选出指定语言的翻译模块
  const localeModules = modules.filter(m => m.locale === locale)

  for (const module of localeModules) {
    if (module.isGlobal) {
      // 全局翻译：直接合并到根级别
      // 例如：common.json 的内容合并到 result.common
      result[module.moduleName] = module.content
    } else {
      // 功能模块翻译：合并到模块命名空间
      // 例如：users/locales/zh-CN.json 的内容合并到 result.users
      result[module.moduleName] = {
        ...(result[module.moduleName] as Record<string, unknown> || {}),
        ...module.content,
      }
    }
  }

  return result
}

/**
 * 创建翻译映射表
 * 返回一个 Record<Language, Translations> 的映射
 */
export function createTranslationMap(): Record<string, Record<string, unknown>> {
  const allModules = loadAllTranslations()
  const supportedLocales = Array.from(new Set(allModules.map(m => m.locale)))

  const translationMap: Record<string, Record<string, unknown>> = {}

  for (const locale of supportedLocales) {
    translationMap[locale] = mergeTranslationsByLocale(allModules, locale)
  }

  console.log(`[i18n] Created translation map for locales:`, supportedLocales)
  console.log(`[i18n] Available namespaces:`, Object.keys(translationMap[supportedLocales[0]] || {}))

  return translationMap
}

/**
 * 懒加载功能模块翻译
 * 用于代码分割和按需加载
 *
 * Note: 由于使用 eager loading，所有翻译已在初始化时加载
 * 此函数保留用于未来可能的懒加载场景
 *
 * @param moduleName - 模块名称，如 'users', 'dashboard'
 * @param locale - 语言代码
 */
export async function loadModuleTranslation(
  _moduleName: string,
  _locale: Language
): Promise<Record<string, unknown> | null> {
  // 由于使用 eager: true，所有翻译已预加载
  // 此函数现在只是一个占位符，避免动态导入警告
  console.warn(`[i18n] loadModuleTranslation is deprecated. All translations are eager loaded.`)
  return null
}

/**
 * 获取模块列表
 * 用于调试和开发工具
 */
export function getAvailableModules(): string[] {
  const allModules = loadAllTranslations()
  return Array.from(new Set(allModules.map(m => m.moduleName)))
}

/**
 * 获取支持的语言列表
 */
export function getSupportedLocales(): Language[] {
  const allModules = loadAllTranslations()
  return Array.from(new Set(allModules.map(m => m.locale))) as Language[]
}
