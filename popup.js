// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


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
