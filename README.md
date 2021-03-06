Docker server
==============

Web server with docker container.

| Info: |
|:---|
| Cross platform (Windows, Linux, Mac, Android, Ios) |

| Conatiner: |
|:---|
| NodeJs 14.16.1 |
| Apache 2.4.46 |
| Php 7.4.16-fpm |
| MySql 5.7 |
| PostgreSql 10.16 |
| Redis 6.2.1 |
| MongoDb 4.4.4 |
| Portainer 2.1.1 |
| Nextcloud 20.0.4 |
| Gitlab 13.7.0-ce.0 |

## Server:
1) Copy file on your server (for example /home/cimo/docker_server/root).

2) Write on terminal:

         cd /home/cimo/docker_server/root
         sudo cp .env.dist .env
         sudo nano .env
         sudo cp core/Config.dist.js core/Config.js

3) Modify for your system configuration and save, close the file and write on terminal:

         sudo docker-compose up -d --build

4) Write on terminal:

         sudo chown -R cimo:sudo /home/cimo/docker_server
         sudo chmod 775 /home/cimo/docker_server/root/web
         sudo find /home/cimo/docker_server/root/web -type d -exec chown cimo:www-data {} \; -exec chmod 775 {} \;
         sudo find /home/cimo/docker_server/root/web -type f -not -name "sess_*" -exec chown cimo:www-data {} \; -exec chmod 664 {} \;
         sudo find /home/cimo/docker_server/root/web -name "*.sh" -exec chmod 774 {} \;

5) Add in your hosts file:

         127.0.0.1 localhost
         127.0.0.1 localhost-php

## Portainer:
6) For launch portainer write on your browser "https://portainer.your_domain".

## Nextcloud:
7) For launch nextcloud write on your browser "https://nextcloud.your_domain".

## Gitlab:
8) For launch gitlab write on your browser "https://gitlab.your_domain".

| Library: |
|:---|
| Docker - https://www.docker.com |

By CIMO - https://reinventsoftware.org

Supported By:

![Image of supporter](https://avatars0.githubusercontent.com/u/878437?s=200&v=4)
