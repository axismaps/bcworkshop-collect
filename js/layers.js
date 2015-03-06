var layers = [
	{
		"table" : "city_council",
		"name" : "City Council Districts"
	},
	{
		"table" : "school_districts",
		"name" : "School Districts"
	},
	{
		"table" : "zips",
		"name" : "Zip Codes"
	}
],
overlays;

function init_layers() {
	_.each( layers, function( layer ) {
		$( ".dropdown-menu" ).append( '<li role="presentation"><label><input type="radio" name="layers" value="' + layer.table + '">' + layer.name + '</label></li>' );
	});
	
	$( ".dropdown-menu input" ).click( function() {
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
	})
}

overlays = L.layerGroup().addTo( map )
init_layers();
