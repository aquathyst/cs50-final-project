/*
  AlphaText
  Content Scipt
*/

/* Include JQuery */
document.getElementsByTagName("body")[0].innerHTML+="<script src='" + chrome.extension.getURL("3rdparty/jquery-2.1.4.min.js") + "'></script>";

// /* Check on off */
// var onoffstate='off';
// if($(".alphatextcustomp").length>0){onoffstate='on';}
// else{onoffstate='off';}


// Now tell popup about it 
// chrome.runtime.sendMessage({state:onoffstate});


// chrome.runtime.onMessage.addListener(
//     function(message, sender, sendResponse) {
//         switch(message.type) {
//             case "getCount":
//                 sendResponse(count);
//                 break;
//             default:
//                 console.error("Unrecognised message: ", message);
//         }
//     }
// );



// var port = chrome.runtime.connect({name:"onoffp"});
// port.postMessage({state:"ready"});
// port.onMessage.addListener(function(msg)
// {
// 	if(msg.req=="checkonoff")
// 	{
// 		if($(".alphatextcustomp").length>0){onoffstate=true;}
// 		else{onoffstate=false;}

// 		if(onoffstate===false)
// 		{
// 			port.postMessage({state:"off"});
// 		}
// 		else
// 		{
// 			port.postMessage({state:"on"});
// 		}
// 	}
// });
