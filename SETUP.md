# Holiday Calendar System - Setup Guide

This is a fully functional Holiday Calendar System built with Vue 3, TypeScript, Pinia, PrimeVue, and Tailwind CSS.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Navigate to the project directory:
```bash
cd vite-project
```

2. Install dependencies (if not already installed):
```bash
npm install
```

## Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

## Build for Production

```bash
npm run build
```

## Features

### Holiday Calendar Tab (Main View)
- **Month/Year View Toggle**: Switch between single month view and 12-month year view
- **Year Navigation**: Navigate between previous, current, and next year
- **View/Edit Mode**: Toggle between read-only view and edit mode
- **Import Country Holidays**: Import holidays from USA, UK, or Canada
- **Holiday Management**: Add, edit, and delete holidays (in edit mode)
- **Color Coding**: 
  - Blue badges for imported holidays
  - Green badges for manual holidays
- **Date Selection**: Click any date to see holidays for that day

### Employee Management Tab
- **Employee List**: View all employees in a data table
- **Assign Holidays**: Assign holidays to employees
- **Unassign Holidays**: Remove holiday assignments
- **Visual Indicators**: See which holidays are assigned to each employee

## Project Structure

```
src/
├── components/
│   ├── HolidayCalendarContainer.vue    # Main container
│   ├── HolidayCalendarTab.vue          # Holiday tab layout
│   ├── HolidayCalendarView.vue                # Calendar controls & display
│   ├── MonthCalendar.vue               # Month view calendar
│   ├── YearCalendar.vue                # Year view (12 mini calendars)
│   ├── HolidayList.vue                 # Holiday list with CRUD
│   └── EmployeeTab.vue                 # Employee management
├── stores/
│   ├── holidayStore.ts                 # Pinia store
│   └── types.ts                        # TypeScript interfaces
├── composables/
│   ├── useCalendar.ts                  # Calendar logic
│   └── useHolidayOperations.ts         # Holiday CRUD operations
├── utils/
│   ├── mockApi.ts                      # Mock API with delays
│   └── dateHelpers.ts                  # Date utility functions
└── main.ts                             # App entry point
```

## Tech Stack

- **Vue 3**: Composition API
- **TypeScript**: Type-safe code
- **Pinia**: State management (no props between components)
- **PrimeVue**: UI component library
- **Tailwind CSS**: Utility-first styling
- **Vite**: Build tool

## Key Concepts

### State Management
All component communication happens through Pinia store - no props are passed between components. This creates a clean, predictable data flow.

### Mock API
The application simulates API calls with 300-500ms delays to mimic real-world scenarios. Data is fetched once for 3 years of holidays.

### Styling Approach
- All styling uses inline Tailwind utility classes
- PrimeVue components provide base UI structure
- No separate CSS files for components
- Responsive design with Tailwind's responsive modifiers

## Usage Tips

1. **Switch to Edit Mode**: Click the "Edit" button in the calendar view to enable holiday editing
2. **Import Holidays**: Use the "Import from Country" button to add pre-defined country holidays
3. **Navigate Years**: Use the year navigation buttons to view different years
4. **Assign Employees**: Go to Employee Management tab and use Assign/Unassign buttons
5. **View Details**: Click any calendar date to see holidays on that specific day

## Development Notes

- Mock data includes 3 years of holidays (previous year, current year, next year)
- All CRUD operations have simulated delays
- The store automatically updates all subscribed components
- TypeScript provides full type safety across the application
