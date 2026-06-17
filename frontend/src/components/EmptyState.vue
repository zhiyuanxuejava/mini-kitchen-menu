<template>
  <view class="empty">
    <image :src="icons.empty" mode="aspectFit" />
    <text class="title">{{ title }}</text>
    <text v-if="desc" class="desc">{{ desc }}</text>
  </view>
</template>

<script setup lang="ts">
import { icons } from '@/data/assets'

defineProps<{
  title: string
  desc?: string
}>()
</script>

<style scoped lang="scss">
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 70rpx 20rpx;
  color: $text-sub;
  text-align: center;
}

.empty image {
  width: 180rpx;
  height: 180rpx;
}

.title {
  margin-top: 18rpx;
  color: $text-main;
  font-size: 30rpx;
  font-weight: 900;
}

.desc {
  margin-top: 10rpx;
  font-size: 25rpx;
  line-height: 1.45;
}
</style>
