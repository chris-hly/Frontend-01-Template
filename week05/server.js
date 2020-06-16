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
    <body>
    <style>
    .chris{
        align-items:center;
        display:flex;
        width:500px;
        justify-content:space-around;
    }
    div {
        border:solid 1px black
    }
    .first{
        width:70px;
        height:70px
    }
    .seccond{
        width:200px;
        height:50px;
    }
    .third{
        width:200px;
        height:100px;
    }

</style>
<div class="chris">
    <div  class="first"></div>
    <div  class="seccond"></div>
    <div  class="third"></div>
</div>
    </body>
    </html>`)
});

server.listen(8088, () => {
    console.log('服务已启动')
});