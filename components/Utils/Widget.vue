<template>
  <div class="Widget">
    <div class="Heading" @click.prevent="toggle = !toggle">
      <slot name='header'></slot>
      <span class="RollUp" :class="{'ti-angle-up' : toggle, 'ti-angle-down': !toggle}"></span>
    </div>
    <div class="Content" :class="{Padded : padded != undefined}" v-if="toggle">
      <slot></slot>
    </div>
  </div>
</template>
<script>
  export default {
    props:['padded', 'rolledup'],
    data() {
      return {
        toggle: true
      }
    },
    created() {
      if(this.rolledup != undefined) {
        this.toggle = false
      }
    }
  };
</script>
