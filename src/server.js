const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const fs = require('fs-extra');
const exec = require('child_process').exec;

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

app.post('/clean', (req, res) => {
    fs.removeSync('public/export/temp');

    res.send(true);
});

app.post('/add', (req, res) => {
    const {data, index} = req.body;

    const n = (index < 1000 ? '0' : '') + (index < 100 ? '0' : '') + (index < 10 ? '0' : '') + index;
    const file = `public/export/temp/${n}.png`;

    res.send(true);

    fs.outputFileSync(file, data.substr(22), 'base64');
});

app.post('/save', (req, res) => {
    const {name, size} = req.body;

    const file = `/export/${name}.mp4`;
    const scale = size !== 1200 ? `-filter:v scale=-1:${size}` : '';
    const command = `ffmpeg -framerate 60 -i public/export/temp/%04d.png -pix_fmt yuv420p -c:v libx264 -crf 1 -framerate 60 ${scale} -y public${file}`;

    exec(command, () => {
        res.send({
            file,
        });
    });
});