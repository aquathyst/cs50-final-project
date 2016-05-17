/*
 * Copyright (C) 2015-2016 Holly Zhou and Peter Wang. All rights reserved.
 *
 * AlphaText - Customize text for readability
 * Content script
 */

// Grab tab domain and pass to event page
var tabdomain = document.location.host;
chrome.runtime.sendMessage(tabdomain);