$(function() {

	var $body = $('body')
		$search_input = $('.search_input'),
		$search_results = $('.search_results'),
		$search_toggle = $('.nav_search, .mobile_nav_search'),

	searcher = function() {

		$search_results.empty();

		$.ajax({
		    // url: '/service/search.ashx',
		    url: 'frontend/_structures/fake_search_results.json',
		    data: $search_input.val(),
		 	success: function(results){

		 		for (var i = 0; i < results.length; i++){
		 			$search_results.append(
						'<a class="search_result" href="' + results[i].url_raw + '">'+
							'<h5>' + results[i].title + '</h5>'+
							'<p class="search_result_link">' + results[i].url_readable + '</p>'+
							'<p class="search_results_sample">' + results[i].sample + '</p>'+
						'</a>'
					);
		 		}

		 		$search_results.append(
			 		'<p class="button-inline">'+
			 			'<a href="#" class="button button-bg-white search_results_more"><span class="gfx-plus_small"></span>Alle Anzeigen</a>'+
			 		'</p>'
		 		);

		 	},

		 	error: function(e, text){
		 		// throw(text);
		 	}
		})

	},

	searcherDebounce = $$_.debounce(searcher, 500);

	$search_input.on('keypress', function(e){

		var val = $(this).val();

		if (e.keyCode === 13){
			searcher( val );
		}

		searcherDebounce( val );

	});


	$search_toggle.on('click', function(){
		$body.toggleClass('search_open');
	})

});

