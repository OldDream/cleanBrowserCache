const gulp = require('gulp');
const { series, watch, task, dest, src } = require('gulp');
const rev = require('gulp-rev');
const revRewrite = require('gulp-rev-rewrite');
const del = require('del');
const fs = require('fs');
const path = require('path');
const merge = require('merge-stream');

let sourcePath = 'dist';

function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function (file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
}

task('revision', (done) => {
  let folders = getFolders(sourcePath); // get folders
  if (folders.length === 0) return done(); // nothing to do!
  let tasks = folders.map((folder) => {
    return gulp.src(path.join(sourcePath, folder, '/**/*.{css,js}'))
      .pipe(rev())
      .pipe(gulp.dest(sourcePath + `/${folder}`))
      .pipe(rev.manifest())
      .pipe(gulp.dest(sourcePath + `/${folder}`))
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
    .pipe(gulp.dest(sourcePath + `/${folder}`))
  });
  return merge(tasks);

  // const manifest = src('dist/Main/rev-manifest.json');
  // return src('dist/**/*.html')
  //   .pipe(revRewrite({ manifest }))
  //   .pipe(dest('dist'));
});

task('copy', () =>
  gulp.src('src/**/*')
    .pipe(gulp.dest('dist')) // 将源文件拷贝到打包目录
);

task('clean', () =>
  del(['./dist/*'])
);

gulp.task('default', series('clean', 'copy', 'revision', 'rewrite'));

// gulp.task('revision', () =>
//   gulp.src(['dist/Main/**/*.{css,js}'])
//     .pipe(rev())
//     .pipe(dest('dist/Main'))
//     .pipe(rev.manifest())
//     .pipe(dest('dist/Main'))
// );