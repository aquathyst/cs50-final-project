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







var onoff='off';

/* Swtich on or off */
function switch(){
	if(onoff==='on'){
		onoff='off';
	}
	else{
		onoff='on';

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