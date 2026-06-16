# 登录注册流程完善 · 设计

- 状态：草案
- 日期：2026-06-16
- 范围：`backend/src/server.ts`、`frontend/src/api/kitchen.ts`、`frontend/src/stores/kitchen.ts`、`frontend/src/pages/login/index.vue`、新增 `frontend/src/pages/register/index.vue`、`frontend/src/pages.json`、`README.md`

## 目标

让登录注册流程从"能跑通"升级到"经得起用户输错"。具体四点：

1. 注册时必须二次确认密码。
2. 注册成功直接进首页（保持现在 `reLaunch` 行为）。
3. 登录失败按错误类型给"该邮箱未注册"或"密码错误"等具体提示，而不是统一 toast。
4. 拆出独立的注册页，登录页只承担登录，去掉 demo 账号默认预填。

## 非目标

- 不做忘记密码、邮箱验证码、手机号登录、登录限流、密码强度校验（≥6 位以外）。
- 不动微信一键登录、`/me/bind-email`、token 续签机制。
- 不重构 `useKitchenStore` 的双模式（登录态 / 离线态）结构。

## 现状回顾

- 登录页 `pages/login/index.vue` 内带 `mode: 'login' | 'register'` tab，注册路径调用 `store.registerWithEmail`。
- 后端 `/auth/login/email` **找不到用户会用本次密码自动建号**（CLAUDE.md 记录为"产品故意行为"），导致用户输错邮箱也会"登录成功"并悄悄创建账号。
- 后端 `/auth/register` 没有显式查重，靠 Prisma unique constraint 报错冒到 500。
- 前端 `request<T>` 把所有非 2xx 收敛成 `new Error(message)`，丢失了状态码与错误类型，页面层只能 toast 一句通用文案。
- 登录页 `email`/`password` 默认填了 `demo@kitchen.local / 123456`，方便联调但不适合上线截图。

## 总体方案

后端按"邮箱未注册 / 密码错误 / 邮箱已注册"返回不同 HTTP 状态码与机器可读 `code`。前端 API 层抛出携带 `code`/`status` 的 `ApiError`，页面层按 `code` 分支：

- 严重且需引导（未注册 → 引去注册 / 已注册 → 引去登录）走 `uni.showModal`。
- 轻量错误（密码错误、格式错误、网络失败）走 `uni.showToast`。

新增独立注册页，登录页保留邮箱登录 + 微信一键登录两种入口。两页之间跳转时把已填邮箱通过 query 带过去，避免用户重输。

## 后端改动 · `backend/src/server.ts`

### `POST /auth/login/email`

去掉"找不到就建号"分支。

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

### `POST /auth/register`

显式查重，返回 409。

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

### 错误码清单

| code | HTTP | 来源 | 用途 |
|---|---|---|---|
| `EMAIL_NOT_REGISTERED` | 404 | `/auth/login/email` | 登录页弹 modal 引导去注册 |
| `PASSWORD_WRONG` | 401 | `/auth/login/email` | 登录页 toast 提示 |
| `EMAIL_ALREADY_REGISTERED` | 409 | `/auth/register` | 注册页弹 modal 引导去登录 |

不动的接口：`/auth/login/wechat`、`/me/bind-email`、`/auth/logout`、`/me/profile`。

## 前端 API 层改动 · `frontend/src/api/kitchen.ts`

新增 `ApiError`，并改写 `request<T>`：

```ts
export class ApiError extends Error {
  status: number
  code?: string
  constructor(status: number, message: string, code?: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

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

所有现有 `kitchenApi.*` 调用方不需要改——它们仍能用 `error.message`，只有需要分支的页面才 `instanceof ApiError` 取 `code`。

## Pinia store 改动 · `frontend/src/stores/kitchen.ts`

`runRemote` 已经 `throw` 原始 error，只把 `apiError` 文案存起来。`ApiError` 落到这里依然会 `throw`，页面层 catch 时能直接拿到。**不新增 action**。`loginWithEmail` / `registerWithEmail` 不动。

## 新页面 · `frontend/src/pages/register/index.vue`

字段：`email`、`password`、`confirmPassword`。校验顺序：

1. `email` 非空 + 正则 `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`。
2. `password.length >= 6`。
3. `password === confirmPassword`。

不通过 → `uni.showToast`，不发请求。

提交逻辑：

```ts
try {
  await store.registerWithEmail(email.value.trim(), password.value)
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
          url: `/pages/login/index?email=${encodeURIComponent(email.value.trim())}`
        })
      }
    })
    return
  }
  uni.showToast({ title: store.apiError || '注册失败', icon: 'none' })
}
```

页面布局参考登录页：顶部 hero（标题 "注册账号"）、卡片内 3 个字段、提交按钮、底部一行链接 "已有账号？去登录"。**不放微信登录按钮**——微信登录语义上就是登录，放在注册页会让用户困惑。

`onLoad((options) => { ... })` 把 query 里的 `email` 回填到输入框。

## 改动页面 · `frontend/src/pages/login/index.vue`

- 删 `mode` 状态、`mode-tabs` UI、`registerWithEmail` 调用。
- `email = ref('')`、`password = ref('')`（删默认预填）。
- 底部加链接 "还没账号？去注册" → `uni.navigateTo({ url: '/pages/register/index' })`，与微信登录按钮在同一卡片下方。
- `submit` 的 catch 按 `code` 分支：

```ts
try {
  await store.loginWithEmail(email.value.trim(), password.value)
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
          url: `/pages/register/index?email=${encodeURIComponent(email.value.trim())}`
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
```

- `onLoad((options) => { ... })` 把 query 里的 `email` 回填。

## `frontend/src/pages.json`

新增一条：

```json
{ "path": "pages/register/index", "style": { "navigationStyle": "custom" } }
```

放在 `pages/login/index` 后面即可。

## `README.md`

把 "登录方式与测试账号" 章节里写死 demo 账号已预填的那段，改写为：

> 本地联调可以先在登录页点 "还没账号？去注册"，用 `demo@kitchen.local / 123456` 注册一次，之后即可在登录页用该账号登录。

`ADMIN_EMAILS="admin@kitchen.local"` 那块管理员账号说明保留，但同样把"首次邮箱登录会自动建号"改成"先去注册页用 admin@kitchen.local 注册一次，注册时会根据 ADMIN_EMAILS 自动赋予 admin 角色"。

## 错误处理矩阵

| 场景 | HTTP | code | 前端反馈 |
|---|---|---|---|
| 登录 - 邮箱未注册 | 404 | EMAIL_NOT_REGISTERED | modal 引导去注册（带回邮箱） |
| 登录 - 密码错误 | 401 | PASSWORD_WRONG | toast `'密码错误，请重试'` |
| 登录 - 邮箱格式错（前端拦） | - | - | toast `'邮箱格式不正确'` |
| 登录 - 网络失败 | 0 | - | toast `'网络请求失败'` |
| 登录 - 5xx | 5xx | - | toast 后端 message 或 `'登录失败'` |
| 注册 - 邮箱已注册 | 409 | EMAIL_ALREADY_REGISTERED | modal 引导去登录（带回邮箱） |
| 注册 - 两次密码不一致（前端拦） | - | - | toast `'两次输入的密码不一致'` |
| 注册 - 密码 < 6 位（前端拦） | - | - | toast `'密码至少 6 位'` |
| 注册 - 邮箱格式错（前端拦） | - | - | toast `'邮箱格式不正确'` |
| 注册 - 网络/服务器错 | 0/5xx | - | toast 后端 message 或 `'注册失败'` |

## 兼容性 / 数据迁移

- 后端改动不动 schema，不需要 `db-init.ts` 更新。
- 老用户（已经被自动建号过的）继续能登录，因为他们 `passwordHash` 已经存了；只是后续邮箱不存在不再静默建号。
- 老的微信 → 邮箱合并链路 `/me/bind-email` 不动。

## 风险与权衡

- **邮箱枚举**：404 vs 401 让攻击者能区分某邮箱是否注册过。家庭厨房场景威胁可忽略，业务上换来的"未注册请去注册"指引价值更大。
- **`/auth/register` 已显式查重**：但 `prisma.user.create` 仍可能在并发场景下命中 unique constraint。保留全局错误处理 fallback 即可（继续兜 500），不需要二次 try/catch。
- **去预填后联调略麻烦**：研发自己第一次启动后端要先去注册页注册一次再登录。README 改写对齐这个流程。

## 验证清单（implementation 阶段执行，不在 spec 范围内）

- 后端 `npm --workspace backend run build` 通过。
- 前端 `npm --workspace frontend run typecheck` 通过。
- H5 手动跑通：
  1. 没注册过的邮箱去登录 → 弹 modal 引导去注册 → 跳过去带着邮箱。
  2. 已注册邮箱密码错 → toast "密码错误，请重试"。
  3. 已注册邮箱密码对 → 进首页。
  4. 注册页两次密码不一致 → 不发请求，toast 拦下。
  5. 注册已存在邮箱 → 弹 modal 引导去登录 → 跳过去带着邮箱。
  6. 注册成功 → 进首页。
- 微信一键登录链路（mp-weixin）不受影响：保留原跳转 + 隐私授权流程。
