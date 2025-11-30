<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Employee Management</h2>

    <!-- Employee List -->
    <DataTable
      :value="store.employees"
      class="p-datatable-sm"
      stripedRows
      :paginator="true"
      :rows="10"
    >
      <Column field="name" header="Name" class="font-semibold"></Column>
      <Column field="email" header="Email"></Column>
      
      <Column header="Assigned Holidays">
        <template #body="{ data }">
          <div class="flex flex-wrap gap-2">
            <Badge
              v-for="holidayId in data.assignedHolidays"
              :key="holidayId"

              class="bg-blue-100 text-blue-800 text-xs px-2 py-1"
            />
          </div>
        </template>
      </Column>

      <Column header="Actions">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button
              label="Assign"
              icon="pi pi-plus"
              @click="openAssignDialog(data)"
              class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
              size="small"
            />
            <Button
              label="Unassign"
              icon="pi pi-minus"
              @click="openUnassignDialog(data)"
              class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
              size="small"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Assign Dialog -->
    <Dialog
      v-model:visible="showAssignDialog"
      header="Assign Holiday to Employee"
      :modal="true"
      class="w-full max-w-md"
    >
      <div class="flex flex-col gap-4 p-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Employee</label>
          <InputText
            :modelValue="selectedEmployee?.name"
            disabled
            class="w-full bg-gray-100"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Select Holiday</label>
          <Dropdown
            v-model="selectedHolidayId"

            optionLabel="label"
            optionValue="value"
            placeholder="Choose a holiday"
            class="w-full"
          />
        </div>

        <div class="flex gap-2 justify-end mt-4">
          <Button
            label="Cancel"
            @click="showAssignDialog = false"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            size="small"
          />
          <Button
            label="Assign"

            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            size="small"
            :disabled="!selectedHolidayId"
          />
        </div>
      </div>
    </Dialog>

    <!-- Unassign Dialog -->
    <Dialog
      v-model:visible="showUnassignDialog"
      header="Unassign Holiday from Employee"
      :modal="true"
      class="w-full max-w-md"
    >
      <div class="flex flex-col gap-4 p-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Employee</label>
          <InputText
            :modelValue="selectedEmployee?.name"
            disabled
            class="w-full bg-gray-100"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Select Holiday to Remove</label>
        </div>

        <div class="flex gap-2 justify-end mt-4">
          <Button
            label="Cancel"
            @click="showUnassignDialog = false"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            size="small"
          />
          <Button
            label="Unassign"

            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            size="small"
            :disabled="!selectedHolidayId"
          />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHolidayStore } from '../stores/holidayStore'
import type { Employee } from '../stores/types'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'

const store = useHolidayStore()

const showAssignDialog = ref(false)
const showUnassignDialog = ref(false)
const selectedEmployee = ref<Employee | null>(null)
const selectedHolidayId = ref<string>('')

// const getHolidayName = (holidayId: string): string => {
//   const holiday = store.holidays.find(h => h.id === holidayId)
//   return holiday ? holiday.name : 'Unknown'
// }

// const availableHolidays = computed(() => {
//   if (!selectedEmployee.value) return []
  
//   return store.holidays
//     .filter(h => !selectedEmployee.value!.assignedHolidays.includes(h.id))
//     .map(h => ({
//       label: `${h.name} - ${new Date(h.date).toLocaleDateString()}`,
//       value: h.id
//     }))
// })

// const assignedHolidays = computed(() => {
//   if (!selectedEmployee.value) return []
  
//   return selectedEmployee.value.assignedHolidays.map(holidayId => {
//     const holiday = store.holidays.find(h => h.id === holidayId)
//     return {
//       label: holiday ? `${holiday.name} - ${new Date(holiday.date).toLocaleDateString()}` : 'Unknown',
//       value: holidayId
//     }
//   })
// })

const openAssignDialog = (employee: Employee) => {
  selectedEmployee.value = employee
  selectedHolidayId.value = ''
  showAssignDialog.value = true
}

const openUnassignDialog = (employee: Employee) => {
  selectedEmployee.value = employee
  selectedHolidayId.value = ''
  showUnassignDialog.value = true
}

// const handleAssign = () => {
//   if (selectedEmployee.value && selectedHolidayId.value) {
//     store.assignEmployee(selectedEmployee.value.id, selectedHolidayId.value)
//     showAssignDialog.value = false
//   }
// }

// const handleUnassign = () => {
//   if (selectedEmployee.value && selectedHolidayId.value) {
//     store.unassignEmployee(selectedEmployee.value.id, selectedHolidayId.value)
//     showUnassignDialog.value = false
//   }
// }
</script>
