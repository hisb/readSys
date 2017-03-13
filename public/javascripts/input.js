$(function() {
	$('input.input__field').on('focus', function() {
		$(this).parent('span.input').addClass('input--filled');
	});
	$('input.input__field').on('blur', function() {
		if(! $(this).val().trim()) {
			$(this).parent('span.input').removeClass('input--filled');
		}
	});
})