function keyboard_events(){
	$( document ).on({
		keydown: function(e) {
			var keyCodes = [37,38,39,40],
				key = e.keyCode;
			if ( $.inArray( key, keyCodes ) >= 0 ) {
				console.log('arrow key was pressed');
			}
		}
	});
}