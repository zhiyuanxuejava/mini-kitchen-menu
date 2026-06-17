<template>
  <AppPage no-tab>
    <AppNavbar :title="isOnboarding ? '完善微信资料' : '个人资料'" :subtitle="navSubtitle || undefined" :back="!isOnboarding" />

    <view class="hero card">
      <button
        v-if="isWechatRuntime"
        class="avatar-wrap"
        hover-class="tap"
        open-type="chooseAvatar"
        @chooseavatar="chooseWechatAvatar"
      >
        <UserAvatar class="avatar" :src="avatarPreview" />
        <view class="avatar-mask">{{ uploading ? '上传头像中...' : '选择微信头像' }}</view>
      </button>
      <button v-else class="avatar-wrap" hover-class="tap" @tap="chooseAvatar">
        <UserAvatar class="avatar" :src="avatarPreview" />
        <view class="avatar-mask">{{ uploading ? '上传头像中...' : '更换头像' }}</view>
      </button>
      <view class="hero-copy">
        <text class="hero-title">{{ nickname || '请输入昵称' }}</text>
        <text class="hero-sub">{{ accountText }}</text>
        <view class="hero-tags">
          <text class="pill">{{ roleLabel }}</text>
          <text v-if="pendingUpload" class="pill amber">待上传</text>
        </view>
      </view>
    </view>

    <view class="form card">
      <view class="field">
        <text class="label">昵称</text>
        <input v-model.trim="nickname" :type="isWechatRuntime ? 'nickname' : 'text'" maxlength="24" placeholder="给自己起一个厨房称呼" />
      </view>
      <view class="field static">
        <text class="label">登录账号</text>
        <text class="static-value">{{ accountText }}</text>
      </view>
      <view class="field static">
        <text class="label">账号角色</text>
        <text class="static-value">{{ roleLabel }}</text>
      </view>
    </view>

    <button class="primary-btn submit" hover-class="tap" @tap="save">
      {{ saving ? '保存中...' : isOnboarding ? '完成并进入小程序' : '保存资料' }}
    </button>
  </AppPage>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import AppNavbar from '@/components/AppNavbar.vue'
import AppPage from '@/components/AppPage.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import { isDefaultUserAvatar, isTemporaryFilePath } from '@/api/kitchen'
import { icons } from '@/data/assets'
import { useKitchenStore } from '@/stores/kitchen'
import { ensureWechatPrivacyAuthorization } from '@/utils/wechat-privacy'

const store = useKitchenStore()
const nickname = ref('')
const avatarPreview = ref(icons.avatar)
const saving = ref(false)
const uploading = ref(false)
const isOnboarding = ref(false)
const isWechatRuntime = typeof globalThis !== 'undefined' && 'wx' in globalThis

onLoad((query) => {
  isOnboarding.value = query?.onboarding === '1'
})

onShow(() => {
  store.hydrate()
  if (!store.user) {
    uni.reLaunch({ url: '/pages/login/index' })
    return
  }
  nickname.value = store.user.nickname || ''
  avatarPreview.value = store.user.avatarUrl || icons.avatar
})

const roleLabel = computed(() => (store.user?.role === 'admin' ? '管理员账号' : '普通账号'))
const pendingUpload = computed(() => isTemporaryFilePath(avatarPreview.value))
const needsAvatarSelection = computed(() => isDefaultUserAvatar(avatarPreview.value))
const navSubtitle = computed(() => (isOnboarding.value ? '补全昵称和头像' : ''))
const accountText = computed(() => store.user?.email || '微信登录账号')

function chooseAvatar() {
  uni.chooseImage({
    count: 1,
    success(res) {
      if (res.tempFilePaths?.[0]) avatarPreview.value = res.tempFilePaths[0]
    }
  })
}

function chooseWechatAvatar(event: { detail?: { avatarUrl?: string } }) {
  const next = event.detail?.avatarUrl?.trim()
  if (next) avatarPreview.value = next
}

async function save() {
  if (isWechatRuntime) {
    try {
      await ensureWechatPrivacyAuthorization(true)
    } catch (error) {
      uni.showToast({ title: error instanceof Error ? error.message : '请先同意隐私指引', icon: 'none' })
      return
    }
  }
  const nextName = nickname.value.trim()
  if (!nextName) {
    uni.showToast({ title: '请输入昵称', icon: 'none' })
    return
  }
  if (isOnboarding.value && needsAvatarSelection.value) {
    uni.showToast({ title: '请选择微信头像', icon: 'none' })
    return
  }
  if (!store.user) return
  saving.value = true
  try {
    let avatarUrl = avatarPreview.value
    if (isTemporaryFilePath(avatarUrl)) {
      uploading.value = true
      const [uploaded] = await store.uploadFiles([avatarUrl])
      uploading.value = false
      avatarUrl = uploaded
      avatarPreview.value = uploaded
    }
    await store.updateProfile({ nickname: nextName, avatarUrl })
    uni.showToast({ title: '资料已保存', icon: 'success' })
    setTimeout(() => {
      if (isOnboarding.value) {
        uni.reLaunch({ url: '/pages/home/index' })
        return
      }
      uni.navigateBack()
    }, 400)
  } catch {
    avatarPreview.value = store.user.avatarUrl || icons.avatar
    uni.showToast({ title: store.apiError || '保存失败', icon: 'none' })
  } finally {
    uploading.value = false
    saving.value = false
  }
}
</script>

<style scoped lang="scss">
.hero {
  display: grid;
  grid-template-columns: 188rpx minmax(0, 1fr);
  gap: 24rpx;
  align-items: center;
  padding: 28rpx;
  background:
    radial-gradient(circle at 88% 12%, rgba(255, 150, 74, 0.14), transparent 180rpx),
    linear-gradient(145deg, #fffdfb 0%, #fff8f0 100%);
}

.avatar-wrap {
  position: relative;
  height: 188rpx;
  margin: 0;
  padding: 0;
  overflow: hidden;
  border: 0;
  border-radius: 34rpx;
  background: transparent;
}

.avatar-wrap::after,
.submit::after {
  border: 0;
}

.avatar {
  width: 188rpx;
  height: 188rpx;
}

.avatar-mask {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 10rpx 0;
  background: rgba(34, 26, 22, 0.42);
  color: #fff;
  font-size: 22rpx;
  font-weight: 800;
  text-align: center;
}

.hero-copy {
  min-width: 0;
}

.hero-title,
.hero-sub {
  display: block;
}

.hero-title {
  color: $text-main;
  font-size: 42rpx;
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
  margin-top: 18rpx;
}

.pill {
  padding: 10rpx 18rpx;
  border-radius: 999rpx;
  background: rgba(255, 132, 48, 0.12);
  color: $primary;
  font-size: 22rpx;
  font-weight: 800;
}

.pill.green {
  background: rgba(89, 179, 71, 0.12);
  color: $success;
}

.pill.amber {
  background: rgba(255, 176, 32, 0.16);
  color: #b96a00;
}

.form {
  margin-top: 22rpx;
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

.field.static {
  gap: 10rpx;
}

.field:last-child {
  border-bottom: 0;
}

.label {
  color: $text-main;
  font-size: 28rpx;
  font-weight: 900;
}

.field input,
.static-value {
  color: $text-sub;
  font-size: 26rpx;
}

.field input {
  height: 64rpx;
}

.submit {
  margin-top: 26rpx;
}
</style>
