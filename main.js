var user;

function init() {
	check_cookie();
//	init_map();
//	setup_events();
//	resize();
}

function check_cookie() {
	if( $.cookie( 'bcworkshop-collect' ) ) {
		user = $.cookie( 'bcworkshop-collect' );
	}
	else {
		user = uuid.v1();
		$.cookie( 'bcworkshop-collect', user, { path: '/' } );
	}
}

init();