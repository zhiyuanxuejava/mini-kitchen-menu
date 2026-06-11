<template>
  <AppPage no-tab>
    <AppNavbar title="评分记录" back />
    <view class="sort card">
      <text>按综合评分排序</text>
      <text>共 {{ ratings.length }} 条</text>
    </view>
    <view v-for="item in ratings" :key="item.id" class="rating-item card">
      <image :src="item.dish.coverImage" mode="aspectFill" />
      <view>
        <view class="row">
          <text class="name">{{ item.dish.name }}</text>
          <text class="score">{{ item.overallScore.toFixed(1) }}</text>
        </view>
        <text class="meta">味道 {{ item.tasteScore }} · 外观 {{ item.appearanceScore }} · 火候 {{ item.heatScore }}</text>
        <text class="comment line-clamp-2">{{ item.comment || '暂无文字评价' }}</text>
      </view>
    </view>
    <EmptyState v-if="!ratings.length" title="暂无评分记录" desc="提交成品评分后会在这里看到五维明细。" />
  </AppPage>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppNavbar from '@/components/AppNavbar.vue'
import AppPage from '@/components/AppPage.vue'
import EmptyState from '@/components/EmptyState.vue'
import { useKitchenStore } from '@/stores/kitchen'

const store = useKitchenStore()

onShow(() => {
  store.hydrate()
  if (!store.user) uni.reLaunch({ url: '/pages/login/index' })
})

const ratings = computed(() => {
  const rows = store.ratings
    .map((rating) => {
      const record = store.records.find((item) => item.id === rating.cookRecordId)
      const dish = record ? store.getDish(record.dishId) : undefined
      return dish ? { ...rating, dish } : null
    })
    .filter((item) => item !== null)

  return rows.sort((a, b) => b.overallScore - a.overallScore)
})
</script>

<style scoped lang="scss">
.sort {
  display: flex;
  justify-content: space-between;
  padding: 22rpx 26rpx;
  margin-bottom: 22rpx;
  color: $text-sub;
  font-size: 25rpx;
}

.sort text:first-child {
  color: $text-main;
  font-weight: 900;
}

.rating-item {
  display: grid;
  grid-template-columns: 150rpx 1fr;
  gap: 20rpx;
  padding: 18rpx;
  margin-bottom: 20rpx;
}

.rating-item image {
  width: 150rpx;
  height: 116rpx;
  border-radius: 16rpx;
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 14rpx;
}

.name {
  color: $text-main;
  font-size: 30rpx;
  font-weight: 900;
}

.score {
  color: $primary;
  font-size: 34rpx;
  font-weight: 900;
}

.meta,
.comment {
  display: block;
  margin-top: 8rpx;
  color: $text-sub;
  font-size: 24rpx;
}
</style>
