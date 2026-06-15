<template>
  <AppPage no-tab>
    <AppNavbar :title="editing ? '编辑菜品' : '新增菜品'" back />
    <view class="form card">
      <view v-if="editing && canDelete" class="editor-banner">
        <view>
          <text class="editor-banner-title">当前是你自己添加的菜品</text>
          <text class="editor-banner-sub">支持继续编辑备注，也可以直接删除。</text>
        </view>
        <text class="editor-banner-mark">我的菜品</text>
      </view>

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
      <view class="field">
        <view class="field-head">
          <text>备注信息</text>
          <text class="field-hint">{{ form.remark.length }}/200</text>
        </view>
        <textarea v-model="form.remark" maxlength="200" placeholder="记录口味偏好、备菜要点、替代食材或自己的做法心得" />
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
        先保留核心菜谱字段；备注支持记录自己的做法心得、忌口提醒和下次优化点。
      </view>
    </view>
    <view class="actions">
      <button v-if="editing && canDelete" class="ghost-btn delete-btn" @tap="removeDish">删除菜品</button>
      <button class="primary-btn save" @tap="save">{{ store.loading ? '保存中...' : '保存菜品' }}</button>
    </view>
  </AppPage>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import AppNavbar from '@/components/AppNavbar.vue'
import AppPage from '@/components/AppPage.vue'
import { categoryLabels } from '@/data/labels'
import type { Difficulty, DishCategory } from '@/data/types'
import { useKitchenStore } from '@/stores/kitchen'

const store = useKitchenStore()
const dishId = ref('')
const difficulties: Difficulty[] = ['简单', '中等', '较难']
const form = reactive({
  name: '',
  category: 'vegetable' as DishCategory,
  description: '',
  remark: '',
  difficulty: '简单' as Difficulty,
  estimatedMinutes: 20,
  servings: 2
})

const categories = (Object.keys(categoryLabels).filter((key) => key !== 'all') as DishCategory[]).map((key) => ({
  key,
  label: categoryLabels[key]
}))

const editing = computed(() => Boolean(dishId.value))
const currentDish = computed(() => (dishId.value ? store.getDish(dishId.value) : undefined))
const canDelete = computed(() => (currentDish.value ? store.canEditDish(currentDish.value) : false))

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
    remark: dish.remark || '',
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

function removeDish() {
  if (!dishId.value || !canDelete.value) return
  uni.showModal({
    title: '删除菜品',
    content: '删除后，这道自建菜品会从菜品库、点菜单和相关记录中移除，确认继续吗？',
    confirmColor: '#d34b2f',
    success: async (result) => {
      if (!result.confirm) return
      try {
        await store.deleteDish(dishId.value)
        uni.showToast({ title: '已删除菜品', icon: 'success' })
        setTimeout(() => {
          uni.reLaunch({ url: '/pages/dishes/index' })
        }, 300)
      } catch {
        uni.showToast({ title: store.apiError || '删除失败', icon: 'none' })
      }
    }
  })
}
</script>

<style scoped lang="scss">
.form {
  padding: 28rpx;
}

.editor-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  padding: 22rpx 24rpx;
  margin-bottom: 26rpx;
  border-radius: 22rpx;
  background: linear-gradient(135deg, #fff9f3 0%, #fff3ea 100%);
}

.editor-banner-title,
.editor-banner-sub {
  display: block;
}

.editor-banner-title {
  color: $text-main;
  font-size: 28rpx;
  font-weight: 900;
}

.editor-banner-sub {
  margin-top: 8rpx;
  color: $text-sub;
  font-size: 23rpx;
}

.editor-banner-mark {
  flex: 0 0 auto;
  padding: 10rpx 18rpx;
  border-radius: 999rpx;
  background: rgba(255, 123, 37, 0.12);
  color: $primary;
  font-size: 22rpx;
  font-weight: 900;
}

.field {
  margin-bottom: 28rpx;
}

.field > text {
  display: block;
  margin-bottom: 12rpx;
  color: $text-main;
  font-size: 28rpx;
  font-weight: 900;
}

.field-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
  margin-bottom: 12rpx;
}

.field-head text {
  margin-bottom: 0;
}

.field-hint {
  color: $text-sub;
  font-size: 22rpx;
  font-weight: 700;
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

.actions {
  display: grid;
  gap: 18rpx;
  margin-top: 28rpx;
}

.save {
  width: 100%;
}

.delete-btn {
  width: 100%;
  border-color: rgba(211, 75, 47, 0.3);
  color: #d34b2f;
  background: #fffaf8;
}
</style>
