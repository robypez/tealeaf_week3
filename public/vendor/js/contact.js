/* 
Copyright 2012 DesignedByDash.com | License required for use.
*/
(function($) {
	
	var dbdContact = function(element, options, total) {
		
		var defaults = $.extend({}, $.fn.dbdcontact.defaults, options);

		var $mainElement = $(element);
		var $formData = {};
		
		var validate = function() {
			
			var error = false;
			
			$mainElement.find('input[type="text"], input[type="email"], textarea').each(function(index, element) {
				
                var elem = $(this);
				var name = elem.attr('name');
				var val = elem.val();
				
				$formData[name] = val;
				
				if((elem.hasClass('required') && val == '') || (val == elem.attr('placeholder'))) {
					setError(elem, 'This field is required.');
					error = true;
				}
				
				if(elem.attr('type') == 'email') {
					if(val.search('@') == -1) {
						setError(elem, 'Please provide a valid email address.');	
						error = true;
					}
				}
				
            });
			
			if(error) {
				return false;	
			} else {
				return true;
			}
			
		}
		
		var setError = function(elem, msg) {
			elem.siblings('.help-inline').html(msg);
			elem.parent().parent().addClass('error');
		}
		
		var resetForm = function() {
			$mainElement.find('.control-group').removeClass('error');
			$mainElement.find('.help-inline').html('');
			$('#dbdContactResponse').hide();
		}
		
		var send = function() {
			
			$.ajax({
				url: '_assets/ajax/contact.php',
				data: 'formData=' + JSON.stringify($formData),
				type: "POST",
			  	success: function(response) {
					if(response) {
						$mainElement.fadeOut(1000, function() {
							$('#dbdContactResponse').addClass('alert-success').html('Thank you. Your message has been sent.').fadeIn(1000);
						});
					} else {
						$('#dbdContactResponse').addClass('alert-error').html('There was an error sending your message, please try again.').fadeIn(1000);
					}
			  	}
			});	
		}
		
		$mainElement.bind({
			submit: function() {
				resetForm();
				if(!validate()) {
					return false;	
				}
				
				send();
				
				return false;
			}
		});
		
		
	}
	
	$.fn.dbdcontact = function(options) {
		var sc = new dbdContact(this, options);
	}
	
})(jQuery);

$(document).ready(function(e) {
    $('.dbdContact').dbdcontact();
});