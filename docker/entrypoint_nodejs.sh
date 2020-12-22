#!/bin/bash
set -e

cd /home/${WWW_USER_NAME}/root/core
npm cache clear --force
npm install
node Server.js

tail -f /dev/null

exec "$@"