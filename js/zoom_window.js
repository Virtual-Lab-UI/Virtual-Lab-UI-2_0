var zoomDisplaceX;
var zoomDisplaceY;

const scaleFac = 3;

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

        this.zoomCanvas.width = zoomBox.clientWidth;
        this.zoomCanvas.height = zoomBox.clientHeight;

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
        return;
    }
};

document.addEventListener("DOMContentLoaded", () => {
  processor.doLoad();
});