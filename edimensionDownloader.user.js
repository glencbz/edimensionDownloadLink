// ==UserScript==
// @name         eDimension Download Link
// @namespace    https://github.com/glencbz/edimensionDownloadLink
// @version      0.92
// @description  Adds a download link for eDimension
// @author       Glen Choo
// @match        http://edimension.sutd.edu.sg/course/view.php?id=*
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @require 	http://code.jquery.com/jquery-latest.js
// ==/UserScript==
/* jshint -W097 */
'use strict';
 
var $ = window.jQuery;
$(function{
var requestHeaders = {
	"Host": "edimension.sutd.edu.sg",
	"Connection": "keep-alive",
	"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
	"Upgrade-Insecure-Requests": 1,
	"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36",
	"Referer": window.location.href,
	"Accept-Encoding": "gzip, deflate, sdch",
	"Accept-Language": "en-GB,en-US;q=0.8,en;q=0.6",
	"Cookie": document.cookie,
};
var anchors = $(".mod-indent>a");
function requestAppend(anchor, i){
	GM_xmlhttpRequest({
		method: "get",
		headers: requestHeaders,
		url: anchor.attr("href"),
		onreadystatechange: function(response){
	        if (response.readyState != 4)
	            return;
	        if (--i >= 0)
		        anchorCheck(i);
	        var tagStart = response.responseText.indexOf("<object");
	        if (tagStart !== -1){
	        	var tagEnd = response.responseText.indexOf("</object>", tagStart) + "</object>".length;
	        	var urlStart = response.responseText.indexOf('data="', tagStart) + 'data="'.length;
	        	var urlEnd = response.responseText.indexOf('"', urlStart);
	        	var style = "color:green";
	        	var innerHTML = "Download";
	        }
	        else{
	        	var outerTagStart = response.responseText.indexOf("resourceworkaround");
	        	var urlStart = response.responseText.indexOf('href="', outerTagStart) + 'href="'.length;
	        	var urlEnd = response.responseText.indexOf('"', urlStart);
	        	// var style = "color:orange";
	        	// var innerHTML = "Pop up";
	        	var style = "color:green";
	        	var innerHTML = "Download";
	        }

			var resourceUrl = response.responseText.substring(urlStart, urlEnd);
			var matchingAnchors = $("a[href='" + anchor.attr('href') + "']");
			matchingAnchors.each(function(i, anchor){
					var $anchor = $(anchor);
					if ($anchor.find(".download-link").length === 0)
						$anchor.append('<a href=' + resourceUrl + ' download target="_blank" style='+ style + ' class="download-link download' + i + '">' + innerHTML+'</a>');
				}
			);

			progress += 1;
			$(".progress-bar-front").css("width", (progress/requestNums) * 100 + "%" );
			if (progress === requestNums){
				$(".progress-bar-back").remove();
				$(".progress-bar-front").remove();
			}
		},
	});	
}
$("head").append('<style type="text/css"> .download-link {margin-left:2%;}</style>');
$("head").append('<style type="text/css"> .progress-bar-back {position: fixed; width: 13%; top: 0; right: 0; background-color: #E0E0E0;}</style>');
$("head").append('<style type="text/css"> .progress-bar-front {position: relative; width: 0%; background-color: #4AC74A;}</style>');
$("head").append('<style type="text/css"> .progress-bar {height: 25px; border-radius: 3px; transition: ease-in 0.1s;}</style>');

$("body").append('<div class="progress-bar-back progress-bar"></div>');
$(".progress-bar-back").append('<div class="progress-bar-front progress-bar"></div>');

var progress = 0;
var requestNums = 0;
for (var i = anchors.length - 1; i >= 0; i--){
	if ($(anchors[i]).children("img").attr("src") == "http://edimension.sutd.edu.sg/theme/image.php/campus/core/1434085985/f/pdf")
		requestNums += 1;
}

var i = anchors.length;
function anchorCheck(i){
	try{
		var $anchor = $(anchors[i]);
		if ($anchor.children("img").attr("src") == "http://edimension.sutd.edu.sg/theme/image.php/campus/core/1434085985/f/pdf"){
			requestAppend($anchor, i);
		}else{
			if(--i >= 0)
				anchorCheck(i);
		}
	}
	catch (err){
		console.log(err);
	}
}

anchorCheck(i);

$(".mod-indent>a").prop("onclick", null);
});