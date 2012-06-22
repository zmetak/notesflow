$(function(){
	
	$('#trianglemap').hover(function(){
		$('.notes header').css('background','transparent url(img/notes_big_triangle_shadow.png) center top no-repeat');
	},function(){
		$('.notes header').css('background','transparent url(img/notes_big_triangle.png) center top no-repeat');
	});
	
	//$('#sketchboard').prop('width',);
	
	$('#sketchboard').sketch();
	
	$('#trianglemap').on('click',function(){
		var w=(document.width-$('.workflow').width()-$('.personalflow').width());
		$('#sketchboard').css({width:w});
		console.log(w);
	});
});
