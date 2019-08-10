const LiveReloadPlugin = require('webpack-livereload-plugin');
const Path = require('path');
const fs = require('fs-extra');

module.exports = () => {

    let latest = {
        time: 0,
    };

    fs.readdirSync('src')
        .filter(name => name !== 'base')
        .forEach(project => {
            fs.readdirSync(`src/${project}`)
                .filter(name => !isNaN(name.replace('.js', '')))
                .forEach(iteration => {
                    const path = `./src/${project}/${iteration}`;
                    const stats = fs.statSync(path);

                    if (latest.time < stats.mtimeMs) {
                        latest = {
                            iteration: iteration.replace('.js', ''),
                            path,
                            project,
                            time: stats.mtimeMs,
                        };
                    }
                });
        });
    
    return {
        mode: 'development',
        name: latest.project,
        entry: {
            [`${latest.project}-${latest.iteration}`]: latest.path,
        },
        output: {
            filename: '[name].js',
            path: Path.resolve(__dirname, 'public/build') + '/',
        },
        plugins: [
            new LiveReloadPlugin(),
        ],
    }

};