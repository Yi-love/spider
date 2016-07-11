var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('uglify' , function(){
	return gulp.src('spider.js')
			.pipe(gulp.dest('build/'))
			.pipe(uglify({
				mangle: { //seajs等库文件对 以下这几个变量有要求，不能压缩
					except: ['define', 'require', 'module', 'exports', 'modules']
				},
				compress: false
			}))
			.pipe(rename(function(file){
				file.basename += '.min';
			}))
			.pipe(gulp.dest('build/'));
});
gulp.task('default',['uglify']);