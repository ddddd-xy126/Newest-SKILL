// Figures out the event we are using with the bound element
// https://github.com/dhershman1/vue-debounce
// https://blog.csdn.net/sinat_36146776/article/details/84953131

import { debounce } from 'throttle-debounce'
import { on, off } from '@/utils/dom'

export default {
  name: 'debounce',
  install(Vue, { defaultTime = 300 } = {}) {
    Vue.directive('debounce', {
      bind(el, { value, arg, modifiers }) {
        const fn = debounce(arg || defaultTime, value)
        el._debounceHandler = fn
        on(el, 'click', fn)
      },

      unbind: function (el) {
        if (el._debounceHandler) {
          off(el, 'click', el._debounceHandler)
          delete el._debounceHandler
        }
      }
    })
  }
}
