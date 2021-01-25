<template>
  <div>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
export default {
  computed: {
    ...mapGetters({
      isAdmin: "user/isAdmin"
    })
  },
  created () {
    // console.log('user', this.isAdmin)
  }
}
</script>
