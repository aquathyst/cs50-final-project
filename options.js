/*
 * Copyright (C) 2015 Holly Zhou and Peter Wang. All rights reserved.
 *
 * AlphaText--Extension for online text readability
 * Javascript for options
 */

/* Render status text */
function renderstatus(what){
  switch(what){
    case 'EMPTY':
      document.getElementById("prefstatus").innerHTML='';
      document.getElementById("profstatus").innerHTML='';
      document.getElementById("domstatus").innerHTML='';
      document.getElementById("overallstatus").innerHTML='';
    case 'padd':
      document.getElementById("profstatus").innerHTML='Profile saved';
      break;
    case 'prem':
      document.getElementById("profstatus").innerHTML='Profile removed';
      break;
    case 'psamep':
      document.getElementById("profstatus").innerHTML='Same profile exists';
      break;
    case 'pmorethan3':
      document.getElementById("profstatus").innerHTML='You can only add 3 profiles';
      break;
    case 'pnostorage':
      document.getElementById("profstatus").innerHTML='Sorry! Your browser does not support Web Storage.';
      break;
    default:
      document.getElementById("overallstatus").innerHTML=what;
      break;
  }
}

// var count; //to record the number of profiles saved
var maxNum = 3; //maximum number of profiles saved

// loading and reloading profile items
// added a random delete.png file but you can replate it with something else later
function loadProfiles() {
  var profileList = "";
  var profkeyprefix="profileItem";
  var storageLen = localStorage.length;
  var profileId = "";
  var profv = "";

  for(var keyi=0;keyi<storageLen;keyi++)
  {
    if(localStorage.key(keyi).substring(0,11)===profkeyprefix)
    {
      profileId=localStorage.key(keyi);
      profv=localStorage.getItem(localStorage.key(keyi));
      profileList += "<div class='profs' id='" + profileId + "' value='" + profv + "'><b>Profile " + profileId.substring(11) + "</b>: "
          + profv + "&nbsp&nbsp<img id= '" + profileId 
          + "_delete' title='Delete' src='images/delete.png' height='10' width='10' align='bottom'/></div>";
    }
  }

  if (profileList === "")
      profileList = "No Profile";
  document.getElementById("profiles").innerHTML = profileList;
}

// to check if a profile exists; if it exists then return true; else return false
// fs = font size; ff = font family; lh = line height
function profileExists(fs, ff, lh) {
    for (var i = 1; i <= maxNum; i++) {
        var profileId = "profileItem" + i;
        var profileValue = fs + " - " + ff + " - " + lh;
        if (localStorage.getItem(profileId) === profileValue) 
            return true;
    }
    return false;
}

// to remove profile item
function removeProfile(eid) {
    localStorage.removeItem(eid);
}

// Figure out what is the next profile number to be saved to
function nextNum(){
  if(localStorage.getItem('profileItem1')===null)
  {
    return 1;
  }
  else if(localStorage.getItem('profileItem2')===null)
  {
    return 2;
  }
  else if(localStorage.getItem('profileItem3')===null)
  {
    return 3;
  }
  else
  {
    return 'MAX';
  }
}

// click event to add profile
function clickAddButton(e) {
  var fsize = document.getElementById("font_size").value;
	var ffamily = document.getElementById("font_family").value;
	var lheight = document.getElementById("line_height").value;
	var storageLen = localStorage.length; 
	var profNum=nextNum();

	// need to check if the browser supports HTML5 local storage
	// must be no older than Chrome 4.0, IE 8, Firefox 3.5, etc
	if (typeof(Storage) !== "undefined") {
	    if (profNum!=='MAX') {
	        var profile_name = "profileItem" + profNum;
	        if (profileExists(fsize, ffamily, lheight) === false) {
	            localStorage.setItem(profile_name, fsize + " - " + ffamily + " - " + lheight);
	            loadProfiles();
              renderstatus('padd');
	        }
	        else
              renderstatus('psamep');
	    }
	    else
          renderstatus('pmorethan3');
	}
	else
      renderstatus('pnostorage');
}

// to handle profile deletion and font/size/line height change
function clickDiv(e) {
    var fsize = "";
    var ffamily = "";
    var lheight = "";
    
    if ((e.target.id).substring(0,11) === "profileItem") {
        var eleId = e.target.id;
        if (eleId.substring(eleId.length - 7, eleId.length) === "_delete") {
            var idToDelete = eleId.substring(0, eleId.length - 7);
            removeProfile(idToDelete);
            loadProfiles();
            renderstatus('prem');
        }
    }
}

// Load domains list
function loadDomains(){
  var domainList="";
  var domkeyprefix="dom: ";
  var storagelength=localStorage.length;

  // Generate HTML
  for(var keyi=0;keyi<storagelength;keyi++)
  {
    if(localStorage.key(keyi).substring(0,5)===domkeyprefix)
    {
      var dom=localStorage.key(keyi).substring(5);
      var pro=localStorage.getItem(localStorage.key(keyi));
      domainList+="<div class='doms'><b><a href='http://"+dom+"' target='_blank'>"+dom+"</a></b> (Profile "+pro+")</div>";
    }
  }
  
  // If empty
  if(domainList===""){
    domainList="No domains saved";
  }
  document.getElementById("domlist").innerHTML=domainList;
}

// add event listener for when the page loads
document.addEventListener('DOMContentLoaded', function() {
    
    // Add Profile
    var addProfile = document.querySelector("#addProfile");
    addProfile.addEventListener('click', clickAddButton);

    // Remove Profile
    var divs = document.querySelectorAll('div');
    for (var i = 0, len = divs.length; i < len; i++)
        divs[i].addEventListener('click', clickDiv);
});

window.onload = function(){
  loadProfiles();
  loadDomains();
};