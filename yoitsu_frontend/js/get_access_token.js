var ACCESS_TOKEN = null;
function get_access_token(){
	ACCESS_TOKEN = document.cookie.match(/;?\s+t=([a-zA-Z0-9]+)/)[1] || null
}