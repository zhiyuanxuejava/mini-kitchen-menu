<template>
  <AppPage no-tab>
    <view class="login-hero">
      <image class="logo" :src="icons.pot" mode="aspectFit" />
      <text class="brand">注册账号</text>
      <text class="slogan">注册后将自动登录进入厨房</text>
    </view>

    <view class="login-card card">
      <view class="field">
        <text>邮箱</text>
        <input v-model="email" type="text" placeholder="name@example.com" />
      </view>
      <view class="field">
        <text>密码</text>
        <input v-model="password" password placeholder="至少 6 位" maxlength="32" />
      </view>
      <view class="field">
        <text>确认密码</text>
        <input v-model="confirmPassword" password placeholder="再次输入密码" maxlength="32" />
      </view>

      <button class="primary-btn submit" hover-class="tap" :disabled="submitting" @tap="submit">
        {{ submitting ? '注册中...' : '注册并进入厨房' }}
      </button>

      <button class="link-btn" hover-class="tap" @tap="goLogin">已有账号？去登录</button>

      <text v-if="store.apiError" class="error-text">{{ store.apiError }}</text>
    </view>
  </AppPage>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import AppPage from '@/components/AppPage.vue'
import { ApiError } from '@/api/kitchen'
import { icons } from '@/data/assets'
import { useKitchenStore } from '@/stores/kitchen'

const store = useKitchenStore()
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const submitting = ref(false)

onLoad((options) => {
  const queryEmail = options?.email
  if (typeof queryEmail === 'string' && queryEmail) {
    try {
      email.value = decodeURIComponent(queryEmail)
    } catch {
      email.value = queryEmail
    }
  }
})

onShow(() => {
  store.hydrate()
  if (!store.user) return
  if (store.needsWechatProfileCompletion()) {
    uni.redirectTo({ url: '/pages/profile-edit/index?onboarding=1' })
    return
  }
  uni.reLaunch({ url: '/pages/home/index' })
})

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
  if (password.value !== confirmPassword.value) {
    uni.showToast({ title: '两次输入的密码不一致', icon: 'none' })
    return
  }

  submitting.value = true
  try {
    await store.registerWithEmail(nextEmail, password.value)
    uni.reLaunch({ url: '/pages/home/index' })
  } catch (error) {
    if (error instanceof ApiError && error.code === 'EMAIL_ALREADY_REGISTERED') {
      uni.showModal({
        title: '该邮箱已注册',
        content: '是否直接前往登录？',
        confirmText: '去登录',
        cancelText: '取消',
        success: ({ confirm }) => {
          if (!confirm) return
          uni.redirectTo({
            url: `/pages/login/index?email=${encodeURIComponent(nextEmail)}`
          })
        }
      })
      return
    }
    uni.showToast({ title: store.apiError || '注册失败', icon: 'none' })
  } finally {
    submitting.value = false
  }
}

function goLogin() {
  const nextEmail = email.value.trim()
  const url = nextEmail
    ? `/pages/login/index?email=${encodeURIComponent(nextEmail)}`
    : '/pages/login/index'
  uni.redirectTo({ url })
}
</script>

<style scoped lang="scss">
.login-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 44rpx;
  text-align: center;
}

.logo {
  width: 190rpx;
  height: 190rpx;
}

.brand {
  margin-top: 8rpx;
  color: $text-main;
  font-size: 56rpx;
  font-weight: 900;
}

.slogan {
  width: 560rpx;
  margin-top: 18rpx;
  color: $text-sub;
  font-size: 27rpx;
  line-height: 1.5;
}

.login-card {
  margin-top: 58rpx;
  padding: 34rpx 30rpx 30rpx;
}

.field {
  margin-top: 26rpx;
}

.field text {
  display: block;
  margin-bottom: 12rpx;
  color: $text-main;
  font-size: 27rpx;
  font-weight: 800;
}

.field input {
  height: 82rpx;
  padding: 0 24rpx;
  border: 1rpx solid $border;
  border-radius: 22rpx;
  background: #fffdfb;
  color: $text-main;
  font-size: 28rpx;
}

.submit {
  margin-top: 34rpx;
}

.link-btn {
  height: 70rpx;
  margin-top: 18rpx;
  background: transparent;
  color: $primary;
  font-size: 26rpx;
  font-weight: 700;
}

.link-btn::after {
  border: 0;
}

.error-text {
  display: block;
  margin-top: 18rpx;
  color: #d34b2f;
  font-size: 24rpx;
  text-align: center;
}

@media (min-width: 431px) {
  .login-hero {
    padding-top: 18rpx;
  }

  .login-card {
    margin-top: 44rpx;
  }
}
</style>
