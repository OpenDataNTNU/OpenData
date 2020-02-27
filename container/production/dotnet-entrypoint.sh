#!/bin/bash

echo "Waiting for DB to fire up...."
./wait-for-it.sh db:3306 -t 30
sleep 2

dotnet run
