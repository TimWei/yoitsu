var your_name = "";

function FrontRouter() {
  this.routes = {};

  window.addEventListener('load', this.resolve.bind(this), false);

  window.addEventListener('hashchange', this.resolve.bind(this), false);
}

FrontRouter.prototype.route = function (path, callback) {
  this.routes[path] = callback || function () { };
};

FrontRouter.prototype.resolve = function () {
  this.curHash = location.hash.slice(1) || '/';
  typeof this.routes[this.curHash] === 'function' && this.routes[this.curHash]();
};

var router = new FrontRouter();

router.route('chat', chat);

router.route('login', login);

router.route('rooms', inRoom);

router.route('error', error);


function hideAll() {
  console.log("hideall");
  document.getElementById("rooms").style.display = "none";
  document.getElementById("chat_box").style.display = "none";
  document.getElementById("chats").style.display = "none";
  document.getElementById("error").style.display = "none";
}

function newGroup() {
  var li_item = document.createElement('li');
  li_item.className = "list-group-item";
  var span_item = document.createElement('span');
  span_item.className = "badge";
  //span_item.innerHTML = "0";

  li_item.innerHTML = document.getElementById("group-name").value;

  var rooms = document.getElementById("chats");
  rooms.appendChild(li_item);
  li_item.appendChild(span_item);
}

function login() {
  your_name = document.getElementById("login-value").value;
  console.log(your_name);
  hideAll();
  document.getElementById("login").style.display = "block";

}

function inRoom() {
  hideAll();
  document.getElementById("rooms").style.display = "block";
}

function chat() {
  hideAll();
  document.getElementById("chat_box").style.display = "block";
}

function error() {
  hideAll();
  document.getElementById("error").style.display = "block";
}
