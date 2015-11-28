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







var onoff='false';

function showonofftext(){
	if(onoff='true')
	{
		document.getElementById('onofftext').innerHTML='Switch off';
	}
	else
	{
		document.getElementById('onofftext').innerHTML='Switch on';
	}
}

/* Swtich on or off */
function switch(){
	if(onoff==='on'){
		onoff='off';
		
		document.getElementById('on').id='off';

	}
	else{
		onoff='on';
		document.getElementById('off').id='on';
	}
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

var saved=false;

function checksave(domain){
	
	if(saved=true)
	{
		document.getElementById('savepage').onclick='unsave()';
		document.getElementById('savepage').id='unsavepage';
	}
}

function showsavetext(){
	if(saved='true')
	{
		document.getElementById('savetext').innerHTML='Don\'t always use on domain';
	}
	else
	{
		document.getElementById('savetext').innerHTML='Always use on domain';
	}
}

function save(domain,profile){
	document.getElementById('savepage').onclick='unsave()';
	document.getElementById('savepage').id='unsavepage';

}

function unsave(domain){
	document.getElementById('unsaveoage').onclick='save()';
	document.getElementById('unsavepage').id='savepage';
	
}