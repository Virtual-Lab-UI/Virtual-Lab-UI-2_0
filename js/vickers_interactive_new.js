vickersTimestamps = {};
vickersTimestamps["test_steel"] = 222.5;

currentState = "video";

function changeCanvasToVideo(){
    document.getElementById("video_canvas").style.display = 'block';
    document.getElementById("video_box_sim").style.display = 'none';
    console.log("hiding canvas");
}
function changeVideoToCanvas(){
    document.getElementById("video_canvas").style.display = 'none';
    document.getElementById("video_box_sim").style.display = 'block';
    console.log(`hiding video w${interactiveWidth} h${interactiveHeight}`)
}

changeCanvasToVideo();

//GIO CODE
let fps = 60;
let variation;

let knobs = [];
let focus;
let focusKnob;
let measuringKnob;
let baseKnob;
let lensKnob;

let inputButton;
let vertical = true;
let done = false;

let filarBounds = [[-315, -285, -40, -8,], [-210, -175, 71, 105]];

let bgHeight;
let bgWidth;

let interactiveWidth = document.getElementById("video_canvas").clientWidth;
let interactiveHeight = document.getElementById("video_canvas").clientHeight;

let videoBack = false;
let videoForward = false;
let prevMouse = false;

let matchHeight;

let lensRadius = 135;
let focusRadius = 70;
let measuringRadius = 50;
let baseRadius = 35;
let bg;
let sample

let k = 0;
let data = {};
data["time"] = new Date()
data["time"].setHours(data["time"].getHours() - 8);
data["time"].setSeconds(data["time"].getSeconds());

function preload(){
    bg = loadImage('images/background_.JPG');
    sample = loadImage('images/sample_r.png');
}
function windowResized(){
    resizeCanvas(interactiveWidth, interactiveHeight);

    if(interactiveHeight / interactiveWidth > 2 / 3){
        matchHeight = true;
        bgHeight = interactiveHeight;
        bgWidth = bgHeight * (3 / 2);
    }else{
        matchHeight = false;
        bgWidth = interactiveWidth;
        bgHeight = bgWidth * (2 / 3);
    }

    focusKnob.x = interactiveWidth * 9 / 10;
    focusKnob.y = matchHeight ? 0.71 * bgHeight : 0.71 * bgHeight - (bgHeight - interactiveHeight) / 2;
    focusKnob.r = focusRadius;

    baseKnob.x = interactiveWidth * 1.5 / 10;
    baseKnob.y = matchHeight ? 0.185 * bgHeight : 0.185 * bgHeight - (bgHeight - interactiveHeight) / 2;
    baseKnob.r = baseRadius;

    measuringKnob.x = interactiveWidth * 9 / 10;
    measuringKnob.y = matchHeight ? 0.184 * bgHeight : 0.184 * bgHeight - (bgHeight - interactiveHeight) / 2;
    measuringKnob.r = measuringRadius;

    lensKnob.x = interactiveWidth / 2.25;
    lensKnob.y = matchHeight ? 0.65 * bgHeight : 0.65 * bgHeight - (bgHeight - interactiveHeight) / 2;
    lensKnob.r = lensRadius;

    inputButton.x = interactiveWidth * 7 / 10;
    inputButton.y = matchHeight ? 0.184 * bgHeight : 0.184 * bgHeight - (bgHeight - interactiveHeight) / 2;

}
function setup(){
    let vickersInteractive = createCanvas(interactiveWidth, interactiveHeight);
    vickersInteractive.parent('video_box_sim');
    frameRate(fps);
    textAlign(CENTER);
    textSize(16);

    angleMode(DEGREES);
    fill(192);

    if(interactiveHeight / interactiveWidth > (2 / 3)){
        matchHeight = true;
        bgHeight = interactiveHeight;
        bgWidth = bgHeight * (3 / 2);
    }else{
        matchHeight = false;
        bgWidth = interactiveWidth;
        bgHeight = bgWidth * (2 / 3);
    }

    focusKnob = new Knob(interactiveWidth * 9 / 10, matchHeight ? 0.71 * bgHeight : 0.71 * bgHeight - (bgHeight - interactiveHeight) / 2, focusRadius,
        -360, 360, 0, 0, focusKnobShape);
    baseKnob = new Knob(interactiveWidth * 1.5 / 10, matchHeight ? 0.185 * bgHeight : 0.185 * bgHeight - (bgHeight - interactiveHeight) / 2, baseRadius,
        -2 * 360, 2 * 360, random(-1.8 * 360, 0), 12, baseKnobShape)
    measuringKnob = new Knob(interactiveWidth * 9 / 10, matchHeight ? 0.184 * bgHeight : 0.184 * bgHeight - (bgHeight - interactiveHeight) / 2, measuringRadius,
        baseKnob.theta0, 4 * 360 + baseKnob.theta0, random(baseKnob.theta0, 1.7 * 360), 12, measuringKnobShape);
    lensKnob = new Knob(interactiveWidth / 2.25, matchHeight ? 0.65 * bgHeight : 0.65 * bgHeight - (bgHeight - interactiveHeight) / 2, lensRadius,
    -180, -90, -180, 0, lensKnobShape, 7, 0);

    knobs.push(focusKnob);
    knobs.push(measuringKnob);
    knobs.push(baseKnob);
    knobs.push(lensKnob);

    focus = random(focusKnob.lowerTheta, focusKnob.upperTheta);
    inputButton = new Button(interactiveWidth * 7 / 10, matchHeight ? 0.184 * bgHeight : 0.184 * bgHeight - (bgHeight - interactiveHeight) / 2, 25, 25, checkVerticalFilars);
    variation = random(-1.5, 1.5);
}
function draw(){
    background(0);
    image(bg, (interactiveWidth - bgWidth) / 2, (interactiveHeight - bgHeight) / 2, bgWidth, bgHeight);

    blur();

    inputButton.display();

    for(let i = 0; i < knobs.length; i++)
        knobs[i].display();

    drawFilars();
    staticSetup();
    logs();
    prevMouse = mouseIsPressed;

    displayArrows();

}

function displayArrows(){
    displayArrow(baseKnob, createVector(matchHeight ? 0.4 * bgWidth - (bgWidth - interactiveWidth) / 2 : 0.4 * bgWidth, baseKnob.y), color(0));
    displayArrow(focusKnob, createVector(matchHeight ? 0.61 * bgWidth - (bgWidth - interactiveWidth) / 2 : 0.61 * bgWidth, focusKnob.y), color(200));
    displayArrow(inputButton, createVector(matchHeight ? 0.61 * bgWidth - (bgWidth - interactiveWidth) / 2 : 0.61 * bgWidth, inputButton.y), color(0));
}
function displayArrow(element, end, color){

    push();
    strokeWeight(2);
    stroke(color);

    let dR = end.copy();
    dR.x -= element.x;
    dR.y -= element.y;

    line(element.x + (dR.x > 0 ? element.r + 15 : -element.r - 15), element.y, end.x + (dR.x > 0 ? -8 : 8), end.y);
    translate(end.x + (dR.x > 0 ? -8 : 8), end.y);

    rotate(dR.heading());

    beginShape();
    noFill();

    vertex(-6, -5);
    vertex(0, 0);
    vertex(-6, 5);

    endShape();
    pop();
}
function staticSetup(){
    push();
    textSize(16);
    fill(255);
    text('Focus', focusKnob.x, focusKnob.y + focusKnob.r + 25);
    text('Base', baseKnob.x, baseKnob.y + baseKnob.r + 25);
    text('Measuring', measuringKnob.x, measuringKnob.y + measuringKnob.r  + 25);

    text('Record Input', inputButton.x, inputButton.y + inputButton.w / 2 + 25);

    if(!vertical)
        text('Vertical input recorded', interactiveWidth * 9 / 10, interactiveHeight * 6 / 10);

    textSize(30);
    if(done){
        text(str((206.9 + variation).toFixed(1)) + '  HV0.5', interactiveWidth * 9 / 10, interactiveHeight * 4 / 10);
        textSize(16);
        textAlign(LEFT);
        text("Right Arrow Key to continue\nLeft Arrow Key to rewatch this section", interactiveWidth * 0.5 / 10, interactiveHeight * 3.5 / 10);
    }
    pop();

}
function blur(){
    push();
    drawingContext.filter = 'blur(' + str(abs(focusKnob.theta - focus)) / 50 + 'px)';
    translate(lensKnob.x, lensKnob.y);
    image(sample, -lensRadius, -lensRadius, 2 * lensRadius, 2 * lensRadius);
    pop();
}
function drawFilars(){

    push();
    translate(lensKnob.x, lensKnob.y);

    if(!vertical)
        rotate(-lensKnob.theta + 180);

    strokeWeight(0.9);
    line(baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta), -sqrt(lensRadius * lensRadius  -(baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta)) ** 2),
        baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta), sqrt(lensRadius * lensRadius  -(baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta)) ** 2));

    line((measuringKnob.theta + baseKnob.theta - baseKnob.theta0) * 2 * lensRadius / (measuringKnob.upperTheta - measuringKnob.lowerTheta), -sqrt(lensRadius * lensRadius  -((measuringKnob.theta + baseKnob.theta - baseKnob.theta0) * 2 * lensRadius / (measuringKnob.upperTheta - measuringKnob.lowerTheta)) ** 2),
        (measuringKnob.theta + baseKnob.theta - baseKnob.theta0) * 2 * lensRadius / (measuringKnob.upperTheta - measuringKnob.lowerTheta), sqrt(lensRadius * lensRadius  -((measuringKnob.theta + baseKnob.theta - baseKnob.theta0) * 2 * lensRadius / (measuringKnob.upperTheta - measuringKnob.lowerTheta)) ** 2));

    strokeWeight(1.4);
    line(baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta), -lensRadius / 3.5,
        baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta) - min(lensRadius / 5, baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta) + lensRadius - 5), -lensRadius / 3.5);

    line(baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta), 0,
        baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta) - min(lensRadius / 2.5, baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta) + lensRadius - 5), 0);

    line(baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta), lensRadius / 3.5,
            baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta) -min(lensRadius / 5, baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta) + lensRadius - 5), lensRadius / 3.5);

    pop();

}
function checkVerticalFilars(){
    if(baseKnob.theta > filarBounds[0][0] && baseKnob.theta < filarBounds[0][1] && measuringKnob.theta + baseKnob.theta - baseKnob.theta0 > filarBounds[0][2] && measuringKnob.theta + baseKnob.theta - baseKnob.theta0 < filarBounds[0][3]) {
        inputButton.setCallback(checkHorizontalFilars);
        vertical = false;
        lensKnob.theta = -180;
    }
    else {
        textSize(16);
        text("Please align filars", interactiveWidth * 9 / 10, interactiveHeight * 6 / 10);
    }

}
function checkHorizontalFilars(){
    if(baseKnob.theta > filarBounds[1][0] && baseKnob.theta < filarBounds[1][1] && measuringKnob.theta + baseKnob.theta - baseKnob.theta0 > filarBounds[1][2] && measuringKnob.theta + baseKnob.theta - baseKnob.theta0 < filarBounds[1][3] && lensKnob.theta > -95) {
        inputButton.setCallback(noCallback);
        done = true;
    }else {
        textSize(16);
        text("Please align filars", interactiveWidth * 9 / 10, interactiveHeight * 6 / 10);
    }

}
function noCallback(){}
function linearGradient(x0, y0, x1, y1, color0, colorE){
    let gradient = drawingContext.createLinearGradient(
        x0, y0, x1, y1,
    );
    gradient.addColorStop(0, color0);
    gradient.addColorStop(1, colorE);

    drawingContext.strokeStyle = gradient;
}
function logs(){
    if(keyIsDown(68)){
        textSize(16);
        text(baseKnob.theta.toFixed(2), 100, 100);
        text((measuringKnob.theta + baseKnob.theta - baseKnob.theta0).toFixed(2), 100, 100);
    }
}
function keyPressed(){
    if(keyCode === LEFT_ARROW){
        videoBack = true;
    }else if(keyCode === RIGHT_ARROW){
        videoForward = true;
    }else if(keyCode === 68){
        downloadObjectAsJson(data, "vickers_data");
    }
}
class Knob{
    constructor(x, y, r, lowerTheta, upperTheta, theta0, sides, callbackShape = noCallback, strokeWeight = -1, stroke = -1, fill = -1){
        this.x = x;
        this.y = y;
        this.r = r;

        this.lowerTheta = lowerTheta;
        this.upperTheta = upperTheta;
        this.theta = theta0;
        this.theta0 = theta0;

        this.sides = sides;

        this.previousPosition = createVector(0, -this.r);
        this.currentPosition = createVector(0, -this.r);

        this.strokeWeight = strokeWeight;
        this.stroke = stroke;
        this.fill = fill;

        this.stillPressed = false;
        this.callbackShape = callbackShape;
    }

    display(dtheta = 0){
        if(dtheta === 0) {
            if (!prevMouse  && mouseIsPressed && dist(mouseX, mouseY, this.x, this.y) < this.r)
                this.stillPressed = true;

            else if (!mouseIsPressed)
                this.stillPressed = false;

            if (this.stillPressed) {
                this.previousPosition = this.currentPosition;
                this.currentPosition = createVector(this.x - mouseX, mouseY - this.y);
                dtheta = this.currentPosition.angleBetween(this.previousPosition);

            } else {
                this.currentPosition = createVector(this.x - mouseX, mouseY - this.y);
                this.previousPosition = this.currentPosition;
            }
        }

        push();
        translate(this.x, this.y);
        this.theta -= dtheta;
        this.theta = constrain(this.theta, this.lowerTheta, this.upperTheta);
        rotate(-this.theta);

        //this.stroke >= 0 ? stroke(this.stroke) : linearGradient(-this.r * cos(45 + this.theta), -this.r * sin(45 + this.theta), this.r * cos(45 + this.theta), this.r * sin(45 + this.theta), color(230), color(60));
        this.fill >= 0 ? fill(this.fill) : noFill();
        this.strokeWeight > 0 ? strokeWeight(this.strokeWeight) : noStroke();
        this.polygon();

        if(this.fill >= 0) {
            stroke(0);
            strokeWeight(3);
            fill(0);
            line(0, -this.r / 1.8, 0, (-1.5 / 2) * this.r);
        }
        pop();

        this.callbackShape();

    }
    polygon() {
        if(this.sides !== 0) {
            let angle = 360 / this.sides;
            beginShape();
            for (let a = 0; a < 360; a += angle) {
                let sx = cos(a) * this.r;
                let sy = sin(a) * this.r;
                vertex(sx, sy);
            }
            endShape(CLOSE);
        }else{
            circle(0, 0, this.r * 2);
        }
    }
}
class Button {
    constructor(x, y, w, h, callback) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h
        this.r = w / 2;
        this.callback = callback;
    }

    display() {
        if (mouseIsPressed && mouseX > this.x - this.w / 2 && mouseX < this.x + this.w / 2 && mouseY > this.y - this.h / 2 && mouseY < this.y + this.h / 2) {
            push();
            noStroke();
            //stroke(192);
            rect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
            fill(128);
            rect(this.x - this.w / 2 - 2, this.y - this.h / 2, 2.2, this.h);
            rect(this.x - this.w / 2 - 2, this.y - this.h / 2, this.w + 2, 2);

            fill(223);
            rect(this.x + this.w / 2, this.y - this.h / 2, 2, this.h + 2);
            rect(this.x - this.w / 2 - 2, this.y + this.h / 2, this.w + 3, 2);

            fill(60);
            rect(this.x - this.w / 2 - 4, this.y - this.h / 2, 2.2, this.h + 2);
            rect(this.x - this.w / 2 - 4, this.y - this.h / 2 - 2, this.w + 6, 2.2);

            fill(255);
            rect(this.x + this.w / 2 + 2, this.y - this.h / 2 - 2, 2, this.h + 6);
            rect(this.x - this.w / 2 - 4, this.y + this.h / 2 + 2, this.w + 7, 2);
            this.callback();
            pop();

        } else {
            push();
            noStroke();
            //stroke(192);
            rect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
            fill(223);
            rect(this.x - this.w / 2 - 2, this.y - this.h / 2, 2.2, this.h);
            rect(this.x - this.w / 2 - 2, this.y - this.h / 2, this.w + 2, 2);

            fill(128);
            rect(this.x + this.w / 2, this.y - this.h / 2, 2, this.h + 2);
            rect(this.x - this.w / 2 - 2, this.y + this.h / 2, this.w + 3, 2);

            fill(255);
            rect(this.x - this.w / 2 - 4, this.y - this.h / 2, 2.2, this.h + 2);
            rect(this.x - this.w / 2 - 4, this.y - this.h / 2 - 2, this.w + 6, 2.2);

            fill(60);
            rect(this.x + this.w / 2 + 2, this.y - this.h / 2 - 2, 2, this.h + 6);
            rect(this.x - this.w / 2 - 4, this.y + this.h / 2 + 2, this.w + 7, 2);
            //console.log(str(this.x) + ' ' + str(this.w) + ' ' + str(this.y) + ' ' + str(this.h));
            pop();
        }
    }
    setCallback(callback) {
        this.callback = callback;
    }
}
function lensKnobShape(){
    push();
    stroke(100);
    strokeWeight(2);
    translate(lensKnob.x, lensKnob.y);
    rotate(-lensKnob.theta + 180);

    let l = 72;

    for(let i = 0; i < l; i++)
        line((lensKnob.r - 4) * cos(360 * i / l), (lensKnob.r - 4) * sin(360 * i / l), (lensKnob.r + 4) * cos(360 * i / l), (lensKnob.r + 4) * sin(360 * i / l));

    noFill();
    circle(0, 0, lensKnob.r * 2 + 9);
    circle(0, 0, lensKnob.r * 2 - 9);
    pop();
}
function focusKnobShape(){
    push();
    translate(focusKnob.x, focusKnob.y);
    rotate(-focusKnob.theta);

    stroke(120);
    strokeWeight(2);
    fill(20);
    circle(0, 0, focusKnob.r * 2);
    circle(0, 0, focusKnob.r * 2 * 0.85);
    circle(0, -focusKnob.r * 0.5, focusKnob.r * 0.3);

    pop();
}
function measuringKnobShape(){
    push();
    translate(measuringKnob.x, measuringKnob.y);
    rotate(-measuringKnob.theta);

    noStroke();
    fill(20);
    let numTeeth = 70;
    let teethHeight = 2;


    for (let i = 0; i < numTeeth; i++) {
        let x1 = measuringKnob.r * cos(i * 360/numTeeth);
        let y1 = measuringKnob.r * sin(i * 360/numTeeth);
        let x2 = measuringKnob.r * cos((i + 1) * 360/numTeeth);
        let y2 = measuringKnob.r * sin((i + 1) * 360/numTeeth);
        let x3 = (measuringKnob.r + teethHeight) * cos((i + 0.5) * 360/numTeeth);
        let y3 = (measuringKnob.r + teethHeight) * sin((i + 0.5) * 360/numTeeth);

        triangle(x1, y1, x2, y2, x3, y3);
    }

    fill(20);
    stroke(100);
    circle(0, 0, measuringKnob.r * 2);
    circle(0, 0, measuringKnob.r * 2 * 0.85);

    pop();
}
function baseKnobShape(){
    push();
    translate(baseKnob.x, baseKnob.y);
    rotate(-baseKnob.theta);

    noStroke();
    fill(20);
    let numTeeth = 50;
    let teethHeight = 2;


    for (let i = 0; i < numTeeth; i++) {
        let x1 = baseKnob.r * cos(i * 360/numTeeth);
        let y1 = baseKnob.r * sin(i * 360/numTeeth);
        let x2 = baseKnob.r * cos((i + 1) * 360/numTeeth);
        let y2 = baseKnob.r * sin((i + 1) * 360/numTeeth);
        let x3 = (baseKnob.r + teethHeight) * cos((i + 0.5) * 360/numTeeth);
        let y3 = (baseKnob.r + teethHeight) * sin((i + 0.5) * 360/numTeeth);

        triangle(x1, y1, x2, y2, x3, y3);
    }

    fill(20);
    stroke(100);
    circle(0, 0, baseKnob.r * 2);
    circle(0, 0, baseKnob.r * 2 * 0.85);

    pop();
}
function downloadObjectAsJson(exportObj, exportName){
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    let downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
function mouseWheel(event) {
    for(let i = 0; i < knobs.length; i++)
        if((dist(mouseX, mouseY, knobs[i].x, knobs[i].y) < knobs[i].r)) {
            knobs[i].display(event.delta / 2);
            data[k] = [performance.now(), "mouseWheel", event.delta];
            k++;
        }
}
function mousePressed(){
    data[k] = [performance.now(), "mousePressed"];
    k++;
}
function mouseMoved(){
    data[k] = [performance.now(), "mouseMoved"];
    k++;
}
function resetVickers(){
    vertical = true;
    done = false;

    videoBack = false;
    videoForward = false;
    prevMouse = false;

    inputButton.setCallback(checkVerticalFilars);

    focusKnob.theta = 0;
    baseKnob.theta = random(-1.8 * 360, 0);
    measuringKnob.theta = random(baseKnob.theta0, 1.7 * 360);
    lensKnob.theta = -180;

    focus = random(focusKnob.lowerTheta, focusKnob.upperTheta);
    variation = random(-1.5, 1.5);

}