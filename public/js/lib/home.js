function testInputValue() {
  var input = document.getElementById('facebook_search');
  var parent = $(input).closest('.input-field');
  var value = input.value;
  if (value.indexOf("facebook.com/profile.php?id=") > -1) {
    $(parent).addClass('valid');
  } else {
    $(parent).removeClass('valid');
  }
}

$('body').on('click', '#facebook_submit', function(){
  var rawUser = $('#facebook_search').val();
  console.log('rawdata: ' + rawUser);
  var id = rawUser.split('profile.php?id=');
  console.log('user id is: ' + id[1]);
  //var seletedId = example.substring(example.lastIndexOf("/") + 1));
  // Animate stuff nicely

  // transition badly
  $( "#homeHeader" ).slideUp( "medium", function() {
    // Animation complete.
    $( "#homeSelect" ).slideDown( "medium", function() {
      $.get("https://graph.facebook.com/" + id[1] + "?access_token=478232152301788|2ZgNLqsJ_w3qD0LdMpsaweN8XFc", function(data, status){
        $('#homeSelect .indeterminate').addClass('determinate').removeClass('interdeterminate').css({
          width : '100%',
          backgroundColor: '#fff'
        });
        $('#whois').append(
          '<h1 class="item"> Name: ' + data.name + '</h1>' +
          '<h1 class="item"> Last seen: searching..</h1>' +
          '<div class="clear"></div>' +
          '<div class="progress">' +
            '<div class="indeterminate"></div>' +
          '</div>'
        );
        $.get("/ulookup/" + data.id, function(data, status){

          console.log("Data: " + JSON.stringify(data) + "\nStatus: " + status);
        });
      });

      // $.get("/find?uid=" + rawUser, function(data, status){
      //   alert("Data: " + data + "\nStatus: " + status);
      // });
    });
  });

});

$(document).ready(function(){
  'use strict';
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var c = document.createElement('canvas');
  c.className = 'dynamicBackground';
  document.body.appendChild(c);
  var $ = c.getContext('2d');

  var w = c.width = window.innerWidth;
  var h = c.height = window.innerHeight;

  var pro = 0;
  var anti = 360;

  //*****************************************
  //* Particles
  //*****************************************

  var Particle = (function () {
  function Particle(opts) {
    _classCallCheck(this, Particle);

    this.t = opts.t;
    this.arr = opts.arr;

    this.vx = -.5 + Math.random();
    this.vy = -.5 + Math.random();
    this.radius = Math.max(2 * Math.random());
  }

  Particle.prototype.render = function render() {
    $.beginPath();
    $.fillStyle = 'white';
    $.arc(this.x, this.y, this.radius, 0, 4 * Math.PI, false);
    $.fill();
  };

  Particle.prototype.create = function create() {
    for (var i = 0; i < this.t; i++) {
      this.arr.push(new Particle({
        t: 500,
        arr: []
      }));
    }
  };

  Particle.prototype.place = function place() {
    this.x = Math.floor(w * Math.random());
    this.y = Math.floor(h * Math.random());
  };

  Particle.prototype.move = function move() {
    this.arr.map(function (_) {
      if (_.y < 0 || _.y > h) _.vy = -_.vy;
      if (_.x < 0 || _.x > w) _.vx = -_.vx;

      _.x += _.vx;
      _.y += _.vy;
    });
  };

  return Particle;
  })();

  var o = new Particle({
  t: 200,
  arr: []
  });

  o.create();
  o.arr.map(function (_) {
  return _.place();
  });

  //*****************************************
  //* /Particles
  //*****************************************

  (function draw() {
  pro === 360 ? pro = 0 : pro++;
  anti === 0 ? anti = 360 : anti--;

  $.beginPath();

  $.fillStyle = 'hsla(0, 87%, 57.3%, 0.1)';
  $.fillRect(0, 0, w, h);

  $.stroke();
  $.fill();

  o.move();
  o.arr.map(function (_) {
    return _.render();
  });

  window.requestAnimationFrame(draw);
  })();

  window.addEventListener('resize', function () {
  w = c.width = window.innerWidth;
  h = c.height = window.innerHeight;
  }, false);
});
