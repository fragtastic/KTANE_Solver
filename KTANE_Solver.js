var version = 1;

var indicators = {
    'SND': false,
    'CLR': false,
    'CAR': false,
    'IND': false,
    'FRQ': false,
    'SIG': false,
    'NSA': false,
    'MSA': false,
    'TRN': false,
    'BOB': false,
    'FRK': false
};

var ports = {
    'DVI-D': false,
    'Parallel': false,
    'PS2': false,
    'RJ-45': false,
    'Serial': false,
    'Stereo RCA': false
};

var serialNumber = "";

var strikes = 0;

function indicators_button() {
    for (var i in indicators) {
        var indicatorElem = document.getElementById(i);
        indicators[i] = indicatorElem.checked;
    }
}

function init_indicators() {
    var indicatorsElem = document.getElementById("indicators");
    for (var i in indicators) {
        var e = document.createElement("INPUT");
        e.setAttribute("type", "checkbox");
        e.setAttribute("id", i);
        e.setAttribute("onclick", "indicators_button()");
        indicatorsElem.innerHTML += i;
        indicatorsElem.appendChild(e);
    }
}

function ports_button() {
    for (var p in ports) {
        var portElem = document.getElementById(p);
        indicators[p] = portElem.checked;
    }
}

function init_ports() {
    var portsElem = document.getElementById("ports");
    for (var p in ports) {
        var e = document.createElement("INPUT");
        e.setAttribute("type", "checkbox");
        e.setAttribute("id", p);
        e.setAttribute("onclick", "ports_button()");
        portsElem.innerHTML += p;
        portsElem.appendChild(e);
    }
}

function init_batteries() {
    var e = document.createElement("INPUT");
    e.setAttribute("type", "number");
    e.setAttribute("id", "batteries_number");
    e.setAttribute("min", "0");
    e.setAttribute("max", "10");
    e.setAttribute("value", "0");
    var batteriesElem = document.getElementById("batteries");
    batteriesElem.innerHTML += "Batteries";
    batteriesElem.appendChild(e);
}

function get_batteries() {
    var batteriesElem = document.getElementById("batteries_number");
    return batteriesElem.value;
}

function init_strikes() {
    var e = document.createElement("INPUT");
    e.setAttribute("type", "number");
    e.setAttribute("id", "strikes_number");
    e.setAttribute("min", "0");
    e.setAttribute("max", "3");
    e.setAttribute("value", "0");
    var strikesElem = document.getElementById("strikes");
    strikesElem.innerHTML += "Strikes";
    strikesElem.appendChild(e);
}

function init_wires() {
    var wiresElem = document.getElementById("wires");
    var colors = ["none", "red", "white", "blue", "black", "yellow"];
    for (var i = 1; i < 7; i++) {
        var e = document.createElement("select");
        e.setAttribute("id", "wires_wire_" + i);
        for (var c in colors) {
            var n = document.createElement("option");
            n.setAttribute("value", colors[c]);
            n.innerHTML = colors[c];
            e.appendChild(n);
        }
        wiresElem.appendChild(e);
    }
    var b = document.createElement("input");
    b.setAttribute("type", "button");
    b.setAttribute("id", "wires_solve_button");
    b.setAttribute("value", "Solve");
    b.setAttribute("onclick", "solve_wires()");
    wiresElem.appendChild(b);

    var a = document.createElement("div");
    a.setAttribute("id", "wires_result");
    wiresElem.appendChild(a);
}

function init_the_button() {
    var buttonElem = document.getElementById("the_button");
    var labels = ["Abort", "Detonate", "Hold", "something else"];
    var colors = ["red", "blue", "white", "yellow", "something else"];

    var e = document.createElement("select");
    e.setAttribute("id", "the_button_label");
    for (var l in labels) {
        var n = document.createElement("option");
        n.setAttribute("value", labels[l]);
        n.innerHTML = labels[l];
        e.appendChild(n);
    }
    buttonElem.appendChild(e);

    e = document.createElement("select");
    e.setAttribute("id", "the_button_color");
    for (var c in colors) {
        var n = document.createElement("option");
        n.setAttribute("value", colors[c]);
        n.innerHTML = colors[c];
        e.appendChild(n);
    }
    buttonElem.appendChild(e);

    var b = document.createElement("input");
    b.setAttribute("type", "button");
    b.setAttribute("id", "the_button_solve_button");
    b.setAttribute("value", "Solve");
    b.setAttribute("onclick", "solve_the_button()");
    buttonElem.appendChild(b);

    var a = document.createElement("div");
    a.setAttribute("id", "the_button_result");
    buttonElem.appendChild(a);
}

function solve_the_button() {
    var o = document.getElementById("the_button_result");
    var button_label = document.getElementById("the_button_label").value;
    var button_color = document.getElementById("the_button_color").value;
    if (button_color == "blue" && button_label == "Abort") {
        o.innerHTML = "Refer to \"Releasing a held button\". blue: 4 white: 1 yellow: 5 other: 1";
    }
    else if (get_batteries() > 1 && button_label == "Detonate") {
        o.innerHTML = "Press and immediately release the button.";
    }
    else if (button_color == "white" && indicators["CAR"]) {
        o.innerHTML = "Refer to \"Releasing a held button\". blue: 4 white: 1 yellow: 5 other: 1";
    }
    else if (get_batteries() > 2 && indicators["FRK"]) {
        o.innerHTML = "Press and immediately release the button.";
    }
    else if (button_color == "yellow") {
        o.innerHTML = "Refer to \"Releasing a held button\". blue: 4 white: 1 yellow: 5 other: 1";
    }
    else if (button_color == "red" && button_label == "Hold") {
        o.innerHTML = "Press and immediately release the button.";
    }
    else {
        o.innerHTML = "Refer to \"Releasing a held button\". blue: 4 white: 1 yellow: 5 other: 1";
    }
}

function init_serial_number() {
    var e = document.createElement("INPUT");
    e.setAttribute("id", "serial_number_string");
    var serialElem = document.getElementById("serial_number");
    serialElem.innerHTML += "Serial Number";
    serialElem.appendChild(e);
}

function solve_wires() {
    var wires_count = getWiresCount();
    switch (wires_count) {
        case 3:
            solve_3_wires();
            break;
        case 4:
            solve_4_wires();
            break;
        case 5:
            solve_5_wires();
            break;
        case 6:
            solve_6_wires();
            break;
        default:
            var o = document.getElementById("wires_result");
            o.innerHTML = "Invalid wires.";
    }

    function solve_3_wires() {
        var num_red = 0;
        var last_wire = "";
        var num_blue = 0;
        for (var i = 1; i < 7; i++) {
            var wireElem = document.getElementById("wires_wire_" + i);
            if (wireElem.value == "red") {
                num_red++;
            }
            if (wireElem.value == "blue") {
                num_blue++;
            }
            if (wireElem.value != "none") {
                last_wire = wireElem.value;
            }
        }
        if (num_red == 0) {
            var o = document.getElementById("wires_result");
            o.innerHTML = "Cut the second wire.";
        }
        else if (last_wire == "white") {
            var o = document.getElementById("wires_result");
            o.innerHTML = "Cut the last wire.";
        }
        else if (num_blue > 1) {
            var o = document.getElementById("wires_result");
            o.innerHTML = "Cut the last blue wire.";
        }
        else {
            var o = document.getElementById("wires_result");
            o.innerHTML = "Cut the last wire.";
        }
    }

    function solve_4_wires() {
        var num_red = 0;
        var last_wire = "";
        var num_blue = 0;
        var num_yellow = 0;
        for (var i = 1; i < 7; i++) {
            var wireElem = document.getElementById("wires_wire_" + i);
            if (wireElem.value == "red") {
                num_red++;
            }
            if (wireElem.value == "blue") {
                num_blue++;
            }
            if (wireElem.value == "yellow") {
                num_yellow++;
            }
            if (wireElem.value != "none") {
                last_wire = wireElem.value;
            }
        }

        if (num_red > 1 && is_last_serial_odd()) {
            var o = document.getElementById("wires_result");
            o.innerHTML = "Cut the last red wire.";
        }
        else if (num_red == 0 && last_wire == "yellow") {
            var o = document.getElementById("wires_result");
            o.innerHTML = "Cut the first wire.";
        }
        else if (num_blue == 1) {
            var o = document.getElementById("wires_result");
            o.innerHTML = "Cut the first wire.";
        }
        else if (num_yellow > 1) {
            var o = document.getElementById("wires_result");
            o.innerHTML = "Cut the second wire.";
        }
        else {
            var o = document.getElementById("wires_result");
            o.innerHTML = "Cut the first wire.";
        }
    }

    function solve_5_wires() {
        var num_red = 0;
        var last_wire = "";
        var num_black = 0;
        var num_yellow = 0;
        for (var i = 1; i < 7; i++) {
            var wireElem = document.getElementById("wires_wire_" + i);
            if (wireElem.value == "red") {
                num_red++;
            }
            else if (wireElem.value == "black") {
                num_black++;
            }
            else if (wireElem.value == "yellow") {
                num_yellow++;
            }
            if (wireElem.value != "none") {
                last_wire = wireElem.value;
            }
        }

        if (last_wire == "black" && is_last_serial_odd()) {
            var o = document.getElementById("wires_result");
            o.innerHTML = "Cut the fourth wire.";
        }
        else if (num_red == 1 && num_yellow > 1) {
            var o = document.getElementById("wires_result");
            o.innerHTML = "Cut the first wire.";
        }
        else if (num_black == 0) {
            var o = document.getElementById("wires_result");
            o.innerHTML = "Cut the second wire.";
        }
        else {
            var o = document.getElementById("wires_result");
            o.innerHTML = "Cut the fourth wire.";
        }
    }

    function solve_6_wires() {
        var num_red = 0;
        var last_wire = "";
        var num_yellow = 0;
        var num_white = 0;
        for (var i = 1; i < 7; i++) {
            var wireElem = document.getElementById("wires_wire_" + i);
            if (wireElem.value == "red") {
                num_red++;
            }
            else if (wireElem.value == "yellow") {
                num_yellow++;
            }
            else if (wireElem.value == "white") {
                num_white++;
            }
            if (wireElem.value != "none") {
                last_wire = wireElem.value;
            }
        }

        if (num_yellow == 0 && is_last_serial_odd()) {
            var o = document.getElementById("wires_result");
            o.innerHTML = "Cut the third wire.";
        }
        else if (num_yellow == 1 && num_white > 1) {
            var o = document.getElementById("wires_result");
            o.innerHTML = "Cut the fourth wire.";
        }
        else if (num_red == 0) {
            var o = document.getElementById("wires_result");
            o.innerHTML = "Cut the last wire.";
        }
        else {
            var o = document.getElementById("wires_result");
            o.innerHTML = "Cut the fourth wire.";
        }
    }

    function getWiresCount() {
        var num = 0;
        for (var i = 1; i < 7; i++) {
            var wireElem = document.getElementById("wires_wire_" + i);
            if (wireElem.value != "none") {
                num++;
            }
        }
        return num;
    }
}

function is_last_serial_odd() {
    var o = ["0", "1", "3", "5", "7", "9"];
    var d = serialNumber.charAt(serialNumber.length - 1);
    for (var v in o) {
        if (d == o[v]) {
            return true;
        }
    }
    return false;
}

function init() {
    init_indicators();

    init_ports();

    init_batteries();

    init_strikes();

    init_serial_number();

    init_wires();

    init_the_button();
}

init();