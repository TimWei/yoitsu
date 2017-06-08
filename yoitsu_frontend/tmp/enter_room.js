function enter_room(room_id){
	res = $.get('https://chat.netoge-haijin.moe/api/v1/rooms/' + room_id, 
					{'access_token': ACCESS_TOKEN},		
					function(data){
						if(data['success'] == 'true'){
							exsit_message = data['data']['exist_messages']
							console.log('old message size: ' + exsit_message['size'])
							room_list = exsit_message['list']
							room_list.forEach(e=> 
								console.log(e)
								// TODO append message to billboard
								
							)
						}else{
							console.log('API not available!')
							// TODO handling error here
						}
					})
}