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

## Instructions:
1) Copy file on your server (for example /home/cimo/docker_server).

2) Write on terminal:

    cd /home/cimo/docker_server
    
    sudo cp .env.dist .env
    
    sudo nano .env

3) Modify file with your configuration, save and close the file.

4) Add shared folder in your docker and write on terminal:
    
    docker-compose up -d --build

5) Write on your browser "https://your_domain:your_portainer_port".

<b>By CIMO - https://reinventsoftware.org</b>

| Library: |
|:---|
| Docker - https://www.docker.com/ |

Supported By:

![Image of supporter](https://avatars0.githubusercontent.com/u/878437?s=200&v=4)
