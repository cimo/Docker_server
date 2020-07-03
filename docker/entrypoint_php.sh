#!/bin/bash
set -e

php-fpm -D

cp /home/setup-nextcloud.php /home/${WWW_USER_NAME}/root${WEB_PATH}setup-nextcloud.php

tail -f /dev/null

exec "$@"