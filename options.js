/*
 * Copyright (C) 2015 Holly Zhou and Peter Wang. All rights reserved.
 *
 * AlphaText--Extension for online text readability
 * Javascript for options
 */

/* Render status text */
var fadingid = {'p':null,'d':null};
var fadeoutid = {'p':null,'d':null};
var opac = {'p':1,'d':1};
var statusElem = {'p':document.getElementById("profstatus"),'d':document.getElementById("domstatus")}; // the status elements
function fadeOut(which) {
	// Reduce opacity every time interval
	opac[which] = 1;
	function redOpac() {
		opac[which] -= 0.1;
		statusElem[which].style.opacity = opac[which];

		// Disappear finally
		if(opac[which] <= 0) {
			statusElem[which].innerText = '';
			window.clearInterval(fadingid[which]);
		}
	}

	fadingid[which] = window.setInterval(redOpac,50);
}
function pfadeOut() {
	fadeOut('p');
}
function dfadeOut() {
	fadeOut('d');
}
function fadesetup(which) {
	// Reset timers
	if(fadingid[which] !== null) {
		window.clearInterval(fadingid[which]);
	}
	if(fadeoutid[which] !== null) {
		window.clearInterval(fadeoutid[which]);
	}
	
	// Reset opacity
	statusElem[which].style.opacity = 1;

	// Set eventual fade out
	fadeoutid[which] = (which === 'd') ? window.setTimeout(dfadeOut,2000) : window.setTimeout(pfadeOut,2000);
}
function renderstatuscol(statust,color) {
	switch(color){
		case 'red':
			document.getElementById(statust).className = 'statusred';
			break;
		case 'yellow':
			document.getElementById(statust).className = 'statusyellow';
			break;
		case 'green':
			document.getElementById(statust).className = 'statusgreen';
			break;
		default:
			document.getElementById(statust).className = '';
			break;
	}
}
function renderstatus(eventtype) {
	switch(eventtype){
		case 'padd':
			renderstatuscol('profstatus','green');
			statusElem.p.innerText = 'Profile saved';
			fadesetup('p');
			break;
		case 'prem':
			renderstatuscol('profstatus','yellow');
			statusElem.p.innerText = 'Profile removed';
			fadesetup('p');
			break;
		case 'psamep':
			renderstatuscol('profstatus','red');
			statusElem.p.innerText = 'Same profile exists';
			fadesetup('p');
			break;
		case 'pmorethan3':
			renderstatuscol('profstatus','red');
			statusElem.p.innerText = 'You can only add 3 profiles';
			fadesetup('p');
			break;
		case 'pnostorage':
			renderstatuscol('profstatus','red');
			statusElem.p.innerText = 'Sorry! Your browser does not support local storage.';
			fadesetup('p');
			break;
		case 'deletedom':
			renderstatuscol('domstatus','yellow');
			statusElem.d.innerText = 'Domain removed.';
			fadesetup('d');
			break;
		default:
			renderstatuscol('domstatus','');
			renderstatuscol('profstatus','');
			statusElem.d.innerText = String(eventtype);
			statusElem.p.innerText = '';
			fadesetup('d');
			fadesetup('p');
			break;
	}
}

/** Profile Management **/
var maxNum = 3; // maximum number of profiles saved

/* Add profile delete button listeners */
function removeProfileListener() {
	var deles = document.querySelectorAll("#profiles .delbutton");
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
	var profiletext = '';

	// Go through the three possible profiles
	for(var profnum = 1; profnum <= 3; profnum++){
		// Make key
		profkey = profkeyprefix + profnum.toString(10);
		
		// Generate HTML profile buttons
		if(localStorage.getItem(profkey) !== null){
			profv = localStorage.getItem(profkey);
			profvarray = profv.split(" - ");
			profiletext = '<br/>Font Size: ' + profvarray[0] + '<br/>Font Style: ' + profvarray[1] + '<br/>Line Height: ' + profvarray[2];

			profileList += "<div class='profs' id='" + profkey + "' value='" + profv + "'>" +
				"<img id= '" + profkey + "_delete' class='delbutton' title='Delete' src='images/delete.png' alt='del'/>" +
				"<b> Profile " + profnum + "</b>: " +
				profiletext +
				"</div><br/>";
		}
	}

	// Empty
	if (profileList === '')
	{
		profileList = 'No Profile';
	}

	// Load HTML
	document.getElementById("profiles").innerHTML = profileList;

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

/* to remove profile item */
function removeProfile(eid) {
	localStorage.removeItem(eid);
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
function clickAddButton(e) {
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
	if (eleId.substring(0,11) === "profileItem" && eleId.substring(eleId.length - 7, eleId.length) === "_delete") {
		var idToDelete = eleId.substring(0, eleId.length - 7);
		
		// Remove profile
		removeProfile(idToDelete);

		// Reload list and render status text
		loadProfiles();
		renderstatus('prem');
	}
}

/** Domain Management **/

/* Add domain delete button listeners */
function removeDomainListener() {
	var delesd = document.querySelectorAll("#domlist .delbutton");
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
			domainList += "<div class='doms'>" +
				"<img class='delbutton' title='Delete' src='images/delete.png' alt='del' id='" + dom + "_delete'/> " +
				"<b><a href='http://" + dom + "' class='domlistdom' target='_blank'>" + dom + "</a></b> (Profile " + pro + ")" +
				"</div>";
		}
	}
	
	// If empty
	if(domainList === ""){
		domainList = "No domains saved";
	}

	// Load HTML
	document.getElementById("domlist").innerHTML = domainList;

	// Add listener
	removeDomainListener();
}

/* to remove domain item */
function removeDomain(ditem) {
	localStorage.removeItem(ditem);
}

/* to handle domain removal */
var deleId = "";
function deleted(e) {
	deleId = e.target.id;
	if (deleId.substring(deleId.length - 7, deleId.length) === "_delete") {
		var domToDelete = 'dom: ' + deleId.substring(0, deleId.length - 7);
		
		// Remove profile
		removeDomain(domToDelete);

		// Reload list and render status text
		loadDomains();
		renderstatus('deletedom');
	}
}

/* Check and initiate dark theme */
function darkthemeCheck() {
	if(localStorage.getItem('darktheme') === 'on'){
		document.body.classList.add('darktheme');
		document.getElementById("darkonoff").innerText = 'on';
		document.getElementsByClassName("darkthemeset")[0].id = 'darkturnon';
	}
	else{
		document.body.classList.remove('darktheme');
		document.getElementById("darkonoff").innerText = 'off';
		document.getElementsByClassName("darkthemeset")[0].id = 'darkturnoff';
	}
}

/* Toggle dark theme */
function toggleDark(e) {
	// Toggle setting
	if(localStorage.getItem('darktheme') !== 'on'){
		localStorage.setItem('darktheme','on');
	}
	else{
		localStorage.setItem('darktheme','off');
	}

	// Re-check and adjust
	darkthemeCheck()
}

/* Load at beginning */
document.addEventListener('DOMContentLoaded', function() {

	/* Load the lists and add listeners */
	loadProfiles();
	loadDomains();

	// Add Profile
	document.querySelector("#addProfile").addEventListener('click', clickAddButton);

	// Light or dark theme setting
	document.querySelector(".darkthemeset").addEventListener('click', toggleDark);

	// Trigger dark theme if set
	darkthemeCheck();
});