#!/bin/bash
set -e

php-fpm -D

tail -f /dev/null

exec "$@"