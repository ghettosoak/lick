$(function() {

	pathValidator = function(path){
		if (( typeof(path) !== 'undefined' ) && (path !== ''))
			return true;
		else return false;
	}

	imageSetter = function(e){

		$('img.img').each(function(){

			var $that = $(this),
				data = $that.data();

			if (
				( $$_.mediaQuery.is('mobile') ) &&
				( !$that.hasClass('desktop-only') )
			){

				if ( pathValidator(data.srcsvgmobile) && $$_.supportsSvg() )
					$that.attr('src', data.srcsvgmobile).addClass('is_svg');

				else if ( pathValidator(data.srcimgmobile) )
					$that.attr('src', data.srcimgmobile).addClass('is_img');

				else if ( pathValidator(data.srcsvgdesktop) )
					$that.attr('src', data.srcsvgdesktop).addClass('is_svg');

				else
					$that.attr('src', data.srcimgdesktop).addClass('is_img');

			}		
			else if (
				(
					( $$_.mediaQuery.is('large_desktop') ) ||
					( $$_.mediaQuery.is('desktop') ) ||
					( $$_.mediaQuery.is('tablet') )
				) &&
				( !$that.hasClass('mobile-only') )
			){

				if ( pathValidator(data.srcsvgdesktop) && $$_.supportsSvg() )
					$that.attr('src', data.srcsvgdesktop).addClass('is_svg');

				else
					$that.attr('src', data.srcimgdesktop).addClass('is_img');

			}

		});

	}

	$$_.mediaQuery.subscribe(imageSetter);
});