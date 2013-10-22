/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,showPages,checkUtil,Calendar,Overlay,beautifyForm) {
	var S = KISSY,DOM = S.DOM, Event = S.Event;
	return  promotionControl = {
		msg :null ,
		msg1 : null,
		isLoad : false,
		paginator:null,
		x : new beautifyForm,
		init : function(){
		
				var Timer = S.later(promotionControl.getPromoItemWait('已暂停'),5000,true,null);
		
				//更新店铺折扣
				promotionControl.getPromoItemNum();
				Event.on('#J_updateDiscount','click',function(){
					DOM.val('#J_isDiscount','1');
				    var diff  = IsExpired();
					if(diff > -5000 ){
						var sucessHandle = function(o) {
							promotionControl.getPromoItemNum();
				 		};
				 		var errorHandle = function(o){
				 			KISSY.Event.fire('.J_TopExpired','click');
				 		};
				 		var data = '';
				  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
		   			}else{
		   				promotionControl.getPromoItemNum();
		   			}
			   });	
				
				Event.on('#J_past','click',function(){
					promotionControl.setExpiredPromo();
			    });
		
				//展开活动类型
				Event.on('.J_promoTypeBtn','mouseenter mouseleave',function(ev){
					 var id = DOM.attr(ev.currentTarget,'pid');
					 var downMore = S.one('#J_promoTypeItems'+id);
					 var display = downMore.css('display');	
					 if(ev.type == 'mouseenter'){
						 downMore.slideDown(0.3);
					 }else{
						 downMore.slideUp(0.1);
					 }
				})
		
				//展示活动列表更多操作
				Event.on('.J_downIcon','mouseenter mouseleave',function(ev){
					 var id = DOM.attr(ev.currentTarget,'pid');
					 if(ev.type == 'mouseenter'){
						 DOM.show('#J_downMore'+id)
					 }else{
						 DOM.hide('#J_downMore'+id)
					 }
				 })

				 Event.delegate(document,'mouseenter mouseleave','.J_listItem',function(ev){
					 if(ev.type == 'mouseenter'){
						 DOM.addClass(ev.currentTarget,'current')
					 }else{
						 DOM.removeClass(ev.currentTarget,'current')
					 }
				});
				 
				 //选择时间
				 new Calendar.DatePicker({
   	               trigger:'.J_tiems',
   	               showTime:true,
   	               autoRender : true,
   	               autoSetValue :true,
   	               delegateTigger :true
				})
				
				 //销毁弹窗						
//				Event.delegate(document,'click','.bui-ext-close',function(){
//					DOM.remove('.bui-dialog');
//				});
				 
				//点击搜索活动隐藏列表
				Event.delegate(document,'click','.J_BackTo',function(){
					DOM.show('#promoList');
					DOM.show('#J_PromoDetail');
	            	DOM.hide('#itemList');
	            	DOM.hide('#J_BackToPromoList');
				})
				
				//修改活动备注hover
				Event.delegate(document,'mouseenter mouseleave','.J_OnClickShopDesc',function(ev){
					 if(ev.type == 'mouseenter'){
						 DOM.addClass(ev.currentTarget,'current')
					 }else{
						 DOM.removeClass(ev.currentTarget,'current')
					 }
				})
				
			 	//获取代码
			 	Event.on(DOM.query('.J_GetTemplet'), "click", function(){
					var getTempletHandle = function(o) {
						promotionControl.msg.hide();
						var str = '<div class="pop-getCode">'+
									'<textarea id="J_Templet_Content" onclick="this.select()">'+o.payload+'</textarea></br>'+
									'鼠标于框内CTRL+C：复制、CTRL+V：粘贴 <a class="J_Copy">点此复制</a>'+
								'</div>';
						var TempletPanel = new Overlay.Dialog({
							title : '获取海报代码',
							width : 440,
							mask:true,
							footerStyle :{'display' : 'none'},
	     	                bodyContent:str
						})
						TempletPanel.show()
						promotionControl.clipboard('.J_Copy','#J_Templet_Content');
					};
					var error = function(o){
						promotionControl.msg.hide();
						new H.widget.msgBox({
						    title:"错误提示",
						    content:o.desc,
						    type:"error"
						});
					};
					var pid = DOM.attr(this,'data');
					var data = "pid="+pid+"&form_key="+FORM_KEY;
					promotionControl.msg = new H.widget.msgBox({
					    title:"",
						dialogType : 'loading',
					    content:'获取代码中，请稍候'	
					});
			 	    new H.widget.asyncRequest().setURI(getTempletUrl).setMethod("GET").setHandle(getTempletHandle).setErrorHandle(error).setData(data).send();
				});
				
				//结束活动
		    	Event.on(DOM.query('.J_Delete'), "click", function(){
		    		 if(!showPermissions('editor_promotion',"促销活动")){
		    			return ;
		    		 }
		    		 var pid = DOM.attr(this,'data');
		    		 var type = DOM.val('#J_TypeId_'+pid);
					 var diff  = IsExpired();
	       			 if(diff > -5000 && type == 10 ){
	      					var sucessHandle = function(o) {
	      						promotionControl.deleteHandle(pid);
	      			 		};
	      			 		var errorHandle = function(o){
	      			 			KISSY.Event.fire('.J_TopExpired','click');
	      			 		};
	      			 		var data = '';
	      			  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
	      			}else{
	  					promotionControl.deleteHandle(pid);
	      			}
			    });
				
				//活动暂停
				Event.on(DOM.query('.J_Pause'), "click", function(){
					 if(!showPermissions('editor_promotion',"编辑促销活动")){
		    			return ;
		    		 }
					 var pid = DOM.attr(this,'data');
					 var diff  = IsExpired();
	       			 if(diff > -5000 ){
	      					var sucessHandle = function(o) {
	      						promotionControl.pausePromo(pid);
	      			 		};
	      			 		var errorHandle = function(o){
	      			 			KISSY.Event.fire('.J_TopExpired','click');
	      			 		};
	      			 		var data = '';
	      			  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
	      			}else{
	  					promotionControl.pausePromo(pid);
	      			}
			    });
				
				/*重启活动授权*/
				Event.on(DOM.query('.J_Restart'), "click", function(){
					if(!showPermissions('editor_promotion',"重启促销活动")){
		    			return ;
		    		 }
					 var pid = DOM.attr(this,'data');
					 var diff  = IsExpired();
	       			 if(diff > -5000 ){
	      					var sucessHandle = function(o) {
	      						promotionControl.restartPromo(pid);
	      			 		};
	      			 		var errorHandle = function(o){
	      			 			KISSY.Event.fire('.J_TopExpired','click');
	      			 		};
	      			 		var data = '';
	      			  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
	      			}else{
	  					promotionControl.restartPromo(pid);
	      			}
		    	});
				
				/*更新卖家备注*/
			 	 Event.delegate(document,'click','.J_OnClickShopDesc', function(ev) {
			 		if(!showPermissions('editor_promotion',"编辑促销活动")){
			   			return ;
			   		}
			  		DOM.hide(ev.currentTarget);
			 		var pid = DOM.attr(ev.currentTarget,'data');
			 		var SshopDesc = KISSY.trim(DOM.val('#J_SouceShopDesc_'+pid));
			
					if(!KISSY.one('#J_EditorShopDesc_'+pid)){
						var str ='<input type="text"  class="edit-desc-input" data ="'+pid+'" id="J_InputShopDesc_'+pid+'">';
						DOM.html('#J_ShowEditorDesc_'+pid,str);
					}
					DOM.show('#J_ShowEditorDesc_'+pid);
					Event.on('#J_InputShopDesc_'+pid,'blur',function(){
						KISSY.later(function(){
							DOM.hide('#J_ShowEditorDesc_'+pid);
			 				DOM.show('#J_Promo_'+pid+' .J_OnClickShopDesc');
			 			},200,false,null);
				 	});
					DOM.get('#J_InputShopDesc_'+pid).focus();
					DOM.val('#J_InputShopDesc_'+pid,SshopDesc);
					Event.on('#J_InputShopDesc_'+pid,'focusout',function(ev){
						var pid = DOM.attr(ev.currentTarget,'data');
						var SshopDesc = KISSY.trim(DOM.val('#J_SouceShopDesc_'+pid));
						var shopDesc = KISSY.trim(DOM.val('#J_InputShopDesc_'+pid));
						if(SshopDesc == shopDesc){
							DOM.hide('#J_ShowEditorDesc_'+pid);
					 		DOM.show('#J_Promo_'+pid+' .J_OnClickShopDesc');
							return ;
						}
					 	var sucessHandle = function(o) {
				 			DOM.hide('#J_ShowEditorDesc_'+pid);
				 			if(!shopDesc){
				 				DOM.html('#J_Promo_'+pid+' .J_OnClickShopDesc','<span class="edit-tip">填备注</span>');
					 		}else{
					 			DOM.html('#J_Promo_'+pid+' .J_OnClickShopDesc','注：<em>'+shopDesc+'</em>');
					 		}
				 			DOM.show('#J_Promo_'+pid+' .J_OnClickShopDesc');
				 			DOM.val('#J_SouceShopDesc_'+pid,shopDesc);
				 		};
					 	var error = function(o){
							new H.widget.msgBox({
							    title:"错误提示",
							    content:o.desc,
							    type:"error",
								autoClose : true,
								timeOut : 3000
							});
				 		};
				 		var data = "pid="+pid+"&shop_desc="+encodeURI(shopDesc)+"&form_key="+FORM_KEY;
				  	    new H.widget.asyncRequest().setURI(saveShopDescUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(error).setData(data).send();
					})
			 	 });
			 	 
			 	/*更改活动名称*/
			 	 Event.delegate(document,'click mouseenter mouseleave','.J_EditorPromoName', function(ev) {
					if(ev.type == 'mouseenter'){
						DOM.addClass(ev.currentTarget,'hover');
					}else if(ev.type == 'mouseleave'){
						DOM.removeClass(ev.currentTarget,'hover');
					}else if(ev.type == 'click'){
						if(!showPermissions('editor_promotion',"编辑促销活动")){
				   			return ;
				   		 }
						var pid = DOM.attr(ev.currentTarget,'data');
						var diff  = IsExpired();
		       			 if(diff > -5000 ){
		      					var sucessHandle = function(o) {
		      						promotionControl.editorPromoName(pid);	
		      			 		};
		      			 		var errorHandle = function(o){
		      			 			KISSY.Event.fire('.J_TopExpired','click');
		      			 		};
		      			 		var data = '';
		      			  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
		      			}else{
	  						promotionControl.editorPromoName(pid);
		      			}
					}
			 	});

			 	/*更改活动时间*/
			 	 Event.delegate(document,'click mouseenter mouseleave','.J_EditorPromoTime', function(ev) {
					if(ev.type == 'mouseenter'){
						DOM.addClass(ev.currentTarget,'edit-activity-hover');
					}else if(ev.type == 'mouseleave'){
						DOM.removeClass(ev.currentTarget,'edit-activity-hover');
					}else if(ev.type == 'click'){
						if(!showPermissions('editor_promotion',"编辑促销活动")){
				   			return ;
				   		 }
				 		/*活动授权*/
						var pid = DOM.attr(ev.currentTarget,'data');
						 var diff  = IsExpired();
		       			 if(diff > -5000 ){
		      					var sucessHandle = function(o) {
		      						promotionControl.editorPromoTime(pid);
		      			 		};
		      			 		var errorHandle = function(o){
		      			 			KISSY.Event.fire('.J_TopExpired','click');
		      			 		};
		      			 		var data = '';
		      			  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
		      			}else{
	  						promotionControl.editorPromoTime(pid);
		      			}
					}
			 	});
			},
			
			//暂停等待处理
	        getPromoItemWait : function(txt){
				var list = DOM.query('.J_Refresh_Flag');
				if(list.length > 0){
					var sucess = function(o){
		        		var items = o.payload;
						var len = items.length; 
						for (var i=0; i<len; i++) {
							DOM.html('#J_promoStatus'+items[i].id,txt);
							DOM.removeClass('#J_Refresh_'+items[i].id,'J_Refresh_Flag');
						}
					};
			 		var ids = [];
			 		S.each(list,function(item){
			 			var id = DOM.val(item);
			 			ids.push(id);
			 		});
			 		var promo_ids = ids.join(',');
			 		var data = 'promo_ids='+promo_ids;
			  	    new H.widget.asyncRequest().setURI(getPromoStatusUrl).setMethod("POST").setHandle(sucess).setData(data).send(); 
				}
	        },
			
			//获取店铺设置的折扣
	        getPromoItemNum : function(discount){
	        	var sucess = function(o){
	        		DOM.hide('#J_loadingDiscount');
	        		DOM.show('#J_storeDiscount');
	        		DOM.text('#J_storeDiscount',o.payload+' 折');
				};
		 		var error = function(o){
		 			DOM.hide('#J_loadingDiscount');
		 			DOM.show('#J_storeDiscount');
		 			DOM.text('#J_storeDiscount','获取不到');
		 		};
		 		DOM.show('#J_loadingDiscount');
		 		DOM.hide('#J_storeDiscount');
		 		var isLoading = DOM.val('#J_isDiscount');
		 		var data = 'fg='+isLoading;
		  	    new H.widget.asyncRequest().setURI(getLowestDisUrl).setMethod("GET").setHandle(sucess).setErrorHandle(error).setData(data).send(); 
	        },
			
			/*复制功能*/
			clipboard: function(el,contain){
				Event.on(el,'click',function(ev){
					var copy = DOM.val(contain);
					if (window.clipboardData){
						 window.clipboardData.clearData();
						 window.clipboardData.setData("Text", copy);
						 new H.widget.msgBox({ 
						 			type: "success", 
						 			content: "已成功复制",
									dialogType:"msg", 
									autoClose:true, 
									timeOut:3000
								});
						
					}else if (window.netscape){
							 try{
									netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
								}catch(e){
									 new H.widget.msgBox({ 
							 			type: "error", 
							 			content: "您的firefox安全限制限制您进行剪贴板操作，请打开'about:config'将signed.applets.codebase_principal_support'设置为true'之后重试，相对路径为firefox根目录/greprefs/all.js",
										dialogType:"msg", 
										autoClose:true, 
										timeOut:5000
									});
									return false;
								}
							var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
							if (!clip) return;
							var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
							if (!trans) return;
							trans.addDataFlavor('text/unicode');
							var str = new Object();
							var len = new Object();
							var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
							var copytext=copy;
							str.data=copytext;
							trans.setTransferData("text/unicode",str,copytext.length*2);
							var clipid=Components.interfaces.nsIClipboard;
							if (!clip) return false;
							clip.setData(trans,null,clipid.kGlobalClipboard);
							 new H.widget.msgBox({ 
					 			type: "success", 
					 			content: "已成功复制",
								dialogType:"msg", 
								autoClose:true, 
								timeOut:3000
							});
						}else if(KISSY.UA.core == 'webkit'){
							 new H.widget.msgBox({ 
					 			type: "error", 
					 			content: "该浏览器暂不支持，请用 Ctrl+c 复制",
								dialogType:"msg", 
								autoClose:true, 
								timeOut:3000
							});
						}
					return false;
				})
			},
			
			pausePromo : function(pid){
				var pauseHandle = function(o) {
					new H.widget.msgBox({
					    title: "暂停活动",
					    content: "暂停活动将会取消您设置的促销活动",
					    type: "confirm",
					    buttons: [{ value: "暂停" }, { value: "取消" }],
					    success: function (result) {
					        if (result == "暂停") {
					            var data = "pid="+pid+"&form_key="+FORM_KEY;
								var successHandle = function(o){
//									 new H.widget.msgBox({
//									    type:"sucess",
//										dialogType : 'msg',
//									    content:'活动暂停成功',
//									    autoClose:true,
//									    timeOut:3000
//									});
//								  	window.location.href=currentPageUrl;
									DOM.text('#J_promoStatus'+pid,'正在暂停');
									DOM.hide('#J_listAddItem'+pid);
									DOM.addClass('#J_Refresh_'+pid,'J_Refresh_Flag');
									S.later(promotionControl.getPromoItemWait('已暂停'),5000,true,null);
								}
								var errorHandle = function(o){
									if(o.desc == 'need-oauth'){
										 KISSY.Event.fire('.J_TopExpired','click');
										 return ;
									}
									new H.widget.msgBox({
									    title:"错误提示",
									    content:o.desc,
									    type:"error"
									});
								}
					     	    new H.widget.asyncRequest().setURI(pauseUrl).setMethod("GET").setHandle(successHandle).setErrorHandle(errorHandle).setData(data).send();
					        }
					    }
					})
	    		};
	    		var error = function(o){
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					})
	    		};
	    		var data = "pid="+pid+"&form_key="+FORM_KEY;
	     	    new H.widget.asyncRequest().setURI(getPromoTimeUrl).setMethod("GET").setHandle(pauseHandle).setErrorHandle(error).setData(data).send();
			},
			
			restartPromo : function(pid){
				var changeTimeHandle = function(o) {
	    			promotionControl.msg.hide();
					var typeId = DOM.val('#J_TypeId_'+pid);
					if(typeId == 10){
						var title = '开始时间 ：立即开始';
						var inputType = 'hidden';
					}else{
						var title = '开始时间：';
						var inputType = 'text';
					}
					var str = '<div class="pop-restart">'+
								'<div class="restart-tiem">开始时间： <input type="'+ inputType +'" value="'+ o.payload.stime +'" id="J_stime" class="input-text-1 input-text J_tiems"/></div>'+
								'<div class="restart-tiem">结束时间： <input type="text" value="'+ o.payload.etime +'" id="J_etime" class="input-text-1 input-text J_tiems"/></div>'+
							'</div>';
					new Overlay.Dialog({ 
						title : '重启活动',
						width : 480,
						height : 230,
						mask:true,
		 	            buttons:[
			                   {
			                     text:'确定修改',
			                     elCls : 'bui-button bui-button-primary',
			                     handler : function(){
			                	   var successHandle = function(o){
										 new H.widget.msgBox({
										    type:"sucess",
											dialogType : 'msg',
										    content:'活动重启成功',
										    autoClose:true,
										    timeOut:3000
										});
									  	window.location.href=currentPageUrl;
									}
									var errorHandle = function(o){
										if(o.desc == 'need-oauth'){
											 KISSY.Event.fire('.J_TopExpired','click');
											 return ;
										}
										new H.widget.msgBox({
										    title:"错误提示",
										    content:o.desc,
										    type:"error"
										});
									}
									
									var stime = DOM.val(DOM.get('#J_stime'));
									var etime = DOM.val(DOM.get('#J_etime'));
									var startTime = H.util.stringToDate(S.one('#J_stime').val());
									var endTime = H.util.stringToDate(S.one('#J_etime').val());
									if((endTime !='') && (startTime.getTime() >= endTime.getTime())){
										new H.widget.msgBox({ 
								 			type: "error", 
								 			content: "开始时间不能大于结束时间，请重新选择",
											dialogType:"msg", 
											autoClose:true, 
											timeOut:3000
										});
										return ;
									}
									if((startTime !='') && (endTime.getTime() <= startTime.getTime())){
										new H.widget.msgBox({ 
								 			type: "error", 
								 			content: "结束时间不能小于开始时间，请重新选择",
											dialogType:"msg", 
											autoClose:true, 
											timeOut:3000
										});
										return ;
									}

									var data = "pid="+pid+"&etime="+etime+"&stime="+stime+"&form_key="+FORM_KEY;
						     	    new H.widget.asyncRequest().setURI(restartUrl).setMethod("GET").setHandle(successHandle).setErrorHandle(errorHandle).setData(data).send();
			                	   	this.destroy();
			                     }
			                   },{
			                     text:'取消修改',
			                     elCls : 'bui-button J_buttonCancel',
			                     handler : function(){
			                       	this.destroy();
			                     }
			                   }
			                 ],
			                bodyContent:str
					}).show();
	    		};
	    		var error = function(o){
	    			promotionControl.msg.hide();
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					})
	    		};
	    		promotionControl.msg = new H.widget.msgBox({
				    title:"",
					dialogType : 'loading',
				    content:'获取活动时间，请稍候'	
				})
	    		var data = "pid="+pid+"&form_key="+FORM_KEY;
	     	    new H.widget.asyncRequest().setURI(getPromoTimeUrl).setMethod("GET").setHandle(changeTimeHandle).setErrorHandle(error).setData(data).send();
			},
			
			editorPromoName : function(pid){
				if(DOM.hasClass('#J_Promo_'+pid,'ing')){
					 new H.widget.msgBox({
					    type:"error",
						dialogType : 'msg',
					    content:'活动正在编辑中！',
					    autoClose:true,
					    timeOut:3000
					});
					return ;
				}else{
					DOM.addClass('#J_Promo_'+pid,'ing');
				}
				
		 		DOM.hide('#J_PromoNameBox_'+pid);	
		 		var SpromoName = KISSY.trim(DOM.val('#J_SoucePromoName_'+pid));
		 		var str ='<input type="text" class="edit-name-input" data ="'+pid+'" id="J_InputPromoName_'+pid+'">';
				DOM.html('#J_ShowEditorPromoName_'+pid,str);
				DOM.show('#J_ShowEditorPromoName_'+pid);
				Event.on('#J_InputPromoName_'+pid,'blur',function(){
					DOM.removeClass('#J_Promo_'+pid,'ing');
					KISSY.later(function(){
						DOM.hide('#J_ShowEditorPromoName_'+pid);
		 				DOM.show('#J_PromoNameBox_'+pid);
		 			},200,false,null);
			 	});
				DOM.get('#J_InputPromoName_'+pid).focus();
				DOM.val('#J_InputPromoName_'+pid,SpromoName);
				Event.on('#J_InputPromoName_'+pid,'focusout',function(ev){
						var pid = DOM.attr(ev.currentTarget,'data');
						var SpromoName = KISSY.trim(DOM.val('#J_SoucePromoName_'+pid));
						var NpromoName = KISSY.trim(DOM.val('#J_InputPromoName_'+pid));
						if(SpromoName == NpromoName){
							DOM.hide('#J_ShowEditorPromoName_'+pid);
							DOM.show('#J_PromoNameBox_'+pid);
							DOM.removeClass('#J_Promo_'+pid,'ing');
							return ;
						}
						var result = H.util.isNull(NpromoName);
						var error = result[0];
						var msg = result[1];
						if(error){
							new H.widget.msgBox({
								    title:"错误提示",
								    content:'出错了：'+msg,
								    type:"error"
								});
							DOM.removeClass('#J_Promo_'+pid,'ing');	
				 			return ;
						}
						result = checkUtil.checkSpecTitle(NpromoName);
						error = result[0];
						msg = result[1];
						if(error){
							new H.widget.msgBox({
								    title:"错误提示",
								    content:'出错了：'+msg,
								    type:"error"
								});
							DOM.removeClass('#J_Promo_'+pid,'ing');	
				 			return ;
						}
						var typeId = DOM.val('#J_TypeId_'+pid);
						if(typeId == '2' || typeId == '9' || typeId == '20' ||  typeId == '22'){
							result = checkUtil.checkPromoName(NpromoName);
							error = result[0];
							msg = result[1];
							if(error){
								new H.widget.msgBox({
								    title:"错误提示",
								    content:'出错了：'+msg,
								    type:"error"
								});
								DOM.removeClass('#J_Promo_'+pid,'ing');
					 			return ;
							}
						}
				 		var sucessHandle = function(o) {
				 			DOM.text('#J_editpromoName'+pid,NpromoName);
				 			DOM.val('#J_SoucePromoName_'+pid,NpromoName);
				 		};
				 		var error = function(o){
				 			new H.widget.msgBox({
							    title:"错误提示",
							    content:o.desc,
							    type:"error"
							});
							DOM.removeClass('#J_Promo_'+pid,'ing');
				 		};
				 		var data = "pid="+pid+"&promo_name="+encodeURI(NpromoName)+"&form_key="+FORM_KEY;
				  	    new H.widget.asyncRequest().setURI(savePromoNameUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(error).setData(data).send();
				})	
			},
			
			editorPromoTime : function(pid){
				var SpromoTime = KISSY.trim(DOM.val('#J_SoucePromoStartTime_'+pid));
				var EpromoTime = KISSY.trim(DOM.val('#J_SoucePromoEndTime_'+pid));
				var isPauseing = DOM.val('#J_isPauseing_'+pid);
				var isWillEnd = DOM.val('#J_isWillEnd_'+pid);
				var str = '<div class="pop-restart '+ isPauseing +' '+ isWillEnd +'" id="J_restarts'+ pid +'">'+
							'<div class="restart-tiem">开始时间： <input type="text" value="'+ SpromoTime +'" id="J_startDate_'+ pid +'" class="input-text-1 input-text J_tiems"/></div>'+
							'<div class="restart-tiem">结束时间： <input type="text" value="'+ EpromoTime +'" id="J_endDate_'+ pid +'" class="input-text-1 input-text J_tiems"/>&nbsp;&nbsp;&nbsp;<a id="J_prolong'+ pid +'">立即延长7天</a></div>'+
							'<div class="restart-check"><label for="J_IsRestart'+ pid +'" class="beautify_check"><input type="checkbox" id="J_IsRestart'+ pid +'" value="1">启动活动（该活动处于暂停状态）</label></div>'+
						'</div>'; 
				new Overlay.Dialog({
					title : '编辑活动时间',
					width : 480,
					height : 250,
					mask:true,
	 	            buttons:[
		                   {
		                     text:'保存',
		                     elCls : 'bui-button bui-button-primary',
		                     handler : function(){
		                	   var sucessHandle = function(o) {
		       			  			//window.location.reload();
									DOM.text('#J_listTime'+pid,residue);
									DOM.text('#J_timeS'+pid,s);
									DOM.text('#J_timeE'+pid,e);
									DOM.val('#J_SoucePromoStartTime_'+pid,NSpromoTime);
									DOM.val('#J_SoucePromoEndTime_'+pid,NEpromoTime);
			       		 		};
			       		 		var error = function(o){
			       					new H.widget.msgBox({
			       					    title:"错误提示",
			       					    content:o.desc,
			       					    type:"error"
			       					});
			       		 		};
			       				NSpromoTime = KISSY.trim(DOM.val('#J_startDate_'+pid)),
			       				NEpromoTime = KISSY.trim(DOM.val('#J_endDate_'+pid));
			       				var startTime = H.util.stringToDate(S.one('#J_startDate_'+pid).val());
								var endTime = H.util.stringToDate(S.one('#J_endDate_'+pid).val());
								
								var residue = Math.floor((endTime.getTime() - startTime.getTime())/86400000);
								var s = new Date(startTime).format("MM月dd日 hh:mm");
								var e = new Date(endTime).format("MM月dd日 hh:mm");
								
								if((endTime !='') && (startTime.getTime() >= endTime.getTime())){
									new H.widget.msgBox({ 
							 			type: "error", 
							 			content: "开始时间不能大于结束时间，请重新选择",
										dialogType:"msg", 
										autoClose:true, 
										timeOut:3000
									});
									return ;
								}
								if((startTime !='') && (endTime.getTime() <= startTime.getTime())){
									new H.widget.msgBox({ 
							 			type: "error", 
							 			content: "结束时间不能小于开始时间，请重新选择",
										dialogType:"msg", 
										autoClose:true, 
										timeOut:3000
									});
									return ;
								}
								if((SpromoTime == NSpromoTime) && (EpromoTime == NEpromoTime)){
			       		  	    	this.destroy();
			       					return ;
			       				}
			       				if(DOM.hasClass('#J_restarts'+pid,'pauseing')){
									var isReStart = DOM.prop('#J_IsRestart'+pid,"checked") ? 1 : 0; 
								}else{
									var isReStart = 0; 
								}
			       		 		var data = "pid="+pid+"&start_date="+NSpromoTime+"&end_date="+NEpromoTime+"&isReStart="+isReStart+"&form_key="+FORM_KEY;
			       		  	    new H.widget.asyncRequest().setURI(savePromoTimeUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(error).setData(data).send();
		                	   	this.destroy();
		                     }
		                   },{
		                     text:'取消',
		                     elCls : 'bui-button J_buttonCancel',
		                     handler : function(){
		                       	this.destroy();
		                     }
		                   }
		                 ],
		                bodyContent:str
				}).show();
				promotionControl.x.renderAllCheckbox('#J_restarts'+pid);
				
				//立即延长7天
				Event.on('#J_prolong'+pid,'click',function(ev){
					var start = new Date().format("yyyy-MM-dd hh:mm:ss");
					var e = new Date().getTime() + (86400000 * 7);
					var end = new Date(e).format("yyyy-MM-dd hh:mm:ss")
					DOM.val('#J_startDate_'+pid,start);
					DOM.val('#J_endDate_'+pid,end);
				})
			},
			
			deleteHandle : function(pid) {
				new H.widget.msgBox({
				    title: "删除活动",
				    content: '系统将为您取消此活动设置的促销信息',
				    type: "confirm",
				    buttons: [{ value: "确定删除" }, { value: "取消" }],
				    success: function (result) {
				        if (result == "确定删除") {
							var submitHandle = function(o) {
								 new H.widget.msgBox({
								    type:"sucess",
									dialogType : 'msg',
								    content:'活动已删除',
								    autoClose:true,
								    timeOut:3000
								});
							  	window.location.reload();
							};
							var error = function(o){
								new H.widget.msgBox({
								    title:"错误提示",
								    content:o.desc,
								    type:"error"
								});
							};
							var data = "pid="+pid+"&form_key="+FORM_KEY;
				     	    new H.widget.asyncRequest().setURI(deleteUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(error).setData(data).send();
				        }
				    }
				});
			},
			
			//搜索活动中宝贝
	        searchPromoItems : function() {
				if(!promotionControl.isLoad){
						promotionControl.isLoad = true;		
				}
				DOM.hide('#promoList');
				DOM.show('#itemList');
	            var submitHandle = function(o) {
	            	DOM.hide('#J_LeftLoading');
					DOM.show('#J_MainLeftContent');
					DOM.hide('#J_PromoDetail');
					DOM.show('#J_BackToPromoList');
	        	    totalRecords = o.payload.totalRecords;
					if(totalRecords > 0){
						DOM.get('#J_LEmpty').style.display = 'none';
						DOM.removeClass(DOM.query(".J_PromotionItemBtnHolder"),'ks-hidden');
					} else {
						DOM.get('#J_LEmpty').style.display = '';
						DOM.addClass(DOM.query(".J_PromotionItemBtnHolder"),'ks-hidden');
					}
					DOM.html('#J_PromoItems',o.payload.body);
					pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
					promotionControl.paginator = new showPages('promotionControl.paginator').setRender(promotionControl.handlePagination).setPageCount(pageCount).printHtml('#J_PromotionItemPaging',2);
	    	    };
	    	    var errorHandle = function(o){
	    	    	DOM.show('#promoList');
	    	    	DOM.show('#J_PromoDetail');
	            	DOM.hide('#itemList');
	            	DOM.hide('#J_BackToPromoList');
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
	    	    };
	    	    if(DOM.val(DOM.get("#J_SearchTitle")) != '关键字、链接、商品编码'){
	    	    	var title = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle"))); //标题
	    	    }else{
	    	    	var title ='';
	    	    }
	    	    var status = DOM.val(DOM.get("#J_SearchStatus"));
		    	var data = "keytitle="+title+'&status='+status;
				DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainLeftContent');
	    	    new H.widget.asyncRequest().setURI(getPromoItemsUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).setDataType('json').send();
			},
	    	handlePagination : function(turnTo) {
		    	pageId = turnTo;
	    		var submitHandle = function(o) {
	    			 totalRecords = o.payload.totalRecords;
	   				if(totalRecords > 0){
	   					DOM.get('#J_LEmpty').style.display = 'none';
	   					DOM.removeClass(DOM.get(".J_PromotionItemBtnHolder"),'ks-hidden');
	   				} else {
	   					DOM.get('#J_LEmpty').style.display = '';
	   					DOM.addClass(DOM.get(".J_PromotionItemBtnHolder"),'ks-hidden');
	   				}
					pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
					DOM.html('#J_PromoItems',o.payload.body);
					promotionControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_PromotionItemPaging',2);
					DOM.hide('#J_LeftLoading');
					DOM.show('#J_MainLeftContent');
		    	};
		    	 if(DOM.val(DOM.get("#J_SearchTitle")) != '关键字、链接、商品编码'){
	    	    	var title = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle"))); //标题
	    	    }else{
	    	    	var title ='';
	    	    }
		   	    var status = DOM.val(DOM.get("#J_SearchStatus"));
		    	var data = "keytitle="+title+'&status='+status+"&page_id="+pageId;
		        DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainLeftContent');
	    	    new H.widget.asyncRequest().setURI(getPromoItemsUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			},
			
			//将活动中宝贝移除
			removePromotionItemHandle : function(promo_itemid,pidi,type) {
				if(!showPermissions('editor_promotion',"编辑促销活动")){
		   			return ;
		   		 }
				 if (type == 'promoItems') {
				 	var typeId = DOM.val('#J_TypeIdItem_'+promo_itemid);
				 }
				 if(typeId == 10){
				 	var diff  = IsExpired();
					 if(diff > -5000 ){
							var sucessHandle = function(o) {
								promotionControl.deletePromotionItemHandle(promo_itemid,pidi,type);
					 		};
					 		var errorHandle = function(o){
					 			KISSY.Event.fire('.J_TopExpired','click');
					 		};
					 		var data = '';
					  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
					 }else{
						promotionControl.deletePromotionItemHandle(promo_itemid,pidi,type);	
					 }
				 }else{
					promotionControl.deletePromotionItemHandle(promo_itemid,pidi,type);
				 }
			},
			
			deletePromotionItemHandle : function(promo_itemid,pidi,type){
				itemIds = [];
				if(type == 'promoItems'){
					DOM.hide('#J_RemovePromo_'+promo_itemid);
					DOM.show('#J_MinLoading_'+promo_itemid);
				}
				if(promo_itemid && pidi){
					itemIds.push(promo_itemid);
					pid = pidi;
				}
				var submitHandle = function(o) {
					if (promotionControl.paginator) {
						promotionControl.paginator.toPage(promotionControl.paginator.page);
					}
					else {
						promotionControl.searchPromoItems();
					}
        	    };
        	    var data = "pid="+pid+"&item_ids="+itemIds+"&form_key="+FORM_KEY;
        	    new H.widget.asyncRequest().setURI(removePromotionItemUrl).setMethod("POST").setHandle(submitHandle).setData(data).send();
			},
			
			//已过期活动数量
			setExpiredPromo : function(){
				var submitHandle = function(o) {
					window.location.href = ExpiredUrl;
				};
				var error = function(o){
					alert(o.desc)
				};
				var data = "";
	     	    new H.widget.asyncRequest().setURI(setExpiredPromoUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(error).setData(data).send();
			}
	}
}, {
    requires: ['utils/showPages/index','./mods/check','bui/calendar','bui/overlay','utils/beautifyForm/index']
});