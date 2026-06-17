<template>
  <AppPage no-tab>
    <AppNavbar title="设置" back />

    <view class="hero card">
      <view class="hero-copy">
        <text class="eyebrow">Kitchen Profile</text>
        <text class="hero-title">{{ displayName }}</text>
        <text class="hero-sub">{{ displayEmail }}</text>
        <view class="hero-tags">
          <text class="pill">{{ roleLabel }}</text>
        </view>
      </view>
      <button class="hero-avatar" hover-class="tap" @tap="goEditProfile">
        <UserAvatar class="hero-art" :src="store.user?.avatarUrl || icons.avatar" />
        <text>编辑</text>
      </button>
    </view>

    <view class="summary-grid">
      <view class="summary-box card">
        <text class="summary-label">我的菜品</text>
        <text class="summary-value">{{ store.myDishCount }} 道</text>
      </view>
      <view class="summary-box card">
        <text class="summary-label">今日菜单</text>
        <text class="summary-value">{{ store.menuDishCount }} 道</text>
      </view>
      <view class="summary-box card accent">
        <text class="summary-label">做菜记录</text>
        <text class="summary-value">{{ store.myRecordCount }} 次</text>
      </view>
      <view class="summary-box card accent">
        <text class="summary-label">平均评分</text>
        <text class="summary-value">{{ averageRatingText }}</text>
      </view>
    </view>

    <view class="section card">
      <view class="section-head">
        <text class="section-title">账号与资料</text>
      </view>
      <button class="setting-row" hover-class="tap" @tap="goEditProfile">
        <view class="setting-icon">
          <image :src="icons.people" mode="aspectFit" />
        </view>
        <view class="setting-copy">
          <text class="setting-title">个人资料</text>
        </view>
        <view class="setting-meta">
          <text class="setting-value">{{ displayName }}</text>
          <text class="setting-arrow">›</text>
        </view>
      </button>
      <button v-if="canBindEmail" class="setting-row" hover-class="tap" @tap="goBindEmail">
        <view class="setting-icon">
          <image :src="icons.bell" mode="aspectFit" />
        </view>
        <view class="setting-copy">
          <text class="setting-title">绑定邮箱</text>
        </view>
        <view class="setting-meta">
          <text class="setting-value">去绑定</text>
          <text class="setting-arrow">›</text>
        </view>
      </button>
      <view class="setting-row static">
        <view class="setting-icon">
          <image :src="icons.bell" mode="aspectFit" />
        </view>
        <view class="setting-copy">
          <text class="setting-title">登录方式</text>
        </view>
        <view class="setting-meta">
          <text class="setting-value">{{ loginMethodValue }}</text>
        </view>
      </view>
      <view class="setting-row static">
        <view class="setting-icon">
          <image :src="icons.star" mode="aspectFit" />
        </view>
        <view class="setting-copy">
          <text class="setting-title">账号角色</text>
        </view>
        <view class="setting-meta">
          <text class="setting-value">{{ roleLabel }}</text>
        </view>
      </view>
      <button v-if="isWechatRuntime" class="setting-row" hover-class="tap" @tap="openPrivacyGuide">
        <view class="setting-icon">
          <image :src="icons.help" mode="aspectFit" />
        </view>
        <view class="setting-copy">
          <text class="setting-title">隐私指引</text>
        </view>
        <view class="setting-meta">
          <text class="setting-value">{{ privacyGuideText }}</text>
          <text class="setting-arrow">›</text>
        </view>
      </button>
    </view>

    <view class="section card">
      <view class="section-head">
        <text class="section-title">数据与记录</text>
      </view>
      <button class="setting-row" hover-class="tap" @tap="refreshAll">
        <view class="setting-icon warm">
          <image :src="icons.database" mode="aspectFit" />
        </view>
        <view class="setting-copy">
          <text class="setting-title">刷新数据</text>
        </view>
        <view class="setting-meta">
          <text class="setting-value">{{ refreshing ? '刷新中' : '立即刷新' }}</text>
          <text class="setting-arrow">›</text>
        </view>
      </button>
      <button class="setting-row" hover-class="tap" @tap="goRecords">
        <view class="setting-icon warm">
          <image :src="icons.history" mode="aspectFit" />
        </view>
        <view class="setting-copy">
          <text class="setting-title">历史记录</text>
        </view>
        <view class="setting-meta">
          <text class="setting-value">{{ store.myRecordCount }} 条</text>
          <text class="setting-arrow">›</text>
        </view>
      </button>
      <button class="setting-row" hover-class="tap" @tap="goRatings">
        <view class="setting-icon warm">
          <image :src="icons.help" mode="aspectFit" />
        </view>
        <view class="setting-copy">
          <text class="setting-title">评分记录</text>
        </view>
        <view class="setting-meta">
          <text class="setting-value">{{ store.ratings.length }} 条</text>
          <text class="setting-arrow">›</text>
        </view>
      </button>
    </view>

    <button class="logout-btn" hover-class="tap" @tap="logout">退出登录</button>
  </AppPage>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppNavbar from '@/components/AppNavbar.vue'
import AppPage from '@/components/AppPage.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import { icons } from '@/data/assets'
import { useKitchenStore } from '@/stores/kitchen'
import { openWechatPrivacyContract, syncWechatPrivacySetting, wechatPrivacyState } from '@/utils/wechat-privacy'

const store = useKitchenStore()
const refreshing = ref(false)
const isWechatRuntime = typeof globalThis !== 'undefined' && 'wx' in globalThis

onShow(async () => {
  store.hydrate()
  if (!store.user) {
    uni.reLaunch({ url: '/pages/login/index' })
    return
  }
  if (isWechatRuntime) {
    try {
      await syncWechatPrivacySetting(false)
    } catch {
      // Ignore platform read failures and keep page usable.
    }
  }
  await refreshAll(false)
})

const displayName = computed(() => store.user?.nickname || '小厨房')
const displayEmail = computed(() => store.user?.email || '微信登录账号')
const canBindEmail = computed(() => Boolean(store.user?.wechatOpenId && !store.user?.email))
const loginMethodValue = computed(() => {
  if (store.user?.email && store.user?.wechatOpenId) return '邮箱 + 微信'
  if (store.user?.email) return '仅邮箱'
  if (store.user?.wechatOpenId) return '仅微信'
  return '未识别'
})
const roleLabel = computed(() => (store.user?.role === 'admin' ? '管理员账号' : '普通账号'))
const averageRatingText = computed(() => `${store.averageRating.toFixed(1)} 分`)
const privacyGuideText = computed(() => (wechatPrivacyState.needAuthorization ? '待确认' : '已开启'))

async function refreshAll(showToast = true) {
  if (!store.token || refreshing.value) return
  refreshing.value = true
  try {
    await store.refreshSessionData()
    if (showToast) uni.showToast({ title: '数据已刷新', icon: 'success' })
  } catch {
    if (showToast) uni.showToast({ title: store.apiError || '刷新失败', icon: 'none' })
  } finally {
    refreshing.value = false
  }
}

function goEditProfile() {
  uni.navigateTo({ url: '/pages/profile-edit/index' })
}

function goBindEmail() {
  uni.navigateTo({ url: '/pages/email-bind/index' })
}

function goRecords() {
  uni.navigateTo({ url: '/pages/records/index' })
}

function goRatings() {
  uni.navigateTo({ url: '/pages/rating-list/index' })
}

async function openPrivacyGuide() {
  try {
    await syncWechatPrivacySetting(true)
    await openWechatPrivacyContract()
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '打开失败', icon: 'none' })
  }
}

function logout() {
  store.logout()
  uni.reLaunch({ url: '/pages/login/index' })
}
</script>

<style scoped lang="scss">
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 182rpx;
  gap: 24rpx;
  align-items: center;
  overflow: hidden;
  padding: 30rpx 28rpx;
  background:
    radial-gradient(circle at top right, rgba(255, 140, 56, 0.16), transparent 180rpx),
    linear-gradient(145deg, #fffdfb 0%, #fff7ef 100%);
}

.hero-copy {
  min-width: 0;
}

.eyebrow,
.hero-title,
.hero-sub {
  display: block;
}

.eyebrow {
  color: $primary;
  font-size: 22rpx;
  font-weight: 800;
  letter-spacing: 2rpx;
  text-transform: uppercase;
}

.hero-title {
  margin-top: 14rpx;
  color: $text-main;
  font-size: 44rpx;
  font-weight: 900;
}

.hero-sub {
  margin-top: 10rpx;
  color: $text-sub;
  font-size: 24rpx;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 22rpx;
}

.hero-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: $primary;
  font-size: 22rpx;
  font-weight: 800;
}

.hero-avatar::after,
.setting-row::after,
.logout-btn::after {
  border: 0;
}

.hero-art {
  width: 168rpx;
  height: 168rpx;
  border: 10rpx solid rgba(255, 255, 255, 0.72);
  border-radius: 34rpx;
  box-shadow: 0 16rpx 36rpx rgba(82, 48, 24, 0.12);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18rpx;
  margin-top: 22rpx;
}

.summary-box {
  min-height: 156rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 24rpx;
  background: linear-gradient(180deg, #fffdfa 0%, #fff9f2 100%);
}

.summary-box.accent {
  background: linear-gradient(180deg, #fff8ef 0%, #fff2e7 100%);
}

.summary-label,
.summary-value {
  display: block;
}

.summary-label {
  color: $text-sub;
  font-size: 23rpx;
}

.summary-value {
  margin-top: 12rpx;
  color: $text-main;
  font-size: 38rpx;
  font-weight: 900;
}

.section {
  margin-top: 22rpx;
  overflow: hidden;
  padding: 0 24rpx 12rpx;
}

.section-head {
  padding: 26rpx 6rpx 10rpx;
}

.section-title {
  display: block;
  color: $text-main;
  font-size: 32rpx;
  font-weight: 900;
}

.setting-row {
  min-height: 104rpx;
  display: grid;
  grid-template-columns: 72rpx minmax(0, 1fr) auto;
  gap: 18rpx;
  align-items: center;
  margin: 0;
  padding: 18rpx 0;
  border: 0;
  border-bottom: 1rpx solid #f2e7de;
  border-radius: 0;
  background: transparent;
  text-align: left;
}

.setting-row.static {
  cursor: default;
}

.setting-row:last-child {
  border-bottom: 0;
}

.setting-icon {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 22rpx;
  background: #eef7f0;
}

.setting-icon.warm {
  background: #fff2e9;
}

.setting-icon image {
  width: 44rpx;
  height: 44rpx;
}

.setting-copy {
  min-width: 0;
}

.setting-title,
.setting-value {
  display: block;
}

.setting-title {
  color: $text-main;
  font-size: 28rpx;
  font-weight: 900;
}

.setting-meta {
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding-left: 12rpx;
}

.setting-value {
  max-width: 240rpx;
  overflow: hidden;
  color: $primary;
  font-size: 23rpx;
  font-weight: 800;
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.setting-arrow {
  color: #b6a9a0;
  font-size: 38rpx;
  line-height: 1;
}

.logout-btn {
  height: 84rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 24rpx;
  padding: 0 24rpx;
  border-radius: 26rpx;
  background: linear-gradient(135deg, #ffe9dc 0%, #fff2e9 100%);
  color: $primary;
  font-size: 30rpx;
  font-weight: 900;
  line-height: 1.1;
  text-align: center;
  box-shadow: 0 12rpx 24rpx rgba(255, 123, 37, 0.12);
}
</style>
