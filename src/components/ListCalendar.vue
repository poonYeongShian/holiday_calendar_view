<template>
  <div class="list-calendar">
    <!-- Filters Section -->
    <div class="flex flex-wrap gap-4 mb-6 items-center">
      <div class="flex-1 min-w-[200px]">
        <label class="block text-sm font-medium text-gray-700 mb-2">Year</label>
        <Dropdown
          v-model="selectedYear"
          :options="yearOptions"
          placeholder="Select Year"
          class="w-full"
        />
      </div>
      
      <div class="flex-1 min-w-[200px]">
        <label class="block text-sm font-medium text-gray-700 mb-2">Month</label>
        <Dropdown
          v-model="selectedMonth"
          :options="monthOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Select Month"
          class="w-full"
        />
      </div>
    </div>

    <!-- Holidays Table -->
    <div class="border rounded-lg overflow-hidden">
      <DataTable
        :value="sortedHolidays"
        sortMode="single"
        :sortField="sortField"
        :sortOrder="sortOrder"
        @sort="onSort"
        class="p-datatable-sm"
        stripedRows
        :paginator="filteredHolidays.length > 10"
        :rows="10"
        :rowsPerPageOptions="[10, 25, 50]"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      >
        <Column
          field="date"
          header="Date"
          sortable
          class="font-medium"
        >
          <template #body="slotProps">
            {{ formatDate(slotProps.data.date) }}
          </template>
        </Column>
        
        <Column
          field="name"
          header="Holiday Name"
          sortable
          class="font-medium"
        >
          <template #body="slotProps">
            {{ slotProps.data.name }}
          </template>
        </Column>
        
        <Column
          field="countryId"
          header="Type"
          sortable
          class="font-medium"
        >
          <template #body="slotProps">
            <span
              :class="[
                'px-2 py-1 rounded text-xs font-semibold',
                slotProps.data.countryId === 0
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-green-100 text-green-800'
              ]"
            >
              {{ slotProps.data.countryId === 0 ? 'Manual' : 'Imported' }}
            </span>
          </template>
        </Column>
        
        <Column
          v-if="store.viewMode === 'edit'"
          header="Actions"
          class="font-medium"
          :style="{ width: '150px' }"
        >
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button
                icon="pi pi-pencil"
                @click="openEditDialog(slotProps.data)"
                class="p-button-sm p-button-warning"
                size="small"
                text
                rounded
              />
              <Button
                icon="pi pi-trash"
                @click="confirmDelete(slotProps.data.id, slotProps.data.date)"
                class="p-button-sm p-button-danger"
                size="small"
                text
                rounded
              />
            </div>
          </template>
        </Column>
      </DataTable>
      
      <!-- Empty State -->
      <div
        v-if="filteredHolidays.length === 0"
        class="text-center py-12 text-gray-500"
      >
        <i class="pi pi-calendar text-4xl mb-4 block"></i>
        <p class="text-lg">No holidays found for the selected period</p>
      </div>
    </div>

    <!-- Add/Edit Dialog -->
    <Dialog
      v-model:visible="showHolidayDialog"
      :header="editingHoliday ? 'Edit Holiday' : 'Add Holiday'"
      :modal="true"
      class="w-full max-w-lg"
    >
      <div class="flex flex-col gap-4 p-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Holiday Name</label>
          <InputText
            v-model="holidayForm.name"
            placeholder="Enter holiday name"
            class="w-full"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <Calendar
            v-model="holidayForm.date"
            dateFormat="yy-mm-dd"
            class="w-full"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <Dropdown
            v-model="holidayForm.type"
            :options="['manual', 'imported']"
            placeholder="Select type"
            class="w-full"
          />
        </div>

        <div v-if="holidayForm.type === 'imported'">
          <label class="block text-sm font-medium text-gray-700 mb-2">Country ID</label>
          <InputText
            v-model="countryIdString"
            type="number"
            placeholder="Enter country ID (non-zero)"
            class="w-full"
          />
        </div>

        <div class="flex gap-2 justify-end mt-4">
          <Button
            label="Cancel"
            @click="showHolidayDialog = false"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            size="small"
          />
          <Button
            label="Save"
            @click="saveHoliday"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            size="small"
            :disabled="!holidayForm.name || !holidayForm.date"
          />
        </div>
      </div>
    </Dialog>

    <!-- Delete Confirmation -->
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useHolidayStore } from '../stores/holidayStore'
import { useHolidayOperations } from '../composables/useHolidayOperations'
import { formatDate } from '../utils/dateHelpers'
import type { HolidayWithDate } from '../stores/types'
import Dropdown from 'primevue/dropdown'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Calendar from 'primevue/calendar'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'

const store = useHolidayStore()
const { addHoliday, updateHoliday, deleteHoliday } = useHolidayOperations()
const confirm = useConfirm()

// Sorting state
const sortField = ref<string>('date')
const sortOrder = ref<number>(1) // 1 for ascending, -1 for descending

// Filter state
const selectedYear = ref<number>(store.currentYear)
const selectedMonth = ref<number | null>(null)

// Dialog state
const showHolidayDialog = ref(false)
const editingHoliday = ref<HolidayWithDate | null>(null)

const holidayForm = ref({
  name: '',
  date: new Date(),
  type: 'manual' as 'manual' | 'imported',
  countryId: 0
})

const countryIdString = computed({
  get: () => holidayForm.value.countryId.toString(),
  set: (value: string) => {
    holidayForm.value.countryId = parseInt(value) || 0
  }
})

// Year options - dynamic based on current year
const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear()
  return [currentYear - 1, currentYear, currentYear + 1]
})

// Month options
const monthOptions = computed(() => [
  { label: 'All Months', value: null },
  { label: 'January', value: 0 },
  { label: 'February', value: 1 },
  { label: 'March', value: 2 },
  { label: 'April', value: 3 },
  { label: 'May', value: 4 },
  { label: 'June', value: 5 },
  { label: 'July', value: 6 },
  { label: 'August', value: 7 },
  { label: 'September', value: 8 },
  { label: 'October', value: 9 },
  { label: 'November', value: 10 },
  { label: 'December', value: 11 }
])

// Filtered holidays based on year and month
const filteredHolidays = computed(() => {
  return store.holidaysByYearAndMonth(selectedYear.value, selectedMonth.value ?? undefined)
})

// Sorted holidays based on user selection
const sortedHolidays = computed(() => {
  const holidays = [...filteredHolidays.value]
  
  if (!sortField.value) {
    return holidays
  }
  
  return holidays.sort((a, b) => {
    let aValue: any
    let bValue: any
    
    if (sortField.value === 'date') {
      aValue = a.date.getTime()
      bValue = b.date.getTime()
    } else if (sortField.value === 'name') {
      aValue = a.name.toLowerCase()
      bValue = b.name.toLowerCase()
    } else if (sortField.value === 'countryId') {
      aValue = a.countryId
      bValue = b.countryId
    } else {
      return 0
    }
    
    if (aValue < bValue) {
      return -1 * sortOrder.value
    }
    if (aValue > bValue) {
      return 1 * sortOrder.value
    }
    return 0
  })
})

// Handle sort events from DataTable
const onSort = (event: any) => {
  sortField.value = event.sortField
  sortOrder.value = event.sortOrder
}

// Dialog functions
const openEditDialog = (holiday: HolidayWithDate) => {
  editingHoliday.value = holiday
  holidayForm.value = {
    name: holiday.name,
    date: new Date(holiday.date),
    type: holiday.countryId === 0 ? 'manual' : 'imported',
    countryId: holiday.countryId
  }
  showHolidayDialog.value = true
}

const saveHoliday = async () => {
  const countryId = holidayForm.value.type === 'manual' ? 0 : (holidayForm.value.countryId || 10)
  
  if (editingHoliday.value) {
    // Update existing holiday
    await updateHoliday(
      editingHoliday.value.id,
      holidayForm.value.name,
      editingHoliday.value.date,
      holidayForm.value.date,
      countryId
    )
  } else {
    // Add new holiday
    await addHoliday(
      holidayForm.value.name,
      holidayForm.value.date,
      countryId
    )
  }
  showHolidayDialog.value = false
}

const confirmDelete = (id: number, date: Date) => {
  confirm.require({
    message: 'Are you sure you want to delete this holiday?',
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      deleteHoliday(id, date)
    }
  })
}

// Watch for changes in store.currentYear to update selectedYear
watch(
  () => store.currentYear,
  (newYear) => {
    selectedYear.value = newYear
  }
)
</script>

<style scoped>
.list-calendar {
  width: 100%;
}
</style>
