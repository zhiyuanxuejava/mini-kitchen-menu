import type { DishCategory, Ingredient } from './types'

export const categoryLabels: Record<DishCategory | 'all', string> = {
  all: '全部',
  meat: '荤菜',
  vegetable: '素菜',
  soup: '汤类',
  staple: '主食',
  aquatic: '水产',
  breakfast: '早餐',
  dessert: '甜品',
  drink: '饮品',
  condiment: '调料',
  semi_finished: '半成品',
  other: '其他'
}

export const groupLabels: Record<Ingredient['groupType'], string> = {
  main: '主料',
  side: '辅料',
  seasoning: '调料'
}
