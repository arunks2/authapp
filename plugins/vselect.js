import Vue from 'vue'
import vSelect from 'vue-select'
import vSelectPage from '~/components/v-selectpage/src/index.js';
Vue.use(vSelectPage, { language: 'en' });
Vue.component('v-select', vSelect)


