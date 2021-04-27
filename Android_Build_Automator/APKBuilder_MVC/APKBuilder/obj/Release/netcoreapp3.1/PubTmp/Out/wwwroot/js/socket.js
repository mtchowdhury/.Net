"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/clientHub").build();

//Disable send button until connection is established
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (user, message,path) {
    if (user != document.getElementById("guid").value) return;//taken it from the hidden input field
    hideProgress();
    if (message == "successful" && path) {
        document.getElementById("filePath").value = path;
        document.getElementById("dl-btn").style.display = "block";
        var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        var encodedMsg = user + " request is " + msg;
        var li = document.createElement("li");
        li.textContent = encodedMsg;
        document.getElementById("messagesList").appendChild(li);
        document.getElementById("successDiv").style.display="block";
    } else {
        var err = path.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        var encodedErr = user + " request failed. error: " + path;
        var lir = document.createElement("li");
        lir.textContent = encodedErr;
        document.getElementById("errorList").appendChild(lir);
        document.getElementById("errorDiv").style.display = "block";
    }
   
});

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

//document.getElementById("sendButton").addEventListener("click", function (event) {
//    //var user = document.getElementById("userInput").value;
//    var message = document.getElementById("messageInput").value;
//    showProgress();
//    connection.invoke("SendMessage", user, message).catch(function (err) {
//        return console.error(err.toString());
//    });
//    event.preventDefault();
//});
document.getElementById("sendButton").addEventListener("click", function (event) {
    var hash = uuidv4();
    document.getElementById("guid").value = hash;
    document.getElementById("messagesList").style.display = "none";
    document.getElementById("errorList").style.display = "none";
    //$("#spinner").append("entity: " + $("#entity").text() +"" );
    showProgress();
});

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

