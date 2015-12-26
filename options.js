/*
 * Copyright (C) 2015 Holly Zhou and Peter Wang. All rights reserved.
 *
 * AlphaText--Extension for online text readability
 * Javascript for options
 */

/* Render status text */
var statusmsg = '';

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
			document.getElementById("profstatus").innerText = 'Profile saved';
			break;
		case 'prem':
			renderstatuscol('profstatus','yellow');
			document.getElementById("profstatus").innerText = 'Profile removed';
			break;
		case 'psamep':
			renderstatuscol('profstatus','red');
			document.getElementById("profstatus").innerText = 'Same profile exists';
			break;
		case 'pmorethan3':
			renderstatuscol('profstatus','red');
			document.getElementById("profstatus").innerText = 'You can only add 3 profiles';
			break;
		case 'pnostorage':
			renderstatuscol('profstatus','red');
			document.getElementById("profstatus").innerText = 'Sorry! Your browser does not support local storage.';
			break;
		default:
			renderstatuscol('overallstatus','');
			document.getElementById("overallstatus").innerText = String(eventtype);
			break;
	}
}

/* Profiles Management */
var maxNum = 3; //maximum number of profiles saved

// loading and reloading profile items
function loadProfiles() {
	var profileList = "";
	var profkeyprefix="profileItem";
	var storageLen = localStorage.length;
	var profileId = "";
	var profv = "";

	// Generate HTML list
	for(var keyi = 0; keyi < storageLen; keyi++)
	{
		if(localStorage.key(keyi).substring(0,11) === profkeyprefix)
		{
			profileId = localStorage.key(keyi);
			profv = localStorage.getItem(localStorage.key(keyi));
			profileList += "<div class='profs' id='" + profileId + "' value='" + profv + "'><b>Profile " + profileId.substring(11) + "</b>: "
				+ profv + "  <img id= '" + profileId 
				+ "_delete' class='delbutton' title='Delete' src='images/delete.png' alt='del'/></div>";
		}
	}

	// Empty
	if (profileList === "")
	{
		profileList = 'No Profile';
	}

	// Load HTML
	document.getElementById("profiles").innerHTML = profileList;
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
	var storageLen = localStorage.length; 
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
			domainList += "<div class='doms'><b><a href='http://" + dom + "' target='_blank'>" + dom + "</a></b> (Profile " + pro + ")</div>";
		}
	}
	
	// If empty
	if(domainList === ""){
		domainList = "No domains saved";
	}

	// Load HTML
	document.getElementById("domlist").innerHTML = domainList;
}

/* Load at beginning */
document.addEventListener('DOMContentLoaded', function() {

	/* Load the lists */
	loadProfiles();
	loadDomains();

	// Add Profile
	document.querySelector("#addProfile").addEventListener('click', clickAddButton);

	// Remove Profile
	var deles = document.querySelectorAll("#profiles");
	for (var i = 0, len = deles.length; i < len; i++) {
		deles[i].addEventListener('click', deletep);
	}
});
