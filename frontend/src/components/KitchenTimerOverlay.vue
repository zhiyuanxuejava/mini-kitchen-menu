<template>
  <view v-if="showTimerAlert">
    <view class="timer-alert-mask" @tap="dismissTimerAlert" />
    <view class="timer-alert card" @tap.stop>
      <view class="timer-alert-glow" />

      <view class="timer-alert-head">
        <view class="timer-alert-badge">
          <image :src="icons.timer" mode="aspectFit" />
        </view>
        <view class="timer-alert-copy">
          <text class="timer-alert-title">计时结束</text>
          <text class="timer-alert-main">{{ timerAlertTitle }}</text>
        </view>
      </view>

      <view class="timer-alert-note">
        <text class="timer-alert-step">{{ timerAlertStep }}</text>
        <text class="timer-alert-sub">{{ timerAlertSubtitle }}</text>
      </view>

      <view class="timer-alert-actions">
        <button class="ghost-btn" hover-class="tap" @tap="dismissTimerAlert">知道了</button>
        <button
          v-if="store.kitchenTimer.context?.type === 'step' && store.kitchenTimer.context?.itemId"
          class="primary-btn"
          hover-class="tap"
          @tap="goTimerStep"
        >
          回到步骤
        </button>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
let activeOverlayId = ''
</script>

<script setup lang="ts">
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { onHide, onShow } from '@dcloudio/uni-app'
import { icons } from '@/data/assets'
import { useKitchenStore } from '@/stores/kitchen'
import { playKitchenTimerAlert } from '@/utils/kitchen-timer-alert'

const store = useKitchenStore()
const showTimerAlert = ref(false)
const isActivePage = ref(false)
const overlayId = `kitchen-timer-overlay-${getCurrentInstance()?.uid ?? Math.random().toString(16).slice(2)}`
const timerMinutes = computed(() => Math.max(1, Math.round(store.kitchenTimer.durationMs / 60000)))
const timerAlertTitle = computed(() => {
  const context = store.kitchenTimer.context
  if (context?.type === 'step') {
    return `${context.dishName || '当前菜品'} · 第 ${context.stepNo || 1} 步`
  }
  return '厨房计时已完成'
})
const timerAlertStep = computed(() => {
  const context = store.kitchenTimer.context
  if (context?.type === 'step' && context.stepTitle) return context.stepTitle
  return `${timerMinutes.value} 分钟提醒`
})
const timerAlertSubtitle = computed(() => {
  const context = store.kitchenTimer.context
  if (context?.type === 'step' && context.stepTitle) {
    return `“${context.stepTitle}”设定的 ${timerMinutes.value} 分钟已到，请回到这一步继续操作。`
  }
  return `你设定的 ${timerMinutes.value} 分钟已到，记得及时查看锅里状态。`
})

onMounted(markActive)
onShow(markActive)
onHide(markInactive)
onBeforeUnmount(markInactive)

watch(
  () => [store.kitchenTimer.alertPending, isActivePage.value] as const,
  ([pending, active]) => {
    if (!pending || !active) return
    showTimerAlert.value = true
    playKitchenTimerAlert()
  },
  { immediate: true }
)

watch(
  () => store.kitchenTimer.alertPending,
  (value) => {
    if (value) return
    showTimerAlert.value = false
  }
)

function markActive() {
  activeOverlayId = overlayId
  isActivePage.value = true
  if (store.kitchenTimer.alertPending) {
    showTimerAlert.value = true
    playKitchenTimerAlert()
  }
}

function markInactive() {
  if (activeOverlayId === overlayId) activeOverlayId = ''
  isActivePage.value = false
}

function dismissTimerAlert() {
  showTimerAlert.value = false
  store.acknowledgeKitchenTimerAlert()
}

function goTimerStep() {
  const itemId = store.kitchenTimer.context?.itemId
  dismissTimerAlert()
  if (!itemId) return

  const pages = getCurrentPages() as Array<{ route?: string; options?: Record<string, string> }>
  const currentPage = pages[pages.length - 1]
  if (currentPage?.route === 'pages/cook-step/index' && currentPage.options?.itemId === itemId) return

  uni.navigateTo({ url: `/pages/cook-step/index?itemId=${itemId}` })
}
</script>

<style scoped lang="scss">
.timer-alert-mask {
  position: fixed;
  inset: 0;
  z-index: 46;
  background: rgba(48, 30, 20, 0.42);
}

.timer-alert {
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 47;
  width: calc(100% - 56rpx);
  max-width: 402px;
  padding: 34rpx 28rpx 28rpx;
  overflow: hidden;
  background:
    radial-gradient(circle at 16% 18%, rgba(255, 166, 108, 0.28), transparent 180rpx),
    linear-gradient(180deg, #fffefc 0%, #fff7ef 100%);
  transform: translate(-50%, -50%);
}

.timer-alert-glow {
  position: absolute;
  right: -34rpx;
  top: -32rpx;
  width: 210rpx;
  height: 210rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 167, 102, 0.26) 0%, rgba(255, 167, 102, 0) 72%);
}

.timer-alert-head {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 104rpx minmax(0, 1fr);
  gap: 20rpx;
  align-items: center;
}

.timer-alert-badge {
  width: 104rpx;
  height: 104rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 30rpx;
  background: rgba(255, 245, 235, 0.96);
  box-shadow: 0 16rpx 30rpx rgba(255, 138, 42, 0.14);
}

.timer-alert-badge image {
  width: 58rpx;
  height: 58rpx;
}

.timer-alert-copy {
  min-width: 0;
}

.timer-alert-title,
.timer-alert-main,
.timer-alert-step,
.timer-alert-sub {
  display: block;
}

.timer-alert-title {
  color: $primary;
  font-size: 24rpx;
  font-weight: 900;
  letter-spacing: 2rpx;
}

.timer-alert-main {
  margin-top: 10rpx;
  color: $text-main;
  font-size: 38rpx;
  font-weight: 900;
  line-height: 1.35;
}

.timer-alert-note {
  position: relative;
  z-index: 1;
  margin-top: 24rpx;
  padding: 24rpx 22rpx;
  border: 1rpx solid rgba(255, 211, 184, 0.92);
  border-radius: 24rpx;
  background: rgba(255, 252, 248, 0.94);
}

.timer-alert-step {
  color: $text-main;
  font-size: 29rpx;
  font-weight: 900;
}

.timer-alert-sub {
  margin-top: 10rpx;
  color: $text-sub;
  font-size: 25rpx;
  line-height: 1.62;
}

.timer-alert-actions {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18rpx;
  margin-top: 28rpx;
}
</style>
