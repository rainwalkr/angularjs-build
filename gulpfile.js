var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var del = require('del');
var fs = require('fs');
var gulpIf = require('gulp-if');
var parseArgs = require('minimist');
var order = require("gulp-order");
var templateCache = require('gulp-angular-templatecache');
var browserSync = require('browser-sync').create();
const jshint = require('gulp-jshint');

var paths = {
    styles:{
        app:{
            src:'app/**/*.css',
            dest:'dist/'
        },
        vendor:{
            src:[
                'node_modules/bootstrap/dist/css/bootstrap.css'
            ],
            dest:'dist/'
        }
    },
    scripts:{
        app:{
            src:'app/**/*.js',
            dest:'dist/'
        },
        vendor:{
            src:[
                'node_modules/angular/angular.js',
                'node_modules/angular-route/angular-route.js',
                'node_modules/angular-resource/angular-resource.js'
            ],
            dest:'dist/'
        }
    },
    templates:{
        src:'app/**/*.html',
        dest:'dist/'
    }
}
var parseArgsOptions = {
    string: 'env',
    default: { env: 'dev' }
};

var options = parseArgs(process.argv.slice(2), parseArgsOptions);

var projPackage = JSON.parse(fs.readFileSync('./package.json'));
// clean build directory
function clean() {
    return del([ 'dist' ]);
}
function appStyles() {
    return gulp.src(paths.styles.app.src)
        .pipe(cleanCSS())
        .pipe(rename({ basename: projPackage.name }))
        .pipe(gulp.dest(paths.styles.app.dest));
}

function vendorStyles() {
    return gulp.src(paths.styles.vendor.src)
        .pipe(rename({ 
            basename: projPackage.name,
            suffix: ".vendor"
        }))
        .pipe(gulp.dest(paths.styles.vendor.dest));
}

function appScripts() {
    return gulp.src(paths.scripts.app.src, { sourcemaps: false })
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'))
        .pipe(order([
            '**/*.module.js',
            '**/*.js'
        ]))
        .pipe(concat(projPackage.name+'.js'))
        .pipe(gulpIf(options.env === 'prod', uglify()))
        .pipe(gulp.dest(paths.scripts.app.dest));
}

function vendorScripts() {
    return gulp.src(paths.scripts.vendor.src, { sourcemaps: false })
        .pipe(concat(projPackage.name+'.vendor.js'))
        .pipe(gulpIf(options.env === 'prod', uglify()))
        .pipe(gulp.dest(paths.scripts.vendor.dest));
}

function templates() {
    return gulp.src(paths.templates.src)
        .pipe(templateCache(projPackage.name+'.templates.js',{
            module:'phonecatApp' 
        }))
        .pipe(gulp.dest(paths.templates.dest))
}

function watch() {
    gulp.watch(paths.scripts.app.src, appScripts);
    gulp.watch(paths.styles.app.src, appStyles);
    gulp.watch(paths.templates.src,templates);
    gulp.watch('gulpfile.js',build)
}

function reload(done) {
    browserSync.reload();
    done();
}

function watchAndReload() {
    gulp.watch(paths.scripts.app.src, gulp.series(appScripts,reload));
    gulp.watch(paths.styles.app.src, gulp.series(appStyles,reload));
    gulp.watch(paths.templates.src,gulp.series(templates,reload));
    gulp.watch('gulpfile.js',gulp.series(build,reload));
}

function serve(done) {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    done();
}

exports.clean = clean;
exports.appStyles = appStyles;
exports.appScripts = appScripts;
exports.watch = watch;
exports.templates = templates;

var build = gulp.series(clean, gulp.parallel(vendorScripts,vendorStyles,appScripts,appStyles,templates));

gulp.task('build', build);

gulp.task('serve',gulp.series(build, serve, watchAndReload))

gulp.task('default', build);


  
  