var socket = io.connect('http://115.146.86.121:80');

socket.on('webstream', function(data){
  console.log('Received result from server: ' + data)
  //$('#messages').append($('<li>').text(msg));
});
