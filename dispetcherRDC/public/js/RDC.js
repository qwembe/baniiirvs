var out = document.getElementById("message");
var send_command = document.getElementById("submit_command");
var command = document.getElementById("command");

send_command.disabled = "";

submit_command.onclick = () => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200)
            callback(this.responseText);
    };
    xhttp.open("POST", "http://localhost:3000/readCommand", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({type: "command", data: command.value}));
}
