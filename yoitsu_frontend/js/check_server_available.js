function check_server_available() {
	res = $.ajax({
		type: "GET",
		url: "https://chat.netoge-haijin.moe/api/v1/server/ping",
		success: function (data) {
			if (data['success'] == 'true') {
				console.log('API available!');
				// TODO proceed app to next scene
				window.location.hash = 'login';
			}
		},
		error: function (json) {
			console.log('API not available!')
			// TODO handling error here
			window.location.hash = 'error';
		}
	});
}