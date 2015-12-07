/*
 * Copyright (C) 2015 Holly Zhou and Peter Wang. All rights reserved.
 *
 * AlphaText--Extension for online text readability
 * Javascript for popup
 */

/* Add jQuery methods for js to work */
function addmethods(){
	// jQuery from http://jquery.com/
	chrome.tabs.executeScript(null,{file:"3rdparty/jquery-2.1.4.min.js"});
}

/* Variables to track active profile and saved state*/
var activep=null;
var saved=false;

/* Render status text */
function renderstatus(eventtype){
	switch(eventtype){
		case 'EMPTY':
			document.getElementById("status").innerHTML='';
		case 'off':
			document.getElementById("status").innerHTML='All styles removed.';
			break;
		case 'adoptp':
			document.getElementById("status").innerHTML='Profile '+activep+' activated!';
			break;
		case 'error':
			document.getElementById("status").innerHTML='Error!';
			break;
		case 'save':
			document.getElementById("status").innerHTML='Domain saved to always use Profile '+activep+'.';
			break;
		case 'unsave':
			document.getElementById("status").innerHTML='Domain save removed.';
			break;
		case 'quickstyleset':
			document.getElementById("status").innerHTML='Quick style set successfully!';
			break;
		case 'saveautop':
			document.getElementById("status").innerHTML='Profile '+activep+' activated automatically on this domain!';
			break;
		default:
			document.getElementById("status").innerHTML=eventtype;
			break;
	}
}

/* CSS profiles */
var css1="";
var css2="";
var css3="";

/* Prepare fallback fonts for CSS */
function fallbackfont(font){
	if(font==="Arial"||font==="Verdana"||font==="Helvetica"||font==="Tahoma"||font==="Cursive"){
		return "sans-serif";
	}
	else{
		return "serif";
	}
}

/* Make CSS */
function makeCSS(pnum){
	
	// Get saved info
	var eleId = "profileItem"+pnum;
	var fontvalue = localStorage.getItem(eleId);
	var values = fontvalue.split(" - ");
	var fsize = values[0];
	var ffamily = values[1];
	var lheight = values[2];

	// Generate CSS string
	var csstemp="body.alphatextcustomp p,body.alphatextcustomp a,body.alphatextcustomp li{"+
			+"font-size:"+fsize+" !important;}"
			+"body.alphatextcustomp *{"
			+"font-family:"+ffamily+","+fallbackfont(ffamily)+" !important;"
			+"line-height:"+lheight+" !important;}";

	// Save into css vars
	switch(pnum)
	{
		case 1:
			css1=csstemp;
			break;
		case 2:
			css2=csstemp;
			break;
		case 3:
			css3=csstemp;
			break;
		default:
			break;
	}
}

/* Adapt and inject a style profile */
function adoptp(profile){
	
	// Remove .alphatextcustomq if needed
	chrome.tabs.executeScript(null,
		{code:
			"$('body').removeClass('alphatextcustomq');"
		});

	// Put in .alphatextcustomp if needed
	chrome.tabs.executeScript(null,
		{code:
			"$('body').addClass('alphatextcustomp');"
		});

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
	
	activep=profile;

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
		{code:
			"$('body').addClass('alphatextcustomq');"
		});

	// Get inputs
	var fsize = document.getElementById("font_size").value;
	var ffamily = document.getElementById("font_family").value;
	var lheight = document.getElementById("line_height").value;
	
	// Set properties if not empty
	
	if(fsize!=="null"){
		chrome.tabs.insertCSS(null,{code:"body.alphatextcustomq p,body.alphatextcustomq a,body.alphatextcustomq li{font-size:"+fsize+" !important;}"});
	}
	if(ffamily!=="null"){
		chrome.tabs.insertCSS(null,{code:"body.alphatextcustomq *{font-family:"+ffamily+" !important;}"});
	}
	if(lheight!=="null"){
		chrome.tabs.insertCSS(null,{code:"body.alphatextcustomq *{line-height:"+lheight+" !important;}"});
	}
	
	renderstatus('quickstyleset');
}

/* Toggle Off */
function toggle(e){
	// Remove all styles
	chrome.tabs.executeScript(null,
				{code:
					"$('body').removeClass('alphatextcustomp');"+
					"$('body').removeClass('alphatextcustomq');"
				});

	renderstatus('off');
}

/* Open options panel */
function openoptions(e){
	chrome.runtime.openOptionsPage();
}

/* Saving domain*/
function togglesave(domtosave){
	if(saved===false)
	{
		// Save!
		if(activep!==null){
			localStorage.setItem('dom: '+tabdomain,activep.toString());
		}
		else
		{
			localStorage.setItem('dom: '+tabdomain,'1');
		}
		saved=true;
		document.getElementById("savetext").innerHTML='Don\'t use on domain';
		document.getElementById("savepage").id="unsavepage";
		renderstatus('save');
	}
	else
	{
		// Unsave!
		localStorage.removeItem('dom: '+tabdomain);
		saved=false;
		document.getElementById("savetext").innerHTML='Always use profile on domain';
		document.getElementById("unsavepage").id="savepage";
		renderstatus('unsave');
	}
}
function savee(e){togglesave(tabdomain);}

/* Check if the domain was saved by user */
function checksave(domtocheck){
	if(localStorage.getItem('dom: '+tabdomain)!==null)
	{
		// Adopt saved profile
		var savedp=parseInt(localStorage.getItem('dom: '+tabdomain));
		adoptp(savedp);
		renderstatus('saveautop');

		// Adjust state and button
		saved=true;
		document.getElementById("savetext").innerHTML='Don\'t use on domain';
		document.getElementById("savepage").id="unsavepage";
	}
	else
	{
		document.getElementById("savetext").innerHTML='Always use profile on domain';
	}
}

/* Get url and domain of website, and see if it was saved */
var taburl=null;
var tabdomain=null;
function checkurldomain(){
	chrome.tabs.query({'active':true},function(tab){
		// Getting URL and domain
		taburl=tab[0].url;
		var end=taburl.indexOf('/',8)
		if(end!==-1)
		{
			if(taburl.indexOf("http://")!==-1)
			{
				tabdomain=taburl.substring(7,end);
			}
			else if(taburl.indexOf("https://")!==-1)
			{
				tabdomain=taburl.substring(8,end);
			}
			else
			{
				tabdomain=null;
			}
		}
		else
		{
			tabdomain=null;
		}

		// Check if saved
		checksave(tabdomain);
	});
}

/* Profiles Management */
var count = 0; //to record the number of profiles saved
var maxNum = 3; //maximum number of profiles saved

// loading and reloading profile items
function loadProfiles() {
  var profileList = "";
  var profkeyprefix="profileItem";
  var storageLen = localStorage.length;
  var profileId = "";
  var profv = "";
  var emptyProf = "";

  for(var keyi=0;keyi<storageLen;keyi++)
  {
		if(localStorage.key(keyi).substring(0,11)===profkeyprefix)
		{
		  profileId=localStorage.key(keyi);
		  profv=localStorage.getItem(localStorage.key(keyi));
		  profileList += "<div class='mid' id='" + profileId + "' value='" + localStorage.getItem(profileId) + "'><div class='contents profcontents'>"
		  		+"<img src='"+chrome.extension.getURL('images/profile.png')+"' class='profim'/>"
		  		+"<p class='profnum'>Profile " + localStorage.key(keyi).substring(11) + "</p>"
		  		+"<p class='minitext'>" + localStorage.getItem(profileId) + "</p>"
		  	+"</div></div>"; 
		  count++;
		}
  }

  // Make empty profile blanks
  for(var i=0;i<maxNum-count;i++){
	emptyProf+="<div class='mid' id='profileempty'><div class='contents'><p>No Profile</p></div></div>";
  }

  // Generate HTML
  document.getElementById("profilecol").innerHTML = "<div class='sectionhead' id='profhead'><p>Profiles</p></div>" + profileList + emptyProf;
}

/* Load once started */
document.addEventListener('DOMContentLoaded',function(){

	// Add jQuery
	addmethods();

	// Save current url and domain
	checkurldomain();

	/* Button event listeners */

	// Options
	var options=document.querySelectorAll("#options");
	for(var i=0,len=options.length;i<len;i++){
		options[i].addEventListener('click',openoptions);
	}

	// Off toggle
	var offtoggle=document.querySelectorAll("#off");
	for(var i=0,len=offtoggle.length;i<len;i++){
		offtoggle[i].addEventListener('click',toggle);
	}

	// Save domain
	var savedom=document.querySelectorAll("#savepage");
	for(var i=0,len=savedom.length;i<len;i++){
		savedom[i].addEventListener('click',savee);
	}

	// Load profile buttons
	loadProfiles();

	// Profiles
	var profile1set=document.querySelectorAll("#profileItem1");
	for(var i=0,len=profile1set.length;i<len;i++){
		profile1set[i].addEventListener('click',adoptp1);
	}
	var profile2set=document.querySelectorAll("#profileItem2");
	for(var i=0,len=profile2set.length;i<len;i++){
		profile2set[i].addEventListener('click',adoptp2);
	}
	var profile3set=document.querySelectorAll("#profileItem3");
	for(var i=0,len=profile3set.length;i<len;i++){
		profile3set[i].addEventListener('click',adoptp3);
	}
	
	// Quick Style Set
	var qsbutton=document.querySelectorAll("#setstyle");
	for(var i=0,len=qsbutton.length;i<len;i++){
		qsbutton[i].addEventListener('click',qsset);
	}
});