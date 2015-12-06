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

var count; //to record the number of profiles saved
var maxNum = 3; //maximum number of profiles saved

// loading and reloading profile items
// added a random delete.png file but you can replate it with something else later
function loadProfiles() {
  var profileList = "";
  var profileIndex = "";
  var isEOF = false; 
  
  count = 1;
  while (!isEOF) {
    var profileId = "profileItem" + count;
    if (localStorage.getItem(profileId) !== null) {
      profileList += "<div class='profs' id='" + profileId + "' value='" + localStorage.getItem(profileId) + "'><b>Profile " + count + "</b>: "
      + localStorage.getItem(profileId) + "&nbsp&nbsp<img id= '" + profileId 
      + "_delete' title='Delete' src='images/delete.png' height='10' width='10' align='bottom'/></div>"; 
      count++;
    }
    else {
      var isFound = false;
      var precount = count;
      var lastcount = count;
      for (var i = precount; i < maxNum; i++) {
          profileId = "profileItem" + i; 
          if (localStorage.getItem(profileId) !== null) {
              isFound = true;
              lastcount = count;
              break;
          }
          else
            count++;
      }
      if (!isFound) {
        if (maxNum === count)
            count = lastcount;
        isEOF = true;
      }
    }
  }
  
    if (profileList === "")
        profileList = "No Profile";
    document.getElementById("profiles").innerHTML = profileList;
}

// to check if a profile exists; if it exists then return true; else return false
// fs = font size; ff = font family; lh = line height
function profileExists(fs, ff, lh) {
    var num = 1;
    for (var i = 1; i < count; i++) {
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

// click event to add profile
function clickAddButton(e) {
  var fsize = document.getElementById("font_size").value;
	var ffamily = document.getElementById("font_family").value;
	var lheight = document.getElementById("line_height").value;
	
	// need to check if the browser supports HTML5 local storage
	// must be no older than Chrome 4.0, IE 8, Firefox 3.5, etc
	if (typeof(Storage) !== "undefined") {
	    if (e.target.id == "addProfile" && count <= maxNum) {
	        var profile_name = "profileItem" + count;
	        if (profileExists(fsize, ffamily, lheight) === false) {
	            localStorage.setItem(profile_name, fsize + " - " + ffamily + " - " + lheight);
	            loadProfiles();
              renderstatus('padd');
	        }
	        else
	            // alert("Same profile exists");
              renderstatus('psamep');
	    }
	    else
	        // alert("You can only add 3 profiles");
          renderstatus('pmorethan3');
	}
	else
	    // alert("Sorry! Your browser does not support Web Storage.");
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

window.onload = loadProfiles;
