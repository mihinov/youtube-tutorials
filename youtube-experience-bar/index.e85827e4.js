const a=document.querySelector(".input-aurum"),e=document.querySelector(".injected-bar");if(null===e||null===a)throw new Error("Что-то не найдено");const t=new class{_grades={0:{name:"Iron",min:0,max:60,nextGradeId:1},1:{name:"Platinum",min:60,max:150,nextGradeId:2},2:{name:"Diamond",min:150,max:300,nextGradeId:3},3:{name:"Master",min:300,max:500,nextGradeId:4},4:{name:"Grandmaster",min:500,max:800,nextGradeId:5},5:{name:"Challenger",min:800,max:1e5,nextGradeId:null}};_cssClasses={balance:"balance",balanceTotal:"balance__total",balanceProgress:"balance__progress",balanceGradeStart:"balance__grade_start",balanceGradeEnd:"balance__grade_end"};_balance={initBalance:0,addedBalance:0,totalBalance:0};_currentGradeId=-1;constructor(a){this._initNodes(a),this._calcCurrentGradeId(),this._renderBalance()}_initNodes(a){a.innerHTML='\n\t\t\t<div class="balance">\n\t\t\t\t<div class="balance__text">\n\t\t\t\t\tВаш баланc:\n\t\t\t\t\t<span class="balance__total">0</span>\n\t\t\t\t</div>\n\t\t\t\t<progress class="balance__progress"></progress>\n\t\t\t\t<div class="balance__grades">\n\t\t\t\t\t<div class="balance__grade balance__grade_start">Iron</div>\n\t\t\t\t\t<div class="balance__grade balance__grade_end">Platinum</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t';const e=this._querySelector(a,"."+this._cssClasses.balance);this._nodes={balanceNode:e,balanceTotalNode:this._querySelector(e,"."+this._cssClasses.balanceTotal),balanceProgressNode:this._querySelector(e,"."+this._cssClasses.balanceProgress),balanceGradeStartNode:this._querySelector(e,"."+this._cssClasses.balanceGradeStart),balanceGradeEndNode:this._querySelector(e,"."+this._cssClasses.balanceGradeEnd)}}_querySelector(a,e){const t=a.querySelector(e);if(null===t)throw new Error(`ExperienceBar: элемент с классом ${e} не найден`);return t}addBalance(a){this._balance.addedBalance=a,this._calcTotalBalance(),this._calcCurrentGradeId(),this._renderBalance()}setInitBalance(a){this._balance.initBalance=a,this._calcTotalBalance(),this._calcCurrentGradeId(),this._renderBalance()}_renderBalance(){const a=this.getCurrentGrade(),e=this._grades[this._currentGradeId+1],t=this._balance.totalBalance,n=a.max,r=a.min;this._nodes.balanceProgressNode.setAttribute("min",String(0)),this._nodes.balanceProgressNode.setAttribute("max",String(n-r)),this._nodes.balanceProgressNode.value=t-r,this._nodes.balanceTotalNode.textContent=String(t),this._nodes.balanceGradeStartNode.textContent=a.name,this._nodes.balanceGradeEndNode.textContent=void 0!==e?e.name:"∞"}_calcTotalBalance(){this._balance.totalBalance=this._balance.initBalance+this._balance.addedBalance}_calcCurrentGradeId(){const a=this._balance.totalBalance;for(const e in this._grades){const t=this._grades[e],n=t.min,r=t.max;if(a>=n&&a<r){this._currentGradeId=Number(e);break}}}getCurrentGrade(){if(-1===this._currentGradeId)throw new Error("ExperienceBar: текущий грейд не установлен");return this._grades[this._currentGradeId]}}(e);t.setInitBalance(30),a.addEventListener("input",(()=>{const e=a.value;parseFloat(e)>=0&&!isNaN(parseFloat(e))?t.addBalance(parseFloat(e)):""===e&&t.addBalance(0)}));
//# sourceMappingURL=index.e85827e4.js.map