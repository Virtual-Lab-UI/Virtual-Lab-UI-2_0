let zoomDisplaceX;
let zoomDisplaceY;

let zoomCanvas;
let zoomBox;

let currentState = "video";

const scaleFac = 3;

let zoomCanvasInitial = document.getElementById("zoom_canvas");
let zoomCanvasContextInitial = zoomCanvasInitial.getContext("2d");

timeThreshold = 1;

const labLogo = new Image();
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

function changeToDataPanel(){
    document.getElementById("zoom_tab").setAttribute('aria-selected','false');
    document.getElementById("icon_tab").setAttribute('aria-selected','false');
    document.getElementById("data_panel_tab").setAttribute('aria-selected','true');
}
function changeToIcon(){
    document.getElementById("zoom_tab").setAttribute('aria-selected','false');
    document.getElementById("icon_tab").setAttribute('aria-selected','true');
    document.getElementById("data_panel_tab").setAttribute('aria-selected','false');
}
function changeToZoomFrame(){
    document.getElementById("zoom_tab").setAttribute('aria-selected','true');
    document.getElementById("icon_tab").setAttribute('aria-selected','false');
    document.getElementById("data_panel_tab").setAttribute('aria-selected','false');
}
function reloadSizes(){
    //console.log("start-" + sessionStorage.getItem("s"));
    if(sessionStorage.getItem("serverSideReload") !== "true"){
        //location.reload();
        sessionStorage.setItem("serverSideReload", "true");
        reload();
        //sessionStorage.setItem("serverSideReload", "false");
    }else{
        let tabWindow = document.getElementById("tab_window");
        let tabDiv = document.getElementById("tab_div");


        console.log(`TWB:${document.getElementById("tab_window_body").clientHeight} TW:${tabWindow.clientHeight} C:${document.getElementById("zoom_canvas").clientHeight} CB:${document.getElementById("zoom_box").clientHeight}`);
        tabWindow.style.height = tabDiv.clientHeight - 22;
        console.log(`TWB:${document.getElementById("tab_window_body").clientHeight} TW:${tabWindow.clientHeight} C:${document.getElementById("zoom_canvas").clientHeight} CB:${document.getElementById("zoom_box").clientHeight}`);


        zoomCanvas = document.getElementById("zoom_canvas");
        zoomBox = document.getElementById("zoom_box");

        zoomBox.style.height = zoomBox.clientHeight - 8;

        if(sessionStorage.getItem("storage_testType") != null){
            const $select = document.querySelector('#test_type');
            $select.value = sessionStorage.getItem("storage_testType");
            dynamicDropDown();
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
    if(sessionStorage.getItem("serverSideReload") === "true"){
        console.log("reload");
        location.reload();
    }
}

document.getElementById('video_canvas').onmousemove = function(e) {
    // e = Mouse click event.
    this.zoomCanvas = document.getElementById("zoom_canvas");
    this.videoCanvas = document.getElementById("video_canvas");
    //scale = this.videoCanvas.clientWidth/this.zoomCanvas.clientWidth;

    let rect = e.target.getBoundingClientRect();
    let x = e.clientX - rect.left; //x position within the element.
    let y = e.clientY - rect.top;  //y position within the element.

    zoomDisplaceX = scaleFac*x - (this.zoomCanvas.clientWidth)/2;
    zoomDisplaceY = scaleFac*y - (this.zoomCanvas.clientHeight)/2;

    //console.log("Lef: " + x + "; Top: " + y + ";" + "X: " + zoomDisplaceX + "; Y: " + zoomDisplaceY + ";");
    
    let clientXCap = this.videoCanvas.clientWidth * scaleFac - (this.zoomCanvas.clientWidth);
    let clientYCap = this.videoCanvas.clientHeight * scaleFac - (this.zoomCanvas.clientHeight);

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
            self.timerCallback();
        }, false);
    },
  
    computeFrame: function() {

        let testType = document.querySelector('#test_type');
        let materialType = document.querySelector('#material_type');

        if(!(testType.value === '' || materialType.value === '')){
            this.zoomCanvasContext.drawImage(this.video, -zoomDisplaceX,-zoomDisplaceY, (scaleFac * this.video.clientWidth), (scaleFac * this.video.clientHeight));
        }

        handleSketch(this.video);

    }
};
document.addEventListener("DOMContentLoaded", () => {
  processor.doLoad();
});