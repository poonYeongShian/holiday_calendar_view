# Component Architecture Overview

## Component Hierarchy

```
HolidayCalendarContainer (Main App)
├── TabView
│   ├── Tab 1: Holiday Calendar
│   │   └── HolidayCalendarTab
│   │       ├── HolidayCalendarView (LEFT SIDE)
│   │       │   ├── Year Navigation Controls
│   │       │   ├── View Mode Toggle (Month/Year)
│   │       │   ├── Edit/View Mode Toggle
│   │       │   ├── Import Dialog
│   │       │   ├── MonthCalendar (when mode = 'month')
│   │       │   └── YearCalendar (when mode = 'year')
│   │       │
│   │       └── HolidayList (RIGHT SIDE)
│   │           ├── Holiday Cards with Color Badges
│   │           ├── Add Holiday Button (edit mode)
│   │           ├── Edit/Delete Buttons (edit mode)
│   │           └── Add/Edit Dialog
│   │
│   └── Tab 2: Employee Management
│       └── EmployeeTab
│           ├── Employee DataTable
│           ├── Assign Dialog
│           └── Unassign Dialog
│
└── Loading Spinner Overlay
```

## Data Flow

```
User Action → Component → Pinia Store Action → State Update → All Components React
```

### Example: Adding a Holiday

1. User clicks "Add Holiday" button in HolidayList
2. HolidayList opens dialog, user fills form
3. HolidayList calls `store.addHoliday(newHoliday)`
4. Store action calls mock API (300-500ms delay)
5. Mock API returns new holiday
6. Store updates `holidays` state array
7. Both HolidayCalendarView and HolidayList automatically re-render with new data

## Store Structure (Pinia)

### State
```typescript
{
  holidays: Holiday[]              // All holidays for 3 years
  selectedDate: Date               // Currently selected calendar date
  currentYear: number              // Year being viewed
  viewMode: 'view' | 'edit'       // Read-only or editable
  calendarDisplayMode: 'month' | 'year'  // Calendar layout
  employees: Employee[]            // All employees
  activeTab: 'employee' | 'holiday'
  isLoading: boolean              // Global loading state
}
```

### Key Actions
- `fetchHolidaysThreeYears()` - Initial data load
- `addHoliday()` - Create new holiday
- `updateHoliday()` - Edit existing holiday
- `deleteHoliday()` - Remove holiday
- `importCountryHolidays()` - Import from country
- `assignEmployee()` - Link employee to holiday
- `unassignEmployee()` - Remove employee from holiday
- `setSelectedDate()` - Update selected date
- `switchYear()` - Navigate years

### Key Getters
- `filteredHolidaysByDate` - Holidays for selected date
- `holidaysByYear` - Holidays in current year
- `importedHolidays` - Only imported type
- `manualHolidays` - Only manual type
- `getHolidaysForDate(date)` - Holidays for any date

## Component Communication

### ❌ NO PROPS
Components do NOT pass data via props.

### ✅ STORE ONLY
All components read from and write to the Pinia store:

```vue
<!-- HolidayCalendarView.vue -->
<script setup>
import { useHolidayStore } from '../stores/holidayStore'

const store = useHolidayStore()

// Read state
const year = store.currentYear

// Write state
const changeYear = () => {
  store.switchYear('next')
}
</script>
```

## Styling System

### Tailwind Utility Classes
All styling uses inline Tailwind classes:

```vue
<div class="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
  <Button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
    Click Me
  </Button>
</div>
```

### PrimeVue Components
UI structure from PrimeVue:
- `Button`, `Dialog`, `Card`, `Badge`, `Chip`
- `DataTable`, `Column`, `Dropdown`, `Calendar`
- `TabView`, `TabPanel`, `Panel`, `ProgressSpinner`

### Color Coding
- **Imported Holidays**: `bg-blue-100 text-blue-800 border-blue-500`
- **Manual Holidays**: `bg-green-100 text-green-800 border-green-500`
- **Employee Chips**: `bg-purple-100 text-purple-800`

## File Organization

```
src/
├── components/          # Vue components (UI)
├── stores/             # Pinia stores (state)
├── composables/        # Reusable logic
├── utils/              # Helper functions & mock API
└── main.ts             # App initialization
```

## Key Features Implementation

### 1. Month vs Year View
- Toggle in HolidayCalendarView component
- Conditional rendering: `<MonthCalendar v-if="mode === 'month'" />`
- MonthCalendar: Single large calendar grid
- YearCalendar: 12 mini calendars in responsive grid

### 2. View vs Edit Mode
- Toggle in HolidayCalendarView component
- Controls visibility of Add/Edit/Delete buttons
- HolidayList shows action buttons only in edit mode

### 3. Holiday Import
- Dialog in HolidayCalendarView
- Select country (USA/UK/Canada) and year
- Calls `store.importCountryHolidays(country, year)`
- Imported holidays marked with `type: 'imported'`

### 4. Employee Assignment
- DataTable in EmployeeTab
- Dropdown to select holiday
- Updates both employee and holiday records
- Visual badges show assignments

## Mock API Simulation

All operations have 300-500ms delays:
- `fetchHolidaysAPI()` - Returns 3 years of data
- `createHolidayAPI()` - Creates new holiday
- `updateHolidayAPI()` - Updates holiday
- `deleteHolidayAPI()` - Deletes holiday
- `importCountryHolidaysAPI()` - Returns country holidays

Data persists in memory during session only.
