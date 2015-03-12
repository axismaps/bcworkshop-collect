function keyboard_events(){
	//arrow keycodes
	var pan = 80,
		panKeys = {
			37 : [ -1 * pan, 0 ], //left
			39 : [ pan, 0 ], //right
			40 : [ 0, pan ], //up
			38 : [ 0, -1 * pan ] //down
		},
		zoomKeys = {
			187 : 1,
			107 : 1,
			61 : 1,
			171 : 1,
			189 : -1,
			109 : -1,
			173 : -1
		};
	
	$( document ).on({
		keydown: function( e ) {
			var key = e.keyCode;
			if ( key in panKeys ) {
				map.panBy( panKeys[ key ] );
				
				if ( map.options.maxBounds ) {
					map.panInsideBounds( map.options.maxBounds );
				}
			}
			else if ( key in zoomKeys ) {
				map.setZoom( map.getZoom() + zoomKeys[ key ] );
			}
		}
	});
}