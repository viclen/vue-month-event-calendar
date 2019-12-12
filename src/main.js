import Vue from 'vue'
import App from './App.vue'

import EventCalendar from "@viclen/vue-month-event-calendar";

Vue.config.productionTip = false

Object.keys(Components).forEach(name => {
  Vue.component(name, Components[name]);
});

new Vue({
  render: h => h(App),
}).$mount('#app');
