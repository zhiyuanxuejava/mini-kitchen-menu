# 掌勺点菜小程序素材包

本素材包按当前原型图整理，适合直接放入微信小程序 / UniApp 工程使用。

## 目录结构

```text
zhangshao-menu-assets
├── icons
│   ├── svg      # SVG 图标，default/active/orange/green 四套颜色
│   └── png      # PNG 图标，64/128/256 三套尺寸
├── illustrations/png  # 首页、我的页、空状态、上传占位等插画
├── dishes/png
│   ├── card     # 800x560 菜品卡片图
│   ├── square   # 700x700 方图
│   └── detail   # 1200x800 详情头图
├── badges/png          # 菜品/步骤小图标徽章
├── placeholders/png    # 图片占位图
├── asset-manifest.json # 素材清单
└── asset_preview.png   # 素材预览图
```

## 推荐放入工程位置

```text
zhangshao-menu-app/static/assets/
```

## 命名说明

- `tab_home_default.png` / `tab_home_active.png`：底部导航图标
- `hongshaorou_card.png`：红烧肉卡片图
- `hongshaorou_detail.png`：红烧肉详情头图
- `badge_fire.png`：火候 / 步骤徽章
- `pot_heart.png`：首页顶部锅具插画
- `chef_avatar.png`：我的页面头像插画

## 前端使用建议

小程序中建议使用：

```js
const ASSET_PREFIX = '/static/assets/'
```

例如：

```js
coverUrl: ASSET_PREFIX + 'dishes/png/card/hongshaorou_card.png'
iconUrl: ASSET_PREFIX + 'icons/png/128/tab_home_active.png'
```

## 设计色值

```scss
$primary-color: #FF6A1A;
$primary-light: #FFF3EA;
$success-color: #59B347;
$warning-color: #FFB020;
$text-main: #2B1B14;
$text-secondary: #7A6A60;
$page-bg: #FFFDFB;
```

## 注意

本包为前端开发素材，包含 PNG 和 SVG。真实上线时，菜品照片可替换成后台上传图片，图标与插画可继续复用。
