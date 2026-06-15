# Linux 网页发布

## 当前默认方案

当前默认只发布：

- H5：`http://101.44.160.63:8951/`
- 后端 API：通过同域 `/api/` 暴露
- 管理后台：默认不启动

当前方案下：

- H5 页面访问：`http://101.44.160.63:8951/`
- 健康检查：`http://101.44.160.63:8951/api/health`
- 导入菜品图片访问：`http://101.44.160.63:8951/api/static/...`
- 用户上传文件访问：`http://101.44.160.63:8951/api/uploads/...`

## 一键部署

适用于 Debian / Ubuntu。请在服务器仓库根目录执行：

```bash
PUBLIC_IP=101.44.160.63 bash ./deploy/linux/deploy-ip.sh
```

也可以用 npm：

```bash
PUBLIC_IP=101.44.160.63 npm run deploy:linux:ip
```

脚本默认行为：

- 只构建和发布 `frontend + backend`
- 不构建管理后台
- `nginx` 对外监听 `8951`
- 后端只监听本机 `127.0.0.1:3001`
- 自动验证 H5、`/health`、导入图片、上传文件访问链路

## 可选环境变量

- `PUBLIC_IP`
- `H5_PORT`
- `BACKEND_PORT`
- `JWT_SECRET`
- `SERVICE_NAME`
- `SITE_NAME`
- `ENABLE_ADMIN`
- `ADMIN_PORT`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

说明：

- 默认 `ENABLE_ADMIN=0`
- 如果要启用后台，设置 `ENABLE_ADMIN=1`

示例：

```bash
PUBLIC_IP=101.44.160.63 ENABLE_ADMIN=1 ADMIN_PORT=8081 ADMIN_EMAIL=admin@kitchen.local ADMIN_PASSWORD=123456 bash ./deploy/linux/deploy-ip.sh
```

## 媒体访问说明

当前代码里两类媒体都由后端提供：

- 导入菜品和内置素材：
  来源于后端 `/static`
  后端同时映射 `backend/static` 和 `frontend/src/static`

- 用户后续上传文件：
  来源于后端 `/uploads`
  文件保存在 `backend/uploads`

因为 `nginx` 会把 H5 下的 `/api/` 反代给后端，所以最终访问路径是：

- `/api/static/...`
- `/api/uploads/...`

这已经覆盖了：

- 当前导入的菜品图片
- 当前内置静态素材
- 后续用户自己上传的图片

## 手动部署时的关键配置

`backend/.env`

```env
NODE_ENV=production
DATABASE_URL="file:./dev.db"
JWT_SECRET="replace-with-a-long-random-secret"
PORT=3001
HOST=127.0.0.1
CORS_ORIGINS="http://101.44.160.63:8951"
MAX_UPLOAD_FILE_SIZE_MB=4
ADMIN_EMAILS="admin@kitchen.local"
WECHAT_APP_ID="replace-if-you-still-build-mp-weixin"
WECHAT_APP_SECRET="replace-if-you-still-build-mp-weixin"
```

`frontend/.env.production`

```env
VITE_API_BASE="/api"
```

如果启用后台，再额外配置：

`admin/.env.production`

```env
VITE_API_BASE="/api"
```

## 验证

部署后至少检查：

```bash
curl http://101.44.160.63:8951/api/health
curl http://101.44.160.63:8951/api/static/assets/dishes/real/hongshaorou.jpg
```

如果以后有上传文件，也可以验证：

```bash
curl http://101.44.160.63:8951/api/uploads/<your-file-name>
```

## 持久化目录

这两个目录需要备份：

- `backend/prisma/dev.db`
- `backend/uploads/`

## 云服务器端口

默认至少放行：

- `8951`

如果启用后台，再放行：

- `8081` 或你自定义的 `ADMIN_PORT`
