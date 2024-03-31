import { DoublePendulum } from "./double_pendulum.js"

const PRESETS_PUBLIC_PATH = "static/presets.json";

const app = Vue.createApp({
    setup() {
        const TOOLBAR_PADDING = 10;
        let dragStart = {x: 0, y: 0};
        let cameraOffset = {x: 0, y: 0};

        const DPs = Vue.reactive([]);
        const canvasZoom = Vue.ref(1);
        const canvasColor = Vue.ref("#121212");
        const editData = Vue.ref({});
        const selectedPreset = Vue.ref([]);
        const presets = Vue.ref({});

        return {
            TOOLBAR_PADDING, dragStart, cameraOffset,
            DPs, canvasZoom, canvasColor, editData, selectedPreset, presets}
    },
    beforeMount(){
        let lastSettings = localStorage.getItem("lastSettings");
        if (lastSettings === null){
            this.DPs.push(new DP(DEFAULT_DP_DATA));
        }
        else{
            JSON.parse(lastSettings).forEach((data) => {
                if(this.isDPValid(data)){
                    this.DPs.push(new DP(data));
                }
            })
        }

        let canvasColor = sessionStorage.getItem("canvasColor");
        if (canvasColor !== null){
            this.canvasColor = canvasColor;
        }

        fetch(PRESETS_PUBLIC_PATH)
        .then(response => response.json())
        .then(json => this.presets.public = json);

        let localPresets = localStorage.getItem("presets");
        this.presets.local = (localPresets !== null) ? JSON.parse(localPresets) : {};

        this.editData = JSON.parse(JSON.stringify(DEFAULT_DP_DATA));
    },
    mounted() {
        const s = p => {
            p.setup = () => {
                let canvas = p.createCanvas(this.canvasWidth, this.canvasHeight).canvas;
                canvas.addEventListener('mousedown', this.onPointerDown)
                canvas.addEventListener('touchstart', (e) => this.handleTouch(e, this.onPointerDown))
                canvas.addEventListener('mouseup', this.onPointerUp)
                canvas.addEventListener('touchend', (e) => this.handleTouch(e, this.onPointerUp))
                canvas.addEventListener('mousemove', this.onPointerMove)
                canvas.addEventListener('touchmove', (e) => this.handleTouch(e, this.onPointerMove))
                canvas.addEventListener('wheel', (e) => this.adjustZoom(e.deltaY * 0.0005))

                p.frameRate(60);
                p.simulate = true;

                // Draw block
                p.background(this.canvasColor);
                p.translate(this.canvasWidth / 2, this.canvasHeight / 2)
                p.scale(this.canvasZoom)
                p.translate(-this.canvasWidth / 2 + this.cameraOffset.x, -this.canvasHeight / 2 + this.cameraOffset.y)
                this.DPs.forEach(dp => {
                    dp.show(p, p.simulate);
                })

                let lastPaused = sessionStorage.getItem("lastPaused");
                if (lastPaused && (lastPaused == "true")){
                    this.playPause();
                }
            };

            p.draw = () => {
                if (p.deltaTime > 200) {
                    return
                }
                p.background(this.canvasColor);

                p.translate(this.canvasWidth / 2, this.canvasHeight / 2)
                p.scale(this.canvasZoom)
                p.translate(-this.canvasWidth / 2 + this.cameraOffset.x, -this.canvasHeight / 2 + this.cameraOffset.y)

                this.DPs.forEach(dp => {
                    dp.show(p, p.simulate);
                })
            };
        };
        this.myp5 = new p5(s, "p5");

        this.canvasToolbar = $("#canvasToolbar");

        this.canvasToolbar.css("top", this.TOOLBAR_PADDING);
        window.addEventListener('resize', this.windowResize);
        this.windowResize();

        document.addEventListener("keyup", (e) => {
            if ((e.key == " " || e.code == "Space") && document.activeElement.tagName != "INPUT"){
                this.playPause();
            }
        })

        window.addEventListener("beforeunload", () => {
            localStorage.setItem("lastSettings", JSON.stringify(this.DPs.map((i) => i.data)));
            sessionStorage.setItem("lastPaused", !this.myp5.isLooping());
            sessionStorage.setItem("canvasColor", this.canvasColor);
        });

        this.$nextTick(() => {
            if (this.DPs.length == 1) {
                this.toggleAccordionCollapse("0");
            }

            $("#editOffcanvas").on("show.bs.offcanvas hide.bs.offcanvas", () => {
                $(".offcanvas-btn-chevron").toggleClass("rotated");
            })

            $("#editOffcanvas form label").click((e) => {
                e.preventDefault();
                let classes = e.currentTarget.classList;
                if (e.currentTarget.id == "simSpeedEditLabel" || e.currentTarget.id == "dampingEditLabel"){
                    $(`input[aria-labelledby='${e.currentTarget.id}']`).prop('disabled', (i, v) => { return !v; });
                    classes.toggle("editDisabled");
                }
                else if (e.currentTarget.id == "ocInputEditLabel"){
                    let el = $("input[aria-labelledby='ocInputEditLabel']");
                    el.spectrum(el.prop("disabled") ? "enable" : "disable");
                    classes.toggle("editDisabled");
                }
                else if (e.currentTarget.htmlFor){
                    $("#"+e.currentTarget.htmlFor).prop('disabled', (i, v) => { return !v; })
                    classes.toggle("editDisabled");
                }
                else{
                    let inputs = $(`input[aria-labelledby='${e.currentTarget.id}'][type='number']`);
                    let colorInputs = $(`input[aria-labelledby='${e.currentTarget.id}'][type='color']`);

                    if (classes.contains("editDisabledGrad1")){
                        classes.remove("editDisabledGrad1");
                        classes.add("editDisabledGrad2");

                        inputs[0].disabled = false;
                        inputs[1].disabled = true;

                        if (colorInputs.length){
                            colorInputs.eq(0).spectrum("enable");
                            colorInputs.eq(1).spectrum("disable");
                        }
                    }
                    else if (classes.contains("editDisabledGrad2")){
                        classes.remove("editDisabledGrad2");
                        classes.add("editDisabled");

                        inputs[0].disabled = true;

                        if (colorInputs.length){
                            colorInputs.eq(0).spectrum("disable");
                            $(e.currentTarget).next().children().prop("disabled", true);
                        }
                    }
                    else if (classes.contains("editDisabled")){
                        classes.remove("editDisabled");

                        inputs[0].disabled = false;

                        inputs[1].disabled = false;

                        if (colorInputs.length){
                            colorInputs.eq(0).spectrum("enable");
                            colorInputs.eq(1).spectrum("enable");
                            $(e.currentTarget).next().children().prop("disabled", false);
                        }
                    }
                    else{
                        classes.add("editDisabledGrad1");

                        inputs[0].disabled = true;

                        if (colorInputs.length){
                            colorInputs.eq(0).spectrum("disable");
                        }
                    }
                }
            })

            $("#editOffcanvas form .btn-mini").click((e) => {
                e.preventDefault();
                let classes = $(e.currentTarget).parent().prev()[0].classList;
                if (e.currentTarget.name[e.currentTarget.name.length-1] == "L"){
                    let inputs = $(`input[aria-labelledby='${e.currentTarget.name.slice(0, -1)}'][type='number']`);

                    if (classes.contains("editDisabledGrad1")){
                        inputs[1].disabled = !inputs[1].disabled;
                    }
                    else if (classes.contains("editDisabledGrad2")){
                        inputs[0].disabled = !inputs[0].disabled;
                    }
                    else{
                        inputs.prop('disabled', (i, v) => { return !v; });
                    }
                }
                else{
                    let colorInputs = $(`input[aria-labelledby='${e.currentTarget.name.slice(0, -1)}'][type='color']`);
                    if (classes.contains("editDisabledGrad1")){
                        colorInputs.eq(1).spectrum(colorInputs[1].disabled ? "enable" : "disable");
                    }
                    else if (classes.contains("editDisabledGrad2")){
                        colorInputs.eq(0).spectrum(colorInputs[0].disabled ? "enable" : "disable");
                    }
                    else{
                        colorInputs.eq(0).spectrum(colorInputs[0].disabled ? "enable" : "disable");
                        colorInputs.eq(1).spectrum(colorInputs[1].disabled ? "enable" : "disable");
                    }
                }
            })

            let tt;
            $('#editOffcanvas [data-bs-toggle="tooltip"]').each(function(){
                tt = new bootstrap.Tooltip($(this));
            })

            $(".canvasColorInput").spectrum({
                type: "color",
                showPalette: false,
                showInput: true,
                allowEmpty: false,
                clickoutFiresChange: false,
                preferredFormat: "rgb",
                containerClassName: 'bg-dark',
                replacerClassName: "form-control form-control-sm form-control-color canvasColorInput",
                change: (color) => {
                    this.canvasColor = color.toRgbString();
                    this.drawOnce();
                }
            })
            $(`#editOffcanvas input[type='color']`).spectrum(COLOR_INPUT_SETTINGS);
        });

    },
    methods: {
        addDP() {
            this.DPs.push(new DP(DEFAULT_DP_DATA));
            this.drawOnce();
        },
        toggleAccordionCollapse(id) {
            $(`.accordion-button[data-bs-target='${"#collapse" + id}']`).toggleClass("collapsed");
            $("#collapse" + id).toggleClass("show");
        },
        selectAll(e) {
            this.DPs.map(function (i) {
                i.checked = e.target.checked;
            })
        },
        getSelectedIDs() {
            let res = [];
            for (let i = this.DPs.length - 1; i >= 0; i--) {
                if (this.DPs[i].checked) {
                    res.push(i);
                }
            }
            return res;
        },
        showHideSelected(hide){
            this.getSelectedIDs().forEach((id) => {
                this.DPs[id].data.hidden = hide;
            })
            this.drawOnce();
        },
        duplicateSelected(){
            let selected = this.getSelectedIDs();
            let h = 1;
            let l = this.DPs.length;
            for(let i = 0; i < l; i++){
                if (selected.includes(i)){
                    this.DPs.splice(i + h, 0, new DP(this.DPs[i+h-1].data));
                    h++;
                }
            }
            this.drawOnce();
        },
        deleteSelected() {
            this.getSelectedIDs().forEach((id) => {
                this.DPs.splice(id, 1);
            })
            this.drawOnce();
        },
        editSelectChange(e){
            let data;
            if (e.target.value == "default"){
                data = DEFAULT_DP_DATA;
            }
            else{
                data = this.DPs[e.target.value].data;
            }
            this.editData = JSON.parse(JSON.stringify(data));

            let colors = [
                this.editData.origin.color, this.editData.bob1.color, this.editData.bob2.color,
                this.editData.bob1.lineColor, this.editData.bob2.lineColor,
                this.editData.bob1.trailColor, this.editData.bob2.trailColor];
            $(`#editOffcanvas input[type='color']`).each(function(i){
                $(this).spectrum("set", colors[i]);
            })
        },
        editToggleAll(e){
            $("#editOffcanvas form input").prop("disabled", e.target.checked);
            $("#editOffcanvas form input[type='color']").spectrum(e.target.checked ? "disable" : "enable");

            let labels = $("#editOffcanvas form label");
            let toggleBtns = $("#editOffcanvas .btn-mini");

            labels.removeClass("editDisabledGrad1 editDisabledGrad2");
            if (e.target.checked){
                labels.addClass("editDisabled");
                toggleBtns.prop("disabled", true);
            }
            else{
                labels.removeClass("editDisabled");
                toggleBtns.prop("disabled", false);
            }
        },
        editSubmit(e){
            let data = {};
            e.target.elements.forEach((i) => {
                if (!i.disabled){
                    let val;
                    if (i.name == "compound"){
                        val = i.checked;
                    }
                    else if (["oc", "c1", "c2", "lc1", "lc2", "tc1", "tc2"].includes(i.name)){
                        val = $(i).spectrum("get").toRgbString();
                    }
                    else{
                        if (i.value == ""){
                            val = Number(i.getAttribute("placeholder"));
                        }
                        else{
                            val = Number(i.value);
                        }
                    }

                    data[i.name] = val;
                }
            })

            this.getSelectedIDs().forEach((id) => {
                let dpData = this.DPs[id].data;

                if ("simSpeed" in data) dpData.simSpeed = data.simSpeed;
                if ("damping" in data) dpData.damping = data.damping;
                if ("g" in data) dpData.g = data.g;
                if ("compound" in data) dpData.compound = data.compound;
                if ("ox" in data) dpData.origin.x = data.ox;
                if ("oy" in data) dpData.origin.y = data.oy;
                if ("or" in data) dpData.origin.radius = data.or;
                if ("oc" in data) dpData.origin.color = data.oc;
                if ("l1" in data) dpData.bob1.length = data.l1;
                if ("l2" in data) dpData.bob2.length = data.l2;
                if ("m1" in data) dpData.bob1.mass = data.m1;
                if ("m2" in data) dpData.bob2.mass = data.m2;
                if ("a1" in data) dpData.bob1.angle = data.a1;
                if ("a2" in data) dpData.bob2.angle = data.a2;
                if ("v1" in data) dpData.bob1.velocity = data.v1;
                if ("v2" in data) dpData.bob2.velocity = data.v2;
                if ("r1" in data) dpData.bob1.radius = data.r1;
                if ("r2" in data) dpData.bob2.radius = data.r2;
                if ("c1" in data) dpData.bob1.color = data.c1;
                if ("c2" in data) dpData.bob2.color = data.c2;
                if ("lw1" in data) dpData.bob1.lineWeight = data.lw1;
                if ("lw2" in data) dpData.bob2.lineWeight = data.lw2;
                if ("lc1" in data) dpData.bob1.lineColor = data.lc1;
                if ("lc2" in data) dpData.bob2.lineColor = data.lc2;
                if ("tw1" in data) dpData.bob1.trailWeight = data.tw1;
                if ("tw2" in data) dpData.bob2.trailWeight = data.tw2;
                if ("tc1" in data) dpData.bob1.trailColor = data.tc1;
                if ("tc2" in data) dpData.bob2.trailColor = data.tc2;
                if ("tl1" in data) dpData.bob1.trailLen = data.tl1;
                if ("tl2" in data) dpData.bob2.trailLen = data.tl2;

                this.DPs[id].UpdateX();
                this.DPs[id].UpdateInputs();
                this.$refs.doublePendulums[id].updateColorInputs();
                this.DPs[id].trail1 = [];
                this.DPs[id].trail2 = [];
            })
            this.drawOnce();
        },
        playPause() {
            $(".playpause").toggleClass("playing");
            if (this.myp5.isLooping()) {
                this.myp5.noLoop();
            }
            else {
                this.myp5.loop();
            }
        },
        drawOnce() {
            if (this.myp5 && !this.myp5.isLooping()) {
                this.myp5.simulate = false;
                this.myp5.redraw();
                this.myp5.simulate = true;
            }
        },
        canvasResize(width, height = null){
            this.canvasWidth = width;
            this.canvasHeight = height || width;
            this.myp5.resizeCanvas(this.canvasWidth, this.canvasHeight);
            this.cameraOffset = { x: this.canvasWidth / 2, y: this.canvasHeight / 2 };

            this.drawOnce();
        },
        windowResize() {
            if (!document.fullscreenElement) {
                let canvasHeightDefault = 820;
                if (window.innerWidth >= 1400){
                    this.canvasWidthDefault = 905;
                }
                else if (window.innerWidth >= 1200){
                    this.canvasWidthDefault = 725;
                }
                else if (window.innerWidth >= 992) {
                    this.canvasWidthDefault = 545;
                }
                else{
                    this.canvasWidthDefault = 905;
                    canvasHeightDefault = null;
                }

                let gap = 0;
                if (window.innerWidth < this.canvasWidthDefault + 25) {
                    gap = 25;
                }
                this.canvasResize(
                    Math.min(this.canvasWidthDefault, window.innerWidth - gap),
                    canvasHeightDefault
                )
                this.canvasToolbar.css("left", this.canvasWidth - parseInt(this.canvasToolbar.css("width"), 10) - this.TOOLBAR_PADDING);
            }
        },
        canvasFullscreen(){
            let elem = this.myp5.canvas;

            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            }
            else if (elem.webkitRequestFullscreen) { /* Safari */
                elem.webkitRequestFullscreen();
            }
            else if (elem.msRequestFullscreen) { /* IE11 */
                elem.msRequestFullscreen();
            }

            this.canvasResize(window.screen.width, window.screen.height)
        },
        getEventLocation(e) {
            if (e.touches && e.touches.length == 1) {
                return { x: e.touches[0].clientX, y: e.touches[0].clientY }
            }
            else if (e.clientX && e.clientY) {
                return { x: e.clientX, y: e.clientY }
            }
        },
        onPointerDown(e) {
            this.isDragging = true
            this.dragStart.x = this.getEventLocation(e).x / this.canvasZoom - this.cameraOffset.x
            this.dragStart.y = this.getEventLocation(e).y / this.canvasZoom - this.cameraOffset.y
        },
        onPointerUp(e) {
            this.isDragging = false
        },
        onPointerMove(e) {
            if (this.isDragging) {
                this.cameraOffset.x = this.getEventLocation(e).x / this.canvasZoom - this.dragStart.x
                this.cameraOffset.y = this.getEventLocation(e).y / this.canvasZoom - this.dragStart.y
                this.drawOnce();
            }
        },
        handleTouch(e, singleTouchHandler) {
            if (e.touches.length == 1) {
                singleTouchHandler(e)
            }
            else if (e.type == "touchmove" && e.touches.length == 2) {
                this.isDragging = false
            }
        },
        adjustZoom(zoomAmount, zoomFactor) {
            if (!this.isDragging) {
                if (zoomAmount) {
                    this.canvasZoom = Number(this.canvasZoom) - zoomAmount;
                }
                else if (zoomFactor) {
                    this.canvasZoom = zoomFactor * lastZoom
                }
                this.canvasZoom = Clamp(this.canvasZoom, 0.1, 5);
                this.drawOnce();
            }
        },
        addPreset(prefix, data){
            let name = prefix;
            let count = 1;
            while (name in this.presets.local){
                name = `${prefix} (${count})`;
                count++;
            }

            this.presets.local[name] = JSON.parse(JSON.stringify(data));
            localStorage.setItem("presets", JSON.stringify(this.presets.local));
        },
        addCurrentPreset(){
            let name = $("#saveCurrentNameInput").val();
            if (name == ""){
                name = $("#saveCurrentNameInput").attr("placeholder");
            }

            this.addPreset(name, this.DPs.map((i) => i.data));
        },
        importPreset(e){
            e.target.files.forEach((file) => {
                let filename = file.name.slice(0, -5);

                const reader = new FileReader();
                reader.onload = (event) => {
                    this.addPreset(filename, JSON.parse(event.target.result));
                }
                reader.readAsText(file);
            })
        },
        exportPreset(name, data){
            let dataStr = JSON.stringify(data, null, 2);
            let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

            let linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', name + ".json");
            linkElement.click();
        },
        deletePreset(name, data){
            if (this.selectedPreset == data){
                this.selectedPreset = null;
            }

            delete this.presets.local[name];
            localStorage.setItem("presets", JSON.stringify(this.presets.local));
        },
        selectPreset(e, publicLocal, name){
            $("#presetSelection button").removeClass("active");
            e.target.classList.add("active");

            this.selectedPreset = this.presets[publicLocal][name];
        },
        isDPValid(data){
            let bobFields = ["length", "mass", "angle", "velocity", "radius", "color", "lineWeight", "lineColor"];
            return (
                "simSpeed" in data &&
                "g" in data &&
                "compound" in data &&
                "origin" in data &&
                "x" in data.origin &&
                "y" in data.origin &&
                "radius" in data.origin &&
                "color" in data.origin &&
                "bob1" in data &&
                "bob2" in data &&
                bobFields.every((f) => {return (f in data.bob1 && f in data.bob2)}) &&
                "hidden" in data
            );
        },
        loadPreset(clear = true){
            let settings = this.selectedPreset;

            let ids = [];
            settings.forEach((data, index) => {
                if (!this.isDPValid(data)){
                    ids.push(index);
                }
            })
            if (ids.length){
                alert(`Invalid data!\n(ids: ${ids})`);
            }
            else{
                let len;
                if (clear){
                    len = this.DPs.length;
                    this.DPs.length = 0;
                }
                for (const data of settings) {
                    this.DPs.push(new DP(data));
                }

                this.$nextTick(() => {
                    if (len){
                        const n = Math.min(len, settings.length);
                        for (let i = 0; i < n; i++){
                            this.$refs.doublePendulums[i].updateColorInputs();
                        }
                    }
                })

                this.drawOnce();
            }
        },
        clearPresetModal(){
            $("#presetSelection button").removeClass("active");
            this.selectedPreset = null;
            $("#saveCurrentNameInput").val("");
        },
    },
    components: {
        DoublePendulum,
    }
});

app.mount('#app');

