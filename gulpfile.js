var gulp = require( 'gulp' ),
	usemin = require( 'gulp-usemin' ),
	uglify = require( 'gulp-uglify' ),
	minifyCss = require( 'gulp-minify-css' );

gulp.task( 'default', function(){
   gulp.src( 'index.html' )
        .pipe( usemin({
            assetsDir : '',
            css : [ minifyCss(), 'concat' ],
            js : [ uglify(), 'concat' ]
        }))
        .pipe( gulp.dest( 'public' ) )
});
