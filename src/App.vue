<template>
  <m-header/>
  <tab/>
  <router-view/>
</template>
<script>
  import Header from './components/header/header'
  import Tab from './components/tab/tab'
  export default {
    components: {
      Tab,
      MHeader: Header
    }
  }
</script>
