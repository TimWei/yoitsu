function user_signin() {
	res = $.ajax({
		type: "POST",
		url: "https://chat.netoge-haijin.moe/api/v1/users",
		data: { 'access_token': ACCESS_TOKEN },
		success: function (data) {
			if (data['success'] == 'true') {
				document.cookie = 't=' + data['data']['access_token'];
				console.log('access_token: ' + data['data']['access_token']);
				//	TODO proceed to next scene
				get_access_token();
			}
		},
		error: function (json) {
			console.log('sign in fail');
			// TODO handling error here
			window.location.hash = 'error';
		}
	});
}