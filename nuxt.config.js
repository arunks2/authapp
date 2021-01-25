module.exports = {
  css: [
    '@/assets/uikit.scss',
    '@/assets/themify-icons.css',
    '@/assets/main.scss'
  ],
  /*
   ** Headers of the page
   */
  head: {
    title: 'vjerp',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'Frontend for VJ ERP Project'
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }]
  },
  plugins: [
    {
      src: '@/plugins/uikit.js',
      ssr: false
    },
    {
      src: '@/plugins/vee-validate.js',
      ssr: false
    },
    {
      src: '@/plugins/liquidtree.js',
      ssr: false
    },
    {
      src: '@/plugins/goodtable.js',
      ssr: false
    },
    {
      src: '@/plugins/vcalendar.js',
      ssr: false
    },
    {
      src: '@/plugins/loading.js',
      ssr: false
    },
    {
      src: '@/plugins/vselect.js',
      ssr: false
    },
    {
      src: '@/plugins/datepicker.js',
      ssr: false
    },
    "~/plugins/axios",
    {
      src : '@/plugins/mixins.js',
      ssr : false
    },
    {
      src : '@/plugins/cobold.js',
      ssr : false
    },
    {
      src : '@/plugins/treeselect.js',
      ssr : false
    },
    {
      src : '@/plugins/multiselect.js',
      ssr : false
    }
  ],
  modules: [
    '@nuxtjs/axios',
    ['nuxt-validate', {
        fieldsBagName: "validater",
        locale: "en"
    }]
  ],
  axios: {
    // baseURL: "http://api.erp.cobold.xyz/api/"
    baseURL: "http://206.81.17.223/"
  },
  build: {
    /*
     ** Run ESLint on save
     */
    extend(config, {
      isDev,
      isClient
    }) {
      config.resolve.alias['vue'] = 'vue/dist/vue.common'
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  } 
}
