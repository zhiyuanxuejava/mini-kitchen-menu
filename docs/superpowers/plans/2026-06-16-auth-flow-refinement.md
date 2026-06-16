# 登录注册流程完善 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让登录注册流程从"能跑通"升级到"输错也能被引导回正轨"——后端按"邮箱未注册/密码错误/邮箱已注册"返回不同错误码；前端拆出独立注册页，按错误码弹 modal 或 toast；去掉登录页默认预填的 demo 账号。

**Architecture:** 后端 `/auth/login/email` 和 `/auth/register` 增加显式查重，返回带 `code` 字段的结构化错误。前端新增 `ApiError` 类承载 `status`/`code`/`message`，让页面层在 catch 时按 `code` 分支决定走 `uni.showModal` 还是 `uni.showToast`。新增 `pages/register/index.vue`，登录页删除 mode-tabs 逻辑。

**Tech Stack:** 后端 Express + Prisma + Zod + bcryptjs；前端 uni-app + Vue 3 + Pinia + TypeScript。

> **执行须知 ·** 仓库零测试基建，本计划不引入 Vitest/Jest。验证以 `npm run build` / `npm --workspace frontend run typecheck` + 手动联调为准（每个任务里写清楚跑哪条命令、看什么输出）。仓库 `.gitignore` 全局 ignore 了 `*.log` 和 `.env*`，提交时不会把临时日志带进去。

---

## 文件结构

```
backend/src/server.ts                                  修改：/auth/login/email、/auth/register 错误码改造
frontend/src/api/kitchen.ts                            修改：新增并 export ApiError，request<T> 改成抛 ApiError
frontend/src/pages/login/index.vue                     修改：删 mode-tabs；按 ApiError code 分支处理；去预填；加“去注册”入口；onLoad 接 email query
frontend/src/pages/register/index.vue                  新增：独立注册页（邮箱+密码+确认密码）
frontend/src/pages.json                                修改：登记 pages/register/index
README.md                                              修改：把 demo 账号说明改成“先去注册”
```

不动：`frontend/src/stores/kitchen.ts`、`backend/src/db-init.ts`、`backend/prisma/schema.prisma`、`/auth/login/wechat`、`/me/bind-email`、所有微信链路、所有时间/计时/菜品相关代码。

---

## Task 1: 后端 `/auth/login/email` 改造为错误码化

**Files:**
- Modify: `backend/src/server.ts:539-554`

- [ ] **Step 1: 替换 `/auth/login/email` 整段处理器**

打开 `backend/src/server.ts`，找到 `app.post('/auth/login/email', ...)` 路由（约 539 行）。把整段 handler 替换成：

```ts
app.post('/auth/login/email', async (req, res) => {
  const body = emailSchema.parse(req.body)
  const email = normalizeEmail(body.email)
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    res.status(404).json({ message: '该邮箱未注册', code: 'EMAIL_NOT_REGISTERED' })
    return
  }
  if (!user.passwordHash || !(await bcrypt.compare(body.password, user.passwordHash))) {
    res.status(401).json({ message: '密码错误', code: 'PASSWORD_WRONG' })
    return
  }
  const next = await ensureConfiguredRole(user)
  res.json({ token: sign(next), user: publicUser(next) })
})
```

关键变化：删掉原本"找不到用户就 bcrypt + create"那段；保留 `ensureConfiguredRole`（admin 邮箱仍按 ADMIN_EMAILS 自动赋角色）。

- [ ] **Step 2: 后端编译验证**

Run: `npm --workspace backend run build`
Expected: 退出码 0，`backend/dist/server.js` 重新生成。控制台不应出现 TS 错误。

- [ ] **Step 3: 启动后端手动验证四条分支**

Run: `npm run dev:backend`

另开一个 shell 跑：

```bash
# 1) 未注册邮箱
curl -i -X POST http://localhost:3001/auth/login/email \
  -H 'Content-Type: application/json' \
  -d '{"email":"nobody-'$(date +%s)'@kitchen.local","password":"abcdef"}'
```
Expected: HTTP 404，body 含 `"code":"EMAIL_NOT_REGISTERED"` 和 `"message":"该邮箱未注册"`。

```bash
# 2) 用 demo 账号（如果数据库里没有就先创建一个：直接调 /auth/register）
curl -i -X POST http://localhost:3001/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@kitchen.local","password":"123456"}'
```
Expected: 200（首次）或 409（已存在），任一都可以——目的是确保数据库里有 demo@kitchen.local。

```bash
# 3) 密码错误
curl -i -X POST http://localhost:3001/auth/login/email \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@kitchen.local","password":"wrong-password"}'
```
Expected: HTTP 401，body 含 `"code":"PASSWORD_WRONG"`。

```bash
# 4) 正常登录
curl -i -X POST http://localhost:3001/auth/login/email \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@kitchen.local","password":"123456"}'
```
Expected: HTTP 200，body 含 `"token"` 与 `"user"` 字段。

四条都通过后停掉 `npm run dev:backend`。

- [ ] **Step 4: 提交**

```bash
git -C D:/work/ai/mini-kitchen-menu add backend/src/server.ts
git -C D:/work/ai/mini-kitchen-menu commit -m "feat(backend): 邮箱登录区分未注册和密码错误"
```

---

## Task 2: 后端 `/auth/register` 显式查重返回 409

**Files:**
- Modify: `backend/src/server.ts:523-537`

- [ ] **Step 1: 替换 `/auth/register` 处理器**

找到 `app.post('/auth/register', ...)`（约 523 行）。整段替换为：

```ts
app.post('/auth/register', async (req, res) => {
  const body = emailSchema.parse(req.body)
  const email = normalizeEmail(body.email)
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    res.status(409).json({ message: '该邮箱已注册', code: 'EMAIL_ALREADY_REGISTERED' })
    return
  }
  const passwordHash = await bcrypt.hash(body.password, 10)
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      nickname: email.split('@')[0],
      avatarUrl: defaultUserAvatarUrl,
      role: roleForEmail(email)
    }
  })
  res.json({ token: sign(user), user: publicUser(user) })
})
```

- [ ] **Step 2: 后端编译验证**

Run: `npm --workspace backend run build`
Expected: 退出码 0。

- [ ] **Step 3: 启动后端手动验证两条分支**

Run: `npm run dev:backend`

```bash
# 1) 注册一个新邮箱
NEW_EMAIL="new-$(date +%s)@kitchen.local"
curl -i -X POST http://localhost:3001/auth/register \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$NEW_EMAIL\",\"password\":\"abcdef\"}"
```
Expected: HTTP 200，含 `token` / `user`。

```bash
# 2) 用同一个邮箱再注册一次
curl -i -X POST http://localhost:3001/auth/register \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$NEW_EMAIL\",\"password\":\"abcdef\"}"
```
Expected: HTTP 409，body 含 `"code":"EMAIL_ALREADY_REGISTERED"`。

停掉后端。

- [ ] **Step 4: 提交**

```bash
git -C D:/work/ai/mini-kitchen-menu add backend/src/server.ts
git -C D:/work/ai/mini-kitchen-menu commit -m "feat(backend): 注册接口邮箱重复返回 409"
```

---

## Task 3: 前端新增 `ApiError`，`request<T>` 抛结构化错误

**Files:**
- Modify: `frontend/src/api/kitchen.ts:190-213`

- [ ] **Step 1: 在 `request<T>` 上方加 `ApiError` 类**

打开 `frontend/src/api/kitchen.ts`，找到 `function request<T>(...)` 上方。在它前面插入：

```ts
export class ApiError extends Error {
  status: number
  code?: string
  constructor(status: number, message: string, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}
```

- [ ] **Step 2: 改写 `request<T>` 整段函数**

把现有 `function request<T>(url, options = {}) { ... }` 整段替换为：

```ts
function request<T>(url: string, options: RequestOptions = {}) {
  return new Promise<T>((resolve, reject) => {
    const base = requireApiBase()
    uni.request({
      url: `${base}${url}`,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'content-type': 'application/json',
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
      },
      success: (response) => {
        const status = response.statusCode || 0
        if (status >= 200 && status < 300) {
          resolve(response.data as T)
          return
        }
        const body = response.data as { message?: string; code?: string } | string
        const message = typeof body === 'object' && body?.message ? body.message : `请求失败 ${status}`
        const code = typeof body === 'object' ? body?.code : undefined
        reject(new ApiError(status, message, code))
      },
      fail: (error) => reject(new ApiError(0, error.errMsg || '网络请求失败'))
    })
  })
}
```

- [ ] **Step 3: 前端 typecheck 验证**

Run: `npm --workspace frontend run typecheck`
Expected: 退出码 0，无任何 TS 错误。

`runRemote` 在 store 里仍把 `error.message` 写进 `apiError`、再 `throw error`——`ApiError` 是 `Error` 子类，原有路径都不会断。

- [ ] **Step 4: 提交**

```bash
git -C D:/work/ai/mini-kitchen-menu add frontend/src/api/kitchen.ts
git -C D:/work/ai/mini-kitchen-menu commit -m "feat(frontend): 引入 ApiError 承载状态码和业务 code"
```

---

## Task 4: 新增独立注册页 `pages/register/index.vue`

**Files:**
- Create: `frontend/src/pages/register/index.vue`

- [ ] **Step 1: 创建注册页文件**

新建 `frontend/src/pages/register/index.vue`，完整内容：

```vue
<template>
  <AppPage no-tab>
    <view class="login-hero">
      <image class="logo" :src="icons.pot" mode="aspectFit" />
      <text class="brand">注册账号</text>
      <text class="slogan">注册后将自动登录进入厨房</text>
    </view>

    <view class="login-card card">
      <view class="field">
        <text>邮箱</text>
        <input v-model="email" type="text" placeholder="name@example.com" />
      </view>
      <view class="field">
        <text>密码</text>
        <input v-model="password" password placeholder="至少 6 位" maxlength="32" />
      </view>
      <view class="field">
        <text>确认密码</text>
        <input v-model="confirmPassword" password placeholder="再次输入密码" maxlength="32" />
      </view>

      <button class="primary-btn submit" hover-class="tap" :disabled="submitting" @tap="submit">
        {{ submitting ? '注册中...' : '注册并进入厨房' }}
      </button>

      <button class="link-btn" hover-class="tap" @tap="goLogin">已有账号？去登录</button>

      <text v-if="store.apiError" class="error-text">{{ store.apiError }}</text>
    </view>
  </AppPage>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import AppPage from '@/components/AppPage.vue'
import { ApiError } from '@/api/kitchen'
import { icons } from '@/data/assets'
import { useKitchenStore } from '@/stores/kitchen'

const store = useKitchenStore()
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const submitting = ref(false)

onLoad((options) => {
  const queryEmail = options?.email
  if (typeof queryEmail === 'string' && queryEmail) {
    try {
      email.value = decodeURIComponent(queryEmail)
    } catch {
      email.value = queryEmail
    }
  }
})

onShow(() => {
  store.hydrate()
  if (!store.user) return
  if (store.needsWechatProfileCompletion()) {
    uni.redirectTo({ url: '/pages/profile-edit/index?onboarding=1' })
    return
  }
  uni.reLaunch({ url: '/pages/home/index' })
})

async function submit() {
  const nextEmail = email.value.trim()
  if (!nextEmail) {
    uni.showToast({ title: '请输入邮箱', icon: 'none' })
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) {
    uni.showToast({ title: '邮箱格式不正确', icon: 'none' })
    return
  }
  if (password.value.length < 6) {
    uni.showToast({ title: '密码至少 6 位', icon: 'none' })
    return
  }
  if (password.value !== confirmPassword.value) {
    uni.showToast({ title: '两次输入的密码不一致', icon: 'none' })
    return
  }

  submitting.value = true
  try {
    await store.registerWithEmail(nextEmail, password.value)
    uni.reLaunch({ url: '/pages/home/index' })
  } catch (error) {
    if (error instanceof ApiError && error.code === 'EMAIL_ALREADY_REGISTERED') {
      uni.showModal({
        title: '该邮箱已注册',
        content: '是否直接前往登录？',
        confirmText: '去登录',
        cancelText: '取消',
        success: ({ confirm }) => {
          if (!confirm) return
          uni.redirectTo({
            url: `/pages/login/index?email=${encodeURIComponent(nextEmail)}`
          })
        }
      })
      return
    }
    uni.showToast({ title: store.apiError || '注册失败', icon: 'none' })
  } finally {
    submitting.value = false
  }
}

function goLogin() {
  const nextEmail = email.value.trim()
  const url = nextEmail
    ? `/pages/login/index?email=${encodeURIComponent(nextEmail)}`
    : '/pages/login/index'
  uni.redirectTo({ url })
}
</script>

<style scoped lang="scss">
.login-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 44rpx;
  text-align: center;
}

.logo {
  width: 190rpx;
  height: 190rpx;
}

.brand {
  margin-top: 8rpx;
  color: $text-main;
  font-size: 56rpx;
  font-weight: 900;
}

.slogan {
  width: 560rpx;
  margin-top: 18rpx;
  color: $text-sub;
  font-size: 27rpx;
  line-height: 1.5;
}

.login-card {
  margin-top: 58rpx;
  padding: 34rpx 30rpx 30rpx;
}

.field {
  margin-top: 26rpx;
}

.field text {
  display: block;
  margin-bottom: 12rpx;
  color: $text-main;
  font-size: 27rpx;
  font-weight: 800;
}

.field input {
  height: 82rpx;
  padding: 0 24rpx;
  border: 1rpx solid $border;
  border-radius: 22rpx;
  background: #fffdfb;
  color: $text-main;
  font-size: 28rpx;
}

.submit {
  margin-top: 34rpx;
}

.link-btn {
  height: 70rpx;
  margin-top: 18rpx;
  background: transparent;
  color: $primary;
  font-size: 26rpx;
  font-weight: 700;
}

.link-btn::after {
  border: 0;
}

.error-text {
  display: block;
  margin-top: 18rpx;
  color: #d34b2f;
  font-size: 24rpx;
  text-align: center;
}

@media (min-width: 431px) {
  .login-hero {
    padding-top: 18rpx;
  }

  .login-card {
    margin-top: 44rpx;
  }
}
</style>
```

- [ ] **Step 2: 登记到 `pages.json`**

打开 `frontend/src/pages.json`，找到 `"path": "pages/login/index"` 的那一项（在 `pages` 数组最末尾）。在它**之前**插入：

```json
    {
      "path": "pages/register/index",
      "style": {
        "navigationStyle": "custom"
      }
    },
```

注意：JSON 里上一项的 `}` 后面要带逗号，新项末尾也要带逗号（因为后面还有 `pages/login/index`）。

- [ ] **Step 3: 前端 typecheck 验证**

Run: `npm --workspace frontend run typecheck`
Expected: 退出码 0。

- [ ] **Step 4: 提交**

```bash
git -C D:/work/ai/mini-kitchen-menu add frontend/src/pages/register/index.vue frontend/src/pages.json
git -C D:/work/ai/mini-kitchen-menu commit -m "feat(frontend): 新增独立注册页"
```

---

## Task 5: 登录页改造——删 tabs、加错误分支、去预填、加"去注册"

**Files:**
- Modify: `frontend/src/pages/login/index.vue`

- [ ] **Step 1: 替换 `<template>` 中的登录卡片**

找到 `<view class="login-card card">` 整段（约 9-34 行），把整块替换为：

```vue
      <view class="login-card card">
        <view class="field">
          <text>邮箱</text>
          <input v-model="email" type="text" placeholder="name@example.com" />
        </view>
        <view class="field">
          <text>密码</text>
          <input v-model="password" password placeholder="请输入密码" />
        </view>
        <button class="primary-btn submit" hover-class="tap" @tap="submit">
          {{ store.loading ? '连接厨房中...' : '登录并进入厨房' }}
        </button>
        <button class="wechat" hover-class="tap" @tap="wechatLogin">
          <image :src="icons.chefHat" mode="aspectFit" />
          <text>微信一键登录</text>
        </button>
        <button class="link-btn" hover-class="tap" @tap="goRegister">还没账号？去注册</button>
        <view class="login-tip">
          <text class="tip-title">登录方式说明</text>
          <text class="tip-copy">微信登录后可以在“设置”里继续绑定邮箱密码，后续两种方式都能登录同一个账号。</text>
        </view>
        <text v-if="store.apiError" class="error-text">{{ store.apiError }}</text>
      </view>
```

（删掉了 `mode-tabs`；新增了 `link-btn` "还没账号？去注册"；改了提交按钮文案使其不再依赖 mode。）

- [ ] **Step 2: 替换 `<script setup>` 整段**

把现有 `<script setup lang="ts">...</script>` 整段替换为：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import AppPage from '@/components/AppPage.vue'
import { ApiError } from '@/api/kitchen'
import { icons } from '@/data/assets'
import { useKitchenStore } from '@/stores/kitchen'
import { syncWechatPrivacySetting } from '@/utils/wechat-privacy'

const store = useKitchenStore()
const email = ref('')
const password = ref('')

onLoad((options) => {
  const queryEmail = options?.email
  if (typeof queryEmail === 'string' && queryEmail) {
    try {
      email.value = decodeURIComponent(queryEmail)
    } catch {
      email.value = queryEmail
    }
  }
})

onShow(() => {
  store.hydrate()
  if (!store.user) return
  if (store.needsWechatProfileCompletion()) {
    uni.redirectTo({ url: '/pages/profile-edit/index?onboarding=1' })
    return
  }
  uni.reLaunch({ url: '/pages/home/index' })
})

async function submit() {
  const nextEmail = email.value.trim()
  if (!nextEmail || !password.value.trim()) {
    uni.showToast({ title: '请输入邮箱和密码', icon: 'none' })
    return
  }
  try {
    await store.loginWithEmail(nextEmail, password.value.trim())
    uni.reLaunch({ url: '/pages/home/index' })
  } catch (error) {
    if (error instanceof ApiError && error.code === 'EMAIL_NOT_REGISTERED') {
      uni.showModal({
        title: '该邮箱还没注册',
        content: '是否前往注册？',
        confirmText: '去注册',
        cancelText: '取消',
        success: ({ confirm }) => {
          if (!confirm) return
          uni.redirectTo({
            url: `/pages/register/index?email=${encodeURIComponent(nextEmail)}`
          })
        }
      })
      return
    }
    if (error instanceof ApiError && error.code === 'PASSWORD_WRONG') {
      uni.showToast({ title: '密码错误，请重试', icon: 'none' })
      return
    }
    uni.showToast({ title: store.apiError || '登录失败', icon: 'none' })
  }
}

function goRegister() {
  const nextEmail = email.value.trim()
  const url = nextEmail
    ? `/pages/register/index?email=${encodeURIComponent(nextEmail)}`
    : '/pages/register/index'
  uni.navigateTo({ url })
}

async function wechatLogin() {
  try {
    await syncWechatPrivacySetting(false)
    await store.loginWithWechat()
    if (store.needsWechatProfileCompletion()) {
      uni.redirectTo({ url: '/pages/profile-edit/index?onboarding=1' })
      return
    }
    uni.reLaunch({ url: '/pages/home/index' })
  } catch {
    uni.showToast({ title: store.apiError || '微信登录失败', icon: 'none' })
  }
}
</script>
```

关键变化：
- 删 `mode` 状态、删 `registerWithEmail` 调用
- 加 `onLoad` 接 query 里的 email
- 加 `ApiError` 分支 catch
- 加 `goRegister` 函数
- 删 `password.value.trim()` 之前的"空格检查通过"的旧逻辑（现在用 `nextEmail` 替代）

- [ ] **Step 3: 在 `<style>` 中追加 `.link-btn` 样式**

打开同文件的 `<style scoped lang="scss">` 区，找到 `.wechat image { ... }` 段之后、`.login-tip { ... }` 之前。在中间插入：

```scss
.link-btn {
  height: 70rpx;
  margin-top: 18rpx;
  background: transparent;
  color: $primary;
  font-size: 26rpx;
  font-weight: 700;
}

.link-btn::after {
  border: 0;
}
```

- [ ] **Step 4: 前端 typecheck 验证**

Run: `npm --workspace frontend run typecheck`
Expected: 退出码 0。

- [ ] **Step 5: H5 联调验证全链路**

启动三件套（先确保后端、admin、frontend 都没在跑，否则端口占用）：

```bash
npm run dev:backend
```

另一个 shell：

```bash
npm run dev:frontend:h5
```

浏览器开 `http://localhost:5173/`，验证下面 6 条用例：

1. **登录页打开** —— 邮箱/密码两个输入框都是空白（没有 demo 预填）。
2. **未注册邮箱登录** —— 输入 `nobody-<时间戳>@kitchen.local` + 任意密码，提交。期望：弹出 modal "该邮箱还没注册 / 是否前往注册？"，点"去注册" → 跳到注册页且邮箱已回填。
3. **注册页两次密码不一致** —— 邮箱填 `test-<时间戳>@kitchen.local`，密码 `abcdef`，确认密码 `abcdeg`，提交。期望：toast "两次输入的密码不一致"，不发请求。
4. **注册成功直接进首页** —— 把确认密码改对，提交。期望：直接 `reLaunch` 到首页（看到点菜页/首页布局）。
5. **退出登录后用 demo 登录** —— 进设置 → 退出登录 → 回到登录页。输入 `demo@kitchen.local / 123456`（确保数据库里有这个账号，Task 1 已经创建）。期望：直接进首页。
6. **密码错误** —— 退出后用 `demo@kitchen.local` + `wrong-pw`。期望：toast "密码错误，请重试"。
7. **已注册邮箱注册** —— 退出后去注册页（点"还没账号？去注册"），用 demo 邮箱注册。期望：弹出 modal "该邮箱已注册 / 是否直接前往登录？"，点"去登录"跳回登录页且邮箱已回填。

如果其中某条不通过，停下来排查，**不要继续到 Step 6**。

- [ ] **Step 6: 提交**

```bash
git -C D:/work/ai/mini-kitchen-menu add frontend/src/pages/login/index.vue
git -C D:/work/ai/mini-kitchen-menu commit -m "feat(frontend): 登录页拆出注册入口并按错误码引导"
```

---

## Task 6: README 改写 demo 账号说明

**Files:**
- Modify: `README.md:152-180`

- [ ] **Step 1: 改写"登录方式与测试账号"小节**

打开 `README.md`，找到 `## 登录方式与测试账号` 标题。把从该标题到 `## 管理员账号` 之间的内容（约 152-165 行）整段替换为：

```markdown
## 登录方式与测试账号

- 邮箱登录接口：`POST /auth/login/email`
- 邮箱注册接口：`POST /auth/register`
- 登录接口区分 `EMAIL_NOT_REGISTERED`（404）和 `PASSWORD_WRONG`（401）两种错误，未注册的邮箱不会再自动建号
- 小程序登录页和注册页都不再默认预填账号

本地联调建议步骤：

1. 启动后端
2. 打开小程序登录页，点"还没账号？去注册"
3. 用 `demo@kitchen.local / 123456` 完成注册（密码需要二次确认）
4. 注册成功会自动登录并跳到首页

后续可在登录页直接用：

```text
demo@kitchen.local / 123456
```
```

- [ ] **Step 2: 改写"管理员账号"小节末尾说明**

继续往下找到 `## 管理员账号` 小节末尾那句"首次用该邮箱登录时，后端会自动创建该用户..."（约 178-180 行）。替换为：

```markdown
首次使用该邮箱时，先在注册页用 `admin@kitchen.local / 123456` 完成注册。后端检测到该邮箱在 `ADMIN_EMAILS` 中，会直接赋予 `admin` 角色，登录后即可访问 `/admin/overview`。
```

- [ ] **Step 3: 提交**

```bash
git -C D:/work/ai/mini-kitchen-menu add README.md
git -C D:/work/ai/mini-kitchen-menu commit -m "docs: 同步登录注册流程文案"
```

---

## Task 7: 终局回归

**Files:** 无新文件改动

- [ ] **Step 1: 全量 typecheck + 构建**

```bash
npm --workspace frontend run typecheck
npm --workspace backend run build
npm run build:mp-weixin
```

Expected: 三条命令退出码均为 0。`build:mp-weixin` 会输出 `frontend/dist/build/mp-weixin`。

- [ ] **Step 2: 小程序端冒烟（可选但推荐）**

如果本机已安装微信开发者工具：

```bash
npm run dev:mp-weixin
```

打开开发者工具导入 `frontend/dist/dev/mp-weixin`，确认：
- 登录页能编译、能渲染，无控制台报错
- 注册页能从登录页 `navigateTo` 跳过去
- 注册页字段都能输入

如果没有微信开发者工具，跳过此步即可——H5 已在 Task 5 Step 5 跑过端到端。

- [ ] **Step 3: 检查 git 状态干净**

```bash
git -C D:/work/ai/mini-kitchen-menu status
```

Expected: `nothing to commit, working tree clean`。如果有遗漏文件，根据情况补提交。

- [ ] **Step 4: 查看 commit 历史**

```bash
git -C D:/work/ai/mini-kitchen-menu log --oneline -7
```

Expected: 应看到 6 条新 commit（Task 1-6 各 1 条），加上之前的 spec commit。

---

## 自审记录

**spec 覆盖**：
- 注册二次密码确认 → Task 4 Step 1 校验逻辑
- 注册成功直接进首页 → Task 4 Step 1 `uni.reLaunch`
- 登录错误合理提示（按 code 分支）→ Task 1（后端码）+ Task 3（前端 ApiError）+ Task 5 Step 2（页面层 catch 分支）
- 独立注册页 → Task 4
- 去 demo 预填 → Task 5 Step 2（`email = ref('')`）
- 后端 `/auth/login/email` 不再自动建号 → Task 1
- 后端 `/auth/register` 409 显式查重 → Task 2
- 跨页 query 带 email → Task 4 + Task 5 的 `onLoad` 与 `redirectTo`/`navigateTo`
- README 同步 → Task 6

**类型/命名一致性**：
- `ApiError` 类在 Task 3 定义并 export，Task 4 / Task 5 import 一致
- 错误码字符串 `EMAIL_NOT_REGISTERED` / `PASSWORD_WRONG` / `EMAIL_ALREADY_REGISTERED` 前后端全部一致
- 跨页参数键名 `email` 前后一致

**风险点**：
- Windows 上 `curl` 行内变量替换 `$(date +%s)` 在 PowerShell 下不工作。Task 1/2 的验证步骤建议在 Git Bash 里执行（仓库根目录 `start-all.sh` 也假定 Git Bash 环境）。
- Task 4 的样式依赖 `frontend/src/uni.scss` 里的 `$primary`、`$text-main` 等变量——这些登录页已经在用，注册页直接复用同套，不会缺。
