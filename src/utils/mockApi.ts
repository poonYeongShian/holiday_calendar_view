import type { HolidayCalendar, Holiday } from '../stores/types'

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const randomDelay = () => delay(300 + Math.random() * 200) // 300-500ms

// Helper to format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Generate mock calendar profile with 3 years of data
const generateCalendarProfile = (): HolidayCalendar => {
  const currentYear = new Date().getFullYear()
  const holidays: { [date: string]: Holiday[] } = {}
  let holidayIdCounter = 1
  
  for (let yearOffset = -1; yearOffset <= 1; yearOffset++) {
    const year = currentYear + yearOffset
    
    // Common holidays for each year (manual type: countryId = 0)
    const yearHolidays = [
      { name: "New Year's Day", month: 0, day: 1, countryId: 0 },
      { name: "Valentine's Day", month: 1, day: 14, countryId: 0 },
      { name: "Independence Day", month: 6, day: 4, countryId: 0 },
      { name: "Halloween", month: 9, day: 31, countryId: 0 },
      { name: "Christmas Day", month: 11, day: 25, countryId: 0 },
    ]
    
    yearHolidays.forEach((h) => {
      const date = new Date(year, h.month, h.day)
      const dateKey = formatDate(date)
      
      if (!holidays[dateKey]) {
        holidays[dateKey] = []
      }
      
      holidays[dateKey].push({
        id: holidayIdCounter++,
        name: h.name,
        countryId: h.countryId
      })
    })
  }
  
  return {
    id: 1,
    name: "Company Holiday Calendar",
    enabled: true,
    lastUpdatedAt: new Date().toISOString(),
    lastUpdatedBy: "System Admin",
    holidays: holidays,
    employees: [
      {
        id: 1,
        userId: 101,
        photo: null,
        employeeUserId: "EMP001",
        employeeId: "EMP001",
        name: "John Doe",
        designation: "Software Engineer",
        designationId: 1,
        companyId: 1,
        company: "Tech Corp",
        division: "Engineering"
      },
      {
        id: 2,
        userId: 102,
        photo: null,
        employeeUserId: "EMP002",
        employeeId: "EMP002",
        name: "Jane Smith",
        designation: "Product Manager",
        designationId: 2,
        companyId: 1,
        company: "Tech Corp",
        division: "Product"
      },
      {
        id: 3,
        userId: 103,
        photo: null,
        employeeUserId: "EMP003",
        employeeId: "EMP003",
        name: "Bob Johnson",
        designation: "Designer",
        designationId: 3,
        companyId: 1,
        company: "Tech Corp",
        division: "Design"
      },
      {
        id: 4,
        userId: 104,
        photo: null,
        employeeUserId: "EMP004",
        employeeId: "EMP004",
        name: "Alice Williams",
        designation: "DevOps Engineer",
        designationId: 4,
        companyId: 1,
        company: "Tech Corp",
        division: "Engineering"
      },
      {
        id: 5,
        userId: 105,
        photo: null,
        employeeUserId: "EMP005",
        employeeId: "EMP005",
        name: "Charlie Brown",
        designation: "QA Engineer",
        designationId: 5,
        companyId: 1,
        company: "Tech Corp",
        division: "Quality Assurance"
      }
    ]
  }
}

// In-memory storage
let mockCalendarProfile: HolidayCalendar = generateCalendarProfile()
let nextHolidayId = 1000 // Counter for new holidays

export const fetchHolidaysAPI = async (): Promise<HolidayCalendar> => {
  await randomDelay()
  return JSON.parse(JSON.stringify(mockCalendarProfile))
}

export const createHolidayAPI = async (name: string, date: Date, countryId: number = 0): Promise<Holiday> => {
  await randomDelay()
  
  const dateKey = formatDate(date)
  const newHoliday: Holiday = {
    id: nextHolidayId++,
    name: name,
    countryId: countryId
  }
  
  if (!mockCalendarProfile.holidays[dateKey]) {
    mockCalendarProfile.holidays[dateKey] = []
  }
  
  mockCalendarProfile.holidays[dateKey].push(newHoliday)
  mockCalendarProfile.lastUpdatedAt = new Date().toISOString()
  
  return JSON.parse(JSON.stringify(newHoliday))
}

export const updateHolidayAPI = async (id: number, name: string, oldDate: Date, newDate: Date, countryId: number): Promise<Holiday> => {
  await randomDelay()
  
  const oldDateKey = formatDate(oldDate)
  const newDateKey = formatDate(newDate)
  
  // Find and remove from old date
  let holidayToUpdate: Holiday | undefined
  if (mockCalendarProfile.holidays[oldDateKey]) {
    const index = mockCalendarProfile.holidays[oldDateKey].findIndex(h => h.id === id)
    if (index !== -1) {
      holidayToUpdate = mockCalendarProfile.holidays[oldDateKey][index]
      mockCalendarProfile.holidays[oldDateKey].splice(index, 1)
      
      // Clean up empty date arrays
      if (mockCalendarProfile.holidays[oldDateKey].length === 0) {
        delete mockCalendarProfile.holidays[oldDateKey]
      }
    }
  }
  
  if (!holidayToUpdate) {
    throw new Error('Holiday not found')
  }
  
  // Update holiday data
  holidayToUpdate.name = name
  holidayToUpdate.countryId = countryId
  
  // Add to new date
  if (!mockCalendarProfile.holidays[newDateKey]) {
    mockCalendarProfile.holidays[newDateKey] = []
  }
  mockCalendarProfile.holidays[newDateKey].push(holidayToUpdate)
  mockCalendarProfile.lastUpdatedAt = new Date().toISOString()
  
  return JSON.parse(JSON.stringify(holidayToUpdate))
}

export const deleteHolidayAPI = async (id: number, date: Date): Promise<void> => {
  await randomDelay()
  
  const dateKey = formatDate(date)
  
  if (mockCalendarProfile.holidays[dateKey]) {
    mockCalendarProfile.holidays[dateKey] = mockCalendarProfile.holidays[dateKey].filter(h => h.id !== id)
    
    // Clean up empty date arrays
    if (mockCalendarProfile.holidays[dateKey].length === 0) {
      delete mockCalendarProfile.holidays[dateKey]
    }
  }
  
  mockCalendarProfile.lastUpdatedAt = new Date().toISOString()
}

export const importCountryHolidaysAPI = async (country: string, year: number): Promise<Holiday[]> => {
  await randomDelay()
  
  // Map countries to countryId (non-zero for imported holidays)
  const countryIdMap: { [key: string]: number } = {
    'USA': 1,
    'UK': 2,
    'Canada': 3
  }
  
  const countryId = countryIdMap[country] || 10
  
  // Mock country-specific holidays
  const countryHolidays: { [key: string]: Array<{ name: string, month: number, day: number }> } = {
    'USA': [
      { name: 'Martin Luther King Jr. Day', month: 0, day: 15 },
      { name: 'Presidents Day', month: 1, day: 19 },
      { name: 'Memorial Day', month: 4, day: 27 },
      { name: 'Labor Day', month: 8, day: 2 },
      { name: 'Thanksgiving', month: 10, day: 28 }
    ],
    'UK': [
      { name: 'Boxing Day', month: 11, day: 26 },
      { name: 'Early May Bank Holiday', month: 4, day: 6 },
      { name: 'Spring Bank Holiday', month: 4, day: 27 }
    ],
    'Canada': [
      { name: 'Canada Day', month: 6, day: 1 },
      { name: 'Victoria Day', month: 4, day: 20 },
      { name: 'Thanksgiving', month: 9, day: 14 }
    ]
  }
  
  const importedHolidays: Holiday[] = []
  
  const countryHolidayList = countryHolidays[country] || []
  countryHolidayList.forEach((h) => {
    const date = new Date(year, h.month, h.day)
    const dateKey = formatDate(date)
    
    const newHoliday: Holiday = {
      id: nextHolidayId++,
      name: h.name,
      countryId: countryId
    }
    
    if (!mockCalendarProfile.holidays[dateKey]) {
      mockCalendarProfile.holidays[dateKey] = []
    }
    
    mockCalendarProfile.holidays[dateKey].push(newHoliday)
    importedHolidays.push(newHoliday)
  })
  
  mockCalendarProfile.lastUpdatedAt = new Date().toISOString()
  
  return JSON.parse(JSON.stringify(importedHolidays))
}

