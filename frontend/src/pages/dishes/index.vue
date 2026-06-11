<template>
  <AppPage class="dishes-page">
    <view class="page-head">
      <text class="title-xl">我的<text class="accent">菜品库</text></text>
      <image :src="icons.basket" mode="aspectFit" />
    </view>
    <view class="search-box">
      <image :src="icons.search" class="icon-36" mode="aspectFit" />
      <input v-model="keyword" placeholder="搜索菜名 / 食材 / 做法" />
    </view>

    <scroll-view scroll-x class="category-tabs" show-scrollbar="false">
      <view class="tab-track">
      <button
        v-for="item in categories"
        :key="item.key"
        :class="['category', activeCategory === item.key ? 'active' : '']"
        hover-class="tap"
        @tap="activeCategory = item.key"
      >
        {{ item.label }}
      </button>
      </view>
    </scroll-view>

    <view class="source-tabs card">
      <button
        v-for="item in sourceOptions"
        :key="item.key"
        :class="{ active: activeSource === item.key }"
        hover-class="tap"
        @tap="activeSource = item.key"
      >
        {{ item.label }}
      </button>
    </view>

    <view class="filter-row card">
      <button>难度⌄</button>
      <button>时间⌄</button>
      <button>口味⌄</button>
      <button>最近评分⌄</button>
    </view>

    <button class="add-dish card" hover-class="tap" @tap="goCreate">
      <text class="plus-mark">+</text>
      <text>新增菜品</text>
      <image class="pot" :src="icons.pot" mode="aspectFit" />
    </button>

    <DishListItem
      v-for="dish in dishes"
      :key="dish.id"
      :dish="dish"
      @view="viewDish"
      @add="store.addToMenu"
    />
    <view v-if="store.loading" class="loading-card card">正在同步后台菜品...</view>
    <view v-if="store.apiError" class="api-error card">{{ store.apiError }}</view>
    <EmptyState v-if="!dishes.length" title="没有找到菜品" desc="换个关键词，或新增一道自己的拿手菜。" />

    <BottomTabbar active="dishes" />
  </AppPage>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import AppPage from '@/components/AppPage.vue'
import BottomTabbar from '@/components/BottomTabbar.vue'
import DishListItem from '@/components/DishListItem.vue'
import EmptyState from '@/components/EmptyState.vue'
import { icons } from '@/data/assets'
import { categoryLabels } from '@/data/seed'
import type { DishCategory, DishSourceType } from '@/data/types'
import { useKitchenStore } from '@/stores/kitchen'

const store = useKitchenStore()
const keyword = ref('')
const activeCategory = ref<DishCategory | 'all'>('all')
const activeSource = ref<DishSourceType | 'all'>('all')
const categories = (Object.keys(categoryLabels) as Array<DishCategory | 'all'>).map((key) => ({
  key,
  label: categoryLabels[key]
}))
const sourceOptions: Array<{ key: DishSourceType | 'all'; label: string }> = [
  { key: 'all', label: '全部来源' },
  { key: 'system_sync', label: '后台同步' },
  { key: 'user_created', label: '我录入的' }
]

onLoad((query) => {
  if (query?.keyword && typeof query.keyword === 'string') keyword.value = query.keyword
})

onShow(async () => {
  store.hydrate()
  if (!store.user) uni.reLaunch({ url: '/pages/login/index' })
  else await store.ensureRemoteDishes()
})

const dishes = computed(() => store.dishesByCategory(activeCategory.value, keyword.value, activeSource.value))

function viewDish(id: string) {
  uni.navigateTo({ url: `/pages/dish-detail/index?id=${id}` })
}

function goCreate() {
  uni.navigateTo({ url: '/pages/dish-form/index' })
}
</script>

<style scoped lang="scss">
.dishes-page {
  padding-top: 34rpx;
  padding-bottom: calc(300rpx + env(safe-area-inset-bottom));
}

.page-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin: 10rpx 0 24rpx;
}

.page-head image {
  width: 146rpx;
  height: 116rpx;
  margin-top: 8rpx;
}

.search-box input {
  flex: 1;
  height: 68rpx;
  color: $text-main;
  font-size: 28rpx;
}

.category-tabs {
  width: 100%;
  margin: 26rpx 0 22rpx;
  white-space: nowrap;
}

.tab-track {
  display: flex;
  gap: 14rpx;
  min-width: max-content;
}

.category {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  height: 66rpx;
  padding: 0 24rpx;
  border: 1rpx solid $border;
  border-radius: 28rpx;
  background: #fff;
  color: $text-main;
  font-size: 28rpx;
  font-weight: 800;
}

.category.active {
  border-color: $primary;
  color: $primary;
  background: #fff8f2;
}

.source-tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  height: 72rpx;
  padding: 8rpx;
  margin-bottom: 22rpx;
  border-radius: 24rpx;
}

.source-tabs button {
  height: 56rpx;
  border-radius: 18rpx;
  color: $text-sub;
  font-size: 24rpx;
  font-weight: 800;
}

.source-tabs button.active {
  background: $text-main;
  color: #fff;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: center;
  height: 72rpx;
  padding: 0;
  margin-bottom: 22rpx;
  border-radius: 22rpx;
}

.filter-row button,
.filter-row uni-button {
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $text-main;
  font-size: 25rpx;
  font-weight: 500;
  line-height: 1;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.filter-row button::after,
.filter-row uni-button::after {
  border: 0;
}

.add-dish {
  position: relative;
  height: 92rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14rpx;
  overflow: hidden;
  margin-bottom: 22rpx;
  color: $primary;
  font-size: 31rpx;
  font-weight: 900;
}

.plus-mark {
  width: 52rpx;
  height: 52rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, $primary-2 0%, $primary 100%);
  color: #fff;
  font-size: 42rpx;
  font-weight: 500;
  line-height: 1;
}

.add-dish .pot {
  position: absolute;
  right: 28rpx;
  bottom: -2rpx;
  width: 118rpx;
  height: 92rpx;
}

.loading-card,
.api-error {
  padding: 22rpx;
  margin-bottom: 18rpx;
  color: $text-sub;
  font-size: 25rpx;
  text-align: center;
}

.api-error {
  color: #d34b2f;
}
</style>
