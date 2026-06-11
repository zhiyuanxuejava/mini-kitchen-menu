<template>
  <view class="tabbar">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      class="tab-item"
      hover-class="tap"
      @tap="go(tab.url)"
    >
      <image :src="active === tab.key ? tab.activeIcon : tab.icon" mode="aspectFit" />
      <text :class="{ active: active === tab.key }">{{ tab.label }}</text>
    </button>
  </view>
</template>

<script setup lang="ts">
import { tabIcons } from '@/data/assets'

defineProps<{
  active: 'home' | 'dishes' | 'menu' | 'cook' | 'mine'
}>()

const tabs = [
  { key: 'home', label: '首页', url: '/pages/home/index', icon: tabIcons.home.default, activeIcon: tabIcons.home.active },
  { key: 'dishes', label: '菜品库', url: '/pages/dishes/index', icon: tabIcons.dishes.default, activeIcon: tabIcons.dishes.active },
  { key: 'menu', label: '点菜单', url: '/pages/menu/index', icon: tabIcons.menu.default, activeIcon: tabIcons.menu.active },
  { key: 'cook', label: '做菜台', url: '/pages/cook/index', icon: tabIcons.cook.default, activeIcon: tabIcons.cook.active },
  { key: 'mine', label: '我的', url: '/pages/mine/index', icon: tabIcons.mine.default, activeIcon: tabIcons.mine.active }
] as const

function go(url: string) {
  uni.reLaunch({ url })
}
</script>

<style scoped lang="scss">
.tabbar {
  position: fixed;
  left: 50%;
  bottom: 0;
  z-index: 20;
  box-sizing: border-box;
  width: 100%;
  max-width: 430px;
  height: 134rpx;
  height: calc(134rpx + env(safe-area-inset-bottom));
  padding: 0 18rpx;
  padding-bottom: env(safe-area-inset-bottom);
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: center;
  border-radius: 40rpx 40rpx 0 0;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 -12rpx 42rpx rgba(54, 32, 17, 0.1);
  backdrop-filter: blur(12px);
  transform: translateX(-50%);
}

.tabbar::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 10rpx;
  width: 142rpx;
  height: 7rpx;
  border-radius: 999rpx;
  background: #050403;
  transform: translateX(-50%);
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  min-width: 0;
  height: 100%;
  padding-bottom: 16rpx;
  border-radius: 0;
  background: transparent;
}

.tab-item::after {
  border: 0;
}

.tab-item image {
  width: 46rpx;
  height: 46rpx;
}

.tab-item text {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 23rpx;
  color: #4f4946;
}

.tab-item text.active {
  color: $primary;
  font-weight: 800;
}
</style>
