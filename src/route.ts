import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "about" */ './pages/index.vue'),

  },
  {
    path: '/form',
    component: () => import('./factory-form/list-form.vue')
  },
  {
    path: '/test',
    component: () => import('./test.vue')
  }
];

export default new VueRouter({
  routes
});