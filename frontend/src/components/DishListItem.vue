<template>
  <view class="dish-row card">
    <image class="thumb" :src="dish.coverImage" mode="aspectFill" @tap="$emit('view', dish.id)" />
    <view class="content">
      <view class="row-head">
        <text class="name line-clamp-1">{{ dish.name }} {{ dish.emoji }}</text>
        <button class="favorite-btn" hover-class="tap" @tap="$emit('favorite', dish.id)">
          <text :class="['favorite-mark', { active: dish.isFavorite }]">{{ dish.isFavorite ? '♥' : '♡' }}</text>
        </button>
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
      <view v-if="dish.learnedAt" class="learned-chip">
        <image class="mini" :src="icons.check" mode="aspectFit" />
        <text>我已学会</text>
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
  favorite: [id: string]
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
  min-width: 0;
  color: $text-main;
  font-size: 29rpx;
  font-weight: 900;
}

.favorite-btn {
  width: 52rpx;
  min-width: 52rpx;
  height: 52rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border-radius: 50%;
  background: rgba(255, 248, 241, 0.96);
}

.favorite-mark {
  color: #cdbbb0;
  font-size: 34rpx;
  line-height: 1;
}

.favorite-mark.active {
  color: #ff8f5a;
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

.learned-chip {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  margin-top: 10rpx;
  padding: 8rpx 14rpx;
  border-radius: 999rpx;
  background: #eef8e8;
  color: $success;
  font-size: 22rpx;
  font-weight: 800;
}

.buttons .ghost-btn,
.buttons .primary-btn {
  height: 60rpx;
  border-radius: 18rpx;
  font-size: 23rpx;
}
</style>
