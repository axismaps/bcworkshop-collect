var overlays;
	layers = [
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
	];

function init_layers( button ) {
	//init layer group to store overlays
	overlays = L.layerGroup().addTo( map );
	
	//button should be a jquery object
	button.append( '<li role="presentation"><label><input type="radio" name="layers" value="" checked>None</label></li>' );
	_.each( layers, function( layer ) {
		button.append( '<li role="presentation"><label><input type="radio" name="layers" value="' + layer.table + '"' + ( layer.default ? ' checked="true"' : '' ) +'>' + layer.name + '</label></li>' );
	});
	
	button.find( 'input' ).click( function() {
		overlays.clearLayers();
		
		if( $( this ).val() != '' ) {
			$( '#layer-switcher .dropdown-toggle' ).html( '<i class="fa fa-spinner fa-pulse"></i>' );
			var layerStyle = L.geoJson( null, {
				style : function( feature ) {
					return { 
						color : '#ed2a24',
						fillOpacity : 0,
						pointerEvents : 'none'
					};
		    	}
			});
			omnivore.topojson( endpoint + "/topojson/" + $( this ).val(), null, layerStyle ).addTo( overlays ).on( 'ready', function() {
				$( '#layer-switcher .dropdown-toggle' ).html( '<i class="fa fa-cog"></i>' );
			}); 
		}
		map.getContainer().focus();
	});	
	button.find( 'input:checked' ).trigger( 'click' );
}
