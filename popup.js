/*
 * Copyright (C) 2015-2016 Holly Zhou and Peter Wang. All rights reserved.
 *
 * AlphaText - Customize text for readability
 * Javascript for popup
 */

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
			clearInterval(fadingid);
		}
	}
	fadingid = setInterval(redOpac,50);
}
function fadesetup() {
	// Reset timers
	if(fadingid !== null) {
		clearInterval(fadingid);
	}
	if(fadeoutid !== null) {
		clearInterval(fadeoutid);
	}

	// Reset opacity
	statusElem.style.opacity = 1;

	// Set eventual fade out
	fadeoutid = setTimeout(fadeOut,2000);
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
			setTimeout(fadesetup,1000);
			break;
		case 'domautonoprof':
			renderstatuscol('red');
			statusElem.innerText = 'Domain saved, but profile does not exist!';
			setTimeout(fadesetup,1000);
			break;
		case 'datacorrupt':
			renderstatuscol('red');
			statusElem.innerText = 'Error: Storage data corrupted!';
			setTimeout(fadesetup,1000);
			break;
		case 'ADVoptCol':
			renderstatuscol('green');
			statusElem.innerText = 'Color optimization enabled!';
			break;
		case 'ADVremImg':
			renderstatuscol('green');
			statusElem.innerText = 'Multimedia removed!';
			break;
		default:
			renderstatuscol('');
			statusElem.innerText = String(eventtype);
			fadesetup();
			break;
	}
}

/* Check storage integrity */
function checkstorage() {
	var checkkey = '';
	var checkval = '';
	var errorcount = 0;

	// Check each item
	for (var i = 0, storelen = localStorage.length ; i < storelen ; i++) {
		checkkey = localStorage.key(i);
		checkval = localStorage.getItem(checkkey);
		if (/^profileItem[1-3]$/.test(checkkey)){
			if (!/^\d+px - [a-zA-z ]+ - \d(\.\d)?$/.test(checkval)){
				console.error('AlphaText: Storage data corrupted! (' + checkkey + ', ' + checkval + '; type: profile)');
				errorcount ++;
			}
		}
		else if (/^dom: .+$/.test(checkkey)){
			if (!/^[1-3]$/.test(checkval)){
				console.error('AlphaText: Storage data corrupted! (' + checkkey + ', ' + checkval + '; type: domain)');
				errorcount ++;
			}
		}
		else if (/^darktheme$/.test(checkkey)){
			if(!/^(on|off)$/.test(checkval)){
				console.error('AlphaText: Storage data corrupted! (' + checkkey + ', ' + checkval + '; type: dark theme)');
				errorcount ++;
			}
		}
		else if (/^visitcount$/.test(checkkey)){
			if(!/^[0-9]+$/.test(checkval)){
				console.error('AlphaText: Storage data corrupted! (' + checkkey + ', ' + checkval + '; type: visit counts)');
				errorcount ++;
			}
		}
		else{
			console.error('AlphaText: Storage data corrupted! (' + checkkey + ', ' + checkval + '; type: unknown)');
			errorcount ++;
		}
	}

	// Report via status if any errors were detected
	if (errorcount > 0) {
		renderstatus('datacorrupt');
	}
}

/* Variables to track active profile and saved state */
var activep = null;
var saved = false;

/* Save button elements */
var savebuttonele = document.getElementsByClassName("savebutton")[0];
var savebuttontext = document.getElementById("savetext");

/* Variables to track url and domain */
var taburl = null;
var tabdomain = null;

/* Check domain was saved by user, and adjust save button */
function checksave(domtocheck) {
	if(domtocheck !== null){
		if(localStorage.getItem('dom: ' + domtocheck) !== null){
			// Saved!
			savebuttontext.innerText = 'Unsave P' + localStorage.getItem('dom: ' + domtocheck).toString(10) + ' to site';
			savebuttonele.id = "unsavepage";
		}
		else{
			// Not saved yet
			if(activep !== null){
				// Save button
				savebuttontext.innerText = 'Save P' + activep + ' to site';
				savebuttonele.id = "savepage";
			}
			else{
				// No profile to save
				savebuttontext.innerText = 'Choose profile';
				savebuttonele.id = "nopsavepage";
			}
		}
	}
	else{
		// Domain not applicable
		savebuttontext.innerText = 'Can\'t save here!';
		savebuttonele.id = "cantsave";
	}
}

/* CSS profiles */
var css1 = '';
var css2 = '';
var css3 = '';

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
	var fontvalue = localStorage.getItem("profileItem" + pnum);
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
		var csstemp = "body.alphatextp p,body.alphatextp a,body.alphatextp li,body.alphatextp td{" +
			"font-size:" + fsize + " !important;}" +
			"body.alphatextp *{" +
			"font-family:" + ffamily + "," + fallbackfont(ffamily) + " !important;" +
			"line-height:" + lheight + " !important;}";

		// Save into css vars
		switch(pnum){
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
		switch(pnum){
			case 1:
				css1 = '';
				break;
			case 2:
				css2 = '';
				break;
			case 3:
				css3 = '';
				break;
			default:
				break;
		}
	}
}

/* Adapt and inject a style profile */
function adoptp(profile) {
	// Remove .alphatextq if needed
	chrome.tabs.executeScript(null,
		{code:"document.body.classList.remove('alphatextq');"});
	// Put in .alphatextp if needed
	chrome.tabs.executeScript(null,
		{code:"document.body.classList.add('alphatextp');"});

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

	// Log active profile on HTML DOM in case of next control panel launch
	chrome.tabs.executeScript(null,
		{code:"document.body.classList.remove('alphatextPtag1','alphatextPtag2','alphatextPtag3');document.body.classList.add('alphatextPtag" + profile + "');"});

	// Update domain save button
	checksave(tabdomain);

	renderstatus('adoptp');
}
// Functions for event call
function adoptp1(){adoptp(1);}
function adoptp2(){adoptp(2);}
function adoptp3(){adoptp(3);}

/* Quick Styles check set button */
function checkquick() {
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
function qsset() {
	if(document.getElementsByClassName('setbutton')[0].id === 'setstyle'){
		// Put in .alphatextq if needed
		chrome.tabs.executeScript(null,
			{code:"document.body.classList.add('alphatextq');"});

		// Get inputs
		var fsize = document.getElementById("font_size").value;
		var ffamily = document.getElementById("font_family").value;
		var lheight = document.getElementById("line_height").value;

		// Set properties if not empty
		if(fsize !== 'null'){
			chrome.tabs.insertCSS(null,{code:"body.alphatextq p,body.alphatextq a,body.alphatextq li,body.alphatextq td{font-size:" + fsize + " !important;}"});
		}
		if(ffamily !== 'null'){
			chrome.tabs.insertCSS(null,{code:"body.alphatextq *{font-family:" + ffamily + " !important;}"});
		}
		if(lheight !== 'null'){
			chrome.tabs.insertCSS(null,{code:"body.alphatextq *{line-height:" + lheight + " !important;}"});
		}
		renderstatus('quickstyleset');
	}
}

/* Switch Off */
function disableall() {
	// Remove all styles
	chrome.tabs.executeScript(null,
		{code:
			"document.body.classList.remove('alphatextp','alphatextq','alphatexta1','alphatexta2','alphatextPtag1','alphatextPtag2','alphatextPtag3');"
		});
	// Reset active profile tracker
	activep = null;
	// Update domain save button
	checksave(tabdomain);
	renderstatus('off');
}

/* Open options panel */
function openoptions() {
	chrome.runtime.openOptionsPage();
}

/* Saving domain */
function togglesave() {
	if(savebuttonele.id !== 'nopsavepage'){
		// Only work if there is a profile
		if(tabdomain !== null){
			if(!saved){
				// Save!
				var ptosave = String(activep);
				localStorage.setItem('dom: ' + tabdomain, ptosave);
				saved = true;

				// Update domain save button
				checksave(tabdomain);

				renderstatus('save');
			}
			else{
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
	// Check and adjust button
	checksave(domtocheck);

	// Notify adopted profile if saved
	if(domtocheck !== null && localStorage.getItem('dom: ' + tabdomain) !== null){
		saved = true;
		if(localStorage.getItem('profileItem' + localStorage.getItem('dom: ' + tabdomain)) !== null) {
			// Adopted saved profile
			renderstatus('saveautop');
		}
		else
		{
			// Domain saved to use a profile but it no longer exists
			renderstatus('domautonoprof');
		}
	}
}

// Grab domain, check save and adjust save button
function domCheck() {
	// Grab the domain of the tab's url
	chrome.tabs.query({'active':true,'currentWindow':true},function(tab){
		// Getting URL
		taburl = tab[0].url;
		// End of domain
		var end = taburl.indexOf('/',8);
		// Find start
		var start = null;
		if(taburl.indexOf('http://') === 0){
			// HTTP
			start = 7;
		}
		else if(taburl.indexOf('https://') === 0){
			// HTTPS
			start = 8;
		}
		else{
			// Not HTTP or HTTPS
			tabdomain = null;
			checksave(null);
			return;
		}
		// In case the ending / cannot be found
		if(end !== -1){
			tabdomain = taburl.substring(start,end);
		}
		else{
			tabdomain = taburl.substring(start);
		}

		if(tabdomain){
		// Check if a profile has been auto adopted
		chrome.tabs.executeScript(null,{code:
			"var outp = null;" +
			"for(var p = 1; p < 4 ; p++){" +
			"if(document.body.classList.contains('alphatextPtag'+String(p))){" +
			"outp = p;break;}};outp;"},
			function(outpres){
				if(outpres === undefined){
					// Script not allowed on website
					tabdomain = null;
					checksave(null);
					return;
				}
				else if(outpres[0] !== null){
					// Confirmed
					activep = outpres[0];
					saved = true;
				}
				// Check and adjust save button
				checksaveadopt(tabdomain);
			});
		}
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
			profileList += "<div class='mid profilesbuttons' id='" + profkey + "' value='" + localStorage.getItem(profkey) + "'>" +
				"<div class='contents profcontents'>" +
					"<p class='profnum'>" + profnum.toString(10) + "</p>" +
					"<p class='minitext'>" + localStorage.getItem(profkey) + "</p>" +
				"</div></div>";
		}
		else{
			// Empty block
			profileList += "<div class='mid' id='profileempty'><div class='contents profcontents'><p class='profnum'>" + profnum.toString(10) + "</p></div></div>";
		}
	}

	// Load HTML
	document.getElementById("profilecol").innerHTML = "<div class='sectionhead' id='profhead'><p>Profiles</p></div>" + profileList;
}

/* Check and initiate dark theme */
function darkthemeCheck() {
	if(localStorage.getItem('darktheme') == 'on'){
		document.body.classList.add('darktheme');
	}
}

/** Advanced functions **/
// /* Show advanced buttons*/
// function showAdvancedFeatures() {
// 	if(document.getElementById("advtable").classList.contains('hiddenadv')){
// 		// Extend!
// 		document.getElementById("advtable").classList.remove('hiddenadv');
// 		document.querySelector("table").classList.add('extended');
// 		document.documentElement.classList.add('extended');
// 		document.body.classList.add('extended');
// 		document.getElementById("menubutton").classList.add('flipped');
// 	}
// 	else{
// 		// Shrink!
// 		document.getElementById("advtable").classList.add('hiddenadv');
// 		document.querySelector("table").classList.remove('extended');
// 		document.documentElement.classList.remove('extended');
// 		document.body.classList.remove('extended');
// 		document.getElementById("menubutton").classList.remove('flipped');
// 	}
// }

/* Optimize colors */
/* Color-CSS translator */
var colTrans={
	"black":"#000",
	"darkgrey":"#303030",
	"grey":"#909090",
	"offwhite":"#F8F8F8",
	"white":"#FFF",
	"beige":"#F8F5DD",
	"brown":"#4D2B0D"
};
var optColBG="";
var optColTC="";
var optColcss ="";
function optCol() {
	// Get values and build CSS
	optColBG=document.getElementById("optBG").value.toString();
	optColTC=document.getElementById("optTC").value.toString();
	optColcss = "body.alphatexta1 *{background:" + colTrans[optColBG] + " !important;color:" + colTrans[optColTC] + " !important;text-shadow:none !important;border-color:transparent !important;box-shadow:none !important}body.alphatexta1 a{text-decoration:underline !important;}";

	// Put in .alphatexta1 if necessary
	chrome.tabs.executeScript(null,
		{code:"document.body.classList.add('alphatexta1');"});

	// Insert CSS
	chrome.tabs.insertCSS(null,{code:optColcss});
	renderstatus('ADVoptCol');
}

/* Reduce clutter by removing media */
var remImgcss = "body.alphatexta2 img,body.alphatexta2 iframe,body.alphatexta2 svg,body.alphatexta2 object,body.alphatexta2 i{display:none !important;}body.alphatexta2 *{background-image:none !important;";
function remImg() {
	// Put in .alphatexta2 if necessary
	chrome.tabs.executeScript(null,
		{code:"document.body.classList.add('alphatexta2');"});

	// Insert CSS
	chrome.tabs.insertCSS(null,{code:remImgcss});
	renderstatus('ADVremImg');
}

/** Review popup **/
var visitc = null;

/* Popup buttons */
function revClose() {
	document.getElementById('popup').classList.remove('showpopup');
}
function revStop() {
	localStorage.setItem("visitcount","999");
	revClose();
}
function revLater() {
	localStorage.setItem("visitcount","10");
	revClose();
}

/* Initiate popup */
function showpopup() {
	// Show popup
	document.getElementById('popup').classList.add('showpopup');
	// Set event listeners for buttons;
	document.querySelector("#revSure").addEventListener('click',revStop);
	document.querySelector("#revNever").addEventListener('click',revStop);
	document.querySelector("#revLater").addEventListener('click',revLater);
}
function reviewpopupini() {
	setTimeout(showpopup,200);
}

/* Check count and initiate popup if appropriate */
function reviewpopup() {
	// Get count as string
	visitc = localStorage.getItem("visitcount");
	if (visitc === null) {
		// First visit
		localStorage.setItem("visitcount","0");
	}
	else if (visitc == '20'){
		// Count reached
		reviewpopupini();
	}
	else if (visitc == '999'){
		// Done or declined
		return;
	}
	else{
		// Increment
		var visitcnew = parseInt(visitc,10);
		visitcnew ++;
		localStorage.setItem("visitcount",String(visitcnew));
	}
}

/* Load at beginning */
document.addEventListener('DOMContentLoaded', function() {
	// Log start in console
	console.log('AlphaText started.');
	// Check storage
	checkstorage();
	// Check url and save
	domCheck();

	// Options
	document.querySelector("#options").addEventListener('click',openoptions);
	// Off
	document.querySelector("#off").addEventListener('click',disableall);
	// Save domain
	savebuttonele.addEventListener('click',togglesave);

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

	/// Advanced features
	// Color optimization
	document.querySelector("#optcol").addEventListener('click',optCol);
	// Image removal
	document.querySelector("#remimg").addEventListener('click',remImg);

	// Trigger dark theme if set
	darkthemeCheck();
	// Set review popup
	reviewpopup();
});
