var chat = document.getElementById("chat");
var permit = document.getElementById("permit_btn");
var forbidden = document.getElementById("forbidden_btn");

var socket = io.connect("http://localhost:3031");

socket.on("event", (data) => {
    console.log(data);
    if (data.type === "message") {
        chat.innerHTML += `<li> ${data.data}</li>`;
    } 
    else if (data.type === "permit") {
    	chat.innerHTML += `<li style="color: green;"> ${data.data}</li>`;
    }
    else if (data.type === "forbidden") {
    	chat.innerHTML += `<li style="color: red;"> ${data.data}</li>`;
    }
});


permit.disabled = "";
forbidden.disabled = "";


permit.onclick = () => {
	permit.disabled = "disabled";
	forbidden.disabled = "disabled";
	socket.emit("permit");
};

forbidden.onclick = () => {
	socket.emit("forbidden");
};