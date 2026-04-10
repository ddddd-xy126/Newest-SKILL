const { codeInspectorPlugin } = require("code-inspector-plugin");
const path = require("path");
module.exports = {
  outputDir: process.env.VUE_APP_OUT_DIR || "dist",
  assetsDir: "static",
  productionSourceMap: false,
  transpileDependencies: ["vue-jsmpeg-player"],
  // 公共路径
  publicPath: "./",
  devServer: {
    //代理
    // proxy: {
    //     '/kuayu': {
    //         target: 'http://10.67.8.187/', // target host
    //         changeOrigin: true, // needed for virtual hosted sites
    //         secure: false,  // 如果是https接口，需要配置这个参数
    //         pathRewrite: { '^/kuayu': '' },
    //         logLevel: 'debug'
    //     },
    // },
    // 配置服务器
    port: process.env.VUE_APP_RUN_PORT || 3688,
    host: "0.0.0.0",
    open: process.env.NODE_ENV === "development",
    https: false,
    overlay: {
      warnings: false,
      errors: true,
    },
    disableHostCheck: true,
  },
  lintOnSave: false,
  configureWebpack: {
    plugins: [
      codeInspectorPlugin({
        bundler: "webpack",
      }),
    ],
    // output: {
    //     filename: "[name].js"
    // },
    optimization: {
      splitChunks: false,
    },
  },

  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~@css/_functions.scss";`,
      },
    },
  },

  chainWebpack: (config) => {
    config.resolve.alias
      .set("@src", path.resolve(__dirname, "./src"))
      .set("@assets", path.resolve(__dirname, "./src/assets"))
      .set("@images", path.resolve(__dirname, "./src/assets/images"))
      .set("@css", path.resolve(__dirname, "./src/assets/css"))
      .set("@view", path.resolve(__dirname, "./src/views"))
      .set("@", path.resolve(__dirname, "./src"))
      .set("@components", path.resolve(__dirname, "./src/components"))
      .set("@layout", path.resolve(__dirname, "./src/layout/index.vue"))
      .set("@utils", path.resolve(__dirname, "./src/utils"))
      .set("@utilsApi", path.resolve(__dirname, "./src/utils/api"))
      .set("@utilsWdpApi", path.resolve(__dirname, "./src/utils/wdpapi"))
      .set("@mixin", path.resolve(__dirname, "./src/mixins"))
      .set("@wdpImg", path.resolve(__dirname, "../wdp_img"));
  },
};
