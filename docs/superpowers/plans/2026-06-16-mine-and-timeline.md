# 我的页布局修复 + 三列表页时间线 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 Mine 页两处布局错位修掉，并把"我已学会 / 我的收藏 / 我创建的菜品"三个列表页统一成"按月分组连续时间轴"展示（C 方案：左竖线 + 月份大锚点 + 日期标签 + 右侧菜品卡片），全程复用现有视觉变量，不引入新风格。

**Architecture:** 抽 `<TimelineGroup>` 组件只负责月份锚点 + 左竖线骨架（菜品行走 default slot，slot 内样式由页面自定义）；抽 `groupByMonth` 工具函数把数据按月聚合；三个列表页保留各自搜索筛选、卡片视觉、按钮位置不变，只外层换成时间线骨架。Mine 页 SCSS 手术：统计项 flex column 居中、快捷入口 4 列改 3 列。

**Tech Stack:** uni-app + Vue 3 + Pinia + TypeScript + SCSS。

> **执行须知 ·** 仓库零测试基建，本计划不引入测试。验证以 `npm --workspace frontend run typecheck` + 手动 H5 联调为准。每个任务在提交前都跑 typecheck 兜底。视觉验证由"启动 H5 + 浏览器看一眼"完成。

---

## 文件结构

```
新增
  frontend/src/components/TimelineGroup.vue        通用月份锚点 + 左竖线骨架
  frontend/src/utils/timeline.ts                   groupByMonth + 类型

修改
  frontend/src/data/types.ts                       Dish 接口加 createdAt?: string
  frontend/src/api/kitchen.ts                      BackendDish 加 createdAt; normalizeDish 透传

  frontend/src/pages/mine/index.vue                .stats 改 flex column; .quick-grid 改 3 列
  frontend/src/pages/learned-dishes/index.vue      列表换 TimelineGroup; 保留 hero/搜索/筛选/badge
  frontend/src/pages/favorite-dishes/index.vue     列表换 TimelineGroup; 保留所有卡片元素和按钮
  frontend/src/pages/my-dishes/index.vue           列表换 TimelineGroup; myDishes 按 createdAt 倒序
```

不动：`stores/kitchen.ts`、后端、其它页面、`EmptyState` / `AppNavbar` / `AppPage` / `BottomTabbar`。

---

## Task 1: 数据层 · 前端 Dish 类型补 `createdAt`

**Files:**
- Modify: `frontend/src/data/types.ts:76-102`
- Modify: `frontend/src/api/kitchen.ts:96-116`（`BackendDish`）
- Modify: `frontend/src/api/kitchen.ts:360-407`（`normalizeDish`）

- [ ] **Step 1: 给 `Dish` 接口加 `createdAt?: string`**

打开 `frontend/src/data/types.ts`。找到 `export interface Dish { ... }`。在 `tips: string[]` 上一行**之前**插入：

```ts
  createdAt?: string
```

完整定位锚点 — 把：

```ts
  ingredients: Ingredient[]
  steps: DishStep[]
  tips: string[]
}
```

替换为：

```ts
  ingredients: Ingredient[]
  steps: DishStep[]
  tips: string[]
  createdAt?: string
}
```

- [ ] **Step 2: 给 `BackendDish` type 加 `createdAt`**

打开 `frontend/src/api/kitchen.ts`，找到 `type BackendDish = { ... }`。把它的末段：

```ts
  ingredients?: BackendIngredient[]
  steps?: BackendStep[]
}
```

替换为：

```ts
  ingredients?: BackendIngredient[]
  steps?: BackendStep[]
  createdAt?: string
}
```

- [ ] **Step 3: 让 `normalizeDish` 把 `createdAt` 透传出来**

继续在 `frontend/src/api/kitchen.ts`。找到 `export function normalizeDish(row: BackendDish): Dish {` 的 `return { ... }`。把末段：

```ts
    tips: tips.length ? tips : ['出锅前尝味，根据口味微调盐分。']
  }
}
```

替换为：

```ts
    tips: tips.length ? tips : ['出锅前尝味，根据口味微调盐分。'],
    createdAt: row.createdAt
  }
}
```

- [ ] **Step 4: typecheck**

Run: `npm --workspace frontend run typecheck`
Expected: 退出码 0。

- [ ] **Step 5: 提交**

```bash
git -C D:/work/ai/mini-kitchen-menu add frontend/src/data/types.ts frontend/src/api/kitchen.ts
git -C D:/work/ai/mini-kitchen-menu commit -m "feat(frontend): Dish 类型透传 createdAt 字段"
```

---

## Task 2: 工具函数 · `groupByMonth`

**Files:**
- Create: `frontend/src/utils/timeline.ts`

- [ ] **Step 1: 创建 `frontend/src/utils/timeline.ts`**

完整内容：

```ts
export interface TimelineGroup<T> {
  monthKey: string
  monthLabel: string
  items: Array<T & { dayLabel: string }>
}

const UNKNOWN_GROUP_KEY = 'unknown'
const UNKNOWN_GROUP_LABEL = '时间未记录'

function formatMonthLabel(year: number, month: number) {
  return `${year} 年 ${month} 月`
}

function formatDayLabel(month: number, day: number) {
  return `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function groupByMonth<T>(
  items: T[],
  getDate: (item: T) => string | undefined
): TimelineGroup<T>[] {
  const groups = new Map<string, TimelineGroup<T>>()

  for (const item of items) {
    const raw = getDate(item)
    const date = raw ? new Date(raw) : null

    if (!date || Number.isNaN(date.getTime())) {
      const existing = groups.get(UNKNOWN_GROUP_KEY) ?? {
        monthKey: UNKNOWN_GROUP_KEY,
        monthLabel: UNKNOWN_GROUP_LABEL,
        items: []
      }
      existing.items.push({ ...item, dayLabel: '--' })
      groups.set(UNKNOWN_GROUP_KEY, existing)
      continue
    }

    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const monthKey = `${year}-${String(month).padStart(2, '0')}`
    const existing = groups.get(monthKey) ?? {
      monthKey,
      monthLabel: formatMonthLabel(year, month),
      items: []
    }
    existing.items.push({ ...item, dayLabel: formatDayLabel(month, day) })
    groups.set(monthKey, existing)
  }

  return [...groups.values()].sort((a, b) => {
    if (a.monthKey === UNKNOWN_GROUP_KEY) return 1
    if (b.monthKey === UNKNOWN_GROUP_KEY) return -1
    return b.monthKey.localeCompare(a.monthKey)
  })
}
```

- [ ] **Step 2: typecheck**

Run: `npm --workspace frontend run typecheck`
Expected: 退出码 0。

- [ ] **Step 3: 提交**

```bash
git -C D:/work/ai/mini-kitchen-menu add frontend/src/utils/timeline.ts
git -C D:/work/ai/mini-kitchen-menu commit -m "feat(frontend): 新增 groupByMonth 工具函数"
```

---

## Task 3: 公共组件 · `TimelineGroup.vue`

**Files:**
- Create: `frontend/src/components/TimelineGroup.vue`

- [ ] **Step 1: 创建组件文件**

完整内容：

```vue
<template>
  <view :class="['timeline-group', { 'is-first': isFirst, 'is-last': isLast }]">
    <view class="timeline-rail" />
    <view class="timeline-month">
      <view class="timeline-month-dot" />
      <text class="timeline-month-label">{{ monthLabel }}</text>
    </view>
    <view class="timeline-month-items">
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  monthLabel: string
  isFirst?: boolean
  isLast?: boolean
}>()
</script>

<style scoped lang="scss">
.timeline-group {
  position: relative;
  padding-left: 0;
}

.timeline-group:not(:last-child) {
  margin-bottom: 40rpx;
}

.timeline-rail {
  position: absolute;
  left: 32rpx;
  top: 0;
  bottom: 0;
  width: 2rpx;
  background: rgba(255, 123, 37, 0.18);
}

.timeline-group.is-first .timeline-rail {
  top: 32rpx;
}

.timeline-group.is-last .timeline-rail {
  bottom: 16rpx;
}

.timeline-month {
  position: relative;
  display: flex;
  align-items: center;
  gap: 18rpx;
  margin-bottom: 24rpx;
}

.timeline-month-dot {
  width: 28rpx;
  height: 28rpx;
  margin-left: 19rpx;
  border-radius: 50%;
  background: $primary;
  box-shadow: 0 0 0 4rpx #fff, 0 4rpx 12rpx rgba(255, 123, 37, 0.24);
}

.timeline-month-label {
  color: $text-main;
  font-size: 32rpx;
  font-weight: 900;
}

.timeline-month-items {
  padding-left: 80rpx;
}
</style>
```

- [ ] **Step 2: typecheck**

Run: `npm --workspace frontend run typecheck`
Expected: 退出码 0。

- [ ] **Step 3: 提交**

```bash
git -C D:/work/ai/mini-kitchen-menu add frontend/src/components/TimelineGroup.vue
git -C D:/work/ai/mini-kitchen-menu commit -m "feat(frontend): 新增 TimelineGroup 组件骨架"
```

---

## Task 4: Mine 页布局修复

**Files:**
- Modify: `frontend/src/pages/mine/index.vue`（仅 SCSS 段）

- [ ] **Step 1: 替换 `.stats` 整段样式**

打开 `frontend/src/pages/mine/index.vue`。找到 `<style scoped lang="scss">` 区内的 `.stats { ... }`、`.stats view { ... }`、`.stats view:last-child { ... }`、`.stats image { ... }`、`.stats text { ... }`、`.stats strong { ... }` 六段连续的 SCSS。整段（约 215-249 行）替换为：

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

- [ ] **Step 2: 替换 `.quick-grid` 的 grid 列数**

继续在同文件 SCSS 段。找到 `.quick-grid` 那段（在 `.quick-grid, .recent-grid` 合并段下方独立定义那段，约 257-260 行）：

```scss
.quick-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: 34rpx;
}
```

替换为：

```scss
.quick-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 34rpx;
}
```

- [ ] **Step 3: typecheck**

Run: `npm --workspace frontend run typecheck`
Expected: 退出码 0。

- [ ] **Step 4: 提交**

```bash
git -C D:/work/ai/mini-kitchen-menu add frontend/src/pages/mine/index.vue
git -C D:/work/ai/mini-kitchen-menu commit -m "fix(frontend): 修我的页统计居中和快捷入口 3 列对齐"
```

---

## Task 5: 我已学会页 · 改 TimelineGroup

**Files:**
- Modify: `frontend/src/pages/learned-dishes/index.vue`

- [ ] **Step 1: 替换 `<template>` 列表段**

打开 `frontend/src/pages/learned-dishes/index.vue`。找到现有 `<view v-if="entries.length" class="timeline">...</view>` 整段（约 34-61 行）。把整段替换为：

```vue
    <view v-if="monthlyGroups.length" class="timeline">
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
          <view class="timeline-card card" @tap="viewDish(entry.dish.id)">
            <view class="timeline-head">
              <view>
                <text class="timeline-title">{{ entry.dish.name }} {{ entry.dish.emoji }}</text>
              </view>
              <text class="timeline-badge">已学会</text>
            </view>
            <view class="timeline-body">
              <image :src="entry.dish.coverImage" mode="aspectFill" />
              <view class="timeline-copy">
                <text class="timeline-desc line-clamp-2">{{ entry.dish.description }}</text>
                <view class="timeline-meta">
                  <text>{{ entry.dish.difficulty }}</text>
                  <text>{{ entry.dish.estimatedMinutes }} 分钟</text>
                  <text>{{ entry.dish.tasteTags.slice(0, 2).join(' / ') || '家常菜' }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </TimelineGroup>
    </view>

    <EmptyState v-else title="时间线还是空的" desc="做完一道菜后把它加入“我已学会”，这里会按时间沉淀下来。" />
```

注意：原模板有 `<EmptyState v-else>`，新模板替换条件为 `monthlyGroups.length`。`{{ formatLearnedTime(entry.learnedAt) }}` 行删掉（时间由左侧 dayLabel 展示）。原 `.timeline-card` 内 `<view><text>...日期</text><text>名称</text></view>` 结构改成只有名称。

- [ ] **Step 2: 替换 `<script setup>` 引入和 entries 计算**

继续在同文件。找到 `<script setup lang="ts">` 开头的 import 段。把：

```ts
import AppNavbar from '@/components/AppNavbar.vue'
import AppPage from '@/components/AppPage.vue'
import BottomTabbar from '@/components/BottomTabbar.vue'
import EmptyState from '@/components/EmptyState.vue'
```

替换为：

```ts
import AppNavbar from '@/components/AppNavbar.vue'
import AppPage from '@/components/AppPage.vue'
import BottomTabbar from '@/components/BottomTabbar.vue'
import EmptyState from '@/components/EmptyState.vue'
import TimelineGroup from '@/components/TimelineGroup.vue'
import { groupByMonth } from '@/utils/timeline'
```

继续在同文件。找到 `const entries = computed(() => ...)` 整段（约 110-125 行）。在它**之后**追加：

```ts
const monthlyGroups = computed(() => groupByMonth(entries.value, (entry) => entry.learnedAt))
```

- [ ] **Step 3: 删除 `formatLearnedTime` 函数**

找到 `function formatLearnedTime(value: string) { ... }` 整段（约 141-150 行）。**整段删除**——不再使用。

- [ ] **Step 4: 删除旧 timeline SCSS 段，新增时间线行样式**

找到 `<style scoped lang="scss">` 内的 `.timeline { ... }`、`.timeline-item { ... }`、`.timeline-axis { ... }`、`.timeline-dot { ... }`、`.timeline-line { ... }`、`.timeline-item:last-child .timeline-line { ... }`、`.timeline-card { ... }`、`.timeline-head { ... }`、`.timeline-date { ... }`、`.timeline-title { ... }`、`.timeline-badge { ... }` 这些段，及其往后到 `</style>` 结束之间所有的 `.timeline-*` 样式（约 227 行起到末尾）。

把所有 `.timeline-*` 相关样式（包括 `.timeline-body`、`.timeline-copy`、`.timeline-desc`、`.timeline-meta`、`.timeline-axis` 等）**整段删除**，然后在 `.filter-mark { ... }` 之后追加下面这段：

```scss
.timeline {
  display: block;
  padding-bottom: 18rpx;
}

.timeline-row {
  display: grid;
  grid-template-columns: 80rpx 1fr;
  align-items: flex-start;
  gap: 0;
}

.timeline-row:not(:last-child) {
  margin-bottom: 20rpx;
}

.timeline-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding-top: 14rpx;
}

.timeline-day-dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: $primary;
  box-shadow: 0 0 0 3rpx #fff;
}

.timeline-day-label {
  color: $text-sub;
  font-size: 24rpx;
}

.timeline-card {
  padding: 22rpx;
}

.timeline-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16rpx;
}

.timeline-title {
  display: block;
  color: $text-main;
  font-size: 29rpx;
  font-weight: 900;
}

.timeline-badge {
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  background: #eef8e8;
  color: $success;
  font-size: 22rpx;
  font-weight: 900;
}

.timeline-body {
  display: grid;
  grid-template-columns: 188rpx minmax(0, 1fr);
  gap: 18rpx;
  margin-top: 16rpx;
}

.timeline-body image {
  width: 188rpx;
  height: 152rpx;
  border-radius: 20rpx;
  background: #f8f1eb;
}

.timeline-copy {
  min-width: 0;
}

.timeline-desc {
  display: block;
  color: $text-sub;
  font-size: 24rpx;
  line-height: 1.5;
}

.timeline-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-top: 12rpx;
}

.timeline-meta text {
  padding: 6rpx 14rpx;
  border-radius: 999rpx;
  background: #fff7ef;
  color: $text-main;
  font-size: 21rpx;
}
```

- [ ] **Step 5: typecheck**

Run: `npm --workspace frontend run typecheck`
Expected: 退出码 0。

- [ ] **Step 6: 提交**

```bash
git -C D:/work/ai/mini-kitchen-menu add frontend/src/pages/learned-dishes/index.vue
git -C D:/work/ai/mini-kitchen-menu commit -m "feat(frontend): 我已学会页改成月份时间线"
```

---

## Task 6: 我的收藏页 · 改 TimelineGroup

**Files:**
- Modify: `frontend/src/pages/favorite-dishes/index.vue`

- [ ] **Step 1: 替换 `<template>` 列表段**

打开 `frontend/src/pages/favorite-dishes/index.vue`。找到现有 `<view v-if="filteredEntries.length" class="favorite-list">...</view>` 整段（约 40-61 行）。整段替换为：

```vue
    <view v-if="monthlyGroups.length" class="timeline">
      <TimelineGroup
        v-for="(group, index) in monthlyGroups"
        :key="group.monthKey"
        :month-label="group.monthLabel"
        :is-first="index === 0"
        :is-last="index === monthlyGroups.length - 1"
      >
        <view v-for="entry in group.items" :key="entry.id + entry.dish.id" class="timeline-row">
          <view class="timeline-day">
            <view class="timeline-day-dot" />
            <text class="timeline-day-label">{{ entry.dayLabel }}</text>
          </view>
          <view class="timeline-card favorite-card card">
            <image class="favorite-cover" :src="entry.dish.coverImage" mode="aspectFill" @tap="viewDish(entry.dish.id)" />
            <view class="favorite-copy" @tap="viewDish(entry.dish.id)">
              <view class="favorite-head">
                <text class="favorite-name line-clamp-1">{{ entry.dish.name }} {{ entry.dish.emoji }}</text>
                <text class="favorite-badge">已收藏</text>
              </view>
              <text class="favorite-desc line-clamp-2">{{ entry.dish.description || '暂无描述' }}</text>
              <view class="favorite-meta">
                <text>{{ entry.dish.difficulty }}</text>
                <text>{{ entry.dish.estimatedMinutes }} 分钟</text>
                <text>{{ entry.dish.learnedAt ? '我已学会' : '待尝试' }}</text>
              </view>
            </view>
            <view class="favorite-actions">
              <button class="ghost-btn action-btn" hover-class="tap" @tap="store.addToMenu(entry.dish.id)">加入点菜单</button>
              <button class="ghost-btn action-btn delete-btn" hover-class="tap" @tap="toggleFavorite(entry.dish.id)">取消收藏</button>
            </view>
          </view>
        </view>
      </TimelineGroup>
    </view>

    <EmptyState
      v-else
      title="时间线还是空的"
      desc="在菜品库、首页推荐或菜品详情里点一下收藏，会按时间沉淀到这里。"
    />
```

注意：原 `<text class="favorite-time">收藏时间：...</text>` 已删除（时间由左侧 dayLabel 展示）。

- [ ] **Step 2: 替换 `<script setup>` import 段，加 monthlyGroups**

继续在同文件。找到 `import { useKitchenStore } from '@/stores/kitchen'` 这一行。在它**之后**追加：

```ts
import TimelineGroup from '@/components/TimelineGroup.vue'
import { groupByMonth } from '@/utils/timeline'
```

继续找到 `const filteredEntries = computed(() => { ... })` 整段闭合后。在它**之后**追加：

```ts
const monthlyGroups = computed(() => groupByMonth(filteredEntries.value, (entry) => entry.favoritedAt))
```

- [ ] **Step 3: 删除 `favoriteTimeLabel` 函数**

找到 `function favoriteTimeLabel(value?: string) { ... }` 整段（约 141-149 行）。**整段删除**——不再使用。

- [ ] **Step 4: 追加时间线行 SCSS**

打开 `<style scoped lang="scss">`。找到末尾的 `.delete-btn { ... }` 闭合大括号。在它**之后、`</style>` 之前**追加：

```scss
.timeline {
  display: block;
  padding-bottom: 18rpx;
}

.timeline-row {
  display: grid;
  grid-template-columns: 80rpx 1fr;
  align-items: flex-start;
  gap: 0;
}

.timeline-row:not(:last-child) {
  margin-bottom: 20rpx;
}

.timeline-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding-top: 14rpx;
}

.timeline-day-dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: $primary;
  box-shadow: 0 0 0 3rpx #fff;
}

.timeline-day-label {
  color: $text-sub;
  font-size: 24rpx;
}

.timeline-card {
  /* 复用现有 .favorite-card 视觉，不重写 */
}
```

`.timeline-card` 空块只是占位，让两个 class 共存（同时挂 `.timeline-card .favorite-card` 不会冲突）。视觉完全由 `.favorite-card` 主导，保留卡片原渐变、阴影、操作按钮位置。

- [ ] **Step 5: typecheck**

Run: `npm --workspace frontend run typecheck`
Expected: 退出码 0。

- [ ] **Step 6: 提交**

```bash
git -C D:/work/ai/mini-kitchen-menu add frontend/src/pages/favorite-dishes/index.vue
git -C D:/work/ai/mini-kitchen-menu commit -m "feat(frontend): 我的收藏页改成月份时间线"
```

---

## Task 7: 我创建的菜品页 · 改 TimelineGroup + createdAt 排序

**Files:**
- Modify: `frontend/src/pages/my-dishes/index.vue`

- [ ] **Step 1: 替换 `<template>` 列表段**

打开 `frontend/src/pages/my-dishes/index.vue`。找到现有 `<view v-if="filteredDishes.length" class="dish-list">...</view>` 整段（约 32-53 行）。整段替换为：

```vue
    <view v-if="monthlyGroups.length" class="timeline">
      <TimelineGroup
        v-for="(group, index) in monthlyGroups"
        :key="group.monthKey"
        :month-label="group.monthLabel"
        :is-first="index === 0"
        :is-last="index === monthlyGroups.length - 1"
      >
        <view v-for="dish in group.items" :key="dish.id" class="timeline-row">
          <view class="timeline-day">
            <view class="timeline-day-dot" />
            <text class="timeline-day-label">{{ dish.dayLabel }}</text>
          </view>
          <view class="timeline-card dish-card card">
            <image class="dish-cover" :src="dish.coverImage" mode="aspectFill" @tap="viewDish(dish.id)" />
            <view class="dish-copy" @tap="viewDish(dish.id)">
              <view class="dish-head">
                <text class="dish-name line-clamp-1">{{ dish.name }} {{ dish.emoji }}</text>
                <text class="dish-badge">我的菜品</text>
              </view>
              <text class="dish-desc line-clamp-2">{{ dish.description || '暂无描述' }}</text>
              <text v-if="dish.remark" class="dish-remark line-clamp-2">备注：{{ dish.remark }}</text>
              <view class="dish-meta">
                <text>{{ dish.difficulty }}</text>
                <text>{{ dish.estimatedMinutes }} 分钟</text>
                <text>{{ dish.servings }} 人份</text>
              </view>
            </view>
            <view class="dish-actions">
              <button class="ghost-btn action-btn" hover-class="tap" @tap="editDish(dish.id)">编辑</button>
              <button class="ghost-btn action-btn delete-btn" hover-class="tap" @tap="removeDish(dish.id)">删除</button>
            </view>
          </view>
        </view>
      </TimelineGroup>
    </view>

    <EmptyState
      v-else
      title="时间线还是空的"
      desc="新增一道自己的拿手菜后，会按时间出现在这里，可以继续编辑、补备注。"
    />
```

- [ ] **Step 2: 替换 `<script setup>` 引入并改 myDishes 排序**

继续在同文件。找到 `import { useKitchenStore } from '@/stores/kitchen'` 这一行。在它**之后**追加：

```ts
import TimelineGroup from '@/components/TimelineGroup.vue'
import { groupByMonth } from '@/utils/timeline'
```

继续找到 `const myDishes = computed(() => store.myCreatedDishes())` 这一行。整行替换为：

```ts
const myDishes = computed(() =>
  store
    .myCreatedDishes()
    .slice()
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
)
```

继续找到 `const filteredDishes = computed(() => { ... })` 整段闭合后。在它**之后**追加：

```ts
const monthlyGroups = computed(() => groupByMonth(filteredDishes.value, (dish) => dish.createdAt))
```

- [ ] **Step 3: 追加时间线行 SCSS**

打开 `<style scoped lang="scss">`。找到末尾的 `.delete-btn { ... }` 闭合大括号。在它**之后、`</style>` 之前**追加：

```scss
.timeline {
  display: block;
  padding-bottom: 18rpx;
}

.timeline-row {
  display: grid;
  grid-template-columns: 80rpx 1fr;
  align-items: flex-start;
  gap: 0;
}

.timeline-row:not(:last-child) {
  margin-bottom: 20rpx;
}

.timeline-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding-top: 14rpx;
}

.timeline-day-dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: $primary;
  box-shadow: 0 0 0 3rpx #fff;
}

.timeline-day-label {
  color: $text-sub;
  font-size: 24rpx;
}

.timeline-card {
  /* 复用现有 .dish-card 视觉，不重写 */
}
```

- [ ] **Step 4: typecheck**

Run: `npm --workspace frontend run typecheck`
Expected: 退出码 0。

- [ ] **Step 5: 提交**

```bash
git -C D:/work/ai/mini-kitchen-menu add frontend/src/pages/my-dishes/index.vue
git -C D:/work/ai/mini-kitchen-menu commit -m "feat(frontend): 我创建的菜品页改成月份时间线"
```

---

## Task 8: 终局回归

**Files:** 无新文件改动

- [ ] **Step 1: 全量 typecheck + 构建**

```bash
npm --workspace frontend run typecheck
npm run build:mp-weixin
```

Expected: 两条命令退出码 0。`build:mp-weixin` 输出 `frontend/dist/build/mp-weixin/` 且 `pages/` 下包含 `learned-dishes/`、`favorite-dishes/`、`my-dishes/`、`mine/`、`register/`、`login/` 等所有页面。

- [ ] **Step 2: H5 启动并人工浏览四个页面**

```bash
npm run dev:backend
```

另一个 shell：

```bash
npm run dev:frontend:h5
```

打开浏览器 `http://localhost:5173/`（如果 5173 被占用 vite 会跳 5174/5175，看终端最终绑定的端口）。用 demo 账号登录，浏览：

1. **`/pages/mine/index`**
   - 头部卡片里"我创建的菜品 / 我已学会 / 我的收藏"3 项**垂直居中**对齐：图标在上、文字中间、数字在下；分割线只在前两项右边各画一条，最右一项无分割线
   - 快捷入口区**6 个卡片排成 3×2**整齐网格，最后一行 3 项铺满（不再 4+2 断裂）
   - 其它区域（个人卡、最近成品、tabbar）跟原来无视觉变化

2. **`/pages/learned-dishes/index`**
   - 顶部 hero / 搜索框 / 筛选条不变
   - 列表区每月一个大圆点 + "YYYY 年 M 月" 标题
   - 每条记录左侧 14rpx 小圆点 + "MM-DD" 文本；右侧菜品卡片样式跟原来"已学会"卡片视觉一致
   - 左竖线在同一组内连续，组之间紧贴
   - 卡片点击跳详情；空筛选走 EmptyState

3. **`/pages/favorite-dishes/index`**
   - 顶部 hero / 搜索 / 筛选不变
   - 时间线展示，每条卡片保留"加入点菜单 / 取消收藏"两按钮在右下
   - 卡片视觉跟原来一致（封面图、badge、meta 标签）
   - 点"取消收藏"后卡片应该消失，时间线自动重排

4. **`/pages/my-dishes/index`**
   - 顶部 hero / 搜索 / "新增菜品"按钮不变
   - 时间线按月分组，**新建的在最上面**（验证：进入"新增菜品"页随手新增一道空菜，回来这道菜出现在最上方"YYYY 年 M 月"的最新日期下）
   - 卡片右下"编辑 / 删除"按钮位置不变
   - 删除一道菜后从时间线消失

四项都过 → 走 Step 3。任何一项有视觉断裂或交互异常，停下来反馈。

- [ ] **Step 3: 停掉 dev 服务，检查 git 状态干净**

```bash
bash D:/work/ai/mini-kitchen-menu/stop-all.sh
git -C D:/work/ai/mini-kitchen-menu status
```

Expected: `git status` 显示 `nothing to commit, working tree clean`（除了之前已存在的 `.gitignore` 改动，那个不属于本计划范围）。

- [ ] **Step 4: 查看提交历史**

```bash
git -C D:/work/ai/mini-kitchen-menu log --oneline -10
```

Expected: 看到 Task 1-7 各 1 条新 commit（共 7 条），加上之前的 spec commit。

---

## 自审记录

**spec 覆盖**：
- Mine 页 `.stats` 居中对齐 → Task 4 Step 1
- Mine 页 `.quick-grid` 3 列 → Task 4 Step 2
- TimelineGroup 组件骨架 → Task 3
- `groupByMonth` 工具 → Task 2
- `Dish.createdAt` 类型链路 → Task 1
- 我已学会页 timeline 重构 → Task 5
- 我的收藏页 timeline 重构 → Task 6（保留按钮和 badge）
- 我创建的菜品页 timeline 重构 + createdAt 排序 → Task 7
- 视觉延续性硬约束 → Task 6/7 用 `.timeline-card .favorite-card`/`.dish-card` 复用现有样式；Task 5 重建 timeline 段时复制原 `.timeline-card`/`.timeline-badge` 等已经在用的命名和数值，badge 用 `$success`、卡片元素字号/圆角/padding 都跟原值一致
- 空状态用 EmptyState + 文案微调 → Task 5/6/7 各 v-else 段

**类型/命名一致性**：
- `TimelineGroup<T>` 接口在 Task 2 定义，Task 5/6/7 调用 `groupByMonth` 时返回类型一致
- 组件名 `TimelineGroup`、props `monthLabel/isFirst/isLast` 三处页面使用一致
- 模板 class 名 `.timeline-row/.timeline-day/.timeline-day-dot/.timeline-day-label/.timeline-card` 在 Task 5/6/7 模板和样式中一致
- `dayLabel/monthKey/monthLabel` 字段名在数据层和模板中一致

**风险点**：
- Task 5 删除旧 `.timeline-axis/.timeline-dot/.timeline-line` 样式时要小心边界，本任务里已经明确"所有 `.timeline-*` 相关样式整段删除然后追加新段"，避免新旧混杂导致样式串
- Task 6/7 的 `.timeline-card` 空块是关键 trick：模板上 `class="timeline-card favorite-card card"` 三 class 并列，`.timeline-card` 只是个挂载点不写视觉；`.favorite-card`/`.dish-card` 原视觉完全保留。如果 Task 6/7 实际跑 typecheck/H5 时发现 `.timeline-card` 因为空块导致 scss 编译警告或冗余，可以直接删 `.timeline-card { /* ... */ }` 这一空段——它不影响视觉
- mp-weixin slot 样式作用域：`<TimelineGroup>` 的 `<slot />` 在 mp-weixin 编译为 `<view>` 嵌套，slot 内的 `.timeline-row` 样式定义在**页面**的 `<style scoped>` 里就行，不要写到 `TimelineGroup.vue` 内（plan 已经这么做了）
