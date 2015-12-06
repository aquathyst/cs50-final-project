/*
  AlphaText
  JavaScript for popup.html
*/

var count; //to record the number of profiles saved
var maxNum = 3; //maximum number of profiles saved

// loading and reloading profile items
function loadProfiles() {
  var profileList = "";
  var emptyProf = "";
  var profileIndex = "";
  var isEOF = false; 
  
  count = 1;
  while (!isEOF) {
    var profileId = "profileItem" + count;
    if (localStorage.getItem(profileId) !== null) {
      profileList += "<div class='mid' id='" + profileId + "' value='" + localStorage.getItem(profileId) + "'><div class='profiles'><img src='images/profile.png' class='profim'/><p>" 
      + localStorage.getItem(profileId) + "</p></div></div>"; 
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

  // Make empty profile blanks
  for(var i=0;i<maxNum-count;i++){
    emptyProf+="<div class='mid' id='profileempty'><div class='profiles'><p>No Profile</p></div></div>";
  }

  // Generate HTML
  document.getElementById("profilecol").innerHTML = "<div class='sectionhead' id='profhead'><p>Profiles</p></div>" + profileList + emptyProf;
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

// // to change the font, size, and line height of a web page
// function setStyle(fs, ff, lh) {
//   chrome.tabs.executeScript(null,
// 	    	{code:"document.body.style.setProperty('font-size','" + fs + "','important');"});
// 	chrome.tabs.executeScript(null,
// 	    	{code:"document.body.style.setProperty('font-family','" + ff + "','important');"});
// 	chrome.tabs.executeScript(null,
// 	    	{code:"document.body.style.setProperty('line-height','" + lh + "','important');"});
// }

// // to handle profile deletion and font/size/line height change
// function clickDiv(e) {
//     var fsize = "";
//     var ffamily = "";
//     var lheight = "";
    
//     if ((e.target.id).substring(0,11) === "profileItem") {
//         var eleId = e.target.id;
//         var fontvalue = localStorage.getItem(eleId);
//         var values = fontvalue.split(" - ");
//         fsize = values[0];
//         ffamily = values[1];
//         lheight = values[2];
//         setStyle(fsize, ffamily, lheight);
//     }
// }


// // add event listener for when the page loads
// document.addEventListener('DOMContentLoaded', function() {
//     var divs = document.querySelectorAll('div');
//     for (var i = 0, len = divs.length; i < len; i++)
//         divs[i].addEventListener('click', clickDiv);
// });

window.onload = loadProfiles;
