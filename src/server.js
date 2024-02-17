const http = require('http');
const { parse } = require('querystring');
const os = require('os');

const util = require("node:util");
const execFile = util.promisify(require("node:child_process").execFile);


function launchZoom(meetinglink) {
    execFile("zoom", ["--url=" + meetinglink]);
}

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        collectRequestData(req, result => {
            console.log(result);
            if (result != null) launchZoom(result.link)
            res.end(`
            <!doctype html>
            <html>
            <body>
                <h1 style="font-size:10vw">Meeting has started successfully</h1><br/>
                <a style="font-size:10vw" href="/"> Go Back </a>
            </body>
            </html>
        `);
        });
    }
    else {
        res.end(`
        <html>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <head>
        <style>
            .submit {
            background-color:green;
            border: 2px solid #008CBA;
            color: white;
            padding: 16px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            width: 100%;
            transition-duration: 0.4s;
            cursor: pointer;
        }
        .submit:hover {
        background-color: #008CBA;
        color: white;
        }
        .text{
         background-color:white;
         color: black;
         height:50px;
         font-size: 16px;
            margin: 4px 2px;
            width: 100%;
            text-decoration: bold;
        }
         </style></head>

        <body>
            <form action="/" method="post">
                <div>
                    <div><b>Meeting Link:</b></div>
                    <input class="text" type="text" name="link" /><br /><br />
                    <button type="submit" class="submit">Join Meeting</button>
                </div> 
            </form>
        </body>
        </html>
        `);
    }
});

console.log(os.networkInterfaces()["WiFi"][1]['address']);

server.listen(3000,os.networkInterfaces()["WiFi"][1]['address']);

function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if (request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}