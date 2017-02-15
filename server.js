var http = require("http");  
var fs = require("fs");
var port = 9999
var state = new Map();
var logging = false;

var requestHandler = (request, response) => {  
	var id;
	
	//retrieving value, url example: http://localhost:9999/5
	if (request.url.match(/\/\d+$/)) {
		id = parseInt(request.url.substring(1), 10);
		
		retrieveValue(request, response, id);
		
	//setting value, url example: http://localhost:9999/5=true
	} else if (request.url.match(/\/\d+=(true|false)$/)) {
		id = parseInt(request.url.substring(1, request.url.indexOf('=')), 10);
		value = request.url.substring(request.url.indexOf('=')+1) == "true" ? true : false;
		
		setValue(request, response, id, value);
		
	//retrieving the state of all nodes, url example: http://localhost:9999/state
	} else if (request.url.match(/\/state$/)) {
		retrieveState(request, response);
		
	//serving static content, url example: http://localhost:9999
	} else if (request.url.length == 1 && request.url[0] == "/") {
		serveStaticPage(request, response);
	}
}

var server = http.createServer(requestHandler)

server.listen(port, (err) => {  
	if (err) {
		return console.log('something bad happened', err)
	}

	if (logging) { console.log(`server is listening on ${port}`) }
})


/**
 * Retrieves the value of the node with the given ID.
 * 
 * @param request - the request object
 * @param response - the response object
 * @param id - the ID of the node to retrieve
 *
 * @return - none
 */
function retrieveValue(request, response, id) {
	if (logging) { console.log("retrieving " + id); }
	var json = {
			  status: {
				  indicator: "S",
				  message: "Request processed successfully."
			  },
			  data: {
			  }
		  };
		  
	//if the id has been registered
	if (state.has(id)) {
		json.data.id = id;
		json.data.on = state.get(id);
		
	//if the id has not previously been registered
	} else {
		state.set(id, false);
		json.data.id = id;
		json.data.on = false;
	}
	
	response.writeHead(200, {"Content-Type": "text/json"});
	response.write(JSON.stringify(json));
	response.end();
}

/**
 * Sets the value of the node with the given ID to the given value.
 * 
 * @param request - the request object
 * @param response - the response object
 * @param id - the ID of the node to retrieve
 * @param value - the value to set
 *
 * @return - none
 */
function setValue(request, response, id, value) {
	if (logging) { console.log("setting " + id + " to " + value); }
	var json = {
		status: {
			indicator: "S",
			message: "Value updated successfully."
		}
	};
	
	state.set(id, value);
	
	response.writeHead(200, {"Content-Type": "text/json"});
	response.write(JSON.stringify(json));
	response.end();
}

/**
 * Retrieves the state of all current nodes.
 * 
 * @param request - the request object
 * @param response - the response object
 * 
 * @return - none
 */
function retrieveState(request, response) {
	if (logging) { console.log("retrieving state"); }
	var json = {
		status: {
			indicator: "S",
			message: "Value updated successfully."
		},
		data: {
		}
	};
	var list = [];
	
	state.forEach(function(value, key) {
		list.push({
			id: key,
			on: value
		});
	});
	json.data = list;
	
	response.writeHead(200, {"Content-Type": "text/json"});
	response.write(JSON.stringify(json));
	response.end();
}

/**
 * Serves the static content page (index.html).
 * 
 * @param request - the request object
 * @param response - the response object
 * 
 * @return - none
 */
function serveStaticPage(request, response) {
	if (logging) { console.log("serving static content"); }
	fs.readFile("index.html", "utf8", function(error, data) {
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write(data);
		response.end();
	});
}