/*
 * Copyright (C) 2015 Holly Zhou and Peter Wang. All rights reserved.
 *
 * AlphaText--Extension for online text readability
 * Javascript for options
 */

/* Render status text */
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
		case 'deletedom':
			renderstatuscol('domstatus','yellow');
			document.getElementById("domstatus").innerText = 'Domain removed.';
			break;
		default:
			renderstatuscol('domstatus','');
			renderstatuscol('profstatus','');
			document.getElementById("domstatus").innerText = String(eventtype);
			document.getElementById("profstatus").innerText = '';
			break;
	}
}

/** Profile Management **/
var maxNum = 3; //maximum number of profiles saved

/* Add profile delete button listeners */
function removeProfileListener() {
	var deles = document.querySelectorAll("#profiles .delbutton");
	for (var i = 0, len = deles.length; i < len; i++) {
		deles[i].addEventListener('click', deletep);
	}
}

// loading and reloading profile items
function loadProfiles() {
	var profileList = "";
	var profkeyprefix="profileItem";
	var storageLen = localStorage.length;
	var profileId = "";
	var profv = "";
	var profvarray = ['','',''];
	var profiletext = "";

	// Generate HTML list
	for(var keyi = 0; keyi < storageLen; keyi++)
	{
		if(localStorage.key(keyi).substring(0,11) === profkeyprefix)
		{
			profileId = localStorage.key(keyi);
			profv = localStorage.getItem(localStorage.key(keyi));

			profvarray = profv.split(" - ");
			profiletext = '<br/>Font Size: ' + profvarray[0] + '<br/>Font Style: ' + profvarray[1] + '<br/>Line Height: ' + profvarray[2];

			profileList += "<div class='profs' id='" + profileId + "' value='" + profv + "'>" +
				"<img id= '" + profileId + "_delete' class='delbutton' title='Delete' src='images/delete.png' alt='del'/>" +
				"<b> Profile " + profileId.substring(11) + "</b>: " +
				profiletext +
				"</div><br/>";
		}
	}

	// Empty
	if (profileList === "")
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

/* Load at beginning */
document.addEventListener('DOMContentLoaded', function() {

	/* Load the lists and add listeners */
	loadProfiles();
	loadDomains();

	// Add Profile
	document.querySelector("#addProfile").addEventListener('click', clickAddButton);
});