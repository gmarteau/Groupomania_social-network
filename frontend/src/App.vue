<template>
  <div id="app">
    <HeaderNav />

    <main class="container py-5">
      <router-view />
    </main>
  </div>
</template>

<script>
import HeaderNav from './components/HeaderNav'

export default {
  name: 'App',
    components: {
    HeaderNav
  }
}
</script>

<style lang="scss">

.container {
  width: 90%;
  max-width: 90%;
  margin: auto;
}

.form-control {
    &:focus {
        border-color: #FFD7D7;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px #FFD7D7;
    }
}
</style>