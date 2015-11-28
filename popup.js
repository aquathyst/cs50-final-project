/*
  AlphaText
  JavaScript for popup.html
*/

function click(e) {

  chrome.tabs.executeScript(null,
      {code:"document.body.style.fontSize = '" + e.target.value + "'"});
  window.close();

}

document.addEventListener('DOMContentLoaded', function () {
  var fontsize = $("#fontsize");
  var size = fontsize.length;
  for (var i = 0; i < size; i++) {
    fontsize.options[i].addEventListener('click', click);
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

function switch(){
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