const e=document.documentElement,t=parseFloat(getComputedStyle(e).getPropertyValue("--mouse-x")),n=parseFloat(getComputedStyle(e).getPropertyValue("--mouse-y"));let o=0,i=0,d=0,r=0,l=0,m=0,s=!1,u=window.innerWidth,a=window.innerHeight;window.addEventListener("pointermove",function(e){u=window.innerWidth,a=window.innerHeight,l=e.touches?e.touches[0].clientX:e.clientX,m=e.touches?e.touches[0].clientY:e.clientY,l=Math.min(Math.max(l,0),u),m=Math.min(Math.max(m,0),a),s=!0}),window.addEventListener("resize",function(e){let t=window.innerWidth/l;window.innerHeight,console.log(t)}),function e(){u=window.innerWidth,a=window.innerHeight,!1===s&&(l=t*u,m=n*a,o=l,i=m,s=!0),o+=(l-o)*.05,i+=(m-i)*.05;let w=o/u,c=i/a;w=parseFloat(w.toFixed(3)),c=parseFloat(c.toFixed(3)),w!==d&&(document.documentElement.style.setProperty("--mouse-x",w),d=w),c!==r&&(document.documentElement.style.setProperty("--mouse-y",c),r=c),requestAnimationFrame(e)}();
//# sourceMappingURL=index.e99a5689.js.map
