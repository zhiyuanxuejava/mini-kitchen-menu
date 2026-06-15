<template>
  <AppPage v-if="record && dish">
    <AppNavbar title="成品评分" back />

    <view class="record-card card">
      <image :src="record.photos[0] || dish.coverImage" mode="aspectFill" />
      <view>
        <view class="name-line">
          <text>{{ dish.name }} {{ dish.emoji }}</text>
          <text class="done">已完成</text>
        </view>
        <view class="record-meta">
          <text>🕘 烹饪用时</text>
          <strong>{{ record.actualMinutes }} 分钟</strong>
        </view>
        <view class="record-meta">
          <text>📅 完成时间</text>
          <strong>{{ record.finishedAt }}</strong>
        </view>
      </view>
    </view>

    <view class="rating-card card">
      <RatingRow v-model="scores.tasteScore" title="味道 😊" desc="咸淡适中，风味是否美味" />
      <RatingRow v-model="scores.appearanceScore" title="外观 👀" desc="色泽搭配，卖相是否诱人" />
      <RatingRow v-model="scores.similarityScore" title="还原度 🎯" desc="与菜谱成品的相似程度" />
      <RatingRow v-model="scores.heatScore" title="火候 🔥" desc="火候掌握是否恰到好处" />
      <RatingRow v-model="scores.satisfactionScore" title="满意度 ⭐" desc="整体是否满意这道菜" />
    </view>

    <view class="overall card">
      <view>
        <text class="overall-title">综合评分</text>
        <text class="overall-sub">基于以上 5 项评分自动计算</text>
      </view>
      <text class="overall-score">{{ overall }}</text>
      <text class="recommend">推荐 👍</text>
    </view>

    <view v-if="dish && !dish.learnedAt" class="learn-card card">
      <view class="learn-copy">
        <text class="learn-title">这道菜你学会了吗？</text>
        <text class="learn-sub">如果这次已经掌握，可以一键加入“我已学会”，后续会出现在时间线里。</text>
      </view>
      <button :class="[learnedMarked ? 'primary-btn' : 'ghost-btn']" hover-class="tap" @tap="toggleLearned">
        {{ learnedMarked ? '✓ 已加入我已学会' : '加入我已学会' }}
      </button>
    </view>

    <view class="comment">
      <text class="comment-title">✎ 我的评价</text>
      <textarea v-model="comment" maxlength="100" placeholder="写一句本次评分备注" />
      <text class="count">{{ comment.length }}/100</text>
    </view>

    <view class="rating-action-spacer" />
    <view class="rating-actions">
      <button class="ghost-btn" hover-class="tap" @tap="later">稍后再评</button>
      <button class="primary-btn" hover-class="tap" @tap="submit">提交评分</button>
    </view>

    <BottomTabbar active="home" />
  </AppPage>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import AppNavbar from '@/components/AppNavbar.vue'
import AppPage from '@/components/AppPage.vue'
import BottomTabbar from '@/components/BottomTabbar.vue'
import RatingRow from '@/components/RatingRow.vue'
import { useKitchenStore } from '@/stores/kitchen'

const store = useKitchenStore()
const recordId = ref('record-hongshaorou')
const scores = reactive({
  tasteScore: 5,
  appearanceScore: 4,
  similarityScore: 4,
  heatScore: 5,
  satisfactionScore: 4
})
const comment = ref('味道很香，颜色很好，收汁可以再浓一点。')
const learnedMarked = ref(false)

onLoad((query) => {
  if (query?.recordId && typeof query.recordId === 'string') recordId.value = query.recordId
})

onShow(() => {
  store.hydrate()
  if (!store.user) uni.reLaunch({ url: '/pages/login/index' })
  else store.refreshRecordsAndRatings()
})

const record = computed(() => store.records.find((item) => item.id === recordId.value))
const dish = computed(() => (record.value ? store.getDish(record.value.dishId) : undefined))
const overall = computed(() => {
  const values = Object.values(scores)
  const total = values.reduce((sum, item) => sum + item, 0)
  return (total / values.length).toFixed(1)
})

function later() {
  uni.reLaunch({ url: '/pages/cook/index' })
}

async function submit() {
  if (!record.value) return
  try {
    await store.saveRating(record.value.id, {
      ...scores,
      overallScore: Number(overall.value),
      comment: comment.value.trim()
    })
    uni.showToast({ title: '评分已保存', icon: 'success' })
    setTimeout(() => uni.reLaunch({ url: '/pages/mine/index' }), 500)
  } catch {
    uni.showToast({ title: store.apiError || '评分保存失败', icon: 'none' })
  }
}

async function toggleLearned() {
  if (!dish.value) return
  try {
    const learnedAt = await store.setDishLearned(dish.value.id, !learnedMarked.value, new Date().toISOString())
    learnedMarked.value = Boolean(learnedAt)
    uni.showToast({ title: learnedMarked.value ? '已加入我已学会' : '已取消学会状态', icon: 'none' })
  } catch {
    uni.showToast({ title: store.apiError || '更新失败', icon: 'none' })
  }
}
</script>

<style scoped lang="scss">
.record-card {
  display: grid;
  grid-template-columns: 260rpx 1fr;
  gap: 26rpx;
  padding: 22rpx;
  margin-bottom: 24rpx;
}

.record-card image {
  width: 260rpx;
  height: 168rpx;
  border-radius: 18rpx;
}

.name-line {
  display: flex;
  align-items: center;
  gap: 14rpx;
  color: $text-main;
  font-size: 34rpx;
  font-weight: 900;
}

.done {
  padding: 8rpx 18rpx;
  border: 1rpx solid #ffcaa9;
  border-radius: 999rpx;
  color: $primary;
  font-size: 22rpx;
}

.record-meta {
  display: flex;
  gap: 20rpx;
  margin-top: 18rpx;
  color: $text-sub;
  font-size: 25rpx;
}

.record-meta strong {
  color: $text-main;
}

.rating-card {
  padding: 4rpx 26rpx;
}

.overall {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 18rpx;
  align-items: center;
  margin-top: 24rpx;
  padding: 24rpx;
}

.overall-title,
.overall-sub {
  display: block;
}

.overall-title {
  color: $text-main;
  font-size: 31rpx;
  font-weight: 900;
}

.overall-sub {
  margin-top: 8rpx;
  color: $text-sub;
  font-size: 23rpx;
}

.overall-score {
  color: $primary;
  font-size: 62rpx;
  font-weight: 900;
}

.recommend {
  padding: 8rpx 16rpx;
  border: 1rpx solid #ffd7bf;
  border-radius: 999rpx;
  color: $primary;
  font-size: 22rpx;
}

.comment {
  margin-top: 26rpx;
}

.learn-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220rpx;
  gap: 18rpx;
  align-items: center;
  margin-top: 22rpx;
  padding: 24rpx;
  background: linear-gradient(135deg, #fffdf7 0%, #f4faee 100%);
}

.learn-copy {
  min-width: 0;
}

.learn-title,
.learn-sub {
  display: block;
}

.learn-title {
  color: $text-main;
  font-size: 29rpx;
  font-weight: 900;
}

.learn-sub {
  margin-top: 8rpx;
  color: $text-sub;
  font-size: 23rpx;
  line-height: 1.5;
}

.comment-title {
  color: $text-main;
  font-size: 29rpx;
  font-weight: 900;
}

textarea {
  width: 100%;
  min-height: 130rpx;
  margin-top: 18rpx;
  padding: 22rpx;
  border: 1rpx solid $border;
  border-radius: 18rpx;
  background: #fff;
  color: $text-main;
  font-size: 28rpx;
}

.count {
  display: block;
  margin-top: 8rpx;
  color: $text-sub;
  font-size: 23rpx;
  text-align: right;
}

.rating-actions {
  position: fixed;
  left: 50%;
  bottom: calc(150rpx + env(safe-area-inset-bottom));
  z-index: 19;
  width: calc(100% - 56rpx);
  max-width: 402px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 26rpx;
  padding: 18rpx 0;
  background: linear-gradient(180deg, rgba(255, 253, 251, 0) 0%, #fffdfb 30%, #fffdfb 100%);
  transform: translateX(-50%);
}

.rating-action-spacer {
  height: 124rpx;
}

@media screen and (max-height: 880px) {
  .rating-actions {
    position: static;
    width: 100%;
    max-width: none;
    margin-top: 18rpx;
    padding: 0;
    background: transparent;
    transform: none;
  }

  .rating-action-spacer {
    height: 18rpx;
  }
}
</style>
