# OpenData

## Getting it up

### Docker

It is recommended to use docker, as it makes getting everything up super simple.

#### Requirements

Download Docker:

 * Windows: [Docker Desktop](https://hub.docker.com/editions/community/docker-ce-desktop-windows)
   - You need virtualization enabled on your system
   - You need 64-bit Windows 10 Pro, Enterprise, or Educational
   - Enable linux containers. You should be asked about this during setup.
   - Enable beta features
   - _For more information about Windows requirements, see [https://docs.docker.com/docker-for-windows/install/](https://docs.docker.com/docker-for-windows/install/)_
 * Macos: [Docker Dekstop](https://hub.docker.com/editions/community/docker-ce-desktop-mac/)
 * Linux: Depends on distribution - look up what the Docker package is called in your package manager. Usually `docker`.

You also need docker-compose. On Windows and Macos, this should be bundled with Docker Desktop. On linux, you have to find out what the package name is yourself. It is usually something like `docker-compose`

#### Starting the project

There are three different docker-compose configurations. Pick the one that works best for your needs

 * `./container/development` - A normal development setup. The backend and frontend will reload if code is changed in their respective code directories.
   - **Warning**: This container has poor performance on Windows and Macos, as Docker is ran in a Virtual machine for these operating systems.
 * `./container/production` - A production-ready docker image. Everything is built when the containers are set up, no code is hot-reloaded
 * `./container/volumemount-friendly` - The backend is prebuilt, and only the source folder of the frontend is volume mounted
   - This is a better choice for Macos and Windows users if speed is an issue
   - You also need to rebuild the containers if you change dependencies in the frontend
   - To rebuild, use `docker-compose up --build`

Run `docker-compose up` from inside the folder of your selected docker-compose setup, and the rest should happen automatically. Note that a `docker-compose.yml` file should be in the folder you are running this command. If it isn't, you are doing something wrong.

The web server serves at `localhost:3000`, and the backend serves at `localhost:9000`, for ease in testing with postman and similar tools. Note that the exact configuration regarding where the frontend is, what is serving at it, and what forwards what, depends on what docker-compose setup you are using. Consult the `docker-compose.yml` file of your choosing for more information on what is happening in your container.

Note that no matter what you are doing, the backend server is proxied such that you never have to mention the backend server by `localhost:9000`. Using the `:9000` port to access the backend will not work in production. Anything going to `/api` should be automatically proxied to the backend server.

A simple SQL administration tool called Adminer is reachable at `localhost:3739` when using the `development` or `volumemount-friendly` docker-compose files. For username/password, see `/container/*/docker-compose.yml`

`ctrl-C` to stop the containers.

#### Security warning

The `development` and `volumemount-friendly` setups are meant for local development. The provided `docker-compose.yml` file exposes adminer and both http servers. Other machines on the local network can access them.

### Manually

Not supported, but if you copy what `docker-compose.yml` does you should be able to do it. Note that the react server is probably set up to proxy to `mysql`, which evaluates to the mysql container when evaluated inside the docker containers. Therefore, you would have to make some changes to code to make this work. 
