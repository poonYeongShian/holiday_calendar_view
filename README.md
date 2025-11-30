# Holiday Calendar System - Technical Specification

## Tech Stack
- **Framework**: Vue 3 Composition API
- **Language**: TypeScript
- **State Management**: Pinia
- **UI Framework**: PrimeVue
- **Styling**: Tailwind CSS (inline classes)
- **Data Flow**: All component communication via Pinia (no props)
- **API Simulation**: Simulated CRUD operations with short delays
- **Data Fetch Strategy**: Single fetch for 3 years of holiday data

---

## Architecture Overview

### Store Structure (Pinia)

```typescript
// holidayStore.ts
- state:
  - holidays: Holiday[] // 3 years of data
  - selectedDate: Date
  - currentYear: number
  - viewMode: 'view' | 'edit'
  - calendarDisplayMode: 'month' | 'year'
  - employees: Employee[]
  - activeTab: 'employee' | 'holiday'
  - isLoading: boolean

- actions:
  - fetchHolidaysThreeYears() // Single API call
  - addHoliday(holiday: Holiday)
  - updateHoliday(id: string, holiday: Holiday)
  - deleteHoliday(id: string)
  - importCountryHolidays(country: string, year: number)
  - assignEmployee(employeeId: string, holidayId: string)
  - unassignEmployee(employeeId: string, holidayId: string)
  - setSelectedDate(date: Date)
  - setViewMode(mode: 'view' | 'edit')
  - setCalendarDisplayMode(mode: 'month' | 'year')
  - switchYear(direction: 'next' | 'prev' | 'current')

- getters:
  - filteredHolidaysByDate
  - holidaysByYear
  - importedHolidays
  - manualHolidays
```

---

## Component Structure

### 1. **App Container** (`HolidayCalendarContainer.vue`)
- Acts as form submission container
- Manages tab switching
- Subscribes to Pinia store
- No props, pure Pinia interaction
- Uses PrimeVue Panel or Card component
- Styled with inline Tailwind classes

### 2. **Tab System**
```
TabNavigation.vue (PrimeVue TabView)
  ├─ EmployeeTab.vue
  └─ HolidayCalendarTab.vue
      ├─ HolidayCalendarView.vue (LEFT)
      └─ HolidayList.vue (RIGHT)
```

### 3. **EmployeeTab Component**
- Display employee list using PrimeVue DataTable or Card components
- Assign/unassign employees to holidays
- Uses PrimeVue Dropdown for holiday selection
- Uses PrimeVue Button for actions
- Reads from: `store.employees`, `store.holidays`
- Actions: `assignEmployee()`, `unassignEmployee()`
- All styling via Tailwind utility classes

### 4. **HolidayCalendarTab Component** (Split Layout)

#### LEFT: **HolidayCalendarView Component**
- **Toggle View**: Month single calendar OR Year (mini calendars grid)
- **Year Navigation**: Previous year / Current year / Next year buttons (PrimeVue Button)
- **Import Feature**: "Import from Country" button (PrimeVue Dialog)
- **Mode Toggle**: View mode / Edit mode (PrimeVue SelectButton or ToggleButton)
- **Date Selection**: Click date to update `store.selectedDate`
- Uses PrimeVue Calendar component or custom calendar with Tailwind grid
- Actions: 
  - `setCalendarDisplayMode('month' | 'year')`
  - `switchYear()`
  - `importCountryHolidays()`
  - `setViewMode()`

#### RIGHT: **HolidayList Component**
- **Display**: Holidays for `store.selectedDate`
- **Color Coding**:
  - Imported holidays: Blue badge (PrimeVue Badge with Tailwind classes)
  - Manual holidays: Green badge (PrimeVue Badge with Tailwind classes)
- **CRUD Operations**:
  - Add holiday button (PrimeVue Button)
  - Edit holiday (PrimeVue Dialog)
  - Delete holiday button (PrimeVue Button with confirm dialog)
- Uses PrimeVue Card or DataView for holiday items
- Actions: `addHoliday()`, `updateHoliday()`, `deleteHoliday()`

---

## Data Models

### Holiday Interface
```typescript
interface Holiday {
  id: string
  name: string
  date: Date
  type: 'imported' | 'manual'
  country?: string
  assignedEmployees: string[] // employee IDs
  createdAt: Date
  updatedAt: Date
}
```

### Employee Interface
```typescript
interface Employee {
  id: string
  name: string
  email: string
  assignedHolidays: string[] // holiday IDs
}
```

---

## API Simulation (Mock Functions)

```typescript
// Mock delay: 300-500ms
- fetchHolidaysAPI(): Promise<Holiday[]> // Returns 3 years
- createHolidayAPI(holiday: Holiday): Promise<Holiday>
- updateHolidayAPI(id: string, holiday: Holiday): Promise<Holiday>
- deleteHolidayAPI(id: string): Promise<void>
- importCountryHolidaysAPI(country: string, year: number): Promise<Holiday[]>
```

---

## Key Features Breakdown

### Calendar Display Modes
1. **Month View**: Single large calendar showing one month (custom grid with Tailwind)
2. **Year View**: Grid of 12 mini calendars (Tailwind grid: `grid grid-cols-3 md:grid-cols-4`)

### Year Navigation
- Buttons: `← Previous Year` | `Current Year` | `Next Year →` (PrimeVue Button)
- Updates `store.currentYear`
- Filters displayed holidays

### Import Functionality
- PrimeVue Dialog with Dropdown to select country
- PrimeVue Calendar or InputNumber for year selection
- Imports holidays for `store.currentYear`
- Marks imported holidays with `type: 'imported'`

### View/Edit Mode
- **View Mode**: Read-only calendar, click to select dates
- **Edit Mode**: Can modify holidays directly from calendar
- Toggle using PrimeVue SelectButton component

### Color Coding System
- **Imported**: `bg-blue-100 text-blue-800 border-blue-500` (Tailwind)
- **Manual**: `bg-green-100 text-green-800 border-green-500` (Tailwind)
- Visual distinction in both calendar and list using PrimeVue Badge

---

## Component Communication Flow

```
User Action → Component calls Store Action → Store updates State → All components react to state change
```

**Example Flow - Add Holiday:**
1. User clicks "Add Holiday" in HolidayList component (PrimeVue Button)
2. PrimeVue Dialog opens with form (InputText, Calendar, Dropdown)
3. HolidayList calls `store.addHoliday(newHoliday)`
4. Store simulates API call (300ms delay)
5. Store updates `holidays` state
6. Both HolidayCalendarView and HolidayList automatically reflect new holiday

---

## UI Components Mapping (PrimeVue)

### Recommended PrimeVue Components:
- **TabView**: For tab navigation
- **Button**: All action buttons
- **Dialog**: Modals for add/edit/import
- **Card**: For employee and holiday cards
- **Badge**: For holiday type indicators
- **Dropdown/Select**: For country/holiday selection
- **Calendar**: For date picking
- **InputText**: For text inputs
- **DataTable**: Optional for employee list
- **ConfirmDialog**: For delete confirmations
- **ProgressSpinner**: For loading states
- **Chip**: For assigned employee tags

### Tailwind Utility Classes:
- Layout: `grid`, `flex`, `gap-4`, `p-4`, `m-2`
- Colors: `bg-blue-500`, `text-white`, `border-gray-300`
- Sizing: `w-full`, `h-screen`, `max-w-7xl`
- Spacing: `px-4`, `py-2`, `mt-4`, `mb-6`
- Typography: `text-lg`, `font-bold`, `text-center`
- Effects: `hover:bg-blue-600`, `transition-all`, `shadow-lg`
- Responsive: `md:grid-cols-2`, `lg:grid-cols-4`

---

## File Structure

```
src/
├── stores/
│   ├── holidayStore.ts
│   └── types.ts
├── components/
│   ├── HolidayCalendarContainer.vue (PrimeVue Panel + Tailwind)
│   ├── TabNavigation.vue (PrimeVue TabView)
│   ├── EmployeeTab.vue (PrimeVue Card/DataTable)
│   ├── HolidayCalendarTab.vue (Tailwind grid)
│   ├── HolidayCalendarView.vue (PrimeVue Buttons + Custom calendar)
│   │   ├── MonthCalendar.vue (Tailwind grid)
│   │   └── YearCalendar.vue (Tailwind grid)
│   └── HolidayList.vue (PrimeVue Card/Dialog)
├── composables/
│   ├── useCalendar.ts
│   └── useHolidayOperations.ts
└── utils/
    ├── dateHelpers.ts
    └── mockApi.ts
```

---

## Styling Guidelines

### ✅ DO:
- Use inline Tailwind utility classes for ALL styling
- Leverage PrimeVue component props for styling
- Use Tailwind's responsive modifiers (`sm:`, `md:`, `lg:`)
- Compose utilities for complex styles
- Use PrimeVue's built-in theming when possible

### Example Component Structure:
```vue
<template>
  <div class="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
    <Panel class="mb-4 shadow-md">
      <template #header>
        <h1 class="text-2xl font-bold text-gray-800">Holiday Calendar</h1>
      </template>
      
      <Button 
        label="Import" 
        icon="pi pi-download" 
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        @click="handleImport"
      />
    </Panel>
  </div>
</template>

<script setup lang="ts">
// No <style> tag at all
</script>
```

---

## Implementation Priorities

1. **Setup Pinia store with all state/actions**
2. **Create mock API with delays**
3. **Build HolidayCalendarView with PrimeVue components (month/year toggle)**
4. **Build HolidayList with CRUD using PrimeVue Dialog/Card**
5. **Implement color coding with Tailwind badges**
6. **Add year navigation with PrimeVue Buttons**
7. **Implement import functionality with PrimeVue Dialog**
8. **Build EmployeeTab with PrimeVue DataTable/Card**
9. **Add view/edit mode switching with PrimeVue SelectButton**
10. **Polish UI/UX with Tailwind responsive utilities**

---

## PrimeVue Configuration

Ensure PrimeVue is properly configured in [`main.js`](my-vue-app/src/main.js):

```javascript
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import 'primeicons/primeicons.css';

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: false
    }
  }
});
```

---

This spec ensures:
- ✅ All communication through Pinia (no props)
- ✅ Single 3-year data fetch
- ✅ Clear component responsibilities
- ✅ Simulated API delays
- ✅ Type-safe TypeScript implementation
- ✅ **PrimeVue components for UI elements**
- ✅ **Modern, maintainable, and consistent styling approach**