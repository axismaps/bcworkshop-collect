var overlays,
  labels,
	layers = [
		{
			"table" : "city_council",
			"name" : "City Council Districts",
			"labels" : 'https://{s}.tiles.mapbox.com/v4/bcworkshop12.d564e901/{z}/{x}/{y}.png?access_token=' + accessToken,
			"default": false
		},
		{
			"table" : "school_districts",
			"name" : "School Districts",
			"default": false
		},
		{
			"table" : "zips",
			"name" : "Zip Codes",
			"default": false
		},
		{
			"table" : "city_limits",
			"name" : "City Limits",
			"default" : true
		}
	];

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
