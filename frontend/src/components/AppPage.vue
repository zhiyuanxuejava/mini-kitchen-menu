<template>
  <view :class="['safe-page', noTab ? 'no-tab' : '']">
    <slot />
  </view>
</template>

<script setup lang="ts">
defineProps<{
  noTab?: boolean
}>()
</script>
