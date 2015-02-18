var drawn,
	sketch,
	colors = _.shuffle( [ 'rgb(228,26,28)', 'rgb(55,126,184)', 'rgb(77,175,74)', 'rgb(152,78,163)', 'rgb(255,127,0)', 'rgb(255,255,51)','rgb(166,86,40)', 'rgb(247,129,191)', 'rgb(153,153,153)' ] );

function draw_polygon(){
	clear_sketch();	
	$( "#polygon-controls" ).css( "display", "inline-block" );
	
	sketch = new L.Draw.PolygonTouch( map, { 
		allowIntersection : false,
		shapeOptions : { color : getColor() }
	});
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

function getColor() {
	var c = colors.shift();
	colors.push( c );
	return c;
}
