# Troubleshooting the backend

## Loads of SQL errors

### Symptom

The backend fails to start, or you just get a bunch of SQL errors when doing stuff. This symptom can manifest either as errors in the backend, or integrity errors in the SQL server(?)

### Fault

EF doesn't seem to have any simple ways of handling migrations. When you switch branches, and there is a change in the EF models, this will happen. This is because the database no longer is in sync with what is in the backend.

### Solution

 * Delete the `sql` folder inside `container/development`. This deletes the database. 
 * Start the server again with `docker-compose up`, and wait for the log output to stabilize. Once there is no new messages, the database server should be ready.
 * Stop the server, using Ctrl-C
 * Start the server again with `docker-compose up`.

Alternatively, you can re-save a backend file to force a restart of the backend.