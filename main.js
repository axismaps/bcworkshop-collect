var map,
	user,
	drawn,
	sketch,
	endpoint = window.location.origin + ':3000';

function init(){
	check_cookie();
	init_map();
	init_events();
	init_names();
	resize();
}

function init_map(){
	//Initializing map and tile layer
	map = L.map( 'map', { 
		zoomControl: false,
		minZoom : 10,
		maxBounds : [ [ 32.5, -96.55 ], [ 33.05, -97.05 ] ]
	}).setView( [ 32.78, -96.8 ], 12 );
	L.tileLayer( tileAddress ).addTo( map );
	
	//Setting up sketch
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
	
	$( "#poly" ).click( draw_polygon );
	$( "#circle" ).click( draw_circle );
	
	$( 'form' ).submit( function( e ){
		$( this ).hide();
		$( "#name .modal-header" ).hide();
		
		$( "#ajax-loading b" ).text( $( "#name-input" ).val() );
		$( "#ajax-loading" ).show();
		
        $.ajax({
            type : "POST",
            url : endpoint + '/add',
            data : $( this ).serialize(),
 
            success: function( data, status ) {
                $( "#ajax-loading" ).hide();
                $( "#ajax-success b").text( data );
                $( "#ajax-success" ).show();
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

function init_names() {
	var names = new Bloodhound({
		datumTokenizer : Bloodhound.tokenizers.obj.whitespace( 'name' ),
		queryTokenizer : Bloodhound.tokenizers.whitespace,
		limit : 4,
		prefetch : {
			url : endpoint + '/names',
			filter : function( list ) {
				return $.map( list, function( neighborhood ){ return { name : neighborhood }; });
    			}
		}
	});
	
	names.initialize();
	
	$( '#name-input' ).typeahead(null, {
		name : 'neighborhoods',
		displayKey : 'name',
		source : names.ttAdapter()
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
	try {
    		sketch.disable();
	}
	catch( err ) {
    		sketch = undefined;
	}
	sketch = new L.Draw.PolygonTouch( map );
	sketch.enable();
}

function draw_circle(){
	try {
    		sketch.disable();
	}
	catch( err ) {
    		sketch = undefined;
	}
	sketch = new L.Draw.Circle( map );
	sketch.enable();
}

function finish_draw( e ){
	if( e.layerType == "circle" ) {
		var pt = e.layer.toGeoJSON();
		var buffer = turf.buffer( pt, e.layer.getRadius(), "meters" );
		var geom = buffer.features[ 0 ].geometry;
	}
	else {
		var geom = e.layer.toGeoJSON().geometry;
	}
	var geojson = JSON.stringify( geom ).replace(/\}$/gim, ",\"crs\":{\"type\":\"name\",\"properties\":{\"name\":\"EPSG:4326\"}}}" );
	$( "#geojson" ).val( geojson );
	$( "#uuid" ).val( user );
	$( '#name' ).modal();
}

init();