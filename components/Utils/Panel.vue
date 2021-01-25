<template>
  <div class="PanelContainer" :class="{Show: show, Tight: tight != undefined}" @click.prevent="closePanel">
    <div class="Panel" @click.stop='' @keyup.esc='closePanel' tabindex="0" autofocus>
      <div class="Content">
        <slot></slot>
      </div>
      <a href='#' @click.prevent="closePanel" class="Close" v-if="tight == undefined">
        <i class="ti-close"></i>
      </a>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['show', 'tight'],
    methods: {
      closePanel() {
        this.$emit('update:show', false)
      }
    }
  };
</script>
