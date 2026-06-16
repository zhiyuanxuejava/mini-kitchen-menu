export interface TimelineGroup<T> {
  monthKey: string
  monthLabel: string
  items: Array<T & { dayLabel: string }>
}

const UNKNOWN_GROUP_KEY = 'unknown'
const UNKNOWN_GROUP_LABEL = '时间未记录'

function formatMonthLabel(year: number, month: number) {
  return `${year} 年 ${month} 月`
}

function formatDayLabel(month: number, day: number) {
  return `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function groupByMonth<T>(
  items: T[],
  getDate: (item: T) => string | undefined
): TimelineGroup<T>[] {
  const groups = new Map<string, TimelineGroup<T>>()

  for (const item of items) {
    const raw = getDate(item)
    const date = raw ? new Date(raw) : null

    if (!date || Number.isNaN(date.getTime())) {
      const existing = groups.get(UNKNOWN_GROUP_KEY) ?? {
        monthKey: UNKNOWN_GROUP_KEY,
        monthLabel: UNKNOWN_GROUP_LABEL,
        items: []
      }
      existing.items.push({ ...item, dayLabel: '--' })
      groups.set(UNKNOWN_GROUP_KEY, existing)
      continue
    }

    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const monthKey = `${year}-${String(month).padStart(2, '0')}`
    const existing = groups.get(monthKey) ?? {
      monthKey,
      monthLabel: formatMonthLabel(year, month),
      items: []
    }
    existing.items.push({ ...item, dayLabel: formatDayLabel(month, day) })
    groups.set(monthKey, existing)
  }

  return [...groups.values()].sort((a, b) => {
    if (a.monthKey === UNKNOWN_GROUP_KEY) return 1
    if (b.monthKey === UNKNOWN_GROUP_KEY) return -1
    return b.monthKey.localeCompare(a.monthKey)
  })
}
