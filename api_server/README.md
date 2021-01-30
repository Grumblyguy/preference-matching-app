# API Server

Running at AWS at public IPv4: `54.252.181.63:80`

To connect to shell using ssh run `aws_connect.sh`.

Server is already set up in a seperate tmux instance, if need to start again run `sudo sh run_server.sh`

## Running locally
Install requirements using `pip3 install -r requirements.txt`, `run_server.sh` already handles this for you.

### Fully featured (including SSE/notifs)
First need to set the following environmental variables: `FLASK_APP=api.py` and `FLASK_ENV=development`

Linux (and probably mac too):

Run using `sudo sh run_server.sh`

Windows (TODO):
idk python flask keeps on complaining lol


### Endpoints only (not including SSE/notifs)
Run using `py api.py` on Windows, `python3 api.py` on Linux, idk how mac works

By default opens on port 80 and thus requires admin permission, add flag `--port XXXX` if you don't want to open it use another port which doesn't need admin permissions.

Link to access server is printed out when running, by default http://localhost:80/.

Access to Mongodb server needed to function properly, see below for details.

## Push Notifs / Server Sent Events (SSE)
Push notifs are implemented via server sent events. Use an SSE client to listen to endpoint `/user/<user-id>/listen`, see SSE_README.md for documention. 

# Mongodb Server

Running on Mongodb Atlas (https://account.mongodb.com/account/login), login credentials for Atlas:

Username: `z5206092@ad.unsw.edu.au`

Password: `tNYB6ZgXExcUc8M`

After logging in click "Network Access" on left then green "Add IP Address" at right side to allow your IP to access the server directly (needed for API server).

## Accessing server directly

Mongodb server can be accessed directly using Mongodb Compass or Mongoshell

For Mongodb compass, paste this url in to access:
`mongodb+srv://mark:marktest123@cluster0.afzsi.mongodb.net/test`

Login credentials for database:

username: `mark`

password: `marktest123`