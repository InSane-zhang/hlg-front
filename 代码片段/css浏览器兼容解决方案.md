*  #####如何清除图片下方出现几像素的空白间隙？#####
	>办法1：  
		
		img{display:block;}
	>办法2：
	
		img{vertical-align:top;}
		除了top值，还可以设置为text-top | middle | bottom | text-bottom，甚至特定的<length>和<percentage>值都可以
*  #####全兼容浏览器的透明度设置#####
		.transparent{
		    filter:alpha(opacity=50);
		    -moz-opacity:0.5;
		    -khtml-opacity:0.5;
		    opacity:0.5;
		}
*  #####IE中的最小高度#####
		.box {
		    min-height:500px;
		    height:auto !important;
		    height:500px;
		}
*  #####正在读取图片的效果#####
		img {
		    background: url(loader.gif) no−repeat 50% 50%;
		}
*  #####如何使文本溢出边界不换行强制在一行内显示#####
		#test{width:150px;white-space:nowrap;}
*  #####如何清除浮动#####
		1.#test{clear:both;}
		  #test为浮动元素的下一个兄弟元素
		2.#test{display:block;zoom:1;overflow:hidden;}
		  #test为浮动元素的父元素。zoom:1也可以替换为固定的width或height
		3.#test{zoom:1;}
		  #test:after{display:block;clear:both;visibility:hidden;height:0;content:'';}
		  #test为浮动元素的父元素
*  #####如何让未知尺寸的图片在已知宽高的容器内水平垂直居中#####
		#test{display:table-cell;*display:block;*position:relative;width:200px;height:200px;text-align:center;vertical-align:middle;}
		#test p{*position:absolute;*top:50%;*left:50%;margin:0;}
		#test p img{*position:relative;*top:-50%;*left:-50%;vertical-align:middle;}

* #####如何做1像素细边框的table#####
	>办法1：  
	
		#test{border-collapse:collapse;border:1px solid #ddd;}     
	  	#test th,#test td{border:1px solid #ddd;}
		<table id="test">
			<tr><th>姓名</th><td>Joy Du</td></tr>
			<tr><th>年龄</th><td>26</td></tr>
		</table>
	>办法2：  
	
		#test{border-spacing:1px;background:#ddd;}
		#test tr{background:#fff;}
		IE7及更早浏览器不支持border-spacing属性，但是可以通过table的标签属性cellspacing来替代。
		<table id="test" cellspacing="1">
			<tr><th>姓名</th><td>Joy Du</td></tr>
			<tr><th>年龄</th><td>26</td></tr>
		</table>
*  #####如何使页面文本行距始终保持为n倍字体大小的基调？#####
		body{line-height:n;}
*  #####防止IE6下的振动#####
		* html,
		* html body{background-image:url(about:blank); background-attachment:fixed; }
*  #####如何解决IE7及更早浏览器下当li中出现2个或以上的浮动时，li之间产生的空白间隙的BUG？#####
		li{vertical-align:top;}
		除了top值，还可以设置为text-top | middle | bottom | text-bottom，甚至特定的<length>和<percentage>值都可以
*  #####ＩＥ下图片缩放Bug#####
		图片在IE下缩放时会影响其质量， IE下看起图片质量极差
		img { -ms-interpolation-mode: bicubic; }
*  #####固定页脚在页面的底部效果#####
		IE6下的position:fixed是无法正常实现的，往往是我们使用:expression来解决
		#footer {position:fixed; left:0px; bottom:0px; height:30px; width:100%;background:#999; } 
		/* IE 6 */
		* html #footer {position:absolute; top:expression((0-(footer.offsetHeight)+(document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight)+(ignoreMe = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop))+'px'); }
