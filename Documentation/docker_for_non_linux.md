# Docker for non-linux

Docker is made to use `containerd` under the hood, which is only possible on Linux. To make Docker work on other platforms, they run the containers in a lightweight VM. This costs extra resources, and has a few other downsides.

## Windows

Remember to have `linux containers` enabled in the settings

## Macos

## Both

As volume mounts have worse efficiency, you may experience slowdowns with `yarn`. To fix this, the `volumemount-friendly` docker setup exists. However, there are a few downsides:

 * The backend is completely embedded in the container - you have to rebuild the backend container every time you make a change
 * The same applies for the frontend. Everything outside the `src` folder, **including** `public`, is copied in, and does not live-update.

To rebuild, run `docker-compose up --build`. You might have to delete `sql` if there are permission errors.