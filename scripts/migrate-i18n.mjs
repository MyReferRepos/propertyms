/**
 * i18n Migration Script (ESM version)
 * 将单一大文件翻译拆分为模块化翻译结构
 *
 * 使用方法：
 * node scripts/migrate-i18n.mjs
 * node scripts/migrate-i18n.mjs --dry-run
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 迁移配置
 */
const defaultConfig = {
  // 全局模块
  global: {
    common: ['common'],
    auth: ['auth'],
    nav: ['nav'],
    breadcrumb: ['breadcrumb'],
    user: ['user'],
  },
  // 功能模块
  features: {
    users: ['users', 'userManagement'],
    roles: ['roles', 'roleManagement'],
    permissions: ['permissions', 'permissionManagement'],
    dashboard: ['dashboard'],
    demo: ['demo'],
    settings: ['settings'],
    profile: ['profile'],
  }
}

function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.error(`Failed to read ${filePath}:`, error.message)
    return null
  }
}

function writeJsonFile(filePath, data) {
  try {
    const dir = path.dirname(filePath)
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8')
    return true
  } catch (error) {
    console.error(`Failed to write ${filePath}:`, error.message)
    return false
  }
}

function splitGlobalModules(translations, config, locale, outputDir) {
  const results = []

  for (const [moduleName, keys] of Object.entries(config)) {
    const moduleData = {}
    let keyCount = 0

    for (const key of keys) {
      if (translations[key]) {
        moduleData[key] = translations[key]
        keyCount++
      }
    }

    if (keyCount > 0) {
      const outputPath = path.join(outputDir, 'locales', locale, `${moduleName}.json`)
      const success = writeJsonFile(outputPath, moduleData)
      results.push({
        module: moduleName,
        type: 'global',
        path: outputPath,
        keys: keyCount,
        success
      })
    }
  }

  return results
}

function splitFeatureModules(translations, config, locale, outputDir) {
  const results = []

  for (const [moduleName, keys] of Object.entries(config)) {
    const moduleData = {}
    let keyCount = 0

    for (const key of keys) {
      if (translations[key]) {
        moduleData[key] = translations[key]
        keyCount++
      }
    }

    if (keyCount > 0) {
      const outputPath = path.join(outputDir, 'features', moduleName, 'locales', `${locale}.json`)
      const success = writeJsonFile(outputPath, moduleData)
      results.push({
        module: moduleName,
        type: 'feature',
        path: outputPath,
        keys: keyCount,
        success
      })
    }
  }

  return results
}

function findUnassignedKeys(translations, config) {
  const assignedKeys = new Set()

  for (const keys of Object.values(config.global)) {
    keys.forEach(key => assignedKeys.add(key))
  }
  for (const keys of Object.values(config.features)) {
    keys.forEach(key => assignedKeys.add(key))
  }

  const unassignedKeys = []
  for (const key of Object.keys(translations)) {
    if (!assignedKeys.has(key)) {
      unassignedKeys.push(key)
    }
  }

  return unassignedKeys
}

function migrate(options = {}) {
  const {
    config = defaultConfig,
    locales = ['en', 'zh-CN'],
    inputDir = path.join(__dirname, '..', 'src'),
    outputDir = path.join(__dirname, '..', 'src'),
    dryRun = false
  } = options

  console.log('🚀 Starting i18n migration...\n')

  const report = {
    locales: [],
    totalFiles: 0,
    totalKeys: 0,
    unassignedKeys: {}
  }

  for (const locale of locales) {
    console.log(`📦 Processing locale: ${locale}`)

    const inputFile = path.join(inputDir, 'locales', `${locale}.json`)
    const translations = readJsonFile(inputFile)

    if (!translations) {
      console.log(`  ⚠️  Skipped: file not found\n`)
      continue
    }

    const localeReport = {
      locale,
      inputFile,
      modules: [],
      totalKeys: Object.keys(translations).length
    }

    const unassignedKeys = findUnassignedKeys(translations, config)
    if (unassignedKeys.length > 0) {
      console.log(`  ⚠️  Found ${unassignedKeys.length} unassigned keys:`)
      console.log(`     ${unassignedKeys.slice(0, 10).join(', ')}${unassignedKeys.length > 10 ? '...' : ''}\n`)
      report.unassignedKeys[locale] = unassignedKeys
    }

    if (!dryRun) {
      const globalResults = splitGlobalModules(translations, config.global, locale, outputDir)
      localeReport.modules.push(...globalResults)

      const featureResults = splitFeatureModules(translations, config.features, locale, outputDir)
      localeReport.modules.push(...featureResults)

      console.log('  ✅ Global modules:')
      globalResults.forEach(r => {
        console.log(`     ${r.module}: ${r.keys} keys → ${path.relative(process.cwd(), r.path)}`)
      })

      console.log('  ✅ Feature modules:')
      featureResults.forEach(r => {
        console.log(`     ${r.module}: ${r.keys} keys → ${path.relative(process.cwd(), r.path)}`)
      })

      report.totalFiles += globalResults.length + featureResults.length
      report.totalKeys += globalResults.reduce((sum, r) => sum + r.keys, 0) +
                         featureResults.reduce((sum, r) => sum + r.keys, 0)
    }

    report.locales.push(localeReport)
    console.log('')
  }

  console.log('📊 Migration Summary:')
  console.log(`  Total locales: ${report.locales.length}`)
  console.log(`  Total files created: ${report.totalFiles}`)
  console.log(`  Total keys migrated: ${report.totalKeys}`)

  if (Object.keys(report.unassignedKeys).length > 0) {
    console.log(`\n⚠️  Warning: Some keys were not assigned to any module.`)
    console.log(`  Please update the migration config or manually handle these keys.`)
  }

  if (dryRun) {
    console.log(`\n🔍 Dry run completed. No files were created.`)
    console.log(`  Remove --dry-run flag to perform actual migration.`)
  } else {
    console.log(`\n✅ Migration completed successfully!`)
  }

  return report
}

// CLI
const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')

migrate({ dryRun })
