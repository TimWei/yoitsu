class ChatChannel < ApplicationCable::Channel
  def subscribed
    @room_id = params[:room_id] 
    @sender = User.find_by_token(params[:access_token])
    stop_all_streams
    stream_from "room_#{@room_id}"
    @subscribed = true
  end

  def unsubscribed
    stop_all_streams
    @subscribed = false
  end

  def send_msg body
    message = body['msg']
    Message.create(content: message,name: @sender.name, user_id: @sender.id, room_id: @room_id)
    broadcast_room message: message
  end

  def broadcast_room opt={}
    ActionCable.server.broadcast "room_#{@room_id}",  opt[:message]
  end
end