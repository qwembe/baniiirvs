var out = document.getElementById("message");
var state = document.getElementById("state");

var permit = document.getElementById("request_permit");
var launch_engie = document.getElementById("request_launch_engie");
var runnway_entry = document.getElementById("request_runnway_entry");
var liftoff = document.getElementById("request_liftoff");

var socket = io.connect("http://localhost:3030");
var current_state;

permit.disabled = "";
launch_engie.disabled = "disabled";
runnway_entry.disabled = "disabled";
liftoff.disabled = "disabled";

function click_permit() {
    request_permit.disabled = "disabled";
    request_launch_engie.disabled = "";
}

function click_launch_engie() {
    request_launch_engie.disabled = "disabled";
}

function click_runnway_entry() {
    request_runnway_entry.disabled = "disabled";
}

function click_liftoff() {
    request_liftoff.disabled = "disabled";
}


socket.on("hello", (data) => {
    console.log(data)
    if (data.type === "message") {
        out.innerHTML += `<div> ${data.data}</div>`
        current_state = data.data;
    }
})

function message(){
    
}

socket.on("currentState", (data) => {
    console.log(data)
    if (data.type === "updateState") {
        state.innerHTML = `<div> ${data.data}</div>`
        current_state = data.data;
    }
})

request_permit.onclick= () => {
    alert("!")
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) callback(this.responseText);
    };
    xhttp.open("POST", "http://localhost:3000/ask_permit", true);
    xhttp.send();

    click_permit();
}
request_launch_engie.onclick(() => {

})
request_runnway_entry.onclick(() => {

})
request_liftoff.onclick(() => {

})

