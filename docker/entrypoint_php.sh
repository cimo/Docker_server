#!/bin/bash
set -e

php-fpm -D

# Nextcloud
mkdir -p /home/${WWW_USER_NAME}/root${WEB_PATH}nextcloud
cp /home/setup-nextcloud.php /home/${WWW_USER_NAME}/root${WEB_PATH}nextcloud/setup.php
chmod 775 /home/${WWW_USER_NAME}/root${WEB_PATH}nextcloud
chown cimo:www-data /home/${WWW_USER_NAME}/root${WEB_PATH}nextcloud

tail -f /dev/null

exec "$@"