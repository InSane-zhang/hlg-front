
/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,countdown,Overlay) {
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