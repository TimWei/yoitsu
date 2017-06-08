function get_rooms() {
	res = $.ajax({
		type: "GET",
		url: "https://chat.netoge-haijin.moe/api/v1/rooms",
		data: { 'access_token': ACCESS_TOKEN },
		success: function (data) {
			if (data['success'] == 'true') {
				console.log('size: ' + data['data']['size'])
				room_list = data['data']['list']
				room_list.forEach(e =>
					console.log(e)
					// TODO append obj to ele

				)

				// TODO proceed app to next scene
				window.location.hash = 'chat_box';
			}
		},
		error: function (json) {
			console.log('API not available!');
			// TODO handling error here
			window.location.hash = 'error';
		}
	});
}