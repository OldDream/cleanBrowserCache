const gulp = require('gulp');
const { series, watch, task, dest, src } = require('gulp');
const rev = require('gulp-rev');
const revRewrite = require('gulp-rev-rewrite');
const del = require('del');
const fs = require('fs');
const path = require('path');
const merge = require('merge-stream');
const replace = require('gulp-replace');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

let sourcePath = 'dist-dev'; // dist-dev开发 dist-prod生产
let ENV = 'dev'; // dev 开发 prod 生产
let replaceCommonjs = 'var pro = false;'

let set_env = (type) => {
  ENV = type || 'dev';
  if (type == 'dev') {
    sourcePath = 'dist-dev';
    replaceCommonjs = 'var pro = false;'
  } else {
    sourcePath = 'dist-prod'
    replaceCommonjs = 'var pro = true;'
  }
}

function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function (file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
}

// 修改js文件，区分开发or生产
gulp.task('replaceWords', () => {
  return gulp.src(`./${sourcePath}/libs/common.js`)
    .pipe(replace('var pro = false;', replaceCommonjs))
    .pipe(replace('var pro = true;', replaceCommonjs))
    .pipe(dest(`${sourcePath}/libs/`));
});

task('setDev', done => {
  set_env('dev')
  console.log(ENV);
  console.log(sourcePath);
  done()
})
task('setProd', done => {
  set_env('prod')
  console.log(ENV);
  console.log(sourcePath);
  done()
})

// ES6转ES5
gulp.task('toES5min', () =>
  gulp.src(`${sourcePath}/**/*.js`)
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(dest(`${sourcePath}`))
);

task('revision', (done) => {
  let folders = getFolders(sourcePath); // get folders
  if (folders.length === 0) return done(); // nothing to do!
  let tasks = folders.map((folder) => {
    return gulp.src([path.join(sourcePath, folder, '/**/*.{css,js}')])
      .pipe(rev())
      .pipe(dest(sourcePath + `/${folder}`))
      .pipe(rev.manifest())
      .pipe(dest(sourcePath + `/${folder}`))
  });
  return merge(tasks);
});

task('rewrite', (done) => {
  let folders = getFolders(sourcePath); // get folders
  if (folders.length === 0) return done(); // nothing to do!
  let tasks = folders.map((folder) => {
    const manifest = src(sourcePath + `/${folder}/rev-manifest.json`);
    return gulp.src(path.join(sourcePath, folder, '/**/*.html'))
      .pipe(revRewrite({ manifest }))
      .pipe(dest(sourcePath + `/${folder}`))
  });
  return merge(tasks);
});

task('rewriteLibs', (done) => {
  let folders = getFolders(sourcePath); // get folders
  if (folders.length === 0) return done(); // nothing to do!
  let hanleLibs = folders.map((folder) => {
    const manifest = src(`${sourcePath}/libs/rev-manifest.json`);
    return gulp.src(path.join(sourcePath, folder, '/**/*.html'))
      .pipe(revRewrite({ manifest }))
      .pipe(dest(sourcePath + `/${folder}`))
  });
  return merge(hanleLibs);
});

task('copy', () =>
  gulp.src('src/**/*')
    .pipe(dest(`${sourcePath}`)) // 将源文件拷贝到打包目录
);

task('clean', () =>
  del([`./${sourcePath}`])
);

gulp.task('default', series('clean', 'copy', 'revision', 'rewrite'));

gulp.task('build-dev', series('setDev', 'clean', 'copy', 'replaceWords', 'toES5min', 'revision', 'rewrite', 'rewriteLibs'));
gulp.task('build', series('setProd', 'clean', 'copy', 'replaceWords', 'toES5min','revision', 'rewrite', 'rewriteLibs'));
