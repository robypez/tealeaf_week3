/* 
Copyright 2012 DesignedByDash.com | License required for use.
*/
(function($) {
	
	var smoothieFilter = function(element, options, total) {
		
		var defaults = $.extend({}, $.fn.smoothiefilter.defaults, options);

		var $mainElement = $('#filterSection');
		var $menuElement = $('#filterSection_menu');
		var $param = 'all';
		var $active = false;
		var $faddedElems = 0;
		var $totalElems = 0;
		
		$totalElems = $mainElement.find('li.filterable').length;
		
		var filter = function() {
			
			$faddedElems = 0;
			
			$menuElement.find('ul li a').each(function(index, element) {
				
				var elem = $(this);
                if(elem.data('filter') == $param) {
					elem.addClass('active');	
				} else {
					elem.removeClass('active');
				}
            });
			
			$mainElement.find('li.filterable:visible').fadeOut(defaults.animTime, function() {
				$faddedElems++;
			
				$(this).hide().removeClass('animated hinge');
		
				if($faddedElems == $totalElems) {
					
					if($param == '') {
						$param = 'filterable';
					}
					
					applySpacingClasses($param);
					
					$mainElement.find('li.' + $param).fadeIn(defaults.animTime, function() {
						$active = false;	
					});
				}
			});
				
		}
		
		var applySpacingClasses = function(param) {
			
			var perrow = $mainElement.data('perrow');
			var firstSelector = perrow + 'n+1';
			var lastSelector = perrow + 'n+' + perrow;
			
			var activeElems = new Array();
			var inactiveElems = new Array();
			
			$mainElement.find('li.filterable').each(function(index, element) {
				var $elem = $(element);
				
                if($elem.hasClass(param)) {
					activeElems.push($elem.clone());
				} else {
					inactiveElems.push($elem.clone());
				}
            });
			
			var newFilterDiv = $(document.createElement('ul'))
			newFilterDiv.addClass('thumbnails');
			$mainElement.html('');
			
			var count = 1;
			
			for(x = 1; x <= activeElems.length; x++) {
				newFilterDiv.append(activeElems[x - 1]);
				
				if(count % perrow == 0) {
					$mainElement.append(newFilterDiv);
					newFilterDiv = undefined;
					var newFilterDiv = $(document.createElement('ul'))
					newFilterDiv.addClass('thumbnails');
				}
				
				count++;
			}
			
			for(x = 1; x <= inactiveElems.length; x++) {
				newFilterDiv.append(inactiveElems[x - 1]);
				
				if(count % perrow == 0) {
					$mainElement.append(newFilterDiv);
					newFilterDiv = undefined;
					var newFilterDiv = $(document.createElement('ul'))
					newFilterDiv.addClass('thumbnails');
				}
				
				count++;
				
			}
			
			if(newFilterDiv != undefined) {
				$mainElement.append(newFilterDiv);
			}
			
		}

		$menuElement.find('ul li a').bind({
			click: function() {
				
				$totalElems = $mainElement.find('li.filterable:visible').length;
				
				if(!$active && $(this).data('filter') != $param) {
					$param = $(this).data('filter');
					$active = true;
					filter();
				}
			}
		});
		
	}
	
	$.fn.smoothiefilter = function(options) {
		var sf = new smoothieFilter(this, options);
	}
	
	$.fn.smoothiefilter.defaults = {
		animTime: 1000	
	};
	
})(jQuery);

jQuery(document).ready(function(e) {
	
	if(jQuery('#filterSection').length == 1 && jQuery('#filterSection_menu').length == 1) {
    	jQuery(document).smoothiefilter();
	}
	
});