const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const fs = require('fs-extra');
const GIFEncoder = require('gifencoder');
const pngFileStream = require('png-file-stream');
const ffmpeg = require('fluent-ffmpeg');
const im = require('imagemagick');

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
    const {name} = req.body;
    const path = `public/build/${name}`;

    fs.removeSync('public/export/temp');
    fs.removeSync(`${path}.gif`);
    fs.removeSync(`${path}.mp4`);

    res.send(true);
});

app.post('/add', (req, res) => {
    const {data, index, resize, size} = req.body;

    const n = (index < 1000 ? '0' : '') + (index < 100 ? '0' : '') + (index < 10 ? '0' : '') + index;
    const file = `public/export/temp/${n}.png`;

    res.send(true);

    fs.outputFileSync(file, data.substr(22), 'base64');

    if (resize) {
        im.resize({
            srcPath: file,
            dstPath: file,
            width: size,
            height: size,
            quality: 1,
        });
    }
});

app.post('/gif', (req, res) => {
    const {fps, name, size} = req.body;
    const file = `/export/${name}.gif`;

    const encoder = new GIFEncoder(size, size);
    const stream = pngFileStream('public/export/temp/*.png')
        .pipe(encoder.createWriteStream({
            delay: Math.max(2, Math.round(1000 / fps)),
            repeat: 0,
        }))
        .pipe(fs.createWriteStream(`public${file}`));

    stream.on('finish', () => {
        respond(res, file, 'img');
    });
});

app.post('/mp4', (req, res) => {
    const {fps, name, size} = req.body;
    const file = `/export/${name}.mp4`;

    ffmpeg('public/export/temp/%04d.png')
        .withFpsInput(fps)
        .inputOption('-pix_fmt yuv420p')
        .videoCodec('libx264')
        .withFPSOutput(fps)
        .size(`${size}x${size}`)
        .output(`public${file}`)
        .on('end', () => {
            respond(res, file, 'video');
        })
        .run();
});

function respond(res, file, type) {
    const stats = fs.statSync(`public${file}`);
    res.send({
        file,
        type,
        size: Math.ceil(stats.size / 1024 / 1024 * 10) / 10,
    });
}