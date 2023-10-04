var zoomDisplaceX;
var zoomDisplaceY;

const scaleFac = 3;

var zoomCanvasInitial = document.getElementById("zoom_canvas");
var zoomCanvasContextInitial = zoomCanvasInitial.getContext("2d");

const labLogo = new Image(); // Create new img element
labLogo.addEventListener(
    "load",
    () => {
        // execute drawImage statements here
        zoomCanvasContextInitial.fillStyle = "#C0C0C0";
        zoomCanvasContextInitial.fillRect(0,0,zoomCanvasInitial.clientWidth*1.1,zoomCanvasInitial.clientHeight*1.1);
        zoomCanvasContextInitial.drawImage(labLogo,0,0,zoomCanvasInitial.clientWidth,zoomCanvasInitial.clientWidth);
    },
    false,
);

window.onresize = reloadSizes;

function reloadSizes(){
    //console.log("start-" + sessionStorage.getItem("s"));
    if(sessionStorage.getItem("serverSideReload") != "true"){
        //location.reload();
        sessionStorage.setItem("serverSideReload", "true");
        reload();
        //sessionStorage.setItem("serverSideReload", "false");
    }else{
        tabWindow = document.getElementById("tab_window");
        tabDiv = document.getElementById("tab_div");


        console.log(`TWB:${document.getElementById("tab_window_body").clientHeight} TW:${tabWindow.clientHeight} C:${document.getElementById("zoom_canvas").clientHeight} CB:${document.getElementById("zoom_box").clientHeight}`);
        tabWindow.style.height = tabDiv.clientHeight - 22;
        console.log(`TWB:${document.getElementById("tab_window_body").clientHeight} TW:${tabWindow.clientHeight} C:${document.getElementById("zoom_canvas").clientHeight} CB:${document.getElementById("zoom_box").clientHeight}`);
        

        zoomCanvas = document.getElementById("zoom_canvas");
        zoomBox = document.getElementById("zoom_box");

        zoomBox.style.height = zoomBox.clientHeight - 8;

        if(sessionStorage.getItem("storage_testType") != null){
            const $select = document.querySelector('#test_type');
            $select.value = sessionStorage.getItem("storage_testType");
            dynamicdropdown();
        }
        if(sessionStorage.getItem("storage_materialType") != null){
            const $select = document.querySelector('#material_type');
            $select.value = sessionStorage.getItem("storage_materialType");
            
        }
        changeVideo();
        

        zoomCanvas.width = zoomBox.clientWidth;
        zoomCanvas.height = zoomBox.clientHeight;

        labLogo.src = "VirtualLabLogoUpscaled.png"; // Set source path

        sessionStorage.setItem("serverSideReload", "false");
    }
    //sessionStorage.setItem("serverSideReload", "false");
    //console.log("nd-" + sessionStorage.getItem("serverSideReload"));
}

function reload(){
    if(sessionStorage.getItem("serverSideReload") == "true"){
        console.log("relaod");
        location.reload();
    }
}

document.getElementById('video_canvas').onmousemove = function(e) {
    // e = Mouse click event.
    this.zoomCanvas = document.getElementById("zoom_canvas");
    this.videoCanvas = document.getElementById("video_canvas");
    scale = this.videoCanvas.clientWidth/this.zoomCanvas.clientWidth;

    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left; //x position within the element.
    var y = e.clientY - rect.top;  //y position within the element.

    zoomDisplaceX = scaleFac*x - (this.zoomCanvas.clientWidth)/2;
    zoomDisplaceY = scaleFac*y - (this.zoomCanvas.clientHeight)/2;

    //console.log("Lef: " + x + "; Top: " + y + ";" + "X: " + zoomDisplaceX + "; Y: " + zoomDisplaceY + ";");
    
    var clientXCap = this.videoCanvas.clientWidth * scaleFac - (this.zoomCanvas.clientWidth);
    var clientYCap = this.videoCanvas.clientHeight * scaleFac - (this.zoomCanvas.clientHeight);

    if(zoomDisplaceX < 0){
        zoomDisplaceX = 0;
    }else if(zoomDisplaceX > clientXCap){
        zoomDisplaceX = clientXCap;
    }

    if(zoomDisplaceY < 0){
        zoomDisplaceY = 0;
    }else if(zoomDisplaceY > clientYCap){
        zoomDisplaceY = clientYCap;
    }
}

let processor = {
    timerCallback: function() {
        this.computeFrame();
        let self = this;
        setTimeout(function () {
            self.timerCallback();
        }, 0);
    },
  
    doLoad: function() {
        this.video = document.getElementById("video_canvas");
        zoomBox = document.getElementById("zoom_box");
        this.zoomCanvas = document.getElementById("zoom_canvas");

        reloadSizes();

        this.zoomCanvasContext = this.zoomCanvas.getContext("2d");
        let self = this;
        this.video.addEventListener("play", function() {
            // self.width = self.video.videoWidth / 2;
            // self.height = self.video.videoHeight / 2;
            self.timerCallback();
        }, false);
    },
  
    computeFrame: function() {

        var testType = document.querySelector('#test_type');
        var materialType = document.querySelector('#material_type');

        //alert(this.video.clientWidth);
        if(testType.value == '' | materialType.value == ''){

        }else{
            this.zoomCanvasContext.drawImage(this.video, -zoomDisplaceX,-zoomDisplaceY, (scaleFac * this.video.clientWidth), (scaleFac * this.video.clientHeight));
        }
        //   let frame = this.zoomCanvasContext.getImageData(0, 0, this.width, this.height);
        //       let l = frame.data.length / 4;
    
        //   for (let i = 0; i < l; i++) {
        //     let r = frame.data[i * 4 + 0];
        //     let g = frame.data[i * 4 + 1];
        //     let b = frame.data[i * 4 + 2];
        //     if (g > 100 && r > 100 && b < 43)
        //       frame.data[i * 4 + 3] = 0;
        //   }
        //   this.zoomCanvasContext.putImageData(frame, 0, 0);

        if(testType.value = "vickers_hardness" & (this.video.currentTime > vickersTimestamps[materialType.value])){
            changeVideoToCanvas();
        }

        return;
    }
};

document.addEventListener("DOMContentLoaded", () => {
  processor.doLoad();
});