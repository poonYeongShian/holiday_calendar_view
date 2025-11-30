<template>
  <div class="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
    <Panel class="mb-4 shadow-md">
      <template #header>
        <h1 class="text-3xl font-bold text-gray-800">Holiday Calendar System</h1>
      </template>

      <TabView v-model:activeIndex="activeTabIndex" class="mt-4">
        <TabPanel value="0">
          <template #header>
            <span>Holiday Calendar</span>
          </template>
          <HolidayCalendarTab />
        </TabPanel>

        <TabPanel value="1">
          <template #header>
            <span>Employee Management</span>
          </template>
          <EmployeeTab />
        </TabPanel>
      </TabView>

      <!-- Loading Overlay -->
      <div
        v-if="store.isLoading"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <ProgressSpinner
          style="width: 50px; height: 50px"
          strokeWidth="4"
          fill="transparent"
          animationDuration=".5s"
        />
      </div>
    </Panel>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useHolidayStore } from '../stores/holidayStore'
import HolidayCalendarTab from './HolidayCalendarTab.vue'
import EmployeeTab from './EmployeeTab.vue'
import Panel from 'primevue/panel'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import ProgressSpinner from 'primevue/progressspinner'

const store = useHolidayStore()
const activeTabIndex = ref(0)

// Sync tab index with store
watch(activeTabIndex, (newIndex) => {
  store.setActiveTab(newIndex === 0 ? 'holiday' : 'employee')
})

watch(() => store.activeTab, (newTab) => {
  activeTabIndex.value = newTab === 'holiday' ? 0 : 1
})

// Fetch holidays on mount
onMounted(async () => {
  await store.fetchHolidaysThreeYears()
})
</script>
