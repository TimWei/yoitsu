class Api::V1::RoomController < ApplicationController
	before_action :set_user
	def index
		rooms = Room.all
		rooms_info = {}
		rooms_info['size'] = rooms.size
		rooms_info['list'] = rooms.map{|t| {id: t.id, name: t.name, counter: Redis.current.smembers("room_#{t.id}_userlist").size}}
		send_res data: rooms_info
	end

	def create
		room = Room.new(name: params[:room_name])
		if room.save
			send_res data: {id: room.id, name: room.name}
		else
			send_res success: 'false'
		end
	end

	def show
		room = Room.find_by_id params[:room_id]
		exist_messages =  room.exist_messages
		room_info = {}
		room_info['exist_messages'] = {size: exist_messages.size, list: exist_messages}
		send_res data: room_info
	end 

	def users
		room = Room.find_by_id params[:room_id]
		users = Redis.current.smembers("room_#{@room_id}_userlist")
		users_info = {}
		users_info['list'] = users.map{|t| t.split('_')[1..-1].join('_') }
		send_res data: users_info
	end 

	private 
	def set_user
		@user = User.find_by_token params[:access_token] 
		if @user 
			@user 
		else 
			send_res success:false, message: 'user not found' 
		end
	end
end
