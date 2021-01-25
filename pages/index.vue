<template>
<div class="CenterContainer">
    <vue-element-loading :active="loading"></vue-element-loading>
  <div class="Logo">
   <h1>Create User</h1>
  </div>
<div class="Content">
  <form action="#" class="uk-form" @submit.prevent="createUser">
  <div class="uk-margin-small uk-width-1-1">
       <label class="uk-form-label">Email</label>
       <div class="uk-form-controls">
         <input type="text" class="uk-input" v-validate="'required'" placeholder="email" v-model="user.email" name="email">
         <span class="form-error" v-show="errors.has('email')">{{errors.first('email')}}</span>
       </div>
     </div>
    <div class="uk-margin-small uk-width-1-1">
       <label class="uk-form-label">Password</label>
       <div class="uk-form-controls">
         <input type="password" class="uk-input" v-validate="'required'" placeholder="Password" v-model="user.password" name="password">
       </div>
       <span class="form-error" v-show="errors.has('password')">{{errors.first('password')}}</span>
     </div>
     <div class="uk-margin-small uk-width-1-1">
       <label class="uk-form-label">Confirm Password</label>
       <div class="uk-form-controls">
         <input type="password" class="uk-input" v-validate="'required'" placeholder="Confirm Password" v-model="user.password_confirmation" name="password_confirmation">
       </div>
       <span class="form-error" v-show="errors.has('password')">{{errors.first('password')}}</span>
     </div>
		 <a class="uk-link-muted" href="/login">Login</a>
     <div class="uk-margin-top">
   <button class="uk-button uk-button-primary" :disabled="errors.any()" @click.prevent="createUser">Sign Up</button>
  </div>
  </form>
</div>
</div>
</template>
<script>
	export default {
		layout : 'blank',
		data () {
			return {
				user : {
					email : '',
          password : '',
          password_confirmation:''
				},
				loading : false
			}
		},
		methods : {
			async createUser() {
				const valid = await this.$validator.validateAll()
				if(!valid) return
				if(this.user.password !== this.user.password_confirmation){
					UIkit.notification({
					  	message: 'Password does not match',
					  	duration: 0,
					  	type: "error",
					  	position: "bottom-right"
					})
					return 
				}
				this.loading = true
				let user = this.user
				this.$store.dispatch('user/addUserDetails',user).
				then(res => {
					this.loading = false
					console.log("res", res)
					UIkit.notification({
					  	message: 'User created successfully',
					  	duration: 0,
					  	type: "success",
					  	position: "bottom-right"
					})
				})
				.catch(err => {
					console.log(err)
					this.loading = false
					UIkit.notification({
					  	message: 'Something went wrong',
					  	duration: 0,
					  	type: "error",
					  	position: "bottom-right"
					})
				})
			}
		}
	}
</script>
<style>
	.LoginFormContent {
	  width: 600px;
	}
	.LoginForm {
	  width:100%;
	  max-width:600px;
	}
</style>
