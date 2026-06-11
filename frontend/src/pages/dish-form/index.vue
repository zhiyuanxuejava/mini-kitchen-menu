<template>
  <AppPage no-tab>
    <AppNavbar :title="editing ? '编辑菜品' : '新增菜品'" back />
    <view class="form card">
      <view class="field">
        <text>菜品名称</text>
        <input v-model="form.name" placeholder="例如：蒜蓉西兰花" />
      </view>
      <view class="field">
        <text>菜品分类</text>
        <view class="chips">
          <button v-for="item in categories" :key="item.key" :class="{ active: form.category === item.key }" @tap="form.category = item.key">
            {{ item.label }}
          </button>
        </view>
      </view>
      <view class="field">
        <text>简短描述</text>
        <textarea v-model="form.description" placeholder="记录这道菜的风味和适合场景" />
      </view>
      <view class="two-col">
        <view class="field">
          <text>难度</text>
          <picker :range="difficulties" @change="form.difficulty = difficulties[Number($event.detail.value)]">
            <view class="picker">{{ form.difficulty }} ›</view>
          </picker>
        </view>
        <view class="field">
          <text>预计耗时</text>
          <input v-model.number="form.estimatedMinutes" type="number" />
        </view>
      </view>
      <view class="field">
        <text>适合人数</text>
        <input v-model.number="form.servings" type="number" />
      </view>
      <view class="notice">
        P1 表单已保留核心字段；食材、步骤、图片编辑可继续扩展到完整后台表单。
      </view>
    </view>
    <button class="primary-btn save" @tap="save">{{ store.loading ? '保存中...' : '保存菜品' }}</button>
  </AppPage>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import AppNavbar from '@/components/AppNavbar.vue'
import AppPage from '@/components/AppPage.vue'
import { categoryLabels } from '@/data/seed'
import type { Difficulty, DishCategory } from '@/data/types'
import { useKitchenStore } from '@/stores/kitchen'

const store = useKitchenStore()
const dishId = ref('')
const difficulties: Difficulty[] = ['简单', '中等', '较难']
const form = reactive({
  name: '',
  category: 'vegetable' as DishCategory,
  description: '',
  difficulty: '简单' as Difficulty,
  estimatedMinutes: 20,
  servings: 2
})

const categories = (Object.keys(categoryLabels).filter((key) => key !== 'all') as DishCategory[]).map((key) => ({
  key,
  label: categoryLabels[key]
}))

const editing = computed(() => Boolean(dishId.value))

onLoad((query) => {
  if (query?.id && typeof query.id === 'string') {
    dishId.value = query.id
  }
})

onShow(async () => {
  store.hydrate()
  if (!store.user) {
    uni.reLaunch({ url: '/pages/login/index' })
    return
  }
  if (dishId.value) await loadDishForEdit()
})

async function loadDishForEdit() {
  const dish = await store.loadDish(dishId.value)
  if (!dish) return
  if (!store.canEditDish(dish)) {
    uni.showToast({ title: '后台同步菜品不可编辑', icon: 'none' })
    setTimeout(() => uni.navigateBack(), 500)
    return
  }
  Object.assign(form, {
    name: dish.name,
    category: dish.category,
    description: dish.description,
    difficulty: dish.difficulty,
    estimatedMinutes: dish.estimatedMinutes,
    servings: dish.servings
  })
}

async function save() {
  if (!form.name.trim()) {
    uni.showToast({ title: '请输入菜品名称', icon: 'none' })
    return
  }
  if (editing.value) {
    const dish = store.getDish(dishId.value)
    if (dish && !store.canEditDish(dish)) {
      uni.showToast({ title: '后台同步菜品不可编辑', icon: 'none' })
      return
    }
    try {
      await store.updateDish(dishId.value, form)
      uni.showToast({ title: '已保存', icon: 'success' })
      uni.navigateBack()
    } catch {
      uni.showToast({ title: store.apiError || '保存失败', icon: 'none' })
    }
    return
  }
  try {
    const id = await store.createDish(form)
    uni.redirectTo({ url: `/pages/dish-detail/index?id=${id}` })
  } catch {
    uni.showToast({ title: store.apiError || '保存失败', icon: 'none' })
  }
}
</script>

<style scoped lang="scss">
.form {
  padding: 28rpx;
}

.field {
  margin-bottom: 28rpx;
}

.field text {
  display: block;
  margin-bottom: 12rpx;
  color: $text-main;
  font-size: 28rpx;
  font-weight: 900;
}

input,
textarea,
.picker {
  width: 100%;
  min-height: 78rpx;
  padding: 18rpx 22rpx;
  border: 1rpx solid $border;
  border-radius: 20rpx;
  background: #fffdfb;
  color: $text-main;
  font-size: 28rpx;
}

textarea {
  min-height: 150rpx;
  line-height: 1.5;
}

.chips {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14rpx;
}

.chips button {
  height: 62rpx;
  border: 1rpx solid $border;
  border-radius: 999rpx;
  color: $text-sub;
  font-size: 25rpx;
  font-weight: 800;
}

.chips button.active {
  border-color: $primary;
  color: #fff;
  background: $primary;
}

.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22rpx;
}

.notice {
  padding: 20rpx;
  border-radius: 18rpx;
  background: #fff7ef;
  color: $text-sub;
  font-size: 24rpx;
  line-height: 1.45;
}

.save {
  margin-top: 28rpx;
}
</style>
