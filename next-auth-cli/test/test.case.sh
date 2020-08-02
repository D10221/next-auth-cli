#!/usr/bin/env sh
# ... can sync
# TODO: tests
rm temp/ -rf 
DEBUG=* yarn start sync  --dbUrl="sqlite://./temp/nextauth.sqlite"
sqlite3 temp/nextauth.sqlite "select name from sqlite_master" # empy
echo "--- Can you see the table names? ---"
# ... can creates tables
rm temp/ -rf 
DEBUG=* yarn start create-tables --dbUrl="sqlite://./temp/nextauth.sqlite"
sqlite3 temp/nextauth.sqlite "select name from sqlite_master" # OK
echo "--- Can you see the table names? ---"