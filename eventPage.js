function findMeetId(url){
    var str = url.slice(24);
    var def = "none";
    if(str.length <= 11) return def;
    str = str.slice(0,12);
    if(str[0]=="_") return def;
    return str;
}

chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
    if(request.todo == "showPageAction"){
        chrome.tabs.query({active:true,currentWindow:true},function(tabs){
            chrome.pageAction.show(tabs[0].id);
            var url = tabs[0].url;
            var meetid = findMeetId(url);
            chrome.storage.sync.set({'meetId':meetid});
        });
    }
});