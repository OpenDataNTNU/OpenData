#!/bin/bash

cd /srv/opendata-backend

dotnet restore
dotnet watch run
