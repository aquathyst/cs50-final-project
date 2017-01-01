/*
 * Copyright (C) 2015-2016 Holly Zhou and Peter Wang. All rights reserved.
 *
 * AlphaText - Customize text for readability
 * Javascript for info pages
 */

/* Check and initiate dark theme */
function darkthemeCheck() {
	if(localStorage.getItem('darktheme') === 'on'){
		document.body.classList.add('darktheme');
	}
}

/* Load at beginning */
document.addEventListener('DOMContentLoaded',function() {
	// Trigger dark theme if set
	darkthemeCheck();
});
