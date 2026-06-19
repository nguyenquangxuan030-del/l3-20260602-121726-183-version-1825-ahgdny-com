热门电影纯静态网站

生成结果：
- 影片数据：2000 条
- 影片详情页：2000 个，文件名 movie-0001.html 到 movie-2000.html
- 独立分类页：8 个
- 入口页面：首页 index.html、分类总览 categories.html、排行榜 ranking.html、关于 about.html、影片地图 sitemap.html
- 播放器：详情页使用 HLS m3u8 播放源，并通过 assets/hls-vendor-dru42stk.js 初始化播放

封面图片说明：
- 本 ZIP 按要求不包含任何 JPG 图片。
- 请把 1.jpg 到 150.jpg 放到网站根目录，即与 index.html 同级。
- 第 N 条影片使用 ((N - 1) % 150) + 1 对应的 JPG。

使用方式：
- 解压后可直接打开 index.html 浏览静态页面。
- HLS 播放需要浏览器允许访问网络播放源；推荐用本地静态服务器访问，例如在目录中运行：python3 -m http.server 8080
