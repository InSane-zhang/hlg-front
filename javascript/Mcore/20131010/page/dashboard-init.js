/*
combined files : 

utils/countdown/index
page/dashboard-init

*/
/*简易倒计时
*/

KISSY.add('utils/countdown/index',function (S) {
	//循环倒计时
	function countdown(contain, endTime, mode) { //初始化属性 
		var self = this; 
        if (!(self instanceof countdown)) { 
        	return new countdown(contain, endTime, mode); 
        } 
        this.timer = null;
        self.init(contain, endTime, mode);	    
    }
	
	S.mix(countdown.prototype,{
		init: function(contain, endTime, mode) {
 	    	//var n = endTime || 1440; //剩余分钟数
 	    		var self = this;
			if (mode == '' || typeof(mode) == 'undefined') mode = 1;
			if(mode == 1){
				// 天 时 分 秒分 
				DOM.html(DOM.get(contain),' <span class="day"></span>天<span class="hour"></span>时<span class="min"></span>分<span class="sec"></span>秒 ');
			} 
			if(mode == 2){
				//  时 分 秒分 
				DOM.html(DOM.get(contain),' <span class="hour">19</span>时<span class="min">19</span>分<span class="sec">26</span>秒');
			} 
			if(mode == 3){
				//  时 分 秒分 
				DOM.html(DOM.get(contain),'<span class="hour"><b>0</b><b>0</b></span><span class="min"><b>0</b><b>0</b></span><span class="sec"><b>0</b><b>0</b></span>');
			} 
					   
            var fresh = function(data) {
            	var nowtime = new Date(), endtime = data;
				var leftsecond = parseInt((endtime.getTime() - nowtime.getTime()) / 1000);
                d = parseInt((leftsecond / 86400) % 10000);
                h = parseInt((leftsecond / 3600) % 24);
                m = parseInt((leftsecond / 60) % 60);
                s = parseInt(leftsecond % 60);
				if (mode == 3) {
					var h = h + d * 24;
				}	
				if(d>=0 && d<10){
					d= '0'+d;
				}
				if(h>=0 && h<10){
					h = '0'+h;
				}
				if(m>=0 && m<10){
					m = '0'+m;
				}
				if(s>=0 && s<10){
					s = '0'+s;
				}
                if( mode == 1 ){
					DOM.html(DOM.get(contain+' .day'), d);
                	DOM.html(DOM.get(contain+' .hour'), h);
                	DOM.html(DOM.get(contain+' .min'), m);
                	DOM.html(DOM.get(contain+' .sec'), s);
				}
				if( mode == 2 || mode == 3){
					if(mode == 3){
						var h = h.toString();
						var m = m.toString();
						var s = s.toString();
							h = '<b>'+h.charAt(0)+'</b><b>'+h.charAt(1)+'</b>';
							m = '<b>'+m.charAt(0)+'</b><b>'+m.charAt(1)+'</b>';
							s = '<b>'+s.charAt(0)+'</b><b>'+s.charAt(1)+'</b>';
					}
                	DOM.html(DOM.get(contain+' .hour'), h);
                	DOM.html(DOM.get(contain+' .min'), m);
                	DOM.html(DOM.get(contain+' .sec'), s);
				}
				if(leftsecond<=0){
					self.endDo();	
				}
            };
            //S.later(newendtime, n * 60000/*1s*/, true/*setInterval*/, null/*context*/, null);
            if(self.timer){
				self.timer.cancel();
			}
            self.timer = S.later(fresh, 1000 /*1s*/, true/*setInterval*/, null/*context*/, endTime);
		},
		//设置结束时 执行函数
        setRender: function(fn) {
			var self = this;
			this.endDo = fn;
			return this;
		},	
		endDo : function(){
			var self = this;
			self.timer.cancel();	
		}		  	   
	});
	return countdown ;
}, {
    requires: []
});

/**
 * @fileOverview 
 * @author  
 */
KISSY.add('page/dashboard-init',function (S,countdown,Overlay) {
	var S= KISSY,DOM = S.DOM, Event = S.Event;
	return  dashboardControl = {
			msg :null ,
			panel : null,
			init : function(){
					
				dashboardControl.panel = new Overlay.Dialog({
						            title:'',
						            width:400,
						            height:300,
						            mask:false,
						            buttons:[
						                   {
						                     text:'确定',
						                     elCls : 'bui-button bui-button-primary',
						                     handler : function(){
						                       this.hide();
						                     }
						                   },{
						                     text:'关闭',
						                     elCls : 'bui-button',
						                     handler : function(){
						                       this.hide();
						                     }
						                   }
						                 ],
						            bodyContent:''
						         });
				
				Event.on('.list-item','mouseenter mouseleave',function(ev){
					if(ev.type == 'mouseenter')	{
						DOM.addClass(ev.currentTarget,'current');
					}else{
						DOM.removeClass(ev.currentTarget,'current');
					}
				})
				
				var w2Curtime = H.util.stringToDate(DOM.val('#J_W2Curtime')),
				 	warnStartTime = H.util.stringToDate('2013-07-11 22:30:00'),
				 	warnEndTime = H.util.stringToDate('2013-07-12 00:30:00');
//				if(!isVeirfy){
//				if(w2Curtime > warnStartTime && w2Curtime < warnEndTime){
//					var warn_num = typeof(S.Cookie.get('hlg-nowarn')) == 'undefined' ?  0 : S.Cookie.get('hlg-nowarn');
//					if(S.Cookie.get('hlg-nowarn') != 3){
//						new H.widget.msgBox({
//						    title:"重要通知",
//						    content:'亲，为了方便软件到期前对您提醒，麻烦亲们验证下手机号码哦！',
//						    type:"info",
//						    buttons: [{ value: "去验证" }],
//						    success: function (result) {
//									if(DOM.prop('#J_NoticeForNoTitle','checked')){
//										S.Cookie.set('hlg-nowarn', '3', new Date()+60*60*24);
//									}else{
//										warn_num++;
//										S.Cookie.set('hlg-nowarn', warn_num , new Date()+60*60*24);
//									}
//									window.location.href="http://vip.huanleguang.com/vip/index/veirfy?sid="+sid
//				             }
//						});
//					}
//				}
                   dashboardControl.posterShow();
               },
               GetPoster : function(){
            	   var submitHandle = function(o) {	
   					};
	   				var errorHandle = function(o){
	   				};	 
	   				var data = "";
	   				new H.widget.asyncRequest().setURI(updateActivityFlag).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
   	        	},
               //海报展示
               posterShow: function(){
                   var submitHandle = function(o) {
                   		var nowTime = H.util.stringToDate(DOM.val('#J_W2Curtime')),
                           endTime =  H.util.stringToDate(o.payload.end_time);
                  		 var s = H.util.stringToDate(o.payload.begin_time).getTime(), e =endTime.getTime(),n = nowTime.getTime();
                   		if ((s < n) && (n < e)) {
	                           var linkMode = o.payload.link_mode == 1 ? 'target="_blank"': '';
	                           var str = '<a href="'+o.payload.link_url+'" '+linkMode+'  ><img src="'+o.payload.poster_url+'" data-poster-track="'+o.payload.poster_id+'"></a>';
	                           if(o.payload.is_countdown){
	                        	   str += '<div  id="PromoCountDown"></div>';
	                           }
	                           DOM.html(DOM.get('#J_MonitorBox_Dash'),str);
	                           // 倒计时
	                           if(o.payload.is_countdown){
	                                   new countdown('#PromoCountDown',endTime,1);
	                           }
	                           // 弹窗 1
	                           if(o.payload.pop_up){
	                        	   
	                        	   		dashboardControl.panel.set('headerContent','温馨提示');
	                                    dashboardControl.panel.set('bodyContent',o.payload.pop_up_con);
	                                    //dashboardControl.panel.show();                        
	                           }
//	                             KISSY.later(function(){
//	                                     S.io.get(recordingPosterUrl,{
//					                        poster_id :o.payload.poster_id,
//					                        way : 1
//					                      });
//	                             },1000,false)
                   		}
                   };
                   var errorHandle = function(o){
                          
                   }       
               	var data = '';
			   new H.widget.asyncRequest().setURI(getShowPosterUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
         }
	}
   
}, {
    requires: ['utils/countdown/index','bui/overlay']
});
