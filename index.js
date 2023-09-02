// applying what you taught us, i'm going to use try and catch to handle the server functon and the 404 error

const http = require('http')
const fs = require('fs')
const path = require("path");

const port = 3333

const app = http.createServer((req, res) =>{
  console.log({ path: req.url, method: req.method}) 
  
  if (req.url === '/'){
    const file = fs.readFileSync('./index.html')
    res.writeHead(200, {'Content-Type': 'text/html'}) 
    // res.setHeader('content-type','text/html' )
    // res.writeHead(200)
    res.write(file)
    res.end
  }
  if (req.url.endsWith ('.html') && req.method === 'GET'){
    try {
      const splitUrl = req.url.split("/");
      console.log({ url: req.url, splitUrl });
      const fileName = splitUrl[1];
      const filelocation = `./${fileName}`;

      const file = fs.readFileSync(filelocation);
      res.writeHead(200, { "Content-Type": "text/html" });
      // res.setHeader("content-type", "text/html");
      // res.writeHead(200);
      res.write(file);
      res.end;
    } catch (error) {
       const file = fs.readFileSync("./404.html");
       res.writeHead(500, { "Content-Type": "text/html" });
       // res.setHeader('content-type','text/html' )
       // res.writeHead(200)
       res.write(file);
       res.end;
    }
    
  }
})

app.listen( port, ()=>{
    console.log(`we are listening to port ${port}`)
})