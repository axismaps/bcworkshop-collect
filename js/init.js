var map,
	user,
	overlays,
  labels,
	deleting,
	endpoint = window.location.origin + ':3000';

function init(){
	check_cookie();
	init_map();
	init_layers( $( ".dropdown-menu" ) );
	init_drawn();
	init_events();
	init_names();
	resize();
}

function init_map(){
	//Initializing map and tile layer
	map = L.map( 'map', { 
		zoomControl: false,
		minZoom : 10,
		maxBounds : [ [ 32.5, -96.55 ], [ 33.05, -97.05 ] ],
		keyboard : false
	}).setView( [ 32.78, -96.8 ], 12 );
	L.tileLayer( tileAddress ).addTo( map );
	
	//sets the focus so keyboard works on first load
	map.getContainer().focus();
	
	//fire intro screen
	$( '#about' ).modal( 'show' );
}

function init_layers( button ) {
	//init layer group to store labels
	labels = L.layerGroup().addTo( map );
	
	//init layer group to store overlays
	overlays = L.layerGroup().addTo( map );
	
	//hides the loader icon on first view
	$( '#dropdown-toggle i' ).toggle();
	
	//button should be a jquery object
	button.append( '<li role="presentation"><label><input type="radio" name="layers" value="" checked>None</label></li>' );
	_.each( layers, function( layer ) {
		var $li = $( '<li role="presentation"><label><input type="radio" name="layers" value="' + layer.table + '"' + ( layer.default ? ' checked="true"' : '' ) +'>' + layer.name + '</label></li>' );
		$li.data( layer );
		button.append( $li );
	});
	
	button.find( 'input' ).click( function() {
		overlays.clearLayers();
		labels.clearLayers();
		
		if( $( this ).val() != '' ) {
			$( "#dropdown-toggle" ).children().toggle();
			
			var layerStyle = L.geoJson( null, {
				style : function( feature ) {
					return { 
						color : '#ed2a24',
						fillOpacity : 0,
						pointerEvents : 'none'
					};
		    	}
			});
			
			$( "#dropdown-toggle" ).css( "pointer-events", "none" );
			
			if( $( this ).parents( "li" ).data().labels ) {
  				  L.tileLayer( $( this ).parents( "li" ).data().labels ).addTo( labels );
		  }
			
			omnivore.topojson( endpoint + "/topojson/" + $( this ).val(), null, layerStyle ).addTo( overlays ).on( 'ready', function() {
				$( "#dropdown-toggle" ).children().toggle();
				$( "#dropdown-toggle" ).css( "pointer-events", "auto" );
			}); 
		}
		map.getContainer().focus();
	});	
	button.find( 'input:checked' ).trigger( 'click' );
}

function init_drawn() {	
	//Setting up sketch
	drawn = new L.FeatureGroup();
	map.addLayer( drawn );
	
	map.on( 'draw:created', finish_draw );
	map.on( 'click', check_vertices );
}

function init_events(){
	$( "#draw-call, #draw-another" ).click( function(){
		$( "#draw-call" ).hide();
		$( "#drawing" ).css( "display", "inline-block" );
		if( is_touch_device() ) {
			$( "#circle" ).hide();
		}
		draw_polygon();
	});
	
	$( "#poly" ).click( draw_polygon );
	$( "#circle" ).click( draw_circle );
	
	$( "#delete-last" ).click( function() {
		sketch.deleteLastVertex();
		check_vertices();
	});
	$( "button.cancel" ).click( function() {
		show_confirm( clear_sketch );
	});
	
	$( "#drawn" ).on( "click", ".delete", function() {
		deleting = $( this ).parent();
		show_confirm( delete_neighborhood );
	});
	
	$( 'form' ).submit( send_neighborhood );
	
	$( "#name" ).on( 'hidden.bs.modal', function() {
		$( "#name form, #name .modal-header" ).show();
		$( "#name form :text, #name form textarea" ).val( '' );
		$( "#name form :radio" ).removeAttr( "checked" );
		$( "#ajax-success" ).hide();
	});
	
	$( "#submitted-neighborhoods-call" ).click( function(){
		$( "#switch" ).click();
	});
	$( "#switch" ).click( function() {
		if( $( "#drawn" ).hasClass( "up" ) ) {
			$( "#drawn" ).removeClass( "up" );
		}
		else {
			$( "#drawn" ).addClass( "up" );
		}
	});
	
	$( window ).resize( resize );
	
	$( "#zoom-out" ).click( function(){
		map.zoomOut();
		map.getContainer().focus();
		if( map.getZoom() - 1 <= map.getMinZoom() ) $( "#zoom-out" ).addClass( "disabled" );
		$( "#zoom-in" ).removeClass( "disabled" );
	});
	$( "#zoom-in" ).click( function() {
		map.zoomIn();
		map.getContainer().focus();
		if( map.getZoom() + 1 >= map.getMaxZoom() ) $( "#zoom-in" ).addClass( "disabled" );
		$( "#zoom-out" ).removeClass( "disabled" );
	});
	keyboard_events();
}

function init_names() {
	var names = new Bloodhound({
		datumTokenizer : Bloodhound.tokenizers.obj.whitespace( 'name' ),
		queryTokenizer : Bloodhound.tokenizers.whitespace,
		limit : 4,
		prefetch : {
			url : endpoint + '/names'
		}
	});

	names.initialize();
	
	$( '#name-input' ).typeahead(null, {
		name : 'neighborhoods',
		displayKey : 'name',
		source : names.ttAdapter()
	});
}

function send_neighborhood() {
	$( '.has-error' ).removeClass( 'has-error' );
	
	//Form validation for iOS
	if( $( '#name-input' ).val() == '' ) {
		$( '#name-input' ).parent().addClass( 'has-error' );
		return false;
	}
	
	if( $( 'input[name=neighborhood]:checked' ).length == 0 ) {
		$( 'input[name=neighborhood]' ).parent().addClass( 'has-error' );
		return false;
	}
	
	if( $( 'input[name=confidence]:checked' ).length == 0 ) {
		$( 'input[name=confidence]' ).parent().next().addClass( 'has-error' );
		return false;
	}
	
	if( $( '#comments' ).val() == '' ) {
		$( '#comments' ).parent().addClass( 'has-error' );
		return false;
	}
	
	$( this ).hide();
	$( "#name .modal-header" ).hide();
	
	$( "#ajax-loading b" ).text( $( "#name-input" ).val() );
	$( "#ajax-loading" ).show();
	
	var uuid = $( 'form #uuid').val(),
	neighborhood_name = $( 'form #name-input').val();
	
	$.ajax({
		type : "POST",
		url : endpoint + '/add',
		data : $( this ).serialize(),
		success: function( data, status ) {
			$( "#ajax-loading" ).hide();
			$( "#ajax-success b").text( data );
			
			$( "#email-info" ).attr( "href", "mailto:bc@bcworkshop.org?subject=More Information about Neighborhood: " + neighborhood_name + " [" + uuid + "]" );
			
			$( "#ajax-success" ).show();
			
			clear_sketch();
			add_drawn();
		}
	});

	return false;
}

function show_confirm( callback ) {
	$( "#confirm" ).modal( 'show' );
	$( "#clear_confirm" ).unbind( "click" );
	$( "#clear_confirm" ).click( callback );
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

function is_touch_device() {
  return !!('ontouchstart' in window) // works on most browsers 
      || !!('onmsgesturechange' in window); // works on ie10
}; 

init();
