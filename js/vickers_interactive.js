vickersTimestamps = {};

vickersTimestamps["steel_1018"] = 58.3;

function changeCanvasToVideo(){
    document.getElementById("video_div").innerHTML = '<video id="video_canvas" class="video-frame" controls="false" poster="standby.png"> \
    <source src="standby.mp4" type="video/mp4" id="video_source"> \
  </video>'
}
function changeVideoToCanvas(){
    document.getElementById("video_div").innerHTML = '<div id="video_box_sim"  class="video-frame-sim"> \
    <canvas id="video_canvas_sim" class="video-frame-sim"></canvas> \
  </div>'
}

