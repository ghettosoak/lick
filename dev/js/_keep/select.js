$(function($){

	var $select_elements = $('select'),
		$selectize_object;

	$selectize_object = $select_elements.each(function(){
		$(this).chosen({
			disable_search_threshold: 10
		})
	});

});
