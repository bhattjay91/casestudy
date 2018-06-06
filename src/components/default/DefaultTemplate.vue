<template>
  <div>
  <div class="container body">
    <div class="main_container">

      <!-- top navigation -->
      <Default-Header></Default-Header>

      <!-- page content -->

      <div role="main">
        <div class="jumbotron">
          <h1 class="display-5">Welcome to Open Payments Data!</h1>

          <p class="lead">

              <!-- <Search></Search> -->
                <component v-bind:is="currentView"></component>
          </p>
        </div>
      </div>

      <!-- footer content -->
      <Default-Footer></Default-Footer>

    </div>
  </div>

</div>

</template>

<script>

import defaultHeader from './DefaultHeader'
import defaultFooter from './DefaultFooter'

import Search from '@/components/search/Search'
import Import from '@/components/import/Import'

export default{

    name: 'Default',
    props: ['currentView'],
    components :{
      'Default-Header' :defaultHeader,
      'Default-Footer' :defaultFooter,
      'Search': Search,
      'Import': Import
    },
    data () {
      return {

      }
    },

  }
</script>

<style>
.container {
  width: 100%;
  padding: 0;
  margin-right: auto;
  margin-left: auto;
}

.container .panel {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}

</style>
