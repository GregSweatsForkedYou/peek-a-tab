document.addEventListener('DOMContentLoaded', function () {
    var popupWindow;

    chrome.windows.getCurrent(function (win) {
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
            var tab = tabs[0];
            popupWindow = window.open(
                chrome.extension.getURL("app.html"),
                "Tabs you can peek at",
                "titlebar=no,width=300,height=" + (win.height - 10) + ",left=" + window.screenLeft + ",top=" + (window.screenTop - 70)
            );
            popupWindow.activeWindowId = win.id;
            popupWindow.selectedTabId = tab.id;

            window.close(); // close the Chrome extension pop-up
        });
    });

}, false);