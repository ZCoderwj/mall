import Vue from 'vue'
import VueRouter from 'vue-router'


// 路由懒加载
const Home = () => import('../views/home/Home')
const Category = () => import('../views/category/Category')
const Cart = () => import('../views/cart/Cart')
const Profile = () => import('../views/profile/Profile')
const Detail = () => import('../views/detail/Detail')

// 1.安装插件
Vue.use(VueRouter)

// 抽离
const routes = [
  {
    path: '',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/category',
    component: Category
  },
  {
    path: '/cart',
    component: Cart
  },
  {
    path: '/profile',
    component: Profile
  },
  {
    // 路由传递拼接参数
    path:'/detail/:iid',
    component:Detail
  }
]

// 2.创建router
const router = new VueRouter({
  routes,
  mode:'history'
})

// 3.导出
export default router