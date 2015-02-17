var drawn,
	sketch;

function draw_polygon(){
	clear_sketch();	
	$( "#polygon-controls" ).css( "display", "inline-block" );
	
	sketch = new L.Draw.PolygonTouch( map, {allowIntersection: false } );
	sketch.enable();
}

function draw_circle(){
	clear_sketch();
	sketch = new L.Draw.Circle( map );
	sketch.enable();
}

function clear_sketch() {
	try {
    		sketch.disable();
    		$( "#drawing .active" ).removeClass( "active" ).children( "input" ).removeAttr( "checked" );
	}
	catch( err ) { }
	$( "#polygon-controls" ).hide();
	$( "#delete-last" ).addClass( "disabled" );
	sketch = undefined;
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
