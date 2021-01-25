import Vue from 'vue'
import VeeValidate, { Validator } from 'vee-validate'

Vue.use(VeeValidate, {
  "fieldsBagName": "validater",
  "locale": "en"
})

VeeValidate.Validator.extend('gst_validate', {
	getMessage: field => 'The GST field must be a valid GST Number.',
	validate: value => {
		let re = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
		return re.test(value)
	}
});

VeeValidate.Validator.extend('pan_validate', {
	getMessage: field => 'The Pan field should be a valid PAN.',
	validate:  value => {
		let re = /^[A-Z]{5}[0-9]{4}[A-Z]$/
		return re.test(value)
	}
})

VeeValidate.Validator.extend('tan_validate', {
	getMessage: field => 'The TAN field should be a valid TAN.',
	validate: value => {
		let re = /^[A-Z]{4}[0-9]{5}[A-Z]{1}$/
		return re.test(value)
	}
})

VeeValidate.Validator.extend('landline_number_validate', {
	getMessage: field => 'The Phone number Field should be a valid Indian Number',
	validate: value => {
		let re = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/
		return re.test(value)
	}
})

VeeValidate.Validator.extend('mobile_number_validate', {
	getMessage:  field => 'The Mobile Number field must be a valid Indian Mobile Number.',
	validate: value => {
		let re = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/
		return re.test(value)
	}
})

VeeValidate.Validator.extend('pincode_validate', {
	getMessage: field => 'The PinCode field should be a valid Indian Pin code',
	validate: value => {
		console.log('pin code', value)
		let re = /^[1-9][0-9]{5}$/
		return re.test(value)
	}
})
VeeValidate.Validator.extend('multiple_email_validation', {
	getMessage: field => 'One of the Email address is not valid',
	validate: value => {
		let emails = value.split(',')
		for (let i in emails) {
			console.log('emails', emails[i].replace(/\s+/, ""))
			let re = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/
			if (!re.test(emails[i].replace(/\s+/, ""))) return false
		}
		return true
	}
})

VeeValidate.Validator.extend('is_number', {
	getMessage: field => 'This is not a number value, please enter a numeric value',
	validate: value => {
		return !isNaN(value) 
	}
})

VeeValidate.Validator.extend('mobile_number_validate', {
	getMessage:  field => 'The Mobile Number field must be a valid Indian Mobile Number.',
	validate: value => {
		let re = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/
		return re.test(value)
	}
})

VeeValidate.Validator.extend('ifsc_validate', {
	getMessage: field => 'The IFSC field must be a valid IFSC code',
	validate: value => {
		let re = /^[A-Za-z]{4}\d{7}$/
		return re.test(value)
	}
})

// VeeValidate.Validator.extend('unique', {
//  	getMessage : (field, params, data) => console.log(field)
// })
// VeeValidate.Validator.extend('email', {
//   getMessage: field => 'The email field must be a valid email.',
//   validate: value => {
//   	let re  = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
// ;
//   	  return re.test(value);
//   }
// });