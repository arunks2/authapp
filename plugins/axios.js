
export default function({ $axios, app, redirect }) {
  // $axios.onRequest(config => {
  //   // console.log("Making request to " + config.url)
  // })

  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    if (code === 401) {
      console.log('error is', error.response)
      UIkit.notification({
          message: 'Token Expired, login Again',
          status: 'danger',
          pos: 'top-right',
          timeout: 5000
      })
      // redirect("/login")
    }
  })
}
