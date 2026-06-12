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

    <view v-if="showSettings" class="settings-overlay" @tap="closeSettings">
      <view class="settings-panel" @tap.stop>
        <view class="panel-head">
          <view>
            <text class="panel-title">设置</text>
            <text class="panel-sub">账号、数据与消息管理</text>
          </view>
          <button class="panel-close" hover-class="tap" @tap="closeSettings">×</button>
        </view>

        <view class="settings-list">
          <button v-for="item in settings" :key="item.title" class="setting-row" hover-class="tap" @tap="runSetting(item)">
            <image :src="item.icon" mode="aspectFit" />
            <text>{{ item.title }}</text>
            <text class="arrow">›</text>
          </button>
        </view>

        <button class="logout" hover-class="tap" @tap="logout">退出登录</button>
      </view>
    </view>
    <BottomTabbar active="mine" />
  </AppPage>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppPage from '@/components/AppPage.vue'
import BottomTabbar from '@/components/BottomTabbar.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import { icons } from '@/data/assets'
import { useKitchenStore } from '@/stores/kitchen'

const store = useKitchenStore()
const showSettings = ref(false)

onShow(() => {
  store.hydrate()
  if (!store.user) uni.reLaunch({ url: '/pages/login/index' })
})

const recentRecords = computed(() => store.historyRecords.slice(0, 4))

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

function viewDish(id: string) {
  uni.navigateTo({ url: `/pages/dish-detail/index?id=${id}` })
}

function notify() {
  uni.showToast({ title: '暂无新提醒', icon: 'none' })
}

function openSettings() {
  showSettings.value = true
}

function closeSettings() {
  showSettings.value = false
}

function runSetting(item: (typeof settings)[number]) {
  showSettings.value = false
  item.tap()
}

function logout() {
  store.logout()
  showSettings.value = false
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

.icon-btn::after,
.panel-close::after,
.setting-row::after,
.logout::after {
  border: 0;
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

.recent-empty {
  display: grid;
  grid-template-columns: 72rpx minmax(0, 1fr) 24rpx;
  gap: 18rpx;
  align-items: center;
  padding: 26rpx;
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

.settings-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 60;
  display: grid;
  align-items: end;
  padding: 0 22rpx calc(22rpx + env(safe-area-inset-bottom));
  background: rgba(38, 28, 22, 0.34);
  backdrop-filter: blur(4rpx);
}

.settings-panel {
  width: 100%;
  box-sizing: border-box;
  padding: 28rpx;
  border: 1rpx solid rgba(255, 123, 37, 0.18);
  border-radius: 34rpx 34rpx 26rpx 26rpx;
  background: #fffdfb;
  box-shadow: 0 -16rpx 46rpx rgba(55, 34, 20, 0.18);
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
}

.panel-title,
.panel-sub {
  display: block;
}

.panel-title {
  color: $text-main;
  font-size: 36rpx;
  font-weight: 900;
}

.panel-sub {
  margin-top: 8rpx;
  color: $text-sub;
  font-size: 23rpx;
}

.panel-close {
  width: 64rpx;
  height: 64rpx;
  flex: 0 0 auto;
  margin: 0;
  padding: 0;
  border-radius: 50%;
  background: #fff3ed;
  color: $primary;
  font-size: 42rpx;
  font-weight: 300;
  line-height: 58rpx;
}

.settings-list {
  overflow: hidden;
  margin-top: 26rpx;
  border: 1rpx solid #f0e7e1;
  border-radius: 26rpx;
  background: #fffaf5;
}

.setting-row {
  height: 96rpx;
  display: grid;
  grid-template-columns: 54rpx minmax(0, 1fr) 30rpx;
  align-items: center;
  gap: 18rpx;
  margin: 0;
  padding: 0 22rpx;
  border: 0;
  border-bottom: 1rpx solid #f0e7e1;
  border-radius: 0;
  background: transparent;
  color: $text-main;
  font-size: 30rpx;
  line-height: 1;
  text-align: left;
}

.setting-row:last-child {
  border-bottom: 0;
}

.setting-row image {
  width: 46rpx;
  height: 46rpx;
}

.arrow {
  color: #b3a79f;
  font-size: 40rpx;
}

.logout {
  height: 72rpx;
  margin: 26rpx 0 0;
  border-radius: 22rpx;
  background: #fff3ed;
  color: $primary;
  font-size: 28rpx;
  font-weight: 800;
}
</style>
