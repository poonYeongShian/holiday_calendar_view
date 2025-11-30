<template>
  <div class="bg-white rounded-lg shadow p-6">
    <!-- Header Controls -->
    <div class="flex flex-wrap gap-4 mb-6 items-center justify-between">
      <!-- Dynamic Month/Year Navigation -->
      <div class="flex gap-2 items-center">
        <Button
          label="<"
          @click="handlePrev"
          :disabled="!canGoPrev"
          class="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          size="small"
        />
        <Button
          v-if="!store.isViewingCurrentPeriod"
          label="Today"
          @click="handleToday"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          size="small"
        />
        <span class="text-lg font-semibold text-gray-800 min-w-[120px] text-center">
          {{ navigationLabel }}
        </span>
        <Button
          label=">"
          @click="handleNext"
          :disabled="!canGoNext"
          class="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          size="small"
        />
      </div>

      <!-- View Mode Toggle -->
      <div class="flex gap-2 items-center">
        <span class="text-sm font-medium text-gray-700">View:</span>
        <SelectButton
          v-model="calendarDisplayMode"
          :options="displayModes"
          optionLabel="label"
          optionValue="value"
          class="text-sm"
        />
      </div>
    </div>

    <!-- Mode and Import Controls -->
    <div class="flex flex-wrap gap-4 mb-6 items-center justify-between">
      <!-- Edit Mode Toggle -->
      <div class="flex gap-2 items-center">
        <span class="text-sm font-medium text-gray-700">Mode:</span>
        <SelectButton
          v-model="viewMode"
          :options="viewModes"
          optionLabel="label"
          optionValue="value"
          class="text-sm"
        />
      </div>

      <!-- Import Button -->
      <Button
        label="Import from Country"
        icon="pi pi-download"
        @click="showImportDialog = true"
        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        size="small"
      />
    </div>

    <!-- Calendar Display -->
    <MonthCalendar v-if="calendarDisplayMode === 'month'" />
    <YearCalendar v-else-if="calendarDisplayMode === 'year'" />
    <ListCalendar v-else-if="calendarDisplayMode === 'list'" />

    <!-- Import Dialog -->
    <Dialog
      v-model:visible="showImportDialog"
      header="Import Country Holidays"
      :modal="true"
      class="w-full max-w-md"
    >
      <div class="flex flex-col gap-4 p-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Country</label>
          <Dropdown
            v-model="selectedCountry"
            :options="countries"
            placeholder="Select a country"
            class="w-full"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Year</label>
          <InputNumber
            v-model="importYear"
            :min="2020"
            :max="2030"
            class="w-full"
          />
        </div>

        <div class="flex gap-2 justify-end mt-4">
          <Button
            label="Cancel"
            @click="showImportDialog = false"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            size="small"
          />
          <Button
            label="Import"
            @click="handleImport"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            size="small"
            :disabled="!selectedCountry"
          />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHolidayStore } from '../stores/holidayStore'
import { useHolidayOperations } from '../composables/useHolidayOperations'
import { getMonthName } from '../utils/dateHelpers'
import MonthCalendar from './MonthCalendar.vue'
import YearCalendar from './YearCalendar.vue'
import ListCalendar from './ListCalendar.vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import SelectButton from 'primevue/selectbutton'

const store = useHolidayStore()
const { importHolidays } = useHolidayOperations()

const showImportDialog = ref(false)
const selectedCountry = ref<string>('')
const importYear = ref(new Date().getFullYear())

const countries = ['USA', 'UK', 'Canada']

const displayModes = [
  { label: 'Month', value: 'month' },
  { label: 'Year', value: 'year' },
  { label: 'List', value: 'list' }
]

const viewModes = [
  { label: 'View', value: 'view' },
  { label: 'Edit', value: 'edit' }
]

const calendarDisplayMode = computed({
  get: () => store.calendarDisplayMode,
  set: (value) => store.setCalendarDisplayMode(value)
})

const viewMode = computed({
  get: () => store.viewMode,
  set: (value) => store.setViewMode(value)
})

const navigationLabel = computed(() => {
  if (calendarDisplayMode.value === 'month') {
    return `${getMonthName(store.selectedDate.getMonth())} ${store.currentYear}`
  } else {
    return `${store.currentYear}`
  }
})

const canGoPrev = computed(() => {
  if (calendarDisplayMode.value === 'month') {
    return store.canNavigatePrevMonth
  } else {
    return store.canNavigatePrevYear
  }
})

const canGoNext = computed(() => {
  if (calendarDisplayMode.value === 'month') {
    return store.canNavigateNextMonth
  } else {
    return store.canNavigateNextYear
  }
})

const handlePrev = () => {
  if (calendarDisplayMode.value === 'month') {
    store.switchMonth('prev')
  } else {
    store.switchYear('prev')
  }
}

const handleNext = () => {
  if (calendarDisplayMode.value === 'month') {
    store.switchMonth('next')
  } else {
    store.switchYear('next')
  }
}

const handleToday = () => {
  store.resetToToday()
}

const handleImport = async () => {
  if (selectedCountry.value) {
    await importHolidays(selectedCountry.value, importYear.value)
    showImportDialog.value = false
    selectedCountry.value = ''
  }
}
</script>
