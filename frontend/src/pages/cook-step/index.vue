<template>
  <AppPage v-if="dish && item && currentStep" no-tab>
    <view class="step-head">
      <button class="back" hover-class="tap" @tap="goBack">
        <text class="back-mark">‹</text>
      </button>
      <image class="dish-thumb" :src="dish.squareImage" mode="aspectFill" />
      <view class="head-copy">
        <text class="name line-clamp-1">{{ dish.name }} {{ dish.emoji }}</text>
        <text>第 <strong>{{ item.currentStep }}</strong> 步 / 共 {{ dish.steps.length }} 步</text>
      </view>
      <view class="remain">
        <image :src="icons.clockOrange" mode="aspectFit" />
        <text>约 {{ remainingMinutes }} 分钟</text>
        <text>预计剩余时间</text>
      </view>
    </view>

    <StepProgress :steps="dish.steps" :current="item.currentStep" />
    <StepCookCard :step="currentStep" />

    <view class="timer-panel card">
      <view class="timer-panel-head">
        <view class="timer-panel-copy">
          <text class="timer-panel-title">{{ timerSummaryTitle }}</text>
          <text class="timer-panel-sub">{{ timerSummarySub }}</text>
        </view>
        <button class="timer-panel-toggle" hover-class="tap" @tap="toggleTimerPanel">
          {{ timerToggleText }}
        </button>
      </view>

      <view class="timer-hero">
        <view class="timer-hero-badge">
          <image :src="icons.timer" mode="aspectFit" />
        </view>
        <view class="timer-hero-copy">
          <text class="timer-hero-label">{{ timerHeroLabel }}</text>
          <text class="timer-hero-value">{{ timerHeroValue }}</text>
        </view>
        <view class="timer-hero-meta">
          <text>{{ timerHeroMetaTop }}</text>
          <text>{{ timerHeroMetaBottom }}</text>
        </view>
      </view>

      <view v-if="timerPanelExpanded" class="timer-editor">
        <view class="preset-row">
          <button
            v-for="minutes in presetMinutes"
            :key="minutes"
            :class="['preset-pill', { active: timerDraftMinutes === minutes }]"
            hover-class="tap"
            @tap="pickPreset(minutes)"
          >
            {{ minutes }} 分钟
          </button>
        </view>

        <view class="timer-custom">
          <view class="timer-custom-copy">
            <text class="timer-custom-title">自定义这一步时长</text>
            <text class="timer-custom-sub">默认带入步骤建议时间，也可以按实际火候重新调整。</text>
          </view>
          <view class="timer-custom-input">
            <input
              v-model="customMinutes"
              type="number"
              maxlength="3"
              confirm-type="done"
              placeholder="输入分钟"
              @confirm="normalizeCustomMinutesInput"
              @blur="normalizeCustomMinutesInput"
            />
            <text class="timer-custom-unit">分钟</text>
          </view>
        </view>

        <view class="timer-actions">
          <button
            v-if="currentStepTimerActive && store.kitchenTimer.status === 'running'"
            class="ghost-btn"
            hover-class="tap"
            @tap="pauseStepTimer"
          >
            暂停
          </button>
          <button
            v-else-if="currentStepTimerActive && store.kitchenTimer.status === 'paused'"
            class="ghost-btn"
            hover-class="tap"
            @tap="resumeStepTimer"
          >
            继续
          </button>
          <button v-else class="ghost-btn" hover-class="tap" @tap="collapseTimerPanel">先不计时</button>

          <button class="primary-btn" hover-class="tap" @tap="applyStepTimer">
            {{ timerPrimaryActionText }}
          </button>
        </view>

        <button
          v-if="canResetTimer"
          class="timer-reset"
          hover-class="tap"
          @tap="resetTimer"
        >
          {{ timerResetText }}
        </button>
      </view>
    </view>

    <view class="step-actions">
      <button class="ghost-btn" hover-class="tap" @tap="prev">上一步</button>
      <button class="primary-btn" hover-class="tap" @tap="next">{{ isLast ? '完成步骤' : '下一步' }}</button>
    </view>
    <button class="finish-btn" hover-class="tap" @tap="finish">✓ 标记完成</button>
  </AppPage>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { onHide, onLoad, onShow } from '@dcloudio/uni-app'
import AppPage from '@/components/AppPage.vue'
import StepCookCard from '@/components/StepCookCard.vue'
import StepProgress from '@/components/StepProgress.vue'
import { icons } from '@/data/assets'
import { useKitchenStore } from '@/stores/kitchen'
import { primeKitchenTimerAlert } from '@/utils/kitchen-timer-alert'

const store = useKitchenStore()
const itemId = ref('')
const now = ref(Date.now())
const timerPanelExpanded = ref(false)
const customMinutes = ref('')
const presetMinutes = [3, 5, 8, 10, 12, 15, 20, 30]
let clockId: ReturnType<typeof setInterval> | undefined

onLoad((query) => {
  if (query?.itemId && typeof query.itemId === 'string') itemId.value = query.itemId
})

onShow(() => {
  store.hydrate()
  store.syncKitchenTimer()
  startClock()
  if (!store.user) {
    uni.reLaunch({ url: '/pages/login/index' })
    return
  }
  syncTimerDraftFromStep()
  store.refreshSessionData()
})

onHide(() => {
  stopClock()
})

onBeforeUnmount(() => {
  stopClock()
})

const item = computed(() => store.menu.items.find((candidate) => candidate.id === itemId.value))
const dish = computed(() => (item.value ? store.getDish(item.value.dishId) : undefined))
const currentStep = computed(() => {
  const currentDish = dish.value
  if (!currentDish?.steps?.length) return undefined
  const stepIndex = Math.max(0, (item.value?.currentStep || 1) - 1)
  return currentDish.steps[stepIndex] || currentDish.steps[0]
})
const isLast = computed(() => Boolean(dish.value && item.value && item.value.currentStep >= dish.value.steps.length))
const remainingMinutes = computed(() => {
  if (!dish.value || !item.value) return 0
  const currentIndex = Math.max(0, (item.value.currentStep || 1) - 1)
  return dish.value.steps.slice(currentIndex).reduce((sum, step) => sum + Math.max(0, step.minutes || 0), 0)
})
const currentStepTimerActive = computed(() => {
  const context = store.kitchenTimer.context
  return Boolean(
    item.value &&
    currentStep.value &&
    context?.type === 'step' &&
    context.itemId === item.value.id &&
    context.stepNo === currentStep.value?.stepNo
  )
})
const hasStepTimer = computed(() => store.kitchenTimer.context?.type === 'step' && store.kitchenTimer.status !== 'idle')
const anotherStepTimerActive = computed(() => Boolean(hasStepTimer.value && !currentStepTimerActive.value))
const globalTimerRemainingMs = computed(() => {
  if (store.kitchenTimer.status === 'running' && store.kitchenTimer.endAt) {
    return Math.max(0, store.kitchenTimer.endAt - now.value)
  }
  return store.kitchenTimer.remainingMs
})
const timerDraftMinutes = computed(() => normalizeMinutes(customMinutes.value) || defaultStepMinutes())
const timerSummaryTitle = computed(() => {
  if (currentStepTimerActive.value && store.kitchenTimer.status === 'running') return `第 ${currentStep.value?.stepNo} 步正在计时`
  if (currentStepTimerActive.value && store.kitchenTimer.status === 'paused') return `第 ${currentStep.value?.stepNo} 步计时已暂停`
  if (currentStepTimerActive.value && store.kitchenTimer.status === 'finished') return `第 ${currentStep.value?.stepNo} 步计时已结束`
  if (anotherStepTimerActive.value) {
    return `${store.kitchenTimer.context?.dishName || '另一道菜'} · 第 ${store.kitchenTimer.context?.stepNo || 1} 步正在计时`
  }
  return `为第 ${currentStep.value?.stepNo || 1} 步准备计时`
})
const timerSummarySub = computed(() => {
  if (currentStepTimerActive.value && store.kitchenTimer.status === 'running') return '离开当前页面也会继续倒计时，结束时会全局强提醒。'
  if (currentStepTimerActive.value && store.kitchenTimer.status === 'paused') return '剩余时间已经保留，继续或重新设定都在本页完成。'
  if (currentStepTimerActive.value && store.kitchenTimer.status === 'finished') return '这一段步骤的提醒已完成，可以直接再来一轮。'
  if (anotherStepTimerActive.value) return '当前已有别的步骤在计时，如果重新开始会切换为当前这一步。'
  return '默认带入当前步骤所需时间，适合焖、蒸、煮这类需要盯时间的操作。'
})
const timerToggleText = computed(() => {
  if (timerPanelExpanded.value) return '收起'
  if (currentStepTimerActive.value && store.kitchenTimer.status === 'running') return '调整'
  return '计时'
})
const timerHeroLabel = computed(() => {
  if (currentStepTimerActive.value && store.kitchenTimer.status === 'running') return '剩余时间'
  if (currentStepTimerActive.value && store.kitchenTimer.status === 'paused') return '暂停在'
  if (anotherStepTimerActive.value && store.kitchenTimer.status === 'running') return '当前已有'
  return '建议时长'
})
const timerHeroValue = computed(() => {
  if (hasStepTimer.value) return formatDuration(globalTimerRemainingMs.value)
  return `${timerDraftMinutes.value} 分钟`
})
const timerHeroMetaTop = computed(() => {
  if (currentStepTimerActive.value) return currentStep.value?.title || '当前步骤'
  if (anotherStepTimerActive.value) return store.kitchenTimer.context?.stepTitle || `第 ${store.kitchenTimer.context?.stepNo || 1} 步`
  return currentStep.value?.heat || '按步骤建议'
})
const timerHeroMetaBottom = computed(() => {
  if (currentStepTimerActive.value && store.kitchenTimer.status === 'running') return '结束后全局弹窗提醒'
  if (currentStepTimerActive.value && store.kitchenTimer.status === 'paused') return '可直接继续当前计时'
  if (anotherStepTimerActive.value) return '重新开始会切换到当前步骤'
  return `默认填充 ${defaultStepMinutes()} 分钟`
})
const timerPrimaryActionText = computed(() => {
  if (currentStepTimerActive.value && store.kitchenTimer.status === 'running') return '按新时长重开'
  if (currentStepTimerActive.value && store.kitchenTimer.status === 'paused') return '按新时长开始'
  return '开始计时'
})
const canResetTimer = computed(() => hasStepTimer.value)
const timerResetText = computed(() => {
  if (currentStepTimerActive.value) return '结束当前步骤计时'
  return '结束现有计时'
})

function goBack() {
  uni.navigateBack()
}

function prev() {
  if (!item.value) return
  store.setStep(item.value.id, item.value.currentStep - 1)
}

function next() {
  if (!item.value || !dish.value) return
  if (isLast.value) {
    finish()
  } else {
    store.setStep(item.value.id, item.value.currentStep + 1)
  }
}

function finish() {
  if (!item.value) return
  store.completeDish(item.value.id)
  uni.navigateTo({ url: `/pages/upload/index?itemId=${item.value.id}` })
}

watch(
  () => [item.value?.currentStep, currentStep.value?.minutes, currentStepTimerActive.value] as const,
  (payload) => {
    if (!payload) return
    const [, , active] = payload
    if (active) {
      customMinutes.value = String(Math.max(1, Math.round(store.kitchenTimer.durationMs / 60000)))
      return
    }
    syncTimerDraftFromStep()
  },
  { immediate: true }
)

function toggleTimerPanel() {
  if (timerPanelExpanded.value) {
    timerPanelExpanded.value = false
    return
  }
  syncTimerDraftFromStep()
  timerPanelExpanded.value = true
}

function collapseTimerPanel() {
  timerPanelExpanded.value = false
}

async function applyStepTimer() {
  if (!item.value || !currentStep.value) return
  const minutes = timerDraftMinutes.value
  await primeKitchenTimerAlert()
  uni.hideKeyboard()
  store.startStepKitchenTimer(item.value.id, minutes)
  timerPanelExpanded.value = true
  uni.showToast({ title: `已为第 ${currentStep.value.stepNo} 步开始 ${minutes} 分钟计时`, icon: 'none' })
}

async function resumeStepTimer() {
  await primeKitchenTimerAlert()
  store.resumeKitchenTimer()
  uni.showToast({ title: '继续当前计时', icon: 'none' })
}

function pauseStepTimer() {
  store.pauseKitchenTimer()
  uni.showToast({ title: '已暂停计时', icon: 'none' })
}

function resetTimer() {
  store.resetKitchenTimer()
  syncTimerDraftFromStep()
  uni.showToast({ title: '已结束当前计时', icon: 'none' })
}

function pickPreset(minutes: number) {
  customMinutes.value = String(minutes)
}

function normalizeCustomMinutesInput() {
  const minutes = normalizeMinutes(customMinutes.value)
  customMinutes.value = String(minutes || defaultStepMinutes())
}

function syncTimerDraftFromStep() {
  customMinutes.value = String(defaultStepMinutes())
}

function defaultStepMinutes() {
  return Math.max(1, currentStep.value?.minutes || 1)
}

function normalizeMinutes(value: string) {
  const minutes = Math.round(Number(value))
  if (!minutes || minutes < 1 || minutes > 180) return 0
  return minutes
}

function startClock() {
  stopClock()
  now.value = Date.now()
  clockId = setInterval(() => {
    now.value = Date.now()
  }, 1000)
}

function stopClock() {
  if (!clockId) return
  clearInterval(clockId)
  clockId = undefined
}

function formatDuration(durationMs: number) {
  const totalSeconds = Math.max(0, Math.ceil(durationMs / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${`${minutes}`.padStart(2, '0')}:${`${seconds}`.padStart(2, '0')}`
}
</script>

<style scoped lang="scss">
.step-head {
  display: grid;
  grid-template-columns: 68rpx 86rpx 1fr 178rpx;
  gap: 18rpx;
  align-items: center;
  margin: 28rpx 0 28rpx;
}

.back {
  width: 62rpx;
  height: 62rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-mark {
  color: $text-main;
  font-size: 62rpx;
  font-weight: 400;
  line-height: 1;
}

.dish-thumb {
  width: 86rpx;
  height: 86rpx;
  border-radius: 18rpx;
}

.head-copy {
  min-width: 0;
}

.name {
  display: block;
  color: $text-main;
  font-size: 34rpx;
  font-weight: 900;
}

.head-copy > text:last-child {
  display: block;
  margin-top: 8rpx;
  color: $text-sub;
  font-size: 27rpx;
}

.head-copy strong {
  color: $primary;
  font-size: 36rpx;
}

.remain {
  min-height: 76rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1rpx solid #ffd6bf;
  border-radius: 22rpx;
  background: #fff7ef;
  color: $text-sub;
  font-size: 20rpx;
}

.remain image {
  width: 32rpx;
  height: 32rpx;
}

.remain text:nth-child(2) {
  color: $text-main;
  font-size: 23rpx;
  font-weight: 900;
}

.step-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28rpx;
  margin: 34rpx 10rpx 24rpx;
}

.timer-panel {
  margin-top: 22rpx;
  padding: 24rpx;
  background:
    radial-gradient(circle at 92% 14%, rgba(255, 155, 92, 0.18), transparent 200rpx),
    linear-gradient(135deg, #fffefb 0%, #fff8f0 100%);
}

.timer-panel-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 132rpx;
  gap: 18rpx;
  align-items: start;
}

.timer-panel-copy {
  min-width: 0;
}

.timer-panel-title,
.timer-panel-sub {
  display: block;
}

.timer-panel-title {
  color: $text-main;
  font-size: 30rpx;
  font-weight: 900;
  line-height: 1.45;
}

.timer-panel-sub {
  margin-top: 8rpx;
  color: $text-sub;
  font-size: 24rpx;
  line-height: 1.6;
}

.timer-panel-toggle {
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 22rpx;
  background: rgba(255, 255, 255, 0.92);
  color: $primary;
  font-size: 26rpx;
  font-weight: 900;
  box-shadow: inset 0 0 0 2rpx rgba(255, 138, 42, 0.16);
}

.timer-hero {
  display: grid;
  grid-template-columns: 88rpx minmax(0, 1fr) auto;
  gap: 18rpx;
  align-items: center;
  margin-top: 22rpx;
  padding: 24rpx 22rpx;
  border-radius: 24rpx;
  background:
    linear-gradient(180deg, rgba(255, 250, 245, 0.98) 0%, rgba(255, 255, 255, 0.98) 100%);
  box-shadow: inset 0 0 0 1rpx rgba(255, 220, 197, 0.9);
}

.timer-hero-badge {
  width: 88rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 28rpx;
  background: #fff3e7;
}

.timer-hero-badge image {
  width: 48rpx;
  height: 48rpx;
}

.timer-hero-copy,
.timer-hero-meta {
  min-width: 0;
}

.timer-hero-label,
.timer-hero-value,
.timer-hero-meta text {
  display: block;
}

.timer-hero-label {
  color: $primary;
  font-size: 23rpx;
  font-weight: 900;
  letter-spacing: 2rpx;
}

.timer-hero-value {
  margin-top: 8rpx;
  color: $text-main;
  font-size: 52rpx;
  font-weight: 900;
  line-height: 1;
}

.timer-hero-meta {
  text-align: right;
}

.timer-hero-meta text:first-child {
  color: $text-main;
  font-size: 24rpx;
  font-weight: 900;
  line-height: 1.45;
}

.timer-hero-meta text:last-child {
  margin-top: 10rpx;
  color: $text-sub;
  font-size: 22rpx;
  line-height: 1.45;
}

.timer-editor {
  margin-top: 22rpx;
}

.preset-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14rpx;
}

.preset-pill {
  height: 66rpx;
  border: 1rpx solid rgba(233, 220, 208, 0.96);
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.94);
  color: $text-sub;
  font-size: 24rpx;
  font-weight: 800;
}

.preset-pill.active {
  border-color: #ffc49f;
  background: #fff3ea;
  color: $primary;
}

.timer-custom {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 180rpx;
  gap: 16rpx;
  align-items: center;
  margin-top: 18rpx;
  padding: 22rpx 20rpx;
  border-radius: 24rpx;
  background: rgba(255, 253, 249, 0.96);
  box-shadow: inset 0 0 0 1rpx rgba(255, 228, 210, 0.9);
}

.timer-custom-copy {
  min-width: 0;
}

.timer-custom-title,
.timer-custom-sub {
  display: block;
}

.timer-custom-title {
  color: $text-main;
  font-size: 27rpx;
  font-weight: 900;
}

.timer-custom-sub {
  margin-top: 8rpx;
  color: $text-sub;
  font-size: 22rpx;
  line-height: 1.55;
}

.timer-custom-input {
  height: 80rpx;
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 0 18rpx;
  border-radius: 22rpx;
  background: #fff;
  box-shadow: inset 0 0 0 1rpx rgba(232, 216, 204, 0.98);
}

.timer-custom-input input {
  flex: 1;
  min-width: 0;
  height: 100%;
  color: $text-main;
  font-size: 34rpx;
  font-weight: 900;
  text-align: right;
}

.timer-custom-unit {
  color: $text-sub;
  font-size: 24rpx;
  font-weight: 700;
}

.timer-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18rpx;
  margin-top: 18rpx;
}

.timer-reset {
  width: 100%;
  margin-top: 16rpx;
  color: $text-sub;
  font-size: 24rpx;
  font-weight: 800;
  line-height: 1.4;
}

.finish-btn {
  height: 82rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1rpx solid #ffd7bf;
  border-radius: 999rpx;
  background: #fff9f4;
  color: $primary;
  font-size: 31rpx;
  font-weight: 900;
}
</style>
