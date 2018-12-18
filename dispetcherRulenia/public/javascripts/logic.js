var permit = document.getElementById("admit_btn");
var veto = document.getElementById("veto_btn");
var send = document.getElementById("send_btn");

var socket = io.connect("http://localhost:3032");

send.disabled = "disabled";

socket.on('event', (data) => {
    console.log(data);
    if (data.type === "waiting") {
        message_block.innerHTML += `<li> ${data.data}</li>`;
    }
    else if (data.type === "permit") {
        message_block.innerHTML += `<li style="color: green;"> ${data.data}</li>`;
    }
    else if (data.type === "veto") {
        message_block.innerHTML += `<li style="color: red;"> ${data.data}</li>`;
    }
    else if (data.type === "send"){
        message_block.innerHTML += `<li> ${data.data}</li>`;
    }
});

permit.onclick = () => {
    permit.disabled = "disabled";
    veto.disabled = "disabled";
    send.disabled = "";
    socket.emit("permit");
};

veto.onclick = () => {
    socket.emit("veto");
};

send.onclick = () =>{
    send.disabled = "disabled";
    socket.emit("send");
};