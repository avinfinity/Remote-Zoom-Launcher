const http = require('http');

const server = http.createServer((req, res) => {
  // Routing

  if(req.body?.linkUrl != null){

  }

});

const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});