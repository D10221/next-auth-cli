#!/usr/bin/env sh
# CAN'T sync
rm temp/ -rf 
DEBUG=* yarn start sync  --dbUrl="sqlite://./temp/nextauth.sqlite"
sqlite3 temp/nextauth.sqlite "select name from sqlite_master" # empy
echo "--- Empty  right? ---"
# ... creates tables
rm temp/ -rf 
DEBUG=* yarn start create-tables --dbUrl="sqlite://./temp/nextauth.sqlite"
sqlite3 temp/nextauth.sqlite "select name from sqlite_master" # OK
echo "--- Can you the table names? ---"