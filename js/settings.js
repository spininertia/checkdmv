function check() {
    var date = parse_date("birthDate");
    var postInfo = {
        "firstName" : $('#firstName').val(),
        "lastName" : $('#lastName').val(),
        "dlNumber" : $('#dlNumber').val(),
        "birthDay" : date['day'],
        "birthMonth" : date['month'],
        "birthYear" : date['year'],
        "telArea" : $('#telArea').val(),
        "telPrefix" : $('#telPrefix').val(),
        "telSuffix" : $('#telSuffix').val()
    }

    var dateInfo = {
        "beforeWhen" : $('#beforeWhen').val()
    }
    
    alert('Start checking slots!');
    chrome.storage.local.set({"postInfo": postInfo}, function(){});

    chrome.storage.local.set({"dateInfo": dateInfo}, function(){});
}

function parse_date(field) {
    var raw_arr = $("#".concat(field)).val().trim().split('-')
    var date = {
        "year" : raw_arr[0],
        "month" : raw_arr[1],
        "day" : raw_arr[2]
    }
    return date
}

$('#myform').on('submit', check)

chrome.storage.local.get("postInfo", function(items) {
    if (!$.isEmptyObject("postInfo")) {
        map = items["postInfo"];
        $('#firstName').val(map["firstName"]);
        $('#lastName').val(map["lastName"]);
        $('#dlNumber').val(map["dlNumber"]);
        $('#birthDate').val(map['birthYear'].concat("-", map['birthMonth'], "-", map['birthDay']));
        $('#telArea').val(map['telArea']);
        $('#telPrefix').val(map['telPrefix']);
        $('#telSuffix').val(map['telSuffix']);
    }
});

chrome.storage.local.get("dateInfo", function(items) {
    if (!$.isEmptyObject("dateInfo")) {
        $('#beforeWhen').val(items['dateInfo']['beforeWhen']);
    }
});