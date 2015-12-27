/*
 * Copyright (C) 2015 Holly Zhou and Peter Wang. All rights reserved.
 *
 * AlphaText--Extension for online text readability
 * Javascript for popup
 */

/* Variables to track active profile and saved state */
var activep = null;
var saved = false;

/* Render status text */
function renderstatuscol(color) {
	switch(color){
		case 'red':
			document.getElementById('status').className = 'statusred';
			break;
		case 'yellow':
			document.getElementById('status').className = 'statusyellow';
			break;
		case 'green':
			document.getElementById('status').className = 'statusgreen';
			break;
		default:
			document.getElementById('status').className = '';
			break;
	}
}
function renderstatus(eventtype) {
	switch(eventtype){
		case 'off':
			renderstatuscol('yellow');
			document.getElementById("status").innerText = 'All styles removed.';
			break;
		case 'adoptp':
			renderstatuscol('green');
			document.getElementById("status").innerText = 'Profile ' + activep + ' activated!';
			break;
		case 'error':
			renderstatuscol('red');
			document.getElementById("status").innerText = 'Error!';
			break;
		case 'save':
			renderstatuscol('green');
			document.getElementById("status").innerText = 'Domain saved to always use Profile ' + activep + ' by default.';
			break;
		case 'unsave':
			renderstatuscol('yellow');
			document.getElementById("status").innerText = 'Domain save removed.';
			break;
		case 'quickstyleset':
			renderstatuscol('green');
			document.getElementById("status").innerText = 'Quick style set successfully!';
			break;
		case 'emptyquickstyleset':
			renderstatuscol('red');
			document.getElementById("status").innerText = 'Choose some styles to apply!';
			break;
		case 'saveautop':
			renderstatuscol('green');
			document.getElementById("status").innerText = 'Profile ' + activep + ' activated automatically on this domain!';
			break;
		case 'domautonoprof':
			renderstatuscol('red');
			document.getElementById("status").innerText = 'Domain saved, but profile does not exist!';
			break;
		case 'noproftosave':
			renderstatuscol('red');
			document.getElementById("status").innerText = 'Choose a profile first.';
			break;
		default:
			renderstatuscol('');
			document.getElementById("status").innerText = String(eventtype);
			break;
	}
}

/* CSS profiles */
var css1 = "";
var css2 = "";
var css3 = "";

/* Prepare fallback fonts for CSS */
function fallbackfont(font) {
	if(font === 'Cambria' || font === 'Garamond' || font === 'Georgia' || font === 'Lucida Grande' || font === 'Times New Roman'){
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

	if (fontvalue!==null){
		values = fontvalue.split(" - ");
		fsize = values[0];
		ffamily = values[1];
		lheight = values[2];

		// Generate CSS string
		var csstemp = "body.alphatextcustomp p,body.alphatextcustomp a,body.alphatextcustomp li{" +
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
	chrome.tabs.executeScript(null,{code:"document.body.classList.remove('alphatextcustomq');"});
	// Put in .alphatextcustomp if needed
	chrome.tabs.executeScript(null,{code:"document.body.classList.add('alphatextcustomp');"});

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
	renderstatus('adoptp');
}
// Functions for event call
function adoptp1(e){adoptp(1);}
function adoptp2(e){adoptp(2);}
function adoptp3(e){adoptp(3);}

/* Quick Styles */
function qsset(e) {

	// Put in .alphatextcustomq if needed
	chrome.tabs.executeScript(null,
		{code:"document.body.classList.add('alphatextcustomq');"});

	// Get inputs
	var fsize = document.getElementById("font_size").value;
	var ffamily = document.getElementById("font_family").value;
	var lheight = document.getElementById("line_height").value;
	
	// Set properties if not empty
	if(fsize === "null" && ffamily === "null" && lheight === "null"){
		renderstatus('emptyquickstyleset');
	}
	else{
		if(fsize !== "null"){
			chrome.tabs.insertCSS(null,{code:"body.alphatextcustomq p,body.alphatextcustomq a,body.alphatextcustomq li{font-size:"+fsize+" !important;}"});
		}
		if(ffamily !== "null"){
			chrome.tabs.insertCSS(null,{code:"body.alphatextcustomq *{font-family:"+ffamily+" !important;}"});
		}
		if(lheight !== "null"){
			chrome.tabs.insertCSS(null,{code:"body.alphatextcustomq *{line-height:"+lheight+" !important;}"});
		}
		renderstatus('quickstyleset');
	}
}

/* Toggle Off */
function toggle(e) {
	// Remove all styles
	chrome.tabs.executeScript(null,
		{code:
			"document.body.classList.remove('alphatextcustomp');" +
			"document.body.classList.remove('alphatextcustomq');"
		});
	renderstatus('off');
}

/* Open options panel */
function openoptions(e) {
	chrome.runtime.openOptionsPage();
}

/* Variables to track url and domain */
var taburl = null;
var tabdomain = null;

/* Saving domain*/
function togglesave(domtosave) {
	if(domtosave !== null)
	{
		if(saved === false)
		{
			// Save!
			if(activep !== null) {
				var ptosave = activep;
				localStorage.setItem('dom: ' + tabdomain,ptosave);
				saved = true;
				document.getElementById("savetext").innerText = 'Don\'t use on domain';
				document.getElementById("savepage").id = "unsavepage";
				renderstatus('save');
			}
			else{
				// But no profile to save with...
				renderstatus('noproftosave');
			}
		}
		else
		{
			// Unsave!
			localStorage.removeItem('dom: ' + tabdomain);
			saved = false;
			document.getElementById("savetext").innerText = 'Always use profile on domain';
			document.getElementById("unsavepage").id = "savepage";
			renderstatus('unsave');
		}
	}
}
// Function for event call
function savee(e){togglesave(tabdomain);}

/* Check if the domain was saved by user, and load necessary code */
function checksave(domtocheck) {
	if(domtocheck !== null)
	{
		if(localStorage.getItem('dom: ' + tabdomain) !== null)
		{
			// Saved!
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
			// Adjust state and button
			saved = true;
			document.getElementById("savetext").innerText = 'Don\'t use on domain';
			document.getElementById("savepage").id = "unsavepage";
		}
		else
		{
			// Not saved yet
			document.getElementById("savetext").innerText = 'Always use profile on domain';
		}
	}
	else
	{
		// Domain not applicable
		document.getElementById("savetext").innerText = 'Cannot save on domain';
		document.getElementById("savepage").id = "cantsave";
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
		if(taburl.indexOf("http://") === 0)
		{
			// HTTP
			start = 7;
		}
		else if(taburl.indexOf("https://") === 0)
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
		checksave(tabdomain);;
	});
}

/* Profiles Management */
var count = 0; // to record the number of profiles saved
var maxNum = 3; // maximum number of profiles saved

// loading and reloading profile items
function loadProfiles() {
  var profileList = "";
  var profkeyprefix = "profileItem";
  var storageLen = localStorage.length;
  var profileId = "";
  var profv = "";
  var emptyProf = "";

  // Generate HTML profile buttons
  for(var keyi = 0; keyi < storageLen; keyi++)
  {
		if(localStorage.key(keyi).substring(0,11) === profkeyprefix)
		{
		profileId = localStorage.key(keyi);
		profv = localStorage.getItem(localStorage.key(keyi));
		profileList += "<div class='mid' id='" + profileId + "' value='" + localStorage.getItem(profileId) + "'><div class='contents profcontents'>" +
			"<img src='"+chrome.extension.getURL('images/profile.png')+"' class='profim'/>" +
			"<p class='profnum'>Profile " + localStorage.key(keyi).substring(11) + "</p>" +
			"<p class='minitext'>" + localStorage.getItem(profileId) + "</p>" +
			"</div></div>";
		count++;
		}
  }

  // Generate empty profile blanks
  for(var i = 0; i < maxNum - count; i++){
		emptyProf += "<div class='mid' id='profileempty'><div class='contents'><p>No Profile</p></div></div>";
  }

  // Load HTML
  document.getElementById("profilecol").innerHTML = "<div class='sectionhead' id='profhead'><p>Profiles</p></div>" + profileList + emptyProf;
}

/* Load at beginning */
document.addEventListener('DOMContentLoaded',function() {

	// Save current url and domain
	checkurldomain();

	// Options
	document.querySelector("#options").addEventListener('click',openoptions);

	// Off toggle
	document.querySelector("#off").addEventListener('click',toggle);

	// Save domain
	if(document.querySelector("#savepage,#unsavepage") !== null) {
		document.querySelector("#savepage,#unsavepage").addEventListener('click',savee);
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
	document.querySelector('#setstyle').addEventListener('click',qsset);
});
