import type { Dish, DishStep } from '@/data/types'

type DishStepSource = Pick<Dish, 'id' | 'steps' | 'description' | 'remark' | 'estimatedMinutes' | 'coverImage' | 'detailImage'>

const FALLBACK_STEP_TITLE = '默认做法'
const FALLBACK_STEP_DESCRIPTION = '这道菜还没有拆分做法步骤，可以先按当前菜品描述完成。'
const FALLBACK_STEP_HEAT = '按个人习惯'
const FALLBACK_STEP_TIP = '这道菜暂未填写详细步骤，后续可以在编辑菜品时继续补充。'

export function hasStructuredDishSteps(dish?: DishStepSource | null) {
  return Boolean(dish?.steps?.length)
}

export function resolvedDishSteps(dish?: DishStepSource | null): DishStep[] {
  if (dish?.steps?.length) return dish.steps

  return [
    {
      id: `${dish?.id || 'dish'}-fallback-step-1`,
      stepNo: 1,
      title: FALLBACK_STEP_TITLE,
      description: dish?.description?.trim() || FALLBACK_STEP_DESCRIPTION,
      image: dish?.detailImage || dish?.coverImage || '',
      heat: FALLBACK_STEP_HEAT,
      minutes: Math.max(1, Number(dish?.estimatedMinutes) || 1),
      tips: dish?.remark?.trim() || FALLBACK_STEP_TIP
    }
  ]
}
