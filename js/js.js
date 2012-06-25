$(function() {

	$('#trianglemap').hover(function() {
		$('.notes header').css('background', 'transparent url(img/notes_big_triangle_shadow.png) center top no-repeat');
	}, function() {
		$('.notes header').css('background', 'transparent url(img/notes_big_triangle.png) center top no-repeat');
	});

	$('#trianglemap').toggle(function() {
		console.log('created sketch');
		$('#sketchPad').prop('height', $('.sketchWrap').height());
		$('.sketchWrap').css({
			display : 'table'
		}).find('#sketchPad').sketch();
	}, function() {
		console.log('cleared sketch');
		$('.sketchWrap').hide();
		$('#sketchPad').each(function() {
			var $$ = $(this)[0].getContext('2d');
			$$.fillStyle = '#ffffff';
			$$.fillRect(0, 0, $$.width, $$.height);
			$$.width = $$.width;
			$(this).removeData('sketch');
		});
	});

	$('.noteWrap,#notePad').css({
		height : $('html').height()
	});

	$('.noteWrap').on('click', function(e) {
		var x = e.pageX - this.offsetLeft + $(this).position().left;
		var y = e.pageY - this.offsetTop;
		$('.tooltipWrap').css({
			top : y,
			left : x
		}).show();
	});

	$('.tooltip textarea').on('keyup', function() {
		var y = $('.tooltipWrap').css('top');
		var x = $('.tooltipWrap').css('left');
		var text = $(this).val();
		var $$ = $('#notePad');
		var ctx = $$[0].getContext('2d');
		var cw = $$.clientWidth;
		var ch = $$.clientHeight;
		$$.width = cw;
		$$.height = ch;
		//break the text into arrays based on a text width of 100px
		var phraseArray = getLines(ctx, text, 100);
		// this adds the text functions to the ctx
		CanvasTextFunctions.enable(ctx);
		var counter = 0;
		var font = "sans";
		var fontsize = 16;
		
		//draw each phrase to the screen, making the top position 20px more each time so it appears there are line breaks
		$.each(phraseArray, function() {
			//set the placement in the canvas
			var lineheight = fontsize * 1.5;
			var newline = ++counter;
			newline = newline * lineheight;
			var topPlacement = y - $$.position().top + newline;
			var leftPlacement = x - $$.position().left;
			var text = $(this);
			//draw the text
			ctx.drawText(font, fontsize, leftPlacement, topPlacement, text);
			ctx.save();
			ctx.restore();
		});
	});


	function getLines(ctx, phrase, maxPxLength) {
		//break the text area text into lines based on "box" width
		var wa = phrase.split(" "), phraseArray = [], lastPhrase = "", l = maxPxLength, measure = 0;
		ctx.font = "16px sans-serif";
		for (var i = 0; i < wa.length; i++) {
			var w = wa[i];
			measure = ctx.measureText(lastPhrase + w).width;
			if (measure < l) {
				lastPhrase += (" " + w);
			} else {
				phraseArray.push(lastPhrase);
				lastPhrase = w;
			}
			if (i === wa.length - 1) {
				phraseArray.push(lastPhrase);
				break;
			}
		}
		return phraseArray;
	}

});
