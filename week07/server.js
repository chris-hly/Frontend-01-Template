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

    // res.on('end', (res) => {
    //     console.log('断开连接')
    // })

    res.on('error', (e) => {
        console.log(e)
    })

    res.end(`<html lang="en">
    <head>
        <style>
            body section div {
                background-color: plum;
                width: 30px;
                height: 30px;
            }
    
            body section #myid {
                background-color: pink;
                width: 100px;
                height: 100px;
            }
        </style>
    </head>
    <body>
        <section>
            <div id="myid">hello</div>
            <div>good</div>
        </section>
    </body>
    </html>`)
});

server.listen(8088, () => {
    console.log('服务已启动')
});