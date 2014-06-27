function check() {
    var info = {
        "firstName" : $('#firstName').val(),
        "lastName" : $('#lastName').val(),
        "dlNumber" : $('#dlNumber').val(),
        "birthDay" : $('#birthDay').val(),
        "birthMonth" : $('#birthMonth').val(),
        "birthYear" : $('#birthYear').val(),
        "telArea" : $('#telArea').val(),
        "telPrefix" : $('#telPrefix').val(),
        "telSuffix" : $('#telSuffix').val()
    }
    alert(info['firstName']);
    chrome.storage.local.set({"info": info}, function() {
        message('info saved');
    });
}

$('#myform').on('submit', check)

chrome.storage.local.get("info", function(items) {
    if (!$.isEmptyObject("info")) {
        map = items["info"];
        $('#firstName').val(map["firstName"]);
        $('#lastName').val(map["lastName"]);
        $('#dlNumber').val(map["dlNumber"]);
        $('#birthDay').val(map['birthDay']);
        $('#birthMonth').val(map['birthMonth']);
        $('#birthYear').val(map['birthYear']);
        $('#telArea').val(map['telArea']);
        $('#telPrefix').val(map['telPrefix']);
        $('#telSuffix').val(map['telSuffix']);
    }
});