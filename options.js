/*
 * Copyright (C) 2015-2016 Holly Zhou and Peter Wang. All rights reserved.
 *
 * AlphaText - Customize text for readability
 * Javascript for options
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
		case 'padd':
			renderstatuscol('green');
			statusElem.innerText = 'Profile saved';
			fadesetup();
			break;
		case 'prem':
			renderstatuscol('yellow');
			statusElem.innerText = 'Profile removed';
			fadesetup();
			break;
		case 'psamep':
			renderstatuscol('red');
			statusElem.innerText = 'Same profile exists';
			fadesetup();
			break;
		case 'pmorethan3':
			renderstatuscol('red');
			statusElem.innerText = 'You can only add 3 profiles';
			fadesetup();
			break;
		case 'pnostorage':
			renderstatuscol('red');
			statusElem.innerText = 'Sorry! Your browser does not support local storage.';
			fadesetup();
			break;
		case 'deletedom':
			renderstatuscol('yellow');
			statusElem.innerText = 'Domain removed.';
			fadesetup();
			break;
		case 'darkgoon':
			renderstatuscol('green');
			statusElem.innerText = 'Dark theme on!';
			fadesetup();
			break;
		case 'darkgooff':
			renderstatuscol('green');
			statusElem.innerText = 'Dark theme off!';
			fadesetup();
			break;
		default:
			renderstatuscol('');
			statusElem.innerText = String(eventtype);
			fadesetup();
			break;
	}
}

/** Profile Management **/
var maxNum = 3; // maximum number of profiles saved

/* Add profile delete button listeners */
function removeProfileListener() {
	var deles = document.querySelectorAll("#profilecol2 .delwrapper");
	for (var i = 0, len = deles.length; i < len; i++) {
		deles[i].addEventListener('click', deletep);
	}
}

// loading and reloading profile items
function loadProfiles() {
	var profileList = '';
	var profkeyprefix = 'profileItem';
	var profkey = '';
	var profv = '';
	var profvarray = ['','',''];
	var sectionheadhtml = '<div class="subhead" id="savedprofileshead"><div class="contents"><p>Saved profiles</p></div></div>';

	// Go through the three possible profiles
	for(var profnum = 1; profnum <= 3; profnum++){
		// Make key
		profkey = profkeyprefix + profnum.toString(10);
		
		// Generate HTML profile buttons
		if(localStorage.getItem(profkey) !== null){
			profv = localStorage.getItem(profkey);
			profvarray = profv.split(" - ");
			profileList += '<div class="deldiv"><div class="contentsAlt">' +
				'<div id="' + profkey + '_delete" class="delwrapper"><img class="delbutton" title="Delete" src="images/delete_n.png" alt="del" id="' + profkey + '_delalt"/></div>' +
				'<div class="profiledetails">' +
				'<b>Profile ' + profnum + '</b>' +
				'<br/><em>Font Size</em>: ' + profvarray[0] +
				'<br/><em>Font Style</em>: ' + profvarray[1] +
				'<br/><em>Line Height</em>: ' + profvarray[2] + 
				'</div></div></div>';
		}
		else{
			profileList += '<div class="deldivnull placeholder"><div class="contentsAlt"><div class="profiledetails">' +
				'<b>No Profile ' + profnum +
				'</b></div></div></div>';
		}
	}

	// Load HTML
	document.getElementById("profilecol2").innerHTML = sectionheadhtml + profileList;

	// Add listener
	removeProfileListener();
}

/* to check if a set of styles already exists; if it exists then return true; else return false */
// fs = font size; ff = font family; lh = line height
function profileExists(fs, ff, lh) {
	for (var i = 1; i <= maxNum; i++) {
		var profileId = "profileItem" + i;
		var profileValue = fs + " - " + ff + " - " + lh;
		if (localStorage.getItem(profileId) === profileValue) 
		{  
			// Present
			return true;
		}
	}
	// Absent
	return false;
}

/* Figure out what is the next profile number to be saved to */
function nextNum() {
	for (var i = 1; i < 4; i++) {
    	if (localStorage.getItem('profileItem' + i) === null)
    		return i;
  	}
  	return 'MAX';
}

/* click event to add profile */
function clickAddButton() {
	var fsize = document.getElementById("font_size").value;
	var ffamily = document.getElementById("font_family").value;
	var lheight = document.getElementById("line_height").value;
	var profNum = nextNum();

	// need to check if HTML5 local storage supported
	if (typeof(Storage) !== "undefined") {
		if (profNum !== 'MAX') {
			if (profileExists(fsize, ffamily, lheight) === false) {
				var profile_name = "profileItem" + profNum;
				localStorage.setItem(profile_name, fsize + " - " + ffamily + " - " + lheight);
				loadProfiles();
				// Profile saved
				renderstatus('padd');
			}
			else
			{
				// Same profile settings present
				renderstatus('psamep');
			}
		}
		else
		{
			// More than 3 profiles
			renderstatus('pmorethan3');
		}
	}
	else
	{
		// Local storage not supported
		renderstatus('pnostorage');
	}
}

/* to handle profile deletion */
var eleId = "";
function deletep(e) {
	eleId = e.target.id;
	
	if (eleId.substring(0,11) === "profileItem" && (eleId.substring(eleId.length - 7, eleId.length) === "_delete" || eleId.substring(eleId.length - 7, eleId.length) === "_delalt")) {
		var idToDelete = eleId.substring(0,12);
		
		// Remove profile
		localStorage.removeItem(idToDelete);

		// Reload list and render status text
		loadProfiles();
		renderstatus('prem');
	}
}

/** Domain Management **/

/* Add domain delete button listeners */
function removeDomainListener() {
	var delesd = document.querySelectorAll(".ddeldiv .delwrapper");
	for (var i = 0, lend = delesd.length; i < lend; i++) {
		delesd[i].addEventListener('click', deleted);
	}
}

/* Load domains list */
function loadDomains() {
	var domainList = "";
	var domkeyprefix = "dom: ";
	var storagelength = localStorage.length;

	// Generate HTML
	for(var keyi = 0; keyi < storagelength; keyi++)
	{
		if(localStorage.key(keyi).substring(0,5) === domkeyprefix)
		{
			var dom = localStorage.key(keyi).substring(5);
			var pro = localStorage.getItem(localStorage.key(keyi));
			domainList += '<div class="ddeldiv"><div class="contentsAlt">' +
				'<div id="' + dom + '_delete" class="delwrapper"><img class="delbutton" title="Delete" src="images/delete_n.png" alt="del" id="' + dom + '_delalt"/></div>' +
				'<span class="domwrapper">' +
				'<b><a href="http://' + dom + '" class="domlistdom" target="_blank">' + dom + '</a></b> (Profile ' + pro + ')' +
				'</span></div></div>';
		}
	}
	
	// If empty
	if(domainList === ""){
		domainList = '<p id="emptydomlist">No domains saved</p>';
	}

	// Load HTML
	document.getElementById("domainbigwrapper").innerHTML = domainList;

	// Add listener
	removeDomainListener();
}

/* to handle domain removal */
var deleId = "";
var domToDelete = "";
function deleted(e) {
	deleId = e.target.id;
	
	if (deleId.substring(deleId.length - 7, deleId.length) === "_delete" || deleId.substring(deleId.length - 7, deleId.length) === "_delalt") {
		domToDelete = 'dom: ' + deleId.substring(0, deleId.length - 7);

		// Remove profile
		localStorage.removeItem(domToDelete);

		// Reload list and render status text
		loadDomains();
		renderstatus('deletedom');
	}
}

/* Check and initiate dark theme */
function darkthemeCheck() {
	if(localStorage.getItem('darktheme') === 'on'){
		document.body.classList.add('darktheme');
		document.getElementById("darkonoff").innerText = 'off';
		document.getElementsByClassName("darkthemeset")[0].id = 'darkturnoff';
	}
	else{
		document.body.classList.remove('darktheme');
		document.getElementById("darkonoff").innerText = 'on';
		document.getElementsByClassName("darkthemeset")[0].id = 'darkturnon';
	}
}

/* Toggle dark theme */
function toggleDark() {
	// Toggle setting
	if(localStorage.getItem('darktheme') !== 'on'){
		// Turn on!
		localStorage.setItem('darktheme','on');
		renderstatus('darkgoon');
	}
	else{
		// Turn off!
		localStorage.setItem('darktheme','off');
		renderstatus('darkgooff');
	}

	// Re-check and adjust
	darkthemeCheck();
}

/* Load at beginning */
document.addEventListener('DOMContentLoaded', function() {
	// Log start in console
	console.log('AlphaText Options started.');

	// Load the lists and add listeners
	loadProfiles();
	loadDomains();

	// Add Profile
	document.querySelector("#addProfile").addEventListener('click', clickAddButton);

	// Light or dark theme setting
	document.querySelector(".darkthemeset").addEventListener('click', toggleDark);

	// Listen for storage changes and update domain list
	window.addEventListener('storage',loadDomains);

	// Trigger dark theme if set
	darkthemeCheck();
});