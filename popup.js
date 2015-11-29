/*
  AlphaText
  JavaScript for popup.html
*/

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

/* Quick Styles */
function qsset(e) {
  var fsize = document.getElementById("font_size").value;
  var ffamily = document.getElementById("font_family").value;
  var lheight = document.getElementById("line_height").value;
  chrome.tabs.executeScript(null,
    {code:"document.body.style.fontSize = '" + fsize + "'"});
  chrome.tabs.executeScript(null,
    {code:"document.body.style.fontFamily = '" + ffamily + "'"});
  chrome.tabs.executeScript(null,
    {code:"document.body.style.lineHeight = '" + lheight + "'"});
  //window.close();
}

/* Adapt and inject a style profile */
function adoptp(profile){
	
	// TODO: Remove all injected css and styles
	
	switch(profile){
		case 'default':
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
