function chat_channel(enter_room_id) {
  ActionCable.startDebugging()
  window.App = {}
  window.App.cable = ActionCable.createConsumer("ws://chat.netoge-haijin.moe/cable")
  window.App.chat_channel = window.App.cable.subscriptions.create({channel: "ChatChannel", room_id: enter_room_id, access_token: ACCESS_TOKEN}, {
    connected: function() {
      writeLog("connected")
    },
    disconnected: function() {
      writeLog("disconnected")
    },
    rejected: function() {
      writeLog("rejected")
    },
    received: function(data) {
      writeLog(data)
      //TODO append received msg to billboard here
      //{"message":"text_body","sender":"sender_name","at":"08:10"}
 
    },
    send_msg: function(data) {
      writeLog("sending")
      this.perform("send_msg",{msg:data})
    },
  });

  function writeLog(message) {
    console.log("===WS: " + message)
  }
}