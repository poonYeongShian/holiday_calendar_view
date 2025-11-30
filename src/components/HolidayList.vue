<template>
  <div class="bg-white rounded-lg shadow p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl font-bold text-gray-800">
        Holidays for {{ formatDate(store.selectedDate) }}
      </h3>
      <Button
        v-if="store.viewMode === 'edit'"
        label="Add Holiday"
        icon="pi pi-plus"
        @click="openAddDialog"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        size="small"
      />
    </div>

    <!-- Holiday List -->
    <div v-if="filteredHolidays.length > 0" class="space-y-3">
      <Card
        v-for="holiday in filteredHolidays"
        :key="holiday.id"
        class="border border-gray-200"
      >
        <template #content>
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <h4 class="text-lg font-semibold text-gray-800">{{ holiday.name }}</h4>
                <Badge
                  :value="holiday.countryId === 0 ? 'manual' : 'imported'"
                  :class="[
                    'text-xs px-2 py-1 rounded',
                    holiday.countryId !== 0
                      ? 'bg-blue-100 text-blue-800 border border-blue-500'
                      : 'bg-green-100 text-green-800 border border-green-500'
                  ]"
                />
              </div>
              
              <p class="text-sm text-gray-600 mb-2">{{ formatShortDate(holiday.date) }}</p>
              
              <div v-if="holiday.countryId !== 0" class="text-sm text-gray-500 mb-2">
                Country ID: {{ holiday.countryId }}
              </div>
            </div>

            <!-- Actions -->
            <div v-if="store.viewMode === 'edit'" class="flex gap-2">
              <Button
                icon="pi pi-pencil"
                @click="openEditDialog(holiday)"
                class="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
                size="small"
                text
              />
              <Button
                icon="pi pi-trash"
                @click="confirmDelete(holiday.id)"
                class="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                size="small"
                text
              />
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 text-gray-500">
      <i class="pi pi-calendar text-4xl mb-4"></i>
      <p>No holidays on this date</p>
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
import { ref, computed } from 'vue'
import { useHolidayStore } from '../stores/holidayStore'
import { useHolidayOperations } from '../composables/useHolidayOperations'
import { formatDate, formatShortDate } from '../utils/dateHelpers'
import type { HolidayWithDate } from '../stores/types'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Badge from 'primevue/badge'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'

const store = useHolidayStore()
const { addHoliday, updateHoliday, deleteHoliday } = useHolidayOperations()
const confirm = useConfirm()

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

const filteredHolidays = computed(() => store.filteredHolidaysByDate)

const openAddDialog = () => {
  editingHoliday.value = null
  holidayForm.value = {
    name: '',
    date: new Date(store.selectedDate),
    type: 'manual',
    countryId: 0
  }
  showHolidayDialog.value = true
}

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

const confirmDelete = (id: number) => {
  confirm.require({
    message: 'Are you sure you want to delete this holiday?',
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      const holiday = filteredHolidays.value.find(h => h.id === id)
      if (holiday) {
        deleteHoliday(id, holiday.date)
      }
    }
  })
}
</script>
