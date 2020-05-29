import Vue from 'vue'
import App from './App.vue'
import router from './router'
//导入css总样式
import './assets/css/base.css'
//导入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//导入font-icon
import './assets/fonts/iconfont.css'

import TreeTable from 'vue-table-with-tree-grid'

//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

//导入进度条插件
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

//导入axios
import axios from 'axios'
// 配置请求的跟路径
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
//请求拦截，在request拦截器中展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
  // console.log(config);
  NProgress.start()
  //为请求头添加token验证Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  
  return config
})

//在response拦截器中，隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

Vue.prototype.$http = axios

// console.log(Vue.prototype);

//注册为全局可用
Vue.use(VueQuillEditor)
// console.log(Vue);


Vue.component('tree-table', TreeTable)

Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
