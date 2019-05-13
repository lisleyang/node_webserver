#!/bin/sh
cd /Users/lisle/Documents/github_mine/node-webserver/logs/
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log