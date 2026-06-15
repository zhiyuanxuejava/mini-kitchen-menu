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

小程序微信配置改为本地生成，不再提交真实 `AppID`。先在本地 `backend/.env` 中填写：

```env
WECHAT_APP_ID="你的微信小程序 AppID"
WECHAT_APP_SECRET="你的微信小程序 AppSecret"
```

执行 `npm run dev:mp-weixin` 或 `npm run build:mp-weixin` 时，会自动生成仅本地使用的：

```text
frontend/src/manifest.json
frontend/project.config.json
```

这两个文件已加入 `.gitignore`，不会再上传到 GitHub。仓库中保留的模板文件为：

```text
frontend/src/manifest.example.json
frontend/project.config.example.json
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

后端启动时会自动执行幂等建表 SQL，创建 SQLite 表结构。当前环境下 Prisma schema engine 可校验 schema，但 `prisma migrate dev/db push` 会返回空的 schema engine error，因此运行期建表作为本地开发兜底。当前默认通过 `HOST=0.0.0.0` 监听，可供局域网设备访问。

## 管理后台

```bash
npm run dev:admin
```

默认访问地址：

```text
http://localhost:5174
```

## 本地联调启动顺序

```bash
npm install
npm run dev:backend
npm run dev:admin
npm run dev:frontend:h5:lan
```

可选的小程序开发命令：

```bash
npm run dev:mp-weixin
```

默认本机访问地址：

```text
后端: http://localhost:3001
后台: http://localhost:5174
H5:   http://localhost:5173
```

## 一键启动 / 停止脚本

Windows：

```powershell
powershell -ExecutionPolicy Bypass -File .\start-all.ps1
powershell -ExecutionPolicy Bypass -File .\stop-all.ps1
```

- `start-all.ps1` 会在后台隐藏窗口启动 `backend + admin + frontend-h5`
- 启动日志输出到 `.logs/`
- 运行状态记录到 `.logs/dev-services.windows.json`

Linux / WSL / Git Bash：

```bash
bash ./start-all.sh
bash ./stop-all.sh
```

- `start-all.sh` 会用后台进程方式启动三端
- 启动日志输出到 `.logs/`
- 运行状态记录到 `.logs/dev-services.linux.json`

## 局域网访问

假设当前开发机 Wi-Fi 内网地址为 `192.168.3.36`，则同一局域网内可使用：

```text
后端健康检查: http://192.168.3.36:3001/health
后台管理:     http://192.168.3.36:5174
H5 前端:      http://192.168.3.36:5173
```

当前代码已处理以下两点：

- 后端默认监听 `0.0.0.0`，不再只绑定本机回环地址
- `admin` 和 `frontend` 默认优先读取 `VITE_API_BASE`；未显式配置时，H5 会自动跟随当前访问主机推导后端地址，例如从 `192.168.3.36:5173` 访问时，会自动请求 `http://192.168.3.36:3001`

如需强制指定接口地址，可在启动前设置：

```bash
set VITE_API_BASE=http://192.168.3.36:3001
```

## 登录方式与测试账号

- 邮箱登录接口：`POST /auth/login/email`
- 后端对邮箱登录采用“首次登录自动建号”逻辑；如果邮箱不存在，会用本次输入的密码直接创建用户
- 小程序登录页默认预填账号：`demo@kitchen.local`
- 小程序登录页默认预填密码：`123456`

本地联调可直接使用：

```text
demo@kitchen.local / 123456
```

## 管理员账号

管理后台接口要求用户角色为 `admin`。当前默认环境变量已配置：

```env
ADMIN_EMAILS="admin@kitchen.local"
```

因此可直接使用下面的管理员账号首次登录后台：

```text
admin@kitchen.local / 123456
```

首次用该邮箱登录时，后端会自动创建该用户，并按 `ADMIN_EMAILS` 配置赋予 `admin` 角色。

## 验证步骤

1. 启动后端后，在开发机访问 `http://localhost:3001/health`
2. 在开发机访问 `http://192.168.3.36:3001/health`
3. 启动 H5 后，在开发机访问 `http://192.168.3.36:5173`
4. 启动后台后，在开发机访问 `http://192.168.3.36:5174`
5. 使用 `admin@kitchen.local / 123456` 登录后台，确认可拉取 `/admin/overview`

## 已验证

```bash
npm --workspace frontend run typecheck
npm run build:mp-weixin
npm --workspace backend run build
```

并已启动后端验证 `/health`、邮箱登录和菜品列表接口。
