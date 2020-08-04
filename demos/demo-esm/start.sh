#!/usr/bin/env sh
rm temp/ -rf 
./node_modules/.bin/next-auth-cli sync "./next-auth-config.js" 
sqlite3 temp/nextauth.sqlite  "select name from sqlite_master"
# see table names