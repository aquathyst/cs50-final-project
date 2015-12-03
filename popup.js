/*
  AlphaText
  JavaScript for popup.html
*/
var count = 0;
var isEOF = false;
var profiles = []; 

function loadProfiles() {
  var profileList = "";
  while (!isEOF) {
    var profile_name = "profile" + count;
    if (localStorage.getItem(profile_name)) 
      count++;
    else
      isEOF = true;
  }
  var temp = "<div id='profile1'>" + localStorage.getItem("profile1") + "</div";
  temp += "<div id='profile2'>" + localStorage.getItem("profile2") + "</div>";
  temp += "<div id='profile3'>" + localStorage.getItem("profile3") + "</div>";
  document.getElementById("profiles").innerHTML = temp;
}





/* Get url and domain of website */
var taburl=null;
var tabdomain=null;
function geturldomain(){
	chrome.tabs.query({'active':true},function(tab){
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
	});
}

/* Variables to track state */
var onoff=false;
var activep=null;

/* Render status text */
function renderstatus(eventtype){
	switch(eventtype){
		case 'off':
			document.getElementById("status").innerHTML='AlphaText deactivated.';
			break;
		case 'adoptp':
			document.getElementById("status").innerHTML='Profile '+activep+' activated!';
			break;
		case 'adoptpd':
			document.getElementById("status").innerHTML='Default profile activated!';
			break;
		case 'error':
			document.getElementById("status").innerHTML='Error!';
			break;
		case 'save':
			document.getElementById("status").innerHTML='Domain saved.';
			break;
		case 'unsave':
			document.getElementById("status").innerHTML='Domain save removed.';
			break;
		case 'quickstyleset':
			document.getElementById("status").innerHTML='Quick style set successfully!';
			break;
		default:
			document.getElementById("status").innerHTML=eventtype;
			break;
	}
}

/* Toggle On-Off */
function toggle(e){
	if(onoff===false){
		// Switch on
		onoff=true;
		document.getElementById("onofftext").innerHTML='Switch off';
		document.getElementById("off").id='on';
		
		chrome.tabs.executeScript(null,
				{code:
					"$('body').addClass('alphatextcustomp');"
				});

		if(activep===null){
			adoptp(0);
		}
		else{
			adoptp(activep);
		}
	}
	else{
		// Switch off
		onoff=false;
		document.getElementById("onofftext").innerHTML='Switch on';
		document.getElementById("on").id='off';
		
		chrome.tabs.executeScript(null,
				{code:
					"$('body').removeClass('alphatextcustomp');"+
					"$('body').removeClass('alphatextcustomq');"
				});

		renderstatus('off');
	}
}

/* Open options panel */
function openoptions(e){
	chrome.runtime.openOptionsPage();
}

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
	
	// if (typeof(Storage) !== "undefined") {
 //    	if (e.target.id === "profile1" || e.target.id === "profile1" || e.target.id === "profile3")
 //  	}

 	// Set properties if not empty
	if(fsize!=="null"){
		chrome.tabs.insertCSS(null,{code:"body.alphatextcustomq{font-size:"+fsize+" !important;}"});
	}
	if(ffamily!=="null"){
		chrome.tabs.insertCSS(null,{code:"body.alphatextcustomq{font-family:"+ffamily+" !important;}"});
	}
	if(lheight!=="null"){
		chrome.tabs.insertCSS(null,{code:"body.alphatextcustomq{line-height:"+lheight+" !important;}"});
	}
	
	renderstatus('quickstyleset');
}


/* Adapt and inject a style profile */
function adoptp(profile){
	
	// Remove .alphatextcustomq if needed
	chrome.tabs.executeScript(null,
		{code:
			"$('body').removeClass('alphatextcustomq');"
		});

	// Insert CSS profile
	switch(profile){
		case 0:
			// addCSS('default')
			chrome.tabs.insertCSS(null,{file:"profiles/default.css"});
			break;
		case 1:
			chrome.tabs.insertCSS(null,{file:"profiles/user1.css"});
			break;
		case 2:
			chrome.tabs.insertCSS(null,{file:"profiles/user2.css"});
			break;
		case 3:
			chrome.tabs.insertCSS(null,{file:"profiles/user3.css"});
			break;
		default:
			return;
	}
	
	activep=profile;
	if(profile!==0){
		renderstatus('adoptp');
	}
	else{
		renderstatus('adoptpd');
	}
}
// Functions for event call
function adoptp0(e){adoptp(0);}
function adoptp1(e){adoptp(1);}
function adoptp2(e){adoptp(2);}
function adoptp3(e){adoptp(3);}


/* First things to load once started */
document.addEventListener('DOMContentLoaded',function(){

	// Save current url and domain
	geturldomain();

	/* Button event listeners */

	// On-off toggle
	var onofftoggle = document.querySelectorAll("#off");
	for (var i = 0, len = onofftoggle.length; i < len; i++) {
	    onofftoggle[i].addEventListener('click', toggle);
	}

	// Options
	var options = document.querySelectorAll("#options");
	for (var i = 0, len = options.length; i < len; i++) {
	    options[i].addEventListener('click', openoptions);
	}

	//Profiles
	var profile0set = document.querySelectorAll("#profile0");
	for (var i = 0, len = profile0set.length; i < len; i++) {
	    profile0set[i].addEventListener('click', adoptp0);
	}
	var profile1set = document.querySelectorAll("#profile1");
	for (var i = 0, len = profile1set.length; i < len; i++) {
	    profile1set[i].addEventListener('click', adoptp1);
	}
	var profile2set = document.querySelectorAll("#profile2");
	for (var i = 0, len = profile2set.length; i < len; i++) {
	    profile2set[i].addEventListener('click', adoptp2);
	}
	var profile3set = document.querySelectorAll("#profile3");
	for (var i = 0, len = profile3set.length; i < len; i++) {
	    profile3set[i].addEventListener('click', adoptp3);
	}
	
	// Quick Style Set
	var qsbutton = document.querySelectorAll("#setstyle");
	for (var i = 0, len = qsbutton.length; i < len; i++) {
	    qsbutton[i].addEventListener('click', qsset);
	}
});



// function checkonoff(){
// 	$("")
// 	if(onoff===true)
// 	{
// 		$("#on").id='off';
// 	}

// }

// function showonofftext(){
// 	if(onoff===true)
// 	{
// 		$("#onofftext").innerHTML='Switch off';
// 	}
// 	else
// 	{
// 		$("#onofftext").innerHTML='Switch on';
// 	}
// }

// /* Saving domain preferences scripts */
// var saved=false;

// function checksave(domain){
	
// 	if(saved===true)
// 	{
// 		$("#savepage").onclick="unsave()";
// 		$("#savepage").id='unsavepage';
// 		onoff=true;
// 	}
// }

// function showsavetext(){
// 	if(saved===true)
// 	{
// 		$("#savetext").innerHTML='Don\'t always use on domain';
// 	}
// 	else
// 	{
// 		$("#savetext").innerHTML='Always use on domain';
// 	}
// }

// function save(domain,profile){
// 	$("#savepage").onclick="unsave(domain)";
// 	$("#savepage").id='unsavepage';

// }

// function unsave(domain){
// 	$("#unsavepage").onclick="save(domain,profile)";
// 	$("#unsavepage").id='savepage';

// }
