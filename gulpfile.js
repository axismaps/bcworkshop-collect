var gulp = require( 'gulp' ),
	usemin = require( 'gulp-usemin' ),
	uglify = require( 'gulp-uglify' ),
	minifyCss = require( 'gulp-minify-css' ),
	del = require( 'del' );

gulp.task( 'default', [ 'clean' ], function(){
	gulp.src( 'index.html' )
		.pipe( usemin({
			assetsDir : '',
			css : [ minifyCss(), 'concat' ],
			js : [ uglify(), 'concat' ]
		}))
		.pipe( gulp.dest( 'public/' ) )

	gulp.src( 'img/*' )
		.pipe( gulp.dest( 'public/img' ) );
    	
	gulp.src( 'bower_components/fontawesome/fonts/*' )
		.pipe( gulp.dest( 'public/fonts' ) );
});

gulp.task( 'clean', function( callback ){
    del( [ 'public/css', 'public/fonts', 'public/img', 'public/js', 'public/index.html' ], callback );
});
