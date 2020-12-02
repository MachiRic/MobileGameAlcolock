var http = require('http');  
var url = require('url');  
var fs = require('fs');  
var server = http.createServer(function(request, response) {  
    var path = url.parse(request.url).pathname;
    var tmp  = path.lastIndexOf(".");    
    var extension  = path.substring((tmp + 1));
    fs.readFile(__dirname + path, function(error, data) {  
        if (error) {  
            response.writeHead(404);  
            response.write('This page does not exist');
            response.end();  
        } else {  
            if (extension === 'html') {response.writeHead(200, {  
                'Content-Type': 'text/html'
            });}
            else if (extension === 'css') {response.writeHead(200, {  
                'Content-Type': 'text/css'
            });}
            response.write(data);  
            response.end();  
        }  
    }); 
});  
server.listen(8000);