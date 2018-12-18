var vpp_permit = document.getElementById("vpp_permit_btn");
var vpp_veto = document.getElementById("vpp_veto_btn");
var fly_permit = document.getElementById("fly_permit_btn");
var fly_veto = document.getElementById("fly_veto_btn");

var socket = io.connect("http://localhost:3033");

fly_permit.disabled = "disabled";
fly_veto.disabled = "disabled";

socket.on('event', (data) => {
    console.log(data);
    if (data.type === "waiting") {
        message_block.innerHTML += `<li> ${data.data}</li>`;
    }
    else if (data.type === "vpp_permit") {
        message_block.innerHTML += `<li style="color: green;"> ${data.data}</li>`;
    }
    else if (data.type === "vpp_veto") {
        message_block.innerHTML += `<li style="color: red;"> ${data.data}</li>`;
    }
    else if (data.type === "fly_permit"){
        message_block.innerHTML += `<li style="color: green;"> ${data.data}</li>`;
    }
    else if (data.type === "fly_veto"){
        message_block.innerHTML += `<li style="color: red;"> ${data.data}</li>`;
    }
});

vpp_permit.onclick = () => {
    vpp_permit.disabled = "disabled";
    vpp_veto.disabled = "disabled";
    fly_permit.disabled = "";
    fly_veto.disabled = "";
    socket.emit("vpp_permit");
};

vpp_veto.onclick = () => {
    socket.emit("vpp_veto");
};
fly_permit.onclick = () =>{
    fly_permit.disabled = "disabled";
    fly_veto.disabled = "disabled";
    socket.emit("fly_permit");
};

fly_veto.onclick = () =>{
    socket.emit("fly_veto");
};