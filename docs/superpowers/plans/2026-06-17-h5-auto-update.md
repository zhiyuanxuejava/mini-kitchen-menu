# H5 自动更新机制 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修掉 H5 部署新版后手机端长时间卡在老版本的问题。一次性根因修复（nginx 给 `index.html` 和 `version.json` 设正确缓存策略），叠加客户端版本探测（构建期把 git short sha bake 进 JS bundle，运行期周期性比对 `/version.json`，不一致弹模态框由用户确认刷新）。

**Architecture:** 新增 `scripts/prepare-h5-version.mjs` 在 H5 构建前生成 `.h5-version.json`；`frontend/vite.config.ts` 用 Vite `define` 注入 `__APP_VERSION__` 常量，并新增本地插件在 `writeBundle` 时把同名 JSON 写到 H5 产物根；新增 `frontend/src/utils/version-check.ts` 模块在 H5 平台启动后用三个触发器（启动后 2s / `visibilitychange` 回前台 / 5 分钟兜底）比对版本，不一致用 `uni.showModal` 弹窗，用户点"立即更新"则 `window.location.reload()`，点"稍后"则进入 30 分钟静默。

**Tech Stack:** uni-app H5 + Vue 3 + TypeScript + Vite；nginx；Node.js 构建脚本。

> **执行须知 ·** 仓库零测试基建，本计划不引入测试框架，验证方式：`npm --workspace frontend run typecheck` + `npm run build:frontend:h5` 通过 + 手动起静态服务器联调（每个任务写清楚跑什么命令、看什么输出）。设计文档：[docs/superpowers/specs/2026-06-17-h5-auto-update-design.md](../specs/2026-06-17-h5-auto-update-design.md)。

> **范围说明 ·** 设计 §7.3 列了 4 个检测触发器（启动 / visibilitychange / 路由切换 / 5 分钟兜底），本计划只实施前 3 个减去"路由切换"，即：**启动后 2s + visibilitychange + 5 分钟兜底**。理由：visibilitychange + 5 分钟兜底已覆盖"切回前台"和"日常使用中"两个核心场景；路由切换需要 monkey-patch `history.pushState/replaceState`，可靠性低于其他两个触发器，先简化掉。如果后续验证发现 5 分钟兜底不够实时，再补回来。

---

## 文件结构

```
scripts/prepare-h5-version.mjs                         新增：H5 构建前生成 frontend/.h5-version.json
frontend/vite.config.ts                                修改：注入 __APP_VERSION__ + 写 dist/build/h5/version.json
frontend/package.json                                  修改：dev:h5 / dev:h5:lan / build:h5 三个脚本前置版本脚本
frontend/src/env.d.ts                                  修改：声明 __APP_VERSION__ / __APP_BUILD_AT__
frontend/src/utils/version-check.ts                    新增：客户端版本探测模块
frontend/src/App.vue                                   修改：onLaunch 里调 startVersionCheck()
.gitignore                                             修改：忽略 frontend/.h5-version.json
deploy/linux/nginx/mini-kitchen-menu.conf.example      修改：index.html / version.json 缓存策略
docs/superpowers/plans/2026-06-17-h5-auto-update.md    新增：本计划
```

不动：后端任何代码、`backend/`、小程序构建脚本（`dev:mp-weixin` / `build:mp-weixin`）、`deploy/linux/deploy-ip.sh`、`deploy/linux/upgrade-upload-bundle.sh`、`deploy/linux/create-upload-bundle.ps1`、所有 admin 相关代码。

---

## Task 1: 新增 `prepare-h5-version.mjs` 构建脚本

**Files:**
- Create: `scripts/prepare-h5-version.mjs`

- [ ] **Step 1: 创建脚本文件**

新建 `scripts/prepare-h5-version.mjs`，内容如下：

```js
#!/usr/bin/env node
// Generate frontend/.h5-version.json so Vite can bake the version into
// the H5 bundle and emit a matching /version.json into dist.

import { execSync } from 'node:child_process'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const repoRoot = resolve(__dirname, '..')
const outFile = resolve(repoRoot, 'frontend', '.h5-version.json')

function resolveVersion() {
  try {
    const sha = execSync('git rev-parse --short HEAD', {
      cwd: repoRoot,
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim()
    if (sha) return sha
  } catch {
    /* fall through */
  }
  try {
    return new Date().toISOString()
  } catch {
    return `dev-${Date.now()}`
  }
}

const version = resolveVersion()
const buildAt = new Date().toISOString()
const payload = { version, buildAt }

mkdirSync(dirname(outFile), { recursive: true })
writeFileSync(outFile, JSON.stringify(payload, null, 2) + '\n', 'utf8')

console.log(`[prepare-h5-version] version=${version} buildAt=${buildAt}`)
```

- [ ] **Step 2: 验证脚本能跑**

在仓库根目录运行：

```bash
node scripts/prepare-h5-version.mjs
```

期望输出形如：

```
[prepare-h5-version] version=<git-sha> buildAt=<ISO 时间>
```

检查 `frontend/.h5-version.json` 已生成，内容形如：

```json
{
  "version": "abc1234",
  "buildAt": "2026-06-17T08:23:11.000Z"
}
```

- [ ] **Step 3: Commit**

```bash
git add scripts/prepare-h5-version.mjs
git commit -m "feat: add prepare-h5-version build script to capture git sha"
```

---

## Task 2: `.gitignore` 忽略生成的版本文件

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: 在 `.gitignore` 里加一行**

打开根目录 `.gitignore`，在 `frontend/src/manifest.json` 一行之后追加：

```
frontend/.h5-version.json
```

完整上下文应该是（仅展示相邻行）：

```
frontend/project.config.json
frontend/src/manifest.json
frontend/.h5-version.json
```

- [ ] **Step 2: 验证 git 已忽略**

确认 `frontend/.h5-version.json` 已生成（Task 1 跑过）。然后运行：

```bash
git status --short | grep h5-version
```

期望：**没有任何输出**（说明 git 不再追踪它）。

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore: gitignore frontend/.h5-version.json"
```

---

## Task 3: 修改 `frontend/vite.config.ts` 注入版本号并产出 `/version.json`

**Files:**
- Modify: `frontend/vite.config.ts`

- [ ] **Step 1: 整段替换 `vite.config.ts`**

把整个 `frontend/vite.config.ts` 替换成：

```ts
import { defineConfig, Plugin } from 'vite'
import uniPlugin from '@dcloudio/vite-plugin-uni'
import { fileURLToPath, URL } from 'node:url'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'

const uni = typeof uniPlugin === 'function' ? uniPlugin : uniPlugin.default

const versionFile = fileURLToPath(new URL('./.h5-version.json', import.meta.url))
let version = 'unknown'
let buildAt = 'unknown'
if (existsSync(versionFile)) {
  try {
    const parsed = JSON.parse(readFileSync(versionFile, 'utf8'))
    if (typeof parsed.version === 'string' && parsed.version) version = parsed.version
    if (typeof parsed.buildAt === 'string' && parsed.buildAt) buildAt = parsed.buildAt
  } catch {
    /* ignore malformed file */
  }
}

function writeH5VersionJsonPlugin(): Plugin {
  return {
    name: 'write-h5-version-json',
    apply: 'build',
    writeBundle() {
      if (process.env.UNI_PLATFORM !== 'h5') return
      const outDir =
        process.env.UNI_OUTPUT_DIR ||
        resolve(fileURLToPath(new URL('./dist/build/h5', import.meta.url)))
      mkdirSync(outDir, { recursive: true })
      const file = resolve(outDir, 'version.json')
      writeFileSync(file, JSON.stringify({ version, buildAt }) + '\n', 'utf8')
      console.log(`[write-h5-version-json] wrote ${file}`)
    }
  }
}

export default defineConfig({
  plugins: [uni(), writeH5VersionJsonPlugin()],
  define: {
    __APP_VERSION__: JSON.stringify(version),
    __APP_BUILD_AT__: JSON.stringify(buildAt)
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

关键点说明（保留在头脑里，不写进代码注释）：
- `version` / `buildAt` 是在 Vite **配置加载时** 读取，所以 `prepare-h5-version.mjs` 必须先跑。
- `define` 用 `JSON.stringify` 包了一层 —— Vite 的 `define` 是文本替换，传字符串需要带引号。
- `writeH5VersionJsonPlugin` 用 `process.env.UNI_PLATFORM` 判断，只在 H5 平台 `build` 模式下落盘（dev 不跑 `writeBundle`，也不写文件 —— 这是 by design，dev 模式下 `version-check` 模块 fetch `/version.json` 404 就静默退出）。
- `UNI_OUTPUT_DIR` 是 `@dcloudio/vite-plugin-uni` 设置的环境变量，写死的 fallback 是仓库当前的默认产物路径。

- [ ] **Step 2: 验证 typecheck 通过**

在仓库根运行：

```bash
npm --workspace frontend run typecheck
```

期望：无报错。注意此时 `frontend/src/env.d.ts` 还没声明 `__APP_VERSION__`，但 vite.config.ts 里不引用这俩常量，所以这步应该过。如果报别的错，停下来排查。

- [ ] **Step 3: Commit**

```bash
git add frontend/vite.config.ts
git commit -m "feat(h5): inject __APP_VERSION__ and emit version.json on build"
```

---

## Task 4: 在 `frontend/package.json` 的 H5 脚本里前置版本生成

**Files:**
- Modify: `frontend/package.json`

- [ ] **Step 1: 替换 scripts 段**

打开 `frontend/package.json`，把 `scripts` 段改成：

```json
"scripts": {
  "dev:mp-weixin": "node ../scripts/prepare-wechat-config.mjs && uni -p mp-weixin",
  "build:mp-weixin": "node ../scripts/prepare-wechat-config.mjs && uni build -p mp-weixin",
  "dev:h5": "node ../scripts/prepare-wechat-config.mjs && node ../scripts/prepare-h5-version.mjs && uni",
  "dev:h5:lan": "node ../scripts/prepare-wechat-config.mjs && node ../scripts/prepare-h5-version.mjs && uni --host 0.0.0.0 --port 5173",
  "build:h5": "node ../scripts/prepare-wechat-config.mjs && node ../scripts/prepare-h5-version.mjs && uni build",
  "typecheck": "vue-tsc --noEmit"
}
```

注意：小程序两个脚本（`dev:mp-weixin` / `build:mp-weixin`）**不要** 前置 `prepare-h5-version.mjs`。

- [ ] **Step 2: 验证 H5 构建链路**

在仓库根运行：

```bash
npm run build:frontend:h5
```

期望：
- 构建过程中能看到 `[prepare-h5-version] version=... buildAt=...` 行。
- 构建结束有 `[write-h5-version-json] wrote .../dist/build/h5/version.json` 行。
- `frontend/dist/build/h5/version.json` 存在，内容是 `{"version":"<sha>","buildAt":"..."}`。

如果构建报错或没有看到这两行，停下来排查。

- [ ] **Step 3: Commit**

```bash
git add frontend/package.json
git commit -m "feat(h5): prepend prepare-h5-version to H5 dev and build scripts"
```

---

## Task 5: 在 `frontend/src/env.d.ts` 声明全局常量

**Files:**
- Modify: `frontend/src/env.d.ts`

- [ ] **Step 1: 在文件末尾追加声明**

打开 `frontend/src/env.d.ts`，文件原始内容是：

```ts
/// <reference types="@dcloudio/types" />
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}

declare module '*.scss'
```

在文件末尾追加：

```ts

declare const __APP_VERSION__: string
declare const __APP_BUILD_AT__: string
```

- [ ] **Step 2: 验证 typecheck**

```bash
npm --workspace frontend run typecheck
```

期望：无报错。

- [ ] **Step 3: Commit**

```bash
git add frontend/src/env.d.ts
git commit -m "feat(h5): declare __APP_VERSION__ and __APP_BUILD_AT__ globals"
```

---

## Task 6: 新增 `frontend/src/utils/version-check.ts` 版本探测模块

**Files:**
- Create: `frontend/src/utils/version-check.ts`

- [ ] **Step 1: 创建模块**

新建 `frontend/src/utils/version-check.ts`，内容：

```ts
export function startVersionCheck(): void {
  // #ifdef H5
  startH5VersionCheck()
  // #endif
}

// #ifdef H5

const SNOOZE_MS = 30 * 60 * 1000
const POLL_MS = 5 * 60 * 1000
const MIN_CHECK_GAP_MS = 30 * 1000
const BOOT_DELAY_MS = 2000

type State = 'idle' | 'checking' | 'outdated_pending' | 'outdated_snoozed'

let state: State = 'idle'
let snoozedUntil = 0
let lastCheckedAt = 0
let started = false

function startH5VersionCheck(): void {
  if (started) return
  if (typeof __APP_VERSION__ === 'undefined' || __APP_VERSION__ === 'unknown') return
  started = true
  setTimeout(() => { void checkVersion() }, BOOT_DELAY_MS)
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') void checkVersion()
    })
  }
  setInterval(() => { void checkVersion() }, POLL_MS)
}

async function fetchServerVersion(): Promise<string | null> {
  try {
    const res = await fetch(`/version.json?_=${Date.now()}`, { cache: 'no-store' })
    if (!res.ok) return null
    const data = await res.json()
    if (!data || typeof data.version !== 'string' || !data.version) return null
    return data.version
  } catch {
    return null
  }
}

async function checkVersion(): Promise<void> {
  if (state === 'checking' || state === 'outdated_pending') return
  if (state === 'outdated_snoozed') {
    if (Date.now() < snoozedUntil) return
    state = 'idle'
  }
  const now = Date.now()
  if (now - lastCheckedAt < MIN_CHECK_GAP_MS) return
  lastCheckedAt = now
  state = 'checking'
  const serverVersion = await fetchServerVersion()
  if (state !== 'checking') return
  state = 'idle'
  if (!serverVersion) return
  if (serverVersion === __APP_VERSION__) return
  promptUpdate()
}

function promptUpdate(): void {
  state = 'outdated_pending'
  uni.showModal({
    title: '发现新版本',
    content: '页面已更新，需要刷新才能使用新版本',
    confirmText: '立即更新',
    cancelText: '稍后',
    success: (res) => {
      if (res.confirm) {
        window.location.reload()
        return
      }
      enterSnooze()
    },
    fail: () => {
      enterSnooze()
    }
  })
}

function enterSnooze(): void {
  state = 'outdated_snoozed'
  snoozedUntil = Date.now() + SNOOZE_MS
}

// #endif
```

关键设计要点（保留在头脑里，不写进代码注释）：
- 整个 H5 实现块用 `// #ifdef H5` 圈起来，小程序构建时被 uni-app 预处理器剔除，导出的 `startVersionCheck` 在小程序里就是个 noop。
- `started` 守门，防止 onLaunch 被异常多次触发时重复注册监听器。
- `lastCheckedAt` 节流防抖（30 秒内不重复检查）。
- `outdated_pending` 期间任何触发器都跳过，防止重复弹框。
- snoozed 状态过期后会在 `checkVersion` 里自动转回 `idle`，不需要单独定时器解除。
- `fetch` 任何异常都 `return null`，配合 `checkVersion` 的 `if (!serverVersion) return` 做到"网络不通就静默退出"。
- 状态从 `checking` 走出来时，如果中途状态被人改了（理论上没有别的并发改写者，但防御一下）就不再覆盖。

- [ ] **Step 2: 验证 typecheck**

```bash
npm --workspace frontend run typecheck
```

期望：无报错。重点确认 `__APP_VERSION__` 被识别为 string（依赖 Task 5 的声明）。

- [ ] **Step 3: Commit**

```bash
git add frontend/src/utils/version-check.ts
git commit -m "feat(h5): add version-check module polling /version.json"
```

---

## Task 7: 在 `App.vue` 接入 `startVersionCheck`

**Files:**
- Modify: `frontend/src/App.vue`

- [ ] **Step 1: 修改 `<script setup>` 块**

打开 `frontend/src/App.vue`，把顶部的 `<script setup lang="ts">` 块从：

```vue
<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app'
import { useKitchenStore } from '@/stores/kitchen'
import { setupWechatPrivacy } from '@/utils/wechat-privacy'

onLaunch(() => {
  useKitchenStore().hydrate()
  setupWechatPrivacy()
})
</script>
```

改成：

```vue
<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app'
import { useKitchenStore } from '@/stores/kitchen'
import { setupWechatPrivacy } from '@/utils/wechat-privacy'
import { startVersionCheck } from '@/utils/version-check'

onLaunch(() => {
  useKitchenStore().hydrate()
  setupWechatPrivacy()
  startVersionCheck()
})
</script>
```

`<style lang="scss">` 块完全不动。

- [ ] **Step 2: 验证 typecheck**

```bash
npm --workspace frontend run typecheck
```

期望：无报错。

- [ ] **Step 3: 验证 H5 构建仍能跑通**

```bash
npm run build:frontend:h5
```

期望：构建成功，`frontend/dist/build/h5/version.json` 存在且内容正确。

- [ ] **Step 4: Commit**

```bash
git add frontend/src/App.vue
git commit -m "feat(h5): wire startVersionCheck into App onLaunch"
```

---

## Task 8: 本地手动联调 — 验证版本探测真的工作

**Files:** 无文件改动，纯验证。

- [ ] **Step 1: 第一次构建并起静态服务器**

在仓库根：

```bash
npm run build:frontend:h5
cat frontend/dist/build/h5/version.json   # 记下当前 version 字符串，记为 V1
npx serve frontend/dist/build/h5 -p 9999
```

浏览器打开 `http://localhost:9999/`。打开 DevTools → Network。

预期：
- 启动后约 2 秒，Network 里能看到对 `/version.json?_=...` 的请求，状态 200。
- 不弹任何模态框（因为版本一致）。

- [ ] **Step 2: 制造一个新版本**

新开一个终端，先 `Ctrl+C` 停掉 `npx serve`。然后：

```bash
git commit --allow-empty -m "chore: bump for version-check manual test"
npm run build:frontend:h5
cat frontend/dist/build/h5/version.json   # 记下新 version，记为 V2，应该和 V1 不同
npx serve frontend/dist/build/h5 -p 9999
```

注意：因为 git short sha 变了，所以 `version.json` 里的 `version` 应该是新的。如果 V1 == V2，说明 Task 1 的脚本没拿到 sha，先排查 `git rev-parse --short HEAD` 在仓库里能不能跑。

- [ ] **Step 3: 触发版本检测，看模态框**

回到浏览器（**不要刷新**，浏览器里还是 V1 的 JS bundle）。

任选一个方式触发：
- **方式 A（最快）**：切到另一个 tab 待 1 秒，再切回来 → `visibilitychange` 触发 → 应弹"发现新版本"模态框。
- **方式 B**：原地等最多 5 分钟 → 兜底 setInterval 触发 → 应弹模态框。

期望弹框文案：
- 标题：发现新版本
- 内容：页面已更新，需要刷新才能使用新版本
- 主按钮：立即更新
- 次按钮：稍后

- [ ] **Step 4: 测「立即更新」**

点"立即更新"。预期：
- 页面 reload。
- DevTools Network 里能看到新的 HTML 请求（response body 的 `<script src>` 指向新 hash）。
- 后续不再弹框（因为 bundle 已经是 V2）。

- [ ] **Step 5: 测「稍后」（用第二次窗口）**

打开新隐身窗口访问 `http://localhost:9999/`，等弹框出现，点"稍后"。预期：
- 模态框消失。
- 30 分钟内多次 `visibilitychange` 触发都不弹框（可在 DevTools Console 里执行 `document.dispatchEvent(new Event('visibilitychange'))` 然后 `document.visibilityState` 是 visible 来确认 —— 即使硬触发也不弹）。

不需要真的等 30 分钟，验证"短时间内点稍后后不再弹"即可。

- [ ] **Step 6: 测 dev 模式下不打扰**

```bash
# 停掉 npx serve
npm run dev:frontend:h5
```

浏览器访问 `http://localhost:5173/`。DevTools Network 应该看到对 `/version.json?_=...` 的请求返回 **404**（因为 dev 模式没生成）。不弹框。**这是正确的行为**。

- [ ] **Step 7: 记录结果（不提交）**

把验证结果（哪些步骤通过、哪些异常）记在脑子里，如果都通过就进入 Task 9。如果有异常，停下来排查相应任务的实现。

---

## Task 9: 修改 nginx 配置 — index.html / version.json 缓存策略

**Files:**
- Modify: `deploy/linux/nginx/mini-kitchen-menu.conf.example`

- [ ] **Step 1: 整段替换文件**

打开 `deploy/linux/nginx/mini-kitchen-menu.conf.example`，整段替换成：

```nginx
server {
    listen 8951 default_server;
    server_name 101.44.160.63 _;

    root /srv/mini-kitchen-menu/frontend/dist/build/h5;
    index index.html;

    client_max_body_size 8m;

    location /api/ {
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass http://127.0.0.1:3001/;
    }

    location = /version.json {
        add_header Cache-Control "no-store, must-revalidate" always;
        add_header Pragma "no-cache" always;
        expires 0;
        try_files $uri =404;
    }

    location = /index.html {
        add_header Cache-Control "no-cache, must-revalidate" always;
        expires 0;
    }

    location /assets/ {
        try_files $uri =404;
        expires 7d;
        add_header Cache-Control "public, immutable";
    }

    location /static/ {
        try_files $uri =404;
        expires 7d;
        add_header Cache-Control "public";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Optional admin site
# server {
#     listen 8081;
#     server_name 101.44.160.63 _;
#
#     root /srv/mini-kitchen-menu/admin/dist;
#     index index.html;
#
#     client_max_body_size 8m;
#
#     location /api/ {
#         proxy_http_version 1.1;
#         proxy_set_header Host $host;
#         proxy_set_header X-Real-IP $remote_addr;
#         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
#         proxy_set_header X-Forwarded-Proto $scheme;
#         proxy_pass http://127.0.0.1:3001/;
#     }
#
#     location = /version.json {
#         add_header Cache-Control "no-store, must-revalidate" always;
#         add_header Pragma "no-cache" always;
#         expires 0;
#         try_files $uri =404;
#     }
#
#     location = /index.html {
#         add_header Cache-Control "no-cache, must-revalidate" always;
#         expires 0;
#     }
#
#     location /assets/ {
#         try_files $uri =404;
#         expires 7d;
#         add_header Cache-Control "public, immutable";
#     }
#
#     location / {
#         try_files $uri $uri/ /index.html;
#     }
# }
```

关键变化（不需要写进配置注释）：
- 新增 `location = /version.json` —— `no-store` 杜绝任何缓存。
- 新增 `location = /index.html` —— `no-cache` 允许 ETag 协商。
- `add_header ... always` 让 4xx/5xx 响应也带这个头（nginx 默认在错误响应上丢自定义 header）。
- `location /` 没变。

- [ ] **Step 2: 本地语法检查（如果有 nginx）**

如果本地装了 nginx 可以跑：

```bash
nginx -t -c deploy/linux/nginx/mini-kitchen-menu.conf.example
```

期望：`syntax is ok` / `test is successful`。如果本地没有 nginx，跳过。

- [ ] **Step 3: Commit**

```bash
git add deploy/linux/nginx/mini-kitchen-menu.conf.example
git commit -m "fix(deploy): no-cache index.html and version.json to fix stale H5"
```

---

## Task 10: 生产部署 + 线上验证

**Files:** 无代码改动，纯部署 + 验证。

> 这一步会真实发布到 `http://101.44.160.63:8951/`。执行前确认现网无关键操作。如果不希望 AI 替你做远程操作，**手动执行**这一步并打勾。

- [ ] **Step 1: 本地打包**

```bash
powershell -ExecutionPolicy Bypass -File .\deploy\linux\create-upload-bundle.ps1
```

期望：`release/mini-kitchen-menu-linux-upload-<时间戳>.tar.gz` 生成。

- [ ] **Step 2: 上传到服务器 `/h5/`**

用现有方式（scp / rsync / 控制台）把上一步的 tar.gz 上传到服务器 `/h5/`。

- [ ] **Step 3: 在服务器上执行升级**

ssh 到服务器后：

```bash
bash /h5/upgrade-upload-bundle.sh /h5/mini-kitchen-menu-linux-upload-<时间戳>.tar.gz
```

期望：脚本一路执行成功，最后 `deploy-ip.sh` 输出 nginx 重载成功 + 健康检查通过。

- [ ] **Step 4: 验证响应头**

在本地 / 服务器上 curl：

```bash
curl -I http://101.44.160.63:8951/index.html
```

期望响应里有：

```
Cache-Control: no-cache, must-revalidate
```

```bash
curl -I http://101.44.160.63:8951/version.json
```

期望响应里有：

```
Cache-Control: no-store, must-revalidate
Pragma: no-cache
```

```bash
curl http://101.44.160.63:8951/version.json
```

期望返回类似 `{"version":"<git-sha>","buildAt":"..."}` 的 JSON，且 `version` 字段是当前部署的 git short sha。

```bash
curl -sI http://101.44.160.63:8951/assets/$(curl -s http://101.44.160.63:8951/index.html | grep -oE 'assets/[^"]+\.js' | head -1)
```

期望响应里有：

```
Cache-Control: public, immutable
```

- [ ] **Step 5: 手机端 / 浏览器端实测**

- 用一台没访问过该站点的设备 / 浏览器隐身窗口打开 `http://101.44.160.63:8951/`，确认页面正常加载、能登录。
- 在本地改一行明显可见的代码（比如登录页标题改一下），重新打包、重新上传、再跑一次 upgrade 脚本。
- 回到刚才的浏览器（**不要刷新**），切到别的 tab 再切回来 / 或等最多 5 分钟。
- 应弹"发现新版本"模态框，点"立即更新"后看到改动生效。

如果手机端从未弹框 / 永远卡老版本：
- 先 `curl -I http://101.44.160.63:8951/version.json` 在服务器上确认响应头对。
- 再 DevTools Network 里看手机端 `/version.json` 请求是否真的 200 且内容是新版 sha。
- 再 Console 里看 `__APP_VERSION__`（注意是构建期常量，要在 Sources 里搜源码片段验证）和 Network 拿到的版本对比。

- [ ] **Step 6: Commit 计划本身**

回本地：

```bash
git add docs/superpowers/plans/2026-06-17-h5-auto-update.md
git commit -m "docs: add H5 auto-update implementation plan"
```

（如果之前已经把 spec 提交了，这步只提交 plan 文件。）

---

## 完成判据

全部 10 个任务勾完，并且 Task 10 Step 5 的实测「修改后短时间内手机端能拿到新版本提示」通过，即视为彻底解决「H5 部署后老版本卡住」的问题。

- 后续任何一次 `bash /h5/upgrade-upload-bundle.sh ...` 后，**新增**用户（首次访问 / 缓存过期后再访问）会直接拿到新版。
- **已经在使用旧版**的用户最迟在 5 分钟内 / 或下一次切回前台时，看到模态框，主动点击后拿到新版。
- 在此之前已经卡在更老版本（无 `version-check` 模块）的用户，仍需等浏览器启发式缓存自然过期 —— 这是物理限制，无解。本设计修完后**不会再产生新的"卡老版"用户**。
