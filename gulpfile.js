const gulp = require('gulp');
const { series,parallel, watch, task, dest, src } = require('gulp');
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

let sourceFolder = 'dist-dev'; // 编译后输出文件夹 dist-dev开发 dist-prod生产
let ENV = 'dev'; // dev 开发 prod 生产
let replaceCommonjs = 'var pro = false;'

let set_env = (type) => {
  ENV = type || 'dev';
  if (type == 'dev') {
    sourceFolder = 'dist-dev';
    replaceCommonjs = 'var pro = false;'
  } else {
    sourceFolder = 'dist-prod'
    replaceCommonjs = 'var pro = true;'
  }
}

function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter((file) => {
      return fs.statSync(`./${dir}/${file}`).isDirectory();
    });
}

// 修改js文件，区分开发or生产
gulp.task('replaceWords', () => {
  return gulp.src(`./${sourceFolder}/libs/common.js`)
    .pipe(replace('var pro = false;', replaceCommonjs))
    .pipe(replace('var pro = true;', replaceCommonjs))
    .pipe(dest(`${sourceFolder}/libs/`));
});

task('setDev', done => {
  set_env('dev')
  console.log(ENV);
  console.log(sourceFolder);
  done()
})
task('setProd', done => {
  set_env('prod')
  console.log(ENV);
  console.log(sourceFolder);
  done()
})

// ES6转ES5
gulp.task('toES5min', () =>
  gulp.src(`./${sourceFolder}/**/*.js`)
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(dest(`./${sourceFolder}`))
);

task('revisionJS', (done) => {
  let folders = getFolders(sourceFolder); // get folders
  if (folders.length === 0) return done(); // nothing to do!
  let tasks = folders.map((folder) => {
    return gulp.src(`./${sourceFolder}/${folder}/**/*.js`)
      .pipe(rev())
      .pipe(dest(`./${sourceFolder}/${folder}`))
      .pipe(sourcemaps.init())
      .pipe(babel({
        presets: ['@babel/env']
      }))
      .pipe(uglify())
      .pipe(sourcemaps.write('.'))
      .pipe(dest(`./${sourceFolder}/${folder}`))
      .pipe(rev.manifest({ path: 'js-rev.json' }))
      .pipe(dest(`./${sourceFolder}/${folder}`))
  });
  return merge(tasks);
});
task('revisionCSS', (done) => {
  let folders = getFolders(sourceFolder); // get folders
  if (folders.length === 0) return done(); // nothing to do!
  let tasks = folders.map((folder) => {
    return gulp.src(`./${sourceFolder}/${folder}/**/*.css`)
      .pipe(rev())
      .pipe(dest(`./${sourceFolder}/${folder}`))
      .pipe(rev.manifest({ path: 'css-rev.json' }))
      .pipe(dest(`./${sourceFolder}/${folder}`))
  });
  return merge(tasks);
});

task('rewrite', (done) => {
  let folders = getFolders(sourceFolder); // get folders
  if (folders.length === 0) return done(); // nothing to do!
  let tasks = folders.map((folder) => {
    const manifestJS = src(`./${sourceFolder}/${folder}/js-rev.json`);
    const manifestCSS = src(`./${sourceFolder}/${folder}/css-rev.json`);
    return gulp.src(`./${sourceFolder}/${folder}/**/*.html`)
      .pipe(revRewrite({ manifest: manifestJS }))
      .pipe(revRewrite({ manifest: manifestCSS }))
      .pipe(dest(`./${sourceFolder}/${folder}`))
  });
  return merge(tasks);
});

task('rewriteLibs', (done) => {
  let folders = getFolders(sourceFolder); // get folders
  if (folders.length === 0) return done(); // nothing to do!
  let hanleLibs = folders.map((folder) => {
    const manifestJS = src(`./${sourceFolder}/libs/js-rev.json`);
    const manifestCSS = src(`./${sourceFolder}/libs/css-rev.json`);
    return gulp.src(`./${sourceFolder}/${folder}/**/*.html`)
      .pipe(revRewrite({ manifest: manifestJS }))
      .pipe(revRewrite({ manifest: manifestCSS }))
      .pipe(dest(`./${sourceFolder}/${folder}`))
  });
  return merge(hanleLibs);
});

task('copy', () =>
  gulp.src('src/**/*')
    .pipe(dest(`./${sourceFolder}`)) // 将源文件拷贝到打包目录
);

task('clean', () =>
  del([`./${sourceFolder}`])
);

gulp.task('default', series('clean', 'copy', 'revisionJS', 'revisionCSS', 'rewrite'));

gulp.task('build-dev', series('setDev', 'clean', 'copy', 'replaceWords', parallel('revisionJS', 'revisionCSS'), 'rewrite', 'rewriteLibs'));
gulp.task('build', series('setProd', 'clean', 'copy', 'replaceWords', parallel('revisionJS', 'revisionCSS'), 'rewrite', 'rewriteLibs'));
