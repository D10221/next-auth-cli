#!/usr/bin/env sh
rm temp/ -rf 
yarn start sync --cfg="./test/next-auth-config.js" 
sqlite3 temp/nextauth.sqlite  "select name from sqlite_master where type='table'"
# see table names