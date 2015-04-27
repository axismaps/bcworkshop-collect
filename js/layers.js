var layers = [
		{
			"table" : "city_council",
			"name" : "City Council Districts",
			"labels" : 'https://{s}.tiles.mapbox.com/v4/bcworkshop12.fd1a0343/{z}/{x}/{y}.png?access_token=' + accessToken,
			"default": false
		},
		{
			"table" : "school_districts",
			"name" : "School Attenance Zones",
			"labels" : 'https://{s}.tiles.mapbox.com/v4/bcworkshop12.c359fa37/{z}/{x}/{y}.png?access_token=' + accessToken,
			"default": false
		},
		{
			"table" : "zips",
			"name" : "Zip Codes",
			"labels" : 'https://{s}.tiles.mapbox.com/v4/bcworkshop12.41469e8d/{z}/{x}/{y}.png?access_token=' + accessToken,
			"default": false
		},
		{
			"table" : "city_limits",
			"name" : "City Limits",
			"default" : true
		}
	];
