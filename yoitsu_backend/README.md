# Yoitsu backend
>> Providing Yoitsu chatroom's backend API using RoR.
------

*	` GET '/server/ping' `
	- usage: check if API server available
	- parameters: empty
	- response:
		- status: 
			- 200:
				- data:
					- 'server': if API server is available should retune string 'pong'
			- 500:
				- server is not available


*	` POST '/users' `
	- usage: find or create user for chat 
 	- parameters: 'access_token' or empty
 	- response:
 		- status:
 			- 200:
 				- data:
 					- 'id' current user's id
 					- 'access_token' current user's access_token
 			- 500:
 				- general error res code

*	` GET '/rooms' `
	- usage: get rooms list
	- parameters: 'access_token'
		- response:
			- status: 
				- 200:
					- data:
						- 'size': rooms list size
						- 'list': rooms list 
							- 'id': room's id
							- 'name': room's name
	
* `	GET '/rooms/:room_id' `
	-	usage: enter a room
	-	paramters: 'access_token', 'room_id'
	-	response:
		- status:
			-	200: 
				-	data:	
					-	'exist_messages': list of exist message
						-	'size': size of exist message list
						-	'list': 
							-	'id': message's id
							-	'name': message sender's name
							-	'content': message content
							-	'at': message create time
