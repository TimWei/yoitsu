class Api::V1::UserController < ApplicationController
	def create
		user = User.find_by_token params[:access_token]
		if access_token_exsit? && user.present?
			user.name = params[:name]
			user.save
		else
			user = User.create(name: params[:name])
		end
		user_info = {}
		user_info['id'] = user.id
		user_info['access_token'] = user.token
		send_res data: user_info 
	end

end
