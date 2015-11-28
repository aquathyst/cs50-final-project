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
  var fontsize = document.getElementById("fontsize");
  var size = fontsize.length;
  for (var i = 0; i < size; i++) {
    fontsize.options[i].addEventListener('click', click);
  }
});




var url=chrome.tabs.Tab.url;
var domain=false;

function getdomain(url){
	if(url.indexOf('/'))
	if(url.indexOf("http://")!==-1)
	{
		domain=
	}
	else if(url.indexOf("https://")!==-1)
	{
		domain=
	}
	else
	{
		return false;
	}
}

chrome.tabs.query(url,)

/* On-off switch scripts */
var onoff=false;

function checkonoff(){
	if(onoff===true)
	{
		document.getElementById('on').id='off';
	}

}

function showonofftext(){
	if(onoff===true)
	{
		document.getElementById('onofftext').innerHTML='Switch off';
	}
	else
	{
		document.getElementById('onofftext').innerHTML='Switch on';
	}
}

function switch(){
	if(onoff===true){
		onoff=false;
		
		document.getElementById('on').id='off';

	}
	else{
		onoff=true;
		document.getElementById('off').id='on';
	}
}

/* Saving domain preferences scripts */
var saved=false;

function checksave(domain){
	
	if(saved===true)
	{
		document.getElementById('savepage').onclick="unsave()";
		document.getElementById('savepage').id='unsavepage';
		onoff=true;
	}
}

function showsavetext(){
	if(saved===true)
	{
		document.getElementById('savetext').innerHTML='Don\'t always use on domain';
	}
	else
	{
		document.getElementById('savetext').innerHTML='Always use on domain';
	}
}

function save(domain,profile){
	document.getElementById('savepage').onclick="unsave(domain)";
	document.getElementById('savepage').id='unsavepage';

}

function unsave(domain){
	document.getElementById('unsavepage').onclick="save(domain,profile)";
	document.getElementById('unsavepage').id='savepage';

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