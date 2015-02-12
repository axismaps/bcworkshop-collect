var map,
	user;

function init() {
	check_cookie();
	init_map();
//	setup_events();
	resize();
}

function init_map() {
	map = L.map( 'map' ).setView( [ 32.78, -96.8 ], 12 );
	L.tileLayer( tileAddress ).addTo( map );
}

function resize() {
	$( "#map" ).height( $( window ).height() - 140 );
	map.invalidateSize();
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