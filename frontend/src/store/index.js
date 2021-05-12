import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    logo: {
      src: '/images/logo.png',
      alt: 'Logo de Groupomania'
    },
    logoVertical: {
      src: '/images/logo-vertical.png',
      alt: 'Logo de Groupomania en version verticale'
    },
    loggedIn: true,
    currentUser: {
      id: 1,
      token: ''
    }
  },
  getters: {
    loggedIn: state => {
      return state.loggedIn;
    },
    currentUser: state => {
      return state.currentUser
    }
  },
  mutations: {
    SWITCH_LOGGEDIN(state) {
      state.loggedIn = !state.loggedIn;
    },
    USER_AUTH_INFO(state, user) {
      state.currentUser.id = user.userId;
      state.currentUser.token = user.token;
    }
  },
  actions: {
    changeLoginState(context) {
      context.commit('SWITCH_LOGGEDIN');
    },
    storeUserAuthInfo(context, user) {
      context.commit('USER_AUTH_INFO', user);
    }
  },
  modules: {
  }
})
