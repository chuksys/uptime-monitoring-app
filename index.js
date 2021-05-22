/* Primary file for API
*/

//dependencies
const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder
const config = require("config");

//the server should respond to all requests with a string
const server = http.createServer((req, res) => {
    //Get the URL and parse it
    const parsedUrl = url.parse(req.url, true)

    //Get the path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, "");

    //Get the query string as an object
    const queryStringObject = parsedUrl.query;

    //Get the HTTP Method
    const method = req.method.toLowerCase();

    //Get the Headers as an Object
    const headers = req.headers

    //Get the payload if any
    const decoder = new StringDecoder("utf-8")
    let buffer = "";
    req.on("data", (data) => {
        buffer += decoder.write(data)
    })
    req.on("end", ()=> {
        buffer += decoder.end()

        //choose handler this request should go to
        const chosenHandler = typeof(router[trimmedPath]) !== "undefined"? 
            router[trimmedPath] : handler.notFound

        //construct data handler object to send to handler
        const data = {
            "trimmedPath": trimmedPath,
            "queryStringObject": queryStringObject,
            "method": method,
            "headers": headers,
            "payload": buffer
        }

        //Route the request to the handler specified in the router
        chosenHandler(data, (statusCode, payload) => {
            //Use the status code called back by the handler or default to 200
            statusCode = typeof(statusCode) == 'number'?  statusCode : 200;

            //use the payload called by the handler or default to an empty object
            payload = typeof(payload) == 'object'? payload : {};

            //convert the payload to a string
            const payloadString = JSON.stringify(payload);

            //Return the response
            res.setHeader("Content-Type", "application/json")
            res.writeHead(statusCode);
            res.end(payloadString);
            //Log the request path
            console.log(`Returning this response ${statusCode} ${payloadString}`)
        })
    })

});

//start server and listen on port 3000
server.listen(3000, () => console.log(`Server is listening on port 3000`))

//Define handlers
const handler = {}
handler.sample = (data, callback) => {
    //callback a http status code and a payload object
    callback(406, {"name": "sample handler"})
}

//not found handler
handler.notFound = (data, callback) => {
    callback(404, {})
}

//Define a request router
const router = {
    "sample": handler.sample
}