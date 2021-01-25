<template>
  <span class="form-error" v-show="errors.has(field)">{{errors.first(field)}}</span>
</template>
<script>
  export default {
    props: ['errors', 'field']
  }
</script>
