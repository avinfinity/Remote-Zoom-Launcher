const http = require('http');
const { parse } = require('querystring');

const util = require("node:util");
const execFile = util.promisify(require("node:child_process").execFile);


async function launchZoom(meetinglink) {
  const { error, stdout, stderr } = await execFile("%APPDATA%\Zoom\bin\Zoom.exe", ["--url=" + meetinglink]);
  // add the following code
  if (error) {
    console.error(error);
    return;
  }
  if (stderr) {
    console.error(stderr);
    return;
  }
  console.log(`External Program's output:\n ${stdout}`);
}


const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        collectRequestData(req, result => {
            console.log(result);
            if(result != null) launchZoom(result)
        });
    } 
    else {
        res.end(`
            <!doctype html>
            <html>
            <body>
                <form action="/" method="post">
                    <input type="text" name="link" /><br />
                    <button>Start</button>
                </form>
            </body>
            </html>
        `);
    }
});
server.listen(3000);

function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if(request.headers['content-type'] === FORM_URLENCODED) {
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