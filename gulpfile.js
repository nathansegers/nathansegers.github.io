const gulp = require('gulp'),
	livereload = require('gulp-livereload'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	cleanCss = require( 'gulp-clean-css'),
	notify = require('gulp-notify'),
	webp = require('gulp-webp');

gulp.task('css', function() {
	gulp.src('./src/style/screen.scss')
		.pipe(sass())
		.on('error', onError)
		.pipe(cleanCss())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./dist/style/'));
		// .pipe(notify({ message: 'Style task completed 👩🏾‍🎨' }));
	livereload.reload();
});

gulp.task("dev-ready", function() {
	return gulp.src('./src/media/*.jpg')
		.pipe(webp())
		.pipe(gulp.dest('./dist/media'))
});

gulp.task('script', function() {
	gulp.src('./src/script/**/*.js')
	  .pipe(concat('app.js'))			// Concat will make sure it's all concatenated into one file
	  .pipe(rename({suffix: '.min'}))
	  .pipe(uglify())
	  .on('error', onError)
	  .pipe(gulp.dest('./dist/script'));
	  // .pipe(notify({ message: 'Scripts task complete 👨🏼‍🔧' }));
	livereload.reload();
});
	
gulp.task('html', function() {
	livereload.reload();
});

function onError(err) {
	console.log(err);
	this.emit('end');
}


gulp.task( 'default', function() {
	gulp.watch( './src/**/*.scss', ['css']);
	gulp.watch( './src/script/*.js', ['script']);
	gulp.watch( './*.html', ['html']);
	livereload.listen();
});