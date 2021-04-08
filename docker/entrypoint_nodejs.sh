#!/bin/bash
set -e

PATH_CORE="/home/${WWW_USER_NAME}/root${NODEJS_PATH_STATIC}"

cd "${PATH_CORE}"

if [ ! -d "${PATH_CORE}/node_modules" ]; then
  npm cache clear --force
  npm install
fi

node Server.js

tail -f /dev/null

exec "$@"
