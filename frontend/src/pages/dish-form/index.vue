<template>
  <AppPage no-tab>
    <AppNavbar :title="editing ? '编辑菜品' : '新增菜品'" back />

    <view class="form card">
      <view v-if="editing && canDelete" class="editor-banner">
        <view>
          <text class="editor-banner-title">当前是你自己添加的菜品</text>
          <text class="editor-banner-sub">支持继续编辑食材、步骤、备注，也可以直接删除。</text>
        </view>
        <text class="editor-banner-mark">我的菜品</text>
      </view>

      <view class="section">
        <view class="section-head">
          <text class="section-title">封面与基础信息</text>
          <text class="section-sub">先把封面、菜名和基本属性补全，后续做菜和详情页都会直接使用。</text>
        </view>

        <view class="cover-panel">
          <image class="cover-image" :src="coverPreview" mode="aspectFill" />
          <view class="cover-actions">
            <button class="ghost-btn cover-action-btn" hover-class="tap" @tap="chooseCoverImage">
              <text>更换封面</text>
            </button>
            <button v-if="hasCustomCover" class="ghost-btn subtle-btn cover-action-btn" hover-class="tap" @tap="resetCoverImage">
              <text>恢复默认</text>
            </button>
          </view>
        </view>

        <view class="field">
          <text>菜品名称</text>
          <input v-model.trim="form.name" maxlength="30" placeholder="例如：蒜蓉西兰花" />
        </view>

        <view class="field">
          <text>菜品分类</text>
          <view class="chips">
            <button
              v-for="item in categories"
              :key="item.key"
              :class="['category-chip', { active: form.category === item.key }]"
              @tap="form.category = item.key"
            >
              <text>{{ item.label }}</text>
            </button>
          </view>
        </view>

        <view class="field">
          <text>简短描述</text>
          <textarea v-model="form.description" maxlength="150" placeholder="记录这道菜的风味、适合场景和成菜特点" />
        </view>

        <view class="field">
          <view class="field-head">
            <text>备注信息</text>
            <text class="field-hint">{{ form.remark.length }}/200</text>
          </view>
          <textarea
            v-model="form.remark"
            maxlength="200"
            placeholder="记录口味偏好、备菜提醒、替代食材或自己的做法心得"
          />
        </view>

        <view class="two-col">
          <view class="field">
            <text>难度</text>
            <picker :range="difficulties" @change="form.difficulty = difficulties[Number($event.detail.value)]">
              <view class="picker">{{ form.difficulty }} ›</view>
            </picker>
          </view>

          <view class="field">
            <text>适合人数</text>
            <input v-model.number="form.servings" type="number" />
          </view>
        </view>

        <view class="field field-stack">
          <text>预计耗时</text>
          <view class="minutes-wrap">
            <input v-model.number="form.estimatedMinutes" type="number" @blur="normalizeEstimatedMinutes" />
            <text>分钟</text>
          </view>
        </view>
      </view>

      <view class="section">
        <view class="section-head with-action">
          <view>
            <text class="section-title">食材清单</text>
            <text class="section-sub">支持主料、辅料、调料分组，详情页会按分组展示。</text>
          </view>
          <button class="ghost-btn add-inline-btn" hover-class="tap" @tap="addIngredient">
            <text>＋ 添加食材</text>
          </button>
        </view>

        <view class="ingredient-tabs">
          <button
            v-for="group in ingredientGroupTabs"
            :key="group.key"
            :class="['ingredient-tab', { active: ingredientFilter === group.key }]"
            hover-class="tap"
            @tap="ingredientFilter = group.key"
          >
            {{ group.label }}
          </button>
        </view>

        <view v-if="filteredIngredients.length" class="ingredient-list">
          <view v-for="ingredient in filteredIngredients" :key="ingredient.id" class="ingredient-card">
            <view class="ingredient-top">
              <view class="ingredient-group">
                <text>分组</text>
                <picker :range="ingredientGroupLabels" :value="ingredientGroupIndex(ingredient.groupType)" @change="changeIngredientGroup(ingredient.id, $event)">
                  <view class="picker mini-picker">{{ groupLabels[ingredient.groupType] }} ›</view>
                </picker>
              </view>
              <button class="remove-btn" hover-class="tap" @tap="removeIngredient(ingredient.id)">
                <text>删除</text>
              </button>
            </view>
            <view class="ingredient-grid">
              <view class="field compact">
                <text>名称</text>
                <input v-model.trim="ingredient.name" maxlength="30" placeholder="例如：西兰花" />
              </view>
              <view class="field compact">
                <text>用量</text>
                <input v-model.trim="ingredient.amount" maxlength="20" placeholder="例如：300g / 适量" />
              </view>
            </view>
          </view>
        </view>

        <view v-else class="empty-box">
          <text>当前分组还没有食材，先添加一项。</text>
        </view>
      </view>

      <view class="section">
        <view class="section-head with-action">
          <view>
            <text class="section-title">做法步骤</text>
            <text class="section-sub">可选，不填则使用菜品描述。</text>
          </view>
          <button class="ghost-btn add-inline-btn" hover-class="tap" @tap="addStep">
            <text>＋ 添加步骤</text>
          </button>
        </view>

        <view v-if="form.steps.length" class="timeline-note">
          <text>{{ stepSummaryText }}</text>
          <button class="ghost-btn sync-btn" hover-class="tap" @tap="syncEstimatedMinutesFromSteps">
            <text>同步到预计耗时</text>
          </button>
        </view>

        <view v-if="form.steps.length" class="step-list">
          <view v-for="(step, index) in form.steps" :key="step.id" class="step-card">
            <view class="step-head">
              <view class="step-index">
                <text class="step-no">{{ index + 1 }}</text>
                <text class="step-label">步骤 {{ index + 1 }}</text>
              </view>
              <view class="step-order-actions">
                <button class="ghost-btn square-btn" hover-class="tap" :disabled="index === 0" @tap="moveStep(index, -1)">
                  <text>↑</text>
                </button>
                <button class="ghost-btn square-btn" hover-class="tap" :disabled="index === form.steps.length - 1" @tap="moveStep(index, 1)">
                  <text>↓</text>
                </button>
                <button class="remove-btn" hover-class="tap" @tap="removeStep(step.id)">
                  <text>删除</text>
                </button>
              </view>
            </view>

            <view class="step-media">
              <image class="step-preview" :src="step.image || coverPreview" mode="aspectFill" />
              <view class="step-media-actions">
                <button class="ghost-btn media-action-btn" hover-class="tap" @tap="chooseStepImage(step.id)">
                  <text>上传步骤图</text>
                </button>
                <button v-if="step.image" class="ghost-btn subtle-btn media-action-btn" hover-class="tap" @tap="clearStepImage(step.id)">
                  <text>清空</text>
                </button>
              </view>
            </view>

            <view class="field compact">
              <text>步骤标题</text>
              <input v-model.trim="step.title" maxlength="40" placeholder="例如：焯水断生" />
            </view>

            <view class="field compact">
              <text>步骤说明</text>
              <textarea v-model="step.description" maxlength="300" placeholder="描述这一阶段怎么操作、观察什么状态、做到什么程度" />
            </view>

            <view class="three-col">
              <view class="field compact">
                <text>火候</text>
                <input v-model.trim="step.heat" maxlength="20" placeholder="例如：中火" />
              </view>

              <view class="field compact">
                <text>时长</text>
                <input v-model.number="step.minutes" type="number" @blur="normalizeStepMinutes(step.id)" />
              </view>

              <view class="field compact">
                <text>建议</text>
                <input v-model.trim="step.tips" maxlength="60" placeholder="例如：别炒老" />
              </view>
            </view>
          </view>
        </view>

        <view v-else class="empty-box empty-steps-box">
          <text>未填写步骤时，将使用菜品描述。</text>
        </view>
      </view>
    </view>

    <view class="actions">
      <button v-if="editing && canDelete" class="ghost-btn delete-btn" @tap="removeDish">
        <text>删除菜品</text>
      </button>
      <button class="primary-btn save" @tap="save">
        <text>{{ store.loading ? '保存中...' : '保存菜品' }}</text>
      </button>
    </view>
  </AppPage>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import AppNavbar from '@/components/AppNavbar.vue'
import AppPage from '@/components/AppPage.vue'
import { isTemporaryFilePath } from '@/api/kitchen'
import { categoryLabels, groupLabels } from '@/data/labels'
import type {
  Difficulty,
  DishCategory,
  EditableDishInput,
  EditableDishStepInput,
  EditableIngredientInput,
  IngredientGroupType
} from '@/data/types'
import { useKitchenStore } from '@/stores/kitchen'

type IngredientDraft = EditableIngredientInput & { id: string }
type StepDraft = EditableDishStepInput & { id: string }

const PLACEHOLDER_IMAGE = '/static/assets/placeholders/png/dish_cover_placeholder.png.png'
const ingredientGroups: IngredientGroupType[] = ['main', 'side', 'seasoning']

const store = useKitchenStore()
const dishId = ref('')
const difficulties: Difficulty[] = ['简单', '中等', '较难']
const ingredientFilter = ref<IngredientGroupType | 'all'>('all')
const form = reactive({
  name: '',
  category: 'vegetable' as DishCategory,
  coverImage: '',
  description: '',
  remark: '',
  difficulty: '简单' as Difficulty,
  estimatedMinutes: 20,
  servings: 2,
  ingredients: [] as IngredientDraft[],
  steps: [] as StepDraft[]
})

const categories = (Object.keys(categoryLabels).filter((key) => key !== 'all') as DishCategory[]).map((key) => ({
  key,
  label: categoryLabels[key]
}))
const ingredientGroupTabs: Array<{ key: IngredientGroupType | 'all'; label: string }> = [
  { key: 'all', label: '全部' },
  ...ingredientGroups.map((key) => ({ key, label: groupLabels[key] }))
]
const ingredientGroupLabels = ingredientGroups.map((key) => groupLabels[key])

const editing = computed(() => Boolean(dishId.value))
const currentDish = computed(() => (dishId.value ? store.getDish(dishId.value) : undefined))
const canDelete = computed(() => (currentDish.value ? store.canEditDish(currentDish.value) : false))
const coverPreview = computed(() => form.coverImage || currentDish.value?.coverImage || PLACEHOLDER_IMAGE)
const hasCustomCover = computed(() => Boolean(form.coverImage))
const filteredIngredients = computed(() =>
  ingredientFilter.value === 'all'
    ? form.ingredients
    : form.ingredients.filter((item) => item.groupType === ingredientFilter.value)
)
const totalStepMinutes = computed(() =>
  form.steps.reduce((sum, step) => sum + Math.max(1, Number(step.minutes) || 0), 0)
)
const stepSummaryText = computed(() => {
  if (!form.steps.length) return '当前未填写步骤，保存后会自动生成默认第 1 步。'
  return `当前共 ${form.steps.length} 步，步骤总时长 ${totalStepMinutes.value} 分钟。`
})

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
  else ensureMinimumDrafts()
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
    coverImage: dish.coverImage === PLACEHOLDER_IMAGE ? '' : dish.coverImage,
    description: dish.description,
    remark: dish.remark || '',
    difficulty: dish.difficulty,
    estimatedMinutes: dish.estimatedMinutes,
    servings: dish.servings,
    ingredients: dish.ingredients.map((item) => ({
      id: item.id,
      groupType: item.groupType,
      name: item.name,
      amount: item.amount
    })),
    steps: dish.steps.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      image: item.image === dish.coverImage ? '' : item.image,
      heat: item.heat,
      minutes: Math.max(1, item.minutes || 1),
      tips: item.tips
    }))
  })
  ensureMinimumDrafts()
}

function ensureMinimumDrafts() {
  if (!form.ingredients.length) addIngredient()
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
}

function createIngredientDraft(groupType: IngredientGroupType = 'main'): IngredientDraft {
  return {
    id: makeId('ingredient'),
    groupType,
    name: '',
    amount: ''
  }
}

function createStepDraft(): StepDraft {
  return {
    id: makeId('step'),
    title: '',
    description: '',
    image: '',
    heat: '',
    minutes: 3,
    tips: ''
  }
}

function addIngredient() {
  const targetGroup = ingredientFilter.value === 'all' ? 'main' : ingredientFilter.value
  form.ingredients.push(createIngredientDraft(targetGroup))
}

function removeIngredient(id: string) {
  if (form.ingredients.length <= 1) {
    uni.showToast({ title: '至少保留一项食材', icon: 'none' })
    return
  }
  form.ingredients = form.ingredients.filter((item) => item.id !== id)
}

function ingredientGroupIndex(groupType: IngredientGroupType) {
  return ingredientGroups.indexOf(groupType)
}

function changeIngredientGroup(id: string, event: { detail: { value: string | number } }) {
  const ingredient = form.ingredients.find((item) => item.id === id)
  if (!ingredient) return
  const nextGroup = ingredientGroups[Number(event.detail.value)] || 'main'
  ingredient.groupType = nextGroup
}

function addStep() {
  form.steps.push(createStepDraft())
  syncEstimatedMinutesFromSteps()
}

function removeStep(id: string) {
  form.steps = form.steps.filter((item) => item.id !== id)
  syncEstimatedMinutesFromSteps()
}

function moveStep(index: number, direction: -1 | 1) {
  const target = index + direction
  if (target < 0 || target >= form.steps.length) return
  const next = [...form.steps]
  const [current] = next.splice(index, 1)
  next.splice(target, 0, current)
  form.steps = next
}

function normalizeEstimatedMinutes() {
  form.estimatedMinutes = clampPositiveInt(form.estimatedMinutes, totalStepMinutes.value || 20)
}

function normalizeStepMinutes(stepId: string) {
  const step = form.steps.find((item) => item.id === stepId)
  if (!step) return
  step.minutes = clampPositiveInt(step.minutes, 1)
  syncEstimatedMinutesFromSteps()
}

function clampPositiveInt(value: number, fallback: number) {
  const next = Math.round(Number(value))
  if (!next || next < 1) return Math.max(1, Math.round(fallback) || 1)
  return next
}

function syncEstimatedMinutesFromSteps() {
  if (!form.steps.length) {
    form.estimatedMinutes = Math.max(1, clampPositiveInt(form.estimatedMinutes, 20))
    return
  }
  form.estimatedMinutes = Math.max(1, totalStepMinutes.value || form.estimatedMinutes || 1)
}

function chooseImage(count = 1) {
  return new Promise<string[]>((resolve, reject) => {
    uni.chooseImage({
      count,
      success: (res) => resolve(Array.isArray(res.tempFilePaths) ? res.tempFilePaths : []),
      fail: (error) => reject(new Error(error.errMsg || '选择图片失败'))
    })
  })
}

async function chooseCoverImage() {
  try {
    const [filePath] = await chooseImage()
    if (!filePath) return
    form.coverImage = filePath
  } catch {}
}

function resetCoverImage() {
  form.coverImage = ''
}

async function chooseStepImage(stepId: string) {
  try {
    const [filePath] = await chooseImage()
    if (!filePath) return
    const step = form.steps.find((item) => item.id === stepId)
    if (!step) return
    step.image = filePath
  } catch {}
}

function clearStepImage(stepId: string) {
  const step = form.steps.find((item) => item.id === stepId)
  if (!step) return
  step.image = ''
}

function collectPayload(): EditableDishInput | null {
  const name = form.name.trim()
  if (!name) {
    uni.showToast({ title: '请输入菜品名称', icon: 'none' })
    return null
  }

  const description = form.description.trim()
  if (!description) {
    uni.showToast({ title: '请补充菜品描述', icon: 'none' })
    return null
  }

  const ingredients = form.ingredients
    .map<EditableIngredientInput>((item) => ({
      groupType: item.groupType,
      name: item.name.trim(),
      amount: item.amount.trim()
    }))
    .filter((item) => item.name && item.amount)

  if (!ingredients.length) {
    uni.showToast({ title: '请至少填写一项完整食材', icon: 'none' })
    return null
  }

  const steps = form.steps
    .map<EditableDishStepInput>((item) => ({
      title: item.title.trim(),
      description: item.description.trim(),
      image: item.image,
      heat: item.heat.trim() || '中火',
      minutes: clampPositiveInt(item.minutes, 1),
      tips: item.tips.trim()
    }))
    .filter((item) => item.title && item.description)

  return {
    name,
    category: form.category,
    coverImage: form.coverImage,
    description,
    remark: form.remark.trim(),
    difficulty: form.difficulty,
    estimatedMinutes: clampPositiveInt(form.estimatedMinutes, steps.reduce((sum, step) => sum + step.minutes, 0) || 20),
    servings: clampPositiveInt(form.servings, 2),
    tasteTags: ['用户录入'],
    ingredients,
    steps
  }
}

async function uploadDraftImages(payload: EditableDishInput) {
  const pending: string[] = []
  const addPending = (path: string) => {
    if (!pending.includes(path)) pending.push(path)
  }

  if (payload.coverImage && isTemporaryFilePath(payload.coverImage)) addPending(payload.coverImage)
  for (const step of payload.steps) {
    if (step.image && isTemporaryFilePath(step.image)) addPending(step.image)
  }
  if (!pending.length) return payload

  const uploaded = await store.uploadFiles(pending)
  if (uploaded.length !== pending.length) {
    throw new Error('图片上传结果不完整，请重新上传')
  }

  const uploadedByPath = new Map(pending.map((path, index) => [path, uploaded[index]]))
  const uploadedUrlFor = (path: string) => {
    const url = uploadedByPath.get(path)
    if (!url) throw new Error('图片上传成功但未返回文件地址')
    return url
  }

  const coverImage = payload.coverImage && isTemporaryFilePath(payload.coverImage)
    ? uploadedUrlFor(payload.coverImage)
    : payload.coverImage
  const steps = payload.steps.map((step) => {
    if (step.image && isTemporaryFilePath(step.image)) {
      return { ...step, image: uploadedUrlFor(step.image) }
    }
    return step
  })

  return {
    ...payload,
    coverImage,
    steps
  }
}

async function save() {
  const payload = collectPayload()
  if (!payload) return

  if (editing.value) {
    const dish = store.getDish(dishId.value)
    if (dish && !store.canEditDish(dish)) {
      uni.showToast({ title: '后台同步菜品不可编辑', icon: 'none' })
      return
    }
  }

  try {
    const uploadedPayload = await uploadDraftImages(payload)
    if (editing.value) {
      await store.updateDish(dishId.value, uploadedPayload)
      uni.showToast({ title: '已保存', icon: 'success' })
      uni.navigateBack()
      return
    }

    const id = await store.createDish(uploadedPayload)
    uni.redirectTo({ url: `/pages/dish-detail/index?id=${id}` })
  } catch (error) {
    const message = error instanceof Error ? error.message : '保存失败'
    uni.showToast({ title: store.apiError || message, icon: 'none' })
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
          uni.reLaunch({ url: '/pages/my-dishes/index' })
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
.editor-banner-sub,
.section-title,
.section-sub {
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

.section + .section {
  margin-top: 34rpx;
  padding-top: 30rpx;
  border-top: 1rpx solid #f3e7df;
}

.section-head {
  margin-bottom: 24rpx;
}

.section-head.with-action {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16rpx;
}

.section-title {
  color: $text-main;
  font-size: 30rpx;
  font-weight: 900;
}

.section-sub {
  margin-top: 10rpx;
  color: $text-sub;
  font-size: 23rpx;
  line-height: 1.6;
}

.cover-panel {
  padding: 20rpx;
  border-radius: 24rpx;
  background: linear-gradient(180deg, #fffefb 0%, #fff7ef 100%);
}

.cover-image {
  width: 100%;
  height: 340rpx;
  border-radius: 24rpx;
  background: #f8f1eb;
}

.cover-actions,
.step-media-actions,
.actions {
  display: grid;
  gap: 16rpx;
}

.cover-actions {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 18rpx;
}

.cover-action-btn {
  padding: 0 22rpx;
  line-height: 1.2;
  text-align: center;
}

.cover-action-btn text,
.category-chip text,
.add-inline-btn text,
.sync-btn text,
.remove-btn text,
.square-btn text,
.media-action-btn text,
.save text,
.delete-btn text {
  display: block;
  width: 100%;
  line-height: 1.2;
  text-align: center;
}

.subtle-btn {
  background: #fffaf6;
}

.field {
  margin-top: 24rpx;
}

.field.compact {
  margin-top: 0;
}

.field > text {
  display: block;
  margin-bottom: 12rpx;
  color: $text-main;
  font-size: 28rpx;
  font-weight: 900;
}

.field-stack {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 214rpx;
  gap: 18rpx;
  align-items: center;
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
  line-height: 1.55;
}

.chips {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14rpx;
}

.category-chip,
.ingredient-tab,
.preset-pill {
  height: 62rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16rpx;
  border: 1rpx solid $border;
  border-radius: 999rpx;
  color: $text-sub;
  font-size: 25rpx;
  font-weight: 800;
  line-height: 1.2;
  text-align: center;
}

.category-chip.active,
.ingredient-tab.active {
  border-color: $primary;
  color: #fff;
  background: $primary;
}

.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22rpx;
}

.three-col {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18rpx;
}

.minutes-wrap {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 0 18rpx;
  border: 1rpx solid $border;
  border-radius: 20rpx;
  background: #fffdfb;
}

.minutes-wrap input {
  min-height: 76rpx;
  padding: 0;
  border: 0;
  border-radius: 0;
  text-align: right;
}

.minutes-wrap text {
  color: $text-sub;
  font-size: 24rpx;
}

.add-inline-btn {
  min-width: 174rpx;
  height: 68rpx;
  padding: 0 18rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
}

.ingredient-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.ingredient-tab {
  min-width: 118rpx;
  padding: 0 22rpx;
  background: #fffaf6;
}

.ingredient-list,
.step-list {
  display: grid;
  gap: 18rpx;
  margin-top: 20rpx;
}

.ingredient-card,
.step-card {
  padding: 20rpx;
  border: 1rpx solid #f1e2d7;
  border-radius: 24rpx;
  background: linear-gradient(180deg, #fffefb 0%, #fffaf5 100%);
}

.ingredient-top,
.step-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16rpx;
}

.ingredient-group {
  flex: 1;
}

.ingredient-group text,
.step-label {
  display: block;
  color: $text-main;
  font-size: 24rpx;
  font-weight: 800;
}

.mini-picker {
  margin-top: 10rpx;
  min-height: 66rpx;
  padding: 14rpx 18rpx;
  font-size: 25rpx;
}

.remove-btn {
  min-width: 98rpx;
  height: 58rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 18rpx;
  border-radius: 999rpx;
  background: #fff3ef;
  color: #d34b2f;
  font-size: 22rpx;
  font-weight: 800;
  line-height: 1.2;
  text-align: center;
}

.ingredient-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
  margin-top: 18rpx;
}

.empty-box {
  margin-top: 20rpx;
  padding: 28rpx 24rpx;
  border-radius: 20rpx;
  background: #fff8f1;
  color: $text-sub;
  font-size: 24rpx;
  line-height: 1.5;
  text-align: center;
}

.empty-steps-box {
  margin-top: 20rpx;
}

.timeline-note {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
  padding: 18rpx 20rpx;
  border-radius: 20rpx;
  background: #fff8f1;
}

.timeline-note text {
  color: $text-sub;
  font-size: 23rpx;
  line-height: 1.5;
}

.sync-btn {
  min-width: 160rpx;
  height: 58rpx;
  padding: 0 18rpx;
  border-radius: 18rpx;
  font-size: 22rpx;
}

.step-index {
  display: flex;
  align-items: center;
  gap: 14rpx;
}

.step-no {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: $primary;
  color: #fff;
  font-size: 24rpx;
  font-weight: 900;
}

.step-order-actions {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.square-btn {
  width: 58rpx;
  min-width: 58rpx;
  height: 58rpx;
  padding: 0;
  border-radius: 18rpx;
}

.media-action-btn {
  padding: 0 20rpx;
  text-align: center;
}

.step-media {
  margin-top: 18rpx;
}

.step-preview {
  width: 100%;
  height: 248rpx;
  border-radius: 22rpx;
  background: #f8f1eb;
}

.step-media-actions {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 14rpx;
}

.actions {
  margin-top: 28rpx;
}

.save,
.delete-btn {
  width: 100%;
}

.delete-btn {
  border-color: rgba(211, 75, 47, 0.3);
  color: #d34b2f;
  background: #fffaf8;
}
</style>
