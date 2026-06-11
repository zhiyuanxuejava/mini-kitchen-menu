# 掌勺点菜小程序

基于 `需求文档.md`、`原型图/` 和 `zhangshao-menu-assets/` 从零实现的微信小程序工程。

## 目录

- `frontend/`：uni-app + Vue 3 + TypeScript + Pinia 小程序端。
- `backend/`：Express + TypeScript + Prisma + SQLite 接口服务。
- `frontend/src/static/assets/`：已接入的素材库。

## 前端

```bash
npm install --registry=https://registry.npmmirror.com
npm run build:mp-weixin
```

微信开发者工具导入：

```text
frontend/dist/build/mp-weixin
```

开发模式：

```bash
npm run dev:mp-weixin
```

## 后端

```bash
npm run prisma:generate
npm run build:backend
npm run dev:backend
```

默认服务地址：

```text
http://localhost:3001
```

后端启动时会自动执行幂等建表 SQL，创建 SQLite 表结构。当前环境下 Prisma schema engine 可校验 schema，但 `prisma migrate dev/db push` 会返回空的 schema engine error，因此运行期建表作为本地开发兜底。

## 已验证

```bash
npm --workspace frontend run typecheck
npm run build:mp-weixin
npm --workspace backend run build
```

并已启动后端验证 `/health`、邮箱登录和菜品列表接口。
