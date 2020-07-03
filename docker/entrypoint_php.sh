#!/bin/bash
set -e

php-fpm -D

# Nextcloud
cp /home/setup-nextcloud.php /home/${WWW_USER_NAME}/root${WEB_PATH}setup-nextcloud.php

tail -f /dev/null

exec "$@"