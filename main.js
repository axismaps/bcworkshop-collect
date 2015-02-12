var map,
	user,
	drawn,
	drawing,
	endpoint = 'http://localhost:3000/add';

function init(){
	check_cookie();
	init_map();
	init_events();
	resize();
}

function init_map(){
	//Initializing map and tile layer
	map = L.map( 'map', { zoomControl: false, minZoom : 9 } ).setView( [ 32.78, -96.8 ], 12 );
	L.tileLayer( tileAddress ).addTo( map );
	
	//Setting up drawing
	drawn = new L.FeatureGroup();
	map.addLayer( drawn );
	
	map.on( 'draw:created', finish_draw );
}

function init_events(){
	$( "#draw-call" ).click( function(){
		$( this ).animate( { opacity : 0 }, 'fast', function() {
			$( "#drawing" ).show();
			draw_polygon();
			$( this ).hide();
		});
		
		return false;
	});
	
	$( 'form' ).submit( function( e ){
        $.ajax({
            type : "POST",
            url : endpoint,
            data : $( this ).serialize(),
 
            success: function(data, status) {
                console.log( data );
            }
        });
 
        e.preventDefault();
    });
	
	$( "#zoom-out" ).click( function(){
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

function resize(){
	$( "#map" ).height( $( window ).height() - 140 );
	map.invalidateSize();
}

function check_cookie(){
	if( $.cookie( 'bcworkshop-collect' ) ) {
		user = $.cookie( 'bcworkshop-collect' );
	}
	else {
		user = uuid.v1();
		$.cookie( 'bcworkshop-collect', user, { path: '/' } );
	}
}

function draw_polygon(){
	clear_drawing();
	drawing = new L.Draw.PolygonTouch( map ).enable();
}

function draw_circle(){
	
}

function clear_drawing(){
	
}

function finish_draw( e ){
	drawing = e.layer;
	map.addLayer( drawing );
	$( "#geojson" ).val( JSON.stringify( drawing.toGeoJSON() ) );
	$( "#uuid" ).val( user );
	$( '#name' ).modal();
}

init();