<template>
  <div :class="store.calendarDisplayMode === 'list' ? 'grid grid-cols-1' : 'grid grid-cols-1 lg:grid-cols-2 gap-6'">
    <HolidayCalendarView />
    <HolidayList v-if="store.calendarDisplayMode !== 'list'" />
  </div>
</template>

<script setup lang="ts">
import { useHolidayStore } from '../stores/holidayStore'
import HolidayCalendarView from './HolidayCalendarView.vue'
import HolidayList from './HolidayList.vue'

const store = useHolidayStore()
</script>
