const e=document.documentElement,t=parseFloat(getComputedStyle(e).getPropertyValue("--mouse-x")),o=parseFloat(getComputedStyle(e).getPropertyValue("--mouse-y"));let n=0,i=0,u=0,m=0,r=!1;function d(e){u=e.touches?e.touches[0].clientX:e.clientX,m=e.touches?e.touches[0].clientY:e.clientY,u=Math.min(Math.max(u,0),window.innerWidth),m=Math.min(Math.max(m,0),window.innerHeight),r=!0}window.addEventListener("mousemove",d),window.addEventListener("touchmove",d),function d(){!1===r&&(u=t*window.innerWidth,m=o*window.innerHeight,n=u,i=m),n+=(u-n)*.05,i+=(m-i)*.05;let a=n/window.innerWidth,l=i/window.innerHeight;a=parseFloat(a.toFixed(3)),l=parseFloat(l.toFixed(3));let s=parseFloat(getComputedStyle(e).getPropertyValue("--mouse-x")),c=parseFloat(getComputedStyle(e).getPropertyValue("--mouse-y"));a!==s&&document.documentElement.style.setProperty("--mouse-x",a),l!==c&&document.documentElement.style.setProperty("--mouse-y",l),requestAnimationFrame(d)}();
//# sourceMappingURL=index.230053ae.js.map
