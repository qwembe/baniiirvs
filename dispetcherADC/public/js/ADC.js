var out = document.getElementById("message");
var to_RDC = document.getElementById("to_RDC");
var send_command = document.getElementById("submit_command");
var command = document.getElementById("command");

var socket = io.connect("http://localhost:3034");

to_RDC.disabled = "";
send_command.disabled = "";

function click_toRDC() {
    to_RDC.disabled = "disabled";
    send_command.disabled = "disabled";
}

to_RDC.onclick = () => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200)
        //callback(this.responseText);
        //delete later
            console.log(data)
    };
    xhttp.open("POST", "http://localhost:3000/toRDC", true);
    xhttp.send();
    click_toRDC();
}

submit_command.onclick = () => {
    try {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200)
                callback(this.responseText);
        };
        xhttp.open("POST", "http://localhost:3000/readCommand", true);
        xhttp.setRequestHeader("Content-Type", "application/json");   // !!!important
        xhttp.send(JSON.stringify({type: "command", data: command.value}));  // !!!important
    } catch (e) {
        console.log(e)

    }
}

socket.on("hello",()=>{
    // TODO Ринат, сделай здесь приветсвенное. "Контроль получен" например
   // типо в этом методе будут выполнятся ,когда вообще можно будет отправлять сообщения, ок? и в рдц тоже

})
