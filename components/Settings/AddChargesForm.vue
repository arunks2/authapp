<template>
  <div>
    <vue-element-loading :active="loading" />
    <h3 style="margin-top: 0;">Add Charges</h3>
    <form action="#" class="uk-margin">
      <div class="uk-margin">
        <label for=""><strong>Name</strong></label>
        <input type="text" class="uk-input" v-validate="'required'" name="Charge Name" v-model="charge.charges_Name" autofocus>
        <span class="form-error" v-show="errors.has('Charge Name')">{{errors.first('Charge Name')}}</span>
      </div>
      <div class="uk-margin">
        <button class="uk-button uk-button-primary" :disabled="errors.any()" @click.prevent="addChargeDetails">Save</button>
      </div>
    </form>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        loading: false,
        charge : {
          charges_Name : '',
        }
      }
    },
    methods : {
      async addChargeDetails() {
        const valid = await this.$validator.validateAll()
        if (!valid) return
        this.loading = true
        this.$store.dispatch('settings/addCharges', this.charge).then(res => {
            this.loading = false
            this.$emit('chargeAdded', res)
            this.charge = {
              name : '',
            }
            UIkit.notification({
                message: 'Charge details added successfully',
                status: 'success',
                pos: 'top-right',
                timeout: 5000
            })
          }).catch(err => {
            this.loading = false
            UIkit.notification({
                message: 'Something went wrong while adding charge details, Please try again!',
                status: 'error',
                pos: 'top-right',
                timeout: 5000
            })
          })

      }
    }
  };
</script>
