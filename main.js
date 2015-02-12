var map,
	user,
	drawn;

function init() {
	check_cookie();
	init_map();
	init_events();
	resize();
}

function init_map() {
	//Initializing map and tile layer
	map = L.map( 'map', { zoomControl: false, minZoom : 9 } ).setView( [ 32.78, -96.8 ], 12 );
	L.tileLayer( tileAddress ).addTo( map );
	
	//Setting up drawing
	drawn = new L.FeatureGroup();
	map.addLayer( drawn );
}

function init_events(){
	$( "#draw-call" ).click( function() {
		$( this ).animate( { opacity : 0 }, 'fast', function() {
			$( "#drawing" ).show();
			$( this ).hide();
		});
		
		return false;
	});
	
	$( "#zoom-out" ).click( function() {
		map.zoomOut();
		if( map.getZoom() - 1 <= map.getMinZoom() ) $( "#zoom-out" ).addClass( "disabled" );
		$( "#zoom-in" ).removeClass( "disabled" );
	});
	$( "#zoom-in" ).click( function() {
		map.zoomIn();
		if( map.getZoom() + 1 >= map.getMaxZoom() ) $( "#zoom-in" ).addClass( "disabled" );
		$( "#zoom-out" ).removeClass( "disabled" );
	});
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