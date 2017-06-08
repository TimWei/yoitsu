function user_signin(){
	res = $.post('https://chat.netoge-haijin.moe/api/v1/users', 
					{'access_token': ACCESS_TOKEN},
					function(data){
						if(data['success'] == 'true'){
							document.cookie = 't=' + data['data']['access_token']
							console.log('access_token: ' + data['data']['access_token'])
						//	TODO proceed to next scene

						}else{
							console.log('sign in fail')
						//	TODO handling error here
						
						}
					})
}