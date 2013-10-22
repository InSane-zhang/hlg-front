KISSY.add(function(S,showPages,Overlay,Calendar,Tooltip,beautifyForm){
	var S = KISSY,DOM = S.DOM, Event = S.Event;	
	return defenseControl = {
			panel : null,
		   	msg : null,
		   	msgTip : null,
		   	init : function() {
				defenseControl.Form = new beautifyForm();
				defenseControl.searchTbItems();
				Event.delegate(document,'mouseenter','.J_BuyerNick',function(ev){
						var tid = DOM.attr(ev.currentTarget,'data-tid');
						var buyer_nick = DOM.attr(ev.currentTarget,'data-nick');
						var submitHandle = function(o) {
							if(!defenseControl.msgTip){
								defenseControl.msgTip = new Tooltip.Tip({
									trigger : '.J_BuyerNick',
									alignType : 'top', 
									offset : 10,
									elCls : 'ui-tip',
									title : '<div class="time"></div>'
								})
								defenseControl.msgTip.render();	
							}
							DOM.html('.time',o.payload.body)
						};
						var errorHandle = function(o){
							
						};
						var data = "tid="+tid+"&buyer_nick="+buyer_nick;
						new H.widget.asyncRequest().setURI(buyerDetailTbItemsUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).setDataType('json').send();						
				})
				Event.on('.J_Open','click',function(){
					window.location.href = openTbItemsUrl;
				})
				Event.on('.search-btn','click',function(){
					defenseControl.searchTbItems();
				})
				Event.delegate(document,'click','.list-item',function(ev){
					var id = DOM.attr(ev.currentTarget,'data-id');
					//DOM.attr('.J_CheckBox_'+id,'checked',true);
                    var liCheckbox = DOM.get('#J_CheckBox_'+id);
                    if(!liCheckbox.disabled){
	                    if(!liCheckbox.checked){					
	                    	defenseControl.Form.setCheckboxOn('#J_CheckBox_'+id);
	                    }else{
	                    	defenseControl.Form.setCheckboxOff('#J_CheckBox_'+id);
	                    }
                    }
				})
		        var starttime = new Calendar.DatePicker({
			            trigger:'.timing',
			            autoRender : true,
			            showTime : true
			    });					
				Event.delegate(document,'click','.lists',function(ev){
					var type = DOM.attr(ev.currentTarget,'data-type');
					var buyer_nick = DOM.attr(ev.currentTarget,'data-nick');
		 	        var dialog = new Overlay.Dialog({
		 	             title:'加入',
		 	             width:330,
		 	             height:200,
		 	             mask:false,
	     	             buttons:[
		     	                   {
		     	                     text:'确定',
		     	                     elCls : 'bui-button bui-button-primary',
		     	                     handler : function(){
		     	                       this.hide();
		     	                       var memo = DOM.val('#J_TestPlaceholder');
		     	                       defenseControl.add(type,buyer_nick,memo);
		     	                       
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
		 	           dialog.show();
		 	           if(type == '1'){
		 	        	  dialog.set('bodyContent','<div style="text-align: center;font-size:14px;font-weight:bold;"><a class="caps-icon"></a>&nbsp;确定将用户加入黑名单吗？<br/><br/><input type="text" id="J_TestPlaceholder" class="input-text-2 J_Placeholder" name="name_for_it" value="" placeholder="添加备注（10字以内）" style="width:180px;"></div>');
		 	        	  return false;
		 	           }else if(type == '2'){
		 	        	 dialog.set('bodyContent','<div style="text-align: center;font-size:14px;font-weight:bold;"><a class="caps-icon"></a>&nbsp;确定将用户加入白名单吗？<br/><br/><input type="text" id="J_TestPlaceholder" class="input-text-2 J_Placeholder" name="name_for_it" value="" placeholder="添加备注（10字以内）" style="width:180px;"></div>');
		 	        	 return false;
		 	           }		 	           
				})
				Event.on("#J_BottonCheckAll", "click", defenseControl.checkAll);
				
 	    	    Event.on('.J_BatchDelete','click',defenseControl.batchDelete); 			
 	    	    Event.on('.J_BatchAddBlack','click',defenseControl.batchAddBlack); 
 	    	    Event.on('.J_BatchAddWhite','click',defenseControl.batchAddWhite); 
		 	           
			},
			//批量加入黑名单
			batchAddBlack : function() {
	    	    var CheckBox = DOM.query('#J_TbItemList .c_on');
		    	    var len = CheckBox.length;
					var json = [];
	        	    for(i=0; i<len; i++){ 
						var buyer_nick = DOM.attr(CheckBox[i],'data-nick');
						var o = '{"buyer_nick":"' + buyer_nick+ '"}';
						o = eval('(' + o + ')');	
						json.push(o);
	        	    }
					var itemsJson = KISSY.JSON.stringify(json);
	        	var submitHandle = function(o) {
	        		defenseControl.searchTbItems();
	        		defenseControl.Form.setCheckboxOff(DOM.get('#J_BottonCheckAll'));
	        	};
        	    var errorHandle = function(o){
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
        	    	return;
        	    };
				new H.widget.msgBox({ 
			 			type: "sucess", 
			 			content: "系统处理中，请稍等...",
						dialogType:"loading", 
						autoClose:true
						//timeOut:3000
					});
				var data = "items="+itemsJson+"&type="+1;
	        	new H.widget.asyncRequest().setURI(batchAddTbItemsUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			}, 	
			//批量加入白名单
			batchAddWhite : function() {
	    	    var CheckBox = DOM.query('#J_TbItemList .c_on');
		    	    var len = CheckBox.length;
					var json = [];
	        	    for(i=0; i<len; i++){ 
						var buyer_nick = DOM.attr(CheckBox[i],'data-nick');
					var o = '{"buyer_nick":"' + buyer_nick+ '"}';
					o = eval('(' + o + ')');	
					json.push(o);
	        	    }
					var itemsJson = KISSY.JSON.stringify(json);
	        	var submitHandle = function(o) {
	        		defenseControl.searchTbItems();
	        		defenseControl.Form.setCheckboxOff(DOM.get('#J_BottonCheckAll'));
	        	};
        	    var errorHandle = function(o){
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
        	    	return;
        	    };
				new H.widget.msgBox({ 
			 			type: "sucess", 
			 			content: "系统处理中，请稍等...",
						dialogType:"loading", 
						autoClose:true
						//timeOut:3000
					});
				var data = "items="+itemsJson+"&type="+2;
	        	new H.widget.asyncRequest().setURI(batchAddTbItemsUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			}, 			
			//批量删除
			batchDelete : function() {
		    	    var CheckBox = DOM.query('#J_TbItemList .c_on');
 		    	    var len = CheckBox.length;
 					var json = [];
 	        	    for(i=0; i<len; i++){ 
 						var log_id = DOM.attr(CheckBox[i],'data-id');
						var o = '{"log_id":"' + log_id+ '"}';
						o = eval('(' + o + ')');	
						json.push(o);
 	        	    }
 					var itemsJson = KISSY.JSON.stringify(json);
		        	var submitHandle = function(o) {
		        		defenseControl.searchTbItems();
		        		defenseControl.Form.setCheckboxOff(DOM.get('#J_BottonCheckAll'));
		        	};
	        	    var errorHandle = function(o){
						new H.widget.msgBox({
						    title:"错误提示",
						    content:o.desc,
						    type:"error"
						});
	        	    	return;
	        	    };
					new H.widget.msgBox({ 
				 			type: "sucess", 
				 			content: "系统处理中，请稍等...",
							dialogType:"loading", 
							autoClose:true
							//timeOut:3000
						});
					var data = "items="+itemsJson;
		        	new H.widget.asyncRequest().setURI(batchDeleteTbItemsUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			}, 			
			checkAll : function(e) {
				checkBoxs = DOM.query("#J_TbItemList .J_CheckBox");
				len = checkBoxs.length;
				for(i=0; i<len; i++){
					var iid = checkBoxs[i].value;
					if(checkBoxs[i].disabled) continue;
					if(this.checked){
						defenseControl.Form.setCheckboxOn(checkBoxs[i]);
					} else {
						defenseControl.Form.setCheckboxOff(checkBoxs[i]);
					}
				}
			}, 	 			
			add : function(type,buyer_nick,memo){
                var submitHandle = function(o) {
                	defenseControl.searchTbItems();
        	    };
        	    var errorHandle = function(o){
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
        	    };
				var data = "type="+type+"&buyer_nick="+buyer_nick+"&memo="+memo;
        	    new H.widget.asyncRequest().setURI(blackAddTbItemsUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).setDataType('json').send();				
			},
	        searchTbItems : function() {
                var submitHandle = function(o) {
	        	    totalRecords = o.payload.totalRecords;
					if(totalRecords > 0){
						DOM.hide('#J_Empty');
					} else {
						DOM.show('#J_Empty');
					}
					defenseControl.renderItems(o.payload.body);
					pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
					defenseControl.paginator = new showPages('defenseControl.paginator').setRender(defenseControl.handlePagination).setPageCount(pageCount).printHtml('#J_Paging',2);
					//defenseControl.paginator = new showPages('defenseControl.paginator').setRender(defenseControl.handlePagination).setPageCount(pageCount).printHtml('#J_TopPaging',3);
  					DOM.hide('#J_LeftLoading');
 					DOM.show('#J_MainContent');
 					defenseControl.Form = new beautifyForm();
        	    };
        	    var errorHandle = function(o){
        	    	defenseControl.msg.setMsg(o.desc).show();
        	    };
				DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainContent');
				var start_time = DOM.val('#J_start_date');
				var end_time = DOM.val('#J_end_date');
				var q = DOM.val('#J_Search');
				if(q == '订单号、用户昵称'){
					var q = '';
				}else{
					q = q;
				}
				
				var data = "start_time="+start_time+"&end_time="+end_time+"&q="+q+'&page_size='+10;
        	    new H.widget.asyncRequest().setURI(loadTbItemsUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).setDataType('json').send();
			},
			// 渲染 TbItems
			renderItems: function(c) {
        	    DOM.html(DOM.get("#J_TbItemList"), c,true);
	        	Event.on(DOM.query('#J_TbItemList .J_CheckBox'),'click',function(ev){
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
	        				defenseControl.Form.setCheckboxOn(DOM.get('#J_BottonCheckAll'));
	        			}
	        		}else{
	        			defenseControl.Form.setCheckboxOff(DOM.get('#J_BottonCheckAll'));
	        		}
	        	});          	    
			},
			handlePagination : function(turnTo) {
		    	pageId = turnTo;
	    		var submitHandle = function(o) {
	    			 totalRecords = o.payload.totalRecords;
					 if(totalRecords > 0){
						DOM.hide('#J_Empty');
					 } else {
						DOM.show('#J_Empty');
					 }
					 pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
					 defenseControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_Paging',2);
					 defenseControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_TopPaging',3);
					 defenseControl.renderItems(o.payload.body);
					 defenseControl.Form = new beautifyForm();
					 defenseControl.Form.setCheckboxOff(DOM.get('#J_BottonCheckAll'));
  					 DOM.hide('#J_LeftLoading');
 					 DOM.show('#J_MainContent');
		    	};
				var start_time = DOM.val('#J_start_date');
				var end_time = DOM.val('#J_end_date');
				var q = DOM.val('#J_Search');
				if(q == '订单号、用户昵称'){
					var q = '';
				}else{
					q = q;
				}
				
				var data = "start_time="+start_time+"&end_time="+end_time+"&q="+q+'&page_size='+10+"&page_id="+pageId;
				DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainContent');    	    	
        	    new H.widget.asyncRequest().setURI(loadTbItemsUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			}			
					 	
    	}
	
},{
	requires : ['utils/showPages/index','bui/overlay','bui/calendar','bui/tooltip','utils/beautifyForm/index']
});