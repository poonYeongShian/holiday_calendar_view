// First day of week: 0 = Sunday (US standard), 1 = Monday (ISO 8601), 6 = Saturday
export const FIRST_DAY_OF_WEEK = 1

export const getMonthDays = (year: number, month: number): Date[] => {
  const lastDay = new Date(year, month + 1, 0)
  const days: Date[] = []
  
  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(new Date(year, month, day))
  }
  
  return days
}

export const getMonthStartDay = (year: number, month: number, firstDayOfWeek: number = FIRST_DAY_OF_WEEK): number => {
  const jsDay = new Date(year, month, 1).getDay()
  return (jsDay - firstDayOfWeek + 7) % 7
}

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

export const formatShortDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
}

export const getMonthName = (month: number): string => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  return monthNames[month]
}

export const getDayName = (day: number, firstDayOfWeek: number = FIRST_DAY_OF_WEEK): string => {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const rotatedDays = [...dayNames.slice(firstDayOfWeek), ...dayNames.slice(0, firstDayOfWeek)]
  return rotatedDays[day]
}

export const getAllMonths = () => {
  return Array.from({ length: 12 }, (_, i) => i)
}
