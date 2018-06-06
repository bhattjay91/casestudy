import Vue from 'vue'
import Router from 'vue-router'
import Default from '@/components/default/DefaultTemplate'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/import',
      name: 'Search',
      component: Default,
      props: {
          currentView: 'Import'
      },
    },
    {
      path: '/',
      name: 'Search',
      component: Default,
      props: {
          currentView: 'Search'
      },
    },

  ]
})
