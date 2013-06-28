## 滚动
lastScrollY ： 离顶部距离多少， 例 -20 距离顶部20px

	lastScrollY=0;
	function heartBeat(){
	 diffY=top.document.documentElement.scrollTop;
	 if (window.top.innerHeight) {
		diffY = window.top.pageYOffset
	 }else if (top.document.documentElement &&top.document.documentElement.scrollTop) {
		diffY = top.document.documentElement.scrollTop
	}else if (top.document.body) {
		diffY = top.document.body.scrollTop;
	}
	 percent=0.5*(diffY-lastScrollY);
	 if(percent>0){
		percent=Math.ceil(percent);
	}else {
 		percent=Math.floor(percent);
	}
	 var f1=document.getElementById('picker');
	 	f1.style.pixelTop+=percent;
	 	lastScrollY=lastScrollY+percent;
	}
	window.setInterval("heartBeat()",20);

demo


   
 
