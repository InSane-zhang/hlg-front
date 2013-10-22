/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,showPages,Overlay,Calendar) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	
	return marketControl = {
				msg : null,
				init : function(){
					 marketControl.searchTbItems();
					 Event.on('.J_NewMarket','click',function(ev){
						window.location.href=addPlanFromTbUrl;
					 })	
					 Event.on('.J_MsgBlack','click',function(ev){
							window.location.href=blackFromTbUrl;
						 })					 
					 Event.delegate(document,'click','.J_Delete',function(ev){
						 var data = DOM.attr(ev.currentTarget,'data');
						 new H.widget.msgBox({
						    title: "删除",
						    content: '确定要删除？',
						    type: "confirm",
						    buttons: [{ value: "确定删除" }, { value: "取消" }],
						    success: function (result) {
						        if (result == "确定删除") {
						        	marketControl.Delete(data);
						        }
						    }
						});
					 })
					 Event.delegate(document,'click','.J_UpdateTime',function(ev){
						 var data = DOM.attr(ev.currentTarget,'data');
						 marketControl.updateTime(data)
					 })					 
					 Event.delegate(document,'click','.J_Update',function(ev){
						 var data = DOM.attr(ev.currentTarget,'data');
						 window.location.href=updatePlansFromTbUrl+'&plan_id='+data;
					 })					 
//				     Event.on('.J_Update','click',function(){
//						  DOM.remove('.bui-dialog');
//				          var dialog = new Overlay.Dialog({
//				             title:'更改状态',
//				             width:340,
//				             height:186,
//				             mask:false,
//				             buttons:[
//			    	                   {
//			    	                     text:'确定',
//			    	                     elCls : 'bui-button bui-button-primary',
//			    	                     handler : function(){
//			    	                       this.hide();
//			    	                     }
//			    	                   },{
//			    	                     text:'取消',
//			    	                     elCls : 'bui-button',
//			    	                     handler : function(){
//			    	                       this.hide();
//			    	                     }
//			    	                   }
//			    	                 ],
//				             bodyContent:'<em class="doubt"></em>修改状态不可撤销，确定要修改为“发送已完成”的状态吗？'
//				           });
//				          dialog.show();
//					})
				     Event.on('.J_Detail','click',function(){
						  DOM.remove('.bui-dialog');
				          var dialog = new Overlay.Dialog({
				             title:'更改状态',
				             width:340,
				             height:186,
				             mask:false,
				             buttons:[
			    	                   {
			    	                     text:'确定',
			    	                     elCls : 'bui-button bui-button-primary',
			    	                     handler : function(){
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
				             bodyContent:'<em class="doubt"></em>修改状态不可撤销，确定要修改为“发送已完成”的状态吗？'
				           });
				          dialog.show();
					})					
				},
				updateTime : function(plan_id){
					  DOM.remove('.bui-dialog');
			          var dialog = new Overlay.Dialog({
			             title:'修改时间',
			             width:340,
			             height:186,
			             mask:false,
			             buttons:[
		    	                   {
		    	                     text:'确定',
		    	                     elCls : 'bui-button bui-button-primary',
		    	                     handler : function(){
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
			             bodyContent:'定时发送：<input id="J_SendTime" name="send_time" class="calendarImg timing" type="text" style="margin-left: 8px;">'
			           });
			          dialog.show();
			          DOM.val('#J_SendTime',DOM.html('.J_Time_'+plan_id));
			          var timing = new Calendar.DatePicker({
				            trigger:'.timing',
				            autoRender : true,
				            showTime:true
				         });
			          Event.on('.bui-button-primary','click',function(){
							var sucessHandle = function(o) {
		 	            		window.location.reload();
		 	            	};
					 		var errorHandle = function(o){
					 		};	  
					 		var send_time = DOM.val('#J_SendTime')
				    	    data= 'plan_id='+plan_id+'&send_time='+send_time;
				    	    new H.widget.asyncRequest().setURI(editPlanFromTbUrl).setMethod("POST").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();			        	  
			          })
				},				
				Delete : function(plan_id){
 	            	var sucessHandle = function(o) {
 	            		window.location.reload();
 	            	};
			 		var errorHandle = function(o){
			 		};	    	    
		    	    data= 'plan_id='+plan_id;
		    	    new H.widget.asyncRequest().setURI(deletePlansFromTbUrl).setMethod("POST").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();					
				},
				searchTbItems : function() {
		            var submitHandle = function(o) {
						DOM.hide('#J_Loading');
						DOM.show('#J_MainContent');
		        	    totalRecords = o.payload.totalRecords;
						if(totalRecords > 0){
	                        DOM.hide('#J_Empty');
	                        DOM.show(".J_ItemSelectBtnHolder");
	                        DOM.show(".J_Content");
	                    } else {
	                        DOM.show('#J_Empty');
	                        DOM.hide(".J_ItemSelectBtnHolder");
	                        DOM.hide(".J_Content");
						}
						marketControl.renderItems(o.payload.body);
						var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
						marketControl.paginator = new showPages('marketControl.paginator').setRender(marketControl.handlePagination).setPageCount(pageCount).printHtml('#J_Paging',2);
		    	    };
		    	    var data = "pageSize=10";
	    	   		DOM.show('#J_Loading');
					DOM.hide('#J_MainContent');
					new H.widget.asyncRequest().setURI(loadPlansFromTbUrl).setMethod("POST").setHandle(submitHandle).setData(data).send();
				},
	            renderItems: function(c) {
	                DOM.html(DOM.get("#J_PromotionItemList"), c);
	            },
	            handlePagination : function(turnTo) {
	                pageId = turnTo;
	                var submitHandle = function(o) {
	                     totalRecords = o.payload.totalRecords;
	                    if(totalRecords > 0){
	                        DOM.hide('#J_Empty');
	                        DOM.show(".J_ItemSelectBtnHolder");
	                    } else {
	                        DOM.show('#J_Empty');
	                        DOM.hide(".J_ItemSelectBtnHolder");
	                    }
	                    var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
	                    marketControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_Paging',2);
	                    marketControl.renderItems(o.payload.body);
	                    DOM.hide('#J_Loading');
	                    DOM.show('#J_MainContent');
	                };
	                var data = "pageSize=10"+"&page_id="+pageId;
	                DOM.show('#J_Loading');
	                DOM.hide('#J_MainContent');
	                new H.widget.asyncRequest().setURI(loadPlansFromTbUrl).setMethod("POST").setHandle(submitHandle).setData(data).send();
	            }				
		}
}, {
    requires: ['utils/showPages/index','bui/overlay','bui/calendar']
});      