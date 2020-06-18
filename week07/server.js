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
        background-color:rgb(255,255,255)
    }
    div {
        border:solid 1px black
    }
    .first{
        width:70px;
        height:70px;
        background-color:rgb(149,248,251)
    }
    .seccond{
        width:200px;
        height:50px;
        background-color:rgb(185,251,96)
    }
    .third{
        width:200px;
        height:100px;
        background-color:rgb(9,151,251)
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