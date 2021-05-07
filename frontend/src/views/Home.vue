<template>
  <div class="home">
    <div class="home--notLogged row" v-if="!loggedIn">
      <div class="home--notLogged__logo">
        <img :src="logoVertical.src" :alt="logoVertical.alt" />
      </div>

      <h1>Bienvenue chez Groupomania, <router-link to="/login">connectez-vous</router-link> ou bien <router-link to="/signup">inscrivez-vous</router-link>!</h1>
    </div>

    <div class="home--loggedIn" v-if="loggedIn">
      <h1>En cours de développement</h1>
    </div>
  </div>
</template>

<script>

import { mapState } from 'vuex'
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  computed: {
    ...mapState(['logoVertical']),
    ...mapGetters(['loggedIn'])
  }
}
</script>

<style lang="scss">

.home {
  &--notLogged {
    width: 90%;
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &__logo {
      width: 50%;
      height: 500px;
      img {
        height: 100%;
        width: 100%;
        object-fit: cover;
      }
    }
  }
}
</style>