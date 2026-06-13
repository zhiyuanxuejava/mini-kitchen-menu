<template>
  <AppPage no-tab>
    <AppNavbar title="个人资料" subtitle="修改后会同步到“我的”和设置页" back />

    <view class="hero card">
      <button class="avatar-wrap" hover-class="tap" @tap="chooseAvatar">
        <UserAvatar class="avatar" :src="avatarPreview" />
        <view class="avatar-mask">{{ uploading ? '上传头像中...' : '更换头像' }}</view>
      </button>
      <view class="hero-copy">
        <text class="hero-title">{{ nickname || '请输入昵称' }}</text>
        <text class="hero-sub">{{ store.user?.email || '未绑定邮箱账号' }}</text>
        <view class="hero-tags">
          <text class="pill">{{ roleLabel }}</text>
          <text class="pill green">资料实时同步</text>
          <text v-if="pendingUpload" class="pill amber">待上传</text>
        </view>
      </view>
    </view>

    <view class="form card">
      <view class="field">
        <text class="label">昵称</text>
        <input v-model.trim="nickname" maxlength="24" placeholder="给自己起一个厨房称呼" />
      </view>
      <view class="field static">
        <text class="label">登录账号</text>
        <text class="static-value">{{ store.user?.email || '微信登录账号' }}</text>
      </view>
      <view class="field static">
        <text class="label">账号角色</text>
        <text class="static-value">{{ roleLabel }}</text>
      </view>
    </view>

    <view class="helper card">
      <text class="helper-title">修改后影响</text>
      <text class="helper-copy">“我的”页头像、昵称，以及设置页账号资料区域会立刻更新，并写回后端用户信息。</text>
    </view>

    <button class="primary-btn submit" hover-class="tap" @tap="save">
      {{ saving ? '保存中...' : '保存资料' }}
    </button>
  </AppPage>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppNavbar from '@/components/AppNavbar.vue'
import AppPage from '@/components/AppPage.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import { isTemporaryFilePath } from '@/api/kitchen'
import { icons } from '@/data/assets'
import { useKitchenStore } from '@/stores/kitchen'

const store = useKitchenStore()
const nickname = ref('')
const avatarPreview = ref(icons.avatar)
const saving = ref(false)
const uploading = ref(false)

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

function chooseAvatar() {
  uni.chooseImage({
    count: 1,
    success(res) {
      if (res.tempFilePaths?.[0]) avatarPreview.value = res.tempFilePaths[0]
    }
  })
}

async function save() {
  const nextName = nickname.value.trim()
  if (!nextName) {
    uni.showToast({ title: '请输入昵称', icon: 'none' })
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
    setTimeout(() => uni.navigateBack(), 400)
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

.form,
.helper {
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
  line-height: 1.55;
}

.submit {
  margin-top: 26rpx;
}
</style>
