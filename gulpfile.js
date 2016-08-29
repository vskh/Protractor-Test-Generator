var gulp = require('gulp');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');

gulp.task('build', function(){
	gulp.src('./src/vendor/*').pipe(gulp.dest('./build/vendor/'));
	gulp.src('./src/views/*').pipe(gulp.dest('./build/views/'));
	gulp.src('./src/css/*').pipe(gulp.dest('./build/css/'));
	gulp.src('./src/images/*').pipe(gulp.dest('./build/images/'));
	gulp.src('./src/fonts/*').pipe(gulp.dest('./build/fonts/'));
	gulp.src('./src/templates/*').pipe(gulp.dest('./build/templates/'));
	gulp.src('./src/extension.html').pipe(gulp.dest('./build/'));
	gulp.src('./src/manifest.json').pipe(gulp.dest('./build/'));
});

gulp.task('copyship', ['build'], ()=>{
	gulp.src('./build/**/*').pipe(gulp.dest('./ship/'));
})

gulp.task('ship', () => {
	gulp.src('./build/*.js').pipe(uglify()/*.on('error', gutil.log)*/).pipe(gulp.dest('./ship/'))
});