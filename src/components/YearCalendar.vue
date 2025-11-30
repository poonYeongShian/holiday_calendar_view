<template>
  <div class="bg-white rounded-lg shadow p-4">
    <h3 class="text-xl font-bold text-gray-800 mb-4 text-center">{{ currentYear }}</h3>
    
    <div class="grid grid-cols-3 gap-4">
      <div
        v-for="monthData in yearMonths"
        :key="monthData.month"
        class="bg-gray-50 rounded p-2"
      >
        <h4 class="text-sm font-semibold text-gray-700 mb-2 text-center">
          {{ getMonthName(monthData.month) }}
        </h4>
        
        <div class="grid grid-cols-7 gap-1">
          <!-- Mini day headers -->
          <div
            v-for="day in miniDayNames"
            :key="day"
            class="text-center text-xs text-gray-500 h-4"
          >
            {{ day }}
          </div>

          <!-- Empty cells -->
          <div
            v-for="i in monthData.startDay"
            :key="`empty-${monthData.month}-${i}`"
            class="h-6"
          ></div>

          <!-- Mini calendar days -->
          <div
            v-for="date in monthData.days"
            :key="date.toISOString()"
            class="h-6 relative"
          >
            <button
              @click="selectDate(date)"
              :class="[
                'w-full h-full rounded text-xs flex items-center justify-center transition-all',
                isSelected(date)
                  ? 'bg-blue-500 text-white font-bold'
                  : 'hover:bg-gray-200'
              ]"
            >
              {{ date.getDate() }}
            </button>
            <div
              v-if="hasHolidays(date)"
              :class="[
                'absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full',
                isSelected(date) ? 'bg-white' : 'bg-blue-500'
              ]"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHolidayStore } from '../stores/holidayStore'
import { useCalendar } from '../composables/useCalendar'
import { getMonthName, getDayName, isSameDay, FIRST_DAY_OF_WEEK } from '../utils/dateHelpers'

const store = useHolidayStore()
const { yearMonths } = useCalendar()

const miniDayNames = computed(() => {
  return Array.from({ length: 7 }, (_, i) => getDayName(i, FIRST_DAY_OF_WEEK).charAt(0))
})

const currentYear = computed(() => store.currentYear)

const selectDate = (date: Date) => {
  store.setSelectedDate(date)
}

const isSelected = (date: Date): boolean => {
  return isSameDay(date, store.selectedDate)
}

const hasHolidays = (date: Date): boolean => {
  return store.getHolidaysForDate(date).length > 0
}
</script>
