class ApplicationController < ActionController::API
	def send_res opt={}
		result = {}
		result['status'] = opt[:status] || 200
		result['success'] = opt[:success] || 'true'
		result['message'] = opt[:message] || ''
		result['data'] = opt[:data]
		render json: result 
	end
end
