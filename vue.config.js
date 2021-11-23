const registerRouter = require('./backend/router')

module.exports = {
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = '在线摸鱼音乐播放器'
        return args
      })
  },
  css: {
    loaderOptions: {
      sass: {
        // 全局引入变量和 mixin
        additionalData: `
          @import "@/assets/scss/variable.scss";
          @import "@/assets/scss/mixin.scss";
        `
      }
    }
  },
  devServer: {
    // 注册后端路由
    before (app) {
      registerRouter(app)
    }
  },
  configureWebpack: (config) => {
    // 加载一个BundleAnalyzerPlugin插件
    if (process.env.npm_config_report) {
      const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
      config.plugins.push(new BundleAnalyzerPlugin())
    }
  }
}
