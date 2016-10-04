$(function($){
		// root window element
	var $window = $(window),
		// window sizes
		wSize = {},
		// how big the header is
		headerHeight = $('.header').height(),
		// grab all the applicable elements
		$fixed_elements = $('.fixed-background'),
		// we'll store their details later in an array
		fixed_elements = [],
		// the overall height of the parallaxing element gets divided by this number
		// to decide how much the image should move by
		// or in other words, how strong the parallax effect should be
		// the smaller the number, the stronger the effect
		// but also, the larger the image should be to provide appropriate resolution
		parallax_delta = 2.5,
		// also tied into how strong the parallax effect is,
		// this decides how much margin around the image should be afforded
		// by way of multiplying the amount the image will move
		parallax_multiplier = 2,
		// we'll store if we actually need to parallax
		should_parallax,

	parallax_setup = function(){

		// store heights
		wSize = {
			height: $window.height(),
			width: $window.width(),
		}

		// are we on mobile? if yes, STOP
		if ( $$_.mediaQuery.getQuery().indexOf('mobile') === 0 || $$_.isTouchDevice())
			should_parallax = false;
		else 
			should_parallax = true;

		// we need somewhere to put our images, and unfortunately this is the best way to do it
		// we make a little 1px div WAY off to the right with overflow hidden
		// that we can later put images into, to measure
		$('<div id="img_stage"></div>').appendTo('body')

		// take each of the parallaxed elems
		$fixed_elements.each(function(e){

			
			if (should_parallax){

				var $that = $(this),
					// top of window, accounting for header
					top = $that.scrollTop() + headerHeight,
					// bottom of window
					bottom = top + wSize.height,
					loadOffset;

				fixed_elements[e] = {
					el: $that,
					// beginning of element
					start: $that.offset().top,
					// end of element
					end: $that.offset().top + $that.outerHeight(true),
					// height of element
					height: $that.outerHeight(true),
					// how much the element should be parallaxed
					parallax_distance: $that.outerHeight(true) / parallax_delta
				}


				// we'll find out how big the background image is
				// by appending it to our little image staging area from before
				// then grabbing its dimensions & ratio

				var imgURL = fixed_elements[e].el.css('background-image').split('(')[1].split(')')[0]

				// HAHAHAH FIREFOX LIKES TO THROW IN RANDOM DOUBLE QUOTES INTO ITS STRINGS HOW HELPFUL
				if (imgURL.indexOf('"') === 0)
					imgURL = imgURL.split('"')[1].split('"')[0];

				var imgSlug = $('<img/>').attr('src', imgURL )

				imgSlug.appendTo('#img_stage')

				var	bgSize = {
						width: imgSlug.width(),
						height: imgSlug.height(),
						ratio: imgSlug.width() / imgSlug.height()
					},
					scaledBGsize = {};


				// oh no! the images' height is smaller than the parallaxing element
				if (bgSize.height < fixed_elements[e].height){
					// set the images' height to the element's height, plus the parallax margin
					scaledBGsize.height = fixed_elements[e].height + ( fixed_elements[e].parallax_distance * parallax_multiplier );
					// and set the width with the help of the images' ration
					scaledBGsize.width = scaledBGsize.height * bgSize.ratio;
					// we don't need to center
					fixed_elements[e].bgCenterOffset = 0;

					// oh no! the image still isn't wide enough!
					if (scaledBGsize.width < wSize.width){
						// set the images' height with the help of its ration; image size is window size
						scaledBGsize.height = ( wSize.width / bgSize.ratio ) + ( fixed_elements[e].parallax_distance * parallax_multiplier );
						// && then reset the width, now that we have a new height
						scaledBGsize.width = scaledBGsize.height * bgSize.ratio;
					}
				}

				// oh no! the images' width is smaller than that of the window
				else if (bgSize.width < wSize.width){
					// set the images' height with the help of its ration; image size is window size
					scaledBGsize.height = ( wSize.width / bgSize.ratio ) + ( fixed_elements[e].parallax_distance * parallax_multiplier );
					// && then reset the width, now that we have a new height
					scaledBGsize.width = scaledBGsize.height * bgSize.ratio;
					// we can assume that our image is portrait, and that we've had to scale it
					// so we'll center it, by subtracting the calculated height from the element's height, and dividing it by two
					fixed_elements[e].bgCenterOffset = -( scaledBGsize.height - fixed_elements[e].height ) / 2;

					// oh no! the image still isn't tall enough!
					if (scaledBGsize.height < fixed_elements[e].height){ 
						// okay then, set the images' height to the element's height, plus the parallax margin
						scaledBGsize.height = fixed_elements[e].height + ( fixed_elements[e].parallax_distance * parallax_multiplier );
						// and set the width with the help of its ratio
						scaledBGsize.width = scaledBGsize.height * bgSize.ratio;
						// same as before, lets' figure out how much we need to offset so we're in the middle
						fixed_elements[e].bgCenterOffset = -( scaledBGsize.height - fixed_elements[e].height ) / 2;
					}
				}

				// hooray! the image fits!
				else if (
					(bgSize.height >= fixed_elements[e].height) && 
					(bgSize.width >= wSize.width)
				){
					// the image is wider than it is tall
					if (bgSize.height < bgSize.width){
						// then set the height with the help of its ratio, along with the parallax margin; image size is window size
						scaledBGsize.height = ( wSize.width / bgSize.ratio ) + ( fixed_elements[e].parallax_distance * parallax_multiplier );
						// and now set the width with the help of its ratio
						scaledBGsize.width = scaledBGsize.height * bgSize.ratio;
						// and recenter if necessary
						fixed_elements[e].bgCenterOffset = -( scaledBGsize.height - fixed_elements[e].height ) / 2;
					}
					// the image is taller than it is wide
					else{
						// set the images' height, along with the parallax margin
						scaledBGsize.height = fixed_elements[e].height + ( fixed_elements[e].parallax_distance * parallax_multiplier );
						// and set the image's width with its ratio
						scaledBGsize.width = scaledBGsize.height * bgSize.ratio;
						fixed_elements[e].bgCenterOffset = 0
					}				
				}

				// as we load thing, are we looking at the image? then set its parallax to where it should be
				// detailed explaination of what's going on here can be found in the window.scroll call
				if (
					bottom >= fixed_elements[e].start &&
					top <= fixed_elements[e].end
				){
					loadOffset = $$_.map_range(
						top, 
						fixed_elements[e].start - wSize.height, 
						fixed_elements[e].end, 
						-fixed_elements[e].parallax_distance + fixed_elements[e].bgCenterOffset,
						fixed_elements[e].parallax_distance + fixed_elements[e].bgCenterOffset
					)
				}
				// the image is below the viewport, so set it to its starting position
				else if (bottom < fixed_elements[e].start){
					loadOffset = -fixed_elements[e].parallax_distance + fixed_elements[e].bgCenterOffset
				}
				// the image is above the viewport, so set it to its finishing position
				else if (top > fixed_elements[e].end){
					loadOffset = fixed_elements[e].parallax_distance + fixed_elements[e].bgCenterOffset
				}

				// console.log(scaledBGsize.width.toFixed(0))
				// console.log(scaledBGsize.height.toFixed(0))

				// and FINALLY, set the actual CSS. pfiu!
				fixed_elements[e].el.css({
					'background-position': 'center ' + loadOffset + 'px',
					'background-size': scaledBGsize.width + 'px ' + scaledBGsize.height + 'px'
				});

			}
			// oh crap we're on mobile, let's reset!
			else{
				if (typeof(fixed_elements[e]) !== 'undefined' ){
					fixed_elements[e].el.css({
						'background-position': 'center center',
						'background-size': 'cover'
					});
				}
			}
		});
	}

	$window.scroll(function(e){
		if (should_parallax){
			var $that = $(this),
				top = $that.scrollTop() + headerHeight,
				bottom = top + wSize.height;

			// let's have a look through our stored parallaxed elements
			for (var i = 0; i < fixed_elements.length; i++){

				if (
					// is the bottom of the screen is greater than the start of the parallaxing element?
					bottom >= fixed_elements[i].start &&
					// and is the top of the screen less than the end of the parallaxing element?
					top <= fixed_elements[i].end
				){
					// yeah? cool. let's move some things!
					fixed_elements[i].el.css(
						'background-position', 
						'center ' +
						// this function is provided an input, an incoming lower / upper bound, and a desired lower / upper bound
						$$_.map_range(
							// where we are in the page
							top, 
							// the point (scrolltop) at which we would first see the element, thus to begin parallaxing
							fixed_elements[i].start - wSize.height, 
							// the last point (scrolltop) that we would conceivably see the element
							fixed_elements[i].end, 
							// the lower bound of the desired parallaxing effect, plus any negative offset to center, if necessary
							-fixed_elements[i].parallax_distance + fixed_elements[i].bgCenterOffset,
							// the upper bound of the desired parallaxing effect, plus any negative offset to center, if necessary
							fixed_elements[i].parallax_distance + fixed_elements[i].bgCenterOffset
						) + 'px'
					)
				}
			}
		}
	});

	// debounce things
	var parallax_setup_debounce = $$_.debounce(parallax_setup, 250);

	// set it to refire on page resize
	$window.resize(parallax_setup_debounce);

	// and get things underway on page load!
	$window.load(parallax_setup);

});
