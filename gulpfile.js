var gulp        = require('gulp'),
    watchify    = require('watchify'),
    source      = require('vinyl-source-stream'),
    buffer      = require('vinyl-buffer'),
    browserify  = require('browserify'),
    browserSync = require('browser-sync').create(),
    $ = require('gulp-load-plugins')();

var config = {
  appDir: './',
  entries: ['dist/main/app.js']
}


gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });
});


gulp.task('jade', function () {
  return gulp.src(resolvePath(['src/**/*.jade', '!src/layout.jade']))
      .pipe($.jade({doctype: 'html'}))
      .pipe(gulp.dest(resolvePath('dist')));
})


gulp.task('sass', function(){
  return gulp.src(resolvePath('src/**/*.scss'))
      .pipe($.sass())
      .pipe(gulp.dest(resolvePath('dist')));
});


gulp.task('ls', function () {
  return gulp.src(resolvePath('src/**/*.ls'))
      .pipe($.livescript({bare: true}))
      .pipe($.ngAnnotate({single_quotes: true}))
      .pipe(gulp.dest(resolvePath('dist')));
});


gulp.task('es6', function () {
  return gulp.src(resolvePath('src/**/*.js'))
      .pipe($.babel({
        presets: ['es2015']
      }))
      .pipe($.ngAnnotate({single_quotes: true}))
      .pipe(gulp.dest(resolvePath('dist')));
});


//gulp.task('browserify', function() {  
  //return browserify(config.entries)
    //.bundle()
    //.pipe(source('bundle.js')) // gives streaming vinyl file object
    //.pipe(buffer()) // <----- convert from streaming to buffered vinyl file object
    //.pipe(gulp.dest(resolvePath('dist')))
    //.pipe(browserSync.stream());
//});


// add custom browserify options here
var b = watchify(browserify(Object.assign({}, watchify.args, {  
  cache: {}, // required for watchify
  packageCache: {}, // required for watchify
  entries: config.entries
}))); 

// add transformations here
// i.e. b.transform(coffeeify);

gulp.task('browserify', bundle);  
b.on('update', bundle); // on any dep update, runs the bundler  
b.on('log', $.util.log); // output build logs to terminal


gulp.task('inject-reload', ['jade'], function () {
  var injectOptions = {
      addRootSlash: false,
      relative: true
  };

  var injectStyles = gulp.src(resolvePath('dist/**/*.css'), {read: false});

  //var injectScripts = gulp.src([appDir + 'dist/**/*.js', '!' + appDir + 'dist/**/test/*', '!' + appDir + 'dist/node/*'])
      //.pipe($.angularFilesort());

  return gulp.src(resolvePath('dist/**/*.html'))
      .pipe($.inject(injectStyles, injectOptions))
      //.pipe($.inject(injectScripts, injectOptions))
      .pipe(gulp.dest(resolvePath('dist')))
      .pipe(browserSync.stream());
});


gulp.task('watch', function(){
  gulp.watch(resolvePath('src/**/*.jade'), ['inject-reload']);
  gulp.watch(resolvePath('src/**/*.scss'), ['sass']);
  gulp.watch(resolvePath('src/**/*.ls'), ['ls']);
  gulp.watch(resolvePath('src/**/*.js'), ['es6']);

  gulp.watch(resolvePath('dist/**/*.css'), whenNecessaryDo('inject-reload'));
  gulp.watch(resolvePath(['dist/**/*.js', '!dist/bundle.js']), ['browserify']);
});


gulp.task('default', function(){
  gulp.start('browser-sync', 'sass', 'ls', 'es6', 'browserify', 'inject-reload', 'watch');
});


/*** helpers ***/

function isOnlyChange(event) {
  return event.type === 'changed';
}

function whenNecessaryDo(task) {
  return function (event) {
    if ( isOnlyChange(event) )
      browserSync.reload();
    else 
      gulp.start(task);
  }
}

function isArray(x) {
  return Object.prototype.toString.call(x).slice(8, -1) === 'Array';
}

function resolvePath(paths) {
  var prefix = config.appDir;

  if ( !isArray(paths) )
    return prefix + paths;

  return paths.map(function (path) {
    if ( /^!/.test(path) )
      return '!' + prefix + path.slice(1);
    return prefix + path;
  });
}

function bundle() {  
  return b.bundle()
    // log errors if they happen
    .on('error', $.util.log.bind($.util, 'Browserify Error'))
    .pipe(source('bundle.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    .pipe(gulp.dest(resolvePath('dist')))
    .pipe(browserSync.stream());
}
