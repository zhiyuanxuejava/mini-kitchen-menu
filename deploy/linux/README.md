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

## 后续代码更新如何重新发布

推荐沿用当前的“重新打包 -> 上传服务器 -> 执行更新脚本”方式。  
更新脚本会自动完成：

- 备份当前数据库
- 备份当前上传文件
- 解压新压缩包
- 删除旧目录并替换成新目录
- 恢复数据库和上传文件
- 执行 `deploy/linux/deploy-ip.sh`

### 1. 本地重新生成发布包

在本地仓库根目录执行：

```powershell
cd D:\work\ai\mini-kitchen-menu
powershell -ExecutionPolicy Bypass -File .\deploy\linux\create-upload-bundle.ps1
```

执行后会在 `release/` 下生成新的压缩包，例如：

```text
release/mini-kitchen-menu-linux-upload-20260615-160600.tar.gz
```

### 2. 上传新的压缩包到服务器

可以继续上传到服务器上的 `/h5/` 目录。

### 3. 把更新脚本放到服务器 `/h5/`

把下面这个脚本上传到服务器 `/h5/`：

```text
deploy/linux/upgrade-upload-bundle.sh
```

建议服务器上放成：

```bash
cp deploy/linux/upgrade-upload-bundle.sh /h5/upgrade-upload-bundle.sh
chmod +x /h5/upgrade-upload-bundle.sh
```

后续每次更新都可以重复使用这个脚本，不需要重新改内容。

### 4. 在服务器执行更新脚本

假设你上传的新包名为：

```text
/h5/mini-kitchen-menu-linux-upload-xxxxxx.tar.gz
```

执行：

```bash
cd /h5
bash ./upgrade-upload-bundle.sh /h5/mini-kitchen-menu-linux-upload-xxxxxx.tar.gz
```

这个脚本会自动完成：

- 备份 `/h5/mini-kitchen-menu/backend/prisma/dev.db` 到 `/h5/dev.db.bak`
- 备份 `/h5/mini-kitchen-menu/backend/uploads` 到 `/h5/uploads.bak`
- 解压压缩包
- 替换 `/h5/mini-kitchen-menu`
- 恢复数据库和上传文件
- 进入新目录执行 `bash ./deploy/linux/deploy-ip.sh`
- 在保留原始数据的前提下自动同步数据库字段、索引和兼容性更新，再启动新服务

### 5. 更新后验证

更新完成后建议至少执行：

```bash
curl http://101.44.160.63:8951/api/health
systemctl status mini-kitchen-menu-backend.service --no-pager
```

如果页面功能有变更，再浏览器访问：

```text
http://101.44.160.63:8951/
```

### 6. 脚本使用说明

默认脚本按下面路径执行：

- 基础目录：`/h5`
- 应用目录：`/h5/mini-kitchen-menu`
- 解压后的临时目录：`/h5/mini-kitchen-menu-linux-upload`

标准用法：

```bash
bash /h5/upgrade-upload-bundle.sh /h5/mini-kitchen-menu-linux-upload-xxxxxx.tar.gz
```

如果以后你的目录名改了，也可以这样传：

```bash
BASE_DIR=/h5 APP_NAME=mini-kitchen-menu bash /h5/upgrade-upload-bundle.sh /h5/mini-kitchen-menu-linux-upload-xxxxxx.tar.gz
```

注意：

- 压缩包必须是 `.tar.gz`
- 压缩包内顶层目录必须是 `mini-kitchen-menu-linux-upload`
- 如果当前还没有旧项目目录，脚本会跳过备份，直接解压部署
- 如果 `uploads.bak` 为空，脚本会自动跳过上传文件恢复

### 7. 适用范围说明

以上流程适用于：

- 前端页面修改
- 后端接口代码修改
- 静态资源修改
- 管理后台代码修改（如果你后续启用后台）

当前仓库的发布脚本已经内置“保留原始数据的幂等字段同步”：

- 会先恢复旧的 `backend/prisma/dev.db`
- 再执行后端的数据库同步脚本
- 由 `backend/src/db-init.ts` 按需补字段、补索引、重建兼容表结构，并保留已有数据

适合以下类型的更新：

- 新增字段
- 新增索引
- 旧字段兼容补齐
- 需要保留原始数据的表结构重建

不适合的仍然是高风险数据迁移，例如：

- 大规模字段语义变更
- 复杂数据拆表/合表
- 需要人工校验的数据清洗

这类场景仍然建议单独设计迁移脚本并先备份数据库。

## 持久化目录

这两个目录需要备份：

- `backend/prisma/dev.db`
- `backend/uploads/`

## 云服务器端口

默认至少放行：

- `8951`

如果启用后台，再放行：

- `8081` 或你自定义的 `ADMIN_PORT`
