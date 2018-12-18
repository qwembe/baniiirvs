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
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) callback(this.responseText);
    };
    xhttp.open("POST", "http://localhost:3000/ask_line", true);
    xhttp.send();
    runnway_entry.disabled = "disabled"
}
request_liftoff.onclick = () => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) callback(this.responseText);
    };
    xhttp.open("POST", "http://localhost:3000/ask_liftoff", true);
    xhttp.send();
    liftoff.disabled = "disabled"
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

            }
            ;
        };
        url = `http://${data.url}:${data.port}/ask_permit`
        console.log(url)
        xhttp.open("GET", url, true); //TODO ask adp?
        xhttp.send();
        processADP_Answer(data); //TODO delete later
    }
})

function processADP_Answer(data) {
    /*id(data.type === "")*/
    console.log("answerADP")
    socket.json.emit('answerADP', {type: "answerADP", data: true}) //TODO later data
    click_launch_engie()
}

socket.on("ask_launch", (data) => {  //done
    console.log(data)
    if (data.type === "toRulenia") {
        data = data.data;
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function (data) {
            if (this.readyState == 4 && this.status == 200) {
                data = JSON.parse(data.currentTarget.response);
                processRulenia_Answer(data);
            }
            ;
        };
        url = `http://${data.url}:${data.port}/ask_launch`
        console.log(url)
        xhttp.open("GET", url, true);
        xhttp.send();
    }
})

function processRulenia_Answer(data) {
    if (data.type === "response") {
        if (data.data) {
            socket.json.emit('answerRulenia', {type: "answerRulenia", data: true}) //TODO later data
            click_runnway_entry()
        }
    }
}

socket.on("ask_line", (data) => {  // done
    console.log(data)
    if (data.type === "toStarta") {
        data = data.data;
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function (data) {
            if (this.readyState == 4 && this.status == 200) {
                data = JSON.parse(data.currentTarget.response);
                processLine_Answer(data);
            }
            ;
        };
        url = `http://${data.url}:${data.port}/ask_line`
        console.log(url)
        xhttp.open("GET", url, true);
        xhttp.send();
    }
})

function processLine_Answer(data) {
    if (data.type === "response") {
        if (data.data) {
            socket.json.emit('answerLine', {type: "answerLine", data: true}) //TODO later data
            click_liftoff();
        }
    }
}

socket.on("ask_liftoff", (data) => {
    console.log(data)
    if (data.type === "toStarta") {
        data = data.data;
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function (data) {
            if (this.readyState == 4 && this.status == 200) {
                data = JSON.parse(data.currentTarget.response);
                processLiftOff_Answer(data);
            }
            ;
        };
        url = `http://${data.url}:${data.port}/ask_liftoff`
        console.log(url)
        xhttp.open("GET", url, true); //TODO ask rulenia?
        xhttp.send();
        //processLiftOff_Answer(data); //TODO delete later
    }
})

function processLiftOff_Answer(data) {
    /*id(data.type === "")*/
    if (data.type === "response") {
        if (data.data) {
            console.log("answerLiftOff")
            socket.json.emit('answerLiftOff', {type: "answerLiftOff", data: true}) //TODO later data
        }
    }
}

socket.on("message", (data) => {
    console.log(data);
    if (data.type === "command") {
        post(data.data, 'green')
    }
    if (data.type === "changeState") {
        post(data.data, 'blue')
    }
})


function post(msg, col) {
    d = new Date()
    out.innerHTML += `<li class='w3-text-${col}'>${d.toLocaleDateString()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()} : ${msg}</li>`  // TODO make messages
}

