import 'core-js/stable';
import 'regenerator-runtime/runtime';
import router from './router';
import store from './store';
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; 
import Vue from 'vue';
import App from './App.vue';
import debounce from './directives/clickDebounce'

Vue.use(debounce)
Vue.use(ElementUI);
Vue.prototype.$axios = axios;

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
});

