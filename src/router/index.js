import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

const login = () => import('../components/login')
const Home = () => import('../views/Home')
const Wlecome = () => import('../views/Wlecome')
const Users = () => import('../views/user/Users')
const Rights = () => import('../views/rights/Rights')
const Roles = () => import('../views/rights/Roles')
const Cate = () => import('../views/goods/Cate')
const Params = () => import('../views/goods/Params')
const List = () => import('../views/goods/List')
const Add = () => import('../views/goods/Add')
const Order = () => import('../views/order/Order')
const Reports = () => import('../views/reports/Reports')


Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect : '/welcome',
    children :[
      {
        path:'/welcome',
        component : Wlecome
      },
      {
        path: '/users',
        name: 'users',
        component: Users
      },
      {
        path: '/rights',
        name: 'rights',
        component: Rights
      },
      {
        path: '/roles',
        name: 'roles',
        component: Roles
      },
      {
        path: '/categories',
        name: 'cate',
        component: Cate
      },
      {
        path: '/params',
        name: 'params',
        component: Params
      },
      {
        path: '/goods',
        name: 'goods',
        component: List
      },
      {
        path: '/goods/add',
        name: 'add',
        component: Add
      },
      {
        path: '/orders',
        name: 'order',
        component: Order
      },
      {
        path: '/reports',
        name: 'reports',
        component: Reports
      },
    ]
  },
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//路由导航守卫（）
router.beforeEach((to,from,next)  =>{
  // to 将要访问的路径
  //from 代表从哪个路径跳转而来
  //next是一个函数   next()   next("/login")强制跳转

  //1.首先判断用户访问的是不是登录页，如果访问的是登录页，就直接放行，如果没有被return出去就不是登录页,那么说明是一个有权限的页面，那么就要拿到用户的token，根据是否有token再发生强制跳转
  if(to.path === '/login') return next(); 
  //2.获取token
  const tokenStr = window.sessionStorage.getItem('token')
  //如果不存在token值，就强制跳转登录页
  if(!tokenStr) return next('/login') 

  next()
})


export default router
