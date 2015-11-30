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

// /* Get url and domain of website */
// var url=chrome.tabs.Tab.url;
// var domain=false;

// function getdomain(url){
// 	var end=url.indexOf('/',8)
// 	if(end!==-1)
// 	{
// 		if(url.indexOf("http://")!==-1)
// 		{
// 			domain=url.substring(7,end);
// 		}
// 		else if(url.indexOf("https://")!==-1)
// 		{
// 			domain=url.substring(8,end);
// 		}
// 		else
// 		{
// 			return false;
// 		}
// 	}
// 	else
// 	{
// 		return false;
// 	}
// }

/* Variables to track state */
var onoff=false;
var activep=null;

/* Render status text */
function renderstatus(eventt){
	switch(eventt){
		case 'adoptp':
			document.getElementById("status").innerHTML='Profile '+activep+' activated!';
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
			document.getElementById("status").innerHTML=eventt;
			break;
	}
}

// /* Add and remove CSS */
// function addCSS(profile){
// 	switch(profile){
// 		case 'default':
// 			csslink='default.css';
// 			break;
// 		default:
// 			return;
// 	}
// 	chrome.tabs.executeScript(null,
// 	    {code:
// 			"var csslinktag=document.createElement('link');
// 			csslinktag.href='profiles/'+csslink;
// 			csslinktag.id='customcss';
// 			csslinktag.type='text/css';
// 			csslinktag.rel='stylesheet';
// 			document.getElementsByTagName('head')[0].appendChild(csslinktag);"
// 		});
// }
// function clearstyles(){
// 	chrome.tabs.executeScript(null,
// 	    {code:
// 			"var target=document.getElementById('customcss')
// 			target && target.parentNode.removeChild(target);"
// 		});

// 	// var head=document.querySelectorAll("head");
// 	// 	for(var i=0,len=head.length;i<len;i++){
// 	// 		head[i].removeChild(target);
// 	// 	}
// }


/* Toggle On-Off */
function toggle(e){
	if(onoff===false){
		// Switch on
		onoff=true;
		document.getElementById("onofftext").innerHTML='Switch off';
		document.getElementById("off").id='on';
		adoptp('default');
	}
	else{
		// Switch off
		onoff=false;
		document.getElementById("onofftext").innerHTML='Switch on';
		document.getElementById("on").id='off';
		//  TODO: Remove all injected styles
	}
}

/* Open options panel */
function openoptions(e){
	chrome.runtime.openOptionsPage();
}

/* Quick Styles */
function qsset(e) {
	var fsize = document.getElementById("font_size").value;
	var ffamily = document.getElementById("font_family").value;
	var lheight = document.getElementById("line_height").value;
	
	if (typeof(Storage) !== "undefined") {
    	if (e.target.id === "profile1" || e.target.id === "profile1" || e.target.id === "profile3")
  	}
	
	if(fsize!=="null"){
	  		chrome.tabs.executeScript(null,
	    	{code:"document.body.style.fontSize = '" + fsize + "'"});
	}
	if(ffamily!=="null"){
		chrome.tabs.executeScript(null,
		    {code:"document.body.style.fontFamily = '" + ffamily + "'"});
	}
	if(lheight!=="null"){
		chrome.tabs.executeScript(null,
		    {code:"document.body.style.lineHeight = '" + lheight + "'"});
	}
	renderstatus('quickstyleset');
}

/* Adapt and inject a style profile */
function adoptp(profile){
	
	// TODO: Remove all injected css and styles
	// clearstyles();

	switch(profile){
		case 'default':
			// addCSS('default')
			chrome.tabs.insertCSS(null,{file:"profiles/default.css"});
			break;
		// case 1:
		// 	chrome.tabs.insertCSS(null,{file:"profiles/user1.css"});
		// 	break;
		// case 2:
		// 	chrome.tabs.insertCSS(null,{file:"profiles/user2.css"});
		// 	break;
		// case 3:
		// 	chrome.tabs.insertCSS(null,{file:"profiles/user3.css"});
		// 	break;
		default:
			return;
	}
	activep=profile;
	renderstatus('adoptp');
}

/* Button event listeners */
document.addEventListener('DOMContentLoaded',function(){
  // Quick Style Set
  var button = document.querySelectorAll("#setstyle");
  for (var i = 0, len = button.length; i < len; i++) {
    button[i].addEventListener('click', qsset);
  }
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
});




// function checkonoff(){
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

// /* Get url and domain of website */
// var url=chrome.tabs.Tab.url;
// var domain=false;

// function getdomain(url){
// 	var end=url.indexOf('/',8)
// 	if(end!==-1)
// 	{
// 		if(url.indexOf("http://")!==-1)
// 		{
// 			domain=url.substring(7,end);
// 		}
// 		else if(url.indexOf("https://")!==-1)
// 		{
// 			domain=url.substring(8,end);
// 		}
// 		else
// 		{
// 			return false;
// 		}
// 	}
// 	else
// 	{
// 		return false;
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
