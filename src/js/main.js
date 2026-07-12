import { createApp } from 'vue';
import App from '@js/App';
import i18n from './locales/i18n';
import { declension } from './utils/declension'
import '../scss/main.scss';

const app = createApp(App);
app.use(i18n);
app.config.globalProperties.declension = declension;

app.mount('#app');