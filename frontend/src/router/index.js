import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../views/Signup.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue')
  },
  {
    path: '/topics',
    name: 'TopicsResults',
    component: () => import('../views/TopicsResults.vue')
  },
  {
    path: '/topic',
    name: 'Topic',
    component: () => import('../views/Topic.vue')
  },
  {
    path: '/newtopic',
    name: 'NewTopic',
    component: () => import('../views/NewTopic.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
