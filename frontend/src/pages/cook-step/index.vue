<template>
  <AppPage v-if="dish && item" no-tab>
    <view class="step-head">
      <button class="back" hover-class="tap" @tap="goBack">
        <text class="back-mark">‹</text>
      </button>
      <image class="dish-thumb" :src="dish.squareImage" mode="aspectFill" />
      <view class="head-copy">
        <text class="name line-clamp-1">{{ dish.name }} {{ dish.emoji }}</text>
        <text>第 <strong>{{ item.currentStep }}</strong> 步 / 共 {{ dish.steps.length }} 步</text>
      </view>
      <view class="remain">
        <image :src="icons.clockOrange" mode="aspectFit" />
        <text>约 {{ remainingMinutes }} 分钟</text>
        <text>预计剩余时间</text>
      </view>
    </view>

    <StepProgress :steps="dish.steps" :current="item.currentStep" />
    <StepCookCard :step="currentStep" />

    <view class="step-actions">
      <button class="ghost-btn" hover-class="tap" @tap="prev">上一步</button>
      <button class="primary-btn" hover-class="tap" @tap="next">{{ isLast ? '完成步骤' : '下一步' }}</button>
    </view>
    <button class="finish-btn" hover-class="tap" @tap="finish">✓ 标记完成</button>
  </AppPage>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import AppPage from '@/components/AppPage.vue'
import StepCookCard from '@/components/StepCookCard.vue'
import StepProgress from '@/components/StepProgress.vue'
import { icons } from '@/data/assets'
import { useKitchenStore } from '@/stores/kitchen'

const store = useKitchenStore()
const itemId = ref('')

onLoad((query) => {
  if (query?.itemId && typeof query.itemId === 'string') itemId.value = query.itemId
})

onShow(() => {
  store.hydrate()
  if (!store.user) uni.reLaunch({ url: '/pages/login/index' })
})

const item = computed(() => store.menu.items.find((candidate) => candidate.id === itemId.value))
const dish = computed(() => (item.value ? store.getDish(item.value.dishId) : undefined))
const currentStep = computed(() => dish.value!.steps[(item.value!.currentStep || 1) - 1] || dish.value!.steps[0])
const isLast = computed(() => Boolean(dish.value && item.value && item.value.currentStep >= dish.value.steps.length))
const remainingMinutes = computed(() => {
  if (!dish.value || !item.value) return 0
  return currentStep.value?.minutes || 0
})

function goBack() {
  uni.navigateBack()
}

function prev() {
  if (!item.value) return
  store.setStep(item.value.id, item.value.currentStep - 1)
}

function next() {
  if (!item.value || !dish.value) return
  if (isLast.value) {
    finish()
  } else {
    store.setStep(item.value.id, item.value.currentStep + 1)
  }
}

function finish() {
  if (!item.value) return
  store.completeDish(item.value.id)
  uni.navigateTo({ url: `/pages/upload/index?itemId=${item.value.id}` })
}
</script>

<style scoped lang="scss">
.step-head {
  display: grid;
  grid-template-columns: 68rpx 86rpx 1fr 178rpx;
  gap: 18rpx;
  align-items: center;
  margin: 28rpx 0 28rpx;
}

.back {
  width: 62rpx;
  height: 62rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-mark {
  color: $text-main;
  font-size: 62rpx;
  font-weight: 400;
  line-height: 1;
}

.dish-thumb {
  width: 86rpx;
  height: 86rpx;
  border-radius: 18rpx;
}

.head-copy {
  min-width: 0;
}

.name {
  display: block;
  color: $text-main;
  font-size: 34rpx;
  font-weight: 900;
}

.head-copy > text:last-child {
  display: block;
  margin-top: 8rpx;
  color: $text-sub;
  font-size: 27rpx;
}

.head-copy strong {
  color: $primary;
  font-size: 36rpx;
}

.remain {
  min-height: 76rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1rpx solid #ffd6bf;
  border-radius: 22rpx;
  background: #fff7ef;
  color: $text-sub;
  font-size: 20rpx;
}

.remain image {
  width: 32rpx;
  height: 32rpx;
}

.remain text:nth-child(2) {
  color: $text-main;
  font-size: 23rpx;
  font-weight: 900;
}

.step-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28rpx;
  margin: 34rpx 10rpx 24rpx;
}

.finish-btn {
  height: 82rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1rpx solid #ffd7bf;
  border-radius: 999rpx;
  background: #fff9f4;
  color: $primary;
  font-size: 31rpx;
  font-weight: 900;
}
</style>
