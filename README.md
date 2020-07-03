Web server
==============

Web server with docker container.

| Info: |
|:---|
| Cross platform (Windows docker, Linux docker, Mac docker) |

| Conatiner: |
|:---|
| Php 7.4-fpm |
| Apache 2.4 |
| MySql 5.7 |
| PostgreSql 10.13 |
| NodeJs 12.17.10 |
| Nextcloud |

## Instructions:
1) Copy file on your server (for example /home/cimo/docker_server).

2) Write on terminal:

    sudo chown -R cimo:sudo /home/cimo/docker_server
    
    cd /home/cimo/docker_server
    
    sudo cp .env.dist .env
    
    sudo nano .env

3) Modify file with your configuration, save, close the file and write on terminal:

    sudo chmod 775 web_space

    sudo find web_space -type d -exec chown cimo:www-data {} \; -exec chmod 775 {} \;

    sudo find web_space -type f -not -name "sess_*" -exec chown cimo:www-data {} \; -exec chmod 664 {} \;

    sudo find web_space -name "*.sh" -exec chmod 774 {} \;

4) Add your path in the shared folder docker dashboard and write on terminal:

    sudo docker-compose up -d --build

5) Add in your hosts file:

    127.0.0.1 localhost
    127.0.0.1 localhost-php7

6) Write on your browser "https://your_domain:your_portainer_port".

7) For configure nextcloud write on your browser "https://your_domain/setup-nextcloud.php".

8) Write on terminal:

    sudo chmod 775 /home/[your_www_user_name]/root[your_web_path]nextcloud
    sudo find /home/[your_www_user_name]/root[your_web_path]nextcloud -type d -exec chown [your_www_user_name]:[your_web_user_group] {} \; -exec chmod 775 {} \;
    sudo find /home/[your_www_user_name]/root[your_web_path]nextcloud -type f -not -name "sess_*" -exec chown [your_www_user_name]:[your_web_user_group] {} \; -exec chmod 664 {} \;
    sudo find /home/[your_www_user_name]/root[your_web_path]nextcloud -name "*.sh" -exec chmod 774 {} \;
    sudo crontab -e -u www-data

9) Inserire:

    # NextCloud
    */15 * * * * php -f /home/[your_user_name]/docker_server[your_web_path]nextcloud/cron.php

<b>By CIMO - https://reinventsoftware.org</b>

| Library: |
|:---|
| Docker - https://www.docker.com/ |

Supported By:

![Image of supporter](https://avatars0.githubusercontent.com/u/878437?s=200&v=4)
