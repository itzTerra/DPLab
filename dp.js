class Origin{
    constructor(x, y, radius, color){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
}

class Bob{
    constructor(length, mass, angle, velocity, radius, color, lineWeight, lineColor, trailWeight, trailColor, trailLen){
        this.length = length;
        this.mass = mass;
        this.angle = angle;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;
        this.lineWeight = lineWeight;
        this.lineColor = lineColor;
        this.trailWeight = trailWeight;
        this.trailColor = trailColor;
        this.trailLen = trailLen;
    }
}

class DP{
    lengthScale = 150;
    x1;
    y1;
    x2;
    y2;
    trail1 = [];
    trail2 = [];

    constructor(data){
        this.data = JSON.parse(JSON.stringify(data));

        // Math helper
        this.x = [
            data.bob1.angle / 180 * Math.PI, 
            data.bob1.velocity, 
            data.bob2.angle / 180 * Math.PI, 
            data.bob2.velocity
        ];
        
        // Input validation helpers
        this.inputs = {
            simSpeed: data.simSpeed,
            damping: data.damping,
            ox: data.origin.x,
            oy: data.origin.y,
            or: data.origin.radius,
            l1: data.bob1.length,
            l2: data.bob2.length,
            m1: data.bob1.mass,
            m2: data.bob2.mass,
            r1: data.bob1.radius,
            r2: data.bob2.radius,
            lw1: data.bob1.lineWeight,
            lw2: data.bob2.lineWeight,
            tw1: data.bob1.trailWeight,
            tw2: data.bob2.trailWeight,
            tl1: data.bob1.trailLen,
            tl2: data.bob2.trailLen,
        };

        this.Init(4);
    }

    Init(nEquations){
        this.nEquations = nEquations;
        this.store = new Array(nEquations);
        this.k1 = new Array(nEquations);
        this.k2 = new Array(nEquations);
        this.k3 = new Array(nEquations);
        this.k4 = new Array(nEquations);
    }

    UpdateX(){
        this.x[0] = this.data.bob1.angle / 180 * Math.PI;
        this.x[1] = this.data.bob1.velocity;
        this.x[2] = this.data.bob2.angle / 180 * Math.PI;
        this.x[3] = this.data.bob2.velocity;
    }

    UpdateInputs(){
        this.inputs.simSpeed = this.data.simSpeed;
        this.inputs.damping = this.data.damping;
        this.inputs.ox = this.data.origin.x;
        this.inputs.oy = this.data.origin.y;
        this.inputs.or = this.data.origin.radius;
        this.inputs.l1 = this.data.bob1.length;
        this.inputs.l2 = this.data.bob2.length;
        this.inputs.m1 = this.data.bob1.mass;
        this.inputs.m2 = this.data.bob2.mass;
        this.inputs.r1 = this.data.bob1.radius;
        this.inputs.r2 = this.data.bob2.radius;
        this.inputs.lw1 = this.data.bob1.lineWeight;
        this.inputs.lw2 = this.data.bob2.lineWeight;
        this.inputs.tw1 = this.data.bob1.trailWeight;
        this.inputs.tw2 = this.data.bob2.trailWeight;
        this.inputs.tl1 = this.data.bob1.trailLen;
        this.inputs.tl2 = this.data.bob2.trailLen;
    }

    RatesOfChange(x, xdot){
        let theta1 = x[0];
        let p_theta1 = x[1];
        let theta2 = x[2];
        let p_theta2 = x[3];
        
        let data = this.data;

        if (data.compound){
            if (data.bob2.mass == 0) {
                data.bob2.mass = 0.000001;
                this.inputs.m2 = 0.000001;
            }

            let M = data.bob1.mass + 3*data.bob2.mass;
            let c = Math.cos(theta1 - theta2);
            let s = Math.sin(theta1 - theta2);
            let Lr = data.bob1.length / data.bob2.length;
            let den = 4 * M - 9 * data.bob2.mass * c*c;

            let theta1dot = 6 / data.bob1.length*data.bob1.length * (2*p_theta1 - 3 * Lr * c * p_theta2) / den;
            let theta2dot = 6 / data.bob2.mass / data.bob2.length*data.bob2.length * ((2 * p_theta2 * M - 3 * data.bob2.mass / Lr * c * p_theta1) / den);
            let term = data.bob2.mass * data.bob1.length * data.bob2.length / 2 * theta1dot * theta2dot * s;
            let p_theta1dot = -term - (data.bob1.mass/2 + data.bob2.mass) * data.g * data.bob1.length * Math.sin(theta1);
            let p_theta2dot = term - data.bob2.mass/2 * data.g * data.bob2.length * Math.sin(theta2);

            xdot[0] = theta1dot;
            xdot[1] = p_theta1dot;;
            xdot[2] = theta2dot;
            xdot[3] = p_theta2dot;
        }
        else{
            let acceleration1;
            let acceleration2;
            if (data.bob2.mass > 0 || data.bob2.radius > 0 || data.bob2.lineWeight > 0 || data.bob2.trailWeight > 0){
                // Math for acceleration1
                let num1 = -data.g * (2 * data.bob1.mass + data.bob2.mass) * Math.sin(theta1);
                let num2 = -data.bob2.mass * data.g * Math.sin(theta1 - 2 * theta2);
                let num3 = -2 * Math.sin(theta1 - theta2) * data.bob2.mass;
                let num4 = p_theta2 * p_theta2 * data.bob2.length + p_theta1 * p_theta1 * data.bob1.length * Math.cos(theta1 - theta2);
                let den = data.bob1.length * (2 * data.bob1.mass + data.bob2.mass - data.bob2.mass * Math.cos(2 * theta1 - 2 * theta2));
                acceleration1 = (num1 + num2 + num3 * num4) / den;
                
                // Math for acceleration2 (reusing previous helper variables)
                num1 = 2 * Math.sin(theta1 - theta2);
                num2 = p_theta1 * p_theta1 * data.bob1.length * (data.bob1.mass + data.bob2.mass);
                num3 = data.g * (data.bob1.mass + data.bob2.mass) * Math.cos(theta1);
                num4 = p_theta2 * p_theta2 * data.bob2.length * data.bob2.mass * Math.cos(theta1 - theta2);
                den = data.bob2.length * (2 * data.bob1.mass + data.bob2.mass - data.bob2.mass * Math.cos(2 * theta1 - 2 * theta2));
                acceleration2 = num1 * (num2 + num3 + num4) / den;
            }
            else{
                acceleration1 = (-1 * this.data.g / this.data.bob1.length) * Math.sin(theta1);
                p_theta2 = 0;
                acceleration2 = 0;
            }
            
            xdot[0] = p_theta1;
            xdot[1] = acceleration1;
            xdot[2] = p_theta2;
            xdot[3] = acceleration2;
        }
    }

    // h: timeStep
    RK4Step(x, h){
        let damping = (1 - this.data.damping * (Math.sign(this.data.damping) == -1 ? 10 : 1));
        h /= damping;

        this.RatesOfChange(x,this.k1);
        for (let i = 0; i < this.nEquations; i++) {
            this.store[i] = x[i] + this.k1[i] * h / 2;
        }
        this.RatesOfChange(this.store,this.k2);
        for (let i = 0; i < this.nEquations; i++) {
            this.store[i] = x[i] + this.k2[i] * h / 2;
        }
        this.RatesOfChange(this.store,this.k3);
        for (let i = 0; i < this.nEquations; i++) {
            this.store[i] = x[i] + this.k3[i] * h;
        }
        this.RatesOfChange(this.store, this.k4);
        for (let i = 0; i < this.nEquations; i++) {
            x[i] += (this.k1[i] + 2*this.k2[i] + 2*this.k3[i] + this.k4[i]) * h/6 * damping;
        }
    }
    /*
    x -> y1
    x + y1/2*h -> y2
    x + y2/2*h -> y3
    x + y3*h -> y4
    x += (y1 + 2*y2 + 2*y3 + y4)/6*h
    */

    XtoReadable(){
        let data = this.data;

        data.bob1.angle = +((this.x[0] * 180 / Math.PI) % 360).toFixed(2);
        data.bob1.velocity = +(this.x[1].toFixed(2));
        data.bob2.angle = +((this.x[2] * 180 / Math.PI) % 360).toFixed(2);
        data.bob2.velocity = +(this.x[3].toFixed(2));
    }

    show(p, simulate = true){
        let data = this.data;

        if (simulate && data.simSpeed != 0 && !this.paused){
            this.RK4Step(this.x, data.simSpeed * p.deltaTime/1000);
            this.XtoReadable();
        }

        if (!data.hidden){
            this.x1 = data.origin.x + data.bob1.length * Math.sin(this.x[0]) * this.lengthScale;
            this.y1 = data.origin.y + data.bob1.length * Math.cos(this.x[0]) * this.lengthScale;
            this.x2 = this.x1 + data.bob2.length * Math.sin(this.x[2]) * this.lengthScale;
            this.y2 = this.y1 + data.bob2.length * Math.cos(this.x[2]) * this.lengthScale;

            // Trails
            let lastTrailPoint;
            if (data.bob1.trailWeight > 0 && data.bob1.trailLen != 0){
                p.stroke(data.bob1.trailColor);
                p.strokeWeight(data.bob1.trailWeight);
                for (let [i, v] of this.trail1.entries()){
                    if (i == 0){
                        lastTrailPoint = v;
                        continue;
                    }
                    p.line(lastTrailPoint.x, lastTrailPoint.y, v.x, v.y);
                    lastTrailPoint = v;
                }

                if (simulate && data.simSpeed != 0 && !this.paused){
                    let diff = this.trail1.length - data.bob1.trailLen;
                    if (data.bob1.trailLen > -1 && diff){
                        this.trail1.splice(0, diff);
                    }
                    this.trail1.push(p.createVector(this.x1, this.y1));
                }
            }
            if (data.bob2.trailWeight > 0 && data.bob2.trailLen != 0){
                p.stroke(data.bob2.trailColor);
                p.strokeWeight(data.bob2.trailWeight);
                for (let [i, v] of this.trail2.entries()){
                    if (i == 0){
                        lastTrailPoint = v;
                        continue;
                    }
                    p.line(lastTrailPoint.x, lastTrailPoint.y, v.x, v.y);
                    lastTrailPoint = v;
                }

                if (simulate && data.simSpeed != 0 && !this.paused){
                    let diff = this.trail2.length - data.bob2.trailLen;
                    if (data.bob2.trailLen > -1 && diff){
                        this.trail2.splice(0, diff);
                    }
                    this.trail2.push(p.createVector(this.x2, this.y2));
                }
            }

            // Rods
            if (data.bob1.lineWeight > 0){
                p.stroke(data.bob1.lineColor);
                p.strokeWeight(data.bob1.lineWeight);
                p.line(data.origin.x, data.origin.y, this.x1, this.y1);
            }
    
            if (data.bob2.lineWeight > 0){
                p.stroke(data.bob2.lineColor);
                p.strokeWeight(data.bob2.lineWeight);
                p.line(this.x1, this.y1, this.x2, this.y2);
            }
            
            // Bobs
            p.strokeWeight(0);
            p.fill(data.origin.color);
            p.circle(data.origin.x, data.origin.y, data.origin.radius);
            p.fill(data.bob1.color);
            p.circle(this.x1, this.y1, data.bob1.radius);
            p.fill(data.bob2.color);
            p.circle(this.x2, this.y2, data.bob2.radius);
        }
    }
}