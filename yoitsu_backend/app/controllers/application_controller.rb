class ApplicationController < ActionController::API
	after_action :set_cors
	def send_res opt={}
		result = {}
		result['status'] = opt[:status] || 200
		result['success'] = opt[:success] || 'true'
		result['message'] = opt[:message] || ''
		result['data'] = opt[:data]
		render json: result 
	end
	def set_cors
    headers['Access-Control-Allow-Origin'] = 'https://chatroom.netoge-haijin.moe'
    headers['Access-Control-Request-Method'] = '*'
	end

	def access_token_exsit?
		params[:access_token] && !params[:access_token].empty? ? true : false
	end
end
