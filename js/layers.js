var layers = [
	{
		"table" : "city_council",
		"name" : "City Council Districts",
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
		"default" : false
	}
],
overlays;

function init_layers( button ) {
	//button should be a jquery object
	
	button.append( '<li role="presentation"><label><input type="radio" name="layers" value="" checked>None</label></li>' );
	_.each( layers, function( layer ) {
		if (layer.default === true) {
			button.append( '<li role="presentation"><label><input type="radio" name="layers" value="' + layer.table + '" checked="true">' + layer.name + '</label></li>' );
		} else {
			button.append( '<li role="presentation"><label><input type="radio" name="layers" value="' + layer.table + '">' + layer.name + '</label></li>' );
		}
	});
	
	button.find( 'input' ).click( function() {
		overlays.clearLayers();
		
		if( $( this ).val() != '' ) {
			var layerStyle = L.geoJson( null, {
				style : function( feature ) {
					return { 
						color : '#ed2a24',
						fillOpacity : 0,
						pointerEvents : 'none'
					};
		    		}
			});
			omnivore.topojson( endpoint + "/topojson/" + $( this ).val(), null, layerStyle ).addTo( overlays );
		}
	});
	
	button.find( 'input:checked' ).trigger( 'click' );
}

overlays = L.layerGroup().addTo( map )
init_layers( $( ".dropdown-menu" ) );
