var gulp = require('gulp');

gulp.task('build', function(){
	gulp.src('./src/vendor/*')
		.pipe(gulp.dest('./build/vendor/'));
	gulp.src('./src/views/*')
		.pipe(gulp.dest('./build/views/'));
	gulp.src('./src/css/*')
		.pipe(gulp.dest('./build/css/'));
	gulp.src('./src/images/*')
		.pipe(gulp.dest('./build/images/'));
	gulp.src('./src/fonts/*')
		.pipe(gulp.dest('./build/fonts/'));
});