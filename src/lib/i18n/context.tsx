/**
 * i18n Context (Modular Version)
 * 国际化上下文 - 模块化版本，支持自动加载和合并翻译
 *
 * 特性：
 * 1. 自动加载所有模块的翻译文件
 * 2. 支持全局翻译和功能模块翻译
 * 3. 运行时自动合并翻译
 * 4. 向后兼容旧版大文件翻译
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { type Language } from './types'
import { createTranslationMap } from './loader'

interface I18nContextValue {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined)

const STORAGE_KEY = 'app-language'

/**
 * 从嵌套对象中获取值
 * 例如：get(obj, 'a.b.c') => obj.a.b.c
 */
function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  const keys = path.split('.')
  let result: unknown = obj

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key]
    } else {
      return undefined
    }
  }

  return typeof result === 'string' ? result : undefined
}

/**
 * 初始化翻译映射
 */
function initializeTranslations(): Record<string, Record<string, unknown>> {
  try {
    const modularTranslations = createTranslationMap()
    console.log('[i18n] Using modular translation mode')
    return modularTranslations
  } catch (error) {
    console.error('[i18n] Failed to load modular translations:', error)
    return {}
  }
}

// 初始化翻译
const translations = initializeTranslations()

/**
 * i18n Provider
 */
export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // 从 localStorage 读取保存的语言设置
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && isValidLanguage(saved)) {
      return saved as Language
    }
    // 首次访问，根据浏览器语言自动选择
    // 如果浏览器语言不支持，默认使用中文
    return detectBrowserLanguage()
  })

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    localStorage.setItem(STORAGE_KEY, newLanguage)
  }

  // 翻译函数
  const t = (key: string, params?: Record<string, string | number>): string => {
    const currentTranslations = translations[language]
    if (!currentTranslations) {
      console.warn(`[i18n] No translations found for language: ${language}`)
      return key
    }

    let value = getNestedValue(currentTranslations, key)

    if (!value) {
      // 开发环境下记录缺失的翻译键
      if (import.meta.env.DEV) {
        console.warn(`[i18n] Missing translation: ${language}.${key}`)
      }
      value = key
    }

    // 替换参数占位符 {paramName}
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        value = value?.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue))
      })
    }

    return value || key
  }

  // 当语言改变时，更新 HTML lang 属性
  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

/**
 * 使用 i18n context 的 hook
 */
export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return context
}

/**
 * 验证语言代码是否有效
 */
function isValidLanguage(lang: string): boolean {
  return ['en', 'zh-CN'].includes(lang)
}

/**
 * 检测浏览器语言并返回支持的语言
 * 如果浏览器语言不在支持列表中，返回中文作为默认语言
 */
function detectBrowserLanguage(): Language {
  // 获取浏览器语言列表
  const browserLanguages = navigator.languages || [navigator.language]

  for (const browserLang of browserLanguages) {
    const lang = browserLang.toLowerCase()

    // 完全匹配
    if (lang === 'zh-cn' || lang === 'zh') {
      console.log('[i18n] Browser language detected:', browserLang, '-> zh-CN')
      return 'zh-CN'
    }
    if (lang === 'en' || lang.startsWith('en-')) {
      console.log('[i18n] Browser language detected:', browserLang, '-> en')
      return 'en'
    }

    // 匹配语言前缀
    if (lang.startsWith('zh')) {
      console.log('[i18n] Browser language detected:', browserLang, '-> zh-CN (prefix match)')
      return 'zh-CN'
    }
  }

  // 默认返回中文
  console.log('[i18n] Browser language not supported, using default: zh-CN')
  return 'zh-CN'
}
