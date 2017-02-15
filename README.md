# light-control
A server that allows Raspberry Pi powered lights to be controlled via web interface.

###server.js
A node based server that manages the state of the lights. The server defaults to serving on port 9999 and can be started with the following command: `node server.js`. The end points are as follows:
- `http://localhost:9999/5` - retrieves the state of the light with an ID of 5
- `http://localhost:9999/5=true` - sets the light with an ID of 5 to be on
- `http://localhost:9999/state` - returns a list of all lights with each light's ID and whether it is on or off
- `http://localhost:9999` - serves the static content page (index.html)


###client.py
A simple client to be run on the Raspberry Pi that turns a light on or off based on the data that it receives from the server. Requests are made to the server every 1 second. The client requres that the [requests](http://docs.python-requests.org/en/master/) module be installed. The client program must be run with the ID of the light being passed in as a command line argument, eg. `python client.py 5`


###index.html
The static content page that allows web-based control of the lights. On page load the state is retrieved from the server and switches are generated for each light to allow the user to easily turn the lights on and off. The page is refreshed every 1 second.
