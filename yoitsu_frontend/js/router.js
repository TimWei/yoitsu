var your_name = "";
var ACCESS_TOKEN = null;
window.App = {};
function get_access_token() {
  cur_token = document.cookie.match(/;?\s*t=([a-zA-Z0-9]+)/)
  if(cur_token){
    ACCESS_TOKEN = cur_token[1]
  }else{
    ACCESS_TOKEN = null
  } 
}

function FrontRouter() {
  this.routes = {};

  window.addEventListener('load', this.resolve.bind(this), false);

  window.addEventListener('hashchange', this.resolve.bind(this), false);
}

FrontRouter.prototype.route = function (path, callback) {
  get_access_token();
  this.routes[path] = callback || function () { };
};

FrontRouter.prototype.resolve = function () {
  this.curHash = location.hash.slice(1) || '/';
  typeof this.routes[this.curHash] === 'function' && this.routes[this.curHash]();
};

var router = new FrontRouter();

router.route('/', login);

router.route('chat', chat);

router.route('login', login);

router.route('rooms', inRoom);

router.route('error', error);

function hideAll() {
  console.log("hide all");
  $('.container > div').hide();
}

function newGroup() {
  var li_item = document.createElement('li');
  li_item.className = "list-group-item";
  var span_item = document.createElement('span');
  span_item.className = "badge";
  //span_item.innerHTML = "0";

  li_item.innerHTML = document.getElementById("group-name").value;

  var rooms = document.getElementById("chats");
  rooms.appendChild(li_item);
  li_item.appendChild(span_item);
}

function login() {
  check_server_available();
  hideAll();
  $('#login').show();
  $('#sign_in_btn').click(function(){
    $('#login-value').val('');
  });
  $('#login-value').change(function(){
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
}

function inRoom() {
  hideAll();
  $('#rooms').show();
  $('#say').change(function(){
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
}

function chat() {
  hideAll();
  $('#chat_box').show();  
}

function error() {
  hideAll();
  $('#error').show();
}

function check_server_available() {
  res = $.ajax({
    type: "GET",
    url: "https://chat.netoge-haijin.moe/api/v1/server/ping",
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
  your_name = document.getElementById("login-value").value;
  console.log(your_name);
  //clear
  document.getElementById("room-list").innerHTML = "";

  res = $.ajax({
    type: "POST",
    url: "https://chat.netoge-haijin.moe/api/v1/users",
    data: {
      'access_token': ACCESS_TOKEN,
      'name': your_name
    },
    success: function (data) {
      if (data['success'] == 'true') {
        document.cookie = 't=' + data['data']['access_token'];
        console.log('access_token: ' + data['data']['access_token']);
        //	TODO proceed to next scene
        get_rooms();
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
    url: "https://chat.netoge-haijin.moe/api/v1/rooms",
    data: { 'access_token': ACCESS_TOKEN },
    success: function (data) {
      if (data['success'] == 'true') {
        console.log('size: ' + data['data']['size'])
        room_list = data['data']['list']
        room_list.forEach(e =>
          newRoom(e)
        )
        window.location.hash = 'rooms';
      }
    },
    error: function (json) {
      console.log('API not available!');
      window.location.hash = 'error';
    }
  });
}

function newRoom(room) {
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
    url: 'https://chat.netoge-haijin.moe/api/v1/rooms/' + room_id,
    data: { 'access_token': ACCESS_TOKEN },
    success: function (data) {
      if (data['success'] == 'true') {
        exsit_message = data['data']['exist_messages']
        console.log('old message size: ' + exsit_message['size'])
        room_list = exsit_message['list']
        room_list.forEach(e =>
          newChat(e)
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

function newChat(chat) {
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
  window.App.cable = ActionCable.createConsumer("ws://chat.netoge-haijin.moe/cable")
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
      newChat(data)
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