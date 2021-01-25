<template>
  <div class="Header">
    <div class="Left">
      <form class="uk-search uk-search-default">
          <span uk-search-icon></span>
          <input class="uk-search-input" type="search" placeholder="Search..." style="width: 100%">
      </form>
    </div>
    <div class="Right">
      <div class="uk-inline">
        <a href='#' type="button">user<span class="ti-angle-down"></span></a>
        <div uk-dropdown="animation: uk-animation-slide-top-small;pos: bottom-right">
          <ul class="uk-nav uk-dropdown-nav">
            <li><a href="#" @click.prevent="logout">Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div id="modal-example" uk-modal>
      <div class="uk-modal-dialog uk-modal-body">
        <h2 class="uk-modal-title">Headline</h2>
        <p class="uk-text-right">
          <button class="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
          <button class="uk-button uk-button-primary" type="button">Save</button>
        </p>
        </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return  {
      }
    },
    methods : {
      logout () {
        this.$store.dispatch('user/logout').
          then(res => {
            this.$router.push({path : '/login'})
          }).catch(console.log)
      }
    }
  }
</script>
