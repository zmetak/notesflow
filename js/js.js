$(function() {

	$('#loading').fadeOut('slow', function() {

		$('.flowitems').show('slide', {
			direction : 'up'
		}, 3000);

		$('#trianglemap').hover(function() {
			($('.sketchWrap').is(':visible')) ? $('.notes header').css('background-position', 'center -390px') : $('.notes header').css('background-position', 'center -130px');
		}, function() {
			($('.sketchWrap').is(':visible')) ? $('.notes header').css('background-position', 'center -260px') : $('.notes header').css('background-position', 'center 0px');
		});

		$('#trianglemap').toggle(function() {
			CreateSketchPad();
		}, function() {
			DestroySketchPad();
		});

		function DestroySketchPad() {
			console.log('cleared sketch');
			$('.notes header').css('background', 'transparent url(img/trianglesprite.png) center top no-repeat');
			$('.sketchWrap').hide();
			$('#sketchPad').each(function() {
				var $$ = $(this)[0].getContext('2d');
				$$.fillRect(0, 0, $$.width, $$.height);
				$$.width = $$.width;
				$(this).removeData('sketch');
			});
			$('.stickyWrap').hide();
		}

		function CreateSketchPad() {
			console.log('created sketch');
			$('.notes header').css('background', 'transparent url(img/trianglesprite.png) center -260px no-repeat');
			$('#sketchPad').prop('height', $('.sketchWrap').height());
			$('.sketchWrap').css({
				display : 'table'
			}).find('#sketchPad').sketch();
			$('.stickyWrap').hide();
		}


		$('.noteWrap,.sketchWrap').on('dblclick', function(e) {
			($('.sketchWrap').is(':visible')) ? DestroySketchPad() : CreateSketchPad();
		});

		//set notepad width and height
		$('#notePad').prop('height', $('html').height());
		$('#notePad').prop('width', $('html').width() - $('.workflow').width() - $('.personalflow').width());

		$('.noteWrap').on('click', function(e) {
			var x = e.pageX - this.offsetLeft + $(this).position().left;
			var y = e.pageY - this.offsetTop;
			$('.stickyWrap').css({
				top : y + 5,
				left : x + 5
			}).show();
			$('.sticky textarea').focus().val('');
		});

		$('.sticky textarea').on('keyup', function() {
			var y = parseInt($('.stickyWrap').css('top'));
			var x = parseInt($('.stickyWrap').css('left')) - $('.workflow').width();
			var text = $(this).val();
			var $$ = $('#notePad');
			var ctx = $$[0].getContext('2d');
			ctx.font = $('#notePad').css('font');
			ctx.fillText(text, x, y);
		});

		$('.tooltipWrap').delay(500).fadeIn();
		$('.tooltip a').on('click', function(e) {
			e.preventDefault();
			$(this).closest('.tooltipWrap').hide('fade', 500, function() {
				TooltipsQueue()
			});
		});

		var tt = {};
		var t = 0;
		function TooltipsQueue() {
			tt=[
				{x:100,y:300,text:'Your work related stuff is displayed here. Be sure to set up <a class="filters" href="#">filters</a> to have more accurate information in the workflow.'},
				{x:100,y:300,text:'Your personal life related stuff is displayed here. If you have <a class="facebook" href="#">facebook</a>, <a class="twitter" href="#">twitter</a> or <a class="google" href="#">google+</a> you can easily stay in touch with your personal agenda!'},
				{x:100,y:300,text:'You can switch to sketch mode anytime by double clicking or by triangle up here.'},
			];
			if(t<tt.length)
			{
				$('.tooltipWrap').css({top:tt[t].y,left:tt[t].x,margin:0}).show('fade',500).find('.message').html(tt[t].text);
				t++;
			}
		}

	});
});
