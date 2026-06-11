<template>
  <view class="dish-row card">
    <image class="thumb" :src="dish.coverImage" mode="aspectFill" @tap="$emit('view', dish.id)" />
    <view class="content">
      <view class="row-head">
        <text class="name line-clamp-1">{{ dish.name }} {{ dish.emoji }}</text>
        <image class="more" :src="icons.more" mode="aspectFit" />
      </view>
      <view class="meta-row">
        <text>难度：</text>
        <text :class="dish.difficulty === '简单' ? 'green' : 'orange'">{{ dish.difficulty }}</text>
      </view>
      <view class="meta-row">
        <image class="mini" :src="icons.clock" mode="aspectFit" />
        <text>{{ dish.estimatedMinutes }} 分钟</text>
      </view>
      <view class="meta-row">
        <image class="mini" :src="icons.star" mode="aspectFit" />
        <text>{{ dish.rating || '暂无' }}（{{ dish.ratingCount }}人评分）</text>
      </view>
    </view>
    <view class="buttons">
      <button class="ghost-btn" hover-class="tap" @tap="$emit('view', dish.id)">查看做法</button>
      <button class="primary-btn" hover-class="tap" @tap="$emit('add', dish.id)">加入点菜单</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { icons } from '@/data/assets'
import type { Dish } from '@/data/types'

defineProps<{
  dish: Dish
}>()

defineEmits<{
  view: [id: string]
  add: [id: string]
}>()
</script>

<style scoped lang="scss">
.dish-row {
  display: grid;
  grid-template-columns: 188rpx minmax(0, 1fr) 166rpx;
  gap: 14rpx;
  align-items: center;
  min-width: 0;
  padding: 18rpx;
  margin-bottom: 18rpx;
}

.thumb {
  width: 188rpx;
  height: 142rpx;
  border-radius: 16rpx;
}

.content {
  min-width: 0;
}

.row-head {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 10rpx;
}

.name {
  flex: 1;
  color: $text-main;
  font-size: 29rpx;
  font-weight: 900;
}

.more {
  width: 32rpx;
  height: 32rpx;
}

.mini {
  width: 26rpx;
  height: 26rpx;
}

.dish-row .meta-row {
  gap: 8rpx;
  font-size: 24rpx;
  line-height: 1.2;
  white-space: nowrap;
}

.dish-row .meta-row text {
  white-space: nowrap;
}

.green {
  color: $success;
  font-weight: 700;
}

.orange {
  color: $primary;
  font-weight: 700;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
  min-width: 0;
}

.buttons .ghost-btn,
.buttons .primary-btn {
  height: 60rpx;
  border-radius: 18rpx;
  font-size: 23rpx;
}
</style>
