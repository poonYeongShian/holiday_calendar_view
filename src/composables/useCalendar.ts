import { computed } from 'vue'
import { useHolidayStore } from '../stores/holidayStore'
import { getMonthDays, getMonthStartDay, getAllMonths, FIRST_DAY_OF_WEEK } from '../utils/dateHelpers'

export const useCalendar = () => {
  const store = useHolidayStore()

  const currentMonthDays = computed(() => {
    const month = store.selectedDate.getMonth()
    const year = store.currentYear
    return getMonthDays(year, month)
  })

  const currentMonthStartDay = computed(() => {
    const month = store.selectedDate.getMonth()
    const year = store.currentYear
    return getMonthStartDay(year, month, FIRST_DAY_OF_WEEK)
  })

  const yearMonths = computed(() => {
    return getAllMonths().map(month => ({
      month,
      days: getMonthDays(store.currentYear, month),
      startDay: getMonthStartDay(store.currentYear, month, FIRST_DAY_OF_WEEK)
    }))
  })

  return {
    currentMonthDays,
    currentMonthStartDay,
    yearMonths
  }
}
