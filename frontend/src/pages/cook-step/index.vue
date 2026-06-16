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
        <button class="timer-panel-toggle" hover-class="tap" @tap="openTimerDialog">
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

      <view class="timer-status-note">
        <text>{{ timerStatusNote }}</text>
      </view>

      <view v-if="otherRunningTimers.length" class="timer-peer-list">
        <view class="timer-peer-head">
          <text>其他菜计时中</text>
          <text>{{ otherRunningTimers.length }} 个并行提醒</text>
        </view>

        <button
          v-for="timer in otherRunningTimers.slice(0, 3)"
          :key="timer.id"
          class="timer-peer-card"
          hover-class="tap"
          @tap="goPeerTimer(timer.context.itemId)"
        >
          <view class="timer-peer-copy">
            <text class="timer-peer-title">{{ timer.context.dishName || '其他菜品' }}</text>
            <text class="timer-peer-sub">第 {{ timer.context.stepNo || 1 }} 步 · {{ timer.context.stepTitle || '当前步骤' }}</text>
          </view>
          <view class="timer-peer-meta">
            <text>{{ timer.status === 'paused' ? '已暂停' : formatDuration(store.kitchenTimerRemaining(timer.id)) }}</text>
            <text>{{ timer.status === 'paused' ? '待继续' : '去查看' }}</text>
          </view>
        </button>
      </view>
    </view>

    <view v-if="timerDialogVisible" class="timer-dialog-layer">
      <view class="timer-dialog-mask" @tap="closeTimerDialog" />
      <view class="timer-dialog card" @tap.stop>
        <view class="timer-dialog-glow" />

        <view class="timer-dialog-head">
          <view class="timer-dialog-badge">
            <image :src="icons.timer" mode="aspectFit" />
          </view>
          <view class="timer-dialog-copy">
            <text class="timer-dialog-title">{{ timerDialogTitle }}</text>
            <text class="timer-dialog-sub">{{ timerDialogSub }}</text>
          </view>
        </view>

        <view class="timer-parallel-note">
          <text class="timer-parallel-title">计时规则</text>
          <text class="timer-parallel-sub">同一道菜只保留 1 个计时器；不同菜品的计时会同时生效，刷新后也会继续显示。</text>
        </view>

        <view class="timer-editor">
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
              <text class="timer-custom-title">设置这一步计时</text>
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
            <button class="ghost-btn" hover-class="tap" @tap="handleTimerSecondaryAction">
              {{ timerSecondaryActionText }}
            </button>

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
import type { KitchenTimer } from '@/data/types'
import { useKitchenStore } from '@/stores/kitchen'
import { primeKitchenTimerAlert } from '@/utils/kitchen-timer-alert'

const store = useKitchenStore()
const itemId = ref('')
const now = ref(Date.now())
const timerDialogVisible = ref(false)
const customMinutes = ref('')
const presetMinutes = [3, 5, 8, 10, 12, 15, 20, 30]
let clockId: ReturnType<typeof setInterval> | undefined

onLoad((query) => {
  if (query?.itemId && typeof query.itemId === 'string') itemId.value = query.itemId
})

onShow(() => {
  store.hydrate()
  store.syncKitchenTimers()
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
const stepTimer = computed(() => (item.value ? store.getStepTimerByItem(item.value.id) : undefined))
const timerMatchesCurrentStep = computed(() => Boolean(stepTimer.value && currentStep.value && stepTimer.value.context.stepNo === currentStep.value.stepNo))
const otherRunningTimers = computed(() => store.activeKitchenTimers.filter((timer) => timer.id !== stepTimer.value?.id))
const stepTimerRemainingMs = computed(() => {
  if (!stepTimer.value) return Math.max(0, timerDraftMinutes.value * 60 * 1000)
  if (stepTimer.value.status === 'running' && stepTimer.value.endAt) return Math.max(0, stepTimer.value.endAt - now.value)
  return stepTimer.value.remainingMs
})
const timerDraftMinutes = computed(() => normalizeMinutes(customMinutes.value) || defaultStepMinutes())
const timerSummaryTitle = computed(() => {
  if (timerMatchesCurrentStep.value && stepTimer.value?.status === 'running') return `第 ${currentStep.value?.stepNo} 步正在计时`
  if (timerMatchesCurrentStep.value && stepTimer.value?.status === 'paused') return `第 ${currentStep.value?.stepNo} 步计时已暂停`
  if (stepTimer.value?.status === 'running') return `当前菜品第 ${stepTimer.value.context.stepNo || 1} 步正在计时`
  if (stepTimer.value?.status === 'paused') return `当前菜品第 ${stepTimer.value.context.stepNo || 1} 步计时已暂停`
  if (otherRunningTimers.value.length) return `还有 ${otherRunningTimers.value.length} 个其他菜品计时中`
  return `为第 ${currentStep.value?.stepNo || 1} 步准备计时`
})
const timerSummarySub = computed(() => {
  if (timerMatchesCurrentStep.value && stepTimer.value?.status === 'running') return '刷新页面或离开当前步骤，倒计时也会继续，结束时会全局弹出提醒。'
  if (timerMatchesCurrentStep.value && stepTimer.value?.status === 'paused') return '这一步剩余时间已保留，继续或重新设定都在当前弹窗里完成。'
  if (stepTimer.value?.status === 'running') return '同一道菜只保留一个计时器，当前设置新的步骤时间会直接覆盖这道菜原来的计时。'
  if (stepTimer.value?.status === 'paused') return '这道菜已有暂停计时，可以继续，也可以按当前步骤重新设定。'
  if (otherRunningTimers.value.length) return '不同菜品的定时可以同时进行，当前菜的计时不会影响其他菜。'
  return '默认带入当前步骤所需时间，适合焖、蒸、煮这类需要盯时间的操作。'
})
const timerToggleText = computed(() => {
  if (timerDialogVisible.value) return '配置中'
  if (stepTimer.value?.status === 'running' || stepTimer.value?.status === 'paused') return '管理'
  return '计时'
})
const timerHeroLabel = computed(() => {
  if (stepTimer.value?.status === 'running') return '剩余时间'
  if (stepTimer.value?.status === 'paused') return '暂停在'
  if (otherRunningTimers.value.length) return '并行计时'
  return '建议时长'
})
const timerHeroValue = computed(() => {
  if (stepTimer.value) return formatDuration(stepTimerRemainingMs.value)
  if (otherRunningTimers.value.length) return `${otherRunningTimers.value.length} 个`
  return `${timerDraftMinutes.value} 分钟`
})
const timerHeroMetaTop = computed(() => {
  if (stepTimer.value) return stepTimer.value.context.stepTitle || `第 ${stepTimer.value.context.stepNo || 1} 步`
  if (otherRunningTimers.value.length) return `${otherRunningTimers.value[0]?.context.dishName || '其他菜品'} 等`
  return currentStep.value?.heat || '按步骤建议'
})
const timerHeroMetaBottom = computed(() => {
  if (stepTimer.value?.status === 'running') return '同一道菜只保留 1 个计时器'
  if (stepTimer.value?.status === 'paused') return '可继续，也可按新时长重开'
  if (otherRunningTimers.value.length) return '不同菜品可以同时计时'
  return `默认填充 ${defaultStepMinutes()} 分钟`
})
const timerPrimaryActionText = computed(() => {
  if (stepTimer.value?.status === 'running') return '按新时长重开'
  if (stepTimer.value?.status === 'paused') return '按新时长开始'
  return '开始计时'
})
const canResetTimer = computed(() => Boolean(stepTimer.value))
const timerResetText = computed(() => {
  if (!stepTimer.value) return ''
  return `结束“第 ${stepTimer.value.context.stepNo || 1} 步”计时`
})
const timerSecondaryActionText = computed(() => {
  if (stepTimer.value?.status === 'running') return '暂停'
  if (stepTimer.value?.status === 'paused') return '继续'
  return '暂不计时'
})
const timerStatusNote = computed(() => {
  if (timerMatchesCurrentStep.value && stepTimer.value?.status === 'running') return '当前步骤正在计时，页面刷新后也会继续显示。'
  if (timerMatchesCurrentStep.value && stepTimer.value?.status === 'paused') return '当前步骤计时已暂停，再次打开配置就能继续。'
  if (stepTimer.value?.status === 'running') return `这道菜当前在计时的是第 ${stepTimer.value.context.stepNo || 1} 步“${stepTimer.value.context.stepTitle || '当前步骤'}”。`
  if (stepTimer.value?.status === 'paused') return `这道菜已有暂停中的第 ${stepTimer.value.context.stepNo || 1} 步计时。`
  if (otherRunningTimers.value.length) return `当前还有 ${otherRunningTimers.value.length} 道其他菜在计时，提醒会一起弹出并可逐条处理。`
  return '点击右上角“计时”会弹出独立配置窗口，避免和步骤操作混在一起。'
})
const timerDialogTitle = computed(() => {
  if (timerMatchesCurrentStep.value && stepTimer.value?.status === 'running') return `调整第 ${currentStep.value?.stepNo || 1} 步计时`
  if (timerMatchesCurrentStep.value && stepTimer.value?.status === 'paused') return `继续第 ${currentStep.value?.stepNo || 1} 步计时`
  if (stepTimer.value) return `重设当前菜品计时`
  return `配置第 ${currentStep.value?.stepNo || 1} 步计时`
})
const timerDialogSub = computed(() => {
  if (otherRunningTimers.value.length) return `当前另有 ${otherRunningTimers.value.length} 个其他菜品计时正在运行，不会和这道菜冲突。`
  return '把计时设置放进独立弹窗里，步骤阅读和下一步操作不会再互相打断。'
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
  uni.navigateTo({ url: `/pages/upload/index?itemId=${item.value.id}&dishId=${item.value.dishId}` })
}

watch(
  () => [item.value?.currentStep, currentStep.value?.minutes, stepTimer.value?.id, stepTimer.value?.durationMs, timerMatchesCurrentStep.value] as const,
  (payload) => {
    if (!payload) return
    const [, , , durationMs, active] = payload
    if (active && durationMs) {
      customMinutes.value = String(Math.max(1, Math.round(durationMs / 60000)))
      return
    }
    syncTimerDraftFromStep()
  },
  { immediate: true }
)

function openTimerDialog() {
  syncTimerDraftFromStep()
  timerDialogVisible.value = true
}

function closeTimerDialog() {
  timerDialogVisible.value = false
}

async function applyStepTimer() {
  if (!item.value || !currentStep.value) return
  const minutes = timerDraftMinutes.value
  await primeKitchenTimerAlert()
  uni.hideKeyboard()
  store.startStepKitchenTimer(item.value.id, minutes)
  timerDialogVisible.value = false
  uni.showToast({ title: `已为第 ${currentStep.value.stepNo} 步开始 ${minutes} 分钟计时`, icon: 'none' })
}

async function resumeStepTimer() {
  if (!stepTimer.value) return
  await primeKitchenTimerAlert()
  store.resumeKitchenTimer(stepTimer.value.id)
  timerDialogVisible.value = false
  uni.showToast({ title: '继续当前计时', icon: 'none' })
}

function pauseStepTimer() {
  if (!stepTimer.value) return
  store.pauseKitchenTimer(stepTimer.value.id)
  uni.showToast({ title: '已暂停计时', icon: 'none' })
}

function resetTimer() {
  if (!stepTimer.value) return
  store.resetKitchenTimer(stepTimer.value.id)
  syncTimerDraftFromStep()
  timerDialogVisible.value = false
  uni.showToast({ title: '已结束当前计时', icon: 'none' })
}

function handleTimerSecondaryAction() {
  if (stepTimer.value?.status === 'running') {
    pauseStepTimer()
    return
  }
  if (stepTimer.value?.status === 'paused') {
    resumeStepTimer()
    return
  }
  closeTimerDialog()
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

function goPeerTimer(targetItemId?: string) {
  if (!targetItemId || targetItemId === item.value?.id) return
  uni.navigateTo({ url: `/pages/cook-step/index?itemId=${targetItemId}` })
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
  background: linear-gradient(180deg, rgba(255, 250, 245, 0.98) 0%, rgba(255, 255, 255, 0.98) 100%);
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

.timer-status-note {
  margin-top: 18rpx;
  padding: 18rpx 20rpx 0;
}

.timer-status-note text {
  display: block;
  color: $text-sub;
  font-size: 22rpx;
  line-height: 1.55;
}

.timer-peer-list {
  margin-top: 20rpx;
  padding-top: 18rpx;
  border-top: 1rpx dashed rgba(229, 209, 193, 0.96);
}

.timer-peer-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
  margin-bottom: 14rpx;
}

.timer-peer-head text:first-child {
  color: $text-main;
  font-size: 24rpx;
  font-weight: 900;
}

.timer-peer-head text:last-child {
  color: $text-sub;
  font-size: 22rpx;
}

.timer-peer-card {
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 14rpx;
  align-items: center;
  padding: 18rpx 18rpx 18rpx 20rpx;
  margin-top: 12rpx;
  border-radius: 22rpx;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: inset 0 0 0 1rpx rgba(255, 226, 208, 0.92);
}

.timer-peer-copy,
.timer-peer-meta {
  min-width: 0;
}

.timer-peer-title,
.timer-peer-sub,
.timer-peer-meta text {
  display: block;
}

.timer-peer-title {
  color: $text-main;
  font-size: 26rpx;
  font-weight: 900;
}

.timer-peer-sub {
  margin-top: 6rpx;
  color: $text-sub;
  font-size: 22rpx;
  line-height: 1.5;
}

.timer-peer-meta {
  text-align: right;
}

.timer-peer-meta text:first-child {
  color: $primary;
  font-size: 24rpx;
  font-weight: 900;
}

.timer-peer-meta text:last-child {
  margin-top: 8rpx;
  color: $text-sub;
  font-size: 21rpx;
}

.timer-dialog-layer {
  position: fixed;
  inset: 0;
  z-index: 46;
}

.timer-dialog-mask {
  position: absolute;
  inset: 0;
  background: rgba(48, 30, 20, 0.42);
}

.timer-dialog {
  position: absolute;
  left: 50%;
  bottom: calc(28rpx + env(safe-area-inset-bottom));
  width: calc(100% - 56rpx);
  max-width: 402px;
  padding: 30rpx 26rpx 26rpx;
  overflow: hidden;
  background:
    radial-gradient(circle at 88% 10%, rgba(255, 161, 101, 0.22), transparent 190rpx),
    linear-gradient(180deg, #fffefc 0%, #fff7ef 100%);
  transform: translateX(-50%);
}

.timer-dialog-glow {
  position: absolute;
  right: -26rpx;
  top: -24rpx;
  width: 190rpx;
  height: 190rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 167, 102, 0.22) 0%, rgba(255, 167, 102, 0) 72%);
}

.timer-dialog-head {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 86rpx minmax(0, 1fr);
  gap: 18rpx;
  align-items: center;
}

.timer-dialog-badge {
  width: 86rpx;
  height: 86rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 26rpx;
  background: rgba(255, 246, 237, 0.96);
}

.timer-dialog-badge image {
  width: 46rpx;
  height: 46rpx;
}

.timer-dialog-copy {
  min-width: 0;
}

.timer-dialog-title,
.timer-dialog-sub {
  display: block;
}

.timer-dialog-title {
  color: $text-main;
  font-size: 31rpx;
  font-weight: 900;
  line-height: 1.4;
}

.timer-dialog-sub {
  margin-top: 8rpx;
  color: $text-sub;
  font-size: 23rpx;
  line-height: 1.55;
}

.timer-parallel-note {
  position: relative;
  z-index: 1;
  margin-top: 20rpx;
  padding: 20rpx 18rpx;
  border: 1rpx solid rgba(255, 202, 169, 0.92);
  border-radius: 22rpx;
  background: rgba(255, 252, 247, 0.94);
}

.timer-parallel-title,
.timer-parallel-sub {
  display: block;
}

.timer-parallel-title {
  color: $primary;
  font-size: 24rpx;
  font-weight: 900;
}

.timer-parallel-sub {
  margin-top: 8rpx;
  color: $text-sub;
  font-size: 22rpx;
  line-height: 1.55;
}

.timer-editor {
  position: relative;
  z-index: 1;
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
