
(function(S){
	var S = KISSY, DOM = S.DOM,Event = S.Event;	doc = document,$1 = S.all;
		//促销活动模块
		var smart = {        
			//将日期 2011-6-27 10:22:30 格式 转为  Date 
			StringToDate: function(DateStr) {
				 if(typeof DateStr=="undefined")
					 return new Date();
				 if(typeof DateStr=="date")
					 return DateStr;
				 var converted = Date.parse(DateStr);
				 var myDate = new Date(converted);
				 if(isNaN(myDate)){
					 DateStr=DateStr.replace(/:/g,"-");
					 DateStr=DateStr.replace(" ","-");
					 DateStr=DateStr.replace(".","-");
					 var arys= DateStr.split('-');
					 switch(arys.length){
					 	case 7 : 
						 	myDate = new Date(arys[0],--arys[1],arys[2],arys[3],arys[4],arys[5],arys[6]);
					        break;
					 	case 6 : 
						 	myDate = new Date(arys[0],--arys[1],arys[2],arys[3],arys[4],arys[5]);
						 	break;
						default: 
							myDate = new Date(arys[0],--arys[1],arys[2]);
							break;
					};
				 };
				 return myDate;
			},
			shareToQzone : function(item_id, title){
				url = 'http://item.taobao.com/item.htm?id='+item_id;
				window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+encodeURIComponent(url)+'&title'+encodeURIComponent(title));
				return false;
			},
			shareToSina : function(item_id,title){
				url = 'http://item.taobao.com/item.htm?id='+item_id;
				void((function(s,d,e){try{}catch(e){}
				var f='http://v.t.sina.com.cn/share/share.php?',u=url,p=['url=',e(u),'&title=',e(title),'&appkey=1226626340'].join
					('');function a(){if(!window.open([f,p].join(''),'mb',['toolbar=0,status=0,resizable=1,width=620,height=450,left=',(s.width-
					620)/2,',top=',(s.height-450)/2].join('')))u.href=[f,p].join('');};if(/Firefox/.test(navigator.userAgent)){setTimeout(a,0)}
					else{a()}})(screen,document,encodeURIComponent));
			},		
			shareToQq : function(item_id, title){
				url = 'http://item.taobao.com/item.htm?id='+item_id;
				window.open( 'http://v.t.qq.com/share/share.php?url='+encodeURIComponent(url)+'&appkey=&site=&title='+encodeURI(title),'', 'width=700, height=680, top=0, left=0, toolbar=no,menubar=no, scrollbars=no, location=yes, resizable=no, status=no' );
				return false;
			},
			shareToRenren : function(item_id, title){
				url = 'http://item.taobao.com/item.htm?id='+item_id;
				void((function(s,d,e){
					if(/xiaonei\.com/.test(url))return;
					var f='http://share.xiaonei.com/share/buttonshare.do?link=',
						u=url,l=title,p=[e(u),'&title=',e(l)].join('');
					function a(){
						if(!window.open([f,p].join(''),'xnshare',['toolbar=0,status=0,resizable=1,width=626,height=436,left=',(s.width-626)/2,',top=',(s.height-436)/2].join('')))u.href=[f,p].join('');};if(/Firefox/.test(navigator.userAgent))setTimeout(a,0);else a();})(screen,document,encodeURIComponent));
			},
			shareToKaixin : function(item_id, title){
				var url = 'http://item.taobao.com/item.htm?id='+item_id;
				d=document;t=d.selection?(d.selection.type!='None'?d.selection.createRange().text:''):
					(d.getSelection?d.getSelection():'');void(kaixin=window.open('http://www.kaixin001.com/~repaste/repaste.php?&rurl='+escape
					(url)+'&rtitle='+escape(title)+'&rcontent='+escape(d.title),'kaixin'));kaixin.focus();

			},
			shareToDouban : function(item_id, title){
				var url = 'http://item.taobao.com/item.htm?id='+item_id;
				void(function(){var 
					d=document,e=encodeURIComponent,s1=window.getSelection,s2=d.getSelection,s3=d.selection,s=s1?s1():s2?s2():s3?s3.createRange
					().text:'',r='http://www.douban.com/recommend/?url='+e(url)+'&title='+e(title)+'&sel='+e(s)+'&v=1',x=function
					(){if(!window.open(r,'douban','toolbar=0,resizable=1,scrollbars=yes,status=1,width=700,height=680'))
					location.href=r+'&r=1'};if(/Firefox/.test(navigator.userAgent)){setTimeout(x,0)}else{x()}})()
			},
			shareToBaidu : function(item_id, title){
				url = 'http://item.taobao.com/item.htm?id='+item_id;
				window.open('http://apps.hi.baidu.com/share/?title='+encodeURIComponent(title.substring(0,76))+'&url='+encodeURIComponent(url));
				return false;
			},
			getItemVolume : function(uri, id, nick, mode){
				var	infoHandle = function(result){
					DOM.html('#'+id,result.payload);
				}
				var	errorHandle = function(result){
					DOM.html('#'+id,'0');
				}
				var data ="item_id="+id.substr(9)+"&nick="+nick+"&mode="+mode;
				new H.widget.asyncRequest().setURI(uri).setMethod("GET").setHandle(infoHandle).setErrorHandle(errorHandle).setData(data).send();
			},

			getItemCollect : function(uri, id){
				var	infoHandle = function(result){
					DOM.html('#'+id,result.payload);
				}
				var	errorHandle = function(result){
					DOM.html('#'+id,'0');
				}
				var data ="item_id="+id.substr(10);
				new H.widget.asyncRequest().setURI(uri).setMethod("GET").setHandle(infoHandle).setErrorHandle(errorHandle).setData(data).send();
			}
		};
		//对外接口
		if( !H.app.smart ) H.app.smart = smart;
})(KISSY)
