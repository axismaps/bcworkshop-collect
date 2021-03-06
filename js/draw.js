var drawn,
	sketch,
	holding,
	colors = _.shuffle( [ 'rgb(228,26,28)', 'rgb(55,126,184)', 'rgb(77,175,74)', 'rgb(152,78,163)', 'rgb(255,127,0)', 'rgb(255,255,51)','rgb(166,86,40)', 'rgb(247,129,191)', 'rgb(153,153,153)' ] );

function draw_polygon(){
	clear_sketch();	
	$( "#polygon-controls" ).css( "display", "inline-block" );
	$( "#poly" ).addClass( "active" );
	$( "#tool_used" ).val( "polygon" );
	
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
	$( "#circle" ).addClass( "active" );
	$( "#tool_used" ).val( "circle" );
	
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
}

function delete_neighborhood( $div ) {
	$.ajax({
		url : endpoint + '/delete/' + user + '/' + encodeURIComponent( deleting.children( "#delete-name" ).text() ) + '/' + encodeURIComponent( deleting.children( "div" ).text() ),
		success : function( data ) {
			console.log( data );
		}
	});
	
	drawn.removeLayer( deleting.data().layer );
	deleting.remove();
	$( "#confirm" ).modal( 'hide' );
	
	$( "#drawn" ).css( "margin-bottom", ( $( "#drawn" ).children().length - 1 ) * -42 );
}

function finish_draw( e ) {	
	holding = copy_layer( e.layer ).addTo( map );
	
	if( e.layerType == "circle" ) {
		var pt = e.layer.toGeoJSON();
		var buffer = turf.buffer( pt, e.layer.getRadius(), "meters" );
		var geom = buffer.features[ 0 ].geometry;
	}
	else {
		var geom = e.layer.toGeoJSON().geometry;
	}
	
	var geojson = JSON.stringify( geom ).replace( /\}$/gim, ",\"crs\":{\"type\":\"name\",\"properties\":{\"name\":\"EPSG:4326\"}}}" );
	$( "#geojson" ).val( geojson );
	$( "#uuid" ).val( user );
	
	$( "#drawing, #polygon-controls" ).hide();
	$( "#finish-controls" ).css( "display", "inline-block" );
}

function add_drawn() {
	var layer = copy_layer( holding ).addTo( drawn ),
		$item = $( '<li class="list-group-item"><div style="display:none">' + $( "#type-radios input:checked" ).val() + '</div><i class="fa fa-trash-o delete"></i><span class="swatch" style="background-color:' + $( "#color" ).val() + '"></span><span id="delete-name">' + escapeHTMLTags( $( "#name-input" ).val() ) + '</span></li>' );
	
	$item
		.data( { layer : layer } )
		.appendTo( $( "#drawn" ) );
	
	$( "#drawn" ).css( "margin-bottom", ( $( "#drawn" ).children().length - 1 ) * -42 );
}

function copy_layer( layer ) {
	var color = $( "#color" ).val(),
		options = {
			color : color,
			fillColor : color
		};
		
	if( layer._radius !== undefined || layer._mRadius !== undefined ) {
		return L.circle( layer.getLatLng(), layer.getRadius(), options );
	}
	else {
		return L.polygon( layer.getLatLngs(), options );
	}
}

function check_vertices() {
	try{
		if( sketch._markers.length > 1 ) {
			$( "#delete-last" ).removeClass( "disabled" );
		}
		else {
			$( "#delete-last" ).addClass( "disabled" );
		}
	}
	catch( err ) {
		$( "#delete-last" ).addClass( "disabled" );
	}
}

function getColor() {
	var c = colors.shift();
	colors.push( c );
	$( "#color" ).val( c );
	
	return c;
}
function escapeHTMLTags(text) {
	var map = {
		'<': '&lt;',
		'>': '&gt;'
	};
  
	return text.replace(/[<>]/g, function(m) { return map[m]; });
}
