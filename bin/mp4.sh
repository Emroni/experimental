#!/bin/bash

ffmpeg -framerate 60 -i public/export/temp/%04d.png -pix_fmt yuv420p -c:v libx264 -crf 1 -framerate 60 public/export/$1.mp4