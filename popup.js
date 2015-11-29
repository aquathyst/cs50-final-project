/*
  AlphaText
  JavaScript for popup.html
*/


function click(e) {
  var fsize = document.getElementById("font_size").value;
  var ffamily = document.getElementById("font_family").value;
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



/* On-off switch scripts */
var onoff=false;

var activep=null;

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

function toggle(){
	if(onoff===true){
		// Switch off
		onoff=false;
		$("#onofftext").innerHTML='Switch on';
		$("#on").id='off';
		//  TODO: Remove all injected styles
	}
	else{
		// Switch on
		onoff=true;
		$("#onofftext").innerHTML='Switch off';
		$("#off").id='on';
		adoptp('default');
	}
}


/* Adapt and inject a style profile */
function adoptp(profile){
	
	// TODO: Remove all injected css and styles
	
	switch(profile){
		case 'default':
		chrome.tabs.insertCSS(null,{file:"profiles/default.css"});
		case 1:
		chrome.tabs.insertCSS(null,{file:"profiles/user1.css"});
		case 2:
		chrome.tabs.insertCSS(null,{file:"profiles/user2.css"});
		case 3:
		chrome.tabs.insertCSS(null,{file:"profiles/user3.css"});
		default:
		return;
	}
	activep=profile;
	renderstatus('adoptp');
}

/* Render status text */
function renderstatus(event){
	switch(event){
		case 'adoptp':
		$("#status").innerHTML='Profile '+profile+' activated!';
		case 'error':
		$("#status").innerHTML='Error!';
		case 'save':
		$("#status").innerHTML='Domain saved.';
		case 'unsave':
		$("#status").innerHTML='Domain save removed.';
		case 'quickstyleset':
		$("#status").innerHTML='Quick style set successfully!';
		default:
		;
	}
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
