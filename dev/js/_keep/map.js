$(function() {

	$$_.gMapLoader.subscribe(mapInit);

	function mapInit(){

		var $map = $('.map');

		if ($map.length > 0){

			var map_data = $map.data(),
				map_point = new google.maps.LatLng(map_data.lat, map_data.lng),

			map_object = new google.maps.Map(
				$map[0],
				{
					center: map_point,
					zoom: 15,
					minZoom: 0,
					maxZoom: 21,
					mapTypeId: google.maps.MapTypeId.ROADMAP,
			    	panControl: false,
					zoomControl: false,
					scrollwheel: false,
					scaleControl: false,
					mapTypeControl: false, 
					streetViewControl: false,
					overviewMapControl: false,
					draggable: ($$_.mediaQuery.getQuery().indexOf('mobile') === 0 ) ? false : true
			    }
			);

			var marker = new google.maps.Marker({
				position: map_point,
				map: map_object,
				title: map_data.text
			});

	    	var infoWindow = new google.maps.InfoWindow({
	    		content: '<div class="infoWindow">'+
					'<p>' + map_data.text + '</p>'+
					'<p><a href="https://www.google.ch/maps/place/' + map_data.lat + ',' + map_data.lng + '" target="_blank">' + map_data.link + '</a></p>' +
				'</div>'
	    	});

			google.maps.event.addListener(marker, 'click', function() {
				infoWindow.open(map_object, marker);
			});
			
		}

	}

});