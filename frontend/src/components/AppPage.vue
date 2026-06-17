<template>
  <view :class="['safe-page', noTab ? 'no-tab' : '']">
    <slot />
    <KitchenTimerOverlay />
    <VersionUpdateDialog />
    <WechatPrivacyDialog />
  </view>
</template>

<script setup lang="ts">
import KitchenTimerOverlay from '@/components/KitchenTimerOverlay.vue'
import VersionUpdateDialog from '@/components/VersionUpdateDialog.vue'
import WechatPrivacyDialog from '@/components/WechatPrivacyDialog.vue'

defineProps<{
  noTab?: boolean
}>()
</script>
