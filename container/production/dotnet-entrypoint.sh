#!/bin/bash

echo "Waiting for DB to fire up...."
./wait-for-it.sh mysql:3306 -t 120
sleep 2

dotnet run
