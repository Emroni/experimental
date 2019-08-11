<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8"/>
        <title>Experimental</title>
        <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no"/>
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"/>
        <link rel="stylesheet" href="/main.css"/>
    </head>
    <body>
        <?php
        $project = str_replace('/', '-', $_SERVER['REQUEST_URI']);
        $project = substr($project, 1);
        ?>

        <div class="actions">
            <button type="button" id="gif">
                <span>GIF</span>
                <i class="fas fa-spinner fa-spin"></i>
            </button>
        </div>
        <div id="progress"></div>
        <a id="output" target="_blank">
            <img id="output-img">
        </a>

        <script src="/build/<?= $project ?>.js"></script>
        <script src="http://localhost:35729/livereload.js"></script>
    </body>
</html>