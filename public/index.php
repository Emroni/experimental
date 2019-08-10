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
        $project = str_replace('/', '-', $_SERVER['REQUEST_URI']);
        $project = substr($project, 1);
        ?>

        <div class="actions">
            <button type="button" id="gif">GIF</button>
        </div>
        <div id="progress-time"></div>
        <div id="progress-bar"></div>

        <script src="/build/<?= $project ?>.js"></script>
        <script src="http://localhost:35729/livereload.js"></script>
    </body>
</html>