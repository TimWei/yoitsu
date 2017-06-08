function check_server_available(){
	res = $.get('https://chat.netoge-haijin.moe/api/v1/server/ping', 
					function(data){
						if(data['success'] == 'true'){
							console.log('API available!')
							// TODO proceed app to next scene

						}else{
							console.log('API not available!')
							// TODO handling error here
						}
					})
}