# vue-music

### 依赖安装
```
npm install
```

### 项目启动
```
npm run serve
```

### 打包
```
npm run build
```

### 先上部署并启动node服务
```
npm run deploy
```

### 本地预览
目前没碰到明显错误，但线上会有报错，后面有时间再做修改。

### 线上预览
[music.qnmlgb.top:2233/music-moyu/](music.qnmlgb.top:2233/music-moyu/)

### 未能解决的线上问题
* 歌词滚动页面的dom没有添加 transform: translate3d(-320px, 0px, 0px);
* 搜索页面进行搜索时axios报错，请求接口错误代码为504超时

### 搜索接口错误代码
```text
(node:7930) UnhandledPromiseRejectionWarning: Error: Request failed with status code 404
    at createError (/data/wwwroot/music-moyu/node_modules/axios/lib/core/createError.js:16:15)
    at settle (/data/wwwroot/music-moyu/node_modules/axios/lib/core/settle.js:17:12)
    at IncomingMessage.handleStreamEnd (/data/wwwroot/music-moyu/node_modules/axios/lib/adapters/http.js:269:11)
    at IncomingMessage.emit (events.js:327:22)
    at endReadableNT (_stream_readable.js:1327:12)
    at processTicksAndRejections (internal/process/task_queues.js:80:21)
(Use `node --trace-warnings ...` to show where the warning was created)
(node:7930) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 2)
(node:7930) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
(node:7930) UnhandledPromiseRejectionWarning: Error: Request failed with status code 404
    at createError (/data/wwwroot/music-moyu/node_modules/axios/lib/core/createError.js:16:15)
    at settle (/data/wwwroot/music-moyu/node_modules/axios/lib/core/settle.js:17:12)
    at IncomingMessage.handleStreamEnd (/data/wwwroot/music-moyu/node_modules/axios/lib/adapters/http.js:269:11)
    at IncomingMessage.emit (events.js:327:22)
    at endReadableNT (_stream_readable.js:1327:12)
    at processTicksAndRejections (internal/process/task_queues.js:80:21)
```

### 博客
[qnmlgb.top | 一条爱吃屎的狗](qnmlgb.top)
