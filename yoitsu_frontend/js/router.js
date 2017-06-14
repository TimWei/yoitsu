var USER_NAME = "";
var ACCESS_TOKEN = null;
var HOST = '//chat.netoge-haijin.moe';
var CABLE_HOST = 'ws://chat.netoge-haijin.moe/cable'
window.App = {};

function get_access_token() {
  cur_token = document.cookie.match(/;?\s*t=([a-zA-Z0-9]+)/)
  if(cur_token){
    ACCESS_TOKEN = cur_token[1]
  }else{
    ACCESS_TOKEN = null
  } 
}

function front_router() {
  this.routes = {};
  window.addEventListener('load', this.resolve.bind(this), false);
  window.addEventListener('hashchange', this.resolve.bind(this), false);
}

front_router.prototype.route = function (path, callback) {
  this.routes[path] = callback || function () { };
};

front_router.prototype.resolve = function () {
  this.curHash = location.hash.slice(1) || '/';
  typeof this.routes[this.curHash] === 'function' && this.routes[this.curHash]();
};

var router = new front_router();

router.route('/', function() {
  get_access_token();
  check_server_available();
  hide_all();
  $('#login').show();
  $('#sign_in_btn').click(function(){
    $('#login-value').val('');
  });
  $('#login-value').bind('input', function(){
    value = this.value;
    btn = $('#sign_in_btn');
    if(value == ''){
      btn.attr('disabled',true);
      btn.removeClass('btn-success');
      btn.removeClass('btn-default');
      btn.addClass('btn-danger');
    }else{
      btn.attr('disabled',false);
      btn.addClass('btn-success');
      btn.removeClass('btn-default');
      btn.removeClass('btn-danger');
    }
  })
});

router.route('chat', function() {
  get_access_token();
  hide_all();
  $('#chat_box').show();  
});

router.route('rooms', function() {
  get_access_token();
  hide_all();
  $('#rooms').show();
  get_rooms();
  $('#say').bind('input', function(){
    value = this.value;
    btn = $('#say_button');
    if(value == ''){
      btn.attr('disabled',true);
      btn.removeClass('btn-success');
      btn.removeClass('btn-default');
      btn.addClass('btn-danger');
    }else{
      btn.attr('disabled',false);
      btn.addClass('btn-success');
      btn.removeClass('btn-default');
      btn.removeClass('btn-danger');
    }
  })
});

router.route('error', function() {
  hide_all();
  $('#error').show();
});

function hide_all() {
  console.log("hide all");
  $('.container > div').hide();
}


function check_server_available() {
  res = $.ajax({
    type: "GET",
    url: HOST + "/api/v1/server/ping",
    success: function (data) {
      if (data['success'] == 'true') {
        console.log('API available!');
      }
    },
    error: function (json) {
      console.log('API not available!');
      window.location.hash = 'error';
    }
  });
}

function user_signin() {
  USER_NAME = document.getElementById("login-value").value;
  console.log(USER_NAME);
  //clear
  document.getElementById("room-list").innerHTML = "";

  res = $.ajax({
    type: "POST",
    url: HOST + "/api/v1/users",
    data: {
      'access_token': ACCESS_TOKEN,
      'name': USER_NAME
    },
    success: function (data) {
      if (data['success'] == 'true') {
        document.cookie = 't=' + data['data']['access_token'];
        console.log('access_token: ' + data['data']['access_token']);
        get_access_token();
        window.location.hash = 'rooms';
      }
    },
    error: function (json) {
      console.log('sign in fail');
      window.location.hash = 'error';
    }
  });
}

function get_rooms() {
  res = $.ajax({
    type: "GET",
    url: HOST + "/api/v1/rooms",
    data: { 'access_token': ACCESS_TOKEN },
    success: function (data) {
      if (data['success'] == 'true') {
        $('#room-list').html('');
        console.log('size: ' + data['data']['size'])
        room_list = data['data']['list']
        room_list.forEach(e =>
          new_room(e)
        )
      }
    },
    error: function (json) {
      console.log('API not available!');
      window.location.hash = 'error';
    }
  });
}

function new_room(room) {
  console.log(room);
  var li_item = document.createElement('li');
  li_item.className = "list-group-item";
  li_item.onclick = function () { enter_room(room.id); };
  var span_item = document.createElement('span');
  span_item.className = "badge";
  span_item.innerHTML = room.id;
  li_item.innerHTML = room.name;

  var rooms = document.getElementById("room-list");
  rooms.appendChild(li_item);
  li_item.appendChild(span_item);
  console.log("append" + room.id);
}

function enter_room(room_id) {

  // clear
  document.getElementById("chats").innerHTML = "";

  chat_channel(room_id);
  document.getElementById("say_button").onclick = function () {
    window.App.chat_channel.send_msg(document.getElementById("say").value)
     $('#say').val('');
  };
  res = $.ajax({
    type: "GET",
    url: HOST + '/api/v1/rooms/' + room_id,
    data: { 'access_token': ACCESS_TOKEN },
    success: function (data) {
      if (data['success'] == 'true') {
        exsit_message = data['data']['exist_messages']
        console.log('old message size: ' + exsit_message['size'])
        room_list = exsit_message['list']
        room_list.forEach(e =>
          new_chat(e)
        )
        window.location.hash = 'chat';
      }
    },
    error: function (json) {
      console.log('API not available!');
      window.location.hash = 'error';
    }
  });
}

function new_chat(chat) {
  // wrap on chat
  var one_chat = document.createElement('div');
  // name
  var label_item = document.createElement('label');
  label_item.className = "control-label";
  label_item.innerHTML = chat.sender;
  // at time
  var span_item = document.createElement('span');
  span_item.className = "pull-right";
  span_item.innerHTML = chat.at;
  // content
  var div_item = document.createElement('div');
  div_item.className = "well well-sm";
  div_item.innerHTML = chat.content;

  var chats = document.getElementById("chats");
  chats.insertBefore(one_chat, chats.firstChild);
  one_chat.appendChild(label_item);
  one_chat.appendChild(span_item);
  one_chat.appendChild(div_item);
  console.log("append" + chat.id);
}


function chat_channel(enter_room_id) {
  console.log("channel");
  if (window.App.chat_channel) {
    window.App.cable.subscriptions.remove(window.App.chat_channel);
  }
  window.App.cable = ActionCable.createConsumer(CABLE_HOST)
  window.App.chat_channel = window.App.cable.subscriptions.create({ channel: "ChatChannel", room_id: enter_room_id, access_token: ACCESS_TOKEN }, {
    connected: function () {
      writeLog("connected")
    },
    disconnected: function () {
      writeLog("disconnected")
    },
    rejected: function () {
      writeLog("rejected")
    },
    received: function (data) {
      writeLog(data)
      //TODO append received msg to billboard here
      console.log(data);
      new_chat(data)
    },
    send_msg: function (data) {
      writeLog("sending")
      this.perform("send_msg", { msg: data })
    },
  });

  function writeLog(message) {
    console.log("===WS: " + message)
  }
}