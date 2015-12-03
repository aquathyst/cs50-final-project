/*
  AlphaText
  JavaScript for options.html
*/

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
      profileList += "<div id='" + profileId + "' value='" + localStorage.getItem(profileId) + "'>" 
      + localStorage.getItem(profileId) + "&nbsp&nbsp<img id= '" + profileId 
      + "_delete' title='Delete' src='delete.png' height='10' width='10' align='bottom'/></div>"; 
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
  /* var temp = "<div id='profile1'>" + localStorage.getItem("profile1") + "</div";
  temp += "<div id='profile2'>" + localStorage.getItem("profile2") + "</div>";
  temp += "<div id='profile3'>" + localStorage.getItem("profile3") + "</div>";
  document.getElementById("profiles").innerHTML = temp;
  */
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

// to change the font, size, and line height of a web page
function setStyle(fs, ff, lh) {
    chrome.tabs.executeScript(null,
	    	{code:"document.body.style.setProperty('font-size','" + fs + "','important');"});
	chrome.tabs.executeScript(null,
	    	{code:"document.body.style.setProperty('font-family','" + ff + "','important');"});
	chrome.tabs.executeScript(null,
	    	{code:"document.body.style.setProperty('line-height','" + lh + "','important');"});
}

// to remove profile item
function removeProfile(eid) {
    for (var i = 0; i < maxNum; i++) 
        localStorage.removeItem("profileItem" + i);
}

// click event to add profile
function clickAddButton(e) {
    var fsize = document.getElementById("font_size").value;
	var ffamily = document.getElementById("font_family").value;
	var lheight = document.getElementById("line_height").value;
	
	// need to check if the browser supports HTML5 local storage
	// must be no older than Chrome 4.0, IE 8, Firefox 3.5, etc
	if (typeof(Storage) !== "undefined") {
	    if (e.target.id == "addProfile") {
	        var profile_name = "profileItem" + count;
	        if (profileExists(fsize, ffamily, lheight) === false) {
	            localStorage.setItem(profile_name, fsize + " - " + ffamily + " - " + lheight);
	            loadProfiles();
	        }
	        else
	            alert("Same profile exists");
	    }
	}
	else
	    alert("Sorry! Your browser does not support Web Storage.");
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
        }
        else {
            var fontvalue = localStorage.getitem(e.target.id);
            var values = fontvalue.split(" - ");
            fsize = values[0];
            ffamily = values[1];
            lheight = values[2];
            setStyle(fsize, ffamily, lheight);
        }
    }
}

// add event listener for when the page loads
document.addEventListener('DOMContentLoaded', function() {
    var addProfile = document.querySelector("#addProfile");
    addProfile.addEventListener('click', clickAddButton);
    var divs = document.querySelectorAll('div');
    for (var i = 0, len = divs.length; i < len; i++)
        divs[i].addEventListener('click', clickDiv);
});

window.onload = loadProfiles;
