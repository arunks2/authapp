import _ from 'lodash'
export const actions = {
  nuxtServerInit({ dispatch, commit }, { req, redirect }) {
    let cookies = req.headers.cookie
    function getCook(cookiename) {
      var cookiestring = RegExp('' + cookiename + '[^;]+').exec(cookies)
      return decodeURIComponent(
        !!cookiestring ? cookiestring.toString().replace(/^[^=]+./, '') : ''
      )
    }

    let token = getCook('token')
    if (!token || _.isEmpty(token)) {
      return
    } else {
      commit('user/setToken', token, { root: true })
      commit('user/setLoggedIn', true, { root: true })
    }
    let user = JSON.parse(getCook('user'))
    if (!user || _.isEmpty(user)) {
      dispatch('user/checkToken', { root: true })
    } else {
      commit('user/setUser', user, { root: true })
      commit('user/setLoggedIn', true, { root: true })
    }
  }
}

