<template>
<div class="CenterContainer">
    <vue-element-loading :active="loading"></vue-element-loading>
  <div class="Logo">
   <h1>Login</h1>
  </div>
<div class="Content">
  <form action="#" class="uk-form" @submit.prevent="loginUser">
  <div class="uk-margin-small uk-width-1-1">
       <label class="uk-form-label">Username</label>
       <div class="uk-form-controls">
         <input type="text" class="uk-input" v-validate="'required'" placeholder="username" v-model="user.username" name="username">
         <span class="form-error" v-show="errors.has('username')">{{errors.first('username')}}</span>
       </div>
     </div>
  <div class="uk-margin-small uk-width-1-1">
       <label class="uk-form-label">Password</label>
       <div class="uk-form-controls">
         <input type="password" class="uk-input" v-validate="'required'" placeholder="Password" v-model="user.password" name="password">
       </div>
       <span class="form-error" v-show="errors.has('password')">{{errors.first('password')}}</span>
     </div>
		 <a class="uk-link-muted" href="/">Sign up</a>
     <div class="uk-margin-top">
   <button class="uk-button uk-button-primary" :disabled="errors.any()" @click.prevent="loginUser">Login</button>
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
					username : '',
					password : ''
				},
				loading : false
			}
		},
		methods : {
			async loginUser() {
				const valid = await this.$validator.validateAll()
				if(!valid) return
				this.loading = true
				let user = this.user
				this.$store.dispatch('user/login',{...user}).
				then(res => {
					this.loading = false
					console.log("res", res)
					this.$router.push({path: 'user'})

					// this.$router.push({ name: "contacts" })
				})
				.catch(err => {
					console.log(err)
					this.loading = false
					UIkit.notification({
					  	message: 'Username and password wrong',
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
