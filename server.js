var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

var port = 3000;
var count = 0;

app.listen(port);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.on('connection', function (socket) {
  socket.nickname = 'user_' + ++count;

  io.emit('enter', {
    type: 'in',
    name: socket.nickname,
    message: 'enter'
  });

  socket.on('send', function (data) {
    data.name = socket.nickname;
    io.emit('receive', data)
  });

  socket.on('disconnect', function() {
    io.emit('leave', {
      type: 'out',
      name: socket.nickname,
      message: 'leave'
    })
  })
});

console.log("WebSocket server listening at port " + port)
