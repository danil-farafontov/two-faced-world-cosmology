import { createApp } from 'vue';
import App from '@js/App';
import { declension } from './utils/declension'
import '../scss/main.scss';

const app = createApp(App);
app.config.globalProperties.declension = declension;

app.mount('#app');