<!doctype html>
<html lang="en">
    <?php
        $project = str_replace('/', '', $_SERVER['REQUEST_URI']);
        $projects = [
            'simplexnoise' => 'Simplex Noise',
        ];
    ?>
    <head>
        <meta charset="utf-8"/>
        <title>Experimental</title>
        <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no"/>
        <link rel="stylesheet" href="main.css"/>
    </head>
    <body>
        <?php if ($project): ?>
            <script src="/build/<?= $project ?>.js"></script>
            <script src="http://localhost:35729/livereload.js"></script>
        <?php else: ?>
            <ul>
                <?php foreach ($projects as $key => $title): ?>
                    <li>
                        <a href="/<?= $key ?>"><?= $title ?></a>
                    </li>
                <?php endforeach; ?>
            </ul>
        <?php endif; ?>
    </body>
</html>