<template>
  <AppPage>
    <AppNavbar title="今日点菜单" back>
      <template #right>
        <view class="date-chip">
          <image :src="icons.calendar" mode="aspectFit" />
          <text>{{ shortDate }}</text>
        </view>
      </template>
    </AppNavbar>

    <view class="menu-stats card">
      <view>
        <image :src="icons.people" mode="aspectFit" />
        <text>用餐人数</text>
        <strong>{{ store.menu.servings }} 人</strong>
      </view>
      <view>
        <image :src="icons.plus" mode="aspectFit" />
        <text>已选菜品</text>
        <strong>{{ store.menuDishCount }} 道菜</strong>
      </view>
      <view>
        <image :src="icons.clockOrange" mode="aspectFit" />
        <text>预计用时</text>
        <strong>{{ store.estimatedMinutes }} 分钟</strong>
      </view>
    </view>

    <SectionTitle :title="`已选菜品（${store.menu.items.length}）`">
      <text class="section-extra">调整顺序 ⇅</text>
    </SectionTitle>

    <view v-for="(item, index) in store.menuDishes" :key="item.id" class="menu-item card">
      <image class="thumb" :src="item.dish.coverImage" mode="aspectFill" />
      <view class="content">
        <view class="name-row">
          <text class="order">{{ index + 1 }}</text>
          <text class="name line-clamp-1">{{ item.dish.name }}</text>
        </view>
        <view class="note-line">
          <text>备注：</text>
          <input :value="item.note" placeholder="口味、忌口或备菜说明" @input="onNote(item.id, $event)" />
        </view>
        <view class="qty-row">
          <button @tap="store.updateQuantity(item.id, -1)">−</button>
          <text>{{ item.quantity }} 份</text>
          <button class="plus" @tap="store.updateQuantity(item.id, 1)">＋</button>
        </view>
      </view>
      <view class="side">
        <text class="time">🕘 {{ item.dish.estimatedMinutes }} 分钟</text>
        <text class="status">待制作</text>
        <view class="drag-handle" aria-label="调整顺序">
          <text></text>
          <text></text>
          <text></text>
        </view>
      </view>
    </view>

    <EmptyState v-if="!store.menu.items.length" title="点菜单还是空的" />

    <view class="menu-action-spacer" />

    <view class="menu-actions">
      <button class="ghost-btn" hover-class="tap" @tap="continueAdd">＋ 继续加菜</button>
      <button class="primary-btn" hover-class="tap" @tap="submit">提交菜单</button>
    </view>

    <BottomTabbar active="menu" />
  </AppPage>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppNavbar from '@/components/AppNavbar.vue'
import AppPage from '@/components/AppPage.vue'
import BottomTabbar from '@/components/BottomTabbar.vue'
import EmptyState from '@/components/EmptyState.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import { icons } from '@/data/assets'
import { useKitchenStore } from '@/stores/kitchen'

const store = useKitchenStore()

onShow(() => {
  store.hydrate()
  if (!store.user) uni.reLaunch({ url: '/pages/login/index' })
  else store.refreshSessionData()
})

const shortDate = computed(() => {
  const date = new Date()
  const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()]
  return `${week} ${date.getMonth() + 1}.${date.getDate()}`
})

function onNote(id: string, event: Event) {
  const value = (event as unknown as { detail: { value: string } }).detail.value
  store.updateNote(id, value)
}

function continueAdd() {
  uni.reLaunch({ url: '/pages/dishes/index' })
}

function submit() {
  if (store.submitMenu()) {
    uni.reLaunch({ url: '/pages/cook/index' })
  }
}
</script>

<style scoped lang="scss">
.date-chip {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 10rpx 14rpx;
  border: 1rpx solid $border;
  border-radius: 22rpx;
  background: #fff;
  color: $text-main;
  font-size: 22rpx;
  font-weight: 800;
}

.date-chip image {
  width: 34rpx;
  height: 34rpx;
}

.menu-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 30rpx 10rpx;
}

.menu-stats view {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  min-width: 0;
  border-right: 1rpx solid $border;
}

.menu-stats view:last-child {
  border-right: 0;
}

.menu-stats image {
  width: 58rpx;
  height: 58rpx;
}

.menu-stats text {
  color: $text-sub;
  font-size: 24rpx;
}

.menu-stats strong {
  color: $text-main;
  font-size: 32rpx;
}

.menu-item {
  display: grid;
  grid-template-columns: 158rpx minmax(0, 1fr) 118rpx;
  gap: 16rpx;
  align-items: center;
  padding: 18rpx;
  margin-bottom: 22rpx;
}

.thumb {
  width: 158rpx;
  height: 130rpx;
  border-radius: 18rpx;
}

.content {
  min-width: 0;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.order {
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

.name {
  flex: 1;
  color: $text-main;
  font-size: 31rpx;
  font-weight: 900;
}

.note-line {
  display: flex;
  align-items: center;
  margin: 14rpx 0;
  color: $success;
  font-size: 24rpx;
}

.note-line input {
  flex: 1;
  height: 42rpx;
  color: $success;
  font-size: 24rpx;
}

.qty-row {
  width: 186rpx;
  height: 56rpx;
  display: grid;
  grid-template-columns: 52rpx minmax(72rpx, 1fr) 52rpx;
  align-items: center;
  overflow: hidden;
  border-radius: 999rpx;
  background: #fffaf6;
  box-shadow: inset 0 0 0 1rpx $border;
  text-align: center;
  color: $text-main;
  font-size: 25rpx;
  font-weight: 800;
}

.qty-row button,
.qty-row uni-button {
  width: 52rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  border-radius: 0;
  background: transparent;
  color: $text-sub;
  font-size: 28rpx;
  line-height: 1;
}

.qty-row .plus {
  color: $primary;
}

.qty-row text,
.qty-row uni-text {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  white-space: nowrap;
  line-height: 1;
}

.side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12rpx;
}

.time {
  color: $text-main;
  font-size: 21rpx;
}

.status {
  padding: 8rpx 14rpx;
  border-radius: 999rpx;
  background: $primary-light;
  color: $primary;
  font-size: 22rpx;
}

.drag-handle {
  width: 48rpx;
  height: 44rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 7rpx;
}

.drag-handle text {
  display: block;
  width: 38rpx;
  height: 3rpx;
  border-radius: 999rpx;
  background: #b7aea8;
}

.menu-actions {
  position: fixed;
  left: 50%;
  bottom: calc(146rpx + env(safe-area-inset-bottom));
  z-index: 19;
  width: calc(100% - 56rpx);
  max-width: 402px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 26rpx;
  margin: 0;
  padding: 18rpx 0;
  background: linear-gradient(180deg, rgba(255, 250, 245, 0) 0%, #fffaf5 28%, #fffaf5 100%);
  transform: translateX(-50%);
}

.menu-action-spacer {
  height: 146rpx;
}
</style>
