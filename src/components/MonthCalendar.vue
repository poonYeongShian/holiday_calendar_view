<template>
  <div class="bg-white rounded-lg shadow p-4">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-800">
        {{ getMonthName(selectedDate.getMonth()) }} {{ currentYear }}
      </h3>
    </div>

    <div class="grid grid-cols-7 gap-1">
      <!-- Day headers -->
      <div
        v-for="day in dayNames"
        :key="day"
        class="text-center text-xs font-medium text-gray-600 py-2"
      >
        {{ day }}
      </div>

      <!-- Empty cells for days before month starts -->
      <div
        v-for="i in monthStartDay"
        :key="`empty-${i}`"
        class="aspect-square"
      ></div>

      <!-- Calendar days -->
      <div
        v-for="date in monthDays"
        :key="date.toISOString()"
        class="aspect-square"
      >
        <button
          @click="selectDate(date)"
          :class="[
            'w-full h-full rounded flex flex-col items-center justify-center text-sm transition-all',
            isSelected(date)
              ? 'bg-blue-500 text-white font-bold'
              : 'hover:bg-gray-100',
            hasHolidays(date) ? 'ring-2 ring-green-400' : ''
          ]"
        >
          <span>{{ date.getDate() }}</span>
          <span v-if="hasHolidays(date)" class="text-xs mt-1">
            {{ getHolidayCount(date) }}⛱️
          </span>
        </button>
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
const { currentMonthDays, currentMonthStartDay } = useCalendar()

const dayNames = computed(() => {
  return Array.from({ length: 7 }, (_, i) => getDayName(i, FIRST_DAY_OF_WEEK))
})

const selectedDate = computed(() => store.selectedDate)
const currentYear = computed(() => store.currentYear)
const monthDays = currentMonthDays
const monthStartDay = currentMonthStartDay

const selectDate = (date: Date) => {
  store.setSelectedDate(date)
}

const isSelected = (date: Date): boolean => {
  return isSameDay(date, store.selectedDate)
}

const hasHolidays = (date: Date): boolean => {
  return store.getHolidaysForDate(date).length > 0
}

const getHolidayCount = (date: Date): number => {
  return store.getHolidaysForDate(date).length
}
</script>
