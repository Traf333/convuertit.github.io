<template>
  <div id="app">
    <CurrencyList msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import CurrencyList from './components/CurrencyList.vue'

export default {
  name: 'App',
  components: {
    CurrencyList
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
