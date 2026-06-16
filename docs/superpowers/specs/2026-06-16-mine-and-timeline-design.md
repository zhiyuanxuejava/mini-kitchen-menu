# 我的页布局修复 + 三列表页时间线 · 设计

- 状态：草案
- 日期：2026-06-16
- 范围：`frontend/src/pages/mine/index.vue`、`frontend/src/pages/learned-dishes/index.vue`、`frontend/src/pages/favorite-dishes/index.vue`、`frontend/src/pages/my-dishes/index.vue`、新增 `frontend/src/components/TimelineGroup.vue`、新增 `frontend/src/utils/timeline.ts`、`frontend/src/data/types.ts`、`frontend/src/api/kitchen.ts`

## 目标

1. 修 Mine 页两处布局错位：头部卡片里的 3 统计项对齐不齐 + 快捷入口 6 项排成 4+2 视觉断裂。
2. "我已学会 / 我的收藏 / 我创建的菜品" 三个列表页改成统一的"连续时间轴"展示：左侧贯穿竖线 + 月份大锚点 + 每条记录的日期标签 + 右侧菜品卡片。

## 非目标

- 不动 BottomTabbar、AppNavbar、AppPage 等基础布局
- 不改菜品卡片的点击行为（仍跳 `dish-detail`）
- 不改各页面的操作按钮（取消收藏 / 编辑删除 / 加入点菜单）位置和功能
- 不重构搜索 / 分类筛选 / 难度筛选交互
- 不画专属的空状态视觉，沿用现有 `<EmptyState>` 组件 + 文案微调
- 不重做视觉语言：所有新元素颜色 / 字号 / 阴影 / 圆角必须复用现有 SCSS 变量（见"视觉延续性硬约束"）
- 不动后端，`Dish.createdAt` 已经在 API 响应里，仅前端类型链路补齐

## 视觉延续性硬约束

TimelineGroup 和时间轴上的菜品卡片样式 **必须** 复用现有变量：

- 颜色：`$primary`、`$text-main`、`$text-sub`、`$border`、`$warning`、`$success` 等已定义的 SCSS 变量
- 容器：继续套用现有 `.card` 类（`frontend/src/styles/` 里定义）
- 阴影：`$shadow-soft`
- 字号 / 字重 / 圆角：沿用各页面现有卡片的数值（28-32rpx 圆角、24-32rpx 字号梯度）
- 月份大圆点用 `$primary` 实心 + 4rpx 白色描边
- 左侧竖线用 `rgba(255, 123, 37, 0.18)`（`$primary` 同色 18% 透明，跟橙色主题协调但不抢戏）
- 各页面 badge / 操作按钮 / 卡片背景渐变 **完全保留** 现有视觉，时间轴只是给卡片左侧让出 80rpx padding 容纳竖线 + 圆点

结果：从用户视角看，是"原页面 + 在左边加了一条时间线"，不是新视觉。

## 现状回顾

### Mine 页问题（`pages/mine/index.vue`）

1. `.profile` 卡的 `.stats` 用 `grid-template-columns: 54rpx 1fr`，每个统计项的图标和文字数字分属两列。`<text>` 和 `<strong>` 两行在 1fr 列内自动垂直排列，但图标用 `grid-row: 1 / 3` 跨两行造成视觉错位（图标偏上、数字相对图标位置怪异）
2. `.quick-grid` 是 `grid-template-columns: repeat(4, 1fr)`，但 `quickEntries` 有 6 项，排成 4+2，最后一行"评分记录、新增菜品"在左半，右半留空

### 三个列表页现状

- `learned-dishes/index.vue` 已经有简单 timeline 实现（`.timeline-axis` + `.timeline-dot` + `.timeline-line`），每条 item 一根短线 + 一个点，没有按月份分组、没有连续轴
- `favorite-dishes/index.vue` 普通卡片列表，按 `favoritedAt desc`，时间只是卡片里一行文字
- `my-dishes/index.vue` 普通卡片列表，**没有时间维度**、也没有按 createdAt 排序

### 数据基础

- `LearnedDish.learnedAt` ✓（后端已按 `learnedAt desc` 排）
- `FavoriteDish.favoritedAt` ✓（后端已按 `favoritedAt desc` 排）
- `Dish.createdAt` ✓（后端有，前端 `Dish` 类型和 `normalizeDish` **缺这个字段**，需补）

## 总体方案

新增 `<TimelineGroup>` 组件负责"月份锚点 + 左竖线"骨架，菜品行通过 default slot 由各页面塞入。新增 `groupByMonth<T>` 工具函数把数据按月聚合。三个列表页保留各自的搜索 / 筛选 / 卡片样式 / 按钮，外层套时间线骨架。Mine 页用纯 SCSS 手术修两处布局。

## 组件设计

### `frontend/src/components/TimelineGroup.vue`（新建）

只渲染**一个月份的锚点 + 该月范围内的左竖线**，不关心菜品数据。

**Props**

```ts
defineProps<{
  monthLabel: string   // '2026 年 6 月'
  isFirst?: boolean    // 是否第一个月（默认 false，决定顶部线段是否绘制）
  isLast?: boolean     // 是否最后一个月（默认 false，决定底部线段是否延伸）
}>()
```

**模板结构**

```vue
<view :class="['timeline-group', { 'is-first': isFirst, 'is-last': isLast }]">
  <view class="timeline-rail" />            <!-- 左侧贯穿竖线 -->
  <view class="timeline-month">
    <view class="timeline-month-dot" />     <!-- 大圆点 -->
    <text class="timeline-month-label">{{ monthLabel }}</text>
  </view>
  <view class="timeline-month-items">
    <slot />                                <!-- 页面塞 <TimelineRow> 类的内容 -->
  </view>
</view>
```

**视觉规格**

- 月份大圆点：直径 28rpx，`background: $primary`，外圈 4rpx 白色描边形成"凸起"感
- 左竖线 `.timeline-rail`：宽 2rpx，`background: rgba(255, 123, 37, 0.18)`，`position: absolute; left: 32rpx; top: 0; bottom: 0`
- `.is-first` 类让顶部 `top: 32rpx`（从月份圆点中心起线，不画到圆点上方）
- `.is-last` 类让底部 `bottom: 16rpx`（最后一组底部不延伸到无穷）
- 月份标题：32rpx，900 字重，`color: $text-main`，左侧距离圆点 18rpx
- 组内菜品行容器 `.timeline-month-items`：`padding-left: 80rpx`，给左侧竖线 + 圆点让位
- 各组之间垂直间距：40rpx（用 `:not(:last-child) { margin-bottom: 40rpx }`）
- 月份标题和首张卡片之间：24rpx

### 各页面 slot 内的行约定

页面在 slot 里手写每行：

```vue
<TimelineGroup
  v-for="(group, index) in monthlyGroups"
  :key="group.monthKey"
  :month-label="group.monthLabel"
  :is-first="index === 0"
  :is-last="index === monthlyGroups.length - 1"
>
  <view v-for="entry in group.items" :key="entry.id" class="timeline-row">
    <view class="timeline-day">
      <view class="timeline-day-dot" />
      <text class="timeline-day-label">{{ entry.dayLabel }}</text>
    </view>
    <view class="timeline-card">
      <!-- 复用原有卡片内容（图、标题、描述、meta、按钮） -->
    </view>
  </view>
</TimelineGroup>
```

**约定的样式**（写在每个页面的 `<style scoped>` 里）

- `.timeline-row`：`display: grid; grid-template-columns: 80rpx 1fr; align-items: flex-start; gap: 0`
- `.timeline-day`：左列容器，`display: flex; flex-direction: column; align-items: center; gap: 8rpx; padding-top: 14rpx`
- `.timeline-day-dot`：直径 14rpx，`background: $primary`，外圈 3rpx 白色描边
- `.timeline-day-label`：24rpx，`color: $text-sub`
- `.timeline-card`：套现有 `.card`，**完全保留原页面的卡片内部样式和按钮位置**。改造时把每个页面原来的 `.favorite-card / .dish-card / .timeline-card`（learned-dishes 旧实现）里的 view 内容**搬进**新的 `.timeline-card` 里，原 className 不再需要——但卡片内子元素的 class（`.favorite-cover / .dish-head / .favorite-actions` 等）和对应样式**全部保留**，因为视觉延续性要求不重做卡片视觉
- 行之间垂直间距：20rpx（`.timeline-row:not(:last-child) { margin-bottom: 20rpx }`）

`<TimelineGroup>` 不试图给 slot 内容加样式作用域；slot 内 className 全由页面自己定义。这避免 uni-app slot 跨组件样式作用域的常见踩坑。

## 数据层

### `frontend/src/utils/timeline.ts`（新建）

```ts
export interface TimelineGroup<T> {
  monthKey: string                            // '2026-06' 用 v-for key
  monthLabel: string                          // '2026 年 6 月' 显示用
  items: Array<T & { dayLabel: string }>      // dayLabel 形如 '06-16'
}

const MONTH_LABEL_FORMATTER = (year: number, month: number) => `${year} 年 ${month} 月`
const DAY_LABEL_FORMATTER = (month: number, day: number) =>
  `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
const UNKNOWN_GROUP_KEY = 'unknown'
const UNKNOWN_GROUP_LABEL = '时间未记录'

export function groupByMonth<T>(
  items: T[],
  getDate: (item: T) => string | undefined
): TimelineGroup<T>[] {
  const groups = new Map<string, TimelineGroup<T>>()

  for (const item of items) {
    const raw = getDate(item)
    const date = raw ? new Date(raw) : null

    if (!date || Number.isNaN(date.getTime())) {
      const group = groups.get(UNKNOWN_GROUP_KEY) ?? {
        monthKey: UNKNOWN_GROUP_KEY,
        monthLabel: UNKNOWN_GROUP_LABEL,
        items: []
      }
      group.items.push({ ...item, dayLabel: '--' })
      groups.set(UNKNOWN_GROUP_KEY, group)
      continue
    }

    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const monthKey = `${year}-${String(month).padStart(2, '0')}`
    const group = groups.get(monthKey) ?? {
      monthKey,
      monthLabel: MONTH_LABEL_FORMATTER(year, month),
      items: []
    }
    group.items.push({ ...item, dayLabel: DAY_LABEL_FORMATTER(month, day) })
    groups.set(monthKey, group)
  }

  return [...groups.values()].sort((a, b) => {
    if (a.monthKey === UNKNOWN_GROUP_KEY) return 1
    if (b.monthKey === UNKNOWN_GROUP_KEY) return -1
    return b.monthKey.localeCompare(a.monthKey)
  })
}
```

**特性**：
- 按 `getDate` 解析的时间降序排（新的在前）
- 同月同年聚成一组
- 无效或缺失时间的 item 全部归到末尾的 "时间未记录" 组（容错，正常路径不会触发）
- 不修改原 item，而是浅拷贝加 `dayLabel`

### 前端类型补 `Dish.createdAt`

#### `frontend/src/data/types.ts`

`Dish` 接口加：

```ts
createdAt?: string
```

#### `frontend/src/api/kitchen.ts`

`BackendDish` type 加：

```ts
createdAt?: string
```

`normalizeDish` 返回对象里加：

```ts
createdAt: row.createdAt
```

这样不影响任何其它使用 `Dish` 的代码，my-dishes 才能按 createdAt 分组。

## 各页面改造

### `pages/mine/index.vue`

**布局修复 1：`.profile .stats` 改 flex column 居中**

```scss
.stats {
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-around;
  align-items: stretch;
  margin-top: 24rpx;
  padding: 24rpx 0 30rpx;
}

.stats > view {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 0 12rpx;
}

.stats > view:not(:last-child) {
  border-right: 1rpx solid $border;
}

.stats image {
  width: 48rpx;
  height: 48rpx;
}

.stats text {
  color: $text-sub;
  font-size: 23rpx;
}

.stats strong {
  color: $text-main;
  font-size: 31rpx;
}
```

模板里 `.stats` 三个 `<view>` 的内部顺序保持 `<image> + <text> + <strong>`，顺序自然垂直堆叠。

**布局修复 2：`.quick-grid` 改 3 列**

```scss
.quick-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18rpx;
  margin-top: 34rpx;
}
```

`quickEntries` 6 项数组不动，排成 3×2 整齐排列。

不动其它：head、profile-pot、recent-grid、recent-empty 全部保留。

### `pages/learned-dishes/index.vue`

- 模板：删除现有 `.timeline / .timeline-item / .timeline-axis / .timeline-dot / .timeline-line` 整段，换成 `<TimelineGroup>` 循环
- 数据：在 `entries` 之上加 `monthlyGroups = computed(() => groupByMonth(filteredEntries.value, (entry) => entry.learnedAt))`（如果当前有"已学会"页面的 filteredEntries，按现有筛选结果分组；如果没有，直接用 entries）
- 卡片内部内容保留（图、标题、"已学会" badge、描述、meta），只改外层结构变成 `.timeline-card`
- 旧 CSS（`.timeline-axis` 等）整段删，新加 `.timeline-row / .timeline-day / .timeline-day-dot / .timeline-day-label / .timeline-card` 按"约定的样式"实现

### `pages/favorite-dishes/index.vue`

- 模板：把 `.favorite-list / .favorite-card` 整段循环换成 `<TimelineGroup>` 循环
- 数据：`monthlyGroups = computed(() => groupByMonth(filteredEntries.value, (entry) => entry.favoritedAt))`
- 卡片内部保留所有元素（封面、名称、"已收藏" badge、描述、收藏时间文案可以删掉因为时间线已经展示了，meta 标签、加入点菜单/取消收藏两个按钮）
- 收藏时间文案 `.favorite-time` 行可以删（时间已在左侧 day-label 显示）

### `pages/my-dishes/index.vue`

- 模板：把 `.dish-list / .dish-card` 循环换成 `<TimelineGroup>` 循环
- 数据：
  - `myDishes` computed 加排序：`return store.myCreatedDishes().slice().sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))`
  - `monthlyGroups = computed(() => groupByMonth(filteredDishes.value, (dish) => dish.createdAt))`
- 卡片内部保留（封面、名称、"我的菜品" badge、描述、备注、meta、编辑/删除两按钮）

## 兼容性 / 数据迁移

- 不动 schema、不动后端
- `Dish.createdAt` 前端补字段是**纯 additive**，所有 `Dish` 现有消费者都不会受影响
- 老用户的 my-dishes 数据按 `createdAt` 排序，因为数据来自后端的 `createdAt` 字段（已存在），不会有 null
- `groupByMonth` 的"时间未记录"分组是防御性的 fallback，正常路径不会触发

## 风险与权衡

- **uni-app slot 兼容性**：`<TimelineGroup>` 用 default slot 接菜品行，mp-weixin 和 H5 都支持，但样式作用域不跨 slot。设计已经避开这点（slot 内 className 由页面定义）
- **左竖线 multi-group 连续性**：相邻 TimelineGroup 之间靠 `margin-bottom` 和绝对定位的 rail 拼接。如果实际渲染发现 1px 缝隙，方案 B 是把整个时间线列表包一层 `position: relative` + 独立的全长 rail，但这要在父页面层做。**先按当前方案，验证有问题再升级**
- **Mine 页布局修复仅靠 SCSS**：不动 template，没有逻辑变化，回归风险最低
- **共三个文件同时引入 timeline**：每个文件改动不小，但彼此独立、可分批验证

## 验证清单（implementation 阶段执行）

- `npm --workspace frontend run typecheck` 通过
- H5 浏览器跑：
  1. Mine 页 — 头部 3 统计居中对齐、分割线对齐；快捷入口 3×2 整齐
  2. 我已学会页 — 月份分组显示；左竖线连续；日期 MM-DD；卡片可点跳详情；空筛选走 EmptyState
  3. 我的收藏页 — 月份分组显示；按钮"加入点菜单 / 取消收藏"在卡片右下；可取消收藏
  4. 我创建的菜品页 — 月份分组显示；按 createdAt 倒序；按钮"编辑 / 删除"在卡片右下；新建菜品后回该页能看到出现在最上方
- mp-weixin 构建（`npm run build:mp-weixin`）通过、能在微信开发者工具里渲染（如果环境允许）
