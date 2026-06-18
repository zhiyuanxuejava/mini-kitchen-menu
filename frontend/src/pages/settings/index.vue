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
      <button class="setting-row" hover-class="tap" @tap="syncAllData">
        <view class="setting-icon warm">
          <image :src="icons.database" mode="aspectFit" />
        </view>
        <view class="setting-copy">
          <text class="setting-title">同步数据</text>
        </view>
        <view class="setting-meta">
          <text class="setting-value">{{ refreshing ? '同步中' : '立即同步' }}</text>
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
      <button class="setting-row danger-row" hover-class="tap" @tap="openReloginDialog">
        <view class="setting-icon danger">
          <image :src="icons.upload" mode="aspectFit" />
        </view>
        <view class="setting-copy">
          <text class="setting-title">清除缓存并重新登录</text>
        </view>
        <view class="setting-meta">
          <text class="setting-value danger-text">重新登录</text>
          <text class="setting-arrow">›</text>
        </view>
      </button>
      <view class="version-row">
        <text class="version-label">版本信息</text>
        <view class="version-line">
          <text class="version-current">当前版本 {{ localVersion }}</text>
          <text v-if="versionCheckState === 'latest'" class="version-pill latest">已是最新</text>
          <text v-else-if="versionCheckState === 'outdated'" class="version-pill outdated">有新版本</text>
          <text v-else-if="versionCheckState === 'checking'" class="version-pill checking">检测中</text>
          <text v-else class="version-pill unknown">无法检测</text>
        </view>
        <text class="version-meta">构建时间 {{ localBuildAtText }}</text>
        <view v-if="serverVersion && serverVersion !== localVersion" class="version-line">
          <text class="version-server">最新版本 {{ serverVersion }}</text>
          <button class="version-update-btn" hover-class="tap" @tap="goReloadToLatest">立即更新</button>
        </view>
      </view>
    </view>

    <view v-if="reloginDialogVisible" class="confirm-layer">
      <view class="confirm-mask" @tap="closeReloginDialog" />
      <view class="confirm-card card" @tap.stop>
        <view class="confirm-glow" />
        <view class="confirm-head">
          <view class="confirm-badge">
            <image :src="icons.upload" mode="aspectFit" />
          </view>
          <view class="confirm-copy">
            <text class="confirm-title">是否要清除缓存并重新登录？</text>
          </view>
        </view>

        <view class="confirm-actions">
          <button class="ghost-btn confirm-btn" hover-class="tap" @tap="closeReloginDialog">取消</button>
          <button class="primary-btn confirm-btn" hover-class="tap" :disabled="clearingCache" @tap="confirmClearCacheAndRelogin">
            {{ clearingCache ? '处理中...' : '确认' }}
          </button>
        </view>
      </view>
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
import {
  fetchLatestServerVersion,
  getLocalVersionInfo,
  reloadToLatestVersion
} from '@/utils/version-check'
import { openWechatPrivacyContract, syncWechatPrivacySetting, wechatPrivacyState } from '@/utils/wechat-privacy'

const store = useKitchenStore()
const refreshing = ref(false)
const reloginDialogVisible = ref(false)
const clearingCache = ref(false)
const isWechatRuntime = typeof globalThis !== 'undefined' && 'wx' in globalThis

const { version: localVersion, buildAt: localBuildAt } = getLocalVersionInfo()
const serverVersion = ref<string | null>(null)
const versionCheckState = ref<'idle' | 'checking' | 'latest' | 'outdated' | 'unknown'>('idle')

const localBuildAtText = computed(() => formatBuildAt(localBuildAt))

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
  void checkServerVersion()
})

async function checkServerVersion() {
  if (localVersion === 'unknown') {
    versionCheckState.value = 'unknown'
    return
  }
  versionCheckState.value = 'checking'
  const latest = await fetchLatestServerVersion()
  if (!latest) {
    versionCheckState.value = 'unknown'
    serverVersion.value = null
    return
  }
  serverVersion.value = latest
  versionCheckState.value = latest === localVersion ? 'latest' : 'outdated'
}

function formatBuildAt(value: string): string {
  if (!value || value === 'unknown') return '未知'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

async function goReloadToLatest() {
  try {
    await reloadToLatestVersion()
  } catch {
    uni.showToast({ title: '刷新失败，请手动刷新', icon: 'none' })
  }
}

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

async function syncAllData() {
  if (!store.token || refreshing.value) return
  refreshing.value = true
  try {
    const syncedDishCount = await store.syncSystemDishes()
    uni.showToast({ title: `已同步 ${syncedDishCount} 道菜品`, icon: 'success' })
  } catch {
    uni.showToast({ title: store.apiError || '同步失败', icon: 'none' })
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

function openReloginDialog() {
  reloginDialogVisible.value = true
}

function closeReloginDialog() {
  if (clearingCache.value) return
  reloginDialogVisible.value = false
}

async function confirmClearCacheAndRelogin() {
  if (clearingCache.value) return
  clearingCache.value = true
  try {
    await store.clearCacheAndForceRelogin()
  } catch (error) {
    clearingCache.value = false
    reloginDialogVisible.value = false
    uni.showToast({ title: error instanceof Error ? error.message : '处理失败', icon: 'none' })
  }
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

.danger-row {
  align-items: flex-start;
  padding-top: 22rpx;
  padding-bottom: 22rpx;
}

.setting-icon.danger {
  background: linear-gradient(180deg, #fff1e7 0%, #ffe7d7 100%);
}

.danger-text {
  color: #d34b2f;
}

.confirm-layer {
  position: fixed;
  inset: 0;
  z-index: 64;
}

.confirm-mask {
  position: absolute;
  inset: 0;
  background: rgba(48, 30, 20, 0.46);
  backdrop-filter: blur(8rpx);
}

.confirm-card {
  position: absolute;
  left: 50%;
  bottom: calc(30rpx + env(safe-area-inset-bottom));
  width: calc(100% - 56rpx);
  max-width: 404px;
  padding: 32rpx 28rpx 28rpx;
  overflow: hidden;
  background:
    radial-gradient(circle at 92% 8%, rgba(255, 154, 96, 0.2), transparent 190rpx),
    linear-gradient(180deg, #fffefc 0%, #fff7ef 100%);
  transform: translateX(-50%);
}

.confirm-glow {
  position: absolute;
  right: -28rpx;
  top: -26rpx;
  width: 196rpx;
  height: 196rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 167, 102, 0.2) 0%, rgba(255, 167, 102, 0) 72%);
}

.confirm-head {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 88rpx minmax(0, 1fr);
  gap: 18rpx;
  align-items: center;
}

.confirm-badge {
  width: 88rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 28rpx;
  background: rgba(255, 246, 237, 0.96);
}

.confirm-badge image {
  width: 46rpx;
  height: 46rpx;
}

.confirm-copy {
  min-width: 0;
}

.confirm-title,
.confirm-sub {
  display: block;
}

.confirm-title {
  color: $text-main;
  font-size: 32rpx;
  font-weight: 900;
  line-height: 1.35;
}

.confirm-actions {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
  margin-top: 22rpx;
}

.confirm-btn {
  width: 100%;
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

.version-row {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  padding: 22rpx 6rpx 18rpx;
  border-top: 1rpx solid #f2e7de;
}

.version-label {
  color: $text-sub;
  font-size: 22rpx;
  font-weight: 700;
  letter-spacing: 1rpx;
  text-transform: uppercase;
}

.version-line {
  display: flex;
  align-items: center;
  gap: 14rpx;
  margin-top: 4rpx;
}

.version-current,
.version-server {
  color: $text-main;
  font-size: 26rpx;
  font-weight: 800;
}

.version-server {
  color: $primary;
}

.version-meta {
  color: $text-sub;
  font-size: 22rpx;
}

.version-pill {
  padding: 4rpx 14rpx;
  border-radius: 999rpx;
  font-size: 20rpx;
  font-weight: 800;
}

.version-pill.latest {
  background: #e7f6ec;
  color: #2f8a4d;
}

.version-pill.outdated {
  background: #ffe9dc;
  color: #d25522;
}

.version-pill.checking {
  background: #eef1f5;
  color: #5d6b7a;
}

.version-pill.unknown {
  background: #f2ebe3;
  color: #8a7a6a;
}

.version-update-btn {
  height: 52rpx;
  margin: 0;
  padding: 0 22rpx;
  border: 0;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #ff8c38 0%, #ff7026 100%);
  color: #fff;
  font-size: 22rpx;
  font-weight: 800;
  line-height: 52rpx;
}

.version-update-btn::after {
  border: 0;
}
</style>
