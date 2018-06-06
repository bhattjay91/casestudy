<template>
<div >
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <a class="navbar-brand" href="#">Case Study</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarColor01">
      <ul class="navbar-nav mr-auto">

        <router-link tag="li"  class="nav-item" active-class="active" to="/" exact><a class="nav-link"> Home </a></router-link>

        <router-link tag="li"  class="nav-item" active-class="active" to="/import"><a class="nav-link"> Import </a></router-link>

      </ul>
    </div>
  </nav>
</div>

</template>

<script>
export default{

    name: 'DefaultMenu',
    data () {
      return {

      }
    },
}
</script>
