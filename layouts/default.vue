<template>
  <div class="Container" :class="{ 'SmallNav' : smallNav }" id="Container">
    <header-component></header-component>
    <div class="Sidebar" @click = 'smallNav = false'>
      <branding></branding>
      <navigation></navigation>
      <a href='#' class="SmallNavButton" @click.stop.prevent="smallNav = !smallNav">
        <span class="ti-arrow-left" v-if="!smallNav"></span>
        <span class="ti-arrows-horizontal" v-else></span>
      </a>
    </div>
    <div class="Main">
      <div class="uk-container-large Container">
        <nuxt/>
      </div>
    </div>
  </div>
</template>

<script>
  import Branding from '~/components/Sidebar/Branding'
  import Navigation from '~/components/Sidebar/Navigation'
  import HeaderComponent from '~/components/Header'

  export default {
    head () {
      return {
        title: 'ERP v0.1'
      }
    },
    components: { Branding, Navigation, HeaderComponent },
    data () {
      return {
        smallNav: false
      }
    }
  };
</script>

