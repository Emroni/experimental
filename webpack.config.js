const LiveReloadPlugin = require('webpack-livereload-plugin');
const Path = require('path');
const fs = require('fs-extra');

module.exports = async () => {
    const config = [];

    const entries = await new Promise((resolve, reject) => {
        fs.readdir(`src`, (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });

    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const name = entry.replace('.js', '');

        config.push({
            mode: 'development',
            name: name,
            entry: {
                [name]: `./src/${name}/index.js`,
            },
            output: {
                filename: '[name].js',
                path: Path.resolve(__dirname, 'public/build') + '/',
            },
            plugins: [
                new LiveReloadPlugin(),
            ],
        });

    }

    return config;
};