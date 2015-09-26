var socket = io.connect('http://localhost:80');

socket.on('webstream', function(data){
  console.log('Received result from server: ' + data)
  //$('#messages').append($('<li>').text(msg));
});
