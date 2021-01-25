import Vue from 'vue'
import _ from 'lodash'
const moment = require('moment')

Vue.mixin({
	methods : {
		success(message) {
			UIkit.notification({
			  	message: `${message}`,
			  	status: 'success',
			  	pos: 'top-right',
			  	timeout: 20000
			})
			this.loading = false
		},
		error(message) {
			this.loading = false
			UIkit.notification({
			  	message: `${message}`,
			  	status: 'warning',
			  	pos: 'top-right',
			  	timeout: 5000
			})
		},
		fetchData(actionName, remoteData) {
			this.loading = true
			return this.$store.dispatch(`${actionName}`).then(res => {
				if(this.hasOwnProperty(`${remoteData}`)) {
					this[`${remoteData}`] = res
				}
				this.loading = false
				return res
			}).catch(err => {
				this.loading = false
				return err
			}).finally(() => this.loading = false)
		},
		fetchDataByQueryParams(actionName,query,remoteData) {
			this.loading = true
			return this.$store.dispatch(`${actionName}`, query).then(res => {
				if(this.hasOwnProperty(`${remoteData}`)) {
					this[`${remoteData}`] = res
				}
				this.loading = false
				return res
			}).catch(err => {
				this.loading = false
				return err
			}).finally(() => this.loading = false)
		},
		fetchDataById(actionName, remoteData, id) {
			this.loading = true
			return this.$store.dispatch(`${actionName}`, id).then(res => {
				this.loading = false
				if(this.hasOwnProperty(`${remoteData}`)) {
					this[`${remoteData}`] = res
				}
				return res
			}).catch(err => {
				console.log(err)
				this.loading = false
				return err
			}).finally(() => this.loading = false)
		},
		addData(actionName,data,remoteData, emitTo=null) {
			this.loading = true
			return this.$store.dispatch(`${actionName}`, data)
				.then(res => {
					this.loading = false
					if(emitTo) {
						this.$emit(`${emitTo}`, res)
					}else {
						if(this.hasOwnProperty(`${remoteData}`)) {
							// this[`${remoteData}`].push(res)
						}
					}
					this.success(`${remoteData} added successfully`)
					return res
				}).catch(err => {
					console.log('main err',err)
					this.loading = false
					this.error(`Some error in addding ${remoteData}, please try again!`)
					return err
				}).finally(() => this.loading = false)
		},
		updateData(actionName, data, remoteData,emitTo=null,setIndex=null) {
			this.loading = true
			return this.$store.dispatch(`${actionName}`, data)
			.then(res => {
				this.loading = false
				if(emitTo) {
					this.$emit(`${emitTo}`, res)
				}
				if(setIndex) {
					let index = this[`${remoteData}`].findIndex(d => res.id == d.id)
					this[`${remoteData}`].splice(index,1,res)
				}
				this.success(`${remoteData} updated successfully`)
				return res
			}).catch(err => {
				console.log(err)
				this.loading = false
				this.error(`Some error in updating ${remoteData}, please try again!`)
				return err
			}).finally(() => this.loading = false)

		},
		findIndexAndReplace(needle, hayStack) {
			let index = this.hasOwnProperty(`${hayStack}`) ? this[`${hayStack}`].findIndex(hS => {
				needle.id == hS.id
			}) : -1
			if (index == -1) return
			this.$set(this[`${hayStack}`], index, needle)
		},
		filterInTableOnTwoColumns(value, remoteData,firstColumn, secondColumn) {
			let data = this[`${remoteData}`]
			data = data.filter(d =>
				{
					if(d[firstColumn].toLowerCase().indexOf(value.toLowerCase()) != -1 || d[secondColumn].toLowerCase().indexOf(value.toLowerCase()) != -1 )
					{
						return true
					}
				});
			this[`${remoteData}`] = _.cloneDeep(data)
		},
		inFirstOnly(list1, list2, isUnion = false) {
    		return list1.filter( a => isUnion === list2.some( b => a.id === b.id ) );
    	},
    	filterInTable(filters, remoteData) {
    		let data = this[`${remoteData}`]
    		Object.keys(filters).forEach(function(key, index) {
    			console.log(key, filters[key])
    			data = data.filter(d => { if(d[key].toLowerCase().indexOf(filters[key].toLowerCase()) != -1) { return true } });
    		});
    		this[`${remoteData}`] = _.cloneDeep(data)
    	},
    	// filterInTableOnSingleInstance(value, remoteData, secondDepth, propertyName) {
    	// 	let data = []
    	// 	this.[`${remoteData}`].forEach(dd => {
    	// 		dd.
    	// 	})
    	// },
    	filterInTableSecondDepth(value, remoteData, secondDepth, propertyName) {
    		let data = []
    		this[`${remoteData}`].forEach(dd => {
    			if(dd[`${secondDepth}`].constructor == Array) {
    				dd[`${secondDepth}`].forEach(b => {
    				  if(b[`${propertyName}`].toLowerCase().indexOf(value.toLowerCase()) != -1) data.push(dd)
    				})
    			}
    		  	else {
    		  		if(dd[`${secondDepth}`][`${propertyName}`].toLowerCase().indexOf(value.toLowerCase()) != -1) data.push(dd)
    		  	}
    		})
    		this[`${remoteData}`] = _.cloneDeep(data)
    	},
    	checkResourceExistsForProperty(actionName,key, remoteData) {
    		if(!this.hasOwnProperty(`${remoteData}`)) return
    		let query = {}
    		query[`${key}`] = this[`${remoteData}`][`${key}`]
    		return this.$store.dispatch(`${actionName}`, query).then(res => {
    			return res
    		}).catch(err => {
    			console.log(err)
    			return res
    		})
    	},
    	deleteData(actionName,value, remoteData, emitTo=null) {
    		this.loading = true
    		return this.$store.dispatch(`${actionName}`, value).then(res => {
    			if(emitTo) {
    				this.$emit(`${emitTo}`,value)
    				return
    			} 
    			if(this.hasOwnProperty(`${remoteData}`)) {
    				this.findIndexAndDelete(value, remoteData)
    			}
    			this.loading = false
    			return res
    		}).catch(err => {
    			this.loading = false
    			return err
    		}).finally(() => this.loading = false)
    	},
    	findIndexAndDelete(needle, hayStack) {
			let index = this[`${hayStack}`] ? this[`${hayStack}`].findIndex(hS => needle.id == hS.id) : -1
			if (index == -1) return
			this[`${hayStack}`].splice(index, 1)
		},
	},
	filters : {
		dateFormat(value, format = 'LLLL') {
		    return moment(value).format(format)
		}
	}
})
