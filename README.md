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

## Server:
1) Copy file on your server (for example /home/cimo/docker_server).

2) Write on terminal:

        sudo chown -R cimo:sudo /home/cimo/docker_server
        cd /home/cimo/docker_server
        sudo cp .env.dist .env
        sudo nano .env

3) Modify file with your configuration, save, close the file, add your path in the shared folder docker dashboard and write on terminal:

        sudo docker-compose up -d --build

4) Write on terminal:

        sudo chmod 775 /home/cimo/docker_server/web_space
        sudo find /home/cimo/docker_server/web_space -type d -exec chown cimo:www-data {} \; -exec chmod 775 {} \;
        sudo find /home/cimo/docker_server/web_space -type f -not -name "sess_*" -exec chown cimo:www-data {} \; -exec chmod 664 {} \;
        sudo find /home/cimo/docker_server/web_space -name "*.sh" -exec chmod 774 {} \;

5) Add in your hosts file:

        127.0.0.1 localhost
        127.0.0.1 localhost-php7

6) For launch portainer write on your browser "https://portainer.your_domain".

## Email:
Coming soon...

## Nextcloud:
7) For launch nextcloud write on your browser "https://nextcloud.your_domain/setup-nextcloud.php".

8) Write on terminal:

        sudo chmod 775 /home/cimo/docker_server/web_space/nextcloud
        sudo find /home/cimo/docker_server/web_space/nextcloud -type d -exec chown www-data:www-data {} \; -exec chmod 775 {} \;
        sudo find /home/cimo/docker_server/web_space/nextcloud -type f -not -name "sess_*" -exec chown www-data:www-data {} \; -exec chmod 664 {} \;
        sudo find /home/cimo/docker_server/web_space/nextcloud -name "*.sh" -exec chmod 774 {} \;
        sudo chmod 770 /home/cimo/docker_server/web_space/nextcloud/data
        sudo crontab -e -u www-data

9) Insert:
        
        # Nextcloud
        */5 * * * * php -f /home/cimo/docker_server/web_space/nextcloud/cron.php

10) Save, close the file and write on terminal:

        sudo nano /home/cimo/docker_server/web_space/nextcloud/config/config.php

11) Insert:

        'memcache.local' => '\OC\Memcache\APCu'

12) Save, close the file and remove "setup-nextcloud.php" from the server.

## Gitlab:

13) Write on terminal:

        sudo nano /etc/gitlab/gitlab.rb

14) Edit:

        external_url “https://gitlab.reinventsoftware.org”
        git_data_dirs({"default" => {"path" => "/home/docker_server_data/gitlab"}})
        gitlab_workhorse['listen_network'] = "tcp"
        gitlab_workhorse['listen_addr'] = “127.0.0.1:8888”
        unicorn['listen'] = '127.0.0.1'
        unicorn['port'] = 8889
        unicorn['socket'] = '/var/opt/gitlab/gitlab-rails/sockets/gitlab.socket'
        web_server['external_users'] = ['www-data']
        nginx['enable'] = false

15) Save, close the file and write on terminal:

        sudo gitlab-ctl reconfigure

16) For launch gitlab write on your browser "https://gitlab.your_domain".

<b>By CIMO - https://reinventsoftware.org</b>

| Library: |
|:---|
| Docker - https://www.docker.com/ |

Supported By:

![Image of supporter](https://avatars0.githubusercontent.com/u/878437?s=200&v=4)
