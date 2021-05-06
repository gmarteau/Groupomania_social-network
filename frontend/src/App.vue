<template>
  <div id="app">
    <HeaderNav />
    <router-view></router-view>
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

</style>
