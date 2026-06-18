<template>
  <AppPage v-if="dish">
    <AppNavbar title="菜品详情" back>
      <template #right>
        <image class="nav-more" :src="icons.more" mode="aspectFit" />
      </template>
    </AppNavbar>

    <view class="hero">
      <view class="hero-copy">
        <text class="dish-title">{{ dish.name }} {{ dish.emoji }}</text>
        <text class="dish-desc">{{ dish.description }}</text>
        <view class="tags">
          <text v-for="tag in dish.tasteTags" :key="tag" class="pill">{{ tag }}</text>
          <text class="pill green">{{ dish.difficulty }}难度</text>
        </view>
        <view class="hero-meta">
          <view>
            <image :src="icons.clockOrange" mode="aspectFit" />
            <text>{{ dish.estimatedMinutes }} 分钟</text>
          </view>
          <view>
            <image :src="icons.people" mode="aspectFit" />
            <text>{{ dish.servings }}-{{ dish.servings + 2 }} 人</text>
          </view>
        </view>
      </view>
      <image class="hero-image" :src="dish.detailImage" mode="aspectFill" />
      <text class="photo-count">1 / {{ displaySteps.length + 3 }}</text>
    </view>

    <view class="detail-actions card">
      <view class="detail-actions-head">
        <text class="detail-actions-kicker">快捷操作</text>
        <text class="detail-actions-sub">收藏、学习或直接加入今天的菜单</text>
      </view>

      <button class="detail-primary-btn" hover-class="tap" @tap="store.addToMenu(dish.id)">
        <text class="detail-primary-label">＋ 加入点菜单</text>
      </button>

      <view class="detail-secondary-grid">
        <button
          v-if="canToggleLearned"
          :class="['detail-secondary-btn', dish.learnedAt ? 'active-soft' : '']"
          hover-class="tap"
          @tap="toggleLearned"
        >
          <text class="detail-secondary-label">{{ dish.learnedAt ? '✓ 我已学会' : '○ 未学会' }}</text>
        </button>
        <button
          :class="['detail-secondary-btn', dish.isFavorite ? 'active-warm' : '']"
          hover-class="tap"
          @tap="toggleFavorite"
        >
          <text class="detail-secondary-label">{{ dish.isFavorite ? '♥ 已收藏' : '♡ 收藏菜品' }}</text>
        </button>
        <button
          v-if="canCopyToMine"
          :class="['detail-secondary-btn', isCopiedToMine ? 'active-soft' : '']"
          hover-class="tap"
          :disabled="isCopiedToMine"
          @tap="copyDishToMine"
        >
          <text class="detail-secondary-label">{{ isCopiedToMine ? '已添加到我的菜品' : '＋ 添加到我的菜品' }}</text>
        </button>
        <button v-if="canEdit" class="detail-secondary-btn" hover-class="tap" @tap="editDish">
          <text class="detail-secondary-label">✎ 编辑菜品</text>
        </button>
      </view>
    </view>

    <view v-if="dish.learnedAt" class="learned-banner card">
      <view>
        <text class="learned-title">已加入我学会的菜品</text>
        <text class="learned-time">学会时间：{{ learnedTimeLabel }}</text>
      </view>
      <text class="learned-mark">已掌握</text>
    </view>

    <view class="section-card card">
      <SectionTitle title="菜品备注" />
      <view class="remark-box">
        <text>{{ dish.remark?.trim() || '还没有备注信息，可以在编辑菜品时补充自己的口味偏好、备菜提醒和做法心得。' }}</text>
      </view>
    </view>

    <view class="section-card card">
      <SectionTitle title="食材清单" />
      <view class="ingredient-grid">
        <view v-for="group in ingredientGroups" :key="group.type" class="ingredient-box">
          <text class="ingredient-title">{{ group.label }}</text>
          <view v-for="item in group.items" :key="item.id" class="ingredient-line">
            <text>{{ item.name }}</text>
            <text>{{ item.amount }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="section-card card">
      <SectionTitle :title="hasStructuredSteps ? '做法步骤' : '默认做法'" />
      <view v-if="!hasStructuredSteps" class="step-fallback-note">
        <text>这道菜还没有拆分详细步骤，当前按菜品描述生成了默认第 1 步，后续可在编辑菜品时继续补充。</text>
      </view>
      <view v-for="step in displaySteps" :key="step.id" class="step-row">
        <text class="step-no">{{ step.stepNo }}</text>
        <view class="step-copy">
          <text class="step-name">{{ step.title }}</text>
          <text class="step-desc">{{ step.description }}</text>
          <image class="step-photo" :src="step.image" mode="aspectFill" />
        </view>
        <view class="step-meta">
          <text>🔥 火候：{{ step.heat }}</text>
          <text>🕘 时间：{{ step.minutes }} 分钟</text>
          <text>注意：{{ step.tips }}</text>
        </view>
      </view>
    </view>

    <view class="section-card card">
      <SectionTitle title="做菜小贴士" />
      <view class="tip-grid">
        <view v-for="(tip, index) in dish.tips" :key="tip" class="tip-box">
          <text class="tip-no">{{ index + 1 }}</text>
          <text>{{ tip }}</text>
        </view>
      </view>
    </view>

    <BottomTabbar active="dishes" />
  </AppPage>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import AppNavbar from '@/components/AppNavbar.vue'
import AppPage from '@/components/AppPage.vue'
import BottomTabbar from '@/components/BottomTabbar.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import { icons } from '@/data/assets'
import { groupLabels } from '@/data/labels'
import type { IngredientGroupType } from '@/data/types'
import { useKitchenStore } from '@/stores/kitchen'
import { hasStructuredDishSteps, resolvedDishSteps } from '@/utils/dish-steps'

const store = useKitchenStore()
const id = ref('hongshaorou')

onLoad((query) => {
  if (query?.id && typeof query.id === 'string') id.value = query.id
})

onShow(async () => {
  store.hydrate()
  if (!store.user) uni.reLaunch({ url: '/pages/login/index' })
  else await store.loadDish(id.value)
})

const dish = computed(() => store.getDish(id.value))
const canEdit = computed(() => (dish.value ? store.canEditDish(dish.value) : false))
const canToggleLearned = computed(() => Boolean(dish.value?.id))
const canCopyToMine = computed(() => dish.value?.sourceType !== 'user_created')
const copiedDish = computed(() => (dish.value ? store.copiedDishBySourceId(dish.value.id) : undefined))
const isCopiedToMine = computed(() => Boolean(copiedDish.value))
const learnedTimeLabel = computed(() => formatLearnedTime(dish.value?.learnedAt))
const displaySteps = computed(() => resolvedDishSteps(dish.value))
const hasStructuredSteps = computed(() => hasStructuredDishSteps(dish.value))
const ingredientGroups = computed(() => {
  const types: IngredientGroupType[] = ['main', 'side', 'seasoning']
  return types.map((type) => ({
    type,
    label: groupLabels[type],
    items: dish.value?.ingredients.filter((item) => item.groupType === type) || []
  }))
})

function editDish() {
  uni.navigateTo({ url: `/pages/dish-form/index?id=${id.value}` })
}

async function toggleLearned() {
  if (!dish.value) return
  try {
    const learned = await store.toggleDishLearned(dish.value.id)
    uni.showToast({ title: learned ? '已加入我学会的菜品' : '已取消学会状态', icon: 'none' })
  } catch {
    uni.showToast({ title: store.apiError || '状态更新失败', icon: 'none' })
  }
}

async function toggleFavorite() {
  if (!dish.value) return
  try {
    const favorite = await store.toggleDishFavorite(dish.value.id)
    uni.showToast({ title: favorite ? '已加入收藏' : '已取消收藏', icon: 'none' })
  } catch {
    uni.showToast({ title: store.apiError || '收藏状态更新失败', icon: 'none' })
  }
}

async function copyDishToMine() {
  if (!dish.value || isCopiedToMine.value) return
  try {
    const nextId = await store.copyDishToMine(dish.value.id)
    uni.showToast({ title: '已添加到我的菜品', icon: 'success' })
    uni.navigateTo({ url: `/pages/dish-detail/index?id=${nextId}` })
  } catch {
    uni.showToast({ title: store.apiError || '添加失败', icon: 'none' })
  }
}

function formatLearnedTime(value?: string) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const y = date.getFullYear()
  const m = `${date.getMonth() + 1}`.padStart(2, '0')
  const d = `${date.getDate()}`.padStart(2, '0')
  const h = `${date.getHours()}`.padStart(2, '0')
  const min = `${date.getMinutes()}`.padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${min}`
}

</script>

<style scoped lang="scss">
.nav-more {
  width: 48rpx;
  height: 48rpx;
}

.hero {
  position: relative;
  min-height: 360rpx;
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  align-items: center;
  margin: 8rpx -28rpx 0 0;
  overflow: hidden;
}

.hero-copy {
  position: relative;
  z-index: 1;
}

.dish-title {
  display: block;
  color: $text-main;
  font-size: 58rpx;
  font-weight: 900;
}

.dish-desc {
  display: block;
  margin-top: 16rpx;
  color: $text-sub;
  font-size: 25rpx;
  line-height: 1.5;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 22rpx;
}

.hero-meta {
  display: flex;
  gap: 18rpx;
  margin-top: 22rpx;
}

.hero-meta view {
  min-width: 136rpx;
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 12rpx 16rpx;
  border: 1rpx solid $border;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.9);
  color: $text-main;
  font-size: 24rpx;
  font-weight: 800;
}

.hero-meta image {
  width: 38rpx;
  height: 38rpx;
}

.hero-image {
  width: 100%;
  height: 372rpx;
  border-radius: 36rpx 0 0 36rpx;
}

.photo-count {
  position: absolute;
  right: 18rpx;
  bottom: 16rpx;
  padding: 8rpx 18rpx;
  border-radius: 999rpx;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 24rpx;
}

.detail-actions {
  padding: 24rpx 22rpx 22rpx;
  margin: 28rpx 0;
  background:
    radial-gradient(circle at 92% 14%, rgba(255, 178, 118, 0.18), transparent 180rpx),
    linear-gradient(180deg, #fffefc 0%, #fff8f1 100%);
}

.detail-actions-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18rpx;
  margin-bottom: 18rpx;
}

.detail-actions-kicker,
.detail-actions-sub {
  display: block;
}

.detail-actions-kicker {
  color: $text-main;
  font-size: 24rpx;
  font-weight: 900;
  letter-spacing: 2rpx;
}

.detail-actions-sub {
  color: $text-sub;
  font-size: 22rpx;
  text-align: right;
  line-height: 1.45;
}

.detail-primary-btn,
.detail-actions .detail-primary-btn,
.detail-actions uni-button.detail-primary-btn {
  width: 100%;
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0 28rpx;
  border-radius: 28rpx;
  background: linear-gradient(135deg, $primary-2 0%, $primary 100%);
  color: #fff;
  font-size: 32rpx;
  font-weight: 900;
  line-height: 1.2;
  text-align: center;
  box-shadow:
    0 18rpx 34rpx rgba(255, 123, 37, 0.18),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.18);
}

.detail-primary-label,
.detail-secondary-label {
  display: block;
  width: 100%;
  line-height: 1.2;
  text-align: center;
}

.detail-primary-btn::after,
.detail-actions .detail-primary-btn::after {
  border: 0;
}

.detail-secondary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14rpx;
  margin-top: 14rpx;
}

.detail-secondary-btn,
.detail-actions .detail-secondary-btn,
.detail-actions uni-button.detail-secondary-btn {
  width: 100%;
  min-width: 0;
  height: 86rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0 24rpx;
  border-radius: 26rpx;
  border: 1rpx solid rgba(255, 189, 145, 0.28);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 250, 245, 0.96) 100%);
  color: $primary;
  font-size: 27rpx;
  font-weight: 800;
  line-height: 1.2;
  text-align: center;
  box-shadow:
    inset 0 0 0 1rpx rgba(255, 247, 240, 0.92),
    0 8rpx 18rpx rgba(255, 163, 98, 0.06);
}

.detail-secondary-btn::after,
.detail-actions .detail-secondary-btn::after {
  border: 0;
}

.detail-secondary-btn.active-warm {
  border-color: transparent;
  background: linear-gradient(135deg, #ffb867 0%, $primary 100%);
  color: #fff;
  box-shadow:
    0 16rpx 28rpx rgba(255, 123, 37, 0.16),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.16);
}

.detail-secondary-btn.active-soft {
  border-color: rgba(196, 224, 174, 0.8);
  background: linear-gradient(135deg, #f9fdf4 0%, #eef8e8 100%);
  color: #6f9f4f;
}

.detail-secondary-placeholder {
  min-height: 86rpx;
}

.learned-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
  padding: 22rpx 24rpx;
  margin-bottom: 24rpx;
  background: linear-gradient(135deg, #fffef8 0%, #f4fbef 100%);
}

.remark-box {
  margin-top: 10rpx;
  padding: 22rpx 20rpx;
  border-radius: 20rpx;
  background: linear-gradient(135deg, #fffaf4 0%, #fffefb 100%);
  color: $text-sub;
  font-size: 24rpx;
  line-height: 1.65;
}

.learned-title,
.learned-time {
  display: block;
}

.learned-title {
  color: $text-main;
  font-size: 28rpx;
  font-weight: 900;
}

.learned-time {
  margin-top: 8rpx;
  color: $text-sub;
  font-size: 23rpx;
}

.learned-mark {
  padding: 10rpx 18rpx;
  border-radius: 999rpx;
  background: #eef8e8;
  color: $success;
  font-size: 22rpx;
  font-weight: 900;
}

.section-card {
  padding: 8rpx 20rpx 24rpx;
  margin-bottom: 24rpx;
}

.section-card :deep(.section-title) {
  margin-top: 18rpx;
}

.ingredient-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.ingredient-box {
  min-height: 188rpx;
  padding: 18rpx;
  border: 1rpx solid $border;
  border-radius: 20rpx;
  background: #fffdfb;
}

.ingredient-title {
  display: block;
  margin-bottom: 18rpx;
  color: $primary;
  font-size: 26rpx;
  font-weight: 900;
}

.ingredient-line {
  display: flex;
  justify-content: space-between;
  gap: 8rpx;
  margin-top: 10rpx;
  color: $text-main;
  font-size: 24rpx;
}

.step-row {
  display: grid;
  grid-template-columns: 54rpx minmax(0, 1fr) 236rpx;
  gap: 16rpx;
  align-items: start;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f3e7df;
}

.step-fallback-note {
  margin: 10rpx 0 8rpx;
  padding: 18rpx 20rpx;
  border-radius: 18rpx;
  background: #fff8f1;
  color: $text-sub;
  font-size: 23rpx;
  line-height: 1.55;
}

.step-row:last-child {
  border-bottom: 0;
}

.step-no,
.tip-no {
  width: 42rpx;
  height: 42rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: $primary;
  color: #fff;
  font-size: 24rpx;
  font-weight: 900;
}

.step-copy {
  min-width: 0;
}

.step-name {
  display: block;
  color: $text-main;
  font-size: 28rpx;
  font-weight: 900;
}

.step-desc {
  display: block;
  margin-top: 8rpx;
  color: $text-sub;
  font-size: 23rpx;
  line-height: 1.45;
}

.step-photo {
  width: 100%;
  height: 172rpx;
  margin-top: 14rpx;
  border-radius: 18rpx;
  background: #f8f1eb;
}

.step-meta {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 10rpx 16rpx;
  color: $text-sub;
  font-size: 22rpx;
  text-align: right;
}

.step-meta text:last-child {
  flex-basis: 100%;
  color: $primary;
}

.tip-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14rpx;
}

.tip-box {
  min-height: 104rpx;
  display: flex;
  gap: 12rpx;
  padding: 16rpx;
  border-radius: 18rpx;
  background: #fff8f2;
  color: $text-main;
  font-size: 23rpx;
  line-height: 1.35;
}

.tip-no {
  flex: 0 0 auto;
  width: 32rpx;
  height: 32rpx;
  font-size: 20rpx;
}
</style>
