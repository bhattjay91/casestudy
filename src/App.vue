<template>
  <div id="app">

    <router-view/>
    <notifications group="foo"  position="bottom right" />
    <vue-progress-bar></vue-progress-bar>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>
.vue-notification {
  font-size: 16px;
}
html,body{
    height: 100%
}
</style>
