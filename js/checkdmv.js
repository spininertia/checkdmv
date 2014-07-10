// var express = require('express');
// var $ = require('jquery');
var url = "https://www.dmv.ca.gov/wasapp/foa/findDriveTest.do";

var data = {
    'numberItems':'1',
    'officeId':'632',
    'requestedTask':'DT',
    'resetCheckFields':'true'
};

var monthMap = {
   'January': 0,
   'February': 1,
   'March': 2,
   'April': 3,
   'May': 4,
   'June': 5,
   'July': 6,
   'August': 7,
   'September': 8,
   'October': 9,
   'November': 10,
   'December': 11,
}

var period = 1; // period to recheck appointment

/************** check part **************/

function process_result (response) {
    var html = $(response);
    var dateStr = $('#app_content', html).find('table').find('tr:nth-child(3)').find('.alert').html();
    var date = parse_date(dateStr);

    console.log(date);
    chrome.storage.local.get("dateInfo", function(items) {
        if (!$.isEmptyObject(items)) {
            var beforeDate = new Date(items['dateInfo']['beforeWhen']);
            if (date < beforeDate) {
                notify(date)
            }
        }
    });
}

function parse_date (date_str) {
    var arr = date_str.split(',');
    var day_month = arr[1].trim().split(' ');
    var month = day_month[0];
    var day = day_month[1];
    var arr2 = arr[2].trim().split(' ');
    var year = arr2[0];
    var am = arr2[3];
    var time = arr2[2].split(':');
    var hour = time[0];
    var minute = time[1];

    if (am === 'PM') {
        hour = parseInt(hour) + 12;
    }

    return new Date(year, monthMap[month], day, hour, minute);
}

function concat_map (map1, map2) {
    var map = $.extend(true, {}, map1);
    for (var key in map2) {
        map[key] = map2[key];
    }
    return map;
}

function submit_form (param) {
    chrome.storage.local.get("postInfo", function(item) {
        if (!$.isEmptyObject(item))  {
            params = concat_map(param, item['postInfo']);
            $.post(url=url, data=params, success=process_result);
        }
    });
}

function poll (alarm) {
    chrome.storage.local.get("officeInfo", function(item) {
        if (!$.isEmptyObject(item)) {
            for office in item['officeInfo']['officeId'] {
                var params = $.extend(true, {}, data)
                params['officeId'] = office
                submit_form(params)
            }  
        }
    })
    chrome.alarms.create("checkdmv", {delayInMinutes: period})
}

/************ notification part **********/

function notify (date) {
    var opt = {
      type: "basic",
      title: "Slot Available",
      message: date.toString(),
      iconUrl: "../images/notification.png",
      isClickable: true
  };

  var notification = chrome.notifications.create(
    date.toString(),
    opt,
    function (notificationId) {
      var sound = new Audio('../res/notification.mp3');
      sound.play();
    }
  );
}

function append (form, key, value) {
    var input = document.createElement('textarea');
    input.setAttribute('name', key);
    input.textContent = value;
    form.appendChild(input);
}

function redirect () {
    var postUrl = 'data:text/html;charset=utf8,';
    var form = document.createElement('form');
    form.method = 'POST';
    form.action = url;

    chrome.storage.local.get("postInfo", function(item) {
        if (!$.isEmptyObject(item))  {
            params = concat_map(data, item['postInfo']);
            for (var key in params) {
                append(form, key, params[key]);
            }
        }
    });

    postUrl += encodeURIComponent(form.outerHTML);
    postUrl += encodeURIComponent('<script>document.forms[0].submit();</script>');
    
    chrome.tabs.create({url: postUrl, active: true});
}


function handleNotClick (notId) {
    redirect()
}

function openSettingsPage(tab) {
    chrome.tabs.create({'url': chrome.extension.getURL('../settings.html')}, function(tab){});
}


chrome.notifications.onClicked.addListener(handleNotClick);
chrome.alarms.create("checkdmv", {delayInMinutes: period});
chrome.alarms.onAlarm.addListener(poll);
chrome.browserAction.onClicked.addListener(openSettingsPage);
chrome.runtime.onInstalled.addListener(openSettingsPage);


