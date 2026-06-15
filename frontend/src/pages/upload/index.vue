<template>
  <AppPage v-if="dish">
    <AppNavbar title="上传成品 📸" subtitle="分享你的美味成果，记录每一次进步 ✨" back />

    <view class="dish-strip card">
      <image :src="dish.coverImage" mode="aspectFill" />
      <view>
        <text class="dish-name">{{ dish.name }} {{ dish.emoji }}</text>
        <text class="dish-state">今日菜单 · 已完成</text>
      </view>
      <text class="done">✓ 已完成</text>
    </view>

    <view class="form-card card">
      <view class="form-head">
        <text>成品照片（至少上传1张）📸</text>
        <text><strong>{{ photos.length }}</strong>/3</text>
      </view>
      <UploadPhotoGrid v-model="photos" />
    </view>

    <view class="field-card card">
      <text>实际耗时 ⏱️</text>
      <view class="time-input">
        <input v-model.number="actualMinutes" type="number" />
        <text>分钟 ›</text>
      </view>
    </view>

    <view class="form-card card">
      <text class="block-title">口味反馈 🍲</text>
      <view class="taste-row">
        <button v-for="item in tastes" :key="item" :class="{ active: taste === item }" @tap="taste = item">
          {{ item }}
        </button>
      </view>
    </view>

    <view class="form-card card">
      <text class="block-title">制作心得 📝</text>
      <textarea v-model="note" maxlength="200" placeholder="记录这次做菜的心得和下次改进点" />
      <text class="count">{{ note.length }}/200</text>
    </view>

    <view class="switch-card card">
      <view>
        <text class="block-title">是否加入历史记录 📖</text>
        <text>加入后可在“历史记录”中查看与复做</text>
      </view>
      <button :class="['switch-toggle', includeInHistory ? 'active' : '']" hover-class="tap" @tap="includeInHistory = !includeInHistory">
        <view />
      </button>
    </view>

    <button class="primary-btn submit" hover-class="tap" @tap="submit">提交成品 ✨</button>
    <BottomTabbar active="cook" />
  </AppPage>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import AppNavbar from '@/components/AppNavbar.vue'
import AppPage from '@/components/AppPage.vue'
import BottomTabbar from '@/components/BottomTabbar.vue'
import UploadPhotoGrid from '@/components/UploadPhotoGrid.vue'
import type { TasteFeedback } from '@/data/types'
import { useKitchenStore } from '@/stores/kitchen'

const store = useKitchenStore()
const itemId = ref('')
const dishId = ref('')
const photos = ref<string[]>([])
const actualMinutes = ref(55)
const taste = ref<TasteFeedback>('刚好')
const note = ref('第一次做，整体还不错！下次可以根据口味再微调调料。')
const includeInHistory = ref(true)
const tastes: TasteFeedback[] = ['刚好', '偏淡', '偏咸', '偏甜']

onLoad((query) => {
  if (query?.itemId && typeof query.itemId === 'string') itemId.value = query.itemId
  if (query?.dishId && typeof query.dishId === 'string') dishId.value = query.dishId
})

onShow(() => {
  store.hydrate()
  if (!store.user) uni.reLaunch({ url: '/pages/login/index' })
  else {
    store.ensureRemoteDishes()
    store.refreshStats()
  }
})

const item = computed(() => store.menu.items.find((candidate) => candidate.id === itemId.value))
const dish = computed(() => store.getDish(item.value?.dishId || dishId.value || 'hongshaorou'))
const resolvedMenuItemId = computed(() => (item.value?.id ? item.value.id : undefined))

watch(
  dish,
  (next) => {
    if (next && !photos.value.length) {
      photos.value = [next.coverImage, next.detailImage].filter(Boolean).slice(0, 2)
      actualMinutes.value = Math.max(8, next.estimatedMinutes - 5)
    }
  },
  { immediate: true }
)

async function submit() {
  if (!dish.value) return
  if (!photos.value.length) {
    uni.showToast({ title: '请至少上传 1 张照片', icon: 'none' })
    return
  }
  try {
    const recordId = await store.createCookRecord({
      dishId: dish.value.id,
      menuItemId: resolvedMenuItemId.value,
      actualMinutes: Number(actualMinutes.value) || dish.value.estimatedMinutes,
      photos: photos.value,
      tasteFeedback: taste.value,
      note: note.value.trim(),
      includeInHistory: includeInHistory.value
    })
    uni.redirectTo({ url: `/pages/rating/index?recordId=${recordId}` })
  } catch {
    uni.showToast({ title: store.apiError || '提交失败', icon: 'none' })
  }
}

</script>

<style scoped lang="scss">
.dish-strip {
  display: grid;
  grid-template-columns: 160rpx 1fr 140rpx;
  gap: 22rpx;
  align-items: center;
  padding: 20rpx;
  margin-bottom: 22rpx;
}

.dish-strip image {
  width: 160rpx;
  height: 104rpx;
  border-radius: 18rpx;
}

.dish-name,
.dish-state,
.done {
  display: block;
}

.dish-name {
  color: $text-main;
  font-size: 32rpx;
  font-weight: 900;
}

.dish-state {
  margin-top: 12rpx;
  color: $text-sub;
  font-size: 25rpx;
}

.done {
  color: $success;
  font-size: 28rpx;
  font-weight: 900;
  text-align: right;
}

.form-card,
.field-card,
.switch-card {
  padding: 26rpx;
  margin-bottom: 22rpx;
}

.form-head,
.field-card,
.switch-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
}

.form-head {
  margin-bottom: 22rpx;
}

.form-head text,
.block-title,
.field-card > text {
  color: $text-main;
  font-size: 30rpx;
  font-weight: 900;
}

.form-head strong {
  color: $primary;
}

.time-input {
  width: 188rpx;
  height: 62rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  border: 1rpx solid $border;
  border-radius: 18rpx;
  color: $text-main;
  font-size: 28rpx;
  font-weight: 800;
}

.time-input input {
  width: 70rpx;
  height: 58rpx;
  text-align: right;
}

.taste-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
  margin-top: 24rpx;
}

.taste-row button {
  height: 62rpx;
  border: 1rpx solid $border;
  border-radius: 999rpx;
  color: $text-sub;
  font-size: 26rpx;
  font-weight: 800;
}

.taste-row button.active {
  border-color: $primary;
  color: #fff;
  background: linear-gradient(135deg, $primary-2, $primary);
}

textarea {
  width: 100%;
  min-height: 178rpx;
  margin-top: 20rpx;
  padding: 22rpx;
  border: 1rpx solid $border;
  border-radius: 18rpx;
  color: $text-main;
  font-size: 28rpx;
  line-height: 1.55;
}

.count {
  display: block;
  margin-top: 10rpx;
  color: $text-sub;
  font-size: 24rpx;
  text-align: right;
}

.switch-card > view text:last-child {
  display: block;
  margin-top: 8rpx;
  color: $text-sub;
  font-size: 24rpx;
}

.switch-toggle {
  width: 92rpx;
  height: 52rpx;
  display: flex;
  align-items: center;
  padding: 4rpx;
  border-radius: 999rpx;
  background: #ddd3ca;
}

.switch-toggle view {
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.16);
  transition: transform 0.18s ease;
}

.switch-toggle.active {
  background: $primary;
}

.switch-toggle.active view {
  transform: translateX(40rpx);
}

.submit {
  margin-top: 28rpx;
}
</style>
