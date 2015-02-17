var map,
	user,
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
	map.on('click', function ( e ){
		if( sketch && sketch._markers.length > 1 ) {
			$( "#delete-last" ).removeClass( "disabled" );
		}
	});
}

function init_events(){
	$( "#draw-call" ).click( function(){
		$( this ).animate( { opacity : 0 }, 'fast', function() {
			$( "#drawing" ).css( "display", "inline-block" );
			draw_polygon();
			$( this ).hide();
		});
		
		return false;
	});
	
	$( "#poly" ).click( draw_polygon );
	$( "#circle" ).click( draw_circle );
	
	$( "#delete-last" ).click( function() {
		sketch.deleteLastVertex();
	});
	$( "#cancel-polygon" ).click( clear_sketch );
	
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

init();
