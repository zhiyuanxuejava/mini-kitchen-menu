<template>
  <view class="photo-grid">
    <view v-for="(photo, index) in modelValue" :key="photo + index" class="photo-cell">
      <image :src="photo" mode="aspectFill" />
      <button class="remove" hover-class="tap" @tap="remove(index)">×</button>
    </view>
    <button v-if="modelValue.length < max" class="upload-cell" hover-class="tap" @tap="choose">
      <image :src="icons.camera" mode="aspectFit" />
      <text>点击上传</text>
    </button>
  </view>
</template>

<script setup lang="ts">
import { icons } from '@/data/assets'

const props = withDefaults(
  defineProps<{
    modelValue: string[]
    max?: number
  }>(),
  { max: 3 }
)

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

function choose() {
  uni.chooseImage({
    count: props.max - props.modelValue.length,
    success(res) {
      emit('update:modelValue', [...props.modelValue, ...res.tempFilePaths].slice(0, props.max))
    }
  })
}

function remove(index: number) {
  const next = [...props.modelValue]
  next.splice(index, 1)
  emit('update:modelValue', next)
}
</script>

<style scoped lang="scss">
.photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18rpx;
}

.photo-cell,
.upload-cell {
  position: relative;
  height: 198rpx;
  overflow: hidden;
  border-radius: 22rpx;
}

.photo-cell image {
  width: 100%;
  height: 100%;
}

.remove {
  position: absolute;
  right: 10rpx;
  top: 10rpx;
  width: 42rpx;
  height: 42rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  color: $text-main;
  font-size: 32rpx;
}

.upload-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14rpx;
  border: 2rpx dashed #f2d6c3;
  background: #fffaf5;
  color: #d88958;
  font-size: 26rpx;
}

.upload-cell image {
  width: 62rpx;
  height: 62rpx;
}
</style>
