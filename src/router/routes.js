import MainLayout from 'layouts/MainLayout.vue'
import HomePage from 'pages/HomePage.vue'
import CameraPage from 'pages/CameraPage.vue'
import SettingsPage from 'pages/SettingsPage.vue'


const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '/', component: HomePage },
      { path: '/camera', component: CameraPage },
      { path: '/settings', component: SettingsPage }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
