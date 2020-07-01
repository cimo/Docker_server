#!/bin/bash
set -e

# Server
cd /home/${WWW_USER_NAME}/root/nodejs
npm cache clear --force
npm install
node Server.js

tail -f /dev/null

exec "$@"