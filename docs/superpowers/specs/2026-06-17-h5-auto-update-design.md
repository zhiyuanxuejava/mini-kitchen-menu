# H5 自动更新机制设计

- 日期：2026-06-17
- 范围：仅 H5 部署（uni-app `h5` 平台 + `deploy/linux/` 部署链路）
- 不涉及：微信小程序（`mp-weixin`），其更新由 `uni.getUpdateManager()` 处理，本设计不动

## 1. 背景与问题

通过 `deploy/linux/upgrade-upload-bundle.sh` 部署新版 H5 后，手机端访问会持续看到老界面，反复刷新、退出登录都没用，要等好一会才能拿到新版。

根因有两层：

1. **nginx 没给 `index.html` 设缓存策略**。`/assets/*` 已经 `immutable` 长缓存（hashed 资源，对的）；但 SPA 的入口 HTML 走 `try_files $uri $uri/ /index.html;` 之后没有任何 `Cache-Control` 头，浏览器按"启发式缓存"自由发挥（典型几小时到 1 天）。手机端微信内置浏览器、X5 内核对没显式 no-cache 的 HTML 更激进。HTML 被缓存 → 里面 `<script src="/assets/index-OLDHASH.js">` 指向老资源 → 即使新部署成功，浏览器根本不去请求新 hash 的 JS。
2. **客户端没有版本探测机制**。即使 HTML 缓存过期了，用户仍要主动刷新才能拿到新版。

## 2. 目标

- **彻底**：本次修复部署之后，**未来任何一次**新版部署，用户最多在 5 分钟内（或一次切回前台时）拿到新版本提示。
- **不打断**：弹模态框让用户主动点"立即更新"，不强制刷新；用户点"稍后"则 30 分钟内不再骚扰。
- **零后端改动**：所有改动闭环在前端构建产物 + nginx 配置里。
- **不影响小程序**：所有客户端代码用 `#ifdef H5` 圈起来。

## 3. 已知不解决（透明告知）

- **本次修复前就已经卡在老版本的用户**：他们手里的老 JS 没有版本探测代码，新部署的 nginx 也没法主动推内容到他们浏览器。他们仍要等浏览器启发式缓存自然过期（典型几小时～1 天），或手动清缓存。这是物理限制，没法绕开。
- **小程序端**：不在本设计范围。

## 4. 总体架构

两层修复，互相独立：

```
┌─ 一次性根因修复 ──────────────────────────────────┐
│ nginx 配置：index.html 设 no-cache，               │
│ /version.json 设 no-store，/assets/* 保持 immutable.│
│ 解决「以后部署后浏览器自然拿到新 HTML」的问题。     │
└────────────────────────────────────────────────────┘

┌─ 主动版本检测（仅 H5）────────────────────────────┐
│ 构建期：把版本号 bake 进 JS bundle + 同时生成      │
│         /version.json 静态文件。                   │
│ 运行期：客户端比对 bundle 版本 vs /version.json，   │
│         不一致就弹模态框，用户确认后 reload。       │
│ 解决「让已经在用老版的用户也能尽快感知到」的问题。  │
└────────────────────────────────────────────────────┘
```

## 5. nginx 配置变更

文件：`deploy/linux/nginx/mini-kitchen-menu.conf.example`

顶层 server 块和注释里的 admin server 块（用于将来 `ENABLE_ADMIN=1`）同步修改：

```nginx
# 新增：版本探测文件，绝不缓存
location = /version.json {
    add_header Cache-Control "no-store, must-revalidate" always;
    add_header Pragma "no-cache" always;
    expires 0;
    try_files $uri =404;
}

# 新增：HTML 入口，不强缓存，但允许 ETag 协商
location = /index.html {
    add_header Cache-Control "no-cache, must-revalidate" always;
    expires 0;
}

# 保持：hashed 静态资源长缓存
location /assets/ {
    try_files $uri =404;
    expires 7d;
    add_header Cache-Control "public, immutable";
}

# 保持：兜底静态资源
location /static/ {
    try_files $uri =404;
    expires 7d;
    add_header Cache-Control "public";
}

# 保持：SPA 兜底
location / {
    try_files $uri $uri/ /index.html;
}
```

关键设计点：

- `index.html` 用 `no-cache`（而非 `no-store`）—— 允许浏览器带 ETag 做协商请求，正常情况返回 304，不浪费流量；只有真的变了才下发新内容。
- `/version.json` 用 `no-store` —— 这文件就是用来探测版本的，绝不能被任何缓存命中。
- `add_header ... always` —— 确保 4xx/5xx 响应也带这个头（避免 nginx 默认在错误响应上丢掉自定义 header）。

## 6. 构建期：版本号注入

### 6.1 新文件 `scripts/prepare-h5-version.mjs`

- 在每次 H5 dev/build 前运行（和 `prepare-wechat-config.mjs` 对称）。
- 读取版本号优先级：
  1. `git rev-parse --short HEAD`
  2. ISO 时间戳 `new Date().toISOString()`
  3. 兜底 `dev-${Date.now()}`
- 写入 `frontend/.h5-version.json`（临时文件，需加入 `frontend/.gitignore`）：

```json
{ "version": "a1b2c3d", "buildAt": "2026-06-17T08:23:11.000Z" }
```

### 6.2 修改 `frontend/vite.config.ts`

- 启动时读取 `frontend/.h5-version.json`（不存在时给 fallback `{ version: 'unknown', buildAt: 'unknown' }`）。
- 通过 Vite `define` 注入两个全局常量：
  - `__APP_VERSION__: string`
  - `__APP_BUILD_AT__: string`
- 新增本地 Vite 插件 `writeH5VersionJsonPlugin`：
  - 仅在 H5 平台构建时生效（通过 `process.env.UNI_PLATFORM === 'h5'` 判断）。
  - 在 `writeBundle` 钩子里，把同样的 JSON 写到 H5 产物根目录的 `version.json`。
  - uni-app h5 构建产物根目录由 `UNI_OUTPUT_DIR` 决定，fallback `frontend/dist/build/h5`。

### 6.3 修改 `frontend/package.json` 脚本

为三个 H5 相关脚本前置 `prepare-h5-version.mjs`：

```json
"dev:h5":     "node ../scripts/prepare-wechat-config.mjs && node ../scripts/prepare-h5-version.mjs && uni",
"dev:h5:lan": "node ../scripts/prepare-wechat-config.mjs && node ../scripts/prepare-h5-version.mjs && uni --host 0.0.0.0 --port 5173",
"build:h5":   "node ../scripts/prepare-wechat-config.mjs && node ../scripts/prepare-h5-version.mjs && uni build"
```

`dev:mp-weixin` 和 `build:mp-weixin` 不接入 —— 小程序不需要 `version.json`，define 出来的常量在 H5 条件编译块里才被引用，小程序构建时即使 define 了也是死代码。

### 6.4 修改 `frontend/src/env.d.ts`

追加：

```ts
declare const __APP_VERSION__: string
declare const __APP_BUILD_AT__: string
```

### 6.5 修改 `frontend/.gitignore`

新增一行：

```
.h5-version.json
```

## 7. 客户端：版本检测模块

### 7.1 新文件 `frontend/src/utils/version-check.ts`

公共接口（仅一个）：

```ts
export function startVersionCheck(): void
```

所有 `#ifdef H5` 实现细节封在模块内部。在小程序构建时整个模块体被条件编译剔除，只导出一个 noop。

### 7.2 状态机

模块内单例状态：

| 状态 | 触发 | 行为 |
|---|---|---|
| `idle` | 初始 | 注册各种事件监听 |
| `checking` | 触发器到了 | fetch `/version.json?_=<ts>`（带 cache-busting query） |
| `up_to_date` | 版本一致 | 退回 `idle` |
| `outdated_pending` | 版本不一致 | 弹模态框 |
| `outdated_snoozed` | 用户点"稍后" | 30 分钟内忽略所有检测触发 |

### 7.3 检测触发器

1. App `onLaunch` 后延迟 2s 首次检测（避免拖慢首屏）
2. `document.visibilitychange` → `visible` 时，且距上次检测 > 30s（避免抖动）
3. uni-app 路由切换（监听全局 `routeChange`，> 30s 节流）
4. 兜底定时器：每 5 分钟检测一次

### 7.4 网络异常处理

- fetch 失败（断网、404、5xx、JSON 解析失败、字段缺失）一律静默忽略，不打 console、不弹窗。
- 下一个触发器到了再试。
- 这避免"服务器临时抽风导致全站弹窗"的尴尬。

### 7.5 模态框

用 `uni.showModal`（H5 端是原生居中模态，无额外组件依赖）：

```ts
uni.showModal({
  title: '发现新版本',
  content: '小程序已更新，需要刷新页面才能使用新版本',
  confirmText: '立即更新',
  cancelText: '稍后',
  success: (res) => {
    if (res.confirm) {
      window.location.reload()
    } else {
      // 进入 outdated_snoozed，30 分钟内不再触发
    }
  }
})
```

### 7.6 边界条件

- `__APP_VERSION__ === 'unknown'`（开发本地没注入版本，例如直接 `vite dev` 没跑前置脚本）→ 整个模块 noop。
- 已经在 `outdated_pending`（弹框展示中）时再触发 → 跳过，避免重复弹。
- snoozed 状态下，定时器和事件监听不取消，只是判断到 snoozed 就直接 return；30 分钟后自动解除。

### 7.7 App.vue 接入

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

## 8. 测试与验证（手动，项目没测试框架）

### 8.1 本地 dev

- `npm run dev:frontend:h5:lan` 启动。
- 浏览器开 DevTools → Network → 没有 `/version.json` 请求是异常；有但 404 是正常（dev 模式 vite 不跑 writeBundle 钩子，文件不存在，`version-check` 会静默忽略）。
- 开发体验不受影响。

### 8.2 本地 build + 静态预览

- `npm run build:frontend:h5` 第一次构建，记下 `frontend/dist/build/h5/version.json` 内容。
- 改一行代码，再 `npm run build:frontend:h5` 第二次。`version.json` 内的 version 应该变了（因为 git short sha 没变；时间戳变了）。注意：如果只有未提交改动，git sha 不变；这是 by design，因为只 commit 后部署才视为新版本。**如果要本地验证流程，临时改用 `Date.now()` 兜底，或干脆先 commit 再 build。**
- 用 `npx serve frontend/dist/build/h5 -p 8951` 起 v1 产物，浏览器访问。
- 切换到 v2 产物（覆盖目录），不刷新浏览器，等 5 分钟兜底 / 切到别的 tab 再切回 / 在站内做一次路由切换 → 应该弹模态框。
- 点"立即更新" → 页面 reload → 看到 v2。
- 点"稍后" → 30 分钟内不再弹（重启浏览器除外）。

### 8.3 生产验证

部署后用 curl 检查响应头：

```bash
curl -I http://101.44.160.63:8951/index.html
# 期望：Cache-Control: no-cache, must-revalidate

curl -I http://101.44.160.63:8951/version.json
# 期望：Cache-Control: no-store, must-revalidate

curl http://101.44.160.63:8951/version.json
# 期望：JSON 内容是当前部署的 git short sha

curl -I http://101.44.160.63:8951/assets/<some-hashed-file>.js
# 期望：Cache-Control: public, immutable
```

手机端实测：

- 部署 v1，手机访问站点登录正常使用。
- 部署 v2。
- 手机端：5 分钟内 / 切回前台 / 站内点一次跳转 → 出现"发现新版本"模态框。
- 点"立即更新" → 看到 v2 内容。

## 9. 涉及文件清单

新增：

- `scripts/prepare-h5-version.mjs`
- `frontend/src/utils/version-check.ts`
- `docs/superpowers/specs/2026-06-17-h5-auto-update-design.md`（本文件）

修改：

- `deploy/linux/nginx/mini-kitchen-menu.conf.example`
- `frontend/vite.config.ts`
- `frontend/package.json`（dev:h5 / dev:h5:lan / build:h5 三个脚本）
- `frontend/src/env.d.ts`（追加两个常量声明）
- `frontend/src/App.vue`（onLaunch 里调一次 `startVersionCheck()`）
- `frontend/.gitignore`（新增 `.h5-version.json`）

不修改：

- 后端任何代码
- 小程序相关脚本（`dev:mp-weixin` / `build:mp-weixin`）
- `deploy/linux/deploy-ip.sh`（它复制 nginx 配置文件即可生效）
- `deploy/linux/upgrade-upload-bundle.sh`（不变，因为它最后会调 `deploy-ip.sh`）
