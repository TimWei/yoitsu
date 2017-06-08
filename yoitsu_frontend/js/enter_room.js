function enter_room(room_id) {
	res = $.ajax({
		type: "GET",
		url: 'https://chat.netoge-haijin.moe/api/v1/rooms/' + room_id,
		data: { 'access_token': ACCESS_TOKEN },
		success: function (data) {
			if (data['success'] == 'true') {
				exsit_message = data['data']['exist_messages']
				console.log('old message size: ' + exsit_message['size'])
				room_list = exsit_message['list']
				room_list.forEach(e =>
					console.log(e)
					// TODO append message to billboard

				)
			}
		},
		error: function (json) {
			console.log('API not available!');
			// TODO handling error here
			window.location.hash = 'error';
		}
	});
}