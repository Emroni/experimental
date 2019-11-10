#!/bin/bash

if [ -n "$2" ];
    then SCALE="-filter:v scale=-1:$2";
    else SCALE='';
fi

ffmpeg -framerate 60 -i public/export/temp/%04d.png -pix_fmt yuv420p -c:v libx264 -crf 1 -framerate 60 -y $SCALE public/export/$1.mp4