#!/bin/bash

tail -f /dev/null

mv /home/setup-nextcloud.php /home${WWW_USER_NAME}/root${WEB_PATH}nextcloud/setup-nextcloud.php
chmod 775 /home/${WWW_USER_NAME}/root${WEB_PATH}nextcloud
chown ${USER_NAME}:${WEB_USER_GROUP} /home/${WWW_USER_NAME}/root${WEB_PATH}nextcloud

exec "$@"