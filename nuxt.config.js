// const finalUrl = "http://onyi.surge.sh";
const finalUrl = "";

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',
  ssr: false,

  server: {     
    port: 8000, // default: 3000     
    host: '0.0.0.0', // default: localhost   
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'ONYI by NoQUANTIZE & LIONELU.js for OMAKASE RECORDINGS',
    htmlAttrs: {
      lang: 'fr'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: "msapplication-TileColor", content: "#da532c" },
      { name: "theme-color", content: "#000000" }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: finalUrl + "/favicon/favicon.ico" },
      { rel: "apple-touch-icon", sizes: "180x180", href: finalUrl + "/favicon/apple-touch-icon.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: finalUrl + "/favicon/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: finalUrl + "/favicon/favicon-16x16.png" },
      // { rel: "manifest", href: "/favicon/site.webmanifest" },
      { rel: "mask-icon", href: finalUrl + "/favicon/safari-pinned-tab.svg", color: "#5bbad5" },
    ]
  },



  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  styleResources: {
    scss: [
      "./assets/style/variables.scss"
    ]
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    // { src: '~/plugins/worker-injector.js', ssr: false } 
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    // '@nuxtjs/eslint-module'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {

    // loaders: {
    //   vue: {
    //     transformAssetUrls: {
    //       audio: 'src'
    //     }
    //   }
    // },
    
    extend(config, { isDev = false, isClient = true }) {
      
      config.module.rules.push(
        {
            test: /\.(fs|vs|glsl|vert|frag)$/,
            loader: "shader-loader",
            options: {
                glsl: {
                    chunkPath: "/shaders/chunks"
                }
            }
        }
      );

      
      config.module.rules.push({
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      });

      config.module.rules.push({
        test: /\.worker\.js$/,
        loader: 'worker-loader',
        exclude: /(node_modules)/
       });

    }
  },

  router: {
    prefetchLinks: true
  }

}
