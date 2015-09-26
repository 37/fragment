var socket = io.connect('http://localhost:3000');

socket.on('webstream', function(data){
  console.log('Received result from server: ' + data)
  //$('#messages').append($('<li>').text(msg));
});
