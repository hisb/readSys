$(function(){
	// $('article .infor').css({ 'height' : $('article').height() - 2/*, 'bottom' : 2 - $('article').height()*/});
	$('article').each(function(index, item) {
		$(item).find('.infor').css({'height' : $(item).find('figure').height(), 'width' : $(item).find('figure').width()});
	});
	$('article .divContainer').hover(function() {
		$(this).find('div.infor').slideDown();
	},function() {
		$(this).find('div.infor').slideUp();
	});
});
