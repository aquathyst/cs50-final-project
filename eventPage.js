/*
 * Copyright (C) 2015-2016 Holly Zhou and Peter Wang. All rights reserved.
 *
 * AlphaText - Customize text for readability
 * Event page
 */

/* CSS profiles */
var css1 = '';
var css2 = '';
var css3 = '';

/* Prepare fallback fonts for CSS */
function fallbackfont(font) {
	if(font === 'Cambria' || font === 'Garamond' || font === 'Georgia' || font === 'Times New Roman'){
		return 'serif';
	}
	else{
		return 'sans-serif';
	}
}

/* Make CSS */
function makeCSS(pnum) {
	// Get saved info
	var fontvalue = localStorage.getItem("profileItem" + pnum);
	var values = "";
	var fsize = "";
	var ffamily = "";
	var lheight = "";

	if (fontvalue !== null){
		values = fontvalue.split(" - ");
		fsize = values[0];
		ffamily = values[1];
		lheight = values[2];

		// Generate CSS string
		var csstemp = "body.alphatextp p,body.alphatextp a,body.alphatextp li,body.alphatextp td{" +
			"font-size:" + fsize + " !important;}" +
			"body.alphatextp *{" +
			"font-family:" + ffamily + "," + fallbackfont(ffamily) + " !important;" +
			"line-height:" + lheight + " !important;}";

		// Save into css vars
		switch(pnum){
			case 1:
				css1 = csstemp;
				break;
			case 2:
				css2 = csstemp;
				break;
			case 3:
				css3 = csstemp;
				break;
			default:
				break;
		}
	}
	else{
		// Not present or valid style set profile
		switch(pnum)
		{
			case 1:
				css1 = '';
				break;
			case 2:
				css2 = '';
				break;
			case 3:
				css3 = '';
				break;
			default:
				break;
		}
	}
}

// Adopt the saved profile
function preadoptp(targetTab,savedpn){
	// Put in .alphatextp if needed
	chrome.tabs.executeScript(targetTab,
		{code:"document.body.classList.add('alphatextp');"});
	
	// Insert CSS profile
	switch(savedpn){
		case 1:
			makeCSS(1);
			chrome.tabs.insertCSS(targetTab,{code:css1});
			break;
		case 2:
			makeCSS(2);
			chrome.tabs.insertCSS(targetTab,{code:css2});
			break;
			case 3:
			makeCSS(3);
			chrome.tabs.insertCSS(targetTab,{code:css3});
			break;
		default:
			return;
	}

	// Log active profile on HTML DOM in case of next control panel launch
	chrome.tabs.executeScript(targetTab,
		{code:"document.body.classList.add('alphatextPtag" + String(savedpn) + "');"});

	// Log
	console.log("AlphaText: Profile " + String(savedpn) + " automatically adopted.");
}

// Provide path for the browser icon with profile number
function proficonpath(profnum){
	switch(profnum){
		case 1:
			return {
				"19": "icons/profiles/icon-19-1.png",
				"38": "icons/profiles/icon-38-1.png"
			};
		case 2:
			return {
				"19": "icons/profiles/icon-19-2.png",
				"38": "icons/profiles/icon-38-2.png"
			};
		case 3:
			return {
				"19": "icons/profiles/icon-19-3.png",
				"38": "icons/profiles/icon-38-3.png"
			};
		 default:
		 	return null;
	}
}

// Listen for a message from an updated tab from its content script and adopt profile if save matches domain
chrome.runtime.onMessage.addListener(
	function(tabdomain,sender,sendResponse){
		var savedp = localStorage.getItem('dom: ' + tabdomain);
		if(savedp !== null){
			// Saved domain! Check if profile still exists
			if(localStorage.getItem('profileItem' + savedp) !== null){
				// Adopt profile
				preadoptp(parseInt(sender.tab.id),parseInt(savedp,10));
			}
			else{
				console.error("AlphaText: Profile "+String(savedpn)+" saved but it no longer exists!");
			}
			
			// Adjust browser icon
			chrome.browserAction.setIcon({path:proficonpath(parseInt(savedp,10)),tabId:parseInt(sender.tab.id)});
		}
	});