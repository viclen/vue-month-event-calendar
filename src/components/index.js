import Vue from 'vue'
import EventCalendar from './EventCalendar.vue'

const Components = {
    EventCalendar
}

Object.keys(Components).forEach(name => {
    Vue.component(name, Components[name]);
});

export default Components;