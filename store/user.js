import Vue from "vue"
import _ from "lodash"
import Cookies from "js-cookie"
export const state = () => ({
  contactCreationErrors: {
    items : []
  },
  isLoggedIn: false,
  token: "",
  user: {
    id: "",
    last_login: "",
    is_superuser: "",
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    is_staff: false,
    is_active : false,
    date_joined : "",
    token :""
  }
})

export const actions = {

  async login({ commit }, user) {
    let res = await this.$axios.post("spree_oauth/token", {
      username : user.username,
      password : user.password,
      grant_type:"password"
    })
    commit("setToken", 'Bearer ' + res.data.token)
    localStorage.setItem("user",res.data)
    commit("setUser", res.data)
    commit("setLoggedIn", true)
    return res
  },
  
  async logout({ commit }) {
    commit("setToken", "")
    commit("setLoggedIn", false)
    localStorage.setItem("user",null)
    const user = JSON.parse(Cookies.get("user"))
    commit("setUser", {
      	id: "",
	    password: "",
	    last_login: "",
	    is_superuser: "",
	    username: "",
	    first_name: "",
	    last_name: "",
	    email: "",
	    is_staff: false,
	    is_active : false,
	    date_joined : ""
    })
  },

  async addUserDetails({}, user) {
    let res = await this.$axios.$post('api/v2/storefront/account', {
      user
    }, {
      headers:{
        'Content-Type':"application/json"
      }
    })
    return res
  },
  async changePassword({}, user) {
    let res = await this.$axios.$patch(`api/v2/storefront/account`,
      user, 
      {
        headers : {
          'Content-Type':"application/json"
        }
    })
    return res
  },

}

export const mutations = {
  setToken(state, token) {
    Cookies.set("token", token)
    state.token = token
  },
  setLoggedIn(state, value) {
    state.isLoggedIn = value
  },
  setUser(state, user) {
    Cookies.set("user", JSON.stringify(user))
    Vue.set(state, "user", user)
  },
  setContactCreationErrors(state, contactErrors) {
    Vue.set(state, "contactCreationErrors.items", contactErrors.items)
  }
}

export const getters = {
  isLoggedIn(state) {
    return state.isLoggedIn
  },
  isAdmin(state) {
    return state.user.is_superuser
  }
}
