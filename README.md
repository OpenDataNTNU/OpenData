# OpenData

## Getting it up

### Docker

It is reccomended to use docker, as it makes getting everything up super simple.

Run `docker-compose up` from insode `/container/development`, and the rest should happen automatically.

The react server serves at `localhost:3000`, and the backend serves at `localhost:9000`, for ease in testing with postman and similar tools. The react server should be set up to proxy to the backend server, please don't write the frontend so it makes requests to `localhost:9000`.

A simple SQL administration tool called Adminer is reachable at `localhost:3739`. For username/password, see `/container/development/docker-compose.yml`

`ctrl-C` to stop the containers.

#### Security warning

This setup is meant for local development. The provided `docker-compose.yml` file exposes adminer and both http servers. Other machines on the local network can access them.

### Manually

Not supported, but if you copy what `docker-compose.yml` does you should be able to do it. Note that the react server is probably set up to proxy to `mysql`, which evaluates to the mysql container when evaluated inside the docker containers.