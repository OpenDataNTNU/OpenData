#!/bin/bash


echo "Waiting for DB to fire up...."
./wait-for-it.sh mysql:3306 -t 120

echo "Switching directory"
cd /srv/opendata-backend

echo "Restoring..."
dotnet restore
dotnet watch run
