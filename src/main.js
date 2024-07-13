import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import StyleClass from 'primevue/styleclass';


const app = createApp(App)

app.directive('styleclass', StyleClass);
app.use(createPinia())
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
})

app.mount('#app')
