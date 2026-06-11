<template>
  <view class="rating-row">
    <view class="rating-copy">
      <text class="title">{{ title }}</text>
      <text class="desc">{{ desc }}</text>
    </view>
    <view class="stars">
      <button v-for="value in 5" :key="value" hover-class="tap" @tap="$emit('update:modelValue', value)">
        <text :class="{ active: value <= modelValue }">★</text>
      </button>
    </view>
    <text class="score">{{ modelValue.toFixed(1) }}</text>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  desc: string
  modelValue: number
}>()

defineEmits<{
  'update:modelValue': [value: number]
}>()
</script>

<style scoped lang="scss">
.rating-row {
  display: grid;
  grid-template-columns: 138rpx minmax(0, 1fr) 54rpx;
  align-items: center;
  gap: 8rpx;
  min-width: 0;
  padding: 22rpx 0;
  border-bottom: 1rpx dashed #ead9cf;
}

.rating-row:last-child {
  border-bottom: 0;
}

.rating-copy {
  min-width: 0;
}

.title,
.desc {
  display: block;
}

.title {
  color: $text-main;
  font-size: 27rpx;
  font-weight: 900;
}

.desc {
  margin-top: 8rpx;
  color: $text-sub;
  font-size: 20rpx;
  line-height: 1.35;
}

.stars {
  display: flex;
  justify-content: flex-end;
  gap: 4rpx;
  min-width: 0;
}

.stars button {
  width: 60rpx;
  height: 42rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stars text {
  color: #d7d7d7;
  font-size: 34rpx;
  line-height: 1;
}

.stars text.active {
  color: #ff9a00;
}

.score {
  color: $primary;
  font-size: 28rpx;
  font-weight: 900;
  text-align: right;
}

@media screen and (max-width: 380px) {
  .rating-row {
    grid-template-columns: 132rpx minmax(0, 1fr) 62rpx;
    gap: 6rpx;
  }

  .stars {
    justify-content: center;
  }

  .stars button {
    width: 54rpx;
  }

  .score {
    font-size: 26rpx;
  }
}
</style>
