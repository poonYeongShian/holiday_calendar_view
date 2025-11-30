import { defineStore } from "pinia";
import type {
  HolidayCalendar,
  HolidayWithDate,
  ViewMode,
  CalendarDisplayMode,
  YearDirection,
  MonthDirection,
  ActiveTab,
} from "./types";
import {
  fetchHolidaysAPI,
  createHolidayAPI,
  updateHolidayAPI,
  deleteHolidayAPI,
  importCountryHolidaysAPI,
} from "../utils/mockApi";
import { isSameDay } from "../utils/dateHelpers";

interface HolidayState {
  calendarProfile: HolidayCalendar | null;
  selectedDate: Date;
  currentYear: number;
  viewMode: ViewMode;
  calendarDisplayMode: CalendarDisplayMode;
  activeTab: ActiveTab;
  isLoading: boolean;
}

// Helper function to flatten date-keyed holidays into array
const flattenHolidays = (
  calendarProfile: HolidayCalendar | null
): HolidayWithDate[] => {
  if (!calendarProfile) return [];

  const holidays: HolidayWithDate[] = [];

  Object.entries(calendarProfile.holidays).forEach(
    ([dateStr, dateHolidays]) => {
      const date = new Date(dateStr);
      dateHolidays.forEach((holiday) => {
        holidays.push({
          ...holiday,
          date: date,
        });
      });
    }
  );

  return holidays;
};

export const useHolidayStore = defineStore("holiday", {
  state: (): HolidayState => ({
    calendarProfile: null,
    selectedDate: new Date(),
    currentYear: new Date().getFullYear(),
    viewMode: "view",
    calendarDisplayMode: "month",
    activeTab: "holiday",
    isLoading: false,
  }),

  getters: {
    allHolidays: (state) => {
      return flattenHolidays(state.calendarProfile);
    },

    employees: (state) => {
      return state.calendarProfile?.employees || [];
    },

    filteredHolidaysByDate: (state) => {
      const holidays = flattenHolidays(state.calendarProfile);
      return holidays.filter((holiday) =>
        isSameDay(holiday.date, state.selectedDate)
      );
    },

    holidaysByYear: (state) => {
      const holidays = flattenHolidays(state.calendarProfile);
      return holidays.filter((holiday) => {
        return holiday.date.getFullYear() === state.currentYear;
      });
    },

    importedHolidays: (state) => {
      const holidays = flattenHolidays(state.calendarProfile);
      return holidays.filter((holiday) => holiday.countryId !== 0);
    },

    manualHolidays: (state) => {
      const holidays = flattenHolidays(state.calendarProfile);
      return holidays.filter((holiday) => holiday.countryId === 0);
    },

    getHolidaysForDate: (state) => (date: Date) => {
      const holidays = flattenHolidays(state.calendarProfile);
      return holidays.filter((holiday) => isSameDay(holiday.date, date));
    },

    holidaysByYearAndMonth: (state) => (year: number, month?: number) => {
      const holidays = flattenHolidays(state.calendarProfile);
      return holidays.filter((holiday) => {
        const holidayYear = holiday.date.getFullYear();
        const holidayMonth = holiday.date.getMonth();
        
        if (month === undefined || month === null) {
          // All months - filter by year only
          return holidayYear === year;
        }
        
        // Filter by both year and month
        return holidayYear === year && holidayMonth === month;
      });
    },

    canNavigatePrevMonth: (state) => {
      const today = new Date();
      const currentYear = today.getFullYear();
      const minYear = currentYear - 1;
      const minMonth = 0; // January

      const viewingYear = state.currentYear;
      const viewingMonth = state.selectedDate.getMonth();

      if (viewingYear < minYear) return false;
      if (viewingYear === minYear && viewingMonth <= minMonth) return false;
      return true;
    },

    canNavigateNextMonth: (state) => {
      const today = new Date();
      const currentYear = today.getFullYear();
      const maxYear = currentYear + 1;
      const maxMonth = 11; // December

      const viewingYear = state.currentYear;
      const viewingMonth = state.selectedDate.getMonth();

      if (viewingYear > maxYear) return false;
      if (viewingYear === maxYear && viewingMonth >= maxMonth) return false;
      return true;
    },

    canNavigatePrevYear: (state) => {
      const today = new Date();
      const currentYear = today.getFullYear();
      const minYear = currentYear - 1;

      return state.currentYear > minYear;
    },

    canNavigateNextYear: (state) => {
      const today = new Date();
      const currentYear = today.getFullYear();
      const maxYear = currentYear + 1;

      return state.currentYear < maxYear;
    },

    isViewingCurrentPeriod: (state) => {
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth();

      if (state.calendarDisplayMode === "month") {
        return (
          state.currentYear === currentYear &&
          state.selectedDate.getMonth() === currentMonth
        );
      } else {
        return state.currentYear === currentYear;
      }
    },
  },

  actions: {
    async fetchHolidaysThreeYears() {
      this.isLoading = true;
      try {
        const calendarProfile = await fetchHolidaysAPI();
        this.calendarProfile = calendarProfile;
      } catch (error) {
        console.error("Failed to fetch holidays:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async addHoliday(name: string, date: Date, countryId: number = 0) {
      this.isLoading = true;
      try {
        const newHoliday = await createHolidayAPI(name, date, countryId);

        // Update local calendar profile
        if (this.calendarProfile) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const dateKey = `${year}-${month}-${day}`; // YYYY-MM-DD in local timezone
          if (!this.calendarProfile.holidays[dateKey]) {
            this.calendarProfile.holidays[dateKey] = [];
          }
          this.calendarProfile.holidays[dateKey].push(newHoliday);
        }
      } catch (error) {
        console.error("Failed to add holiday:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async updateHoliday(
      id: number,
      name: string,
      oldDate: Date,
      newDate: Date,
      countryId: number
    ) {
      this.isLoading = true;
      try {
        const updated = await updateHolidayAPI(
          id,
          name,
          oldDate,
          newDate,
          countryId
        );

        // Update local calendar profile
        if (this.calendarProfile) {
          const oldDateKey = oldDate.toISOString().split("T")[0];
          const newDateKey = newDate.toISOString().split("T")[0];

          // Remove from old date
          if (this.calendarProfile.holidays[oldDateKey]) {
            this.calendarProfile.holidays[oldDateKey] =
              this.calendarProfile.holidays[oldDateKey].filter(
                (h) => h.id !== id
              );
            if (this.calendarProfile.holidays[oldDateKey].length === 0) {
              delete this.calendarProfile.holidays[oldDateKey];
            }
          }

          // Add to new date
          if (!this.calendarProfile.holidays[newDateKey]) {
            this.calendarProfile.holidays[newDateKey] = [];
          }
          this.calendarProfile.holidays[newDateKey].push(updated);
        }
      } catch (error) {
        console.error("Failed to update holiday:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async deleteHoliday(id: number, date: Date) {
      this.isLoading = true;
      try {
        await deleteHolidayAPI(id, date);

        // Update local calendar profile
        if (this.calendarProfile) {
          const dateKey = date.toISOString().split("T")[0];
          if (this.calendarProfile.holidays[dateKey]) {
            this.calendarProfile.holidays[dateKey] =
              this.calendarProfile.holidays[dateKey].filter((h) => h.id !== id);
            if (this.calendarProfile.holidays[dateKey].length === 0) {
              delete this.calendarProfile.holidays[dateKey];
            }
          }
        }
      } catch (error) {
        console.error("Failed to delete holiday:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async importCountryHolidays(country: string, year: number) {
      this.isLoading = true;
      try {
        await importCountryHolidaysAPI(country, year);
        // Refetch the calendar profile to get updated data
        const calendarProfile = await fetchHolidaysAPI();
        this.calendarProfile = calendarProfile;
      } catch (error) {
        console.error("Failed to import holidays:", error);
      } finally {
        this.isLoading = false;
      }
    },

    assignEmployee(_employeeId: number, _holidayId: number) {
      // Note: The new API structure doesn't include employee-holiday assignments
      // This method is kept for potential future implementation
      // You may want to add a separate assignment tracking structure
      console.warn("Employee assignment not implemented in new API structure");
    },

    unassignEmployee(_employeeId: number, _holidayId: number) {
      // Note: The new API structure doesn't include employee-holiday assignments
      // This method is kept for potential future implementation
      // You may want to add a separate assignment tracking structure
      console.warn(
        "Employee unassignment not implemented in new API structure"
      );
    },

    setSelectedDate(date: Date) {
      this.selectedDate = date;
    },

    setViewMode(mode: ViewMode) {
      this.viewMode = mode;
    },

    setCalendarDisplayMode(mode: CalendarDisplayMode) {
      this.calendarDisplayMode = mode;
    },

    switchYear(direction: YearDirection) {
      if (direction === "next") {
        this.currentYear++;
      } else if (direction === "prev") {
        this.currentYear--;
      } else {
        this.currentYear = new Date().getFullYear();
      }
    },

    switchMonth(direction: MonthDirection) {
      const currentMonth = this.selectedDate.getMonth();
      const currentYear = this.selectedDate.getFullYear();

      if (direction === "next") {
        if (currentMonth === 11) {
          // December -> January of next year
          this.selectedDate = new Date(currentYear + 1, 0, 1);
          this.currentYear = currentYear + 1;
        } else {
          this.selectedDate = new Date(currentYear, currentMonth + 1, 1);
        }
      } else if (direction === "prev") {
        if (currentMonth === 0) {
          // January -> December of previous year
          this.selectedDate = new Date(currentYear - 1, 11, 1);
          this.currentYear = currentYear - 1;
        } else {
          this.selectedDate = new Date(currentYear, currentMonth - 1, 1);
        }
      }
    },

    resetToToday() {
      const today = new Date();
      this.selectedDate = today;
      this.currentYear = today.getFullYear();
    },

    setActiveTab(tab: ActiveTab) {
      this.activeTab = tab;
    },
  },
});
