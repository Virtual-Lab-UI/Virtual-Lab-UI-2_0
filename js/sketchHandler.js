let currentSketch;

let interactiveWidth = document.getElementById("video_canvas").clientWidth;
let interactiveHeight = document.getElementById("video_canvas").clientHeight;


let timestamps = {
    "vickers_hardness": 222.5,
    "knoop_hardness": 87
}

function changeCanvasToVideo(){
    document.getElementById("video_canvas").style.display = 'block';
    document.getElementById("video_box_sim").style.display = 'none';
}

function changeVideoToCanvas(){
    document.getElementById("video_canvas").style.display = 'none';
    document.getElementById("video_box_sim").style.display = 'block';
}

function handleSketch(video){
    let testType = document.querySelector('#test_type');
    let timestamp = timestamps[testType.value];

    if (timestamp !== undefined) {
        if ((video.currentTime > timestamp) && (video.currentTime < timestamp + timeThreshold) && currentState === "video") {
            const script = document.createElement('script');

            script.src = "js/" + testType.value + "_sketch.js";
            script.onload = () => {
                currentSketch = new p5(sketch);
                changeVideoToCanvas();
            };

            document.getElementById('video_box_sim').innerHTML = '';
            document.getElementById('video_box_sim').appendChild(script);

            video.pause();
            currentState = "interactive";
        }

        if(currentSketch) {
            if (currentState === "interactive" && currentSketch.done && currentSketch.videoForward) {
                changeCanvasToVideo();

                if (currentSketch) {
                    currentSketch.remove()
                    currentSketch = null;
                }

                video.currentTime = timestamp + timeThreshold;
                video.play();
                currentState = "video";
            }

            if (currentState === "interactive" && currentSketch.videoBack) {
                changeCanvasToVideo();

                if (currentSketch) {
                    currentSketch.remove()
                    currentSketch = null;
                }

                video.currentTime = timestamp - 10;
                video.play();
                currentState = "video";
            }
        }
    }
}