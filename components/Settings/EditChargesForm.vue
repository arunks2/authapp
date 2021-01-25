<template>
  <div>
    <vue-element-loading :active="loading" />
    <h3 style="margin-top: 0;">Edit charge {{ charge.id }}</h3>
    <form action="#" class="uk-margin">
      <div class="uk-margin">
        <label for=""><strong>Name</strong></label>
        <input type="text" name="Charge Name" class="uk-input" v-validate="'required'" autofocus v-model='charge.charges_Name'>
      </div>
      <div class="uk-margin">
        <button class="uk-button uk-button-primary" :disabled="errors.any()" @click.prevent="editChargeDetails">Update</button>
      </div>
    </form>
  </div>
</template>
<script>
  export default {
    props: ['charge'],
    data () {
      return {
        loading: false,
      }
    },
    created(){
      console.log("this is inside of template",this.charge)
    },
    methods : {
      async editChargeDetails() {
        console.log(this.charge, "charges is under edit funtion")
        const valid = await this.$validator.validateAll()
        if (!valid) return
        this.loading = true
        this.$store.dispatch('settings/editCharges', this.charge)
        .then(res => {
          this.loading = false
          this.$emit('chargeEdited', res)
          UIkit.notification({
              message: 'Charge details updated successfully',
              status: 'success',
              pos: 'top-right',
              timeout: 5000
          })
        }).catch(err => {
          this.loading = false
          UIkit.notification({
              message: 'Something went wrong while updating charge details, Please try again!',
              status: 'error',
              pos: 'top-right',
              timeout: 5000
          })
        })
      }
    }
  };
</script>
