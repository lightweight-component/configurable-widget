import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "about" */ './index.vue'),
  },
  {
    path: '/factory-list-info',
    component: () => import('./factory-list/edit/list-factory.vue')
  },
  {
    path: '/list-def',
    component: () => import('./factory-list-def/index.vue')
  },
  {
    path: '/form',
    component: () => import('./factory-form/list-form.vue')
  },
];

export default new VueRouter({
  routes
});