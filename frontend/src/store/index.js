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
    loggedIn: false,
    currentUser: {
      id: 0,
      isAdmin: false
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
    SWITCH_LOGGEDIN(state, boolean) {
      state.loggedIn = boolean;
    },
    USER_ID(state, userId) {
      state.currentUser.id = userId;
    },
    USER_ADMIN(state, isAdmin) {
      state.currentUser.isAdmin = isAdmin;
    }
  },
  actions: {
    changeLoginState(context, boolean) {
      context.commit('SWITCH_LOGGEDIN', boolean);
    },
    storeUserId(context, userId) {
      context.commit('USER_ID', userId);
    },
    storeIsAdmin(context, isAdmin) {
      context.commit('USER_ADMIN', isAdmin);
    }
  },
  modules: {
  }
})
