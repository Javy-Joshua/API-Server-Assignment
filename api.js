const http = require('http')

const port = 4444

const items = []

const handleResponse =
  (req, res) =>
  ({ code = 200, data = null, error = null }) => {
    res.setHeader("content-type", "application/json");
    res.writeHead(code);
    res.write(JSON.stringify({data, error}));
    res.end()
  }; 

const bodyParser = (req, res, callback) =>{

    const response = handleResponse(req, res)

    const body = []

    req.on('data', (chunk) =>{
        body.push(chunk)
    })

    req.on('end', () => {
        if(body.length){
            const parsedBody = Buffer.concat(body).toString()
            req.body = JSON.parse(parsedBody)

            if (
                !(
                    req.body.size.toLowerCase() === "small"  ||
                    req.body.size.toLowerCase() === "meduim" ||
                    req.body.size.toLowerCase() === "large"  
                )
                ) {
                 return response({
                    code: 400,
                    error: 'Size not found'
                 })
                //  size.toLowerCase() !=='small'
            }
            console.log(req.body)
        }
        callback( req, res)
    })
}

const handleRequest = (req, res) =>{
    const response = handleResponse(req, res)

    if (req.url === '/v1/items' && req.method === 'POST'){
        items.push({...req.body, id: Math.floor(Math.random()*800).toString()})

        return response ({
            code:200, 
            data:items
        })
    }

    if (req.url === '/v1/items' && req.method === 'GET'){
        return response({
          code: 200,
          data: items,
        });
    }

    if (req.url.startsWith('/v1/items/') && req.method === 'GET') {
        const id = req.url.split('/')[3]

        const itemIndex = items.findIndex((item)=> item.id === id)

        if (itemIndex === -1){
            return response({
                code: 404,
                data: 'Item not found'
            })
        }
        const item = items[itemIndex]
        return response({
            code:200,
            data: item
        })
    }

    if (req.url.startsWith('/v1/items/') && req.method === 'PATCH') {
        const id = req.url.split("/")[3];

        const itemIndex = items.findIndex((item) => item.id === id);

        if (itemIndex === -1){
            return response ({
                code: 404,
                error: 'student not found'
            })
        }
        const updatedItem = {...items[itemIndex],...req.body}
        items.splice(itemIndex,1,updatedItem)
        return response ({
            code: 200,
            data: items
        })
    }

    if ( req.url.startsWith ('/v1/items/') && req.method === 'DELETE'){
        const id = req.url.split(',')[3]

        const itemIndex = items.findIndex((items) => items.id === id)

        if (itemIndex === -1){
            return response ({
                code:404,
                error: 'item not found'
            })
        }

        items.splice(itemIndex,1)
        return response({
            code:200,
            data: items
        })
    }
}

const app = http.createServer((req, res) => bodyParser(req, res, handleRequest))


app.listen(port, () => {
    console.log(`We are listening to port ${port}`)
})