import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(dirname, '..')
const fallbackAppId = 'touristappid'

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {}

  const env = {}
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/)
  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue

    const separator = line.indexOf('=')
    if (separator <= 0) continue

    const key = line.slice(0, separator).trim()
    let value = line.slice(separator + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    env[key] = value
  }

  return env
}

function loadLocalEnv() {
  const filePaths = [
    path.join(rootDir, '.env'),
    path.join(rootDir, '.env.local'),
    path.join(rootDir, 'backend', '.env'),
    path.join(rootDir, 'backend', '.env.local'),
    path.join(rootDir, 'frontend', '.env'),
    path.join(rootDir, 'frontend', '.env.local')
  ]

  const env = {}
  for (const filePath of filePaths) {
    Object.assign(env, readEnvFile(filePath))
  }
  return env
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

const localEnv = loadLocalEnv()
const appId = process.env.WECHAT_APP_ID || localEnv.WECHAT_APP_ID || fallbackAppId

const manifestTemplatePath = path.join(rootDir, 'frontend', 'src', 'manifest.example.json')
const manifestOutputPath = path.join(rootDir, 'frontend', 'src', 'manifest.json')
const projectConfigTemplatePath = path.join(rootDir, 'frontend', 'project.config.example.json')
const projectConfigOutputPath = path.join(rootDir, 'frontend', 'project.config.json')

const manifest = readJson(manifestTemplatePath)
manifest['mp-weixin'] ||= {}
manifest['mp-weixin'].appid = appId
writeJson(manifestOutputPath, manifest)

const projectConfig = readJson(projectConfigTemplatePath)
projectConfig.appid = appId
writeJson(projectConfigOutputPath, projectConfig)

if (appId === fallbackAppId) {
  console.warn('prepare-wechat-config: WECHAT_APP_ID not found, generated local config with touristappid')
} else {
  console.log('prepare-wechat-config: generated local mp-weixin config from ignored environment file')
}
