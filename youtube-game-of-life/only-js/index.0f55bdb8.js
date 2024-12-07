var e=globalThis,t={},s={},i=e.parcelRequire94c2;function o(e,t=0){let s={id:0},i=Date.now(),p=()=>{if(0===t){e(),s.id=requestAnimationFrame(p);return}let o=Date.now(),n=o-i;n>=t&&(e(),i=o-n%t),s.id=requestAnimationFrame(p)};return s.id=requestAnimationFrame(p),s}function p(e,t,s){let i=parseInt(e.value);return isNaN(i)?i=t:i<t?i=t:i>s&&(i=s),e.value=i.toString(),i}null==i&&((i=function(e){if(e in t)return t[e].exports;if(e in s){var i=s[e];delete s[e];var o={id:e,exports:{}};return t[e]=o,i.call(o.exports,o,o.exports),o.exports}var p=Error("Cannot find module '"+e+"'");throw p.code="MODULE_NOT_FOUND",p}).register=function(e,t){s[e]=t},e.parcelRequire94c2=i),(0,i.register)("27Lyk",function(e,t){Object.defineProperty(e.exports,"register",{get:()=>s,set:e=>s=e,enumerable:!0,configurable:!0});var s,i=new Map;s=function(e,t){for(var s=0;s<t.length-1;s+=2)i.set(t[s],{baseUrl:e,path:t[s+1]})}}),i("27Lyk").register(new URL("",import.meta.url).toString(),JSON.parse('["4j3bX","index.0f55bdb8.js","h7bGy","worker-game-of-life-logic.7e4646c3.js"]'));var n={},a={};a=function(e,t,s){if(t===self.location.origin)return e;var i=s?"import "+JSON.stringify(e)+";":"importScripts("+JSON.stringify(e)+");";return URL.createObjectURL(new Blob([i],{type:"application/javascript"}))};let d=new URL("worker-game-of-life-logic.7e4646c3.js",import.meta.url);n=a(d.toString(),d.origin,!0);class r{ctx;rows;cols;cellSize;field;buffer;colorCell;animationObj;nodes;cycles=0;played=!1;interval=500;gameTime=0;gameStartTime=0;gameLastTime=0;random=!1;speed=0;activeCells=0;localStorageUse=!1;isDragging=!1;isRealDragging=!1;animationTimeId;worker=new Worker(n);loading=!1;focusedInput=null;popupHidden=!1;constructor({injectedNode:e,cellsCountX:t,cellsCountY:s,random:i,speed:o,localStorageUse:p,popupHidden:n}){if(o<1)throw Error("GameOfLife: speed не может быть меньше 1");if(o>10)throw Error("GameOfLife: speed не может быть больше 10");this.rows=t,this.cols=s,this.random=i,this.speed=o,this.localStorageUse=p,this.popupHidden=n,this.initNodes(e),this.ctx=this.nodes.canvasNode.getContext("2d"),this.localStorageUse&&this.useLocalStorage(),this.initCalcSpeed(),this.setCanvasSize(),this.setColorCell(),this.initInputNodes(),this.initPopupHidden(),this.sendWorkerInitFields({random:this.random,rows:this.rows,cols:this.cols}).then(({activeCells:e,field:t,buffer:s})=>{this.initEventListeners(),this.drawField(),this.renderPopup()})}initInputNodes(){this.nodes.popupInputRowsNode.value=String(this.rows),this.nodes.popupInputColsNode.value=String(this.cols)}initPopupHidden(){this.togglePopup(this.popupHidden)}disableInputs(){this.nodes.popupInputRowsNode.disabled=!0,this.nodes.popupInputColsNode.disabled=!0}enableInputs(){this.nodes.popupInputRowsNode.disabled=!1,this.nodes.popupInputColsNode.disabled=!1,null!==this.focusedInput&&(this.focusedInput.focus(),this.focusedInput=null)}sendWorkerInitFields({random:e,rows:t,cols:s}){return this.load(),this.disableInputs(),this.worker.postMessage({type:"initFields",payload:{random:e,rows:t,cols:s}}),new Promise((e,t)=>{this.worker.onmessage=s=>{let i=s.data;if(this.loadComplete(),this.enableInputs(),"result: initFields"===i.type){let t=i.data,{activeCells:s,field:o,buffer:p}=t;this.activeCells=s,this.field=o,this.buffer=p,e(t)}t(!1)}})}load(){this.loading=!0,this.nodes.popupLoadNode.classList.add("popup__load_active"),this.nodes.popupNode.classList.add("popup_load")}loadComplete(){this.loading=!1,this.nodes.popupLoadNode.classList.remove("popup__load_active"),this.nodes.popupNode.classList.remove("popup_load")}initEventListeners(){window.addEventListener("resize",this.resizeAndDraw),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",this.setColorCellAndDraw),this.nodes.popupPauseNode.addEventListener("click",()=>{!1!==this.played&&this.stopGame()}),this.nodes.popupPlayNode.addEventListener("click",()=>{!0!==this.played&&this.startGame()}),this.nodes.popupGenerateNode.addEventListener("click",this.generateNewFields),this.nodes.canvasNode.addEventListener("pointerdown",e=>{if(!0!==this.loading){if(2===e.button||1===e.button)return!1;this.isDragging=!0,this.isRealDragging=!1}}),this.nodes.canvasNode.addEventListener("pointermove",e=>{if(2===e.button||1===e.button)return!1;!0===this.isDragging&&!1===this.loading&&(this.isRealDragging=!0,this.generateCellByClick(e,!0))}),document.addEventListener("pointerup",e=>{if(2===e.button||1===e.button)return!1;!0!==this.isClickOnElement(e,this.nodes.popupNode)&&(!1===this.isRealDragging&&!1===this.loading&&this.generateCellByClick(e,!1),this.isDragging=!1,this.isRealDragging=!1)}),this.nodes.popupRandomCheckboxNode.addEventListener("input",()=>{this.random=!this.random,this.localStorageUse&&this.setLocalStorage("random",this.random),this.renderRandom()}),this.nodes.popupSpeedRangeNode.addEventListener("input",this.calcSpeedInputChange),this.nodes.popupClearNode.addEventListener("click",this.clear),this.nodes.popupStepNode.addEventListener("click",()=>{this.disableInputs(),this.stepGame()?.then(e=>{this.enableInputs()})}),this.nodes.popupInputRowsNode.addEventListener("input",()=>{let e=p(this.nodes.popupInputRowsNode,0,2e3);this.localStorageUse&&this.setLocalStorage("rows",e),this.focusedInput=this.nodes.popupInputRowsNode,this.resizeFieldRows(e)}),this.nodes.popupInputColsNode.addEventListener("input",()=>{let e=p(this.nodes.popupInputColsNode,0,2e3);this.localStorageUse&&this.setLocalStorage("cols",e),this.focusedInput=this.nodes.popupInputColsNode,this.resizeFieldCols(e)}),this.nodes.popupCloseNode.addEventListener("click",()=>{this.popupHidden=!this.popupHidden,this.togglePopup(this.popupHidden)})}togglePopup=e=>{!0===this.localStorageUse&&this.setLocalStorage("popupHidden",this.popupHidden),!0===this.popupHidden?(this.nodes.popupNode.classList.add("popup_hidden"),this.nodes.popupCloseNode.textContent="Открыть"):(this.nodes.popupNode.classList.remove("popup_hidden"),this.nodes.popupCloseNode.textContent="Скрыть")};resizeFieldRows(e){!0!==this.loading&&this.sendWorkerResizeField(e,this.cols,this.random).then(e=>{this.setCanvasSize(),this.drawField(),this.renderTime(),this.renderPopup()})}resizeFieldCols(e){!0!==this.loading&&this.sendWorkerResizeField(this.rows,e,this.random).then(e=>{this.setCanvasSize(),this.drawField(),this.renderTime(),this.renderPopup()})}sendWorkerResizeField(e,t,s){return this.load(),this.disableInputs(),this.worker.postMessage({type:"resizeField",payload:{newRows:e,newCols:t,random:s}}),new Promise((e,t)=>{this.worker.onmessage=s=>{let i=s.data;if(this.loadComplete(),this.enableInputs(),"result: resizeField"===i.type){let t=i.data,{field:s,buffer:o,activeCells:p,rows:n,cols:a}=t;this.field=s,this.buffer=o,this.activeCells=p,this.rows=n,this.cols=a,e(t)}t(!1)}}).catch(()=>{})}isClickOnElement(e,t){let s=e.target;for(;null!=s;){if(s===t)return!0;s=s.parentElement}return!1}sendWorkerDeleteOrCreateCell(e,t){return this.load(),this.worker.postMessage({type:"deleteOrCreateCell",payload:{typeAction:e,key:t}}),new Promise((e,t)=>{this.worker.onmessage=s=>{let i=s.data;this.loadComplete(),"result: deleteOrCreateCell"===i.type&&e(i.data),t(!1)}})}generateCellByClick=(e,t=!1)=>{if(!0===this.played)return;let s=this.nodes.canvasNode.getBoundingClientRect(),i=e.clientX-s.left,o=e.clientY-s.top,p=Math.floor(i/this.cellSize),n=Math.floor(o/this.cellSize),a=this.getKey(n,p),d=this.field.get(a),r=()=>{this.activeCells++,this.field.set(a,!0),this.sendWorkerDeleteOrCreateCell("create",a).then()};!1===d&&!0===t?r():!1===d&&!1===t?r():!0===d&&!1===t&&(()=>{this.activeCells--,this.field.set(a,!1),this.sendWorkerDeleteOrCreateCell("delete",a).then()})(),this.renderPopulation(),this.drawField()};initCalcSpeed(){let e=Number(this.nodes.popupSpeedRangeNode.max),t=Number(this.nodes.popupSpeedRangeNode.min),s=(this.speed-1)/9;this.nodes.popupSpeedRangeNode.value=String(t+s*(e-t)),this.nodes.popupSpeedInfoNode.textContent=String(this.speed)}calcSpeedInputChange=()=>{let e=this.played;this.stopGame();let t=this.nodes.popupSpeedRangeNode.valueAsNumber,s=Number(this.nodes.popupSpeedRangeNode.max),i=Number(this.nodes.popupSpeedRangeNode.min),o=Number(((t-i)/(s-i)*9+1).toFixed(1));this.speed=o,this.nodes.popupSpeedInfoNode.textContent=String(this.speed),this.localStorageUse&&this.setLocalStorage("speed",this.speed),!0===e&&this.startGame()};useLocalStorage(){let e=this.getLocalStorage();void 0!==e.random&&(this.random=e.random),void 0!==e.speed&&(this.speed=e.speed),void 0!==e.rows&&(this.rows=e.rows),void 0!==e.cols&&(this.cols=e.cols),void 0!==e.popupHidden&&(this.popupHidden=e.popupHidden)}clear=()=>{this.loading,this.stopGame(),this.gameTime=0,this.gameLastTime=0,this.gameStartTime=0,this.cycles=0,this.disableInputs(),this.sendWorkerInitFields({random:!1,rows:this.rows,cols:this.cols}).then(e=>{this.drawField(),this.renderTime(),this.renderPopup(),this.enableInputs()})};generateNewFields=()=>{this.loading,this.sendWorkerInitFields({random:!0,rows:this.rows,cols:this.cols}).then(e=>{this.cycles=0,this.drawField(),this.renderPopup()})};initNodes(e){e.innerHTML=`
			<div class="wrapper">
				<div class="wrapper-canvas">
					<canvas class="canvas"></canvas>
				</div>

				<div class="popup">
					<div class="popup__item popup__play">Play</div>
					<div class="popup__item popup__pause">\u{41F}\u{430}\u{443}\u{437}\u{430}</div>
					<div class="popup__item popup__clear">\u{41E}\u{447}\u{438}\u{441}\u{442}\u{438}\u{442}\u{44C}</div>
					<div class="popup__item popup__step">\u{428}\u{430}\u{433}</div>
					<div class="popup__item popup__generate">\u{421}\u{433}\u{435}\u{43D}\u{435}\u{440}\u{438}\u{440}\u{43E}\u{432}\u{430}\u{442}\u{44C}</div>
					<label class="popup__item popup__random-checkbox-item">
						<input type="checkbox" class="popup__random-checkbox">
						<span>\u{420}\u{430}\u{43D}\u{434}\u{43E}\u{43C}</span>
					</label>
					<div class="popup__item">
						\u{412}\u{440}\u{435}\u{43C}\u{44F}:
						<span class="popup__time">0.0</span>
					</div>
					<div class="popup__item">\u{41F}\u{43E}\u{43A}\u{43E}\u{43B}\u{435}\u{43D}\u{438}\u{435}: <span class="popup__cycles">0</span></div>
					<div class="popup__item">\u{41D}\u{430}\u{441}\u{435}\u{43B}\u{435}\u{43D}\u{438}\u{435}: <span class="popup__population">0</span></div>
					<div class="popup__item">
						<span>\u{421}\u{43A}\u{43E}\u{440}\u{43E}\u{441}\u{442}\u{44C}: </span>
						<span class="popup__speed-info">1</span>
					</div>
					<div class="popup__item">
						<input class="popup__speed-range" type="range" min="0" max="100" value="50">
					</div>

					<div class="popup__item popup__item_inputs">
						<input type="number" class="popup__rows popup__inputs" placeholder="rows" min="0" max="2000">
						<input type="number" class="popup__cols popup__inputs" placeholder="cols" min="0" max="2000">
					</div>

					<div class="popup__item popup__close">\u{421}\u{43A}\u{440}\u{44B}\u{442}\u{44C}</div>

					<div class="popup__item popup__load">\u{417}\u{430}\u{433}\u{440}\u{443}\u{437}\u{43A}\u{430}</div>

				</div>

			</div>
		`;let t=this._querySelector(e,".popup"),s=this._querySelector(e,".canvas"),i=this._querySelector(e,".wrapper-canvas"),o=this._querySelector(t,".popup__play"),p=this._querySelector(t,".popup__pause"),n=this._querySelector(t,".popup__time"),a=this._querySelector(t,".popup__population"),d=this._querySelector(t,".popup__cycles"),r=this._querySelector(t,".popup__generate"),l=this._querySelector(t,".popup__random-checkbox"),u=this._querySelector(t,".popup__speed-range"),h=this._querySelector(t,".popup__speed-info"),c=this._querySelector(t,".popup__clear"),m=this._querySelector(t,".popup__step"),g=this._querySelector(t,".popup__load"),_=this._querySelector(t,".popup__rows"),v=this._querySelector(t,".popup__cols"),C=this._querySelector(t,".popup__close");this.nodes={canvasNode:s,popupNode:t,popupPlayNode:o,popupPauseNode:p,popupTimeNode:n,popupPopulationNode:a,popupCyclesNode:d,popupGenerateNode:r,wrapperCanvasNode:i,popupRandomCheckboxNode:l,popupSpeedRangeNode:u,popupSpeedInfoNode:h,popupClearNode:c,popupStepNode:m,popupLoadNode:g,popupInputRowsNode:_,popupInputColsNode:v,popupCloseNode:C}}_querySelector(e,t){let s=e.querySelector(t);if(null===s)throw Error(`GameOfLife: \u{44D}\u{43B}\u{435}\u{43C}\u{435}\u{43D}\u{442} \u{441} \u{43A}\u{43B}\u{430}\u{441}\u{441}\u{43E}\u{43C} ${t} \u{43D}\u{435} \u{43D}\u{430}\u{439}\u{434}\u{435}\u{43D}`);return s}resizeAndDraw=()=>{this.setCanvasSize(),this.drawField()};setColorCell=()=>{this.colorCell=getComputedStyle(document.documentElement).getPropertyValue("--color")};setColorCellAndDraw=()=>{this.setColorCell(),this.drawField()};setCanvasSize=()=>{let e=this.nodes.wrapperCanvasNode.offsetWidth,t=this.nodes.wrapperCanvasNode.offsetHeight,s=this.cols/this.rows,i=Math.min(e,t*s),o=i/s;this.cellSize=i/this.cols,this.nodes.canvasNode.width=i,this.nodes.canvasNode.height=o,this.nodes.wrapperCanvasNode.style.padding=`${(t-o)/2}px ${(e-i)/2}px`};getKey(e,t){return`${e}-${t}`}drawField(){this.load(),this.ctx.clearRect(0,0,this.nodes.canvasNode.width,this.nodes.canvasNode.height);let e=this.cellSize;this.ctx.fillStyle=this.colorCell;for(let t=0;t<this.rows;t++)for(let s=0;s<this.cols;s++){let i=this.getKey(t,s);this.field.get(i)&&this.ctx.fillRect(s*e,t*e,e,e)}this.loadComplete()}sendWorkerUpdateField(){return this.load(),this.worker.postMessage({type:"updateField",payload:{}}),new Promise((e,t)=>{this.worker.onmessage=s=>{let i=s.data;if(this.loadComplete(),"result: updateField"===i.type){let t=i.data,{activeCells:s,field:o,buffer:p}=t;this.activeCells=s,this.field=o,this.buffer=p,e(t)}t(!1)}})}renderPopup(){this.renderPopulation(),this.renderRandom(),this.nodes.popupCyclesNode.textContent=String(this.cycles),this.nodes.popupRandomCheckboxNode.checked=this.random}renderTime(){let e=Date.now()-this.gameStartTime+this.gameLastTime;0===this.gameStartTime&&(e=0),this.gameTime=e,this.nodes.popupTimeNode.textContent=(this.gameTime/1e3).toFixed(1)}renderRandom(){!0===this.random?this.nodes.popupGenerateNode.classList.add("popup__generate_active"):this.nodes.popupGenerateNode.classList.remove("popup__generate_active")}renderPopulation(){this.nodes.popupPopulationNode.textContent=String(this.activeCells)}stepGame=()=>{if(!0!==this.loading)return this.sendWorkerUpdateField().then(e=>(this.drawField(),this.cycles=this.cycles+1,this.renderPopup(),e))};startGame(){this.disableInputs(),this.played=!0,this.gameStartTime=Date.now(),this.animationObj=o(this.stepGame,this.interval/this.speed**1.5),this.animationTimeId=o(this.stepAnimationRenderTime)}stepAnimationRenderTime=()=>{this.renderTime()};stopGame(){!1!==this.played&&(this.played=!1,this.gameLastTime=this.gameTime,cancelAnimationFrame(this.animationObj.id),cancelAnimationFrame(this.animationTimeId.id),this.enableInputs())}getLocalStorage(){return JSON.parse(localStorage.getItem("life")||"{}")}setLocalStorage(e,t){let s=this.getLocalStorage();s[e]=t,localStorage.setItem("life",JSON.stringify(s))}}const l=document.querySelector(".injected-game-life");if(null===l)throw Error("injectedNode не найден");new r({cellsCountX:100,cellsCountY:100,random:!1,speed:1,localStorageUse:!0,popupHidden:!1,injectedNode:l});
//# sourceMappingURL=index.0f55bdb8.js.map
