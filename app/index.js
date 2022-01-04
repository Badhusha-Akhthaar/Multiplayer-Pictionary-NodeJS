$(document).ready(function () {

  $("#tabs li").on("click", function () {
    var tab = $(this).data("tab");

    $("#tabs li").removeClass("is-active");
    $(this).addClass("is-active");

    $("#tab-content div").removeClass("is-active");
    $('div[data-content="' + tab + '"]').addClass("is-active");
  });

  $("#joinbtn").on('click',()=>{
    var roomID = $("#roomid").val();
    var username = $("#usernamex").val();
    window.location.href = `/game?roomid=${roomID}&mode=JOIN&name=${username}`;
  });

  $("#createbtn").on('click',()=>{
    var roomID = Math.random().toString(36).substr(2, 5).toUpperCase();
    var username = $("#usernamey").val();
    window.location.href = `/game?roomid=${roomID}&mode=CREATE&name=${username}`;
  });
});
