import Vue from 'vue'
import App from './App.vue'
import store from './store'

import Checkbox from './core/form/Checkbox'

Vue.component('Checkbox', Checkbox)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
