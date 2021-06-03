<template>
  <div id="app">
    <HeaderNav />

    <main class="main container py-3 py-md-5">
      <router-view />
    </main>

    <Footer v-if="loggedIn" />
  </div>
</template>

<script>
import HeaderNav from './components/HeaderNav'
import Footer from './components/Footer'

export default {
  name: 'App',
  components: {
    HeaderNav,
    Footer
  }
}
</script>

<style lang="scss">

.container {
  width: 90%;
  max-width: 90%;
  margin: auto;
}

.main {
  min-height: 800px;
}

.form-control {
    &:focus {
        border-color: #d3d3d3;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px #d3d3d3;
    }
}
</style>