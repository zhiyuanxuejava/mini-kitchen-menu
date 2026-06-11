<template>
  <AppPage no-tab>
    <view class="login-hero">
      <image class="logo" :src="icons.pot" mode="aspectFit" />
      <text class="brand">掌勺点菜</text>
      <text class="slogan">把想吃、会做、做得怎样串成一张家常菜单</text>
    </view>

    <view class="login-card card">
      <view class="mode-tabs">
        <button :class="{ active: mode === 'login' }" @tap="mode = 'login'">邮箱登录</button>
        <button :class="{ active: mode === 'register' }" @tap="mode = 'register'">注册账号</button>
      </view>
      <view class="field">
        <text>邮箱</text>
        <input v-model="email" type="text" placeholder="name@example.com" />
      </view>
      <view class="field">
        <text>密码</text>
        <input v-model="password" password placeholder="请输入密码" />
      </view>
      <button class="primary-btn submit" hover-class="tap" @tap="submit">
        {{ mode === 'login' ? '登录并进入厨房' : '注册并开始点菜' }}
      </button>
      <button class="wechat" hover-class="tap" @tap="wechatLogin">
        <image :src="icons.chefHat" mode="aspectFit" />
        <text>微信一键登录</text>
      </button>
    </view>
  </AppPage>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppPage from '@/components/AppPage.vue'
import { icons } from '@/data/assets'
import { useKitchenStore } from '@/stores/kitchen'

const store = useKitchenStore()
const mode = ref<'login' | 'register'>('login')
const email = ref('demo@kitchen.local')
const password = ref('123456')

onShow(() => {
  store.hydrate()
  if (store.user) uni.reLaunch({ url: '/pages/home/index' })
})

function submit() {
  if (!email.value.trim() || !password.value.trim()) {
    uni.showToast({ title: '请输入邮箱和密码', icon: 'none' })
    return
  }
  if (mode.value === 'login') store.loginWithEmail(email.value.trim())
  else store.registerWithEmail(email.value.trim())
  uni.reLaunch({ url: '/pages/home/index' })
}

function wechatLogin() {
  store.loginWithWechat()
  uni.reLaunch({ url: '/pages/home/index' })
}
</script>

<style scoped lang="scss">
.login-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 52rpx;
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
  padding: 30rpx;
}

.mode-tabs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: 8rpx;
  border-radius: 999rpx;
  background: #fff6ee;
}

.mode-tabs button {
  height: 66rpx;
  border-radius: 999rpx;
  color: $text-sub;
  font-size: 27rpx;
  font-weight: 800;
}

.mode-tabs button.active {
  color: #fff;
  background: linear-gradient(135deg, $primary-2, $primary);
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
  border: 1rpx solid #dcebd4;
  border-radius: 24rpx;
  background: $success-light;
  color: $success;
  font-size: 28rpx;
  font-weight: 800;
}

.wechat image {
  width: 40rpx;
  height: 40rpx;
}
</style>
