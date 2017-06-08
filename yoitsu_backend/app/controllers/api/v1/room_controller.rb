class Api::V1::RoomController < ApplicationController
	before_action :set_user
	def index
		rooms = Room.all
		rooms_info = {}
		rooms_info['size'] = rooms.size
		rooms_info['list'] = rooms.map{|t| {id: t.id, name: t.name}}
		send_res data: rooms_info
	end

	def create
		# planning
	end

	def show
		room = Room.find_by_id params[:room_id]
		exist_messages =  room.exist_messages
		room_info = {}
		room_info['exist_messages'] = {size: exist_messages.size, list: exist_messages}
		send_res data: room_info
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
