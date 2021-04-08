#!/bin/bash

mongo --eval "db = connect('127.0.0.1:${MONGODB_PORT}/admin'); \
db.auth('${MONGO_INITDB_ROOT_USERNAME}', '${MONGO_INITDB_ROOT_PASSWORD}'); \
db = db.getSiblingDB('${MONGODB_DATABASE}'); \
db.createUser({user: '${MONGODB_USER}', pwd: '${MONGODB_PASSWORD}', roles: [{role: 'dbOwner', db: '${MONGODB_DATABASE}'}]}); \
db.createCollection('table1'); \
db.table1.insertOne({name: 'cimo'});"
