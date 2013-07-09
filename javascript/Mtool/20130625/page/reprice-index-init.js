/*
combined files : 

page/reprice-index-init

*/
/**
 * @fileOverview 
 * @author  
 */
KISSY.add('page/reprice-index-init',function (S,O) {
    // your code here
    var DOM = S.DOM, Event = S.Event;	
	return reprice = {
			panel : null,
			msg : null,
			checkBoxs : null,  	
			init : function() {
		 		Event.on('#J_CheckAll','click',reprice.CheckAll); //活动中宝贝全选  
				reprice.panel = new O.Dialog({
						      width: 500,
						      headerContent: '确认提交',
						      bodyContent: '',
						      mask: false,
						      align: {
						          points: ['cc', 'cc']
						      },
						      closable :true,
						      draggable: true,
						      aria:true
				});
						
				Event.on('#J_BtnPublish','click',function(){
					if(!showPermissions('editor_tool','工具箱')){return ;}
					if(isVersionPer('tool')){return ;}
			  	  		var diff  = IsExpired();
				 		if(diff > -5000){
							var sucessHandle = function(o) {
									var str = '';
									var scheMe = "您当前设置的改价方案为：<br>";
									if(DOM.attr('#J_Modifytype_1','checked')) {
										scheMe += '统一价:<font color="red">'+DOM.val('#J_Samevalue')+'</font>';
									}else{
										scheMe += '原价 X <font color="red">'+DOM.val('#J_Percent')+'</font>%';
										var priceDiff = parseFloat(DOM.val('#J_PriceDiff'));
										if (priceDiff>=0) {
											scheMe += ' + <font color="red">'+priceDiff+'</font>.';
										} else {
											scheMe += ' - <font color="red">'+priceDiff*(-1)+'</font>.';
										}
										scheMe += ' <br>如原价=100，改后价='+ (parseFloat(DOM.val('#J_Percent'))+priceDiff)+'.';
									}
									scheMe += "<br>点击【确定】开始修改价格，改完后无法恢复，您确认要进行修改吗？";
									str = '<div class="point" style="height: 150px;"><div class="point-w" style="height: auto;"><span class="point-img-2"></span><span class=""><span id="J_ScheMess">'+scheMe+'</span><div class="btm-content btm-margin-15auto" style="width:160px;"><input type="button" id="J_Sure" class="btm-68-orange fl" value="确定" /><input type="button" id="J_Cancel" class="btm-68-gray fl" value="取消" /></div></div></div>';
								reprice.panel.set('bodyContent',str);
								reprice.panel.show();		
								Event.remove('#J_Sure');
								Event.remove('#J_Cancel');
								Event.on('#J_Sure','click',function(ev){
									if(isVersionPer('tool')){return ;}
									ev.preventDefault();
									if(!reprice.checkForm()){
										reprice.panel.hide();
										return false;
									}
									reprice.msg = new H.widget.msgBox({ type: "error",
										                content: "系统正在处理中",
										 				dialogType:"loading"
										            });
									DOM.get('#J_subform').submit();
								})
								Event.on('#J_Cancel','click',function(ev){
									ev.preventDefault();
									reprice.panel.hide();
									return;
								})
								return;
				 			};
				 		var errorHandle = function(o){
				 			KISSY.Event.fire('.J_TopExpired','click');
				 		};
				 		var data = '';
				  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
					}else{
							var str = '';
									var scheMe = "您当前设置的改价方案为：<br>";
									if(DOM.attr('#J_Modifytype_1','checked')) {
										scheMe += '统一价:<font color="red">'+DOM.val('#J_Samevalue')+'</font>';
									}else{
										scheMe += '原价 X <font color="red">'+DOM.val('#J_Percent')+'</font>%';
										var priceDiff = parseFloat(DOM.val('#J_PriceDiff'));
										if (priceDiff>=0) {
											scheMe += ' + <font color="red">'+priceDiff+'</font>.';
										} else {
											scheMe += ' - <font color="red">'+priceDiff*(-1)+'</font>.';
										}
										scheMe += ' <br>如原价=100，改后价='+ (parseFloat(DOM.val('#J_Percent'))+priceDiff)+'.';
									}
									scheMe += "<br>点击【确定】开始修改价格，改完后无法恢复，您确认要进行修改吗？";
									str = '<div class="point" style="height: 150px;"><div class="point-w" style="height: auto;"><span class="point-img-2"></span><span class=""><span id="J_ScheMess">'+scheMe+'</span><div class="btm-content btm-margin-15auto" style="width:160px;"><input type="button" id="J_Sure" class="btm-68-orange fl" value="确定" /><input type="button" id="J_Cancel" class="btm-68-gray fl" value="取消" /></div></div></div>';
								reprice.panel.set('bodyContent',str);
								reprice.panel.show();		
								Event.remove('#J_Sure');
								Event.remove('#J_Cancel');
								Event.on('#J_Sure','click',function(ev){
									if(isVersionPer('tool')){return ;}
									ev.preventDefault();
									if(!reprice.checkForm()){
										reprice.panel.hide();
										return false;
									}
									reprice.msg = new H.widget.msgBox({ type: "error",
										                content: "系统正在处理中",
										 				dialogType:"loading"
										            });
									DOM.get('#J_subform').submit();
								})
								Event.on('#J_Cancel','click',function(ev){
									ev.preventDefault();
									reprice.panel.hide();
									return;
								})
						
					}
					
				});
				
				
			},
			
			//宝贝全选
			CheckAll : function(e) {
				if(!reprice.checkBoxs){
					var checkBoxs = DOM.query('#J_PromotionItemList1 .J_CheckBox');
				}else{
					var checkBoxs = rebaseprop.checkBoxs;
				}
				var len = checkBoxs.length;
				for(i=0; i<len; i++){
					var iid = checkBoxs[i].value;
					if(checkBoxs[i].disabled) continue;
					if(this.checked){
						checkBoxs[i].checked = true;
					} else {
						checkBoxs[i].checked = false;
					}
				}
			},
			//批量上传重试
			addSelectItemsRetryReprice : function() {
				if(!showPermissions('editor_tool','工具箱')){return ;}
				if(isVersionPer('tool')){return ;}
				var diff  = IsExpired();
				if(diff > -5000){
					var sucessHandle = function(o) {
						if(!reprice.checkBoxs){
							var checkBoxs = DOM.query('#J_PromotionItemList1 .J_CheckBox');
						}else{
							var checkBoxs = rebaseprop.checkBoxs;
						}
						reprice.msg = new H.widget.msgBox({ type: "error",
				            content: "系统正在处理中",
							dialogType:"loading"
				           
				        });
						var len = checkBoxs.length;
						var m=0;
						var json = [];
						for(i=0; i<len; i++){
							if(checkBoxs[i].checked && !checkBoxs[i].disabled){
								id = checkBoxs[i].value;
								var reprice_item_id = DOM.val(DOM.get('#J_Repriceitem_'+id));
								var new_price = DOM.val(DOM.get('#J_NewPrice_'+id));
								var o = '{"item_id":"' + id + '","reprice_item_id":"' + reprice_item_id +'", "new_price":"' + new_price + '"}';
								o = eval('(' + o + ')');						
								json.push(o);
								m++;
							}
						}
						if(m == 0){
							reprice.msg.hide();
							new H.widget.msgBox({
									    title:"错误提示",
									    content:'未选择任何宝贝！',
									    type:"error",
										autoClose:true,
										timeOut :1000						
									});
					
					                return;
					    }				 
						var itemsJson = KISSY.JSON.stringify(json);
						var data = "itemIds="+itemsJson;
						var submitHandle = function(o) {
							reprice.msg.hide();
		        	 		new H.widget.msgBox({ 
					 			type: "sucess", 
					 			content: "成功修改",
								dialogType:"msg", 
								autoClose:true, 
								timeOut:3000
							});
					    };
					    var errorHandle = function(o){
					    	reprice.msg.hide();
					    	new H.widget.msgBox({
									    title:"错误提示",
									    content:o.desc,
									    type:"error"
							});	
					    };
					    new H.widget.asyncRequest().setURI(retryRepriceUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
					    return;
					};
			 		var errorHandle1 = function(o){
			 			KISSY.Event.fire('.J_TopExpired','click');
			 		};
			 		var data = '';
			  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle1).setData(data).send();
				}else{
					if(!reprice.checkBoxs){
						var checkBoxs = DOM.query('#J_PromotionItemList1 .J_CheckBox');
					}else{
						var checkBoxs = rebaseprop.checkBoxs;
					}
					reprice.msg = new H.widget.msgBox({ type: "error",
			            content: "系统正在处理中",
						dialogType:"loading"
			           
			        });
					var len = checkBoxs.length;
					var m=0;
					var json = [];
					for(i=0; i<len; i++){
						if(checkBoxs[i].checked && !checkBoxs[i].disabled){
							id = checkBoxs[i].value;
							var reprice_item_id = DOM.val(DOM.get('#J_Repriceitem_'+id));
							var new_price = DOM.val(DOM.get('#J_NewPrice_'+id));
							var o = '{"item_id":"' + id + '","reprice_item_id":"' + reprice_item_id +'", "new_price":"' + new_price + '"}';
							o = eval('(' + o + ')');						
							json.push(o);
							m++;
						}
					}
					if(m == 0){
						reprice.msg.hide();
						new H.widget.msgBox({
								    title:"错误提示",
								    content:'未选择任何宝贝！',
								    type:"error",
									autoClose:true,
									timeOut :1000						
								});
				
				                return;
				    }
					
					var itemsJson = KISSY.JSON.stringify(json);
					var data = "itemIds="+itemsJson;
					var submitHandle = function(o) {
						reprice.msg.hide();
	        	 		new H.widget.msgBox({ 
				 			type: "sucess", 
				 			content: "成功修改",
							dialogType:"msg", 
							autoClose:true, 
							timeOut:3000
						});
				    };
				    var errorHandle = function(o){
				    	reprice.msg.hide();
				    	new H.widget.msgBox({
								    title:"错误提示",
								    content:o.desc,
								    type:"error"
						});	
				    };
				    new H.widget.asyncRequest().setURI(retryRepriceUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
				}
			},
			//单个宝贝失败—--重试
			RetryItemReprice : function(id) {
				if(!showPermissions('editor_tool','工具箱')){return ;}
				if(isVersionPer('tool')){return ;}
				var diff  = IsExpired();
				if(diff > -5000){
					var sucessHandle = function(o) {
						reprice.msg = new H.widget.msgBox({ type: "error",
				            content: "系统正在处理中",
							dialogType:"loading"
				           
				        });
						var json = [];
						var reprice_item_id = DOM.val(DOM.get('#J_Repriceitem_'+id));
						var new_price = DOM.val(DOM.get('#J_NewPrice_'+id));
						var o = '{"item_id":"' + id + '","reprice_item_id":"' + reprice_item_id +'", "new_price":"' + new_price + '"}';
						o = eval('(' + o + ')');						
						json.push(o);
						var itemsJson = KISSY.JSON.stringify(json);
						var data = "itemIds="+itemsJson;
						var submitHandle = function(o) {
							reprice.msg.hide();
		        	 		new H.widget.msgBox({ 
					 			type: "sucess", 
					 			content: "成功修改",
								dialogType:"msg", 
								autoClose:true, 
								timeOut:3000
							});
					    };
					    var errorHandle = function(o){
					    	reprice.msg.hide();
					    	new H.widget.msgBox({
									    title:"错误提示",
									    content:o.desc,
									    type:"error"
							});	
					    };
					    new H.widget.asyncRequest().setURI(retryRepriceUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
					    return;
					};
			 		var errorHandle1 = function(o){
			 			KISSY.Event.fire('.J_TopExpired','click');
			 		};
			 		var data = '';
			  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle1).setData(data).send();
				}else{
						reprice.msg = new H.widget.msgBox({ type: "error",
				            content: "系统正在处理中",
							dialogType:"loading"
				           
				        });
						var json = [];
						var reprice_item_id = DOM.val(DOM.get('#J_Repriceitem_'+id));
						var new_price = DOM.val(DOM.get('#J_NewPrice_'+id));
						var o = '{"item_id":"' + id + '","reprice_item_id":"' + reprice_item_id +'", "new_price":"' + new_price + '"}';
						o = eval('(' + o + ')');						
						json.push(o);
						var itemsJson = KISSY.JSON.stringify(json);
						var data = "itemIds="+itemsJson;
						var submitHandle = function(o) {
							reprice.msg.hide();
		        	 		new H.widget.msgBox({ 
					 			type: "sucess", 
					 			content: "成功修改",
								dialogType:"msg", 
								autoClose:true, 
								timeOut:3000
							});
					    };
					    var errorHandle = function(o){
					    	reprice.msg.hide();
					    	new H.widget.msgBox({
									    title:"错误提示",
									    content:o.desc,
									    type:"error"
							});	
					    };
					    new H.widget.asyncRequest().setURI(retryRepriceUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
				}
			},
			toggleCal : function(){
				if (DOM.attr('#J_Modifytype_1', 'checked')) {
					DOM.hide('.J_CalStrategy');
				} else {
					DOM.show('.J_CalStrategy');
				}
			},
			checkForm: function(){ 	

			  	if(!reprice.checkCategory()){
					new H.widget.msgBox({
									    title:"错误提示",
									    content:'请选择要修改的分类！',
									    type:"error",
										autoClose:true,
										timeOut :2000
									});
			    	return false;
			    }
			    
			    if(!DOM.attr('#J_Modifyonsale', 'checked') && !DOM.attr('#J_Modifyinstock', 'checked')){
			    	
						new H.widget.msgBox({
									    title:"错误提示",
									    content:'请选择要修改的范围！',
									    type:"error",
										autoClose:true,
										timeOut :2000
									});
//						alert("选择要修改的范围！");
			    	return false;
			    }
			    
			    if (DOM.attr('#J_Modifytype_1', 'checked')) {
			    	if (S.trim(DOM.val('#J_Samevalue')) == '') {
			    			new H.widget.msgBox({
									    title:"错误提示",
									    content:'对不起，请输入统一价！',
									    type:"error",
										autoClose:true,
										timeOut :2000
									});
					  	return false;
			    	}
			    } else {
			    	var percent = S.trim(DOM.val('#J_Percent'));
			    	var priceDiff = S.trim(DOM.val('#J_PriceDiff'));
			    	var patt = /^[\+\-]?[0-9]+(\.[0-9]{1,2})?$/;
			    	if( parseInt(percent)<=0 ){
			    			new H.widget.msgBox({
									    title:"错误提示",
									    content:'百分比必须大于0，请确认！',
									    type:"error",
										autoClose:true,
										timeOut :2000
									});
					  	return false;
			    	}
					if (priceDiff != '') {
						if (!patt.test(priceDiff)) {
								new H.widget.msgBox({
									    title:"错误提示",
									    content:'对不起，您输入的差价必须是数字，可以支持小数点后2位！',
									    type:"error",
										autoClose:true,
										timeOut :2000
									});
					  		return false;
						}
					}
			    }
				return true;
			},

			checkCategory: function (){
				var cates = document.getElementsByName('category[]');
				for(var i=0; i<cates.length; i++){
					if(cates[i].checked){
						return true;
					}
				}
				return false;
			}
		}
}, {
    requires: ['overlay']
});
