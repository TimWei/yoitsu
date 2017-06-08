function get_rooms(){
	res = $.get('https://chat.netoge-haijin.moe/api/v1/rooms', 
					{'access_token': ACCESS_TOKEN},		
					function(data){
						if(data['success'] == 'true'){
							console.log('size: ' + data['data']['size'])
							room_list = data['data']['list']
							room_list.forEach(e=> 
								console.log(e)
								// TODO append obj to ele
								
							)

							// TODO proceed app to next scene
						}else{
							console.log('API not available!')
							// TODO handling error here
						}
					})
}