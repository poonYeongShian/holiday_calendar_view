export interface Holiday {
  id: number
  name: string
  countryId: number // 0 = manual, non-zero = imported
}

export interface HolidayWithDate extends Holiday {
  date: Date // Added when flattening from calendar structure
}

export interface Employee {
  id: number
  userId: number
  photo: string | null
  employeeUserId: string
  employeeId: string
  name: string
  designation: string | null
  designationId: number | null
  companyId: number
  company: string
  division: string
}

export interface HolidayCalendar {
  id: number
  name: string
  enabled: boolean
  lastUpdatedAt: string
  lastUpdatedBy: string
  holidays: {
    [date: string]: Holiday[] // Date format: YYYY-MM-DD
  }
  employees: Employee[]
}

export type ViewMode = 'view' | 'edit'
export type CalendarDisplayMode = 'month' | 'year' | 'list'
export type YearDirection = 'next' | 'prev' | 'current'
export type MonthDirection = 'next' | 'prev'
export type ActiveTab = 'employee' | 'holiday'
