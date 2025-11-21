/**
 * i18n Types
 * 国际化类型定义
 */

export type Language = 'en' | 'zh-CN'

export interface LanguageInfo {
  value: Language
  label: string
  flag: string
}

export const SUPPORTED_LANGUAGES: readonly LanguageInfo[] = [
  { value: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
  { value: 'en', label: 'English', flag: '🇺🇸' },
] as const

export const DEFAULT_LANGUAGE: Language = 'zh-CN'
