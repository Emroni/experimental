const fs = require('fs-extra');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const Path = require('path');
const Webpack = require('webpack');

module.exports = () => {

    let latest = {
        time: 0,
    };

    fs.readdirSync('src')
        .filter(name => name.substr(-3, 3) !== '.js')
        .forEach(project => {
            fs.readdirSync(`src/${project}`)
                .filter(name => !isNaN(name.replace('.js', '')))
                .forEach(iteration => {
                    const path = `./src/${project}/${iteration}`;
                    const stats = fs.statSync(path);

                    if (latest.time < stats.mtimeMs) {
                        iteration = iteration.replace('.js', '');
                        latest = {
                            iteration,
                            name: `${project}-${iteration}`,
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
            [latest.name]: latest.path,
        },
        output: {
            filename: '[name].js',
            path: Path.resolve(__dirname, 'public/build') + '/',
        },
        plugins: [
            new Webpack.DefinePlugin({
                PROJECT: `'${latest.name}'`,
            }),
            new LiveReloadPlugin(),
        ],
    }

};