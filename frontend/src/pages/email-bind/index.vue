<template>
  <AppPage no-tab>
    <AppNavbar title="绑定邮箱" subtitle="给微信账号补充邮箱登录方式" back />

    <view class="hero card">
      <view class="hero-copy">
        <text class="eyebrow">Account Bind</text>
        <text class="hero-title">{{ displayName }}</text>
        <text class="hero-sub">{{ bindHint }}</text>
        <view class="hero-tags">
          <text class="pill">{{ modeLabel }}</text>
          <text class="pill green">不会影响微信登录</text>
        </view>
      </view>
      <UserAvatar class="hero-avatar" :src="store.user?.avatarUrl || icons.avatar" />
    </view>

    <view class="mode-panel card">
      <button :class="['mode-chip', { active: mode === 'existing' }]" hover-class="tap" @tap="mode = 'existing'">
        <text class="mode-title">绑定已有邮箱</text>
        <text class="mode-desc">如果这个邮箱以前注册过，用原密码完成合并</text>
      </button>
      <button :class="['mode-chip', { active: mode === 'new' }]" hover-class="tap" @tap="mode = 'new'">
        <text class="mode-title">新建邮箱登录</text>
        <text class="mode-desc">如果这个邮箱没注册过，直接给当前微信账号新增邮箱密码</text>
      </button>
    </view>

    <view class="form card">
      <view class="field">
        <text class="label">邮箱</text>
        <input v-model.trim="email" type="text" placeholder="name@example.com" />
      </view>
      <view class="field">
        <text class="label">{{ mode === 'existing' ? '原密码' : '设置密码' }}</text>
        <input v-model="password" password maxlength="32" :placeholder="mode === 'existing' ? '输入这个邮箱原来的登录密码' : '至少 6 位，用于后续邮箱登录'" />
      </view>
      <view v-if="mode === 'new'" class="field">
        <text class="label">确认密码</text>
        <input v-model="confirmPassword" password maxlength="32" placeholder="请再次输入密码" />
      </view>
    </view>

    <view class="helper card">
      <text class="helper-title">{{ mode === 'existing' ? '合并说明' : '创建说明' }}</text>
      <text class="helper-copy">{{ helperCopy }}</text>
    </view>

    <view v-if="mode === 'existing'" class="warning card">
      <text class="warning-title">合并前确认</text>
      <text class="warning-copy">如果这个邮箱下已经有菜谱、菜单或做菜记录，当前微信账号的数据会一并迁移到该邮箱账号下，迁移后仍可继续使用微信登录。</text>
      <button :class="['confirm-chip', { active: mergeConfirmed }]" hover-class="tap" @tap="mergeConfirmed = !mergeConfirmed">
        <text>{{ mergeConfirmed ? '已确认合并现有数据' : '点击确认我已理解合并影响' }}</text>
      </button>
    </view>

    <button class="primary-btn submit" hover-class="tap" @tap="submit">
      {{ submitting ? '绑定中...' : mode === 'existing' ? '确认合并并绑定' : '确认创建并绑定' }}
    </button>
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

const store = useKitchenStore()
const mode = ref<'existing' | 'new'>('existing')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const mergeConfirmed = ref(false)
const submitting = ref(false)

onShow(() => {
  store.hydrate()
  if (!store.user) {
    uni.reLaunch({ url: '/pages/login/index' })
    return
  }
  if (!store.user.wechatOpenId) {
    uni.showToast({ title: '当前不是微信登录账号', icon: 'none' })
    uni.navigateBack()
    return
  }
  if (store.user.email) {
    uni.showToast({ title: '当前账号已绑定邮箱', icon: 'none' })
    uni.navigateBack()
  }
})

const displayName = computed(() => store.user?.nickname || '微信用户')
const bindHint = computed(() => (store.user?.email ? store.user.email : '绑定后可同时使用邮箱密码和微信登录'))
const modeLabel = computed(() => (mode.value === 'existing' ? '已有邮箱合并' : '新增邮箱登录'))
const helperCopy = computed(() =>
  mode.value === 'existing'
    ? '输入已经注册过的邮箱和原密码，系统会把当前微信账号的数据合并到该邮箱账号下。微信登录方式会继续保留。'
    : '输入一个未注册的新邮箱，并设置后续登录密码。绑定完成后，这个微信账号可以同时用邮箱密码和微信登录。'
)

async function submit() {
  const nextEmail = email.value.trim()
  if (!nextEmail) {
    uni.showToast({ title: '请输入邮箱', icon: 'none' })
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) {
    uni.showToast({ title: '邮箱格式不正确', icon: 'none' })
    return
  }
  if (password.value.length < 6) {
    uni.showToast({ title: '密码至少 6 位', icon: 'none' })
    return
  }
  if (mode.value === 'new' && password.value !== confirmPassword.value) {
    uni.showToast({ title: '两次输入的密码不一致', icon: 'none' })
    return
  }
  if (mode.value === 'existing' && !mergeConfirmed.value) {
    uni.showToast({ title: '请先确认合并影响', icon: 'none' })
    return
  }

  submitting.value = true
  try {
    await store.bindEmail(nextEmail, password.value)
    uni.showToast({ title: '邮箱绑定成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 400)
  } catch {
    uni.showToast({ title: store.apiError || '绑定失败', icon: 'none' })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 136rpx;
  gap: 20rpx;
  align-items: center;
  padding: 28rpx;
  background:
    radial-gradient(circle at top right, rgba(255, 148, 62, 0.16), transparent 180rpx),
    linear-gradient(145deg, #fffdfb 0%, #fff8f1 100%);
}

.hero-copy {
  min-width: 0;
}

.eyebrow,
.hero-title,
.hero-sub {
  display: block;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 18rpx;
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
  font-size: 40rpx;
  font-weight: 900;
}

.hero-sub {
  margin-top: 10rpx;
  color: $text-sub;
  font-size: 24rpx;
  line-height: 1.5;
}

.hero-avatar {
  width: 136rpx;
  height: 136rpx;
  border-radius: 30rpx;
  border: 10rpx solid rgba(255, 255, 255, 0.72);
  box-shadow: 0 14rpx 28rpx rgba(72, 40, 18, 0.12);
}

.mode-panel,
.form,
.helper {
  margin-top: 22rpx;
}

.mode-panel {
  display: grid;
  gap: 14rpx;
  padding: 18rpx;
}

.mode-chip {
  display: block;
  margin: 0;
  padding: 22rpx 24rpx;
  border: 1rpx solid #f0e3d8;
  border-radius: 22rpx;
  background: linear-gradient(180deg, #fffdfa 0%, #fff7f0 100%);
  text-align: left;
}

.mode-chip::after,
.submit::after {
  border: 0;
}

.mode-chip.active {
  border-color: rgba(255, 132, 48, 0.34);
  background:
    radial-gradient(circle at top right, rgba(255, 144, 65, 0.14), transparent 130rpx),
    linear-gradient(180deg, #fffaf5 0%, #fff1e7 100%);
  box-shadow: 0 14rpx 24rpx rgba(255, 123, 37, 0.08);
}

.mode-title,
.mode-desc {
  display: block;
}

.mode-title {
  color: $text-main;
  font-size: 28rpx;
  font-weight: 900;
}

.mode-desc {
  margin-top: 10rpx;
  color: $text-sub;
  font-size: 23rpx;
  line-height: 1.5;
}

.form,
.helper {
  padding: 0 24rpx;
}

.field {
  min-height: 118rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 14rpx;
  border-bottom: 1rpx solid #f0e7de;
}

.field:last-child {
  border-bottom: 0;
}

.label {
  color: $text-main;
  font-size: 28rpx;
  font-weight: 900;
}

.field input {
  height: 64rpx;
  color: $text-sub;
  font-size: 26rpx;
}

.helper {
  padding-top: 24rpx;
  padding-bottom: 24rpx;
}

.helper-title,
.helper-copy {
  display: block;
}

.helper-title {
  color: $text-main;
  font-size: 28rpx;
  font-weight: 900;
}

.helper-copy {
  margin-top: 12rpx;
  color: $text-sub;
  font-size: 24rpx;
  line-height: 1.6;
}

.warning {
  margin-top: 22rpx;
  padding: 24rpx;
  background:
    radial-gradient(circle at top right, rgba(255, 173, 62, 0.14), transparent 150rpx),
    linear-gradient(180deg, #fffbf7 0%, #fff5ea 100%);
}

.warning-title,
.warning-copy {
  display: block;
}

.warning-title {
  color: $text-main;
  font-size: 28rpx;
  font-weight: 900;
}

.warning-copy {
  margin-top: 10rpx;
  color: $text-sub;
  font-size: 24rpx;
  line-height: 1.6;
}

.confirm-chip {
  min-height: 68rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 18rpx;
  padding: 0 24rpx;
  border: 1rpx solid rgba(255, 145, 49, 0.2);
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.72);
  color: $primary;
  font-size: 24rpx;
  font-weight: 800;
}

.confirm-chip::after {
  border: 0;
}

.confirm-chip.active {
  background: linear-gradient(135deg, rgba(255, 155, 74, 0.16), rgba(255, 111, 22, 0.12));
  border-color: rgba(255, 132, 48, 0.3);
}

.submit {
  margin-top: 26rpx;
}
</style>
