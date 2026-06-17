<template>
  <AppPage no-tab>
    <view class="login-hero">
      <image class="logo" :src="icons.pot" mode="aspectFit" />
      <text class="brand">掌勺点菜</text>
      <text class="slogan">把想吃、会做、做得怎样串成一张家常菜单</text>
    </view>

    <view class="login-card card">
      <view class="field">
        <text>邮箱</text>
        <input v-model="email" type="text" placeholder="name@example.com" />
      </view>
      <view class="field">
        <text>密码</text>
        <input v-model="password" password placeholder="请输入密码" />
      </view>
      <button class="primary-btn submit" hover-class="tap" @tap="submit">
        {{ store.loading ? '连接厨房中...' : '登录并进入厨房' }}
      </button>
      <button class="wechat" hover-class="tap" @tap="wechatLogin">
        <image :src="icons.chefHat" mode="aspectFit" />
        <text>微信一键登录</text>
      </button>
      <button class="link-btn" hover-class="tap" @tap="goRegister">还没账号？去注册</button>
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
import { syncWechatPrivacySetting } from '@/utils/wechat-privacy'

const store = useKitchenStore()
const email = ref('')
const password = ref('')

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
  if (!nextEmail || !password.value.trim()) {
    uni.showToast({ title: '请输入邮箱和密码', icon: 'none' })
    return
  }
  try {
    await store.loginWithEmail(nextEmail, password.value.trim())
    uni.reLaunch({ url: '/pages/home/index' })
  } catch (error) {
    if (error instanceof ApiError && error.code === 'EMAIL_NOT_REGISTERED') {
      uni.showModal({
        title: '该邮箱还没注册',
        content: '是否前往注册？',
        confirmText: '去注册',
        cancelText: '取消',
        success: ({ confirm }) => {
          if (!confirm) return
          uni.redirectTo({
            url: `/pages/register/index?email=${encodeURIComponent(nextEmail)}`
          })
        }
      })
      return
    }
    if (error instanceof ApiError && error.code === 'PASSWORD_WRONG') {
      uni.showToast({ title: '密码错误，请重试', icon: 'none' })
      return
    }
    uni.showToast({ title: store.apiError || '登录失败', icon: 'none' })
  }
}

function goRegister() {
  const nextEmail = email.value.trim()
  const url = nextEmail
    ? `/pages/register/index?email=${encodeURIComponent(nextEmail)}`
    : '/pages/register/index'
  uni.navigateTo({ url })
}

async function wechatLogin() {
  try {
    await syncWechatPrivacySetting(false)
    await store.loginWithWechat()
    if (store.needsWechatProfileCompletion()) {
      uni.redirectTo({ url: '/pages/profile-edit/index?onboarding=1' })
      return
    }
    uni.reLaunch({ url: '/pages/home/index' })
  } catch {
    uni.showToast({ title: store.apiError || '微信登录失败', icon: 'none' })
  }
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

.wechat {
  height: 78rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  margin-top: 20rpx;
  padding: 0 24rpx;
  border: 1rpx solid #dcebd4;
  border-radius: 24rpx;
  background: $success-light;
  color: $success;
  font-size: 28rpx;
  font-weight: 800;
  line-height: 1.1;
}

.wechat image {
  width: 40rpx;
  height: 40rpx;
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
