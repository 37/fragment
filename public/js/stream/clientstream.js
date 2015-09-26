var localVideo;
var localCanvas;
var userId = document.getElementById("userId").value;
// Initialise video feed on client-side
initialize = function() {
  localVideo = document.getElementById("stream");
  localCanvas = document.getElementById("overlay");
  try {
    //trace("Requested access to local media");
    navigator.getUserMedia({video:true}, onGotStream, onFailedStream);
  } catch (e) {
    //trace_e(e, "getUserMedia error");
    alert("getUserMedia error " + e);
  }
}

poll = function() {
  var w = localVideo.videoWidth;
  var h = localVideo.videoHeight;
  var canvas = document.getElementById('overlay');
  canvas.width  = w;
  canvas.height = h;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(localVideo, 0, 0, w, h);

  //trace canvas and push data:
  var data = localCanvas.toDataURL('image/jpeg', 1.0);
  // console.log(data); <-- Base64 Data conversion
  socket.emit('webstream', { user : userId, data : data });

  // Disabled snippet (narrowed down pre-predicted image)
  // var comp = ccv.detect_objects({
  //   "canvas" : ccv.grayscale(canvas),
  //   "cascade" : cascade,
  //   "interval" : 5,
  //   "min_neighbors" : 1
  // });

  /* draw detected area */
  localCanvas.width = localVideo.clientWidth;
  localCanvas.height = localVideo.clientHeight;

  var ctx2 = localCanvas.getContext('2d');
  ctx2.lineWidth = 2;
  ctx2.lineJoin = "round";
  ctx2.clearRect (0, 0, localCanvas.width,localCanvas.height);

  var x_offset = 0, y_offset = 0, x_scale = 1, y_scale = 1;

  if (localVideo.clientWidth * localVideo.videoHeight > localVideo.videoWidth * localVideo.clientHeight) {
    x_offset = (localVideo.clientWidth - localVideo.clientHeight *
      localVideo.videoWidth / localVideo.videoHeight) / 2;
  } else {
    y_offset = (localVideo.clientHeight - localVideo.clientWidth *
              localVideo.videoHeight / localVideo.videoWidth) / 2;
  }

  x_scale = (localVideo.clientWidth - x_offset * 2) / localVideo.videoWidth;
  y_scale = (localVideo.clientHeight - y_offset * 2) / localVideo.videoHeight;

  // for (var i = 0; i < comp.length; i++) {
  //   comp[i].x = comp[i].x * x_scale + x_offset;
  //   comp[i].y = comp[i].y * y_scale + y_offset;
  //   comp[i].width = comp[i].width * x_scale;
  //   comp[i].height = comp[i].height * y_scale;
  //   var opacity = 0.1;
  //   if (comp[i].confidence > 0) {
  //     opacity += comp[i].confidence / 10;
  //     if (opacity > 1.0) opacity = 1.0;
  //   }

  //ctx2.strokeStyle = "rgba(255,0,0," + opacity * 255 + ")";

  //   ctx2.lineWidth = opacity * 10;
  //   ctx2.strokeStyle = "rgb(255,0,0)";
  //   ctx2.strokeRect(comp[i].x, comp[i].y, comp[i].width, comp[i].height);
  // }


  // log state of video


  // Repeat
  setTimeout(poll, 200);
}

onGotStream = function(stream) {
  localVideo.style.opacity = 1;
  localVideo.srcObject = stream;
  localStream = stream;

  //trace("User has granted access to local media. url = " + url);
  setTimeout(poll, 50);
}
onFailedStream = function(error) {
alert("Failed to get access to local media. Error code was " + error.code + ".");
//trace_warning("Failed to get access to local media. Error code was " + error.code);
}
setTimeout(initialize, 1);
