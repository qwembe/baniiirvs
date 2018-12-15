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
    permit.disabled = "disabled";
}

function click_launch_engie() {
    launch_engie.disabled = "";
    //request_launch_engie.disabled = "disabled";
}

function click_runnway_entry() {
    runnway_entry.disabled = "";
}

function click_liftoff() {
    liftoff.disabled = "";
}


request_permit.onclick = () => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) callback(this.responseText);
    };
    xhttp.open("POST", "http://localhost:3000/ask_permit", true);
    xhttp.send();
    click_permit();
}
request_launch_engie.onclick = () => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) callback(this.responseText);
    };
    xhttp.open("POST", "http://localhost:3000/ask_launch", true);
    xhttp.send();
    launch_engie.disabled = "disabled"

}
request_runnway_entry.onclick = () => {

}
request_liftoff.onclick = () => {

}

function message(msg){
    out.innerHTML += `<div>${new Date()} : ${msg}</div>`
}

socket.on("currentState", (data) => {
    // console.log(data)
    if (data.type === "updateState") {
        state.innerHTML = `<div> ${data.data}</div>`
        current_state = data.data;
    }
})


socket.on("ask_permit", (data) => {
      console.log(data)
    if (data.type === "toADP") {
        data = data.data;
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function (data) {
            if (this.readyState == 4 && this.status == 200) {
                processADP_Answer(data);

            };
        };
        url = `http://${data.url}:${data.port}/ask_permit`
        console.log(url)
        xhttp.open("GET", url, true); //TODO ask adp?
        // xhttp.send();
        processADP_Answer(data); //TODO delete later
    }
})

function processADP_Answer(data){
    /*id(data.type === "")*/
    console.log("answerADP")
    socket.json.emit('answerADP',{type: "answerADP", data: true}) //TODO later data
    click_launch_engie()
}

socket.on("ask_launch", (data) => {
      console.log(data)
    if (data.type === "toRulenia") {
        data = data.data;
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function (data) {
            if (this.readyState == 4 && this.status == 200) {
                processRulenia_Answer(data);

            };
        };
        url = `http://${data.url}:${data.port}/ask_permit`
        console.log(url)
        xhttp.open("GET", url, true); //TODO ask rulenia?
        // xhttp.send();
        processRulenia_Answer(data); //TODO delete later
    }
})

function processRulenia_Answer(data){
    /*id(data.type === "")*/
    console.log("answerRulenia")
    socket.json.emit('answerRulenia',{type: "answerRulenia", data: true}) //TODO later data
    click_runnway_entry()
}


