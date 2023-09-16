// const canvas = document.getElementById("zoom_canvas");
// const ctx = canvas.getContext("2d");

// ctx.fillStyle = "#FF0000";
// ctx.fillRect(0, 0, 50000, 50000);

// sessionStorage.setItem("storage_testType", "");
// sessionStorage.setItem("storage_materialType", "");
//sessionStorage.setItem("serverSideReload", "false");

function dynamicdropdown()
{
    var testSelect = document.getElementById("test_type");
    listindex = testSelect.options[testSelect.selectedIndex].value

    switch (listindex)
    {
        case "" :
            document.getElementById("material_type").innerHTML = null;
            document.getElementById("material_type").options[0]=new Option("Select Material","");
            break;
        case "tensile" :
            document.getElementById("material_type").innerHTML = null;
            document.getElementById("material_type").options[0]=new Option("Aluminum 6061","aluminum_6061");
            document.getElementById("material_type").options[1]=new Option("Brass 360","brass_360");
            document.getElementById("material_type").options[2]=new Option("Low Carbon Steel","low_carbon_steel");
            document.getElementById("material_type").options[3]=new Option("PLA","pla");
            document.getElementById("material_type").options[4]=new Option("Stainless Steel 316L","stainless_316l");
            document.getElementById("material_type").options[5]=new Option("Steel 1084","steel_1084");
            document.getElementById("material_type").options[6]=new Option("Garolite","garolite");
            document.getElementById("material_type").options[7]=new Option("Acrylic","acrylic");
            document.getElementById("material_type").options[8]=new Option("ABS","abs");
            document.getElementById("material_type").options[9]=new Option("Polycarbonate","polycarbonate");
            document.getElementById("material_type").options[10]=new Option("Birch Plywood","birch_plywood");
            break;
        case "fatigue" :
            document.getElementById("material_type").innerHTML = null;
            document.getElementById("material_type").options[0]=new Option("Stainless Steel 316L","stainless_316l");
            break;
        case "rockwell_hardness" :
            document.getElementById("material_type").innerHTML = null;
            document.getElementById("material_type").options[0]=new Option("Aluminum 6061","aluminum_6061");
            document.getElementById("material_type").options[1]=new Option("Brass 360","brass_360");
            document.getElementById("material_type").options[2]=new Option("Carbon Fiber","carbon_fiber");
            document.getElementById("material_type").options[3]=new Option("Copper","copper");
            document.getElementById("material_type").options[4]=new Option("Steel 1018","steel_1018");
            document.getElementById("material_type").options[5]=new Option("Steel 1084","steel_1084");
            document.getElementById("material_type").options[6]=new Option("Steel 4140","steel_4140");
            break;
        case "vickers_hardness" :
            document.getElementById("material_type").innerHTML = null;
            document.getElementById("material_type").options[0]=new Option("Steel 1018","steel_1018");
            break;
        case "knoop_hardness" :
            document.getElementById("material_type").innerHTML = null;
            document.getElementById("material_type").options[0]=new Option("N/A","");
            break;
        case "charpy" :
            document.getElementById("material_type").innerHTML = null;
            document.getElementById("material_type").options[0]=new Option("Aluminum 6061","aluminum_6061");
            document.getElementById("material_type").options[1]=new Option("Brass 360","brass_360");
            document.getElementById("material_type").options[2]=new Option("Titanium","titanium");
            document.getElementById("material_type").options[3]=new Option("Stainless 316L","stainless_316l");
            document.getElementById("material_type").options[4]=new Option("Steel 1045","steel_1045");
            document.getElementById("material_type").options[5]=new Option("Steel 4140","steel_4140");
            
            break;
        }

    changeVideo();
    return true;
}

function playVideo(){
    var video = document.getElementById('video_canvas');
    video.play(); 
}

function changeVideo(){

    var video = document.getElementById('video_canvas');
    var sources = document.getElementById('video_source');

    video.setAttribute('controls', "true");

    var zoomBox = document.getElementById("zoom_box");
    var zoomCanvas = document.getElementById("zoom_canvas");
    var zoomCanvasContext = zoomCanvas.getContext("2d");

    var testType = document.querySelector('#test_type');
    var materialType = document.querySelector('#material_type');

    var videoPath;
    var rawDataPath;

    sessionStorage.setItem("storage_testType", testType.value);
    sessionStorage.setItem("storage_materialType", materialType.value);

    if(testType.value == '' | materialType.value == ''){
        videoPath = 'standby.mp4';
        
        zoomCanvasContext.fillStyle = "#C0C0C0";
        zoomCanvasContextInitial.fillRect(0,0,zoomBox.clientWidth*1.1,zoomBox.clientHeight*1.1);
        zoomCanvasContext.drawImage(labLogo,0,0,zoomBox.clientWidth,zoomBox.clientWidth);
        
        //console.log(`W:${zoomCanvas.clientWidth} H:${zoomCanvas.clientHeight}`);
        //console.log(`W:${zoomBox.clientWidth} H:${zoomBox.clientHeight}`);

        document.getElementById("zoom_tab").setAttribute('aria-selected','false');
        document.getElementById("icon_tab").setAttribute('aria-selected','true');
    }else{
        videoPath = `videos/${testType.value}/${testType.value}_${materialType.value}.mp4`;

        zoomCanvasContext.fillStyle = "#C0C0C0";
        zoomCanvasContextInitial.fillRect(0,0,zoomBox.clientWidth*1.1,zoomBox.clientHeight*1.1);

        document.getElementById("zoom_tab").setAttribute('aria-selected','true');
        document.getElementById("icon_tab").setAttribute('aria-selected','false');
    }
    console.log(`Searching for video: ${videoPath}`);

    var rawDataButton = document.getElementById("raw_data");
    if(testType.value == 'tensile'){
        rawDataButton.disabled = false;
        rawDataPath = `raw_data/${testType.value}/${testType.value}_${materialType.value}.xlsx`;
    }else{
        rawDataButton.disabled = true;
    }

    video.pause();
    sources.setAttribute('src', videoPath);
    sources.setAttribute('poster', "");
    document.getElementById('download_url').setAttribute('href', rawDataPath);
    video.load();
    //video.play();
}
