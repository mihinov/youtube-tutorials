function e(e,t,s,i){Object.defineProperty(e,t,{get:s,set:i,enumerable:!0,configurable:!0})}var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},s={},i={},o=t.parcelRequiree4b2;function p(e,t=0){const s={id:0};let i=Date.now();const o=()=>{if(0===t)return e(),void(s.id=requestAnimationFrame(o));const p=Date.now(),n=p-i;n>=t&&(e(),i=p-n%t),s.id=requestAnimationFrame(o)};return s.id=requestAnimationFrame(o),s}function n(e,t,s){let i=parseInt(e.value);return isNaN(i)||i<t?i=t:i>s&&(i=s),e.value=i.toString(),i}null==o&&((o=function(e){if(e in s)return s[e].exports;if(e in i){var t=i[e];delete i[e];var o={id:e,exports:{}};return s[e]=o,t.call(o.exports,o,o.exports),o.exports}var p=new Error("Cannot find module '"+e+"'");throw p.code="MODULE_NOT_FOUND",p}).register=function(e,t){i[e]=t},t.parcelRequiree4b2=o),o.register("27Lyk",(function(t,s){var i,o;e(t.exports,"register",(()=>i),(e=>i=e)),e(t.exports,"resolve",(()=>o),(e=>o=e));var p={};i=function(e){for(var t=Object.keys(e),s=0;s<t.length;s++)p[t[s]]=e[t[s]]},o=function(e){var t=p[e];if(null==t)throw new Error("Could not resolve bundle with id "+e);return t}})),o("27Lyk").register(JSON.parse('{"4j3bX":"index.5ccccf17.js","h7bGy":"worker-game-of-life-logic.ea43ae75.js"}'));var d,a;a=function(e,t,s){if(t===self.location.origin)return e;var i=s?"import "+JSON.stringify(e)+";":"importScripts("+JSON.stringify(e)+");";return URL.createObjectURL(new Blob([i],{type:"application/javascript"}))};let r=new URL(o("27Lyk").resolve("h7bGy"),import.meta.url);d=a(r.toString(),r.origin,!0);const l=document.querySelector(".injected-game-life");if(null===l)throw new Error("injectedNode не найден");new class{ctx;rows;cols;cellSize;field;buffer;colorCell;animationObj;nodes;cycles=0;played=!1;interval=500;gameTime=0;gameStartTime=0;gameLastTime=0;random=!1;speed=0;activeCells=0;localStorageUse=!1;isDragging=!1;isRealDragging=!1;animationTimeId;worker=new Worker(d);loading=!1;focusedInput=null;popupHidden=!1;constructor({injectedNode:e,cellsCountX:t,cellsCountY:s,random:i,speed:o,localStorageUse:p,popupHidden:n}){if(o<1)throw new Error("GameOfLife: speed не может быть меньше 1");if(o>10)throw new Error("GameOfLife: speed не может быть больше 10");this.rows=t,this.cols=s,this.random=i,this.speed=o,this.localStorageUse=p,this.popupHidden=n,this.initNodes(e),this.ctx=this.nodes.canvasNode.getContext("2d"),this.localStorageUse&&this.useLocalStorage(),this.initCalcSpeed(),this.setCanvasSize(),this.setColorCell(),this.initInputNodes(),this.initPopupHidden(),this.sendWorkerInitFields({random:this.random,rows:this.rows,cols:this.cols}).then((({activeCells:e,field:t,buffer:s})=>{this.initEventListeners(),this.drawField(),this.renderPopup()}))}initInputNodes(){this.nodes.popupInputRowsNode.value=String(this.rows),this.nodes.popupInputColsNode.value=String(this.cols)}initPopupHidden(){this.togglePopup(this.popupHidden)}disableInputs(){this.nodes.popupInputRowsNode.disabled=!0,this.nodes.popupInputColsNode.disabled=!0}enableInputs(){this.nodes.popupInputRowsNode.disabled=!1,this.nodes.popupInputColsNode.disabled=!1,null!==this.focusedInput&&(this.focusedInput.focus(),this.focusedInput=null)}sendWorkerInitFields({random:e,rows:t,cols:s}){this.load(),this.disableInputs(),this.worker.postMessage({type:"initFields",payload:{random:e,rows:t,cols:s}});return new Promise(((e,t)=>{this.worker.onmessage=s=>{const i=s.data;if(this.loadComplete(),this.enableInputs(),"result: initFields"===i.type){const t=i.data,{activeCells:s,field:o,buffer:p}=t;this.activeCells=s,this.field=o,this.buffer=p,e(t)}t(!1)}}))}load(){this.loading=!0,this.nodes.popupLoadNode.classList.add("popup__load_active"),this.nodes.popupNode.classList.add("popup_load")}loadComplete(){this.loading=!1,this.nodes.popupLoadNode.classList.remove("popup__load_active"),this.nodes.popupNode.classList.remove("popup_load")}initEventListeners(){window.addEventListener("resize",this.resizeAndDraw);window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",this.setColorCellAndDraw),this.nodes.popupPauseNode.addEventListener("click",(()=>{!1!==this.played&&this.stopGame()})),this.nodes.popupPlayNode.addEventListener("click",(()=>{!0!==this.played&&this.startGame()})),this.nodes.popupGenerateNode.addEventListener("click",this.generateNewFields),this.nodes.canvasNode.addEventListener("pointerdown",(e=>{if(!0!==this.loading){if(2===e.button||1===e.button)return!1;this.isDragging=!0,this.isRealDragging=!1}})),this.nodes.canvasNode.addEventListener("pointermove",(e=>{if(2===e.button||1===e.button)return!1;!0===this.isDragging&&!1===this.loading&&(this.isRealDragging=!0,this.generateCellByClick(e,!0))})),document.addEventListener("pointerup",(e=>{if(2===e.button||1===e.button)return!1;!0!==this.isClickOnElement(e,this.nodes.popupNode)&&(!1===this.isRealDragging&&!1===this.loading&&this.generateCellByClick(e,!1),this.isDragging=!1,this.isRealDragging=!1)})),this.nodes.popupRandomCheckboxNode.addEventListener("input",(()=>{this.random=!this.random,this.localStorageUse&&this.setLocalStorage("random",this.random),this.renderRandom()})),this.nodes.popupSpeedRangeNode.addEventListener("input",this.calcSpeedInputChange),this.nodes.popupClearNode.addEventListener("click",this.clear),this.nodes.popupStepNode.addEventListener("click",(()=>{this.disableInputs(),this.stepGame()?.then((e=>{this.enableInputs()}))})),this.nodes.popupInputRowsNode.addEventListener("input",(()=>{const e=n(this.nodes.popupInputRowsNode,0,2e3);this.localStorageUse&&this.setLocalStorage("rows",e),this.focusedInput=this.nodes.popupInputRowsNode,this.resizeFieldRows(e)})),this.nodes.popupInputColsNode.addEventListener("input",(()=>{const e=n(this.nodes.popupInputColsNode,0,2e3);this.localStorageUse&&this.setLocalStorage("cols",e),this.focusedInput=this.nodes.popupInputColsNode,this.resizeFieldCols(e)})),this.nodes.popupCloseNode.addEventListener("click",(()=>{this.popupHidden=!this.popupHidden,this.togglePopup(this.popupHidden)}))}togglePopup=e=>{!0===this.localStorageUse&&this.setLocalStorage("popupHidden",this.popupHidden),!0===this.popupHidden?(this.nodes.popupNode.classList.add("popup_hidden"),this.nodes.popupCloseNode.textContent="Открыть"):(this.nodes.popupNode.classList.remove("popup_hidden"),this.nodes.popupCloseNode.textContent="Скрыть")};resizeFieldRows(e){!0!==this.loading&&this.sendWorkerResizeField(e,this.cols,this.random).then((e=>{this.setCanvasSize(),this.drawField(),this.renderTime(),this.renderPopup()}))}resizeFieldCols(e){!0!==this.loading&&this.sendWorkerResizeField(this.rows,e,this.random).then((e=>{this.setCanvasSize(),this.drawField(),this.renderTime(),this.renderPopup()}))}sendWorkerResizeField(e,t,s){this.load(),this.disableInputs(),this.worker.postMessage({type:"resizeField",payload:{newRows:e,newCols:t,random:s}});return new Promise(((e,t)=>{this.worker.onmessage=s=>{const i=s.data;if(this.loadComplete(),this.enableInputs(),"result: resizeField"===i.type){const t=i.data,{field:s,buffer:o,activeCells:p,rows:n,cols:d}=t;this.field=s,this.buffer=o,this.activeCells=p,this.rows=n,this.cols=d,e(t)}t(!1)}})).catch((()=>{}))}isClickOnElement(e,t){let s=e.target;for(;null!=s;){if(s===t)return!0;s=s.parentElement}return!1}sendWorkerDeleteOrCreateCell(e,t){this.load(),this.worker.postMessage({type:"deleteOrCreateCell",payload:{typeAction:e,key:t}});return new Promise(((e,t)=>{this.worker.onmessage=s=>{const i=s.data;if(this.loadComplete(),"result: deleteOrCreateCell"===i.type){const t=i.data;e(t)}t(!1)}}))}generateCellByClick=(e,t=!1)=>{if(!0===this.played)return;const s=this.nodes.canvasNode.getBoundingClientRect(),i=e.clientX-s.left,o=e.clientY-s.top,p=Math.floor(i/this.cellSize),n=Math.floor(o/this.cellSize),d=this.getKey(n,p),a=this.field.get(d),r=()=>{this.activeCells++,this.field.set(d,!0),this.sendWorkerDeleteOrCreateCell("create",d).then()};!1===a&&!0===t||!1===a&&!1===t?r():!0===a&&!1===t&&(()=>{this.activeCells--,this.field.set(d,!1),this.sendWorkerDeleteOrCreateCell("delete",d).then()})(),this.renderPopulation(),this.drawField()};initCalcSpeed(){const e=Number(this.nodes.popupSpeedRangeNode.max),t=Number(this.nodes.popupSpeedRangeNode.min),s=t+(this.speed-1)/9*(e-t);this.nodes.popupSpeedRangeNode.value=String(s),this.nodes.popupSpeedInfoNode.textContent=String(this.speed)}calcSpeedInputChange=()=>{const e=this.played;this.stopGame();const t=this.nodes.popupSpeedRangeNode.valueAsNumber,s=Number(this.nodes.popupSpeedRangeNode.max),i=Number(this.nodes.popupSpeedRangeNode.min),o=Number((9*((t-i)/(s-i))+1).toFixed(1));this.speed=o,this.nodes.popupSpeedInfoNode.textContent=String(this.speed),this.localStorageUse&&this.setLocalStorage("speed",this.speed),!0===e&&this.startGame()};useLocalStorage(){const e=this.getLocalStorage();void 0!==e.random&&(this.random=e.random),void 0!==e.speed&&(this.speed=e.speed),void 0!==e.rows&&(this.rows=e.rows),void 0!==e.cols&&(this.cols=e.cols),void 0!==e.popupHidden&&(this.popupHidden=e.popupHidden)}clear=()=>{this.loading,this.stopGame(),this.gameTime=0,this.gameLastTime=0,this.gameStartTime=0,this.cycles=0,this.disableInputs(),this.sendWorkerInitFields({random:!1,rows:this.rows,cols:this.cols}).then((e=>{this.drawField(),this.renderTime(),this.renderPopup(),this.enableInputs()}))};generateNewFields=()=>{this.loading,this.sendWorkerInitFields({random:!0,rows:this.rows,cols:this.cols}).then((e=>{this.cycles=0,this.drawField(),this.renderPopup()}))};initNodes(e){e.innerHTML='\n\t\t\t<div class="wrapper">\n\t\t\t\t<div class="wrapper-canvas">\n\t\t\t\t\t<canvas class="canvas"></canvas>\n\t\t\t\t</div>\n\n\t\t\t\t<div class="popup">\n\t\t\t\t\t<div class="popup__item popup__play">Play</div>\n\t\t\t\t\t<div class="popup__item popup__pause">Пауза</div>\n\t\t\t\t\t<div class="popup__item popup__clear">Очистить</div>\n\t\t\t\t\t<div class="popup__item popup__step">Шаг</div>\n\t\t\t\t\t<div class="popup__item popup__generate">Сгенерировать</div>\n\t\t\t\t\t<label class="popup__item popup__random-checkbox-item">\n\t\t\t\t\t\t<input type="checkbox" class="popup__random-checkbox">\n\t\t\t\t\t\t<span>Рандом</span>\n\t\t\t\t\t</label>\n\t\t\t\t\t<div class="popup__item">\n\t\t\t\t\t\tВремя:\n\t\t\t\t\t\t<span class="popup__time">0.0</span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="popup__item">Поколение: <span class="popup__cycles">0</span></div>\n\t\t\t\t\t<div class="popup__item">Население: <span class="popup__population">0</span></div>\n\t\t\t\t\t<div class="popup__item">\n\t\t\t\t\t\t<span>Скорость: </span>\n\t\t\t\t\t\t<span class="popup__speed-info">1</span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="popup__item">\n\t\t\t\t\t\t<input class="popup__speed-range" type="range" min="0" max="100" value="50">\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class="popup__item popup__item_inputs">\n\t\t\t\t\t\t<input type="number" class="popup__rows popup__inputs" placeholder="rows" min="0" max="2000">\n\t\t\t\t\t\t<input type="number" class="popup__cols popup__inputs" placeholder="cols" min="0" max="2000">\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class="popup__item popup__close">Скрыть</div>\n\n\t\t\t\t\t<div class="popup__item popup__load">Загрузка</div>\n\n\t\t\t\t</div>\n\n\t\t\t</div>\n\t\t';const t=this._querySelector(e,".popup"),s=this._querySelector(e,".canvas"),i=this._querySelector(e,".wrapper-canvas"),o=this._querySelector(t,".popup__play"),p=this._querySelector(t,".popup__pause"),n=this._querySelector(t,".popup__time"),d=this._querySelector(t,".popup__population"),a=this._querySelector(t,".popup__cycles"),r=this._querySelector(t,".popup__generate"),l=this._querySelector(t,".popup__random-checkbox"),h=this._querySelector(t,".popup__speed-range"),u=this._querySelector(t,".popup__speed-info"),c=this._querySelector(t,".popup__clear"),m=this._querySelector(t,".popup__step"),g=this._querySelector(t,".popup__load"),_=this._querySelector(t,".popup__rows"),v=this._querySelector(t,".popup__cols"),f=this._querySelector(t,".popup__close");this.nodes={canvasNode:s,popupNode:t,popupPlayNode:o,popupPauseNode:p,popupTimeNode:n,popupPopulationNode:d,popupCyclesNode:a,popupGenerateNode:r,wrapperCanvasNode:i,popupRandomCheckboxNode:l,popupSpeedRangeNode:h,popupSpeedInfoNode:u,popupClearNode:c,popupStepNode:m,popupLoadNode:g,popupInputRowsNode:_,popupInputColsNode:v,popupCloseNode:f}}_querySelector(e,t){const s=e.querySelector(t);if(null===s)throw new Error(`GameOfLife: элемент с классом ${t} не найден`);return s}resizeAndDraw=()=>{this.setCanvasSize(),this.drawField()};setColorCell=()=>{this.colorCell=getComputedStyle(document.documentElement).getPropertyValue("--color")};setColorCellAndDraw=()=>{this.setColorCell(),this.drawField()};setCanvasSize=()=>{const e=this.nodes.wrapperCanvasNode.offsetWidth,t=this.nodes.wrapperCanvasNode.offsetHeight,s=this.cols/this.rows,i=Math.min(e,t*s),o=i/s;this.cellSize=i/this.cols;const p=(e-i)/2,n=(t-o)/2;this.nodes.canvasNode.width=i,this.nodes.canvasNode.height=o,this.nodes.wrapperCanvasNode.style.padding=`${n}px ${p}px`};getKey(e,t){return`${e}-${t}`}drawField(){this.load(),this.ctx.clearRect(0,0,this.nodes.canvasNode.width,this.nodes.canvasNode.height);const e=this.cellSize;this.ctx.fillStyle=this.colorCell;for(let t=0;t<this.rows;t++)for(let s=0;s<this.cols;s++){const i=this.getKey(t,s);this.field.get(i)&&this.ctx.fillRect(s*e,t*e,e,e)}this.loadComplete()}sendWorkerUpdateField(){this.load(),this.worker.postMessage({type:"updateField",payload:{}});return new Promise(((e,t)=>{this.worker.onmessage=s=>{const i=s.data;if(this.loadComplete(),"result: updateField"===i.type){const t=i.data,{activeCells:s,field:o,buffer:p}=t;this.activeCells=s,this.field=o,this.buffer=p,e(t)}t(!1)}}))}renderPopup(){this.renderPopulation(),this.renderRandom(),this.nodes.popupCyclesNode.textContent=String(this.cycles),this.nodes.popupRandomCheckboxNode.checked=this.random}renderTime(){let e=Date.now()-this.gameStartTime+this.gameLastTime;0===this.gameStartTime&&(e=0),this.gameTime=e,this.nodes.popupTimeNode.textContent=(this.gameTime/1e3).toFixed(1)}renderRandom(){!0===this.random?this.nodes.popupGenerateNode.classList.add("popup__generate_active"):this.nodes.popupGenerateNode.classList.remove("popup__generate_active")}renderPopulation(){this.nodes.popupPopulationNode.textContent=String(this.activeCells)}stepGame=()=>{if(!0!==this.loading)return this.sendWorkerUpdateField().then((e=>(this.drawField(),this.cycles=this.cycles+1,this.renderPopup(),e)))};startGame(){this.disableInputs(),this.played=!0,this.gameStartTime=Date.now(),this.animationObj=p(this.stepGame,this.interval/this.speed**1.5),this.animationTimeId=p(this.stepAnimationRenderTime)}stepAnimationRenderTime=()=>{this.renderTime()};stopGame(){!1!==this.played&&(this.played=!1,this.gameLastTime=this.gameTime,cancelAnimationFrame(this.animationObj.id),cancelAnimationFrame(this.animationTimeId.id),this.enableInputs())}getLocalStorage(){return JSON.parse(localStorage.getItem("life")||"{}")}setLocalStorage(e,t){const s=this.getLocalStorage();s[e]=t,localStorage.setItem("life",JSON.stringify(s))}}({cellsCountX:100,cellsCountY:100,random:!1,speed:1,localStorageUse:!0,popupHidden:!1,injectedNode:l});
//# sourceMappingURL=index.5ccccf17.js.map
