import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import ConfirmationService from 'primevue/confirmationservice'
import 'primeicons/primeicons.css'
import HolidayCalendarContainer from './components/HolidayCalendarContainer.vue'
import './style.css'

const app = createApp(HolidayCalendarContainer)
const pinia = createPinia()

app.use(pinia)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: false
    }
  }
})
app.use(ConfirmationService)

app.mount('#app')
