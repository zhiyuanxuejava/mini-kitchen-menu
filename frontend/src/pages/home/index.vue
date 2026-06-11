<template>
  <AppPage>
    <view class="home-head">
      <view class="title-wrap">
        <text class="title-xl">今天想<text class="accent">做点什么</text>？</text>
      </view>
      <image class="pot" :src="icons.pot" mode="aspectFit" />
      <view class="date-chip">
        <image :src="icons.calendar" mode="aspectFit" />
        <text>{{ dayLabel }}</text>
      </view>
    </view>

    <view class="search-box" @tap="goDishes">
      <image :src="icons.search" class="icon-36" mode="aspectFit" />
      <text>搜索菜名 / 食材 / 做法</text>
    </view>

    <TodayMenuSummary :count="store.menuDishCount" :servings="store.menu.servings" :minutes="displayEstimatedMinutes" />

    <SectionTitle title="今日推荐">
      <button class="section-extra" hover-class="tap" @tap="shuffle">换一换 ↻</button>
    </SectionTitle>
    <view class="recommend-grid">
      <DishCard
        v-for="dish in recommended"
        :key="dish.id"
        :dish="dish"
        @view="viewDish"
        @add="store.addToMenu"
      />
    </view>

    <SectionTitle title="最近做过">
      <button class="section-extra" hover-class="tap" @tap="goRecords">查看全部 ›</button>
    </SectionTitle>
    <view class="recent-grid">
      <view v-for="record in recentRecords" :key="record.id" class="recent-card card">
        <image :src="record.dish.coverImage" mode="aspectFill" />
        <view>
          <text class="recent-title line-clamp-1">{{ record.dish.name }} {{ record.dish.emoji }}</text>
          <text class="recent-date">{{ record.finishedAt.slice(0, 10) }}</text>
          <text class="recent-score">★ {{ record.rating?.overallScore || record.dish.rating }}</text>
        </view>
        <text class="arrow">›</text>
      </view>
    </view>

    <view class="quick-grid">
      <button v-for="entry in quickEntries" :key="entry.title" class="quick-card" hover-class="tap" @tap="entry.tap">
        <image :src="entry.icon" mode="aspectFit" />
        <text class="quick-title">{{ entry.title }}</text>
        <text class="quick-sub">{{ entry.sub }}</text>
      </button>
    </view>

    <BottomTabbar active="home" />
  </AppPage>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppPage from '@/components/AppPage.vue'
import BottomTabbar from '@/components/BottomTabbar.vue'
import DishCard from '@/components/DishCard.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import TodayMenuSummary from '@/components/TodayMenuSummary.vue'
import { icons } from '@/data/assets'
import { useKitchenStore } from '@/stores/kitchen'

const store = useKitchenStore()
const offset = ref(0)

onShow(async () => {
  store.hydrate()
  if (!store.user) uni.reLaunch({ url: '/pages/login/index' })
  else await store.ensureRemoteDishes()
})

const dayLabel = computed(() => {
  const date = new Date()
  const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()]
  return `${week} ${date.getMonth() + 1}.${date.getDate()}`
})

const recommended = computed(() => {
  const source = store.dishes.slice(offset.value, offset.value + 2)
  return source.length === 2 ? source : store.dishes.slice(0, 2)
})

const recentRecords = computed(() => store.historyRecords.slice(0, 2))
const displayEstimatedMinutes = computed(() => (store.menuDishCount === 4 && store.menu.servings === 3 ? 75 : store.estimatedMinutes))

const quickEntries = computed(() => [
  { title: '我的菜品库', sub: '管理我的菜谱', icon: icons.cookbook, tap: () => uni.reLaunch({ url: '/pages/dishes/index' }) },
  { title: '新增菜品', sub: '记录新菜谱', icon: icons.plus, tap: () => uni.navigateTo({ url: '/pages/dish-form/index' }) },
  { title: '做菜台', sub: '开始烹饪', icon: icons.pan, tap: () => uni.reLaunch({ url: '/pages/cook/index' }) },
  { title: '历史记录', sub: '查看烹饪记录', icon: icons.history, tap: () => uni.navigateTo({ url: '/pages/records/index' }) }
])

function shuffle() {
  if (!store.dishes.length) return
  offset.value = (offset.value + 2) % store.dishes.length
}

function viewDish(id: string) {
  uni.navigateTo({ url: `/pages/dish-detail/index?id=${id}` })
}

function goDishes() {
  uni.reLaunch({ url: '/pages/dishes/index' })
}

function goRecords() {
  uni.navigateTo({ url: '/pages/records/index' })
}
</script>

<style scoped lang="scss">
.home-head {
  position: relative;
  min-height: 176rpx;
  margin-bottom: 14rpx;
}

.title-wrap {
  width: 540rpx;
  padding-top: 24rpx;
}

.home-head .title-xl {
  font-size: 54rpx;
  white-space: nowrap;
}

.pot {
  position: absolute;
  right: 18rpx;
  top: 50rpx;
  width: 168rpx;
  height: 128rpx;
  opacity: 0.92;
}

.date-chip {
  position: absolute;
  right: 0;
  top: 10rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 16rpx;
  border: 1rpx solid $border;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.9);
  color: $text-main;
  font-size: 23rpx;
  font-weight: 800;
}

.date-chip image {
  width: 34rpx;
  height: 34rpx;
}

.search-box {
  margin-bottom: 22rpx;
}

:deep(.section-title) {
  margin: 28rpx 0 16rpx;
}

.recommend-grid,
.recent-grid,
.quick-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18rpx;
}

.recent-card {
  display: grid;
  grid-template-columns: 88rpx minmax(0, 1fr) 18rpx;
  gap: 12rpx;
  align-items: center;
  min-width: 0;
  overflow: hidden;
  padding: 14rpx;
}

.recent-card image {
  width: 88rpx;
  height: 68rpx;
  border-radius: 16rpx;
}

.recent-title,
.recent-date,
.recent-score {
  display: block;
}

.recent-title {
  color: $text-main;
  font-size: 25rpx;
  font-weight: 900;
}

.recent-date {
  margin-top: 6rpx;
  color: $text-sub;
  font-size: 21rpx;
}

.recent-score {
  margin-top: 4rpx;
  color: $warning;
  font-size: 24rpx;
  font-weight: 800;
}

.arrow {
  color: #b6aaa2;
  font-size: 44rpx;
}

.quick-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: 24rpx;
}

.quick-card {
  min-height: 142rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12rpx 8rpx;
  border: 1rpx solid $border;
  border-radius: 26rpx;
  background: linear-gradient(145deg, #fff 0%, #fff7ee 100%);
  box-shadow: $shadow-soft;
}

.quick-card image {
  width: 54rpx;
  height: 54rpx;
}

.quick-title {
  display: block;
  max-width: 100%;
  margin-top: 8rpx;
  color: $text-main;
  font-size: 22rpx;
  font-weight: 900;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.quick-sub {
  display: block;
  max-width: 100%;
  margin-top: 5rpx;
  color: $text-sub;
  font-size: 18rpx;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
