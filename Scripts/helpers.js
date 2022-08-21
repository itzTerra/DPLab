const DEFAULT_DP_DATA = {
    simSpeed: 1,
    damping: 0,
    g: 9.81,
    compound: false,
    origin: new Origin(0, -150, 10, "rgb(255, 255, 255)"),
    bob1: new Bob(1, 1, 90, 0, 10, "rgb(255, 255, 255)", 2, "rgb(255, 255, 255)", 0, "rgb(255, 255, 255)", 100),
    bob2: new Bob(1, 1, 135, 0, 30, "rgb(255, 255, 255)", 2, "rgb(255, 255, 255)", 0, "rgb(255, 255, 255)", 100),
    hidden: false,
}

const COLOR_INPUT_SETTINGS = {
    type: "color",
    showPalette: false,
    showInput: true,
    showButtons: false,
    allowEmpty: false,
    clickoutFiresChange: false,
    preferredFormat: "rgb",
    containerClassName: 'bg-dark',
    replacerClassName: "form-control form-control-sm form-control-color"
}

function Clamp(a, min = 0, max = 1){
    return Math.min(max, Math.max(min, a));
}

function Lerp(a, b, t){
    return a*(1-t) + b*t;
}

function InverseLerp(a, b, v){
    return Clamp((v - a) / (b - a));
}

function CombineLerp(min1, max1, min2, max2, val){
    let t = InverseLerp(min1, max1, val);
    return Lerp(min2, max2, t);
}

function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

function randint(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getData(randomProps) {
    let data = JSON.parse(JSON.stringify(DEFAULT_DP_DATA));

    if (randomProps){
        if ("simSpeed" in randomProps){
            let min = randomProps["simSpeed"][0] !== undefined ? randomProps["simSpeed"][0] : 0.1;
            let max = randomProps["simSpeed"][1] !== undefined ? randomProps["simSpeed"][1] : 10;
            data.simSpeed = randomRange(min, max);
        }
        if ("g" in randomProps){
            let min = randomProps["g"][0] !== undefined ? randomProps["g"][0] : 1;
            let max = randomProps["g"][1] !== undefined ? randomProps["g"][1] : 10;
            data.g = randomRange(min, max);
        }
        if ("color" in randomProps){
            let color = tinycolor.random();;
            if (randomProps.color.greyscale){
                color = tinycolor.random().greyscale();
            }
            if (randomProps.color.opacity !== undefined){
                color.setAlpha(randomRange(randomProps.color.opacity[0], randomProps.color.opacity[1]));
            }
            color = color.toRgbString();

            data.origin.color = color;
            data.bob1.color = color;
            data.bob1.lineColor = color;
            data.bob1.trailColor = color;
            data.bob2.color = color;
            data.bob2.lineColor = color;
            data.bob2.trailColor = color;
        }
        if ("c2" in randomProps){
            if (Object.keys(randomProps["c2"]).length){
                let hsl = {h: 0, s: 100, l: 50};
                if (randomProps["c2"].h !== undefined){
                    hsl.h = randint(randomProps["c2"].h[0], randomProps["c2"].h[1]);
                }
                if (randomProps["c2"].s !== undefined){
                    hsl.s = randint(randomProps["c2"].s[0], randomProps["c2"].s[1]);
                }
                if (randomProps["c2"].l !== undefined){
                    hsl.l = randint(randomProps["c2"].l[0], randomProps["c2"].l[1]);
                }

                data.bob2.color = tinycolor(`hsl(${hsl.h}, ${hsl.s}, ${hsl.l})`).toRgbString();
            }
            else{
                data.bob2.color = tinycolor.random().toRgbString();
            }
        }
        if ("a1" in randomProps){
            let min = randomProps["a1"][0] !== undefined ? randomProps["a1"][0] : 0;
            let max = randomProps["a1"][1] !== undefined ? randomProps["a1"][1] : 360;
            data.bob1.angle = randint(min, max);
        }
        if ("a2" in randomProps){
            let min = randomProps["a2"][0] !== undefined ? randomProps["a2"][0] : 0;
            let max = randomProps["a2"][1] !== undefined ? randomProps["a2"][1] : 360;
            data.bob2.angle = randint(min, max);        
        }
        if ("ox" in randomProps){
            let min = randomProps["ox"][0] !== undefined ? randomProps["ox"][0] : -600;
            let max = randomProps["ox"][1] !== undefined ? randomProps["ox"][1] : 600;
            data.origin.x = randint(min, max);
        }
        if ("oy" in randomProps){
            let min = randomProps["oy"][0] !== undefined ? randomProps["oy"][0] : -600;
            let max = randomProps["oy"][1] !== undefined ? randomProps["oy"][1] : 600;
            data.origin.y = randint(min, max);        
        }
        if ("or" in randomProps){
            let min = randomProps["or"][0] !== undefined ? randomProps["or"][0] : 10;
            let max = randomProps["or"][1] !== undefined ? randomProps["or"][1] : 100;
            data.origin.radius = randint(min, max);        
        }
        if ("l1" in randomProps){
            let min = randomProps["l1"][0] !== undefined ? randomProps["l1"][0] : 0.1;
            let max = randomProps["l1"][1] !== undefined ? randomProps["l1"][1] : 10;
            data.bob1.length = randomRange(min, max);        
        }
        if ("l2" in randomProps){
            let min = randomProps["l2"][0] !== undefined ? randomProps["l2"][0] : 0.1;
            let max = randomProps["l2"][1] !== undefined ? randomProps["l2"][1] : 10;
            data.bob2.length = randomRange(min, max);           
        }
        if ("r1" in randomProps){
            let min = randomProps["r1"][0] !== undefined ? randomProps["r1"][0] : 10;
            let max = randomProps["r1"][1] !== undefined ? randomProps["r1"][1] : 100;
            data.bob1.radius = randint(min, max);    
        }
        if ("r2" in randomProps){
            let min = randomProps["r2"][0] !== undefined ? randomProps["r2"][0] : 10;
            let max = randomProps["r2"][1] !== undefined ? randomProps["r2"][1] : 100;
            data.bob2.radius = randint(min, max);  
        }
        if ("lw1" in randomProps){
            let min = randomProps["lw1"][0] !== undefined ? randomProps["lw1"][0] : 1;
            let max = randomProps["lw1"][1] !== undefined ? randomProps["lw1"][1] : 20;
            data.bob1.lineWeight = randint(min, max);  
        }
        if ("lw2" in randomProps){
            let min = randomProps["lw2"][0] !== undefined ? randomProps["lw2"][0] : 1;
            let max = randomProps["lw2"][1] !== undefined ? randomProps["lw2"][1] : 20;
            data.bob2.lineWeight = randint(min, max);  
        }
        if ("v1" in randomProps){
            let coef = data.bob1.angle > 180 ? -1 : 1;
            let min = randomProps["v1"][0] !== undefined ? randomProps["v1"][0] : 0;
            let max = randomProps["v1"][1] !== undefined ? randomProps["v1"][1] : 5;
            data.bob1.velocity = randomRange(coef * min, coef * max);
        }
        if ("v2" in randomProps){
            let coef = data.bob2.angle > 180 ? -1 : 1;
            let min = randomProps["v2"][0] !== undefined ? randomProps["v2"][0] : 0;
            let max = randomProps["v2"][1] !== undefined ? randomProps["v2"][1] : 5;
            data.bob2.velocity = randomRange(coef * min, coef * max);
        }
        if ("m2" in randomProps){
            let min = randomProps["m2"][0] !== undefined ? randomProps["m2"][0] : 0.5;
            let max = randomProps["m2"][1] !== undefined ? randomProps["m2"][1] : 5;
            data.bob2.mass = randint(min, max); 
        }
    }
    return data;
}

function getPresets(count, randomProps){
    let presets = []
    for (let i = 0; i < count; i++){
        // randomProps.a2 = [90 + i * 5, 90 + i * 5];
        const SPACING = 1/15 + 1/15 * i;
        randomProps.l1 = [SPACING, SPACING];
        presets.push(getData(randomProps));
    }

    let dataStr = JSON.stringify(presets, null, 2);
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', "randomPreset.json");
    linkElement.click();
}

function _getDank(count = 20){
    let randomProps = {
        ox: [-100, 100],
        oy: [-250, -50],
        or: [0, 0],
        l1: [0.2, 5],
        l2: [0.2, 5],
        a1: [],
        a2: [],
        v1: [],
        v2: [],
        r1: [0, 0],
        r2: [5, 50],
        color: {},
        lw1: [0, 0],
        lw2: [0, 0],
    }
    getPresets(count, randomProps);
}

function _getBubbles(count = 15){
    let randomProps = {
        simSpeed: [0.1, 0.1],
        or: [0, 0],
        l1: [1, 3],
        l2: [1, 4],
        a1: [],
        a2: [],
        r1: [0, 0],
        r2: [20, 100],
        color: {greyscale: true, opacity: [0.15, 0.5]},
        lw1: [0, 0],
        lw2: [0, 0],
    }
    getPresets(count, randomProps);
}

function _getScience(count = 10){
    let randomProps = {
        a2: [0, 0],
        r1: [0, 0],
        r2: [0, 0],
    }
    getPresets(count, randomProps);
}

function _getVortex(){
    const COUNT = 82; // 820 / 10
    let randomProps = {
        g: [-10, -10],
        oy: [420, 420],
        a1: [90, 90],
        a2: [0, 0],
        r1: [0, 0],
        r2: [0, 0],
        m2: [0, 0],
        lw2: [0, 0],
    }
    getPresets(COUNT, randomProps);
}