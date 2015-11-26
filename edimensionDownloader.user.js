// ==UserScript==
// @name         eDimension Download Link
// @namespace    https://github.com/glencbz/edimensionDownloadLink
// @version      0.94
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
$(function(){
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

$("head").append('<style type="text/css"> .download-link {margin-left:2%;}</style>');
$("head").append('<style type="text/css"> .progress-bar-back {position: fixed; width: 13%; top: 0; right: 0; background-color: #E0E0E0;}</style>');
$("head").append('<style type="text/css"> .progress-bar-front {position: relative; width: 0%; background-color: #4AC74A;}</style>');
$("head").append('<style type="text/css"> .progress-bar {height: 25px; border-radius: 3px; transition: ease-in 0.1s;}</style>');

$("body").append('<div class="progress-bar-back progress-bar"></div>');
$(".progress-bar-back").append('<div class="progress-bar-front progress-bar"></div>');

var originalAnchors = $(".mod-indent>a");
var anchors = [];
var progress = 0;
var requestNums = 0;
for (var i = 0; i < originalAnchors.length; i++){
	var $anchor = $(originalAnchors[i]);
	if ($anchor.children("a.download-link").length < 1 && $anchor.children("img").attr("src") == "http://edimension.sutd.edu.sg/theme/image.php/campus/core/1434085985/f/pdf")
		anchors.push($anchor);
}

requestNums = anchors.length;

function requestAppend(i){
	var anchor = anchors[i];
	GM_xmlhttpRequest({
		method: "get",
		headers: requestHeaders,
		url: anchor.attr("href"),
		onreadystatechange: function(response){
	        if (response.readyState != 4)
	            return;
	        if (i > 0)
		        requestAppend(i - 1);
		    console.log(i);
		    var responseDom = $.parseHTML(response.responseText);
	        var $responseDom = $(responseDom);
	        var objectNode = $responseDom.find("object");
	        var resourceUrl;
	        if (objectNode.length !== 0) 
	        	resourceUrl = objectNode.attr("data")
	        else
	        	resourceUrl = $responseDom.find(".resourceworkaround>a").attr("href");
        	var style = "color:green";
        	var innerHTML = "Download";
			var matchingAnchors = $("a[href='" + anchor.attr('href') + "']");
			matchingAnchors.each(function(index, anchor){
					var $anchor = $(anchor);
					if ($anchor.find(".download-link").length === 0){
						$anchor.append('<a href=' + resourceUrl + ' download target="_blank" style='+ style + ' class="download-link download' + i + '">' + innerHTML+'</a>');
					}
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
requestAppend(anchors.length - 1);

$(".mod-indent>a").prop("onclick", null);
});