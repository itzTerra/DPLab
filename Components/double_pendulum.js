export var DoublePendulum = {
    props: ["dp", "index"],
    template: `
      <div class="accordion-item bg-surface1 text-light" :id="'dp'+index">
        <h2 class="accordion-header d-flex" :id="'heading'+index">
          <label :for="'globalColor'+index" class="d-flex bg-secondary" title="Choose global color" style="cursor: pointer;">
            <svg width="38" height="38" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"
              style="border: 2px solid #121212; flex: 0 0 auto;">
              <g class="layer">
                <path d="m0,0c0,0 167,0 167,0l-167,302l0,-302z" :fill="dp.data.origin.color" stroke-width="0"/>
                <path d="m167,0c73.33,0 152.67,0 226,0l-282,512l-111,0l0,-210l167,-302z" :fill="dp.data.bob1.color" stroke-width="0"/>
                <path d="m393,0l-282,512l401,0c0,-170.67 0,-341.33 0,-512l-119,0z" :fill="dp.data.bob2.color" stroke-width="0"/>
                <line fill="none" :stroke="dp.data.bob1.lineColor" stroke-linecap="round" :stroke-width="50" transform="matrix(1 0 0 1 0 0)" x1="250" x2="-70" y1="-150" y2="430"/>
                <line fill="none" :stroke="dp.data.bob2.lineColor" stroke-linecap="round" :stroke-width="50" transform="matrix(1 0 0 1 0 0)" x1="400" x2="80" y1="-10" y2="570"/>
              </g>
              <g v-if="dp.data.hidden" class="layer">
                <rect fill="#000000" fill-opacity="0.7" height="512" width="512" x="0" y="0"/>
                <path d="m378.68,330.16c38.91,-34.79 60.42,-74.16 60.42,-74.16s-68.67,-125.89 -183.11,-125.89a160.91,160.91 0 0 0 -63.86,13.51l17.63,17.63a135.96,135.96 0 0 1 46.24,-8.24c48.52,0 88.81,26.78 118.33,56.3a300.53,300.53 0 0 1 37.99,46.7c-1.37,2.06 -2.75,4.12 -4.58,6.64c-7.55,10.99 -19,25.64 -33.42,40.06c-3.89,3.89 -7.78,7.55 -11.9,11.22l16.25,16.25l0.01,-0.01z" fill="#ffffff"/>
                <path d="m331.53,283.01a80.11,80.11 0 0 0 -102.54,-102.54l19,19a57.23,57.23 0 0 1 64.78,64.55l18.77,19l-0.01,-0.01zm-67.52,29.53l19,19a80.11,80.11 0 0 1 -102.54,-102.54l19,19a57.23,57.23 0 0 0 64.55,64.78l0,-0.23l-0.01,-0.01z" fill="#ffffff"/>
                <path d="m149.57,198.09c-4.12,3.66 -8.01,7.32 -11.9,11.22a300.53,300.53 0 0 0 -37.99,46.7l4.58,6.64c7.55,10.99 19,25.64 33.42,40.06c29.53,29.53 69.81,56.3 118.33,56.3c16.48,0 31.82,-2.98 46.24,-8.24l17.63,17.63a160.91,160.91 0 0 1 -63.86,13.51c-114.44,0 -183.11,-125.89 -183.11,-125.89s21.52,-39.37 60.42,-74.16l16.25,16.25l-0.01,-0.01zm235.76,203.25l-274.67,-274.67l16.02,-16.02l274.67,274.67l-16.02,16.02z" fill="#ffffff"/>
              </g>
            </svg>
            <input :data-color="dp.data.bob2.color" @input="$emit('drawOnce')" type="color" class="btn-check" :id="'globalColor'+index" autocomplete="off">
          </label>
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse'+index" aria-expanded="false" :aria-controls="'collapse'+index">
            DP {{index+1}}
            <div class="dp-hidden" :style="{'display': dp.data.hidden ? 'block' : 'none'}"></div>
          </button>
          <label :for="'selectDP'+index" class="d-flex bg-secondary" style="line-height: 0; padding: 0 0.75rem;">
            <input v-model="dp.checked" class="form-check-input" type="checkbox" :id="'selectDP'+index">
          </label>
        </h2>
        <div :id="'collapse'+index" class="accordion-collapse collapse" :aria-labelledby="'heading'+index">
          <div class="accordion-body">
            <div class="d-flex flex-column gap-2">
              <div class="simSpeedDampingGrid">
                <div class="g-simSpeed">
                  <label :id="'simSpeedLabel'+index" class="text-nowrap">Sim. Speed</label>
                </div>
                <div class="g-simSpeed1">
                  <input v-model.number="dp.data.simSpeed" @input="() => dp.inputs.simSpeed = dp.data.simSpeed" type="range" class="form-range" min="0" max="10" step="0.05" :aria-labelledby="'simSpeedLabel'+index">
                </div>
                <div class="g-simSpeed2">
                  <input :value="dp.inputs.simSpeed" @input="ValidateInput" @focusout="(e) => ValidateInput(e, false)" name="simSpeed" type="number" min="0" max="10" step="any" class="form-control form-control-sm" :aria-labelledby="'simSpeedLabel'+index">
                </div>
                <div class="g-damping">
                  <label :id="'dampingLabel'+index">Damping</label>
                </div>
                <div class="g-damping1">
                  <input v-model.number="dp.data.damping" @input="() => dp.inputs.damping = dp.data.damping" type="range" min="-0.9" max="0.9" step="0.01" class="form-range" :aria-labelledby="'dampingLabel'+index">
                </div>
                <div class="g-damping2">
                  <input :value="dp.inputs.damping" @input="ValidateInput" @focusout="(e) => ValidateInput(e, false)" name="damping" type="number" min="-0.9" max="0.9" step="any" class="form-control form-control-sm" :aria-labelledby="'dampingLabel'+index">
                </div>
              </div>
              <div class="row align-items-center">
                <div class="col">
                  <div class="d-flex gap-2 align-items-center">
                    <label :for="'gravityInput'+index" class="col-form-label">Gravity</label>
                    <input v-model="dp.data.g" @focusout="(e) => ValidateInput(e, false)" name="g" data-default-val="0" type="number" :id="'gravityInput'+index" step="any" class="form-control form-control-sm">
                  </div>
                </div>
                <div class="col">
                  <div class="form-check form-switch">
                    <label class="form-check-label abbr" :for="'compoundSwitch'+index" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-html="true" 
                      title="<p class='text-center text-warning mb-1'><i class='bi bi-exclamation-triangle'></i> UNSTABLE <i class='bi bi-exclamation-triangle'></p></i>Mass is distributed along rod's length, not in bob">
                      Compound<sup><i class="bi bi-question"></i></sup>
                    </label>
                    <input v-model="dp.data.compound" class="form-check-input" type="checkbox" role="switch" :id="'compoundSwitch'+index">
                  </div>
                </div>
              </div>
            </div>
            <hr>
            <div class="row align-items-center">
              <div class="col-auto"><strong>Origin</strong></div>
              <div class="col">
                <div class="grid-4cols">
                  <div class="g-label1">
                    <label :for="'oxInput'+index" class="col-form-label">X</label>
                  </div>
                  <div class="g-val1">
                    <input :value="dp.inputs.ox" @input="ValidateInput" @focusout="(e) => ValidateInput(e, false)" name="ox" data-default-val="0" type="number" :id="'oxInput'+index" class="form-control form-control-sm">
                  </div>
                  <div class="g-label2">
                    <label :for="'oyInput'+index" class="col-form-label">Y</label>
                  </div>
                  <div class="g-val2">
                    <input :value="dp.inputs.oy" @input="ValidateInput" @focusout="(e) => ValidateInput(e, false)" name="oy" data-default-val="-150" type="number" :id="'oyInput'+index" class="form-control form-control-sm">
                  </div>
                </div>
              </div>
            </div>
            <div class="grid-4cols mt-1">
              <div class="g-label1">
                <label :for="'orInput'+index" class="col-form-label">Radius</label>
              </div>
              <div class="g-val1">
                <input :value="dp.inputs.or" @input="ValidateInput" @focusout="(e) => ValidateInput(e, false)" name="or" type="number" :id="'orInput'+index" min="0" class="form-control form-control-sm">
              </div>
              <div class="g-label2">
                <label :for="'ocInput'+index" class="col-form-label">Color</label>
              </div>
              <div class="g-val2">
                <input name="oc" :data-color="dp.data.origin.color" @input="$emit('drawOnce')" type="color" class="form-control form-control-sm form-control-color" :id="'ocInput'+index" title="Choose color">
              </div>
            </div>
            <div class="bobsGrid mt-2">
              <div class="g-part1"><strong>Part 1</strong></div>
              <div class="g-part2"><strong>Part 2</strong></div>
              <div class="g-l">
                <label :id="'lengthLabel'+index">Length</label>
              </div>
              <div class="g-m">
                <label :id="'massLabel'+index">Mass</label>
              </div>
              <div class="g-a">
                <label :id="'angleLabel'+index">Angle <small>(&nbsp;°)</small></label>
              </div>
              <div class="g-v">
                <label :id="'velocityLabel'+index">Velocity</label>
              </div>
              <div class="g-bob">
                <label :id="'bobLabel'+index" class="abbr" data-bs-toggle="tooltip" data-bs-placement="left" title="Radius | Color">
                  Bob<sup><i class="bi bi-question"></i></sup>
                </label>
              </div>
              <div class="g-rod">
                <label :id="'rodLabel'+index" class="abbr" data-bs-toggle="tooltip" data-bs-placement="left" title="Width | Color">
                  Rod<sup><i class="bi bi-question"></i></sup>
                </label>
              </div>
              <div class="g-trail">
                <label :id="'trailLabel'+index" class="abbr" data-bs-toggle="tooltip" data-bs-placement="left" title="Width | Color">
                  Trail<sup><i class="bi bi-question"></i></sup>
                </label>
              </div>
              <div class="g-tl">
                <label :id="'trailLengthLabel'+index" class="abbr" data-bs-toggle="tooltip" data-bs-placement="left" title="-1 for infinite">
                  Trail Length<sup><i class="bi bi-question"></i></sup>
                </label>
              </div>
              <div class="g-l1">
                <input :value="dp.inputs.l1" @input="ValidateInput" @focusout="(e) => ValidateInput(e, false)" name="l1" type="number" min="0.001" step="any" class="form-control form-control-sm" :aria-labelledby="'lengthLabel'+index">
              </div>
              <div class="g-l2">
                <input :value="dp.inputs.l2" @input="ValidateInput" @focusout="(e) => ValidateInput(e, false)" name="l2" type="number" min="0.001" step="any" class="form-control form-control-sm" :aria-labelledby="'lengthLabel'+index">
              </div>
              <div class="g-m1">
                <input :value="dp.inputs.m1" @input="ValidateInput" @focusout="(e) => ValidateInput(e, false)" name="m1" type="number" min="0.001" step="any" class="form-control form-control-sm" :aria-labelledby="'massLabel'+index">
              </div>
              <div class="g-m2">
                <input :value="dp.inputs.m2" @input="ValidateInput" @focusout="(e) => ValidateInput(e, false)" name="m2" type="number" :min="dp.compound ? 0.000001 : 0" step="any" class="form-control form-control-sm" :aria-labelledby="'massLabel'+index">
              </div>
              <div class="g-a1">
                <input :value="dp.data.bob1.angle" @input="ValidateInput" @focusin="dp.paused = true" @focusout="(e) => {ValidateInput(e, false); dp.paused = false}" name="a1" data-default-val="0" type="number" step="any" class="form-control form-control-sm no-spinner" :aria-labelledby="'angleLabel'+index">
              </div>
              <div class="g-a2">
                <input :value="dp.data.bob2.angle" @input="ValidateInput" @focusin="dp.paused = true" @focusout="(e) => {ValidateInput(e, false); dp.paused = false}" name="a2" data-default-val="0" type="number" step="any" class="form-control form-control-sm no-spinner" :aria-labelledby="'angleLabel'+index">
              </div>
              <div class="g-v1">
                <input :value="dp.data.bob1.velocity" @input="ValidateInput" @focusin="dp.paused = true" @focusout="(e) => {ValidateInput(e, false); dp.paused = false}" name="v1" data-default-val="0" type="number" step="any" class="form-control form-control-sm no-spinner" :aria-labelledby="'velocityLabel'+index">
              </div>
              <div class="g-v2">
                <input :value="dp.data.bob2.velocity" @input="ValidateInput" @focusin="dp.paused = true" @focusout="(e) => {ValidateInput(e, false); dp.paused = false}" name="v2" data-default-val="0" type="number" step="any" class="form-control form-control-sm no-spinner" :aria-labelledby="'velocityLabel'+index">
              </div>
              <div class="g-r1">
                <input :value="dp.inputs.r1" @input="ValidateInput" @focusout="(e) => ValidateInput(e, false)" name="r1" type="number" min="0" class="form-control form-control-sm" :aria-labelledby="'bobLabel'+index">
              </div>
              <div class="g-r2">
                <input :value="dp.inputs.r2" @input="ValidateInput" @focusout="(e) => ValidateInput(e, false)" name="r2" type="number" min="0" class="form-control form-control-sm" :aria-labelledby="'bobLabel'+index">
              </div>
              <div class="g-c1">
                <input name="c1" :data-color="dp.data.bob1.color" @input="$emit('drawOnce')" type="color" class="form-control form-control-sm form-control-color" title="Choose color" :aria-labelledby="'bobLabel'+index">
              </div>
              <div class="g-c2">
                <input name="c2" :data-color="dp.data.bob2.color" @input="$emit('drawOnce')" type="color" class="form-control form-control-sm form-control-color" title="Choose color" :aria-labelledby="'bobLabel'+index">
              </div>
              <div class="g-lw1">
                <input :value="dp.inputs.lw1" @input="ValidateInput" @focusout="(e) => ValidateInput(e, false)" name="lw1" type="number" min="0" class="form-control form-control-sm" :aria-labelledby="'rodLabel'+index">
              </div>
              <div class="g-lw2">
                <input :value="dp.inputs.lw2" @input="ValidateInput" @focusout="(e) => ValidateInput(e, false)" name="lw2" type="number" min="0" class="form-control form-control-sm" :aria-labelledby="'rodLabel'+index">
              </div>
              <div class="g-lc1">
                <input name="lc1" :data-color="dp.data.bob1.lineColor" @input="$emit('drawOnce')" type="color" class="form-control form-control-sm form-control-color" title="Choose color" :aria-labelledby="'rodLabel'+index">
              </div>
              <div class="g-lc2">
                <input name="lc2" :data-color="dp.data.bob2.lineColor" @input="$emit('drawOnce')" type="color" class="form-control form-control-sm form-control-color" title="Choose color" :aria-labelledby="'rodLabel'+index">
              </div>
              <div class="g-tw1">
                <input :value="dp.inputs.tw1" @input="ValidateInput" @focusout="(e) => ValidateInput(e, false)" name="tw1" type="number" min="0" class="form-control form-control-sm" :aria-labelledby="'trailLabel'+index">
              </div>
              <div class="g-tw2">
                <input :value="dp.inputs.tw2" @input="ValidateInput" @focusout="(e) => ValidateInput(e, false)" name="tw2" type="number" min="0" class="form-control form-control-sm" :aria-labelledby="'trailLabel'+index">
              </div>
              <div class="g-tc1">
                <input name="tc1" :data-color="dp.data.bob1.trailColor" @input="$emit('drawOnce')" type="color" class="form-control form-control-sm form-control-color" title="Choose color" :aria-labelledby="'trailLabel'+index">
              </div>
              <div class="g-tc2">
                <input name="tc2" :data-color="dp.data.bob2.trailColor" @input="$emit('drawOnce')" type="color" class="form-control form-control-sm form-control-color" title="Choose color" :aria-labelledby="'trailLabel'+index">
              </div>
              <div class="g-tl1">
                <input :value="dp.inputs.tl1" @input="ValidateInput" @focusout="(e) => ValidateInput(e, false)" name="tl1" type="number" min="-1" class="form-control form-control-sm" :aria-labelledby="'trailLengthLabel'+index">
              </div>
              <div class="g-tl2">
                <input :value="dp.inputs.tl2" @input="ValidateInput" @focusout="(e) => ValidateInput(e, false)" name="tl2" type="number" min="-1" class="form-control form-control-sm" :aria-labelledby="'trailLengthLabel'+index">
              </div>
            </div>
          </div>
        </div>
      </div>
      `,
    mounted(){
        let tt;
        $(`#dp${this.index} [data-bs-toggle="tooltip"]`).each(function(){
            tt = new bootstrap.Tooltip($(this));
        })

        $(`#dp${this.index} .accordion-header input[type='color']`).spectrum({
            type: "color",
            showPalette: false,
            showInput: true,
            allowEmpty: false,
            clickoutFiresChange: false,
            preferredFormat: "rgb",
            containerClassName: 'bg-dark',
            replacerClassName: "hidden",
            change: (color) => {
                this.updateGlobalColor(color.toRgbString());
                this.$emit("drawOnce");
            }
        });

        $(`#dp${this.index} .accordion-body input[type='color']`).spectrum(COLOR_INPUT_SETTINGS);
        $(`#dp${this.index} .accordion-body input[type='color']`).on("move.spectrum", (e, color) => {
            this.updateColor(e.target.name, color.toRgbString());
        })
    },
    methods:{
        updateGlobalColor(color){
            this.dp.data.origin.color = color;
            this.dp.data.bob1.color = color;
            this.dp.data.bob2.color = color;
            this.dp.data.bob1.lineColor = color;
            this.dp.data.bob2.lineColor = color;
            this.dp.data.bob1.lineColor = color;
            this.dp.data.bob1.trailColor = color;
            this.dp.data.bob2.trailColor = color;
            this.updateColorInputs();
        },
        updateColor(inputName, color){
            if (inputName == "oc"){
                this.dp.data.origin.color = color;
            }
            else if (inputName == "c1"){
                this.dp.data.bob1.color = color;
            }
            else if (inputName == "c2"){
                this.dp.data.bob2.color = color;
            }
            else if (inputName == "lc1"){
                this.dp.data.bob1.lineColor = color;
            }
            else if (inputName == "lc2"){
                this.dp.data.bob2.lineColor = color;
            }
            else if (inputName == "tc1"){
                this.dp.data.bob1.trailColor = color;
            }
            else if (inputName == "tc2"){
                this.dp.data.bob2.trailColor = color;
            }
        },
        updateColorInputs(){
            let colors = [
                this.dp.data.origin.color, this.dp.data.bob1.color, this.dp.data.bob2.color, 
                this.dp.data.bob1.lineColor, this.dp.data.bob2.lineColor,
                this.dp.data.bob1.trailColor, this.dp.data.bob2.trailColor];
            $(`#dp${this.index} .accordion-body input[type='color']`).each(function(i){
                $(this).spectrum("set", colors[i]);
            })
        },
        ValidateInput(event, validate = true){
            let propName = event.target.getAttribute('name');
            let min = event.target.getAttribute('min');
            let max = event.target.getAttribute('max');
            let val = event.target.value;
            if (val != ""){
                val = Number(event.target.value);
            }
            let defaultVal = event.target.getAttribute('data-default-val');

            let valid;
            if (validate){
                valid = (val !== "") && (min === null || val >= min) && (max === null || val <= max);
            }
            else if (val == "" && defaultVal){
                val = Number(defaultVal);
            }
            else{
                if (min !== null){
                    val = Math.max(min, val);
                }
                if (max !== null){
                    val = Math.min(max, val);
                }
            }
            if (propName == "simSpeed"){
                this.dp.inputs.simSpeed = val;
                if (!validate || valid){
                    this.dp.data.simSpeed = val;
                }
            }
            else if (propName == "damping"){
                this.dp.inputs.damping = val;
                if (!validate || valid){
                    this.dp.data.damping = val;
                }
            }
            else if (propName == "g"){
                this.dp.data.g = val;
            }
            else if (propName == "ox"){
                this.dp.inputs.ox = val;
                if (!validate || valid){
                    this.dp.data.origin.x = val;
                    this.$emit("drawOnce");
                }
            }
            else if (propName == "oy"){
                this.dp.inputs.oy = val;
                if (!validate || valid){
                    this.dp.data.origin.y = val;
                    this.$emit("drawOnce");
                }
            }
            else if (propName == "or"){
                this.dp.inputs.or = val;
                if (!validate || valid){
                    this.dp.data.origin.radius = val;
                    this.$emit("drawOnce");
                }
            }
            else if (propName == "l1"){
                this.dp.inputs.l1 = val;
                if (!validate || valid){
                    this.dp.data.bob1.length = val;
                    this.$emit("drawOnce");
                }
            }
            else if (propName == "m1"){
                this.dp.inputs.m1 = val;
                if (!validate || valid){
                    this.dp.data.bob1.mass = val;
                }
            }
            else if (propName == "a1"){
                this.dp.data.bob1.angle = val;
                if (!validate || valid){
                    this.dp.x[0] = (val % 360) / 180 * Math.PI;
                    this.$emit("drawOnce");
                }
            }
            else if (propName == "v1"){
                this.dp.data.bob1.velocity = val;
                if (!validate || valid){
                    this.dp.x[1] = val;
                }
            }
            else if (propName == "r1"){
                this.dp.inputs.r1 = val;
                if (!validate || valid){
                    this.dp.data.bob1.radius = val;
                }
                this.$emit("drawOnce");
            }
            else if (propName == "lw1"){
                this.dp.inputs.lw1 = val;
                if (!validate || valid){
                    this.dp.data.bob1.lineWeight = val;
                }
                this.$emit("drawOnce");
            }
            else if (propName == "tw1"){
                this.dp.inputs.tw1 = val;
                if (!validate || valid){
                    this.dp.data.bob1.trailWeight = val;
                }
                this.$emit("drawOnce");
            }
            else if (propName == "tl1"){
                this.dp.inputs.tl1 = val;
                if (!validate || valid){
                    this.dp.data.bob1.trailLen = val;
                }
                this.$emit("drawOnce");
            }
            else if (propName == "l2"){
                this.dp.inputs.l2 = val
                if (!validate || valid){
                    this.dp.data.bob2.length = val;
                    this.$emit("drawOnce");
                }
            }
            else if (propName == "m2"){
                this.dp.inputs.m2 = val;
                if (!validate || valid){
                    this.dp.data.bob2.mass = val;
                }
            }
            else if (propName == "a2"){
                this.dp.data.bob2.angle = val;
                if (!validate || valid){
                    this.dp.x[2] = (val % 360) / 180 * Math.PI;
                    this.$emit("drawOnce");
                }
            }
            else if (propName == "v2"){
                this.dp.data.bob2.velocity = val;
                if (!validate || valid){
                    this.dp.x[3] = val;
                }
            }
            else if (propName == "r2"){
                this.dp.inputs.r2 = val;
                if (!validate || valid){
                    this.dp.data.bob2.radius = val;
                }
                this.$emit("drawOnce");
            }
            else if (propName == "lw2"){
                this.dp.inputs.lw2 = val;
                if (!validate || valid){
                    this.dp.data.bob2.lineWeight = val;
                }
                this.$emit("drawOnce");
            }
            else if (propName == "tw2"){
                this.dp.inputs.tw2 = val;
                if (!validate || valid){
                    this.dp.data.bob2.trailWeight = val;
                }
                this.$emit("drawOnce");
            }
            else if (propName == "tl2"){
                this.dp.inputs.tl2 = val;
                if (!validate || valid){
                    this.dp.data.bob2.trailLen = val;
                }
                this.$emit("drawOnce");
            }
        },
    }
}