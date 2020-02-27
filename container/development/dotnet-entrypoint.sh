#!/bin/bash

cd /srv/opendata-backend

echo "Waiting for DB to fire up...."
./wait-for-it.sh db:3306 -t 30
sleep 2

dotnet restore
dotnet watch run
