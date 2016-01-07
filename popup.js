/*
 * Copyright (C) 2015-2016 Holly Zhou and Peter Wang. All rights reserved.
 *
 * AlphaText - Customize text for readability
 * Javascript for popup
 */

/* Variables to track active profile and saved state */
var activep = null;
var saved = false;

/* Save button elements */
var savebuttonele = document.getElementsByClassName("savebutton")[0];
var savebuttontext = document.getElementById("savetext");

/* Variables to track url and domain */
var taburl = null;
var tabdomain = null;

/* Render status text */
var fadingid = null;
var fadeoutid = null;
var opac = 1;
var statusElem = document.getElementById('status');
function fadeOut() {
	// Reduce opacity every time interval
	opac = 1;
	function redOpac() {
		opac -= 0.1;
		statusElem.style.opacity = opac;

		// Disappear finally
		if(opac <= 0) {
			statusElem.innerText = '';
			window.clearInterval(fadingid);
		}
	}

	fadingid = window.setInterval(redOpac,50);
}
function fadesetup() {
	// Reset timers
	if(fadingid !== null) {
		window.clearInterval(fadingid);
	}
	if(fadeoutid !== null) {
		window.clearInterval(fadeoutid);
	}
	
	// Reset opacity
	statusElem.style.opacity = 1;

	// Set eventual fade out
	fadeoutid = window.setTimeout(fadeOut,2000);
}
function renderstatuscol(color) {
	switch(color){
		case 'red':
			statusElem.className = 'statusred';
			break;
		case 'yellow':
			statusElem.className = 'statusyellow';
			break;
		case 'green':
			statusElem.className = 'statusgreen';
			break;
		default:
			statusElem.className = '';
			break;
	}
}
function renderstatus(eventtype) {
	switch(eventtype){
		case 'quickstyleset':
			renderstatuscol('green');
			statusElem.innerText = 'Quick style set successfully!';
			fadesetup();
			break;
		case 'adoptp':
			renderstatuscol('green');
			statusElem.innerText = 'Profile ' + activep + ' activated!';
			fadesetup();
			break;
		case 'off':
			renderstatuscol('yellow');
			statusElem.innerText = 'All styles removed.';
			fadesetup();
			break;
		case 'save':
			renderstatuscol('green');
			statusElem.innerText = 'Domain saved to always use Profile ' + activep + ' by default.';
			fadesetup();
			break;
		case 'unsave':
			renderstatuscol('yellow');
			statusElem.innerText = 'Domain save removed.';
			fadesetup();
			break;
		case 'saveautop':
			renderstatuscol('green');
			statusElem.innerText = 'Profile ' + activep + ' activated automatically on this domain!';
			fadesetup();
			break;
		case 'domautonoprof':
			renderstatuscol('red');
			statusElem.innerText = 'Domain saved, but profile does not exist!';
			fadesetup();
			break;
		case 'error':
			console.log('AlphaText Error!');
			renderstatuscol('red');
			statusElem.innerText = 'Error!';
			fadesetup();
			break;
		default:
			renderstatuscol('');
			statusElem.innerText = String(eventtype);
			fadesetup();
			break;
	}
}

/* Check domain was saved by user, and adjust save button */
function checksave(domtocheck) {
	if(domtocheck !== null)
	{
		if(localStorage.getItem('dom: ' + domtocheck) !== null)
		{
			// Saved!
			savebuttontext.innerText = 'Don\'t use Profile ' + localStorage.getItem('dom: ' + domtocheck).toString(10) + ' on domain';
			savebuttonele.id = "unsavepage";
		}
		else
		{
			// Not saved yet
			if(activep !== null){
				// Save button
				savebuttontext.innerText = 'Always use profile ' + activep + ' on domain';
				savebuttonele.id = "savepage";
			}
			else{
				// No profile to save...
				savebuttontext.innerText = 'Choose a profile first to save to domain.';
				savebuttonele.id = "nopsavepage";
			}
		}
	}
	else
	{
		// Domain not applicable
		savebuttontext.innerText = 'Cannot save on domain';
		savebuttonele.id = "cantsave";
	}
}

/* CSS profiles */
var css1 = "";
var css2 = "";
var css3 = "";

/* Prepare fallback fonts for CSS */
function fallbackfont(font) {
	if(font === 'Cambria' || font === 'Garamond' || font === 'Georgia' || font === 'Times New Roman'){
		return 'serif';
	}
	else{
		return 'sans-serif';
	}
}

/* Make CSS */
function makeCSS(pnum) {
	// Get saved info
	var eleId = "profileItem" + pnum;
	var fontvalue = localStorage.getItem(eleId);
	var values = "";
	var fsize = "";
	var ffamily = "";
	var lheight = "";

	if (fontvalue !== null){
		values = fontvalue.split(" - ");
		fsize = values[0];
		ffamily = values[1];
		lheight = values[2];

		// Generate CSS string
		var csstemp = "body.alphatextcustomp p,body.alphatextcustomp a,body.alphatextcustomp li,body.alphatextcustomp td{" +
			"font-size:" + fsize + " !important;}" +
			"body.alphatextcustomp *{" +
			"font-family:" + ffamily + "," + fallbackfont(ffamily) + " !important;" +
			"line-height:" + lheight + " !important;}";

		// Save into css vars
		switch(pnum)
		{
			case 1:
				css1 = csstemp;
				break;
			case 2:
				css2 = csstemp;
				break;
			case 3:
				css3 = csstemp;
				break;
			default:
				break;
		}
	}
	else{
		// Not present or valid style set profile
		switch(pnum)
		{
			case 1:
				css1 = "";
				break;
			case 2:
				css2 = "";
				break;
			case 3:
				css3 = "";
				break;
			default:
				break;
		}
	}
}

/* Adapt and inject a style profile */
function adoptp(profile) {
	// Remove .alphatextcustomq if needed
	chrome.tabs.executeScript(null,
		{code:"document.body.classList.remove('alphatextcustomq');"});
	// Put in .alphatextcustomp if needed
	chrome.tabs.executeScript(null,
		{code:"document.body.classList.add('alphatextcustomp');"});

	// Insert CSS profile
	switch(profile){
		case 1:
			makeCSS(1);
			chrome.tabs.insertCSS(null,{code:css1});
			break;
		case 2:
			makeCSS(2);
			chrome.tabs.insertCSS(null,{code:css2});
			break;
		case 3:
			makeCSS(3);
			chrome.tabs.insertCSS(null,{code:css3});
			break;
		default:
			return;
	}
	activep = profile;

	// Update domain save button
	checksave(tabdomain);

	renderstatus('adoptp');
}
// Functions for event call
function adoptp1(e){adoptp(1);}
function adoptp2(e){adoptp(2);}
function adoptp3(e){adoptp(3);}

/* Quick Styles check set button */
function checkquick(e) {
	var buttonset = document.getElementsByClassName('setbutton')[0];
	if(document.getElementById("font_size").value === 'null' && document.getElementById("font_family").value === 'null' && document.getElementById("line_height").value === 'null'){
		// Inactivate if not empty
		if(buttonset.id !== 'setnull'){
			buttonset.id = 'setnull';
		}
	}
	else{
		// Activate button
		if(buttonset.id !== 'setstyle'){
			buttonset.id = 'setstyle';
		}
	}
}

/* Quick Styles Set*/
function qsset(e) {
	if(document.getElementsByClassName('setbutton')[0].id === 'setstyle'){
		// Put in .alphatextcustomq if needed
		chrome.tabs.executeScript(null,
			{code:"document.body.classList.add('alphatextcustomq');"});

		// Get inputs
		var fsize = document.getElementById("font_size").value;
		var ffamily = document.getElementById("font_family").value;
		var lheight = document.getElementById("line_height").value;
		
		// Set properties if not empty
		if(fsize !== 'null'){
			chrome.tabs.insertCSS(null,{code:"body.alphatextcustomq p,body.alphatextcustomq a,body.alphatextcustomq li,body.alphatextcustomq td{font-size:" + fsize + " !important;}"});
		}
		if(ffamily !== 'null'){
			chrome.tabs.insertCSS(null,{code:"body.alphatextcustomq *{font-family:" + ffamily + " !important;}"});
		}
		if(lheight !== 'null'){
			chrome.tabs.insertCSS(null,{code:"body.alphatextcustomq *{line-height:" + lheight + " !important;}"});
		}
		renderstatus('quickstyleset');
	}
}

/* Switch Off */
function toggle(e) {
	// Remove all styles
	chrome.tabs.executeScript(null,
		{code:
			"document.body.classList.remove('alphatextcustomp');" +
			"document.body.classList.remove('alphatextcustomq');"
		});

	// Reset active profile tracker
	activep = null;
	
	// Update domain save button
	checksave(tabdomain);

	renderstatus('off');
}

/* Open options panel */
function openoptions(e) {
	chrome.runtime.openOptionsPage();
}

/* Saving domain*/
function togglesave(e) {
	if(savebuttonele.id !== 'nopsavepage')
	{
		// Only work if there is a profile
		if(tabdomain !== null)
		{
			if(saved === false)
			{
				// Save!
				var ptosave = activep;
				localStorage.setItem('dom: ' + tabdomain,ptosave);
				saved = true;

				// Update domain save button
				savebuttontext.innerText = 'Don\'t use Profile ' + localStorage.getItem('dom: ' + tabdomain).toString(10) + ' on domain';
				savebuttonele.id = "unsavepage";

				renderstatus('save');
			}
			else
			{
				// Unsave!
				localStorage.removeItem('dom: ' + tabdomain);
				saved = false;
				
				// Update domain save button
				checksave(tabdomain);

				renderstatus('unsave');
			}
		}
	}
}

/* Check if the domain was saved by user, adopt profile if so, and load necessary code */
function checksaveadopt(domtocheck) {
	// Check and adust button
	checksave(domtocheck);
	
	// Adopt profile if saved
	if(domtocheck !== null && localStorage.getItem('dom: ' + tabdomain) !== null){
		saved = true;
		var savedp = null;
		if(localStorage.getItem('profileItem' + localStorage.getItem('dom: ' + tabdomain)) !== null) {
			//  Adopt saved profile
			savedp = parseInt(localStorage.getItem('dom: ' + tabdomain),10);
			adoptp(savedp);
			renderstatus('saveautop');
		}
		else
		{
			// Domain saved to use a profile but it no longer exists
			renderstatus('domautonoprof');
		}
	}
}

/* Get url and domain of website, and see if it was saved */
function checkurldomain() {
	chrome.tabs.query({'active':true,'currentWindow':true},function(tab){

		// Getting URL
		taburl = tab[0].url;

		// End of domain
		var end = taburl.indexOf('/',8); 

		// Find start
		var start = null;
		if(taburl.indexOf('http://') === 0)
		{
			// HTTP
			start = 7;
		}
		else if(taburl.indexOf('https://') === 0)
		{
			// HTTPS
			start = 8;
		}
		else
		{
			// Not HTTP or HTTPS
			tabdomain = null;
			checksave(tabdomain);
			return;
		}
		
		// In case the ending / cannot be found
		if(end !== -1)
		{
			tabdomain = taburl.substring(start,end);
		}
		else
		{
			tabdomain = taburl.substring(start);
		}

		// Check if saved
		checksaveadopt(tabdomain);
	});
}

/* Profiles Management */
// loading and reloading profile items
function loadProfiles() {
	var profileList = '';
	var profkeyprefix = 'profileItem';
	var profkey = '';

	// Go through the three possible profiles
	for(var profnum = 1; profnum <= 3; profnum++){
		// Make key
		profkey = profkeyprefix + profnum.toString(10);
		
		// Generate HTML profile buttons
		if(localStorage.getItem(profkey) !== null){
			// Profile block
			profileList += "<div class='mid profilesbuttons' id='" + profkey + "' value='" + localStorage.getItem(profkey) + "'><div class='contents profcontents'>" +
				"<img src='"+chrome.extension.getURL('images/profile.png')+"' class='profim'/>" +
				"<p class='profnum'>Profile " + profnum.toString(10) + "</p>" +
				"<p class='minitext'>" + localStorage.getItem(profkey) + "</p>" +
				"</div></div>";
		}
		else{
			// Empty block
			profileList += "<div class='mid' id='profileempty'><div class='contents'><p>No Profile " + profnum.toString(10) + "</p></div></div>";
		}
	}

	// Load HTML
	document.getElementById("profilecol").innerHTML = "<div class='sectionhead' id='profhead'><p>Profiles</p></div>" + profileList;
}

/* Check and initiate dark theme */
function darkthemeCheck() {
	if(localStorage.getItem('darktheme') === 'on'){
		document.body.classList.add('darktheme');
	}
}

/* Load at beginning */
document.addEventListener('DOMContentLoaded',function() {
	// Log start in console
	console.log('AlphaText started.');

	// Save current url and domain
	checkurldomain();

	// Options
	document.querySelector("#options").addEventListener('click',openoptions);

	// Off toggle
	document.querySelector("#off").addEventListener('click',toggle);

	// Save domain
	if(document.querySelector("#savepage,#unsavepage") !== null) {
		document.querySelector("#savepage,#unsavepage").addEventListener('click',togglesave);
	}

	// Load profile buttons
	loadProfiles();
	
	// Profiles
	if(document.querySelector("#profileItem1") !== null) {
		document.querySelector("#profileItem1").addEventListener('click',adoptp1); // 1
	}
	if(document.querySelector("#profileItem2") !== null) {
		document.querySelector("#profileItem2").addEventListener('click',adoptp2); // 2
	}
	if(document.querySelector("#profileItem3") !== null) {
		document.querySelector("#profileItem3").addEventListener('click',adoptp3); // 3
	}

	// Quick Style Set
	document.getElementsByClassName('setbutton')[0].addEventListener('click',qsset);
	checkquick(null);

	// Set button activation listener
	var selectoptions = document.querySelectorAll('select#font_size,select#font_family,select#line_height');
	for(var i = 0, len = selectoptions.length; i < len ; i++){
		selectoptions[i].addEventListener('change',checkquick);
	}

	// Trigger dark theme if set
	darkthemeCheck();
});