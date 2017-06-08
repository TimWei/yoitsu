class Api::V1::ServerController < ApplicationController
	def ping
		res = {}
		res['server'] = 'pong'

		send_res data: res
	end
end
