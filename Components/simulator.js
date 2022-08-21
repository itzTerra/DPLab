import { DoublePendulum } from "./double_pendulum.js"

export var Simulator = {
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
    template: `
      <div class="container-fluid container-lg text-bg-dark rounded-bottom p-3">
        <div style="position: relative;">
          <h2 class="display-4 text-md-center">Double Pendulum Lab</h2>
          <button @click="clearPresetModal" data-bs-toggle="modal" data-bs-target="#presetModal" type="button" class="btn btn-info btn-lg presetsBtn"><i class="bi bi-folder"></i> Presets</button>
        </div>
        
        <div class="modal fade" id="presetModal" tabindex="-1" aria-labelledby="modalTitle" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="modalTitle">Settings Presets</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div class="bg-surface1 d-flex flex-column gap-2 p-3" id="presetSelection">
                  <span class="h6">Public</span>
                  <div class="list-group">
                    <button v-for="(data, name) in presets.public" @click="(e) => selectPreset(e, 'public', name)" type="button" class="list-group-item list-group-item-action">
                      {{name}}
                    </button>
                  </div>
                  <span class="h6">Saved in your Browser</span>
                  <div class="list-group">
                    <div v-for="(data, name) in presets.local" class="btn-group" role="group">
                      <button @click="(e) => selectPreset(e, 'local', name)" type="button" class="list-group-item list-group-item-action">
                        {{name}}
                      </button>
                      <button @click="() => exportPreset(name, data)" type="button" class="btn btn-warning btn-sm" title="Export"><i class="bi bi-download"></i></button>
                      <button @click="() => deletePreset(name, data)" type="button" class="btn btn-danger btn-sm" title="Delete"><i class="bi bi-trash"></i></button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer justify-content-between">
                <div class="d-flex align-items-center gap-3">
                  <div>
                    <label for="saveCurrentNameInput" class="form-label">Save current settings as...</label>
                    <div class="input-group">
                      <input placeholder="My Preset" type="text" class="form-control form-control-sm" id="saveCurrentNameInput">
                      <button @click="addCurrentPreset" type="button" class="btn btn-success btn-sm">Save</button>
                    </div>
                  </div>
                  <i class="bi bi-slash-lg"></i>
                  <input @change="importPreset" @click="(e) => e.target.value = null" class="btn-check" type="file" accept=".json" id="importPresetInput" multiple>
                  <label class="btn btn-warning" for="importPresetInput">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-filetype-json" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM4.151 15.29a1.176 1.176 0 0 1-.111-.449h.764a.578.578 0 0 0 .255.384c.07.049.154.087.25.114.095.028.201.041.319.041.164 0 .301-.023.413-.07a.559.559 0 0 0 .255-.193.507.507 0 0 0 .084-.29.387.387 0 0 0-.152-.326c-.101-.08-.256-.144-.463-.193l-.618-.143a1.72 1.72 0 0 1-.539-.214 1.001 1.001 0 0 1-.352-.367 1.068 1.068 0 0 1-.123-.524c0-.244.064-.457.19-.639.128-.181.304-.322.528-.422.225-.1.484-.149.777-.149.304 0 .564.05.779.152.217.102.384.239.5.41.12.17.186.359.2.566h-.75a.56.56 0 0 0-.12-.258.624.624 0 0 0-.246-.181.923.923 0 0 0-.37-.068c-.216 0-.387.05-.512.152a.472.472 0 0 0-.185.384c0 .121.048.22.144.3a.97.97 0 0 0 .404.175l.621.143c.217.05.406.12.566.211a1 1 0 0 1 .375.358c.09.148.135.335.135.56 0 .247-.063.466-.188.656a1.216 1.216 0 0 1-.539.439c-.234.105-.52.158-.858.158-.254 0-.476-.03-.665-.09a1.404 1.404 0 0 1-.478-.252 1.13 1.13 0 0 1-.29-.375Zm-3.104-.033a1.32 1.32 0 0 1-.082-.466h.764a.576.576 0 0 0 .074.27.499.499 0 0 0 .454.246c.19 0 .33-.055.422-.164.091-.11.137-.265.137-.466v-2.745h.791v2.725c0 .44-.119.774-.357 1.005-.237.23-.565.345-.985.345a1.59 1.59 0 0 1-.568-.094 1.145 1.145 0 0 1-.407-.266 1.14 1.14 0 0 1-.243-.39Zm9.091-1.585v.522c0 .256-.039.47-.117.641a.862.862 0 0 1-.322.387.877.877 0 0 1-.47.126.883.883 0 0 1-.47-.126.87.87 0 0 1-.32-.387 1.55 1.55 0 0 1-.117-.641v-.522c0-.258.039-.471.117-.641a.87.87 0 0 1 .32-.387.868.868 0 0 1 .47-.129c.177 0 .333.043.47.129a.862.862 0 0 1 .322.387c.078.17.117.383.117.641Zm.803.519v-.513c0-.377-.069-.701-.205-.973a1.46 1.46 0 0 0-.59-.63c-.253-.146-.559-.22-.916-.22-.356 0-.662.074-.92.22a1.441 1.441 0 0 0-.589.628c-.137.271-.205.596-.205.975v.513c0 .375.068.699.205.973.137.271.333.48.589.626.258.145.564.217.92.217.357 0 .663-.072.917-.217.256-.146.452-.355.589-.626.136-.274.205-.598.205-.973Zm1.29-.935v2.675h-.746v-3.999h.662l1.752 2.66h.032v-2.66h.75v4h-.656l-1.761-2.676h-.032Z"/>
                    </svg>
                    Import
                  </label>
                </div>
                <div class="vr"></div>
                <div class="btn-group-vertical" role="group" aria-label="Vertical button group">
                  <button @click="loadPreset" :disabled="selectedPreset === null" data-bs-dismiss="modal" type="button" class="btn btn-primary">Load</button>
                  <button @click="loadPreset(false)" :disabled="selectedPreset === null" data-bs-dismiss="modal" type="button" class="btn btn-secondary btn-sm">Add to current</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="d-flex flex-wrap flex-lg-nowrap justify-content-center mt-3">
          <div style="position: relative;">
            <div id="p5"></div>
            <div id="canvasToolbar" class="d-flex justify-content-end align-items-center gap-3">
              <div class="col-auto">
                <svg @click="canvasFullscreen" xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-arrows-fullscreen fullscreenBtn" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707zm0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707zm-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707z"/>
                </svg>
              </div>
              <div class="col-auto">
                <input :data-color="canvasColor" type="color" class="form-control form-control-sm form-control-color canvasColorInput" title="Choose color" aria-label="Canvas BG color input">
              </div>
              <div class="col-auto">
                <div class="d-flex gap-1">
                  <div class="col-auto">
                    <i class="bi bi-zoom-in me-1"></i>
                  </div>
                  <div class="col-auto">
                    <input v-model.number="canvasZoom" @input="drawOnce" type="range" class="form-range" min="0.1" max="5" step="0.05">
                  </div>
                </div>
              </div>
              <div class="col-auto">  
                <button class='playpause' @click="playPause"></button>
              </div>
            </div> 
          </div>
          <div class="ms-auto" id="settings">
            <div class="btn-toolbar" role="toolbar" aria-label="Settings Toolbar">
              <button @click="addDP" type="button" class="btn btn-success" style="border-bottom-left-radius: 0;">Add DP</button>
              <div class="btn-group ms-auto" role="group">
                <div class="btn-group" role="group">
                  <button class="btn btn-primary dropdown-toggle" type="button" id="manageSelectedButton" data-bs-toggle="dropdown" aria-expanded="false">
                    Manage Selected
                  </button>
                  <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="manageSelectedButton">
                    <li><button @click="() => showHideSelected(false)" type="button" class="dropdown-item d-flex justify-content-between">
                      Show <i class="bi bi-eye"></i>
                    </button></li>
                    <li><button @click="() => showHideSelected(true)" type="button" class="dropdown-item d-flex justify-content-between">
                      Hide <i class="bi bi-eye-slash"></i>
                    </button></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><button data-bs-toggle="offcanvas" data-bs-target="#editOffcanvas" type="button" class="dropdown-item d-flex justify-content-between">
                      Multi-Edit <i class="bi bi-pencil-square"></i>
                    </button></li>
                    <li><button @click.stop="duplicateSelected" type="button" class="dropdown-item d-flex justify-content-between">
                      Duplicate <i class="bi bi-front"></i>
                    </button></li>
                    <li><button @click="deleteSelected" type="button" class="dropdown-item d-flex justify-content-between">
                      Delete <i class="bi bi-trash"></i>
                    </button></li>
                  </ul>
                </div>
                <label class="btn btn-secondary d-flex" for="selectAllCheck" style="border-bottom-right-radius: 0;">
                  <span>Select all</span>
                  <input @input="selectAll" type="checkbox" class="form-check-input ms-2" id="selectAllCheck">
                </label>
              </div>
            </div>

            <div class="accordion accordion-flush" id="dpAccordion">
              <DoublePendulum v-for="dp, i in DPs" :dp="dp" :index="i" @draw-once="drawOnce" ref="doublePendulums"></DoublePendulum>
            </div>

            <div class="offcanvas offcanvas-start text-bg-dark" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1" id="editOffcanvas" aria-labelledby="editOffcanvasLabel">
              <button class="btn btn-primary btn-sm offcanvas-btn d-flex gap-1" type="button" data-bs-toggle="offcanvas" data-bs-target="#editOffcanvas">
                <i class="bi bi-chevron-double-up offcanvas-btn-chevron"></i>
                EDIT
                <i class="bi bi-chevron-double-up offcanvas-btn-chevron"></i>
              </button>
              <div class="offcanvas-header">
                <h5 class="offcanvas-title text-truncate pe-2" id="editOffcanvasLabel">Multi-Edit {{getSelectedIDs()}}</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
              </div>
              <div class="offcanvas-body">
                <span class="fw-light">You can toggle fields that you do/don't want to change by clicking on their labels.</span>
                <div class="row g-2 align-items-center mt-2">
                  <div class="col-auto">
                    <label for="editDefaultValuesSelect">Get values from... </label>
                  </div>
                  <div class="col-auto">
                    <select @change="editSelectChange" class="form-select" id="editDefaultValuesSelect">
                      <option value="default" selected>Default</option>
                      <option v-for="dp, i in DPs" :value="i">DP {{i+1}}</option>
                    </select>
                  </div>
                  <div class="col-auto ms-auto">
                    <input @input="editToggleAll" type="checkbox" class="btn-check" id="editToggleAll" autocomplete="off">
                    <label class="btn btn-secondary" for="editToggleAll">Toggle All</label>
                  </div>
                </div>
                <form @submit.prevent="editSubmit">
                  <div class="p-3 bg-surface1 mt-2">
                    <div class="d-flex flex-column gap-2">
                      <div class="simSpeedDampingGrid">
                        <div class="g-simSpeed">
                          <label id="simSpeedEditLabel" class="text-nowrap">Sim. Speed</label>
                        </div>
                        <div class="g-simSpeed1">
                          <input v-model.number="editData.simSpeed" name="simSpeed" type="range" class="form-range" min="0" max="10" step="0.05" aria-labelledby="simSpeedEditLabel">
                        </div>
                        <div class="g-simSpeed2">
                          <input v-model.number="editData.simSpeed" name="simSpeed" type="number" placeholder="1" min="0" max="10" step="any" class="form-control form-control-sm" aria-labelledby="simSpeedEditLabel">
                        </div>
                        <div class="g-damping">
                          <label id="dampingEditLabel">Damping</label>
                        </div>
                        <div class="g-damping1">
                          <input v-model.number="editData.damping" name="damping" type="range" min="-0.9" max="0.9" step="0.01" class="form-range" aria-labelledby="dampingEditLabel">
                        </div>
                        <div class="g-damping2">
                          <input v-model.number="editData.damping" name="damping" type="number" placeholder="0" min="-0.9" max="0.9" step="any" class="form-control form-control-sm" aria-labelledby="dampingEditLabel">
                        </div>
                      </div>
                      <div class="row align-items-center">
                        <div class="col">
                          <div class="d-flex gap-2 align-items-center">
                            <label for="gravityInputEdit" class="col-form-label">Gravity</label>
                            <input v-model.number="editData.g" name="g" placeholder="0" type="number" id="gravityInputEdit" step="any" class="form-control form-control-sm">
                          </div>
                        </div>
                        <div class="col">
                          <div class="form-check form-switch">
                            <label class="form-check-label abbr" for="compoundSwitchEdit" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-html="true" 
                              title="<p class='text-center text-warning mb-1'><i class='bi bi-exclamation-triangle'></i> UNSTABLE <i class='bi bi-exclamation-triangle'></p></i>Mass is distributed along rod's length, not in bob">
                              Compound<sup><i class="bi bi-question"></i></sup>
                            </label>
                            <input v-model="editData.compound" name="compound" class="form-check-input" type="checkbox" role="switch" id="compoundSwitchEdit">
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
                            <label for="oxInputEdit" class="col-form-label">X</label>
                          </div>
                          <div class="g-val1">
                            <input v-model.number="editData.origin.x" name="ox" placeholder="0" type="number" id="oxInputEdit" class="form-control form-control-sm">
                          </div>
                          <div class="g-label2">
                            <label for="oyInputEdit" class="col-form-label">Y</label>
                          </div>
                          <div class="g-val2">
                            <input v-model.number="editData.origin.y" name="oy" placeholder="-150" type="number" id="oyInputEdit" class="form-control form-control-sm">
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="grid-4cols mt-1">
                      <div class="g-label1">
                        <label for="orInputEdit" class="col-form-label">Radius</label>
                      </div>
                      <div class="g-val1">
                        <input v-model.number="editData.origin.radius" name="or" placeholder="0" type="number" id="orInputEdit" min="0" class="form-control form-control-sm">
                      </div>
                      <div class="g-label2">
                        <label id="ocInputEditLabel" class="col-form-label">Color</label>
                      </div>
                      <div class="g-val2">
                        <input :data-color="editData.origin.color" name="oc" type="color" class="form-control form-control-sm form-control-color" aria-labelledby="ocInputEditLabel" title="Choose color">
                      </div>
                    </div>
                    <div class="bobsGrid mt-2">
                      <div class="g-part1"><strong>Part 1</strong></div>
                      <div class="g-part2"><strong>Part 2</strong></div>
                      <div class="g-l">
                        <label id="lengthLabelEdit">Length</label>
                      </div>
                      <div class="g-m">
                        <label id="massLabelEdit">Mass</label>
                      </div>
                      <div class="g-a">
                        <label id="angleLabelEdit">Angle <small>(&nbsp;°)</small></label>
                      </div>
                      <div class="g-v">
                        <label id="velocityLabelEdit">Velocity</label>
                      </div>
                      <div class="g-bob d-flex align-items-center">
                        <label id="bobLabelEdit" class="abbr" data-bs-toggle="tooltip" data-bs-placement="right" title="Radius | Color">
                          Bob<sup><i class="bi bi-question"></i></sup>
                        </label>
                        <div class="btn-group btn-group-sm ms-1" role="group">
                          <button class="btn btn-secondary btn-mini" name="bobLabelEditL">&lt;</button>
                          <button class="btn btn-secondary btn-mini" name="bobLabelEditR">&gt;</button>
                        </div>
                      </div>
                      <div class="g-rod d-flex align-items-center">
                        <label id="rodLabelEdit" class="abbr" data-bs-toggle="tooltip" data-bs-placement="right" title="Width | Color">
                          Rod<sup><i class="bi bi-question"></i></sup>
                        </label>
                        <div class="btn-group btn-group-sm ms-1" role="group">
                          <button class="btn btn-secondary btn-mini" name="rodLabelEditL">&lt;</button>
                          <button class="btn btn-secondary btn-mini" name="rodLabelEditR">&gt;</button>
                        </div>
                      </div>
                      <div class="g-trail d-flex align-items-center">
                        <label id="trailLabelEdit" class="abbr" data-bs-toggle="tooltip" data-bs-placement="right" title="Width | Color">
                          Trail<sup><i class="bi bi-question"></i></sup>
                        </label>
                        <div class="btn-group btn-group-sm ms-1" role="group">
                          <button class="btn btn-secondary btn-mini" name="trailLabelEditL">&lt;</button>
                          <button class="btn btn-secondary btn-mini" name="trailLabelEditR">&gt;</button>
                        </div>
                      </div>
                      <div class="g-tl">
                        <label id="trailLengthLabelEdit" class="abbr" data-bs-toggle="tooltip" data-bs-placement="right" title="-1 for infinite">
                          Trail Length<sup><i class="bi bi-question"></i></sup>
                        </label>
                      </div>
                      <div class="g-l1">
                        <input v-model.number="editData.bob1.length" name="l1" placeholder="0.001" type="number" min="0.001" step="any" class="form-control form-control-sm" aria-labelledby="lengthLabelEdit">
                      </div>
                      <div class="g-l2">
                        <input v-model.number="editData.bob2.length" name="l2" placeholder="0.001" type="number" min="0.001" step="any" class="form-control form-control-sm" aria-labelledby="lengthLabelEdit">
                      </div>
                      <div class="g-m1">
                        <input v-model.number="editData.bob1.mass" name="m1" placeholder="0.001" type="number" min="0.001" step="any" class="form-control form-control-sm" aria-labelledby="massLabelEdit">
                      </div>
                      <div class="g-m2">
                        <input v-model.number="editData.bob2.mass" name="m2" :placeholder="editData.compound ? 0.000001 : 0" type="number" :min="editData.compound ? 0.000001 : 0" step="any" class="form-control form-control-sm" aria-labelledby="massLabelEdit">
                      </div>
                      <div class="g-a1">
                        <input v-model.number="editData.bob1.angle" name="a1" placeholder="0" type="number" step="any" class="form-control form-control-sm no-spinner" aria-labelledby="angleLabelEdit">
                      </div>
                      <div class="g-a2">
                        <input v-model.number="editData.bob2.angle" name="a2" placeholder="0" type="number" step="any" class="form-control form-control-sm no-spinner" aria-labelledby="angleLabelEdit">
                      </div>
                      <div class="g-v1">
                        <input v-model.number="editData.bob1.velocity" name="v1" placeholder="0" type="number" step="any" class="form-control form-control-sm no-spinner" aria-labelledby="velocityLabelEdit">
                      </div>
                      <div class="g-v2">
                        <input v-model.number="editData.bob2.velocity" name="v2" placeholder="0" type="number" step="any" class="form-control form-control-sm no-spinner" aria-labelledby="velocityLabelEdit">
                      </div>
                      <div class="g-r1">
                        <input v-model.number="editData.bob1.radius" name="r1" placeholder="0" type="number" min="0" class="form-control form-control-sm" aria-labelledby="bobLabelEdit">
                      </div>
                      <div class="g-r2">
                        <input v-model.number="editData.bob2.radius" name="r2" placeholder="0" type="number" min="0" class="form-control form-control-sm" aria-labelledby="bobLabelEdit">
                      </div>
                      <div class="g-c1">
                        <input :data-color="editData.bob1.color" name="c1" type="color" class="form-control form-control-sm form-control-color" title="Choose color" aria-labelledby="bobLabelEdit">
                      </div>
                      <div class="g-c2">
                        <input :data-color="editData.bob2.color" name="c2" type="color" class="form-control form-control-sm form-control-color" title="Choose color" aria-labelledby="bobLabelEdit">
                      </div>
                      <div class="g-lw1">
                        <input v-model.number="editData.bob1.lineWeight" name="lw1" placeholder="0" type="number" min="0" class="form-control form-control-sm" aria-labelledby="rodLabelEdit">
                      </div>
                      <div class="g-lw2">
                        <input v-model.number="editData.bob2.lineWeight" name="lw2" placeholder="0" type="number" min="0" class="form-control form-control-sm" aria-labelledby="rodLabelEdit">
                      </div>
                      <div class="g-lc1">
                        <input :data-color="editData.bob1.lineColor" name="lc1" type="color" class="form-control form-control-sm form-control-color" title="Choose color" aria-labelledby="rodLabelEdit">
                      </div>
                      <div class="g-lc2">
                        <input :data-color="editData.bob2.lineColor" name="lc2" type="color" class="form-control form-control-sm form-control-color" title="Choose color" aria-labelledby="rodLabelEdit">
                      </div>
                      <div class="g-tw1">
                        <input v-model.number="editData.bob1.trailWeight" name="tw1" placeholder="0" type="number" min="0" class="form-control form-control-sm" aria-labelledby="trailLabelEdit">
                      </div>
                      <div class="g-tw2">
                        <input v-model.number="editData.bob2.trailWeight" name="tw2" placeholder="0" type="number" min="0" class="form-control form-control-sm" aria-labelledby="trailLabelEdit">
                      </div>
                      <div class="g-tc1">
                        <input :data-color="editData.bob1.trailColor" name="tc1" type="color" class="form-control form-control-sm form-control-color" title="Choose color" aria-labelledby="trailLabelEdit">
                      </div>
                      <div class="g-tc2">
                        <input :data-color="editData.bob2.trailColor" name="tc2" type="color" class="form-control form-control-sm form-control-color" title="Choose color" aria-labelledby="trailLabelEdit">
                      </div>
                      <div class="g-tl1">
                        <input v-model.number="editData.bob1.trailLen" name="tl1" placeholder="0" type="number" min="-1" class="form-control form-control-sm" aria-labelledby="trailLengthLabelEdit">
                      </div>
                      <div class="g-tl2">
                        <input v-model.number="editData.bob2.trailLen" name="tl2" placeholder="0" type="number" min="-1" class="form-control form-control-sm" aria-labelledby="trailLengthLabelEdit">
                      </div>
                    </div>
                  </div>
                  <div class="d-flex justify-content-center">
                    <button type="submit" class="btn btn-primary w-100" :disabled="DPs.filter((i) => i.checked).length == 0">Apply</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    beforeMount(){
        let lastSettings = localStorage.getItem("lastSettings");
        if (lastSettings === null){
            this.DPs.push(this.getDefaultDP());
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

        fetch("presets.json")
        .then(response => response.json())
        .then(json => this.presets.public = json);

        let localPresets = localStorage.getItem("presets");
        this.presets.local = (localPresets !== null) ? JSON.parse(localPresets) : {};

        this.editData = JSON.parse(JSON.stringify(DEFAULT_DP_DATA));
    },
    mounted() {
        const s = (p) => {
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
                this.DPs.forEach((dp) => {
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

                this.DPs.forEach((dp) => {
                    dp.show(p, p.simulate);
                })
                // if (p.simulate && (p.frameCount % 30 == 0)){
                //     this.DPs.push(new DP({
                //         "simSpeed": 0.1,
                //         "g": -9.81,
                //         "compound": false,
                //         "origin": {
                //           "x": 0,
                //           "y": 420,
                //           "radius": 10,
                //           "color": "rgb(112, 112, 112)"
                //         },
                //         "bob1": {
                //           "length": 7,
                //           "mass": 7,
                //           "angle": -253.72,
                //           "velocity": -0.02,
                //           "radius": 0,
                //           "color": "rgb(255, 255, 255)",
                //           "lineWeight": 2,
                //           "lineColor": "rgb(255, 255, 255)",
                //           "trailWeight": 0,
                //           "trailColor": "rgb(255, 255, 255)",
                //           "trailLen": 100
                //         },
                //         "bob2": {
                //           "length": 1,
                //           "mass": 0,
                //           "angle": 248.73,
                //           "velocity": 11.32,
                //           "radius": 0,
                //           "color": "rgb(255, 255, 255)",
                //           "lineWeight": 0,
                //           "lineColor": "rgb(255, 255, 255)",
                //           "trailWeight": 0,
                //           "trailColor": "rgb(255, 255, 255)",
                //           "trailLen": 100
                //         },
                //         "hidden": false
                //     }));
                // }
                
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
                if (clear){
                    this.DPs.length = 0;
                }
                settings.forEach((data) => {
                    this.DPs.push(new DP(data));
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
}