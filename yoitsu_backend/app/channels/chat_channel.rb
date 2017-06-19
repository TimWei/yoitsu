class ChatChannel < ApplicationCable::Channel
  def subscribed
    @room_id = params[:room_id] 
    @sender = User.find_by_token(params[:access_token])
    @redis = Redis.current
    stop_all_streams
    stream_from "room_#{@room_id}"
    @redis.sadd "room_#{@room_id}_userlist", "#{@sender.id}_#{@sender.name}" 
    @subscribed = true
  end

  def unsubscribed
    stop_all_streams
    @redis.srem "room_#{@room_id}_userlist", "#{@sender.id}_#{@sender.name}" 
    @subscribed = false
  end

  def send_msg body
    message = body['msg']
    msg = Message.create(content: message,name: @sender.name, user_id: @sender.id, room_id: @room_id, color: @sender.color)
    broadcast_room json_data: {id: msg.id, content: CGI::escapeHTML(message), sender: @sender.name, at: msg.created_at.strftime("%H:%M"), color: msg.color}
  end

  def broadcast_room opt={}
    ActionCable.server.broadcast "room_#{@room_id}",  opt[:json_data]
  end
end