<template>
  <AppPage>
    <view class="mine-head">
      <text class="title-xl">我的</text>
      <view class="head-icons">
        <button class="icon-btn" hover-class="tap" @tap="notify">
          <image :src="icons.bell" mode="aspectFit" />
        </button>
        <button class="icon-btn settings-trigger" hover-class="tap" @tap="openSettings">
          <image :src="icons.settings" mode="aspectFit" />
        </button>
      </view>
    </view>

    <view class="profile card">
      <view class="profile-top">
        <UserAvatar class="avatar" :src="store.user?.avatarUrl || icons.avatar" />
        <view class="profile-copy">
          <text class="nickname">{{ displayName }}</text>
          <text class="profile-sub">记录每一次下厨</text>
        </view>
        <view class="profile-illustration">
          <image class="profile-pot" :src="icons.pot" mode="aspectFit" />
        </view>
      </view>

      <view class="stats">
        <view class="stat-item">
          <image :src="icons.cookbook" mode="aspectFit" />
          <text>我创建的菜品</text>
          <strong>{{ store.myDishCount }} 道</strong>
        </view>
        <view class="stat-item">
          <image :src="icons.check" mode="aspectFit" />
          <text>我已学会</text>
          <strong>{{ store.learnedDishCount }} 道</strong>
        </view>
        <view class="stat-item">
          <image :src="icons.heart" mode="aspectFit" />
          <text>我的收藏</text>
          <strong>{{ store.favoriteDishCount }} 道</strong>
        </view>
      </view>
    </view>

    <view class="quick-grid">
      <button v-for="entry in quickEntries" :key="entry.title" class="quick-card" hover-class="tap" @tap="entry.tap">
        <view class="quick-icon-wrap">
          <image :src="entry.icon" mode="aspectFit" />
        </view>
        <view class="quick-copy">
          <text>{{ entry.title }}</text>
          <small>{{ entry.sub }}</small>
        </view>
      </button>
    </view>

    <view class="recent-head">
      <SectionTitle title="最近成品" />
      <button class="section-extra recent-more" hover-class="tap" @tap="goRecords">查看全部 ›</button>
    </view>
    <view v-if="recentRecords.length" class="recent-grid">
      <view v-for="record in recentRecords" :key="record.id" class="recent card" @tap="viewDish(record.dish.id)">
        <image :src="record.photos[0] || record.dish.coverImage" mode="aspectFill" />
        <view>
          <text class="recent-name line-clamp-1">{{ record.dish.name }} {{ record.dish.emoji }}</text>
          <text class="recent-date">{{ record.finishedAt.slice(0, 10) }}</text>
          <text class="recent-score">★ {{ record.rating?.overallScore || record.dish.rating }}</text>
        </view>
        <text class="arrow">›</text>
      </view>
    </view>
    <view v-else class="recent-empty card" @tap="goRecords">
      <image :src="icons.history" mode="aspectFit" />
      <view>
        <text>还没有最近成品</text>
        <small>完成一次做菜后会显示在这里</small>
      </view>
      <text class="arrow">›</text>
    </view>

    <BottomTabbar active="mine" />
  </AppPage>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppPage from '@/components/AppPage.vue'
import BottomTabbar from '@/components/BottomTabbar.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import { icons } from '@/data/assets'
import { useKitchenStore } from '@/stores/kitchen'

const store = useKitchenStore()

onShow(() => {
  store.hydrate()
  if (!store.user) uni.reLaunch({ url: '/pages/login/index' })
  else store.refreshSessionData()
})

const recentRecords = computed(() => store.historyRecords.slice(0, 4))
const displayName = computed(() => store.user?.nickname || '小厨房')
const averageRatingText = computed(() => `${store.averageRating.toFixed(1)} 分`)

const quickEntries = computed(() => [
  { title: '我的菜品', sub: '查看和管理自建菜品', icon: icons.cookbook, tap: () => uni.navigateTo({ url: '/pages/my-dishes/index' }) },
  { title: '我的收藏', sub: '收藏的美味菜谱', icon: icons.heart, tap: () => uni.navigateTo({ url: '/pages/favorite-dishes/index' }) },
  { title: '我已学会', sub: '查看学会时间线', icon: icons.check, tap: () => uni.navigateTo({ url: '/pages/learned-dishes/index' }) },
  { title: '历史记录', sub: '查看烹饪记录', icon: icons.history, tap: () => uni.navigateTo({ url: '/pages/records/index' }) },
  { title: '评分记录', sub: '我的评分汇总', icon: icons.star, tap: () => uni.navigateTo({ url: '/pages/rating-list/index' }) },
  { title: '新增菜品', sub: '记录新菜谱', icon: icons.plus, tap: () => uni.navigateTo({ url: '/pages/dish-form/index' }) }
])

function goRecords() {
  uni.navigateTo({ url: '/pages/records/index' })
}

function viewDish(id: string) {
  uni.navigateTo({ url: `/pages/dish-detail/index?id=${id}` })
}

function notify() {
  uni.showToast({ title: '暂无新提醒', icon: 'none' })
}

function openSettings() {
  uni.navigateTo({ url: '/pages/settings/index' })
}
</script>

<style scoped lang="scss">
.mine-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 30rpx 0 28rpx;
}

.mine-head .title-xl {
  position: relative;
  font-size: 52rpx;
}

.mine-head .title-xl::after {
  content: '';
  position: absolute;
  left: 8rpx;
  bottom: -14rpx;
  width: 54rpx;
  height: 10rpx;
  border-radius: 999rpx;
  background: $primary;
}

.head-icons {
  display: flex;
  gap: 18rpx;
}

.icon-btn {
  width: 58rpx;
  height: 58rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 20rpx;
  background: rgba(255, 249, 244, 0.82);
  line-height: 1;
}

.icon-btn::after {
  border: 0;
}

.head-icons image {
  width: 48rpx;
  height: 48rpx;
}

.profile {
  position: relative;
  overflow: hidden;
  padding: 28rpx 28rpx 0;
  background:
    radial-gradient(circle at 88% 18%, rgba(255, 158, 82, 0.14), transparent 180rpx),
    linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 251, 246, 0.98) 100%);
}

.profile-top {
  display: grid;
  grid-template-columns: 118rpx minmax(0, 1fr) 118rpx;
  gap: 18rpx;
  align-items: center;
}

.avatar {
  width: 118rpx;
  height: 118rpx;
  border-radius: 50%;
}

.profile-copy {
  min-width: 0;
}

.nickname {
  display: block;
  color: $text-main;
  font-size: 36rpx;
  font-weight: 900;
  line-height: 1.1;
}

.profile-sub {
  display: block;
  margin-top: 10rpx;
  color: $text-sub;
  font-size: 25rpx;
}

.profile-illustration {
  height: 118rpx;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.profile-pot {
  width: 104rpx;
  height: 92rpx;
  opacity: 0.92;
}

.stats {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 24rpx;
  padding: 22rpx 0 28rpx;
  border-top: 1rpx solid rgba(236, 225, 215, 0.92);
}

.stat-item {
  min-height: 144rpx;
  display: grid;
  align-content: center;
  justify-items: center;
  flex-direction: column;
  gap: 10rpx;
  padding: 0 12rpx;
  text-align: center;
}

.stat-item:not(:last-child) {
  border-right: 1rpx solid $border;
}

.stats image {
  width: 42rpx;
  height: 42rpx;
}

.stats text {
  color: $text-sub;
  font-size: 22rpx;
  line-height: 1.35;
}

.stats strong {
  color: $text-main;
  font-size: 32rpx;
  line-height: 1.1;
}

.quick-grid,
.recent-grid {
  display: grid;
  gap: 18rpx;
}

.quick-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-auto-rows: 216rpx;
  margin-top: 30rpx;
  align-items: stretch;
}

.recent-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.quick-card,
.quick-grid .quick-card,
.quick-grid uni-button.quick-card {
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 216rpx;
  display: grid;
  grid-template-rows: 62rpx minmax(0, 1fr);
  align-content: stretch;
  justify-items: stretch;
  margin: 0;
  padding: 22rpx 20rpx 20rpx;
  box-sizing: border-box;
  border: 1rpx solid $border;
  border-radius: 26rpx;
  background: linear-gradient(145deg, #fff, #fff8ef);
  box-shadow: $shadow-soft;
  text-align: left;
}

.quick-card::after,
.quick-grid .quick-card::after {
  border: 0;
}

.quick-icon-wrap {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}

.quick-card image {
  width: 62rpx;
  height: 62rpx;
  flex: 0 0 auto;
}

.quick-copy {
  width: 100%;
  min-width: 0;
  display: grid;
  grid-template-rows: 54rpx 60rpx;
  align-content: end;
}

.quick-card text {
  min-width: 0;
  height: 54rpx;
  display: flex;
  align-items: center;
  max-width: 100%;
  color: $text-main;
  font-size: 25rpx;
  font-weight: 900;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.quick-card small {
  width: 100%;
  min-height: 60rpx;
  margin-top: 0;
  color: $text-sub;
  font-size: 21rpx;
  overflow: hidden;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  white-space: normal;
}

.recent-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16rpx;
  margin-top: 12rpx;
}

.recent-head :deep(.section-title) {
  margin: 36rpx 0 18rpx;
}

.recent-more {
  min-width: 188rpx;
  height: 68rpx;
  margin-bottom: 6rpx;
  border-radius: 20rpx;
  font-size: 26rpx;
}

.recent {
  display: grid;
  grid-template-columns: 96rpx minmax(0, 1fr) 18rpx;
  gap: 14rpx;
  align-items: center;
  min-width: 0;
  overflow: hidden;
  padding: 16rpx;
}

.recent image {
  width: 96rpx;
  height: 76rpx;
  border-radius: 16rpx;
}

.recent-name,
.recent-date,
.recent-score {
  display: block;
}

.recent-name {
  color: $text-main;
  font-size: 25rpx;
  font-weight: 900;
}

.recent-date {
  margin-top: 8rpx;
  color: $text-sub;
  font-size: 23rpx;
}

.recent-score {
  margin-top: 6rpx;
  color: $warning;
  font-size: 24rpx;
}

.recent-empty {
  display: grid;
  grid-template-columns: 72rpx minmax(0, 1fr) 24rpx;
  gap: 18rpx;
  align-items: center;
  min-height: 142rpx;
  padding: 26rpx 24rpx;
}

.recent-empty image {
  width: 60rpx;
  height: 60rpx;
}

.recent-empty text {
  display: block;
  color: $text-main;
  font-size: 28rpx;
  font-weight: 900;
}

.recent-empty small {
  display: block;
  margin-top: 8rpx;
  color: $text-sub;
  font-size: 23rpx;
}

.arrow {
  color: #b3a79f;
  font-size: 40rpx;
}
</style>
