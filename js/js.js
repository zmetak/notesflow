jQuery.fn.replaceClass = function(toReplace, replaceWith) {
	return $(this).each(function() {
		return $(this).removeClass(toReplace).addClass(replaceWith);
	});
}
$(function() {

	/*
	 *
	 *
	 * DIGITAL CLOCK
	 *
	 *
	 */

	function updateClock() {
	    var currentTime = new Date ( );
	    var currentHours = currentTime.getHours ( );
	    var currentMinutes = currentTime.getMinutes ( );
	    var currentSeconds = currentTime.getSeconds ( );
	    // Pad the minutes and seconds with leading zeros, if required
	    currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
	    currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;
	    // Choose either "AM" or "PM" as appropriate
	    var timeOfDay = ( currentHours < 12 ) ? "AM" : "PM";
	    // Convert the hours component to 12-hour format if needed
	    currentHours = ( currentHours > 12 ) ? currentHours - 12 : currentHours;
	    // Convert an hours component of "0" to "12"
	    currentHours = ( currentHours == 0 ) ? 12 : currentHours;
	    // Compose the string for display
	    var currentTimeString = currentHours + ":" + currentMinutes + ":" + currentSeconds + " " + timeOfDay;
	    $("#clock").html(currentTimeString);   
	}

	setInterval(function(){updateClock()},1000);
	
	/*
	*
	*
	* FLOWS ANIMATION ARCHITECTURE
	*
	*
	*/
	// 1. slide down the flow by the new height
	// 2. after that fade out last element
	// 3. at the same time fade in the new element
	// 4. animate current item out
	// 5. animate new current item in

	var ni = 0;
	function nextItemLoad() {
		var fi = {};
		///*
		 fi=[
		 {flow:'workflow',type:'report',text:'Do not forget about the schedule reporting tool!',timeout:2000},
		 {flow:'personalflow',type:'event',text:'You will never come up with anything original if you are afraid to be wrong.',timeout:11000},
		 {flow:'workflow',type:'meeting',text:'Meeting at the client side.',timeout:20000},
		 {flow:'workflow',type:'email',text:'Remindal: you have dismissed the invitation for this meeting.',timeout:35000},
		 {flow:'personalflow',type:'fb',text:'You have read an article on Times Magazine.',timeout:60000},
		 {flow:'workflow',type:'report',text:'Do not forget about the schedule reporting tool!',timeout:65000},
		 {flow:'personalflow',type:'email',text:'Carla: Hello Jules! Im just looking at the stuff you sent me, everything looks ok',timeout:78000},
		 {flow:'workflow',type:'report',text:'Update TFS documentation according to designs.',timeout:110000},
		 {flow:'workflow',type:'email',text:'Remindal: you have dismissed the invitation for this meeting.',timeout:115000},
		 {flow:'personalflow',type:'fb',text:'You have read an article on Times Magazine.',timeout:120000}
		 ];//*/
		var v = fi[ni];
		if (ni < fi.length) {
			ni++;
			console.log(ni + '.' + v.flow + ' >>>  ' + v.text + ' ' + v.timeout);

			$('.new').removeClass('new');

			$('.' + v.flow + ' .future.item.template').clone().addClass('new').removeClass('template').hide().insertAfter('.' + v.flow + ' .future.item.shadowonly').find('p').html(v.text);
			$('.' + v.flow + ' .future.item.new img').replaceClass($(this).prop('class'), v.type);
			$('.' + v.flow + ' .future.item.new').delay(v.timeout).show('fade', 500, function() {
				nextItemLoad();
				$('.' + v.flow + ' .future.current.item').prev().addClass('current');
				$('.' + v.flow + ' .actual.current.item').prev().removeClass('future').addClass('actual');
				$('.' + v.flow + ' .past.current.item').removeClass('current').prev().removeClass('actual').addClass('past');
			});
		};
	}


	$('.flowitems').show('slide', {
		direction : 'up'
	}, 3000, function() {
		nextItemLoad();
	});

	/*
	 *
	 *
	 * LOAD SAVED STICKIES
	 *
	 *
	 */
	
	function readAjax()	{
		var opt = {
			read : true
		};
		
		$.get('php/ajax.php', opt, function(data) {
			res = $.parseJSON(data);
			console.log(res);
			$.each(res, function(k, v) {
				console.log('creating sticky:' + v.id + ' on coordinates: x=' + v.x + ' y=' + v.y);
				$('.stickyWrap.template').clone(true, true).removeClass('template').css({
					top : v.y,
					left : v.x
				}).data('pinned', true).data('id', v.id).appendTo('.notes').show().find('textarea').html(v.note);
			});
		});
	}

	readAjax(); //on init

	/*
	 *
	 *
	 * ALLOW ONLY ALPHANUMERIC
	 *
	 *
	 */
	$('textarea,input[type="text"]').alphanumeric({
		allow : "., -_?!"
	});

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
		$('.sketchTools').hide('fade', 500);
		//readAjax();
	}

	function CreateSketchPad() {
		console.log('created sketch');
		$('.notes header').css('background', 'transparent url(img/trianglesprite2.png) center -260px no-repeat');
		$('#sketchPad').prop('height', $('.sketchWrap').height());
		$('.sketchWrap').css({
			display : 'table'
		}).find('#sketchPad').sketch();
		$('.sketchTools').show('fade', 500);
		$('.stickyWrap:not(.template) textarea:empty').closest('.stickyWrap').hide();
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
			if ($(this).find('textarea').val() != '')
				$(this).data('pinned', true).find('.pin').addClass('active');
			else if (!$(this).data('pinned'))
				$(this).remove();
		});
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


	$('.sticky').on('click', function(e) {
		e.preventDefault();
		e.stopPropagation();
	});

	var res;
	function sendAjax(contents) {
		$.get('php/ajax.php', contents, function(data) {
			res = $.parseJSON(data);
			console.log(data);
		});
	}


	$('.sticky textarea').on('blur', function(e) {
		var $$ = $(this);
		var $w = $$.closest('.stickyWrap');
		console.log('calling ajax for help: write procedure on ' + $w.data('id'));
		if ($$.val() != '')
			opt = {
				write : true,
				id : $w.data('id'),
				text : $$.val(),
				x : $w.position().left,
				y : $w.position().top
			};
		sendAjax(opt);
	});

	$('.sticky .pin').on('click', function(e) {
		e.preventDefault();
		e.stopPropagation();
		$(this).addClass('active').closest('.stickyWrap').data('pinned', true);
		console.log($(this).closest('.stickyWrap').data('id') + ' pinned');
	});

	$('.sticky .close').on('click', function(e) {
		e.preventDefault();
		e.stopPropagation();
		var $sW = $(this).closest('.stickyWrap');
		var t = $(this).closest('.sticky').find('textarea').val();
		console.log($sW.data('id') + ' with value ' + t + ' closing');
		if (t == '') {
			$(this).closest('.stickyWrap').hide('fade', 500);
		} else {
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
		$w = $('.removalTarget.stickyWrap:not(.template)');
		$w.hide('fade', 500);
		if ($w.find('textarea').val() != '') {
			opt = {
				remove : true,
				id : $w.data('id')
			};
			sendAjax(opt);
		}
		console.log($w.data('id') + ' with value ' + $w.find('textarea').val() + ' removing');
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
	var tmax=0;
	function TourTooltipsQueue() {
		var tt = {};
		///*
		 tt=[
		 {obj:'.workflow',evnt:'click',xo:'0',yo:'50',text:'Your work related stuff is displayed here. Be sure to set up <a class="filters" href="#">filters</a> to have more accurate information in the workflow.'},
		 {obj:'.personalflow',evnt:'click',xo:'1600',yo:'50',text:'Your personal life related stuff is displayed here. If you have <a href="#">facebook</a>, <a href="#twitter">twitter</a> or <a href="#">google+</a> you can easily stay in touch with your personal agenda!'},
		 {obj:'#trianglemap',evnt:'click',xo:'250',yo:'150',text:'You can switch to sketch mode anytime by triangle up here.'},
		 {obj:'#trianglemap',evnt:'click',xo:'250',yo:'150',text:'When in sketch mode you can share screen with others, export picture you draw or even collaborate with others on drawing it.'},
		 {obj:'#trianglemap',evnt:'click',xo:'250',yo:'150',text:'Just click the area in notes mode and create sticky notes anywhere you like. You can pin them for later use.'},
		 ];//*/
		tmax=tt.length;
		if (t < tmax) {
			$('.tourWrap').find('.message').html(tt[t].text);
			var v = tt[t];
			var y = $(v.obj).position().top;
			var x = $(v.obj).position().left;
			var w = $('.tourWrap').width();
			var h = $('.tourWrap').height();
			var totalx = v.xo;
			var totaly = v.yo;
			if (v.xo.indexOf('%') < 0) {
				var xoff = (parseInt(v.xo));
				if ((xoff + w) >= $(window).width())
					totalx = $(window).width() - w;
				else
					totalx = xoff;
			}
			console.log('coords: x:' + x + ' xo:' + xoff + ' w:' + w);
			if (v.yo.indexOf('%') < 0) {
				var yoff = (parseInt(v.yo));
				if ((yoff + h) >= $(window).height())
					totaly = $(window).height() - h;
				else
					totaly = yoff;
			}
			console.log('coords: y:' + y + ' yo:' + yoff + ' h:' + h);
			console.log('prevent overflow: x:' + totalx + ' y:' + totaly);
			$('.tourWrap').css({
				top : totaly,
				left : totalx,
				margin : 0
			}).show('fade', 500);
			t++;
		}	}


	$('.tourWrap').delay(500).fadeIn();
	$('.tourWrap a.next,a.startTour').on('click', function(e) {
		e.preventDefault();
		$(this).text((t==0 || (t+1)<tmax) ? 'show me another feature' : 'finish tour');
		$('.tooltipWrap').hide();
		$('#loading').hide('fade', 500);
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
		$('#loading').hide('fade', 500);
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
		 {obj:'.social',evnt:'click',xo:'980',yo:'2050',text:'Assignment guidelines forbid the requirement to log into any service to access the prototype, therefore Notesflow will act as you were <a href="https://twitter.com/#!/zmetak">zmetak</a> on twitter.'},
		 {obj:'#trianglemap',evnt:'click',xo:'40%',yo:'300',text:'Congratulations, you have entered the sketch mode!<br /><br />Now... try to sketch something!<br /><br />You can exit or enter the sketching mode anytime by <strong>double-clicking</strong> or by pressing the triangle up there.'},
		 {obj:'.workflow',evnt:'click',xo:'10',yo:'100',text:'Unfortunately there wasnt enough time to implement any reasonable functionality. Thats why the stripped out mail is being shown.'},
		 {obj:'.personalflow',evnt:'click',xo:'70%',yo:'100',text:'Doh, hopefuly this fancy minimalist calendar would keep you from requesting any more functionality.'},
		 {obj:'.notes',evnt:'dblclick',xo:'70%',yo:'2000',text:'There is a lot of potential here - different colors, exporting to friends, sharing via social networks, sharing screen while drawing etc...'},
		 {obj:'.notes',evnt:'click',xo:'20%',yo:'20%',text:'Try to write something in the textbox and remove the sticky.'},
		 ];//*/
		$('.tooltip').data('show', true);
		$.each(tt, function(i, v) {
			$(v.obj).one(v.evnt, function() {
				$('.tooltipWrap:visible').hide('fade', 500);
				if ($('.tooltip').data('show')) {
					var y = $(this).position().top;
					var x = $(this).position().left;
					$('.tooltipWrap').find('.message').html(v.text);
					var w = $('.tooltipWrap').width();
					var h = $('.tooltipWrap').height();
					var totalx = v.xo;
					var totaly = v.yo;
					if (v.xo.indexOf('%') < 0) {
						var xoff = (parseInt(v.xo));
						if ((xoff + w) >= $(window).width())
							totalx = $(window).width() - w;
						else
							totalx = xoff;
					}
					console.log('coords: x:' + x + ' xo:' + xoff + ' w:' + w);
					if (v.yo.indexOf('%') < 0) {
						var yoff = (parseInt(v.yo));
						if ((yoff + h) >= $(window).height())
							totaly = $(window).height() - h;
						else
							totaly = yoff;
					}
					console.log('coords: y:' + y + ' yo:' + yoff + ' h:' + h);
					console.log('prevent overflow: x:' + totalx + ' y:' + totaly);
					$('.tooltipWrap').css({
						top : totaly,
						left : totalx,
						margin : 0
					}).show('fade', 500).find('.button').hide().siblings('.close').show();
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
	$('#options').on('click',function(e){
		e.preventDefault();
		$('.optionsWrap').toggle('fade',500);
	});
	
	$('.optionsWrap .close').on('click',function(e){
		e.preventDefault();
		$('.optionsWrap').hide('fade',500);
	});
	
	$('.optionsWrap section h4').on('click',function(e){
		$(this).toggleClass('collapsed').toggleClass('expanded').next('.collapsable').slideToggle();
	});

	$('.personalflow .item').on('click', function() {
		$('.calendarWrap').show('slide', {
			direction : 'right'
		})
	});
	$('.workflow .item').on('click', function() {
		$('.mailWrap').show('slide', {
			direction : 'left'
		})
	});
	$('.mailWrap textarea').on('click', function(e) {
		e.stopPropagation();
	});

	//https://www.facebook.com/feeds/notifications.php?id=617944136&viewer=617944136&key=AWgOG2wCQbiGxCsU&format=rss20

});
