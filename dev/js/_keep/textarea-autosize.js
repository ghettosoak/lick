$(function() {

    var $container = $('.textarea-container'),
        $textarea = $container.find('textarea'),
        $autosizer = $container.find('.textarea-autosize'),

        // where the magic happens!
        textSet = function(){
            $autosizer.html( $textarea.val() );
        },
        
        // let's debounce so we're not updating like crazy
        debounceTextareaResize = $$_.debounce(textSet, 50)

    $textarea.on('keyup', function(e){
        debounceTextareaResize();
    });
});