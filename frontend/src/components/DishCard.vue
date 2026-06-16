<template>
  <view class="dish-card card">
    <view class="photo-wrap" @tap="$emit('view', dish.id)">
      <image class="photo" :src="dish.coverImage" mode="aspectFill" />
      <view class="tag">{{ dish.emoji }} {{ dish.name }}</view>
      <button class="heart-btn" hover-class="tap" @tap.stop="$emit('favorite', dish.id)">
        <text class="heart" :class="{ active: dish.isFavorite }">{{ dish.isFavorite ? '♥' : '♡' }}</text>
      </button>
    </view>
    <view class="card-body">
      <view class="meta-row">
        <text>难度：</text>
        <text :class="['difficulty', dish.difficulty === '简单' ? 'green' : 'orange']">{{ dish.difficulty }}</text>
        <text class="dot">·</text>
        <image :src="icons.clock" mode="aspectFit" />
        <text>{{ dish.estimatedMinutes }} 分钟</text>
      </view>
      <view class="rating">
        <image :src="icons.star" mode="aspectFit" />
        <text>{{ dish.rating || '暂无' }}</text>
        <text v-if="dish.ratingCount">（{{ dish.ratingCount }}人评分）</text>
      </view>
      <view class="actions">
        <button class="ghost-btn" hover-class="tap" @tap="$emit('view', dish.id)">查看做法</button>
        <button class="primary-btn" hover-class="tap" @tap="$emit('add', dish.id)">加入点菜单</button>
      </view>
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
  favorite: [id: string]
}>()
</script>

<style scoped lang="scss">
.dish-card {
  overflow: hidden;
}

.photo-wrap {
  position: relative;
  height: 204rpx;
}

.photo {
  width: 100%;
  height: 100%;
}

.tag {
  position: absolute;
  left: 18rpx;
  top: 18rpx;
  max-width: calc(100% - 88rpx);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 8rpx 14rpx;
  border-radius: 16rpx;
  background: rgba(255, 255, 255, 0.92);
  font-size: 24rpx;
  font-weight: 800;
  color: $text-main;
}

.heart {
  color: #fff;
  font-size: 54rpx;
  line-height: 1;
  text-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.22);
}

.heart.active {
  color: #ff8f5a;
}

.heart-btn {
  position: absolute;
  right: 14rpx;
  top: 12rpx;
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: 50%;
  background: rgba(32, 18, 12, 0.24);
}

.card-body {
  min-width: 0;
  padding: 18rpx;
}

.meta-row {
  gap: 6rpx;
  min-width: 0;
  flex-wrap: nowrap;
  white-space: nowrap;
  font-size: 23rpx;
}

.meta-row image {
  width: 24rpx;
  height: 24rpx;
  flex: 0 0 auto;
}

.difficulty.green {
  color: $success;
}

.difficulty.orange {
  color: $primary;
}

.dot {
  color: #ddd;
}

.rating {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-top: 14rpx;
  color: $text-sub;
  font-size: 25rpx;
}

.rating image {
  width: 30rpx;
  height: 30rpx;
}

.actions {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 8rpx;
  margin-top: 18rpx;
  min-width: 0;
}

.actions .ghost-btn,
.actions .primary-btn {
  height: 60rpx;
  border-radius: 18rpx;
  font-size: 23rpx;
}
</style>
