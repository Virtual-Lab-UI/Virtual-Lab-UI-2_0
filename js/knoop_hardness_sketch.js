function sketch(p) {

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
    p.done = false;

    let filarBounds = [-520, -350, 436, 600];

    let bgHeight;
    let bgWidth;

    p.videoBack = false;
    p.videoForward = false;
    let prevMouse = false;

    let matchHeight;

    let lensRadius = 135;
    let focusRadius = 70;
    let measuringRadius = 50;
    let baseRadius = 35;
    let bg;
    let sample

    p.preload = function() {
        bg = p.loadImage('images/background_.jpg');
        sample = p.loadImage('images/sample_r_knoop.png');
    }

    p.windowResized = function() {
        resizeCanvas(interactiveWidth, interactiveHeight);

        if (interactiveHeight / interactiveWidth > 2 / 3) {
            matchHeight = true;
            bgHeight = interactiveHeight;
            bgWidth = bgHeight * (3 / 2);
        } else {
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

    p.setup = function() {
        let vickersInteractive = p.createCanvas(interactiveWidth, interactiveHeight);
        vickersInteractive.parent('video_box_sim');
        p.frameRate(fps);
        p.textAlign(p.CENTER);
        p.textSize(16);

        p.angleMode(p.DEGREES);
        p.fill(192);

        if (interactiveHeight / interactiveWidth > (2 / 3)) {
            matchHeight = true;
            bgHeight = interactiveHeight;
            bgWidth = bgHeight * (3 / 2);
        } else {
            matchHeight = false;
            bgWidth = interactiveWidth;
            bgHeight = bgWidth * (2 / 3);
        }

        focusKnob = new Knob(interactiveWidth * 9 / 10, matchHeight ? 0.71 * bgHeight : 0.71 * bgHeight - (bgHeight - interactiveHeight) / 2, focusRadius,
            -360, 360, 0, 0, p.focusKnobShape);
        baseKnob = new Knob(interactiveWidth * 1.5 / 10, matchHeight ? 0.185 * bgHeight : 0.185 * bgHeight - (bgHeight - interactiveHeight) / 2, baseRadius,
            -2 * 360, 2 * 360, p.random(-1.8 * 360, 0), 12, p.baseKnobShape)
        measuringKnob = new Knob(interactiveWidth * 9 / 10, matchHeight ? 0.184 * bgHeight : 0.184 * bgHeight - (bgHeight - interactiveHeight) / 2, measuringRadius,
            baseKnob.theta0, 4 * 360 + baseKnob.theta0, p.random(baseKnob.theta0, 1.7 * 360), 12, p.measuringKnobShape);
        lensKnob = new Knob(interactiveWidth / 2.25, matchHeight ? 0.65 * bgHeight : 0.65 * bgHeight - (bgHeight - interactiveHeight) / 2, lensRadius,
            -180, -90, -180, 0, p.lensKnobShape, 7, 0);

        knobs.push(focusKnob);
        knobs.push(measuringKnob);
        knobs.push(baseKnob);
        knobs.push(lensKnob);

        focus = p.random(focusKnob.lowerTheta, focusKnob.upperTheta);
        inputButton = new Button(interactiveWidth * 7 / 10, matchHeight ? 0.184 * bgHeight : 0.184 * bgHeight - (bgHeight - interactiveHeight) / 2, 25, 25, p.checkVerticalFilars);
        variation = p.random(-1.5, 1.5);
    }

    p.draw = function() {
        p.background(0);
        p.image(bg, (interactiveWidth - bgWidth) / 2, (interactiveHeight - bgHeight) / 2, bgWidth, bgHeight);

        p.blur();

        inputButton.display();

        for (let i = 0; i < knobs.length; i++)
            knobs[i].display();

        p.drawFilars();
        p.staticSetup();
        p.logs();
        prevMouse = p.mouseIsPressed;

        p.displayArrows();
    }

    p.displayArrows = function() {
        p.displayArrow(baseKnob, p.createVector(matchHeight ? 0.4 * bgWidth - (bgWidth - interactiveWidth) / 2 : 0.4 * bgWidth, baseKnob.y), p.color(0));
        p.displayArrow(focusKnob, p.createVector(matchHeight ? 0.61 * bgWidth - (bgWidth - interactiveWidth) / 2 : 0.61 * bgWidth, focusKnob.y), p.color(200));
        p.displayArrow(inputButton, p.createVector(matchHeight ? 0.61 * bgWidth - (bgWidth - interactiveWidth) / 2 : 0.61 * bgWidth, inputButton.y), p.color(0));
    }

    p.displayArrow = function(element, end, color) {

        p.push();
        p.strokeWeight(2);
        p.stroke(color);

        let dR = end.copy();
        dR.x -= element.x;
        dR.y -= element.y;

        p.line(element.x + (dR.x > 0 ? element.r + 15 : -element.r - 15), element.y, end.x + (dR.x > 0 ? -8 : 8), end.y);
        p.translate(end.x + (dR.x > 0 ? -8 : 8), end.y);

        p.rotate(dR.heading());

        p.beginShape();
        p.noFill();

        p.vertex(-6, -5);
        p.vertex(0, 0);
        p.vertex(-6, 5);

        p.endShape();
        p.pop();
    }

    p.staticSetup = function() {
        p.push();
        p.textSize(16);
        p.fill(255);
        p.text('Focus', focusKnob.x, focusKnob.y + focusKnob.r + 25);
        p.text('Base', baseKnob.x, baseKnob.y + baseKnob.r + 25);
        p.text('Measuring', measuringKnob.x, measuringKnob.y + measuringKnob.r + 25);

        p.text('Record Input', inputButton.x, inputButton.y + inputButton.w / 2 + 25);

        if (!vertical)
            p.text('Vertical input recorded', interactiveWidth * 9 / 10, interactiveHeight * 6 / 10);

        p.textSize(30);
        if (p.done) {
            p.text(p.str((206.9 + variation).toFixed(1)) + '  HV0.5', interactiveWidth * 9 / 10, interactiveHeight * 4 / 10);
            p.textSize(16);
            p.textAlign(p.LEFT);
            p.text("Right Arrow Key to continue\nLeft Arrow Key to rewatch this section", interactiveWidth * 0.5 / 10, interactiveHeight * 3.5 / 10);
        }

        p.textSize(12);
        p.textAlign(p.LEFT);
        p.text('*you can "scroll" with your touchpad to rotate the knobs', 30, interactiveHeight - 30);
        p.pop();

    }

    p.blur = function() {
        p.push();
        p.drawingContext.filter = 'blur(' + p.str(p.abs(focusKnob.theta - focus)) / 50 + 'px)';
        p.translate(lensKnob.x, lensKnob.y);
        p.image(sample, -lensRadius, -lensRadius, 2 * lensRadius, 2 * lensRadius);
        p.pop();
    }

    p.drawFilars = function() {

        p.push();
        p.translate(lensKnob.x, lensKnob.y);

        if (!vertical)
            p.rotate(-lensKnob.theta + 180);

        p.strokeWeight(0.9);
        p.line(baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta), -p.sqrt(lensRadius * lensRadius - (baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta)) ** 2),
            baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta), p.sqrt(lensRadius * lensRadius - (baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta)) ** 2));

        p.line((measuringKnob.theta + baseKnob.theta - baseKnob.theta0) * 2 * lensRadius / (measuringKnob.upperTheta - measuringKnob.lowerTheta), -p.sqrt(lensRadius * lensRadius - ((measuringKnob.theta + baseKnob.theta - baseKnob.theta0) * 2 * lensRadius / (measuringKnob.upperTheta - measuringKnob.lowerTheta)) ** 2),
            (measuringKnob.theta + baseKnob.theta - baseKnob.theta0) * 2 * lensRadius / (measuringKnob.upperTheta - measuringKnob.lowerTheta), p.sqrt(lensRadius * lensRadius - ((measuringKnob.theta + baseKnob.theta - baseKnob.theta0) * 2 * lensRadius / (measuringKnob.upperTheta - measuringKnob.lowerTheta)) ** 2));

        p.strokeWeight(1.4);
        p.line(baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta), -lensRadius / 3.5,
            baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta) - p.min(lensRadius / 5, baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta) + lensRadius - 5), -lensRadius / 3.5);

        p.line(baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta), 0,
            baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta) - p.min(lensRadius / 2.5, baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta) + lensRadius - 5), 0);

        p.line(baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta), lensRadius / 3.5,
            baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta) - p.min(lensRadius / 5, baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta) + lensRadius - 5), lensRadius / 3.5);

        p.pop();

    }

    p.checkVerticalFilars = function() {
        if (baseKnob.theta > filarBounds[0] && baseKnob.theta < filarBounds[1] && measuringKnob.theta + baseKnob.theta - baseKnob.theta0 > filarBounds[2] && measuringKnob.theta + baseKnob.theta - baseKnob.theta0 < filarBounds[3]) {
            lensKnob.theta = -180;
            p.done = true;
        } else {
            p.textSize(16);
            p.text("Please align filars", interactiveWidth * 9 / 10, interactiveHeight * 5 / 10);
        }

    }

    p.noCallback = function() {}

    p.linearGradient = function(x0, y0, x1, y1, color0, colorE) {
        let gradient = drawingContext.createLinearGradient(
            x0, y0, x1, y1,
        );
        gradient.addColorStop(0, color0);
        gradient.addColorStop(1, colorE);

        drawingContext.strokeStyle = gradient;
    }

    p.logs = function() {
        if (p.keyIsDown(68)) {
            p.textSize(16);
            p.text(baseKnob.theta.toFixed(2), 100, 100);
            p.text((measuringKnob.theta + baseKnob.theta - baseKnob.theta0).toFixed(2), 100, 100);
        }
    }

    p.keyPressed = function() {
        if (p.keyCode === p.LEFT_ARROW) {
            p.videoBack = true;
        } else if (p.keyCode === p.RIGHT_ARROW) {
            p.videoForward = true;
        }
    }

    class Knob {
        constructor(x, y, r, lowerTheta, upperTheta, theta0, sides, callbackShape = noCallback, strokeWeight = -1, stroke = -1, fill = -1) {
            this.x = x;
            this.y = y;
            this.r = r;

            this.lowerTheta = lowerTheta;
            this.upperTheta = upperTheta;
            this.theta = theta0;
            this.theta0 = theta0;

            this.sides = sides;

            this.previousPosition = p.createVector(0, -this.r);
            this.currentPosition = p.createVector(0, -this.r);

            this.strokeWeight = strokeWeight;
            this.stroke = stroke;
            this.fill = fill;

            this.stillPressed = false;
            this.callbackShape = callbackShape;
        }

        display(dtheta = 0) {
            if (dtheta === 0) {
                if (!prevMouse && p.mouseIsPressed && p.dist(p.mouseX, p.mouseY, this.x, this.y) < this.r)
                    this.stillPressed = true;

                else if (!p.mouseIsPressed)
                    this.stillPressed = false;

                if (this.stillPressed) {
                    this.previousPosition = this.currentPosition;
                    this.currentPosition = p.createVector(this.x - p.mouseX, p.mouseY - this.y);
                    dtheta = this.currentPosition.angleBetween(this.previousPosition);

                } else {
                    this.currentPosition = p.createVector(this.x - p.mouseX, p.mouseY - this.y);
                    this.previousPosition = this.currentPosition;
                }
            }

            p.push();
            p.translate(this.x, this.y);
            this.theta -= dtheta;
            this.theta = p.constrain(this.theta, this.lowerTheta, this.upperTheta);
            p.rotate(-this.theta);

            //this.stroke >= 0 ? p.stroke(this.stroke) : linearGradient(-this.r * p.cos(45 + this.theta), -this.r * p.sin(45 + this.theta), this.r * p.cos(45 + this.theta), this.r * p.sin(45 + this.theta), color(230), color(60));
            this.fill >= 0 ? p.fill(this.fill) : p.noFill();
            this.strokeWeight > 0 ? p.strokeWeight(this.strokeWeight) : p.noStroke();
            this.polygon();

            if (this.fill >= 0) {
                p.stroke(0);
                p.strokeWeight(3);
                p.fill(0);
                p.line(0, -this.r / 1.8, 0, (-1.5 / 2) * this.r);
            }
            p.pop();

            this.callbackShape();

        }

        polygon() {
            if (this.sides !== 0) {
                let angle = 360 / this.sides;
                p.beginShape();
                for (let a = 0; a < 360; a += angle) {
                    let sx = p.cos(a) * this.r;
                    let sy = p.sin(a) * this.r;
                    p.vertex(sx, sy);
                }
                p.endShape(p.CLOSE);
            } else {
                p.circle(0, 0, this.r * 2);
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
            if (p.mouseIsPressed && p.mouseX > this.x - this.w / 2 && p.mouseX < this.x + this.w / 2 && p.mouseY > this.y - this.h / 2 && p.mouseY < this.y + this.h / 2) {
                p.push();
                p.noStroke();
                //p.stroke(192);
                p.rect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
                p.fill(128);
                p.rect(this.x - this.w / 2 - 2, this.y - this.h / 2, 2.2, this.h);
                p.rect(this.x - this.w / 2 - 2, this.y - this.h / 2, this.w + 2, 2);

                p.fill(223);
                p.rect(this.x + this.w / 2, this.y - this.h / 2, 2, this.h + 2);
                p.rect(this.x - this.w / 2 - 2, this.y + this.h / 2, this.w + 3, 2);

                p.fill(60);
                p.rect(this.x - this.w / 2 - 4, this.y - this.h / 2, 2.2, this.h + 2);
                p.rect(this.x - this.w / 2 - 4, this.y - this.h / 2 - 2, this.w + 6, 2.2);

                p.fill(255);
                p.rect(this.x + this.w / 2 + 2, this.y - this.h / 2 - 2, 2, this.h + 6);
                p.rect(this.x - this.w / 2 - 4, this.y + this.h / 2 + 2, this.w + 7, 2);
                this.callback();
                p.pop();

            } else {
                p.push();
                p.noStroke();
                p.rect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
                p.fill(223);
                p.rect(this.x - this.w / 2 - 2, this.y - this.h / 2, 2.2, this.h);
                p.rect(this.x - this.w / 2 - 2, this.y - this.h / 2, this.w + 2, 2);

                p.fill(128);
                p.rect(this.x + this.w / 2, this.y - this.h / 2, 2, this.h + 2);
                p.rect(this.x - this.w / 2 - 2, this.y + this.h / 2, this.w + 3, 2);

                p.fill(255);
                p.rect(this.x - this.w / 2 - 4, this.y - this.h / 2, 2.2, this.h + 2);
                p.rect(this.x - this.w / 2 - 4, this.y - this.h / 2 - 2, this.w + 6, 2.2);

                p.fill(60);
                p.rect(this.x + this.w / 2 + 2, this.y - this.h / 2 - 2, 2, this.h + 6);
                p.rect(this.x - this.w / 2 - 4, this.y + this.h / 2 + 2, this.w + 7, 2);
                p.pop();
            }
        }

        setCallback(callback) {
            this.callback = callback;
        }
    }

    p.lensKnobShape = function() {
        p.push();
        p.stroke(100);
        p.strokeWeight(2);
        p.translate(lensKnob.x, lensKnob.y);
        p.rotate(-lensKnob.theta + 180);

        let l = 72;

        for (let i = 0; i < l; i++)
            p.line((lensKnob.r - 4) * p.cos(360 * i / l), (lensKnob.r - 4) * p.sin(360 * i / l), (lensKnob.r + 4) * p.cos(360 * i / l), (lensKnob.r + 4) * p.sin(360 * i / l));

        p.noFill();
        p.circle(0, 0, lensKnob.r * 2 + 9);
        p.circle(0, 0, lensKnob.r * 2 - 9);
        p.pop();
    }

    p.focusKnobShape = function() {
        p.push();
        p.translate(focusKnob.x, focusKnob.y);
        p.rotate(-focusKnob.theta);

        p.stroke(120);
        p.strokeWeight(2);
        p.fill(20);
        p.circle(0, 0, focusKnob.r * 2);
        p.circle(0, 0, focusKnob.r * 2 * 0.85);
        p.circle(0, -focusKnob.r * 0.5, focusKnob.r * 0.3);

        p.pop();
    }

    p.measuringKnobShape = function() {
        p.push();
        p.translate(measuringKnob.x, measuringKnob.y);
        p.rotate(-measuringKnob.theta);

        p.noStroke();
        p.fill(20);
        let numTeeth = 70;
        let teethHeight = 2;


        for (let i = 0; i < numTeeth; i++) {
            let x1 = measuringKnob.r * p.cos(i * 360 / numTeeth);
            let y1 = measuringKnob.r * p.sin(i * 360 / numTeeth);
            let x2 = measuringKnob.r * p.cos((i + 1) * 360 / numTeeth);
            let y2 = measuringKnob.r * p.sin((i + 1) * 360 / numTeeth);
            let x3 = (measuringKnob.r + teethHeight) * p.cos((i + 0.5) * 360 / numTeeth);
            let y3 = (measuringKnob.r + teethHeight) * p.sin((i + 0.5) * 360 / numTeeth);

            p.triangle(x1, y1, x2, y2, x3, y3);
        }

        p.fill(20);
        p.stroke(100);
        p.circle(0, 0, measuringKnob.r * 2);
        p.circle(0, 0, measuringKnob.r * 2 * 0.85);

        p.pop();
    }

    p.baseKnobShape = function() {
        p.push();
        p.translate(baseKnob.x, baseKnob.y);
        p.rotate(-baseKnob.theta);

        p.noStroke();
        p.fill(20);
        let numTeeth = 50;
        let teethHeight = 2;


        for (let i = 0; i < numTeeth; i++) {
            let x1 = baseKnob.r * p.cos(i * 360 / numTeeth);
            let y1 = baseKnob.r * p.sin(i * 360 / numTeeth);
            let x2 = baseKnob.r * p.cos((i + 1) * 360 / numTeeth);
            let y2 = baseKnob.r * p.sin((i + 1) * 360 / numTeeth);
            let x3 = (baseKnob.r + teethHeight) * p.cos((i + 0.5) * 360 / numTeeth);
            let y3 = (baseKnob.r + teethHeight) * p.sin((i + 0.5) * 360 / numTeeth);

            p.triangle(x1, y1, x2, y2, x3, y3);
        }

        p.fill(20);
        p.stroke(100);
        p.circle(0, 0, baseKnob.r * 2);
        p.circle(0, 0, baseKnob.r * 2 * 0.85);

        p.pop();
    }

    p.mouseWheel = function(event) {
        for (let i = 0; i < knobs.length; i++)
            if ((p.dist(p.mouseX, p.mouseY, knobs[i].x, knobs[i].y) < knobs[i].r)) {
                knobs[i].display(event.delta / 2);
            }
    }
}