$(function() {

	$('#loading').fadeOut('slow', function() {

		$('.flowitems').show('slide', {
			direction : 'up'
		}, 3000);

		/*
		 *
		 *
		 * SKETCH DRAWING MODE
		 *
		 *
		 */

		function DestroySketchPad() {
			console.log('cleared sketch');
			$('.notes header').css('background', 'transparent url(img/trianglesprite2.png) center top no-repeat');
			$('.sketchWrap').hide();
			$('#sketchPad').each(function() {
				var $$ = $(this)[0].getContext('2d');
				$$.fillRect(0, 0, $$.width, $$.height);
				$$.width = $$.width;
				$(this).removeData('sketch');
			});
			$('.sketchTools').hide('fade',500);
			//$('.stickyWrap').hide();
		}

		function CreateSketchPad() {
			console.log('created sketch');
			$('.notes header').css('background', 'transparent url(img/trianglesprite2.png) center -260px no-repeat');
			$('#sketchPad').prop('height', $('.sketchWrap').height());
			$('.sketchWrap').css({
				display : 'table'
			}).find('#sketchPad').sketch();
			$('.sketchTools').show('fade',500);
			//$('.stickyWrap').hide();
		}

		/*
		*
		*
		* STICKY NOTES WRITING MODE
		*
		*
		*/

		//set notepad width and height
		//$('#notePad').prop('height', $('html').height());
		//$('#notePad').prop('width', $('html').width() - $('.workflow').width() - $('.personalflow').width());

		$('.notes').on('click', function(e) {
			var x = e.pageX - this.offsetLeft + $(this).position().left;
			var y = e.pageY - this.offsetTop;
			var rid = randString();
			$('.stickyWrap:not(.template)').each(function() {
				if (!$(this).data('pinned'))
					$(this).remove();
				
			});
			//TODO: missclick removes the sticky note
			$('.stickyWrap.template').clone(true, true).removeClass('template').css({
				top : y + 5,
				left : x + 5
			}).data('pinned', false).data('id', rid).appendTo('.notes').show().find('textarea').focus().val('');
			console.log(rid + ' created');
		});

		function randString(n) {
			if (!n) {
				n = 5;
			}
			var text = '';
			var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			for (var i = 0; i < n; i++) {
				text += possible.charAt(Math.floor(Math.random() * possible.length));
			}
			return text;
		}


		$('.sticky .pin').on('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			$(this).closest('.stickyWrap').data('pinned', true);
			console.log($(this).closest('.stickyWrap').data('id') + ' pinned');
		});

		$('.sticky .close').on('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			var $sW = $(this).closest('.stickyWrap');
			var t = $(this).closest('.sticky').find('textarea').val();
			if (t == '')
				$(this).closest('.stickyWrap').hide('fade', 500);
			else {
				var w = $sW.width();
				var y = $sW.position().top;
				var x = $sW.position().left;
				$sW.addClass('removalTarget');
				$('.tooltipWrap').css({
					top : y,
					left : x + w + 8,
					margin : 0
				}).show('fade', 500).find('.message').html('Do you want to remove the sticky note?').siblings('.button').hide().siblings('.remove,.action1').show().filter('.action1').addClass('primary').text('continue using it');
			}
		});

		$('.button.remove').on('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			$(this).closest('.tooltipWrap').hide('fade', 500);
			$('.removalTarget.stickyWrap:not(.template)').hide('fade', 500);
		});
		
		$('.button.action1').on('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			$(this).closest('.tooltipWrap').hide('fade', 500);
		});

		/*
		 $('.sticky textarea').on('keyup', function() {
		 var y = parseInt($('.stickyWrap').css('top'));
		 var x = parseInt($('.stickyWrap').css('left')) - $('.workflow').width();
		 var text = $(this).val();
		 var $$ = $('#notePad');
		 var ctx = $$[0].getContext('2d');
		 ctx.font = $('#notePad').css('font');
		 ctx.fillText(text, x, y);
		 });
		 */

		/*
		 *
		 *
		 * MODES SWAPING
		 *
		 *
		 */

		$('.notes,.sketchWrap').on('dblclick', function(e) {
			e.stopPropagation();
			($('.sketchWrap').is(':visible')) ? DestroySketchPad() : CreateSketchPad();
		});

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

		/*
		 *
		 *
		 * BRIEF TOUR IN MODAL WINDOWS
		 *
		 *
		 */

		var t = 0;
		function TourTooltipsQueue() {
			var tt = {};
			///*
			 tt=[
			 {x:'10%',y:100,text:'Your work related stuff is displayed here. Be sure to set up <a class="filters" href="#">filters</a> to have more accurate information in the workflow.'},
			 {x:'70%',y:100,text:'Your personal life related stuff is displayed here. If you have <a href="#">facebook</a>, <a href="#twitter">twitter</a> or <a href="#">google+</a> you can easily stay in touch with your personal agenda!'},
			 {x:'40%',y:300,text:'You can switch to sketch mode anytime by triangle up here.'},
			 {x:'40%',y:400,text:'When in sketch mode you can share screen with others, export picture you draw or even collaborate with others on drawing it.'},
			 {x:'20%',y:100,text:'Just click the area in notes mode and create sticky notes anywhere you like. You can pin them for later use.'},
			 ];//*/
			if (t < tt.length) {
				$('.tourWrap').css({
					top : tt[t].y,
					left : tt[t].x,
					margin : 0
				}).show('fade', 500).find('.message').html(tt[t].text);
				t++;
			}
		}


		$('.tourWrap').delay(500).fadeIn();
		$('.tourWrap a.next,a.startTour').on('click', function(e) {
			e.preventDefault();
			$(this).text('show me another feature');
			$('.tooltipWrap').hide();
			$('.tourWrap').hide('fade', 500, function() {
				TourTooltipsQueue();
			});
		});

		$('a.resetTour').on('click', function(e) {
			e.preventDefault();
			t = 0;
			TourTooltipsQueue();
		});

		$('a.cancelTour').on('click', function(e) {
			e.preventDefault();
			$('.tourWrap:visible').hide('fade', 500);
		});

		/*
		 *
		 *
		 * MODAL WINDOWS SHOWING TIPS
		 *
		 *
		 */

		function ItemsTooltipQueue() {
			var tt = {};
			///*
			 tt=[
			 {obj:'.social',evnt:'click',xo:'180',yo:'50',text:'This is for demonstration purpose only, Facebook neither Twitter signup is implemented. Continue by having a <a class="startTour" href="#tour">tour</a>.'},
			 {obj:'#trianglemap',evnt:'click',xo:'40%',yo:'300',text:'Congratulations, you have entered the sketch mode!<br /><br />Now... try to get rid of this message!<br /> You can exit or enter the sketching mode anytime by double-clicking or by pressing the triangle up there.'},
			 {obj:'.workflow',evnt:'click',xo:'10',yo:'100',text:'Unfortunately there wasnt enough time to implement any reasonable functionality. Thats why the stripped out mail is being shown.'},
			 {obj:'.personalflow',evnt:'click',xo:'70%',yo:'100',text:'Doh, hopefuly this fancy minimalist calendar would keep you from requesting any more functionality.'},
			 {obj:'.sketchTools',evnt:'click',xo:'70%',yo:'80%',text:'There is a lot of potential here - different colors, exporting to friends, sharing via social networks, sharing screen while drawing etc...'},
			 {obj:'.notes',evnt:'click',xo:'20%',yo:'20%',text:'Try to write something in the textbox and remove the sticky.'},
			 ];//*/
			$('.tooltip').data('show', true);
			$.each(tt, function(i, v) {
				$(v.obj).one(v.evnt, function() {
					$('.tooltipWrap:visible').hide('fade', 500);
					if ($('.tooltip').data('show')) {
						var w = $(this).width();
						var y = $(this).position().top;
						var x = $(this).position().left;
						var totalx = (v.xo.indexOf('%')>=0) ? v.xo : x+parseInt(v.xo);
						var totaly = (v.yo.indexOf('%')>=0) ? v.yo : y+parseInt(v.yo);
						console.log(totalx+' - '+totaly);
						$('.tooltipWrap').css({
							top : totaly,
							left : totalx,
							margin : 0
						}).show('fade', 500).find('.message').html(v.text).siblings('.button').hide().siblings('.close').show();
					}
				});
			});
		}

		ItemsTooltipQueue();
		$('.tooltipWrap a.dismiss,.tooltipWrap a.close').on('click', function(e) {
			e.preventDefault();
			$('.tooltipWrap').hide('fade', 500);
		});

		$('a.resetTips').on('click', function(e) {
			e.preventDefault();
			$('.tooltip').data('show', true);
			ItemsTooltipQueue();
		});

		$('a.cancelTips').on('click', function(e) {
			e.preventDefault();
			$('.tooltip').data('show', false);
			$('.tooltipWrap:visible').hide('fade', 500);
		});

		/*
		 *
		 *
		 * NOTHING WORKS FROM THIS POINT, ITS JUST EYE CANDY
		 *
		 *
		 */
		
		$('.personalflow .item').on('click',function(){$('.calendarWrap').show('slide',{direction:'right'})});
		$('.workflow .item').on('click',function(){$('.mailWrap').show('slide',{direction:'left'})});
		$('.mailWrap textarea').on('click',function(e){e.stopPropagation();});

	});
});
