<template>
  <AppPage>
    <view class="mine-head">
      <text class="title-xl">我的</text>
      <view class="head-icons">
        <image :src="icons.bell" mode="aspectFit" />
        <image :src="icons.settings" mode="aspectFit" />
      </view>
    </view>

    <view class="profile card">
      <image class="avatar" :src="store.user?.avatarUrl || icons.avatar" mode="aspectFill" />
      <view class="profile-copy">
        <text class="nickname">小厨房</text>
        <text>记录每一次下厨</text>
      </view>
      <image class="profile-pot" :src="icons.pot" mode="aspectFit" />
      <view class="stats">
        <view>
          <image :src="icons.cookbook" mode="aspectFit" />
          <text>我的菜品</text>
          <strong>28 道</strong>
        </view>
        <view>
          <image :src="icons.clockOrange" mode="aspectFit" />
          <text>做菜记录</text>
          <strong>46 次</strong>
        </view>
        <view>
          <image :src="icons.star" mode="aspectFit" />
          <text>平均评分</text>
          <strong>4.6 分</strong>
        </view>
      </view>
    </view>

    <view class="quick-grid">
      <button v-for="entry in quickEntries" :key="entry.title" class="quick-card" hover-class="tap" @tap="entry.tap">
        <image :src="entry.icon" mode="aspectFit" />
        <text>{{ entry.title }}</text>
        <small>{{ entry.sub }}</small>
      </button>
    </view>

    <SectionTitle title="最近成品">
      <button class="section-extra" hover-class="tap" @tap="goRecords">查看全部 ›</button>
    </SectionTitle>
    <view class="recent-grid">
      <view v-for="record in store.historyRecords.slice(0, 2)" :key="record.id" class="recent card">
        <image :src="record.photos[0] || record.dish.coverImage" mode="aspectFill" />
        <view>
          <text class="recent-name line-clamp-1">{{ record.dish.name }} {{ record.dish.emoji }}</text>
          <text class="recent-date">{{ record.finishedAt.slice(0, 10) }}</text>
          <text class="recent-score">★ {{ record.rating?.overallScore || record.dish.rating }}</text>
        </view>
        <text class="arrow">›</text>
      </view>
    </view>

    <view class="settings card">
      <button v-for="item in settings" :key="item.title" hover-class="tap" @tap="item.tap">
        <image :src="item.icon" mode="aspectFit" />
        <text>{{ item.title }}</text>
        <text class="arrow">›</text>
      </button>
    </view>

    <button class="logout" hover-class="tap" @tap="logout">退出登录</button>
    <BottomTabbar active="mine" />
  </AppPage>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppPage from '@/components/AppPage.vue'
import BottomTabbar from '@/components/BottomTabbar.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import { icons } from '@/data/assets'
import { useKitchenStore } from '@/stores/kitchen'

const store = useKitchenStore()

onShow(() => {
  store.hydrate()
  if (!store.user) uni.reLaunch({ url: '/pages/login/index' })
})

const quickEntries = computed(() => [
  { title: '我的收藏', sub: '收藏的美味菜谱', icon: icons.heart, tap: () => uni.showToast({ title: '收藏入口已预留', icon: 'none' }) },
  { title: '历史记录', sub: '查看烹饪记录', icon: icons.history, tap: () => uni.navigateTo({ url: '/pages/records/index' }) },
  { title: '评分记录', sub: '我的评分汇总', icon: icons.star, tap: () => uni.navigateTo({ url: '/pages/rating-list/index' }) },
  { title: '新增菜品', sub: '记录新菜谱', icon: icons.plus, tap: () => uni.navigateTo({ url: '/pages/dish-form/index' }) }
])

const settings = [
  { title: '个人资料', icon: icons.people, tap: () => uni.showToast({ title: '个人资料入口已预留', icon: 'none' }) },
  { title: '数据管理', icon: icons.database, tap: () => uni.showToast({ title: '数据管理入口已预留', icon: 'none' }) },
  { title: '消息提醒', icon: icons.bell, tap: () => uni.showToast({ title: '提醒入口已预留', icon: 'none' }) },
  { title: '帮助与反馈', icon: icons.help, tap: () => uni.showToast({ title: '反馈入口已预留', icon: 'none' }) }
]

function goRecords() {
  uni.navigateTo({ url: '/pages/records/index' })
}

function logout() {
  store.logout()
  uni.reLaunch({ url: '/pages/login/index' })
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
  gap: 26rpx;
}

.head-icons image {
  width: 48rpx;
  height: 48rpx;
}

.profile {
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: 126rpx minmax(0, 1fr) 126rpx;
  gap: 16rpx;
  align-items: center;
  padding: 30rpx 28rpx 0;
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
}

.profile-copy text:last-child {
  display: block;
  margin-top: 12rpx;
  color: $text-sub;
  font-size: 27rpx;
}

.profile-pot {
  width: 126rpx;
  height: 108rpx;
}

.stats {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 24rpx;
  padding: 24rpx 0 30rpx;
}

.stats view {
  display: grid;
  grid-template-columns: 54rpx 1fr;
  column-gap: 12rpx;
  align-items: center;
  border-right: 1rpx solid $border;
}

.stats view:last-child {
  border-right: 0;
}

.stats image {
  grid-row: 1 / 3;
  width: 52rpx;
  height: 52rpx;
}

.stats text {
  color: $text-sub;
  font-size: 23rpx;
}

.stats strong {
  color: $text-main;
  font-size: 31rpx;
}

.quick-grid,
.recent-grid {
  display: grid;
  gap: 18rpx;
}

.quick-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: 34rpx;
}

.recent-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.quick-card {
  min-height: 166rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1rpx solid $border;
  border-radius: 26rpx;
  background: linear-gradient(145deg, #fff, #fff8ef);
  box-shadow: $shadow-soft;
}

.quick-card image {
  width: 66rpx;
  height: 66rpx;
}

.quick-card text {
  display: block;
  max-width: 100%;
  margin-top: 10rpx;
  color: $text-main;
  font-size: 24rpx;
  font-weight: 900;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.quick-card small {
  display: block;
  max-width: 100%;
  margin-top: 8rpx;
  color: $text-sub;
  font-size: 20rpx;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.settings {
  margin-top: 34rpx;
  padding: 10rpx 26rpx;
}

.settings button {
  height: 94rpx;
  display: grid;
  grid-template-columns: 54rpx 1fr 30rpx;
  align-items: center;
  gap: 18rpx;
  border-bottom: 1rpx solid #f0e7e1;
  color: $text-main;
  font-size: 30rpx;
  text-align: left;
}

.settings button:last-child {
  border-bottom: 0;
}

.settings image {
  width: 46rpx;
  height: 46rpx;
}

.arrow {
  color: #b3a79f;
  font-size: 40rpx;
}

.logout {
  height: 72rpx;
  margin: 28rpx 0 4rpx;
  border-radius: 22rpx;
  background: #fff3ed;
  color: $primary;
  font-size: 28rpx;
  font-weight: 800;
}
</style>
