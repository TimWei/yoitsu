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

function FrontRouter() {
  this.routes = {};
  window.addEventListener('load', this.resolve.bind(this), false);
  window.addEventListener('hashchange', this.resolve.bind(this), false);
}

FrontRouter.prototype.route = function (path, callback) {
  this.routes[path] = callback || function () { };
};

FrontRouter.prototype.resolve = function () {
  this.curHash = location.hash.slice(1) || '/';
  match_key = this.match_reg( this.curHash )
  typeof this.routes[match_key] === 'function' && this.routes[match_key](this.curHash);
};

FrontRouter.prototype.match_reg = function (cur_hash) {
  // if matching nothing goes '/'
  match_key = '/'
  for( router_key in this.routes){
    reg = new RegExp('^' + router_key + '$')
    if(cur_hash.match(reg)){
      match_key = router_key
    }
  }
  return match_key
};

var router = new FrontRouter();

router.route('/', function(cur_hash) {
  get_access_token();
  check_server_available();
  div_active($('#login'));
  $('#sign_in_btn').click(function(){
    $('#login-value').val('');
  });
  $('#login-value').on('input', function(){
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

router.route('rooms\\/[0-9]*', function(cur_hash) {
  get_access_token();
  room_id = cur_hash.split('/')[1];
  chat_init(room_id); 
  div_active($('#chat_box'));
});

router.route('rooms', function(cur_hash) {
  get_access_token();
  div_active($('#rooms'));
  get_rooms_list();
});

router.route('error', function(cur_hash) {
  div_active($('#error'));
});

function div_active(element) {
  $('.container > div').hide();
  element.show();
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
  USER_NAME = $('#login-value').val();
  console.log(USER_NAME);
  //clear
  $('#room-list').html('');

  res = $.ajax({
    type: "POST",
    url: HOST + "/api/v1/users",
    data: {
      'access_token': ACCESS_TOKEN,
      'name': USER_NAME
    },
    success: function (data) {
      if (data['success'] == 'true') {
        document.cookie = 't=' + data['data']['access_token'] + '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
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

function get_rooms_list() {
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
          new_room_item(e)
        )
      }
    },
    error: function (json) {
      console.log('API not available!');
      window.location.hash = 'error';
    }
  });
}

function new_room_item(room) {
  console.log(room);
  var rooms = $('#room-list');
  var click_pad = $('<a href="#rooms/' + room.id + '">')
  var li_item = $("<li class='list-group-item'>").text(room.name);
  var span_item =$("<span class='badge'>").text(room.id);
 
  li_item.append(span_item);
  click_pad.append(li_item);
  rooms.append(click_pad);

  console.log("get room id : " + room.id);
}

function chat_init(room_id) {
  // clear
  $('#chats').html('');
  get_exsit_message(room_id);
  chat_channel(room_id);
  $('#say').off().on('input', function(){
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
  $('#say_button').off().click(function(){
    window.App.chat_channel.send_msg($('#say').val());
    $('#say').val('');
  });
}

function get_exsit_message(room_id){
  res = $.ajax({
    type: "GET",
    url: HOST + '/api/v1/rooms/' + room_id,
    data: { 'access_token': ACCESS_TOKEN },
    success: function (data) {
      if (data['success'] == 'true') {
        exsit_message = data['data']['exist_messages']
        console.log('old message size: ' + exsit_message['size'])
        exist_messages = exsit_message['list']
        exist_messages.forEach(e =>
          new_message(e)
        )
      }
    },
    error: function (json) {
      console.log('API not available!');
      window.location.hash = 'error';
    }
  });
}

function new_message(message) {
  console.log("get message id: " + message.id);
  // wrap on chat
  var message_div = $('<div>');
  // name
  var label_item = $('<label class="control-label">').html(message.sender);
  // at time
  var span_item = $('<span class="pull-right">').html(message.at);
  // content
  var message_content = $('<div class="well well-sm">').html(message.content);
  var chats = $('#chats');
  $('#chats').prepend(
    message_div.append(label_item).append(span_item).append(message_content)
  );
}


function chat_channel(enter_room_id) {
  console.log("channel");
  if (window.App.chat_channel) {
    window.App.cable.subscriptions.remove(window.App.chat_channel);
  }
  window.App.cable = ActionCable.createConsumer(CABLE_HOST)
  window.App.chat_channel = window.App.cable.subscriptions.create({ 
    channel: "ChatChannel", 
    room_id: enter_room_id, 
    access_token: ACCESS_TOKEN }, 
    {
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
        console.log(data);
        new_message(data)
      },
      send_msg: function (data) {
        writeLog("sending")
        this.perform("send_msg", { msg: data })
      },
    }
  );

  function writeLog(message) {
    console.log("===WS: " + message)
  }
}