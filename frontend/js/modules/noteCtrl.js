module.exports = function(
	$rootScope, 
	$scope, 
	newNote,
	killNote,
	Note, 
	// NoteIndex,
	newBit,
	$routeParams, 
	$route, 
	hotkeys,
	$timeout,
	$location
) {
	
	var altIsPressed = false;

	Note($routeParams.id).$bindTo($scope, 'note')
	.then(function() {
		if (typeof($scope.note.body) === 'undefined'){
			newNote('', $routeParams.id);
		}
	});

	// NoteIndex().$bindTo($scope, 'noteIndex');

	// 	                                                                                         
	// 	88        88   ,ad8888ba, 888888888888 88      a8P  88888888888 8b        d8 ad88888ba   
	// 	88        88  d8"'    `"8b     88      88    ,88'   88           Y8,    ,8P d8"     "8b  
	// 	88        88 d8'        `8b    88      88  ,88"     88            Y8,  ,8P  Y8,          
	// 	88aaaaaaaa88 88          88    88      88,d88'      88aaaaa        "8aa8"   `Y8aaaaa,    
	// 	88""""""""88 88          88    88      8888"88,     88"""""         `88'      `"""""8b,  
	// 	88        88 Y8,        ,8P    88      88P   Y8b    88               88             `8b  
	// 	88        88  Y8a.    .a8P     88      88     "88,  88               88     Y8a     a8P  
	// 	88        88   `"Y8888Y"'      88      88       Y8b 88888888888      88      "Y88888P"   
	// 	                                                                                         
	// 	                                                                                         

	hotkeys.bindTo($scope)
		.add({
			combo: 'alt',
			description: 'disable "links"',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			action: 'keydown',
			callback: function(event, hotkey) {
				altIsPressed = true;
			}
		})
		.add({
			combo: 'alt',
			description: 'disable "links"',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			action: 'keyup',
			callback: function(event, hotkey) {
				altIsPressed = false;
			}
		})
		.add({
			combo: 'enter',
			description: 'add new bit',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event, hotkey) {
				if ( _isTextarea() ){
					$scope.addBit( _bitIndex() );
					event.preventDefault();
				}
			}
		})
		.add({
			combo: 'backspace',
			description: 'remove bit',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event, hotkey) {
				if ( _isTextarea() && ($scope.note.body[_bitIndex()].content === '')){
					$scope.killBit( _bitIndex() );
					event.preventDefault();
				}
			}
		})
		.add({
			combo: ['command+backspace', 'ctrl+backspace'],
			description: 'remove bit',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event, hotkey) {
				if ( _isTextarea() ){
					$scope.killBit( _bitIndex() );
					event.preventDefault();
				}
			}
		})
		.add({
			combo: 'tab',
			description: 'increase indent',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event) {
				if ( _isTextarea() && $scope.note.body[_bitIndex()].tabCount < 2 ){
					$scope.note.body[_bitIndex()].tabCount++;
					event.preventDefault();
				}
			}
		})
		.add({
			combo: 'shift+tab',
			description: 'decrease indent',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event) {
				if ( _isTextarea() && $scope.note.body[_bitIndex()].tabCount > 0 ){
					$scope.note.body[_bitIndex()].tabCount--;
					event.preventDefault();
				}
			}
		})
		.add({
			combo: ['up', 'down'],
			description: 'movement',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event) {
				if ( _isTextarea()){
					$scope.jumpAround(_bitIndex(), event.keyIdentifier);
				}
			}
		})
		.add({
			combo: 'ctrl+command+up',
			description: 'move bit up',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function() {
				$scope.moveUp(_bitIndex());
			}
		})
		.add({
			combo: 'ctrl+command+down',
			description: 'move bit down',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function() {
				$scope.moveDown(_bitIndex());
			}
		})
		.add({
			combo: ['ctrl+v', 'command+v'],
			description: 'paste',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function() {
				$scope.parsePasted(_bitIndex());
			}
		})
		.add({
			combo: 'shift shift',
			description: 'toggle marked',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function() {
				if ( _isTextarea()){
					$scope.note.body[_bitIndex()].mark = !$scope.note.body[_bitIndex()].mark;
				}
			}
		});

	// 	                                                                                                
	// 	88888888888 88        88 888b      88   ,ad8888ba, 888888888888 88   ,ad8888ba,   888b      88  
	// 	88          88        88 8888b     88  d8"'    `"8b     88      88  d8"'    `"8b  8888b     88  
	// 	88          88        88 88 `8b    88 d8'               88      88 d8'        `8b 88 `8b    88  
	// 	88aaaaa     88        88 88  `8b   88 88                88      88 88          88 88  `8b   88  
	// 	88"""""     88        88 88   `8b  88 88                88      88 88          88 88   `8b  88  
	// 	88          88        88 88    `8b 88 Y8,               88      88 Y8,        ,8P 88    `8b 88  
	// 	88          Y8a.    .a8P 88     `8888  Y8a.    .a8P     88      88  Y8a.    .a8P  88     `8888  
	// 	88           `"Y8888Y"'  88      `888   `"Y8888Y"'      88      88   `"Y8888Y"'   88      `888  
	// 	                                                                                                
	// 	                                                                                                

	$scope.addBit = function(index, content){
		var incomingContent;

		if (typeof(content) === 'undefined')
			incomingContent = '';
		else
			incomingContent = content;

		$timeout(function(){
			$scope.note.body.splice(index + 1, 0, newBit());

			$scope.note.body[index + 1].tabCount = $scope.note.body[index].tabCount;
			$scope.note.body[index + 1].content = incomingContent;
			$scope.note.body[index + 1].contentCaret = incomingContent;

			$scope.parseLink(index);

			_focusMe(index + 1);
		}, 50);
	};

	$scope.parsePasted = function(index){
		$timeout(function(){
			// split at line breaks
			var theContent = $scope.note.body[index].content.split('\n');

			// remove empty lines
			for (var l = 0; l < theContent.length; l++){
				if (theContent[l] === '') theContent.splice(l, 1);
			}

			// set block to empty before replacing w/ 1st line
			$scope.note.body[index].content = '';
			$scope.note.body[index].content = theContent[0];

			$scope.note.body[index].contentCaret = '';
			$scope.note.body[index].contentCaret = theContent[0];

			$scope.parseLink(index);

			for (var l = 1; l < theContent.length; l++){
				$scope.addBit(index + (l - 1), theContent[l]);
			}
		}, 50); 
	}

	$scope.parseLink = function(index){
		var content = $scope.note.body[index].content;

		if (
			content.indexOf("http://") === 0 ||
			content.indexOf("https://") === 0 
		){			
			console.log('OH NOES A LINK')

			$.ajax({
				type: "GET",
				dataType:'JSONP',
				data:{
					URL: content
				},
				url: "http://re.ject.ch/tra/php/title.php"
			}).done( function(theTitle){
				var escapedTitle = _.unescape(theTitle.title);
				console.log(escapedTitle)

				$scope.note.body[index].content = escapedTitle;
				$scope.note.body[index].contentCaret = escapedTitle;
				$scope.note.body[index].address = content;
				$scope.note.body[index].isLink = true;

				$scope.$apply();
			})
		}
	}

	$scope.openLink = function(bit){

		if (bit.isLink && !altIsPressed){
			document.activeElement.blur();
			var win = window.open('https://www.google.com/search?q=' + bit.address, '_blank');
			win.focus();
		}
	}

	$scope.killBit = function(index){
		$scope.note.body.splice(index, 1);
		_focusMe(index - 1)
	};

	$scope.moveUp = function(index){
		var thisBit = $scope.note.body.splice(_bitIndex(), 1)[0];
		$scope.note.body.splice(index - 1, 0, thisBit);
		_focusMe(index - 1)
	};

	$scope.moveDown = function(index){
		var thisBit = $scope.note.body.splice(_bitIndex(), 1)[0];
		$scope.note.body.splice(index + 1, 0, thisBit);
		_focusMe(index + 1)
	};

	$scope.caretTracker = function(index, key){
		setTimeout(function(){
			var theBit = document.activeElement,
				currentCaret = theBit.selectionStart,
				theValue = theBit.value;

			$scope.note.body[index].contentCaret = 
				theValue.substring(0, currentCaret) + 
				'<span class="hiddenCaret"></span>' + 
				theValue.substring(currentCaret, theValue.length)

			$scope.$apply();
		}, 10)
	}


	$scope.jumpAround = function(index, key){
		var $theBit = $(document.activeElement),
			$theCaret = $theBit.next().find('.hiddenCaret'),
			theCaretPos = $theCaret.position().top;

		if ( 
			(key === 'Up') && 
			(theCaretPos > 0) 
		){
			$theBit.parents('.note_bit')
				.prev('.note_bit').find('textarea')
				.focus()
		}

		if ( 
			(key === 'Down') && 
			(theCaretPos < ($theCaret.parent().height() - 18)) 
		){
			$theBit.parents('.note_bit')
				.next('.note_bit').find('textarea')
				.focus()
		}
	};

	$scope.mark = function(index){
		$scope.note.body[_bitIndex()].mark = !$scope.note.body[_bitIndex()].mark;
		$scope.note.body[_bitIndex()].marked = new Date;
		$scope.note.body[_bitIndex()].menu_open = false;
	};

	$scope.search = function(content){
		var win = window.open('https://www.google.com/search?q=' + content, '_blank');
	    win.focus();
	};

	$scope.bitBlur = function($index){
		console.log('BLURD')
	}

	// 	                                                         
	// 	88b           d88 88888888888 888b      88 88        88  
	// 	888b         d888 88          8888b     88 88        88  
	// 	88`8b       d8'88 88          88 `8b    88 88        88  
	// 	88 `8b     d8' 88 88aaaaa     88  `8b   88 88        88  
	// 	88  `8b   d8'  88 88"""""     88   `8b  88 88        88  
	// 	88   `8b d8'   88 88          88    `8b 88 88        88  
	// 	88    `888'    88 88          88     `8888 Y8a.    .a8P  
	// 	88     `8'     88 88888888888 88      `888  `"Y8888Y"'   
	// 	                                                         
	// 	   

	$scope.newNote = function(){
		var newID = newNote($scope.note.parent);
		$location.path('/note/' + newID);
	};

	$scope.killNote = function(){
		killNote($scope.note.id, $scope.note.parent);
	};

	$scope.showUndoList = function(){

	};

	$scope.markNote = function(){

	};

	$scope.addToTable = function(){

	};

	// 	                                                                                      
	// 	88        88 88888888888 88          88888888ba  88888888888 88888888ba   ad88888ba   
	// 	88        88 88          88          88      "8b 88          88      "8b d8"     "8b  
	// 	88        88 88          88          88      ,8P 88          88      ,8P Y8,          
	// 	88aaaaaaaa88 88aaaaa     88          88aaaaaa8P' 88aaaaa     88aaaaaa8P' `Y8aaaaa,    
	// 	88""""""""88 88"""""     88          88""""""'   88"""""     88""""88'     `"""""8b,  
	// 	88        88 88          88          88          88          88    `8b           `8b  
	// 	88        88 88          88          88          88          88     `8b  Y8a     a8P  
	// 	88        88 88888888888 88888888888 88          88888888888 88      `8b  "Y88888P"   
	// 	                                                                                      
	// 	                                                                                      

	var _isTextarea = function(){
		return document.activeElement.type === 'textarea';
	},

	_bitIndex = function(){
		return $(document.activeElement).parents('.note_bit').index();
	},

	_focusMe = function(index){
		setTimeout(function(){
			$('.note_body')
				.find('.note_bit:eq(' + (index) + ') textarea')
				.focus();
		});
	};

	$scope.sortableOptions_note = {
		handle: '> .bit_anchor'
	}
}