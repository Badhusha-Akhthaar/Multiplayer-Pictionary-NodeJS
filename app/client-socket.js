var url = new URL(window.location.href);
const roomID = url.searchParams.get("roomid");
const mode = url.searchParams.get("mode");
const username = url.searchParams.get("name");
console.log(roomID, mode, username);
var _path = [];
if (
  roomID == undefined ||
  roomID == null ||
  roomID === "" ||
  mode == undefined ||
  mode == null ||
  mode === "" ||
  username === undefined ||
  username === null ||
  username === ""
) {
  window.location.href = "/";
}
var socket = io();
socket.on("connect", () => {
  switch (mode) {
    case "JOIN":
      socket.emit("joinroom", roomID, username,(response)=>{
        if(response){
          alert("User already existing");
          window.location.href = "/";
        }
      });
      break;
    case "CREATE":
      socket.emit("createroom", roomID, username);
      sessionStorage.setItem(username, "isDrawing");
      break;
  }
});
socket.on("existingroom", () => {
  alert("Try again later");
  window.location.href = "/";
});

socket.on("path-received", (path) => {
  _path = path;
});

socket.on("notify-others", (username) => {
  bulmaToast.toast({
    message: `${username} joined this room`,
    type: "is-success",
    dismissible: true,
    closeOnClick: true,
  });
});

socket.on("left-room", (username) => {
  bulmaToast.toast({
    message: `${username} left this room`,
    type: "is-danger",
    dismissible: true,
    closeOnClick: true,
  });
});
