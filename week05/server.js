const http = require('http');

const server = http.createServer((req, res) => {
    //   res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.on('data', (res) => {
        setTimeout(() => {
            res.write(`ok`)
        })
    })

    res.on('end', (res) => {
        console.log('断开连接')
    })

    res.on('error', (e) => {
        console.log(e)
    })

    res.end(JSON.stringify({ chris: 'fang' }))
});

server.listen(8088, () => {
    console.log('服务已启动')
});