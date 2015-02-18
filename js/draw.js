var drawn,
	sketch,
	holding,
	colors = _.shuffle( [ 'rgb(228,26,28)', 'rgb(55,126,184)', 'rgb(77,175,74)', 'rgb(152,78,163)', 'rgb(255,127,0)', 'rgb(255,255,51)','rgb(166,86,40)', 'rgb(247,129,191)', 'rgb(153,153,153)' ] );

function draw_polygon(){
	clear_sketch();	
	$( "#polygon-controls" ).css( "display", "inline-block" );
	
	var options = { 
		allowIntersection : false,
		shapeOptions : { color : getColor() }
	};
	
	if( $( "#map" ).hasClass( "leaflet-touch" ) ) {
		sketch = new L.Draw.PolygonTouch( map, options );
	}
	else {
		sketch = new L.Draw.Polygon( map, options );
	}
	sketch.enable();
}

function draw_circle(){
	clear_sketch();
	sketch = new L.Draw.Circle( map, { 
		showRadius : false,
		shapeOptions : { color : getColor() }
	});
	sketch.enable();
}

function clear_sketch() {
	try {
    		sketch.disable();
    		$( "#drawing .active" ).removeClass( "active" ).children( "input" ).removeAttr( "checked" );
	}
	catch( err ) { }
	
	if( map.hasLayer( holding ) ) {
		map.removeLayer( holding );
	}
	
	$( "#polygon-controls, #finish-controls" ).hide();
	$( "#drawing" ).css( "display", "inline-block" );
	$( "#delete-last" ).addClass( "disabled" );
	$( "#confirm" ).modal( 'hide' );
	
	sketch = undefined;
	holding = undefined;
}

function finish_draw( e ) {
	holding = e.layer;
	holding.addTo( map );
	
	if( e.layerType == "circle" ) {
		var pt = holding.toGeoJSON();
		var buffer = turf.buffer( pt, holding.getRadius(), "meters" );
		var geom = buffer.features[ 0 ].geometry;
	}
	else {
		var geom = holding.toGeoJSON().geometry;
	}
	var geojson = JSON.stringify( geom ).replace( /\}$/gim, ",\"crs\":{\"type\":\"name\",\"properties\":{\"name\":\"EPSG:4326\"}}}" );
	$( "#geojson" ).val( geojson );
	$( "#uuid" ).val( user );
	
	$( "#drawing, #polygon-controls" ).hide();
	$( "#finish-controls" ).css( "display", "inline-block" );
}

function show_naming( e ){
	
	$( '#name' ).modal();
}

function getColor() {
	var c = colors.shift();
	colors.push( c );
	return c;
}
