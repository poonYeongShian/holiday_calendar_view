import { useHolidayStore } from '../stores/holidayStore'

export const useHolidayOperations = () => {
  const store = useHolidayStore()

  const addHoliday = async (name: string, date: Date, countryId: number = 0) => {
    await store.addHoliday(name, date, countryId)
  }

  const updateHoliday = async (id: number, name: string, oldDate: Date, newDate: Date, countryId: number) => {
    await store.updateHoliday(id, name, oldDate, newDate, countryId)
  }

  const deleteHoliday = async (id: number, date: Date) => {
    await store.deleteHoliday(id, date)
  }

  const importHolidays = async (country: string, year: number) => {
    await store.importCountryHolidays(country, year)
  }

  return {
    addHoliday,
    updateHoliday,
    deleteHoliday,
    importHolidays
  }
}
