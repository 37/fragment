//var socket = io.connect('http://115.146.86.121:80');
var socket = io.connect('http://localhost:3000');

socket.on('webstream', function(data){
  console.log('Received result from server: ' + data)
  //$('#messages').append($('<li>').text(msg));
});
