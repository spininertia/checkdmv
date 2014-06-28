function check() {
    var date = parse_date()
    var info = {
        "firstName" : $('#firstName').val(),
        "lastName" : $('#lastName').val(),
        "dlNumber" : $('#dlNumber').val(),
        "birthDay" : date['year'],
        "birthMonth" : date['month'],
        "birthYear" : date['day'],
        "telArea" : $('#telArea').val(),
        "telPrefix" : $('#telPrefix').val(),
        "telSuffix" : $('#telSuffix').val()
    }
    alert(info['firstName']);
    chrome.storage.local.set({"info": info}, function() {
        message('info saved');
    });
}

function parse_date() {
    var raw_arr = $("#birthDate").val().trim().split()
    var date = {
        "year" : raw_arr[0],
        "month" : raw_arr[1],
        "day" : raw_arr[2]
    }
    return date
}

$('#myform').on('submit', check)

chrome.storage.local.get("info", function(items) {
    if (!$.isEmptyObject("info")) {
        map = items["info"];
        $('#firstName').val(map["firstName"]);
        $('#lastName').val(map["lastName"]);
        $('#dlNumber').val(map["dlNumber"]);
        $('#birthDate').val(map['birthYear'].concat("-", map['birthMonth'], "-", map['birthDay']));
        $('#telArea').val(map['telArea']);
        $('#telPrefix').val(map['telPrefix']);
        $('#telSuffix').val(map['telSuffix']);
    }
});