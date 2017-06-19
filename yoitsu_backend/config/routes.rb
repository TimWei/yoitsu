Rails.application.routes.draw do
	mount ActionCable.server => '/cable'
	
	namespace :api do
		namespace :v1 do
			scope 'server' do
				#check server status
				get 'ping' => 'server#ping'
			end

			scope 'users' do
				# get user info by access token
				post '/' => 'user#create'
			end
			
			scope 'rooms' do
				#get room list
				get '/' => 'room#index'
				#create room
				post '/' => 'room#create'
				#enter room
				get '/:room_id' => 'room#show'
				#get room's user list
				get '/:room_id/users' => 'room#users'
			end

		end
	end

end
