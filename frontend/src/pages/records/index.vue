<template>
  <AppPage no-tab>
    <AppNavbar title="历史记录" back />
    <view class="toolbar">
      <view class="search-box">
        <image :src="icons.search" class="icon-36" mode="aspectFit" />
        <input v-model="keyword" placeholder="搜索菜名" />
      </view>
    </view>
    <view v-for="record in records" :key="record.id" class="record card">
      <image :src="record.photos[0] || record.dish.coverImage" mode="aspectFill" />
      <view>
        <text class="name line-clamp-1">{{ record.dish.name }} {{ record.dish.emoji }}</text>
        <text class="meta">{{ record.finishedAt }} · {{ record.actualMinutes }} 分钟</text>
        <text class="score">★ {{ record.rating?.overallScore || record.dish.rating }}</text>
        <text class="note line-clamp-2">{{ record.note }}</text>
      </view>
    </view>
    <EmptyState v-if="!records.length" title="还没有历史记录" desc="完成一道菜并上传成品后，会在这里沉淀复盘。" />
  </AppPage>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppNavbar from '@/components/AppNavbar.vue'
import AppPage from '@/components/AppPage.vue'
import EmptyState from '@/components/EmptyState.vue'
import { icons } from '@/data/assets'
import { useKitchenStore } from '@/stores/kitchen'

const store = useKitchenStore()
const keyword = ref('')

onShow(() => {
  store.hydrate()
  if (!store.user) uni.reLaunch({ url: '/pages/login/index' })
  else store.refreshRecordsAndRatings()
})

const records = computed(() => {
  const key = keyword.value.trim()
  return store.historyRecords.filter((item) => !key || item.dish.name.includes(key))
})
</script>

<style scoped lang="scss">
.toolbar {
  margin-bottom: 24rpx;
}

.search-box input {
  flex: 1;
  height: 68rpx;
  font-size: 28rpx;
}

.record {
  display: grid;
  grid-template-columns: 190rpx 1fr;
  gap: 22rpx;
  padding: 18rpx;
  margin-bottom: 20rpx;
}

.record image {
  width: 190rpx;
  height: 146rpx;
  border-radius: 18rpx;
}

.name,
.meta,
.score,
.note {
  display: block;
}

.name {
  color: $text-main;
  font-size: 30rpx;
  font-weight: 900;
}

.meta,
.note {
  margin-top: 8rpx;
  color: $text-sub;
  font-size: 24rpx;
}

.score {
  margin-top: 8rpx;
  color: $warning;
  font-size: 25rpx;
  font-weight: 800;
}
</style>
