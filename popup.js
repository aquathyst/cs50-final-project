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


function click(e) {
  var fsize = document.getElementById("font_size").value;
  var ffamily = document.getElementById("font_family").value;
  if (typeof(Storage) !== "undefined") {
    if (e.target.id === "profile1" || e.target.id === "profile1" || e.target.id === "profile3")
  }
  chrome.tabs.executeScript(null,
    {code:"document.body.style.fontSize = '" + fsize + "'"});
  chrome.tabs.executeScript(null,
    {code:"document.body.style.fontFamily = '" + ffamily + "'"});
  window.close();
}

document.addEventListener('DOMContentLoaded', function () {
  var button = document.querySelectorAll("#setstyle");
  for (var i = 0, len = button.length; i < len; i++) {
    button[i].addEventListener('click', click);
  }
});

/* Get url and domain of website */
var url=chrome.tabs.Tab.url;
var domain=false;

function getdomain(url){
	var end=url.indexOf('/',8)
	if(end!==-1)
	{
		if(url.indexOf("http://")!==-1)
		{
			domain=url.substring(7,end);
		}
		else if(url.indexOf("https://")!==-1)
		{
			domain=url.substring(8,end);
		}
		else
		{
			return false;
		}
	}
	else
	{
		return false;
	}
}



/* On-off switch scripts */
var onoff=false;

function checkonoff(){
	if(onoff===true)
	{
		$("#on").id='off';
	}

}

function showonofftext(){
	if(onoff===true)
	{
		$("#onofftext").innerHTML='Switch off';
	}
	else
	{
		$("#onofftext").innerHTML='Switch on';
	}
}

function toggle(){
	if(onoff===true){
		onoff=false;
		$("#on").id='off';

	}
	else{
		onoff=true;
		$("#off").id='on';
		
	}
}

/* Saving domain preferences scripts */
var saved=false;


function checksave(domain){
	
	if(saved===true)
	{
		$("#savepage").onclick="unsave()";
		$("#savepage").id='unsavepage';
		onoff=true;
	}
}

function showsavetext(){
	if(saved===true)
	{
		$("#savetext").innerHTML='Don\'t always use on domain';
	}
	else
	{
		$("#savetext").innerHTML='Always use on domain';
	}
}

function save(domain,profile){
	$("#savepage").onclick="unsave(domain)";
	$("#savepage").id='unsavepage';

}

function unsave(domain){
	$("#unsavepage").onclick="save(domain,profile)";
	$("#unsavepage").id='savepage';

}

/* Adapt and inject a style profile */
function adoptp(profile){
	switch(profile){
		case 'd':
		;
		case 1;
		;
		case 2:
		;
		case 3:
		;
		default:
		;
	}
}

