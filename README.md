# cleanBrowserCache

master分支使用gulp-rev-rewrite

gulp-rev-collector分支使用gulp-rev-collector

```
npm run build 编译到正式环境
npm run build-dev 编译到测试环境
```

为css、js文件添加hash，避免受上一版文件缓存的影响。

含ES6转ES5、js压缩功能。
```
// 最终达成类似这样的效果
"js/index.js" 变为 "js/index-e230776911.js"
```

src文件夹内是若干目录，目录中是页面相关文件，libs文件夹中是公用文件。

编译输出到根目录下dist文件夹。带有压缩和ES6转ES5

具体参考gulpfile.js。

```
    |-- src
        |-- Main
        |   |-- index.html
        |   |-- css
        |   |   |-- style.min.css
        |   |   |-- style.scss
        |   |-- imgs
        |   |-- js
        |       |-- index.js
        |-- goodsDetail
        |   |-- index.html
        |   |-- css
        |   |   |-- style.min.css
        |   |   |-- style.scss
        |   |-- js
        |       |-- index.js
        |-- libs
            |-- .DS_Store
            |-- common.js
            |-- css
            |   |-- enjoy.css
            |-- js
                |-- jquery.lazyload.js
                |-- jquery.min.js
```

**注意**！本项目的写法有bug：若不同目录下js/css文件的相对路径相同，会发生重复替换之类的bug，
比如:

```
Main目录下有
./css/style.css
libs目录下也有
./css/style.css
```

则在html文件中替换时**无法区分**两者！这需要特别注意。
查看输出的rev-manifest.json文件就能知道原因,

```json
// rev-manifest.json in Main/
{
  "css/style.css": "css/style-60182581b3.css",
  "css/style.min.css": "css/style-4cd6137236.min.css",
  "js/index.js": "js/index-e230776911.js"
}
// rev-manifest.json in libs/
{
  "common.js": "common-c68f896553.js",
  "css/enjoy.css": "css/enjoy-1aa8382a37.css",
  "js/jquery.lazyload.js": "js/jquery-ed5e2f5cf4.lazyload.js",
  "js/jquery.min.js": "js/jquery-a09e13ee94.min.js",
}
```

输出结果是不包含当前目录名称的，如果包含了当前目录名称，在html中的替换时会出现问题。
因为，在html中的引用不包含当前目录名称，而是采用'./'表示同级目录。
