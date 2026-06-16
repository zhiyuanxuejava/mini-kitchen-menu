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

    <TodayMenuSummary :count="store.menuDishCount" :servings="store.menu.servings" :minutes="store.estimatedMinutes" />

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
        @favorite="toggleFavorite"
      />
    </view>

    <SectionTitle title="最近做过">
      <button class="section-extra" hover-class="tap" @tap="goRecords">查看全部 ›</button>
    </SectionTitle>
    <view v-if="recentRecords.length" class="recent-grid">
      <view v-for="record in recentRecords" :key="record.id" class="recent-card card" @tap="viewDish(record.dish.id)">
        <image :src="record.photos[0] || record.dish.coverImage" mode="aspectFill" />
        <view>
          <text class="recent-title line-clamp-1">{{ record.dish.name }} {{ record.dish.emoji }}</text>
          <text class="recent-date">{{ record.finishedAt.slice(0, 10) }}</text>
          <text class="recent-score">★ {{ record.rating?.overallScore || record.dish.rating }}</text>
        </view>
        <text class="arrow">›</text>
      </view>
    </view>
    <view v-else class="recent-empty card" @tap="goRecords">
      <text class="empty-title">还没有最近做过的菜</text>
      <text class="empty-desc">完成一道菜并上传成品后，会在这里显示最近记录。</text>
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
  else if (store.needsWechatProfileCompletion()) uni.redirectTo({ url: '/pages/profile-edit/index?onboarding=1' })
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

async function toggleFavorite(id: string) {
  try {
    const favorite = await store.toggleDishFavorite(id)
    uni.showToast({ title: favorite ? '已加入收藏' : '已取消收藏', icon: 'none' })
  } catch {
    uni.showToast({ title: store.apiError || '收藏状态更新失败', icon: 'none' })
  }
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
.recent-grid {
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

.recent-empty {
  padding: 28rpx;
  border-style: dashed;
  background: rgba(255, 253, 250, 0.72);
}

.empty-title,
.empty-desc {
  display: block;
}

.empty-title {
  color: $text-main;
  font-size: 28rpx;
  font-weight: 900;
}

.empty-desc {
  margin-top: 10rpx;
  color: $text-sub;
  font-size: 24rpx;
  line-height: 1.45;
}
</style>
