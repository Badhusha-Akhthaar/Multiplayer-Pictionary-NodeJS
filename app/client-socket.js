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
      socket.emit("joinroom", roomID, username);
      break;
    case "CREATE":
      socket.emit("createroom", roomID, username);
      sessionStorage.setItem(username,"isDrawing");
      break;
  }
});
socket.on("existingroom", () => {
  alert("Try again later");
  window.location.href = "/";
});

socket.on("path-received",(path)=>{
    _path = path;
})
