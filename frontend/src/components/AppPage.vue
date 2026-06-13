<template>
  <view :class="['safe-page', noTab ? 'no-tab' : '']">
    <slot />
    <KitchenTimerOverlay />
  </view>
</template>

<script setup lang="ts">
import KitchenTimerOverlay from '@/components/KitchenTimerOverlay.vue'

defineProps<{
  noTab?: boolean
}>()
</script>
