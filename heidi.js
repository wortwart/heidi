// Turn elements in web page on and off according to form input
// <input type="checkbox" data-select=".class, #id"/> will turn on <x id="id"> and all <x class="class">
// <input type="checkbox" data-select="!.class"/> will turn off all <x class="class">
// works with <input>, <textarea>, <option>, and <button>
// buttons can't have multiple selectors
// if you need more than one condition to be met for one element to show, use different selectors, eg "#id" and "el#id"
// (c) Herbert Braun 2015

'use strict';

if ($ === undefined || jQuery === undefined) {
	console.error('Please embed jQuery before using the library Heidi.');
}

var heidi = {
	deleteHiddenFields: false, // shall we delete content when it is hidden?

	hideOrShow: function(sel) {
		var fieldnames = {}, toShow = {}, toHide = {}, toReplace = {}, toDelete = [];

		// for each element in selector ...
		$(sel).each(function(i, el) {
			var
				$el = $(el),
				fieldname,
				show = false,
				clean = true;

			if (!$el.attr('data-select'))
				return;

			if ($el[0].tagName === 'OPTION') {
				// is it a select option?
				fieldname = $el.closest('select')[0].name;
				if ($el[0].selected)
					show = true;

			} else if ($el[0].tagName === 'BUTTON') {
				// or a click button?
				// (buttons don't work with multiple selectors)
				if ($el.closest('[data-value]').attr('data-value') == $el.attr('data-select')) {
					show = true;
					$el.addClass('button_active');
				} else {
					clean = false; // Never delete data on hide
					$el.removeClass('button_active');
				}

			} else if ($el[0].tagName === 'INPUT') {
				// or an input field?
				// escape fieldnames with brackets
				fieldname = $el[0].name.replace(/([\[\]])/g, '\\$1');
				if ($el[0].type == 'radio' || $el[0].type == 'checkbox') {
					if ($el[0].checked)
						show = true;
				} else if ($el[0].type == 'number') {
					if (isNaN($el[0].valueAsNumber)) { // IE bug
						if ($el[0].value)
							show = true;
					} else {
						if ($el[0].valueAsNumber > 0)
							show = true;
					}
				} else { // type text, email etc
					if ($el[0].value)
						show = true;
				}
			} else if ($el[0].tagName === 'TEXTAREA') {
				// or a textarea?
				if ($el[0].value)
					show = true;
			}

			// fieldnames are to watch for value changes
			fieldnames[fieldname] = true;
			// split selectors in data-select attribute
			var selected = $el.attr('data-select').split(/,\s*/);
			// read data-variation attribute
			var v = $el.attr('data-variation');
			if (v) v = parseInt(v);
			// add them to toShow or toHide list
			// arg1: priority
			// arg2: has data-variation
			// arg3 (only toHide): delete data from fields
			selected.forEach(function(sel) {
				var x = sel.replace(/^!/, '');
				if (x === sel) { // positive selector
					if (show)
						toShow[x] = [1, v];
					else
						toHide[x] = [1, v, clean];
				} else { // negative selector
					if (show)
						toHide[x] = [2, v, clean]; // priority
					else
						toShow[x] = [1, v];
				}
			});
		});

		// remove from toHide list if they're on toShow
		for (var el in toHide) {
			if (toShow[el]) {
				if (toHide[el][0] > toShow[el][0])
					delete toShow[el]; // negative selector wins
				else
					delete toHide[el]; // positive selector wins
			}
		}

		// show/hide elements with class (easier to handle than show/hide functions)
		$(Object.keys(toShow).join(', ')).removeClass('hidden');
		$(Object.keys(toHide).join(', ')).addClass('hidden');

		// Delete values from hidden inputs
		if (this.deleteHiddenFields) {
			for (var sel in toHide)
				if (toHide[sel][2])
					toDelete.push(sel);
			toDelete.forEach(function(el) {
				var $el = $(el);
				if ($el.is(':visible'))
					return;
				$el.find('input[type="text"], input[type="number"], textarea, select').andSelf().val('');
				$el.find('input[type="radio"]:checked, input[type="checkbox"]:checked').andSelf().each(function(i, el) {
					el.checked = false;
				});
			});
		}

		// change appearance of internal links
		$('[href^="#"]').each(function(i, el) {
			var $el = $(el);
			if ($($el.attr('href')).is(':hidden'))
				$el.addClass('greyText');
			else
				$el.removeClass('greyText');
		});

		// change appearance of buttons
		$('button[data-select]').each(function(i, el) {
			var $el = $(el);
			if ($($el.attr('data-select')).is(':hidden'))
				$el.addClass('greyText');
			else
				$el.removeClass('greyText');
		});

		// return list of fieldnames to watch for changes
		return Object.keys(fieldnames);
	}
};

// Run Heidi on load

$().ready(function() {

	var fieldnames = heidi.hideOrShow('[data-select]');

	// watch returned fieldnames for value change
	if (fieldnames.length) {
		// better: .on('input') but old IEs don't understand
		$('[name=' + fieldnames.join('], [name=') + ']').change(function() {
			heidi.hideOrShow('[data-select]');
		});
	}

	// watch data-select buttons for clicks
	$('button[data-select]').click(function(e) {
		e.preventDefault();
		var
			$el = $(e.target),
			attrVal = $el.attr('data-select');
		// set data-value of parent element
		// (similar to select value and option element)
		$el.closest('[data-value]').attr('data-value', attrVal);
		heidi.hideOrShow('[data-select]');
	});
});
