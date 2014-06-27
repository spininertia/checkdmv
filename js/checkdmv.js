// var express = require('express');
// var $ = require('jquery');
var url = "https://www.dmv.ca.gov/wasapp/foa/findDriveTest.do";
data = {
    'numberItems':'1',
    'officeId':'632',
    'requestedTask':'DT',
    // 'firstName':'siping',
    // 'lastName':'ji',
    // 'dlNumber':'F7728530',
    // 'birthMonth':'04',
    // 'birthDay':'24',
    // 'birthYear':'1991',
    // 'telArea':'412',
    // 'telPrefix':'304',
    // 'telSuffix':'6862',
    'resetCheckFields':'true'
};

monthMap = {
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

function parse_result (response) {
    var html = $(response);
    var dateStr = $('#app_content', html).find('table').find('tr:nth-child(3)').find('.alert').html();
    var date = process_date(dateStr);
    console.log(date);
}

function process_date (date_str) {
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

function concat_map(map1, map2) {
    var map = $.extend(true, {}, map1);
    for (var key in map2) {
        map[key] = map2[key];
    }

    return map;
}

function submit_form(alarm) {
    chrome.storage.local.get("info", function(item) {
        if (!$.isEmptyObject(item))  {
            params = concat_map(data, item['info']);
            $.post(url=url, data=params, success=parse_result);
        }
    });
    chrome.alarms.create("checkdmv", {delayInMinutes: 0.2})
}

chrome.alarms.create("checkdmv", {delayInMinutes: 0.2})
chrome.alarms.onAlarm.addListener(submit_form)

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({'url': chrome.extension.getURL('../settings.html')}, function(tab){});
});

