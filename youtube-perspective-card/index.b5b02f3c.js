const e=document.documentElement,t=parseFloat(getComputedStyle(e).getPropertyValue("--mouse-x")),n=parseFloat(getComputedStyle(e).getPropertyValue("--mouse-y"));let i=0,o=0,d=0,r=0,w=0,m=0,u=0,s=0,a=!1;window.addEventListener("pointermove",function(e){w=e.touches?e.touches[0].clientX:e.clientX,m=e.touches?e.touches[0].clientY:e.clientY,w=Math.min(Math.max(w,0),window.innerWidth),m=Math.min(Math.max(m,0),window.innerHeight),u=w/window.innerWidth,s=m/window.innerHeight,a=!0}),window.addEventListener("resize",function(e){w=u*window.innerWidth,m=s*window.innerHeight}),function e(){!1===a&&(w=t*window.innerWidth,m=n*window.innerHeight,u=w/window.innerWidth,s=m/window.innerHeight,i=w,o=m,a=!0),i+=(w-i)*.05,o+=(m-o)*.05;let h=i/window.innerWidth,l=o/window.innerHeight;h=parseFloat(h.toFixed(3)),l=parseFloat(l.toFixed(3)),h!==d&&(document.documentElement.style.setProperty("--mouse-x",h),d=h),l!==r&&(document.documentElement.style.setProperty("--mouse-y",l),r=l),requestAnimationFrame(e)}();
//# sourceMappingURL=index.b5b02f3c.js.map
