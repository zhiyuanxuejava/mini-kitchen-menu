<template>
  <view :class="['cook-card', item.cookStatus, 'card']">
    <image class="thumb" :src="dish.coverImage" mode="aspectFill" />
    <view class="content">
      <text class="name line-clamp-1">{{ dish.name }} {{ dish.emoji }}</text>
      <view :class="['status-pill', item.cookStatus]">{{ statusText }}</view>
      <view v-if="item.cookStatus === 'cooking'" class="progress-wrap">
        <text>第 {{ item.currentStep }} 步 / 共 {{ dish.steps.length }} 步</text>
        <view class="bar"><view :style="{ width: progress + '%' }" /></view>
      </view>
      <view class="meta-row">
        <image :src="icons.clock" mode="aspectFit" />
        <text>{{ item.cookStatus === 'done' ? `完成于 ${doneTime}` : `${dish.estimatedMinutes} 分钟` }}</text>
      </view>
    </view>
    <button :class="buttonClass" hover-class="tap" @tap="$emit('action', item.id, item.cookStatus)">
      {{ actionText }}
    </button>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { icons } from '@/data/assets'
import type { CookStatus, Dish, MenuItem } from '@/data/types'

const props = defineProps<{
  item: MenuItem
  dish: Dish
}>()

defineEmits<{
  action: [itemId: string, status: CookStatus]
}>()

const progress = computed(() => Math.round((props.item.currentStep / props.dish.steps.length) * 100))
const doneTime = computed(() => props.item.finishedAt?.slice(-5) || '刚刚')
const statusText = computed(() => {
  if (props.item.cookStatus === 'done') return '已完成'
  if (props.item.cookStatus === 'cooking') return '制作中'
  return '待制作'
})
const actionText = computed(() => {
  if (props.item.cookStatus === 'done') return '上传成品'
  if (props.item.cookStatus === 'cooking') return '继续制作'
  return '开始制作'
})
const buttonClass = computed(() => (props.item.cookStatus === 'done' ? 'ghost-btn green-btn' : props.item.cookStatus === 'pending' ? 'primary-btn' : 'ghost-btn'))
</script>

<style scoped lang="scss">
.cook-card {
  display: grid;
  grid-template-columns: 196rpx minmax(0, 1fr) 166rpx;
  align-items: center;
  gap: 18rpx;
  padding: 22rpx;
  margin-bottom: 22rpx;
}

.cook-card.cooking {
  border-left: 8rpx solid $primary;
}

.cook-card.done {
  border-left: 8rpx solid $success;
}

.thumb {
  width: 196rpx;
  height: 136rpx;
  border-radius: 18rpx;
}

.content {
  min-width: 0;
}

.name {
  display: block;
  color: $text-main;
  font-size: 32rpx;
  font-weight: 900;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 14rpx 0 10rpx;
  padding: 8rpx 20rpx;
  border-radius: 999rpx;
  font-size: 24rpx;
  font-weight: 800;
}

.status-pill.pending,
.status-pill.cooking {
  background: $primary-light;
  color: $primary;
}

.status-pill.done {
  background: $success-light;
  color: $success;
}

.progress-wrap {
  margin: 4rpx 0 12rpx;
  color: $text-main;
  font-size: 24rpx;
}

.bar {
  height: 10rpx;
  overflow: hidden;
  margin-top: 8rpx;
  border-radius: 999rpx;
  background: #ece9e6;
}

.bar view {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, $primary-2, $primary);
}

.meta-row image {
  width: 30rpx;
  height: 30rpx;
}

.primary-btn,
.ghost-btn {
  height: 70rpx;
  border-radius: 24rpx;
  font-size: 23rpx;
}

.green-btn {
  border-color: $success;
  color: $success;
}
</style>
