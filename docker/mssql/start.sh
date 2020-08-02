#!/usr/bin/env sh
# launch setup on the background & start server
# otherwise sqlservr wont start
/var/setup/setup.sh & /opt/mssql/bin/sqlservr