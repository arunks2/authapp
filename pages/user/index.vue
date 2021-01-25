<template>
	<div>
		 <vue-element-loading :active="loading"></vue-element-loading>
    <form>
			<h1>Change Password</h1>
				<div class="uk-margin">
						<div class="uk-inline">
								<span class="uk-form-icon" uk-icon="icon: user" ></span>
								<input class="uk-input" type="email" v-model="user.email">
						</div>
				</div>

				<div class="uk-margin">
						<div class="uk-inline">
								<span class="uk-form-icon uk-form-icon-flip" uk-icon="icon: lock"></span>
								<input class="uk-input" type="password" v-model="user.password">
						</div>
				</div>
				<div class="uk-margin">
						<div class="uk-inline">
								<span class="uk-form-icon uk-form-icon-flip" uk-icon="icon: lock"></span>
								<input class="uk-input" type="password" v-model="user.password_confirmation">
						</div>
				</div>
				<div class="uk-margin">
					<div class="uk-inline">
							<button class="uk-button uk-button-primary" @click="changePassword">Submit</button>
					</div>
				</div>
		</form>
	</div>
</template>
<script>
	export default {
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
		created () {
		},
		methods : {
			async changePassword(event) {
				event.preventDefault()
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
				this.$store.dispatch('user/changePassword',{user}).
				then(res => {
					this.loading = false
					console.log("res", res)
					this.$router.push({path: 'user'})
					UIkit.notification({	
					  	message: 'SuccessFully changed password',
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