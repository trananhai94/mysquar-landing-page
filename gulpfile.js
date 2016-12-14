var gulp = require('gulp');
var gulpif = require('gulp-if');
var browserSync = require('browser-sync');
var rimraf = require('gulp-rimraf');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css')
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var minifyhtml = require('gulp-htmlmin');
var useref = require('gulp-useref');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var reload = browserSync.reload;

/**************************************************************
OTHERS TASKS
/*************************************************************/

// Create server at folder ./build
gulp.task('serve', function() {
  browserSync({
    notify: false,
    server: {
      baseDir: './build'
    }
  });

  gulp.watch(['*.html'], reload);
  gulp.watch(['css/*.css'], reload);
  gulp.watch(['js/*.js'], reload);
});

// gulp.task('connect', function() {
//     plugins['connect'].server({
//         root: 'build',
//         livereload: true,
//     });
// });

// gulp.task('refresh', function() {
//     return gulp.build(['./build/**/*.*'])
//         .pipe(plugins['connect'].reload());
// });

// gulp.task('watch', function() {
//     gulp.watch(['./build/**/*.{html,css,js}'], ['refresh']);
// });

// Combine and minify all file css and js then save in folder ./build
gulp.task('useref', function() {
  var assets = plugins['useref'].assets();
  return gulp.src('./src/*.html')
    .pipe(assets)
    .pipe(plugins['if']('*.js', plugins['uglify']()))
    .pipe(plugins['if']('*.css', plugins['minifyCss']()))
    .pipe(plugins['rev']())
    .pipe(assets.restore())
    .pipe(plugins['useref']())
    .pipe(plugins['revReplace']())
    .pipe(gulp.dest('./build'));
});

// minify all html file in folder ./build and save in ./build/built 
gulp.task('minify-html', function() {
  return gulp.src('./build/*.html')
    .pipe(plugins['htmlmin']({ collapseWhitespace: true }))
    .pipe(gulp.dest('./build/built'))
});

// copy all file from ./build/built to ./build
gulp.task('copy-source', function() {
  return gulp.src('./build/built/**')
    .pipe(gulp.dest('./build'))
});

// copy all img from ./img to ./build/img
gulp.task('copy-img', function() {
  return gulp.src('./src/img/**')
    .pipe(gulp.dest('./build/img'))
});

// copy all fonts from ./fonts to ./build/fonts
gulp.task('copy-font', function() {
  return gulp.src('./src/fonts/**')
    .pipe(gulp.dest('./build/fonts'))
});

// delete ./built
gulp.task('clean-built', function() {
  return gulp.src(['./build/built'], {
      read: false
    })
    .pipe(plugins['rimraf']());
});

gulp.task('clean-build', function() {
  return gulp.src(['./build'], {
      read: false
    })
    .pipe(plugins['rimraf']());
});

gulp.task('rename', ['dist:css', 'dist:js'], function() {
  return gulp.src(['build/css/*.css', 'build/js/*.js'])
    .pipe(rev())
    .pipe(gulp.dest(opt.distFolder))
    .pipe(rev.manifest())
    .pipe(gulp.dest(opt.distFolder))
});

gulp.task('revReplace', ['rename'], function() {
  var manifest = gulp.src("./" + opt.distFolder + '/rev-manifest.json');

  return gulp.src(opt.srcFolder + '/index.html')
    .pipe(revReplace({ manifest: manifest }))
    .pipe(gulp.dest(opt.distFolder));
});

/**************************************************************
MAIN TASKS
/*************************************************************/

// gulp.task('server', function(done) {
//   runSequence('connect', 'watch', done);
// });

gulp.task('build', function(done) {
  runSequence('clean-build', 'useref', 'minify-html', 'copy-source', 'copy-img', 'copy-font', 'clean-built', 'serve', done);
});

