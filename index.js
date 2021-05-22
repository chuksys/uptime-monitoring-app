/* Primary file for API
*/

//dependencies
const http = require("http");
const url = require("url");

//the server should respond to all requests with a string
const server = http.createServer((req, res) => {
    res.end("Hello World\n");
});

//start server and listen on port 3000
server.listen(3000, () => console.log(`Server is listening on port 3000`))