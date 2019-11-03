const path = require('path');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

function drawProcess() {
    console.log('starting drawProcess');
    const measurementInterval = 200;
    const total = 500;
    const drawAmountPerTick = 1000 / 60 / 1000 * 200;

    let current = 0;
    const drawIntervalId = setInterval(() => {
        current += drawAmountPerTick * (Math.random() + 0.5);
        console.log('current', current);
        if (current >= total) {
            clearInterval(drawIntervalId);
        }
    }, measurementInterval);
}

app.post('/draw', (req, res) => {
    console.log('draw', req.body);
    drawProcess(req.body);
    res.send('draw received');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));