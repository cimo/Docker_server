#!/bin/bash

tail -f /dev/null

chmod 775 /home/${WWW_USER_NAME}/root${WEB_PATH}nextcloud
chown ${USER_NAME}:${WEB_USER_GROUP} /home/${WWW_USER_NAME}/root${WEB_PATH}nextcloud

exec "$@"