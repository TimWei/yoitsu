class Api::V1::UserController < ApplicationController
	def create
		if params[:access_token]
			user = User.find_by_token params[:access_token]
		else
			user = User.create			
		end
		user_info = {}
		user_info['id'] = user.id
		user_info['access_token'] = user.token
		send_res data: user_info 
	end

end
