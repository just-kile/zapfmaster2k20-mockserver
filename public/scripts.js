const socket = new WebSocket('ws://localhost:3001');

// Connection opened
socket.addEventListener('open', function (event) {
    console.log('Connected to ws server')
});

// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
    appendMessage(JSON.parse(event.data));
});


function produceOutput(arg) {
    return (typeof arg === "object" && (JSON || {}).stringify ? JSON.stringify(arg) : arg) || '';
}

function appendMessage(event) {
    // following https://stackoverflow.com/questions/20256760/javascript-console-log-to-html
    const eLog = document.getElementById('log');

    let output = `${new Date().toISOString()}\t${event.event}\t${produceOutput(event.data)}`;
    const isScrolledToBottom = eLog.scrollHeight - eLog.clientHeight <= eLog.scrollTop + 1;
    eLog.innerHTML += output + '<br/>';
    if (isScrolledToBottom) {
        eLog.scrollTop = eLog.scrollHeight - eLog.clientHeight;
    }
}

function clearLog() {
    const eLog = document.getElementById('log');
    eLog.innerHTML = '';
}

async function postData() {
    let formEl = document.querySelector('form');
    let formData = new FormData(formEl);
    let data = {};
    Array.from(formData.entries()).forEach(([key, val]) => data[key] = val);
    return fetch('/draw', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}