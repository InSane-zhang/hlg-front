/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,showPages,beautifyForm,Calendar,Overlay) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	
	return listControl = {
		paginator : null,
		listItemsPaginator : null,
		msg : null,
		isTarget : false,
		currentMode : step,
		initFlag1 : false,
    	initFlag2 : false,
		init : function() {
			
			listControl.Form = new beautifyForm();
			var datepicker = new Calendar.DatePicker({
	              trigger:'#J_startDate',
	              maxDate: new Date().getTime()-(24*60*60*1000),
	              showTime:false,
	              autoRender : true,
	              autoSetValue :false
	         })
			datepicker.on('selectedchange',function (e) {
				var startDate   = e.value;
					S.one('#J_startDate').val(e.text);
	        })
	        var datepicker1 = new Calendar.DatePicker({
	              trigger:'#J_endDate',
	              maxDate: new Date().getTime()-(24*60*60*1000),
	              showTime:false,
	              autoRender : true,
	              autoSetValue :false
	         })
			datepicker1.on('selectedchange',function (e) {
				var startDate   = e.value;
					S.one('#J_endDate').val(e.text);
	        })
	        Event.on('.J_Tab','click',function(ev){
	        	var v =DOM.attr(ev.currentTarget,'data');
	        	if(v == '1'){
	        		listControl.show('1');
				}else{
					listControl.show('2');
				}
	        })
			Event.on(DOM.query('.J_Tiger'),'mouseenter mouseleave',function(ev){
				if(ev.type == 'mouseenter'){
					DOM.addClass(ev.currentTarget,'current');
	        	}else{
	        		DOM.removeClass(ev.currentTarget,'current');
	        	}
	        })
	        Event.on(DOM.query('.J_Page'),'click',function(ev){
	        	var v = DOM.attr(ev.currentTarget,'data');
	        	if (listControl.currentMode == '1' ) {
					DOM.removeClass(DOM.query('#J_TopLeft .J_Page'),'active');
					DOM.addClass(ev.currentTarget,'active');
					DOM.html(DOM.get('#J_TopLeft .value'),v);
					DOM.val('#J_SelectItemPage',v);
					listControl.searchTbItems();
				}else{
					DOM.removeClass(DOM.query('#J_TopRight .J_Page'),'active');
					DOM.addClass(ev.currentTarget,'active');
					DOM.html(DOM.get('#J_TopRight .value'),v);
					DOM.val('#J_RightSelectItemPage',v);
					listControl.loadItems();
				}
	        })
	        Event.on('.J_ChooseShowType','click',function(ev){
	        	var val = DOM.attr(ev.currentTarget,'data');
	        	DOM.removeClass('.J_ChooseShowType','current');
	        	DOM.addClass(ev.currentTarget,'current');
	        	listControl.getTabAjax(val);
	        })
	        Event.on('.J_ChooseShowTypeRight','click',function(ev){
	        	var val = DOM.attr(ev.currentTarget,'data');
	        	DOM.removeClass('.J_ChooseShowTypeRight','current');
	        	DOM.addClass(ev.currentTarget,'current');
	        	listControl.getRightTabAjax(val);
	        })
	        listControl.show();
			Event.on('#J_RightSearchBtn','click',function(ev){
				if(listControl.currentMode == '1'){
					listControl.searchTbItems();
				} else if(listControl.currentMode == '2'){
					listControl.loadItems();
				}
			});	
			Event.on("#J_TopCheckAll", "click", listControl.checkAll);
    	    Event.on("#J_BottonCheckAll", "click", listControl.checkAll);
    	    
    	    Event.on("#J_RightCheckAll", "click", listControl.rightCheckAll);
    	    Event.on("#J_RightBottonCheckAll", "click", listControl.rightCheckAll);
    	    
			Event.delegate(document,'click','#J_AddBlackName',function(ev){
					var module_type1='1',module_type2='2',module_type3='3';
					if(!listControl.dialog){
 	        			listControl.dialog = new Overlay.Dialog({
		     	            title:'增加黑名单',
		     	            width:530,
		     	            mask:false,
		     	            buttons:[
			     	                   {
			     	                     text:'确定',
			     	                     elCls : 'bui-button bui-button-primary',
			     	                     handler : function(){
			     	                	   //this.hide();
			     	                	   var submitHandle = function(o){
			     		 	         	    	listControl.dialog.hide();
			     		 						if(o.payload.over_add == '1'){
			     		 						     var dialog = new Overlay.Dialog({
			   						 	             title:'提示',
			   						 	             width:460,
			   						 	             mask:false,
			   					     	             buttons:[
			   						     	                   {
			   						     	                     text:'覆盖设置',
			   						     	                     elCls : 'bui-button bui-button-primary',
			   						     	                     handler : function(){
			   						     	                       listControl.blackOverAdd();
			   						     	                       this.hide();
			   						     	                     }
			   						     	                   },{
			   						     	                     text:'返回编辑',
			   						     	                     elCls : 'bui-button',
			   						     	                     handler : function(){
			   						     	                       this.hide();
			   						     	                       listControl.dialog.show();
			   						     	                     }
			   						     	                   }
			   						     	                 ],
			   						 	             bodyContent:''
			   						 	           });	 	
			   						 	           dialog.show();
			   						 	           dialog.set('bodyContent','<div>'+o.payload.body+'</div>');
			     		 						
			     		 						}else{
				     		 						new H.widget.msgBox({ 
				     							 			type: "sucess", 
				     							 			content: "增加成功",
				     										dialogType:"msg", 
				     										autoClose:true, 
				     										timeOut:3000
				     								});
				     		 						if(listControl.paginator){
				     									listControl.paginator.toPage(listControl.paginator.page);
				     								}else{
				     									listControl.searchTbItems();
				     								}
				     		 					}
			     			         	    };		     	        	 
			     		 	         	    var errorHandle = function(o){
			     		 	         	    	listControl.dialog.hide();
			     								new H.widget.msgBox({
			     								    title:"错误提示",
			     								    content:o.desc,
			     								    type:"error"
			     								});
			     			         	    };
			     			         	    var buyer_nick = DOM.val('#J_Buyer');
			     		     	        	var buyer_mobile = DOM.val('#J_BuyerMobile');
			     		     	        	var memo = DOM.val('#J_memo');
			     		     	        	var module_type = module_type1+module_type2+module_type3;
			     		     	        	ParamsErrorBox = KISSY.one('#J_Black_ParamsErrorBox');
			     		     	        	if(buyer_nick == '' && buyer_mobile == ''){
			     		     	        		DOM.html('#J_Black_ParamsErrorMsg','请输入买家旺旺或者手机号码！');
			     		     	        		if (ParamsErrorBox.css("display")==="none") {
							    	    			ParamsErrorBox.slideDown();														
												}
							    	    		S.later(function(){
							    	    			DOM.hide('#J_Black_ParamsErrorBox');
												},2000,false);
												return;
			     		     	        	}
			     		     	        	if(buyer_mobile != ''){
				     		     	        	if(buyer_mobile.search(/(^((0[1,2]{1}\d{1}-?\d{8})|(0[3-9]{1}\d{2}-?\d{7,8}))$)|(^0?(13[0-9]|15[0-35-9]|18[0123456789]|14[57])[0-9]{8}$)/) == -1){
				     		     	        		DOM.html('#J_Black_ParamsErrorMsg','手机号格式有误，请重新输入！');
				     		     	        		if (ParamsErrorBox.css("display")==="none") {
								    	    			ParamsErrorBox.slideDown();														
													}
								    	    		S.later(function(){
								    	    			DOM.hide('#J_Black_ParamsErrorBox');
													},2000,false);
													return;
												}
			     		     	        	}
			     		     	        	if(memo == ''){
			     		     	        		DOM.html('#J_Black_ParamsErrorMsg','请输入备注内容！');
			     		     	        		if (ParamsErrorBox.css("display")==="none") {
							    	    			ParamsErrorBox.slideDown();														
												}
							    	    		S.later(function(){
							    	    			DOM.hide('#J_Black_ParamsErrorBox');
												},2000,false);
												return;
			     		     	        	}
			     		     	        	if(module_type == ''||module_type == '000'){
			     		     	        		DOM.html('#J_Black_ParamsErrorMsg','请选择黑名单应用模块！');
			     		     	        		if (ParamsErrorBox.css("display")==="none") {
							    	    			ParamsErrorBox.slideDown();														
												}
							    	    		S.later(function(){
							    	    			DOM.hide('#J_Black_ParamsErrorBox');
												},2000,false);
												return;
			     		     	        	}
			     		     	        	
			     		     	        	var type = listControl.currentMode;
			     		     	        	data = 'buyer_nick='+buyer_nick+'&buyer_mobile='+buyer_mobile+'&memo='+memo+'&module_type='+module_type+'&type='+type;
			     			         	    new H.widget.asyncRequest().setURI(addBlackFromTbUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			     			         	    this.hide();
			     	                      	 
			     	                   	 }
			     	                   },{
			     	                     text:'取消',
			     	                     elCls : 'bui-button',
			     	                     handler : function(){
			     	                       this.hide();
			     	                     }
			     	                   }
		     	                 ],
		     	            bodyContent:''
		     	          });
 	        			var cont = '<ul class="ui-about-list"><li><div class="ui-side-list" style="margin-right:10px;font-size:12px;">买家旺旺：</div><div class="ui-content-list"><input type="text" id="J_Buyer" class="input-text-2" style="width:140px;"></div><div class="ui-side-list" style="margin-right:10px;width:55px;font-size:12px;">手机：</div><div class="ui-content-list"><input type="text" id="J_BuyerMobile" class="input-text-2 w-140" style="width:140px;"></div></li><li><div class="ui-side-list" style="margin-right:10px;font-size:12px;">备注：</div><div class="ui-content-list"><textarea style="width:356px;height:60px;border:1px solid #E5E8ED;border-radius:5px;padding:4px;" class="J_Content msgbox " rows="5" cols="50" name="J_memo" id="J_memo" ></textarea></div></li></ul><div style="padding-top:15px;padding-left:60px;margin-bottom:10px;border-top:1px solid #e5e8ed;">黑名单应用模块</div><div id="J_BlackModule"><div style="padding-left:55px;height:30px;line-height:30px;"><label class="beautify_check" for="J_blockcheck1"><input name="itemblack_id" class="J_CheckBox" id="J_blockcheck1" value="1" type="checkbox" >短信黑名单<span style="color:#CCD0D9;">(会员营销短信 、售后物流通知)</span></label></div><div style="padding-left:55px;height:30px;line-height:30px;"><label class="beautify_check" for="J_blockcheck2"><input name="itemblack_id" class="J_CheckBox" id="J_blockcheck2" value="2" type="checkbox" >中差评预警<span style="color:#CCD0D9;">(自动关闭订单)</span></label></div><div style="padding-left:55px;height:30px;line-height:30px;"><label class="beautify_check" for="J_blockcheck3"><input name="itemblack_id" class="J_CheckBox" id="J_blockcheck3" value="3" type="checkbox" >自动评价</label></div></div><div class="ui-msg" style="display: none; width:490px;margin-top:10px;" id="J_Black_ParamsErrorBox"><div class="error-msg"><div class="img-16-1"></div><div class="text-16 color-red" id="J_Black_ParamsErrorMsg"></div></div></div><div class="ui-msg" style="display: none;width:490px;margin-top:10px;" id="J_Black_ParamsSucessBox"><div class="success-msg"><div class="img-16-6"></div><div class="text-16" id="J_Black_ParamsSucessMsg"></div></div></div>';
 	        			listControl.dialog.set('bodyContent',cont);
 	        			listControl.dialog.render();
 	        			listControl.dialog.show();	     	        
 	        		}else{
	        			listControl.dialog.show();
	        			DOM.val('#J_Buyer','');
	        			DOM.val('#J_BuyerMobile','');
	        			DOM.val('#J_memo','');
	        		}
 	        		
 	        		listControl.Form.renderAll('#J_BlackModule');
 	        		listControl.Form.setCheckboxOn('#J_blockcheck1');
 	        		listControl.Form.setCheckboxOn('#J_blockcheck2');
 	        		listControl.Form.setCheckboxOn('#J_blockcheck3');
 	        		Event.on('#J_blockcheck1','click',function(ev){
 	        			if(ev.currentTarget.checked == true){
 	        				module_type1=DOM.val('#J_blockcheck1');
 	        			}else{
 	        				module_type1= '0';
 	        			}
 	        		});
 	        		Event.on('#J_blockcheck2','click',function(ev){
 	        			if(ev.currentTarget.checked == true){
 	        				module_type2=DOM.val('#J_blockcheck2');
 	        			}else{
 	        				module_type2= '0';
 	        			}
 	        		});
 	        		Event.on('#J_blockcheck3','click',function(ev){
 	        			if(ev.currentTarget.checked == true){
 	        				module_type3=DOM.val('#J_blockcheck3');
 	        			}else{
 	        				module_type3= '0';
 	        			}
 	        		});
 	        		
			});
			Event.delegate(document,'click','#J_AddwhiteName',function(ev){
				var module_type2 = '2';
				if(!listControl.dialog){
	        			listControl.dialog = new Overlay.Dialog({
	     	            title:'增加白名单',
	     	            width:530,
	     	            mask:false,
	     	            buttons:[
		     	                   {
		     	                     text:'确定',
		     	                     elCls : 'bui-button bui-button-primary',
		     	                     handler : function(){
		   
		     	                	   var submitHandle = function(o){
		     		 	         	    	listControl.dialog.hide();
		     		 						if(o.payload.over_add == '1'){
		     		 						     var dialog = new Overlay.Dialog({
		   						 	             title:'提示',
		   						 	             width:460,
		   						 	             mask:false,
		   					     	             buttons:[
		   						     	                   {
		   						     	                     text:'覆盖设置',
		   						     	                     elCls : 'bui-button bui-button-primary',
		   						     	                     handler : function(){
		   						     	                       listControl.blackOverAdd();
		   						     	                       this.hide();
		   						     	                     }
		   						     	                   },{
		   						     	                     text:'返回编辑',
		   						     	                     elCls : 'bui-button',
		   						     	                     handler : function(){
		   						     	                       this.hide();
		   						     	                       listControl.dialog.show();
		   						     	                     }
		   						     	                   }
		   						     	                 ],
		   						 	             bodyContent:''
		   						 	           });	 	
		   						 	           dialog.show();
		   						 	           dialog.set('bodyContent','<div>'+o.payload.body+'</div>');
		     		 						
		     		 						}else{
			     		 						new H.widget.msgBox({ 
			     							 			type: "sucess", 
			     							 			content: "增加成功",
			     										dialogType:"msg", 
			     										autoClose:true, 
			     										timeOut:3000
			     								});
			     		 						if(listControl.listItemsPaginator){
						 							listControl.listItemsPaginator.toPage(listControl.listItemsPaginator.page);
						 						}else{
													listControl.loadItems();
												}
			     		 					}
		     			         	    };		     	        	 
		     		 	         	    var errorHandle = function(o){
		     		 	         	    	listControl.dialog.hide();
		     								new H.widget.msgBox({
		     								    title:"错误提示",
		     								    content:o.desc,
		     								    type:"error"
		     								});
		     			         	    };
		     			         	    var buyer_nick = DOM.val('#J_Buyer');
		     		     	        	var buyer_mobile = DOM.val('#J_BuyerMobile');
		     		     	        	var memo = DOM.val('#J_memo');
		     		     	        	var module_type = module_type2;
		     		     	        	ParamsErrorBox = KISSY.one('#J_White_ParamsErrorBox');
		     		     	        	if(buyer_nick == '' && buyer_mobile == ''){
		     		     	        		DOM.html('#J_White_ParamsErrorMsg','请输入买家旺旺或者手机号码！');
		     		     	        		if (ParamsErrorBox.css("display")==="none") {
						    	    			ParamsErrorBox.slideDown();														
											}
						    	    		S.later(function(){
						    	    			DOM.hide('#J_White_ParamsErrorBox');
											},2000,false);
											return;
		     		     	        	}
		     		     	        	if(buyer_mobile != ''){
			     		     	        	if(buyer_mobile.search(/(^((0[1,2]{1}\d{1}-?\d{8})|(0[3-9]{1}\d{2}-?\d{7,8}))$)|(^0?(13[0-9]|15[0-35-9]|18[0123456789]|14[57])[0-9]{8}$)/) == -1){
			     		     	        		DOM.html('#J_White_ParamsErrorMsg','手机号格式有误，请重新输入！');
			     		     	        		if (ParamsErrorBox.css("display")==="none") {
							    	    			ParamsErrorBox.slideDown();														
												}
							    	    		S.later(function(){
							    	    			DOM.hide('#J_White_ParamsErrorBox');
												},2000,false);
												return;
											}
		     		     	        	}
		     		     	        	if(memo == ''){
		     		     	        		DOM.html('#J_White_ParamsErrorMsg','请输入备注内容！');
		     		     	        		if (ParamsErrorBox.css("display")==="none") {
						    	    			ParamsErrorBox.slideDown();														
											}
						    	    		S.later(function(){
						    	    			DOM.hide('#J_White_ParamsErrorBox');
											},2000,false);
											return;
		     		     	        	}
		     		     	        	if(module_type == ''||module_type == '0'){
		     		     	        		DOM.html('#J_White_ParamsErrorMsg','请选择白名单应用模块！');
		     		     	        		if (ParamsErrorBox.css("display")==="none") {
						    	    			ParamsErrorBox.slideDown();														
											}
						    	    		S.later(function(){
						    	    			DOM.hide('#J_White_ParamsErrorBox');
											},2000,false);
											return;
		     		     	        	}
		     		     	        	var type = listControl.currentMode;
		     		     	        	data = 'buyer_nick='+buyer_nick+'&buyer_mobile='+buyer_mobile+'&memo='+memo+'&module_type='+module_type+'&type='+type;
		     			         	    new H.widget.asyncRequest().setURI(addBlackFromTbUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
		     			         	    this.hide();
		     	                      	 
		     	                   	 }
		     	                   },{
		     	                     text:'取消',
		     	                     elCls : 'bui-button',
		     	                     handler : function(){
		     	                       this.hide();
		     	                     }
		     	                   }
	     	                 ],
	     	            bodyContent:''
	     	          });
	        			var cont = '<ul class="ui-about-list"><li><div class="ui-side-list" style="margin-right:10px;font-size:12px;">买家旺旺：</div><div class="ui-content-list"><input type="text" id="J_Buyer" class="input-text-2" style="width:140px;"></div><div class="ui-side-list" style="margin-right:10px;width:55px;font-size:12px;">手机：</div><div class="ui-content-list"><input type="text" id="J_BuyerMobile" class="input-text-2 w-140" style="width:140px;"></div></li><li><div class="ui-side-list" style="margin-right:10px;font-size:12px;">备注：</div><div class="ui-content-list"><textarea style="width:356px;height:60px;border:1px solid #E5E8ED;border-radius:5px;padding:4px;" class="J_Content msgbox " rows="5" cols="50" name="J_memo" id="J_memo" ></textarea></div></li></ul><div style="padding-top:15px;padding-left:60px;margin-bottom:10px;border-top:1px solid #e5e8ed;">白名单应用模块</div><div id="J_whiteModule"><div style="padding-left:55px;height:30px;line-height:30px;"><label class="beautify_check" for="J_whitecheck2"><input name="itemwhite_id" class="J_CheckBox" id="J_whitecheck2" value="2" type="checkbox" >中差评预警<span style="color:#CCD0D9;">(自动关闭订单)</span></label></div></div><div class="ui-msg" style="display: none; width:490px;margin-top:10px;" id="J_White_ParamsErrorBox"><div class="error-msg"><div class="img-16-1"></div><div class="text-16 color-red" id="J_White_ParamsErrorMsg"></div></div></div><div class="ui-msg" style="display: none;width:490px;margin-top:10px;" id="J_White_ParamsSucessBox"><div class="success-msg"><div class="img-16-6"></div><div class="text-16" id="J_White_ParamsSucessMsg"></div></div></div>'; 
	        			listControl.dialog.set('bodyContent',cont);
	        			listControl.dialog.render();
	        			listControl.dialog.show();	     	        
	        		}else{
	        			listControl.dialog.show();
	        			DOM.val('#J_Buyer','');
	        			DOM.val('#J_BuyerMobile','');
	        			DOM.val('#J_memo','');
	        		}
	        		
	        		listControl.Form.renderAll('#J_whiteModule');
	        		listControl.Form.setCheckboxOn('#J_whitecheck2');
	        		Event.remove('#J_whitecheck2');
	        		Event.on('#J_whitecheck2','click',function(ev){
	        			if(ev.currentTarget.checked == true){
	        				module_type2=DOM.val('#J_whitecheck2');
	        				
	        			}else{
	        				module_type2= '0';
	        				
	        			}
	        		});
	        		
	        		
			});
			var timeFunName = null;
			Event.delegate(document,'click','.J_DelGroup',function(ev){
				var buyer_nick = DOM.attr(ev.currentTarget,'pid');
				new H.widget.msgBox({
				    title: "删除分组",
				    content: '确定要删除？',
				    type: "confirm",
				    buttons: [{ value: "确定删除" }, { value: "取消" }],
				    success: function (result) {
				        if (result == "确定删除") {
				        	var data ="buyer_nick="+buyer_nick;
				        	var submitHandle = function(o){
		 						new H.widget.msgBox({ 
							 			type: "sucess", 
							 			content: "删除成功",
										dialogType:"msg", 
										autoClose:true, 
										timeOut:3000
								});
		 						var type = listControl.currentMode;
		 						if(type == 1){
		 							if(listControl.paginator){
			 							listControl.paginator.toPage(listControl.paginator.page);
			 						}else{
										listControl.searchTbItems();
									}
		 						}else{
		 							if(listControl.listItemsPaginator){
			 							listControl.listItemsPaginator.toPage(listControl.listItemsPaginator.page);
			 						}else{
										listControl.loadItems();
									}
		 						}
		 						
			         	    };		     	        	 
		 	         	    var errorHandle = function(o){
								new H.widget.msgBox({
								    title:"错误提示",
								    content:o.desc,
								    type:"error"
								});
			         	    };
			         	   new H.widget.asyncRequest().setURI(deleteBlackItemsUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
				        }
				    }
				});
			});
	        Event.delegate(document,'click dblclick','#J_Batchdel',function(ev){
	        	if(ev.type == 'click'){
		        	 clearTimeout(timeFunName);
		        	 timeFunName = setTimeout(function () {
		        		 listControl.deleteItems()	
                     }, 300); 
	        	}
	        	if(ev.type == 'dblclick') {
               	 clearTimeout(timeFunName); 
               		listControl.deleteItems()
                }
	        });
	        Event.delegate(document,'click dblclick','#J_RightBatchdel',function(ev){
	        	if(ev.type == 'click'){
		        	 clearTimeout(timeFunName);
		        	 timeFunName = setTimeout(function () {
		        		 listControl.deleteItemsRight()	
                     }, 300); 
	        	}
	        	if(ev.type == 'dblclick') {
               	 clearTimeout(timeFunName); 
               		listControl.deleteItemsRight()
                }
	        });
		},
		show : function(mode){
        	if( typeof(mode) != 'undefined'){
        		listControl.currentMode = mode;
        	}else{
        		mode = listControl.currentMode;
        	}
        	DOM.removeClass('.J_Tab','current');
			if (mode == '1' ) {
				if(!listControl.initFlag1){
					listControl.searchTbItems();
					listControl.initFlag1 = true;
				}
				DOM.show('.J_Seach_1');
				DOM.hide('.J_Seach_2');
				DOM.addClass(DOM.query('.J_Tab')[0],'current');
				DOM.get('#main-content-div-1').style.display = '';
				DOM.get('#main-content-div-2').style.display = 'none';
			}
			if (mode == '2') {
				if(!listControl.initFlag2){
					listControl.loadItems();
					listControl.initFlag2 = true;	
				}
				DOM.addClass(DOM.query('.J_Tab')[1],'current');
				DOM.hide('.J_Seach_1');
				DOM.show('.J_Seach_2');
				DOM.get('#main-content-div-1').style.display = 'none';
				DOM.get('#main-content-div-2').style.display = '';
			}
		},
		searchTbItems : function() {
            var submitHandle = function(o) {
				DOM.hide('#J_LeftLoading');
				DOM.show('#J_MainLeftContent');
        	    totalRecords = o.payload.totalRecords;
				if(totalRecords > 0){
					DOM.css(DOM.get('#J_LEmpty') ,'display','none');
					DOM.css(DOM.query(".J_ItemSelectBtnHolder") ,'display' , '');
				} else {
					DOM.css(DOM.get('#J_LEmpty'), 'display' , '');
					DOM.css(DOM.query(".J_ItemSelectBtnHolder") , 'display' , 'none');
				}
				DOM.html('#blackName_num',totalRecords);
				listControl.renderItems(o.payload.body);
				var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
				listControl.paginator = new showPages('listControl.paginator').setRender(listControl.handlePagination).setPageCount(pageCount).printHtml('#J_Paging',2);
				listControl.paginator.setPageCount(pageCount).printHtml('#J_TopPaging',3); 
    	    };
        	 if(DOM.val(DOM.get("#J_SearchTitle")) != '请输入旺旺、手机号'){
    	    	var title = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle"))); //标题
    	    }else{
    	    	var title ='';
    	    }
			var itemPage = DOM.val(DOM.get("#J_SelectItemPage"));//每页多少条
			if(DOM.val(DOM.get("#J_startDate")) != '选择添加时间'){
    	    	var add_time = DOM.val(DOM.get("#J_startDate")); //标题
    	    }else{
    	    	var add_time = '0';
    	    }
			var type = listControl.currentMode;
			var data = "q="+title+"&pageSize="+itemPage+"&add_time="+add_time+"&type="+type;
    	    	
 			DOM.show('#J_LeftLoading');
			DOM.hide('#J_MainLeftContent');
    	    new H.widget.asyncRequest().setURI(loadTbItemsUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
		},
		renderItems: function(c) {
    	    DOM.html(DOM.get("#J_TbItemList"), c);
        	var lis = DOM.query("#J_TbItemList .J_TbItem");
        	Event.on(lis, "mouseenter mouseleave click", function(ev){
        		var el = DOM.get('.J_CheckBox',ev.currentTarget);
        		if(el.disabled) return;
        		if(ev.type == 'mouseenter'){
					DOM.addClass(ev.currentTarget,'current');
        		}else if(ev.type == 'mouseleave'){
					DOM.removeClass(ev.currentTarget,'current');
				}
        	});
        	listControl.Form.setCheckboxOff(DOM.get('#J_BottonCheckAll'));
        	listControl.Form.setCheckboxOff(DOM.get('#J_TopCheckAll'));
        	listControl.Form.renderAll('#J_TbItemList');
        	//DOM.html('#J_SeletedNum',0);
        	Event.on(DOM.query('#J_TbItemList .J_CheckBox'),'click',function(ev){
        		//ev.stopPropagation();
        		var checkBoxs = DOM.query("#J_TbItemList .J_CheckBox");
    			var len = checkBoxs.length;
    			var j = 0 ;
    			for(i=0; i<len; i++){
					if(checkBoxs[i].disabled) continue;
					if(checkBoxs[i].checked){
						j++;
					} 
				}
        		//DOM.html('#J_SeletedNum',j);
        		var iid = ev.currentTarget.value;
        		if(this.checked){
        			var checkBoxs = DOM.query("#J_TbItemList .J_CheckBox");
        			var len = checkBoxs.length;
        			var allFlag = true;
        			for(i=0; i<len; i++){
						if(checkBoxs[i].disabled) continue;
						if(!checkBoxs[i].checked){
							allFlag = false;
							break;
						} 
					}
        			if(allFlag){
        				listControl.Form.setCheckboxOn(DOM.get('#J_BottonCheckAll'));
        				listControl.Form.setCheckboxOn(DOM.get('#J_TopCheckAll'));
        			}
        		}else{
        			listControl.Form.setCheckboxOff(DOM.get('#J_BottonCheckAll'));
        			listControl.Form.setCheckboxOff(DOM.get('#J_TopCheckAll'));
        		}
        	});
		},
		handlePagination : function(turnTo) {
	    	pageId = turnTo;
    		var submitHandle = function(o) {
    			 totalRecords = o.payload.totalRecords;
 				if(totalRecords > 0){
 					DOM.css(DOM.get('#J_LEmpty') ,'display','none');
 					DOM.css(DOM.query(".J_ItemSelectBtnHolder") ,'display' , '');
 				} else {
 					DOM.css(DOM.get('#J_LEmpty'), 'display' , '');
 					DOM.css(DOM.query(".J_ItemSelectBtnHolder") , 'display' , 'none');
 				}
 				DOM.html('#blackName_num',totalRecords);
 				var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
 				listControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_Paging',2);
 				listControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_TopPaging',3);
 				listControl.renderItems(o.payload.body);
 				DOM.hide('#J_LeftLoading');
				DOM.show('#J_MainLeftContent');
	    	};
	    	if(DOM.val(DOM.get("#J_SearchTitle")) != '请输入旺旺、手机号'){
    	    	var title = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle"))); //标题
    	    }else{
    	    	var title ='';
    	    }
			var itemPage = DOM.val(DOM.get("#J_SelectItemPage"));//每页多少条
			if(DOM.val(DOM.get("#J_startDate")) != '选择添加时间'){
    	    	var add_time = DOM.val(DOM.get("#J_startDate")); //标题
    	    }else{
    	    	var add_time ='0';
    	    }
			var type = listControl.currentMode;
			var data = "q="+title+"&pageSize="+itemPage+"&add_time="+add_time+"&type="+type;
	           	data += "&page_id="+pageId;
			   	DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainLeftContent');
    	    new H.widget.asyncRequest().setURI(loadTbItemsUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
		},
		loadItems : function(){
			var submitHandle = function(o) {
				DOM.hide('#J_RightLoading');
				DOM.show('#J_MainRightContent');
        	    totalRecords = o.payload.totalRecords;
				if(totalRecords > 0){
					DOM.css(DOM.get('#J_REmpty') ,'display','none');
					DOM.css(DOM.query(".J_PromotionItemBtnHolder") ,'display' , '');
				} else {
					DOM.css(DOM.get('#J_REmpty'), 'display' , '');
					DOM.css(DOM.query(".J_PromotionItemBtnHolder") , 'display' , 'none');
				}
				DOM.html('#WhiteName_num',totalRecords);
				DOM.html(DOM.get("#J_PromotionItemList"), o.payload.body);
				listControl.renderPromoItems()
				var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
				listControl.listItemsPaginator = new showPages('listControl.listItemsPaginator').setRender(listControl.listItemsPaginationHandle).setPageCount(pageCount).printHtml('#J_PromotionItemPaging',2);
				listControl.listItemsPaginator.setPageCount(pageCount).printHtml('#J_TopRightPaging',3); 
    	    };
        	 if(DOM.val(DOM.get("#J_RightSearchTitle")) != '请输入旺旺、手机号'){
    	    	var title = encodeURIComponent(DOM.val(DOM.get("#J_RightSearchTitle"))); //标题
    	    }else{
    	    	var title ='';
    	    }
			var itemPage = DOM.val(DOM.get("#J_RightSelectItemPage"));//每页多少条
			if(DOM.val(DOM.get("#J_endDate")) != '选择添加时间'){
    	    	var add_time = DOM.val(DOM.get("#J_endDate")); 
    	    }else{
    	    	var add_time = '0';
    	    }
			var type = listControl.currentMode;
			var data = "q="+title+"&pageSize="+itemPage+"&add_time="+add_time+"&type="+type;
    	    	
 			DOM.show('#J_RightLoading');
			DOM.hide('#J_MainRightContent');
    	    new H.widget.asyncRequest().setURI(loadTbItemsUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
		},
		listItemsPaginationHandle : function(turnTo) {
			pageId = turnTo;
    		var submitHandle = function(o) {
    			totalRecords = o.payload.totalRecords;
        	    if(totalRecords > 0){
					DOM.css(DOM.get('#J_REmpty'), 'display','none');	
					DOM.css(DOM.query(".J_PromotionItemBtnHolder"), 'display','');
				} else {
					DOM.css(DOM.get('#J_REmpty'), 'display' , '');
					DOM.css(DOM.query(".J_PromotionItemBtnHolder"), 'display' ,'none');
				}
        	    var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
        	    listControl.listItemsPaginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_PromotionItemPaging',2);
    			listControl.listItemsPaginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_TopRightPaging',3);
    			DOM.html(DOM.get("#J_PromotionItemList") , o.payload.body);
    			listControl.renderPromoItems()
 				DOM.hide('#J_RightLoading');
				DOM.show('#J_MainRightContent');
	    	};
	    	if(DOM.val(DOM.get("#J_RightSearchTitle")) != '请输入旺旺、手机号'){
    	    	var title = encodeURIComponent(DOM.val(DOM.get("#J_RightSearchTitle"))); //标题
    	    }else{
    	    	var title ='';
    	    }
	    	var itemPage = DOM.val(DOM.get("#J_RightSelectItemPage"));//每页多少条
			if(DOM.val(DOM.get("#J_endDate")) != '选择添加时间'){
    	    	var add_time = DOM.val(DOM.get("#J_endDate")); 
    	    }else{
    	    	var add_time = '0';
    	    }
			var type = listControl.currentMode;
			var data = "q="+title+"&pageSize="+itemPage+"&add_time="+add_time+"&type="+type;
				data += "&page_id="+pageId;
			DOM.show('#J_RightLoading');
			DOM.hide('#J_MainRightContent');
    	    new H.widget.asyncRequest().setURI(loadTbItemsUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
		},
		renderPromoItems : function(){
			var lis = DOM.query("#J_PromotionItemList .J_TbItem");
        	Event.on(lis, "mouseenter mouseleave click", function(ev){
        		var el = DOM.get('#'+ev.currentTarget.id+' .J_CheckBox');
        		if(el.disabled) return;
        		if(ev.type == 'mouseenter' || ev.type == 'mouseleave'){
        			DOM.toggleClass(ev.currentTarget, 'current');
        		}
        	})
        	listControl.Form.setCheckboxOff(DOM.get('#J_RightBottonCheckAll'));
        	listControl.Form.setCheckboxOff(DOM.get('#J_RightCheckAll'));
        	listControl.Form.renderAll('#J_PromotionItemList');
        	
        	Event.on(DOM.query('#J_PromotionItemList .J_CheckBox'),'click',function(ev){
        		//ev.stopPropagation();
        		var iid = ev.currentTarget.value;
        		if(this.checked){
        			var checkBoxs = DOM.query("#J_PromotionItemList .J_CheckBox");
        			var len = checkBoxs.length;
        			var allFlag = true;
        			for(i=0; i<len; i++){
						if(checkBoxs[i].disabled) continue;
						if(!checkBoxs[i].checked){
							allFlag = false;
							break;
						} 
					}
        			if(allFlag){
        				listControl.Form.setCheckboxOn(DOM.get('#J_RightBottonCheckAll'));
        				listControl.Form.setCheckboxOn(DOM.get('#J_RightCheckAll'));
        			}
        		}else{
        			listControl.Form.setCheckboxOff(DOM.get('#J_RightBottonCheckAll'));
        			listControl.Form.setCheckboxOff(DOM.get('#J_RightCheckAll'));
        		}
        	});
        		
		},
		
		
		getTabAjax : function(moduletype){
			
			var submitHandle = function(o) {
				DOM.hide('#J_LeftLoading');
				DOM.show('#J_MainLeftContent');
				totalRecords = o.payload.totalRecords;
				if(totalRecords > 0){
 					DOM.css(DOM.get('#J_LEmpty') ,'display','none');
 					DOM.css(DOM.query(".J_ItemSelectBtnHolder") ,'display' , '');
 				} else {
 					DOM.css(DOM.get('#J_LEmpty'), 'display' , '');
 					DOM.css(DOM.query(".J_ItemSelectBtnHolder") , 'display' , 'none');
 				}
				DOM.html('#blackName_num',totalRecords);
				listControl.renderItems(o.payload.body);
				var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
				listControl.paginator = new showPages('listControl.paginator').setRender(listControl.handlePagination).setPageCount(pageCount).printHtml('#J_Paging',2);
				listControl.paginator.setPageCount(pageCount).printHtml('#J_TopPaging',3); 
	    	};
	    	var errorHandle = function(o) {
	    		
	     	};
	     	DOM.show('#J_LeftLoading');
			DOM.hide('#J_MainLeftContent');
	     	var type = listControl.currentMode;
	     	var data = "module_type="+moduletype+"&type="+type;
			new H.widget.asyncRequest().setURI(loadTbItemsUrl).setMethod("POST").setHandle(submitHandle).setData(data).send();
		},
		getRightTabAjax : function(moduletype){
			var submitHandle = function(o) {
				DOM.hide('#J_RightLoading');
				DOM.show('#J_MainRightContent');
				totalRecords = o.payload.totalRecords;
				if(totalRecords > 0){
 					DOM.css(DOM.get('#J_REmpty') ,'display','none');
 					DOM.css(DOM.query(".J_PromotionItemBtnHolder") ,'display' , '');
 				} else {
 					DOM.css(DOM.get('#J_REmpty'), 'display' , '');
 					DOM.css(DOM.query(".J_PromotionItemBtnHolder") , 'display' , 'none');
 				}
				DOM.html('#WhiteName_num',totalRecords);
				DOM.html(DOM.get("#J_PromotionItemList"), o.payload.body);
				listControl.renderPromoItems()
				var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
				listControl.listItemsPaginator = new showPages('listControl.listItemsPaginator').setRender(listControl.listItemsPaginationHandle).setPageCount(pageCount).printHtml('#J_PromotionItemPaging',2);
				listControl.listItemsPaginator.setPageCount(pageCount).printHtml('#J_TopRightPaging',3); 
				
	    	};
	    	var errorHandle = function(o) {
	    		
	     	};
	     	DOM.show('#J_RightLoading');
			DOM.hide('#J_MainRightContent');
	     	var type = listControl.currentMode;
			var data = "module_type="+moduletype+"&type="+type;
			new H.widget.asyncRequest().setURI(loadTbItemsUrl).setMethod("POST").setHandle(submitHandle).setData(data).send();
		},
		deleteItems : function(){
			DOM.attr('#J_Batchdel','disabled',true);
			DOM.addClass('#J_Batchdel','button-disabled');
			checkBoxs = DOM.query("#J_TbItemList .J_CheckBox");
			var json = [];
			var len = checkBoxs.length;
			var error = false;
			for(i=0; i<len; i++){
				if(checkBoxs[i].checked && !checkBoxs[i].disabled){
                    var buy_nick = checkBoxs[i].value;
                    o = '{"buy_nick":"' + buy_nick + '"}';
                    o = eval('(' + o + ')');
                    json.push(o);
				}
            }
			if(json.length == 0){
   			   new H.widget.msgBox({
				    title:"错误提示",
				    content:'未选择任何宝贝'	,
				    autoClose:true,
				    timeOut:1000
				});
				DOM.attr('#J_Batchdel','disabled',false);
				DOM.removeClass('#J_Batchdel','button-disabled');
				return;
			}
            var itemsJson = KISSY.JSON.stringify(json);
            var submitHandle = function(o) {
            	DOM.attr('#J_Batchdel','disabled',false);
            	DOM.removeClass('#J_Batchdel','button-disabled');
   			    new H.widget.msgBox({
				    type:"sucess",
					dialogType : 'msg',
				    content:'删除成功',
				    autoClose:true,
				    timeOut:2000
				});
   			    if(listControl.paginator){
					listControl.paginator.toPage(listControl.paginator.page);
				}else{
					listControl.searchTbItems();
				}
				
    	    };
    	    var errorHandle = function(o) {
    	    	DOM.attr('#J_Batchdel','disabled',false);
    	    	DOM.removeClass('#J_Batchdel','button-disabled');
				 new H.widget.msgBox({
				    type:"error",
				    content:o.desc
				});
        	};
     	    var data = "&buyer_nick="+itemsJson;
    	    new H.widget.asyncRequest().setURI(deleteBlackItemsUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			
		},
		deleteItemsRight : function(){
			DOM.attr('#J_RightBatchdel','disabled',true);
			DOM.addClass('#J_RightBatchdel','button-disabled');
			checkBoxs = DOM.query("#J_PromotionItemList .J_CheckBox");
			var json = [];
			var len = checkBoxs.length;
			var error = false;
			for(i=0; i<len; i++){
				if(checkBoxs[i].checked && !checkBoxs[i].disabled){
                    var buy_nick = checkBoxs[i].value;
                    o = '{"buy_nick":"' + buy_nick + '"}';
                    o = eval('(' + o + ')');
                    json.push(o);
				}
            }
			if(json.length == 0){
   			   new H.widget.msgBox({
				    title:"错误提示",
				    content:'未选择任何宝贝'	,
				    autoClose:true,
				    timeOut:1000
				});
				DOM.attr('#J_RightBatchdel','disabled',false);
				DOM.removeClass('#J_RightBatchdel','button-disabled');
				return;
			}
            var itemsJson = KISSY.JSON.stringify(json);
            var submitHandle = function(o) {
            	DOM.attr('#J_RightBatchdel','disabled',false);
            	DOM.removeClass('#J_RightBatchdel','button-disabled');
   			    new H.widget.msgBox({
				    type:"sucess",
					dialogType : 'msg',
				    content:'删除成功',
				    autoClose:true,
				    timeOut:2000
				});
   			 	if(listControl.listItemsPaginator){
					listControl.listItemsPaginator.toPage(listControl.listItemsPaginator.page);
				}else{
					listControl.loadItems();
				}
    	    };
    	    var errorHandle = function(o) {
    	    	DOM.attr('#J_Batchdel','disabled',false);
    	    	DOM.removeClass('#J_Batchdel','button-disabled');
				 new H.widget.msgBox({
				    type:"error",
				    content:o.desc
				});
        	};
     	    var data = "&buyer_nick="+itemsJson;
    	    new H.widget.asyncRequest().setURI(deleteBlackItemsUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			
		},
		checkAll : function(e) {
			checkBoxs = DOM.query("#J_TbItemList .J_CheckBox");
			len = checkBoxs.length;
			for(i=0; i<len; i++){
				var iid = checkBoxs[i].value;
				if(checkBoxs[i].disabled) continue;
				if(this.checked){
					if(e.currentTarget.id == 'J_TopCheckAll'){
						listControl.Form.setCheckboxOn(DOM.get('#J_BottonCheckAll'));
					}else{
						listControl.Form.setCheckboxOn(DOM.get('#J_TopCheckAll'));
					}
					listControl.Form.setCheckboxOn(checkBoxs[i]);
					//DOM.html('#J_SeletedNum',DOM.val('#J_SelectItemPage'));
				} else {
					if(e.currentTarget.id == 'J_TopCheckAll'){
						listControl.Form.setCheckboxOff(DOM.get('#J_BottonCheckAll'));
					}else{
						listControl.Form.setCheckboxOff(DOM.get('#J_TopCheckAll'));
					}
					listControl.Form.setCheckboxOff(checkBoxs[i]);
					//DOM.html('#J_SeletedNum',0);
				}
			}
		},
		blackOverAdd : function(){
			var type = listControl.currentMode;
			var submitHandle = function(o) {
				new H.widget.msgBox({ 
			 			type: "sucess", 
			 			content: "覆盖成功",
						dialogType:"msg", 
						autoClose:true, 
						timeOut:3000
				});
				
					if(type == 1){
						if(listControl.paginator){
							listControl.paginator.toPage(listControl.paginator.page);
						}else{
							listControl.searchTbItems();
						}
					}else{
						if(listControl.listItemsPaginator){
							listControl.listItemsPaginator.toPage(listControl.listItemsPaginator.page);
						}else{
							listControl.loadItems();
						}
					}
			}
			var errorHandle = function(o){
       	    	listControl.dialog.hide();
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
      	    };
      	    var buyer_nick = DOM.val('#new_buyer_nick');
      	    var buyer_mobile = DOM.val('#new_buyer_mobile');
	     	var memo = DOM.val('#new_memo');
	     	var module_type = DOM.val('#new_module_type');
	     	data = 'buyer_nick='+buyer_nick+'&buyer_mobile='+buyer_mobile+'&memo='+memo+'&module_type='+module_type+'&type='+type;
      	    new H.widget.asyncRequest().setURI(blackOverAddUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
      	    
		},
		rightCheckAll : function(e) {
			//e.stopPropagation();
			checkBoxs = DOM.query("#J_PromotionItemList .J_CheckBox");
			len = checkBoxs.length;
			for(i=0; i<len; i++){
				var iid = checkBoxs[i].value;
				if(checkBoxs[i].disabled) continue;
				if(this.checked){
					if(e.currentTarget.id == 'J_RightCheckAll'){
						listControl.Form.setCheckboxOn(DOM.get('#J_RightBottonCheckAll'));
					}else{
						listControl.Form.setCheckboxOn(DOM.get('#J_RightCheckAll'));
					}
					listControl.Form.setCheckboxOn(checkBoxs[i]);
				} else {
					if(e.currentTarget.id == 'J_RightCheckAll'){
						listControl.Form.setCheckboxOff(DOM.get('#J_RightBottonCheckAll'));
					}else{
						listControl.Form.setCheckboxOff(DOM.get('#J_RightCheckAll'));
					}
					listControl.Form.setCheckboxOff(checkBoxs[i]);
				}
			}
		}
		
	}
}, {
    requires: ['utils/showPages/index','utils/beautifyForm/index','bui/calendar','bui/overlay']
});