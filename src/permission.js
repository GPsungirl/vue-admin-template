import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import service from './utils/request.js'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  NProgress.start()


  document.title = getPageTitle(to.meta.title)


  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {

      next({ path: '/' })
      NProgress.done()
    } else {

      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {

          // const { roles } = await store.dispatch('user/getInfo')
          service.post('/getUserinfo之类的接口').then(response => {
            // const { data } = response

            // if (!data) {
            //   reject('Verification failed, please Login again.')
            // }

            // const { roles, name, avatar } = data

            // if (!roles || roles.length <= 0) {
            //   reject('getInfo: roles must be a 非空 数组!')
            // }

            // commit('SET_ROLES', roles) // 视情况，自己存
            // commit('SET_NAME', name) // 视情况，自己存
            // commit('SET_AVATAR', avatar) // 视情况，自己存



            const accessRoutes = await store.dispatch('permission/generateRoutes', ['admin'])


            router.addRoutes(accessRoutes)


            next({ ...to, replace: true })
          }).catch(error => {
            // 这个时候没拿到值，记得清空所有，保存token
            reject(error)
          })
        } catch (error) {
            // 这个时候没拿到值，记得清空所有，保存token
          // await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {

      next()
    } else {

      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {

  NProgress.done()
})
