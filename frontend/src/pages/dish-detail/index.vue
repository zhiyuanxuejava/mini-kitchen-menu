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
      <text class="photo-count">1 / {{ dish.steps.length + 3 }}</text>
    </view>

    <view class="detail-actions">
      <button class="primary-btn" hover-class="tap" @tap="store.addToMenu(dish.id)">＋ 加入点菜单</button>
      <button v-if="canEdit" class="ghost-btn" hover-class="tap" @tap="editDish">✎ 编辑菜品</button>
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
      <SectionTitle title="做法步骤" />
      <view v-for="step in dish.steps" :key="step.id" class="step-row">
        <text class="step-no">{{ step.stepNo }}</text>
        <view class="step-copy">
          <text class="step-name">{{ step.title }}</text>
          <text class="step-desc">{{ step.description }}</text>
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
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18rpx;
  margin: 28rpx 0;
}

.detail-actions .primary-btn:only-child {
  grid-column: 1 / -1;
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
