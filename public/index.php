<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8"/>
        <title>Experimental</title>
        <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no"/>
        <link rel="stylesheet" href="/main.css"/>
    </head>
    <body>
        <?php

        if (strlen($_SERVER['REQUEST_URI']) > 1) {
            $project = str_replace('/', '-', $_SERVER['REQUEST_URI']);
            $project = 'build/' . substr($project, 1) . '.js';
        } else {
            $files = glob('build/*.js');
            $files = array_combine($files, array_map('filemtime', $files));
            arsort($files);
            $project = key($files);
        }
        
        ?>
        <div id="progress"></div>
        <script src="/<?= $project ?>"></script>
        <script src="http://localhost:35729/livereload.js"></script>
    </body>
</html>