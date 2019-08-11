const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const fs = require('fs-extra');
const GIFEncoder = require('gifencoder');
const pngFileStream = require('png-file-stream');

const app = express();
app.use(bodyParser.urlencoded({
    extended: false,
    limit: '50mb',
}));
app.use(bodyParser.json({
    extended: false,
    limit: '50mb',
}));
app.use(cors());
app.listen(3000);

app.get('/clean', (req, res) => {
    fs.remove('temp', () => {
        res.send(true);
    });
});

app.post('/gif/add', (req, res) => {
    const {data, index} = req.body;
    const base64 = data.substr(22);
    const n = (index < 1000 ? '0' : '') + (index < 100 ? '0' : '') + (index < 10 ? '0' : '') + index;
    fs.outputFileSync(`temp/${n}.png`, base64, 'base64');
    res.send(true);
});

app.post('/gif/render', (req, res) => {
    const {delay, height, name, width} = req.body;
    const path = `/build/${name}.gif`;

    const encoder = new GIFEncoder(width, height);
    const stream = pngFileStream('temp/*.png')
        .pipe(encoder.createWriteStream({
            delay,
            quality: 10,
            repeat: 0,
        }))
        .pipe(fs.createWriteStream(`public${path}`));

    stream.on('finish', () => {
        res.send(path);
    });
});
