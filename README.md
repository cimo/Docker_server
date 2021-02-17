Web server
==============

Web server with docker container.

| Info: |
|:---|
| Cross platform (Windows, Linux, Mac) |

| Conatiner: |
|:---|
| Php 7.4-fpm |
| Apache 2.4 |
| MySql 5.7 |
| PostgreSql 10.13 |
| NodeJs 12.18.1 |
| Redis 6.0.9 |
| MongoDb 4.4.1 |
| Portainer |
| Nextcloud 20.0.4 |
| Gitlab 13.7.0-ce.0 |

## Server:
1) Copy file on your server (for example /home/cimo/docker_server/root).

2) Write on terminal:

        sudo chown -R cimo:sudo /home/cimo/docker_server
        cd /home/cimo/docker_server/root
        sudo cp .env.dist .env
        sudo nano .env
        sudo cp core/Env.dist.js Env.js
        sudo nano core/Env.js

3) Modify file with your configuration, save and close the file.

4) Add your path in the shared folder docker dashboard and write on terminal:

        sudo docker-compose up -d --build

5) Write on terminal:

        sudo chmod 775 /home/cimo/docker_server/root/web
        sudo find /home/cimo/docker_server/root/web -type d -exec chown cimo:www-data {} \; -exec chmod 775 {} \;
        sudo find /home/cimo/docker_server/root/web -type f -not -name "sess_*" -exec chown cimo:www-data {} \; -exec chmod 664 {} \;
        sudo find /home/cimo/docker_server/root/web -name "*.sh" -exec chmod 774 {} \;

6) Add in your hosts file:

        127.0.0.1 localhost
        127.0.0.1 localhost-php7

7) For launch portainer write on your browser "https://portainer.your_domain".

## Nextcloud:
8) For launch nextcloud write on your browser "https://nextcloud.your_domain".

## Gitlab:

9) Write on terminal:
   
         sudo chmod -R 2770 /home/cimo/docker_server/data/gitlab

10) For launch gitlab write on your browser "https://gitlab.your_domain".

| Library: |
|:---|
| Docker - https://www.docker.com/ |

By CIMO - https://reinventsoftware.org

Supported By:

![Image of supporter](https://avatars0.githubusercontent.com/u/878437?s=200&v=4)
