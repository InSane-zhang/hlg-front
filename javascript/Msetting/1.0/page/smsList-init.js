/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,showPages,Select,Calendar) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	
	return Smslist = {
	    	paginator : null,
			handlePagination :null,
	    	isFisrst : true,
	    	init : function() {
				
				var items4 = [
					{text:'发送类型选择',value:'0'},
					{text:'等待付款通知',value:'1'},
					{text:'延迟发货通知',value:'12'},
					{text:'确认收货通知',value:'13'},
					{text:'领取通知',value:'21'},
					{text:'发货通知',value:'11'},
					{text:'到期通知',value:'22'},
					{text:'使用通知',value:'23'},
					{text:'其它通知',value:'0'},
					{text:'促销通知',value:'31'},
					{text:'中差评预警',value:'66'},
					{text:'差评防御',value:'88'}
				],
				statusSelect = new Select.Select({  
					render:'#J_CaretypeItem',
					valueField:'#J_Caretype',
					items:items4
				});
				statusSelect.render();
				statusSelect.setSelectedValue('0');
				var type = DOM.val('#J_Type');
				if(type != ''){
					statusSelect.setSelectedValue(type);
				}
				statusSelect.on('change', function(ev){
					Smslist.searchTbItems();
				});
				var items3 = [
					{text:'状态',value:'0'},
					{text:'发送成功',value:'2'},
					{text:'发送失败',value:'4'},
					{text:'余额不够',value:'5'}		
				],
				CarestatusSelect = new Select.Select({  
					render:'#J_CareItemstatus',
					valueField:'#J_Carestatus',
					items:items3
				});
				CarestatusSelect.render();
				CarestatusSelect.setSelectedValue('0');
				CarestatusSelect.on('change', function(ev){
					Smslist.searchTbItems();
				});
				var items2 = [
				    {text:'近期记录',value:'0'},
					{text:'历史记录',value:'_history'}
				
				],
				historySelect = new Select.Select({  
					render:'#J_historyItem',
					valueField:'#J_history',
					items:items2
				});
				historySelect.render();
				historySelect.setSelectedValue('0');
				historySelect.on('change', function(ev){
					Smslist.searchTbItems();
				});
				var datepicker = new Calendar.DatePicker({
   	              trigger:'#J_startDate',
   	              showTime:true,
   	              autoRender : true,
   	              autoSetValue :false,
   	              textField  : '2'
   	            });
   	         	var datepicker2 = new Calendar.DatePicker({
   	              trigger:'#J_endDate',
   	              showTime:true,
   	              autoRender : true,
   	              autoSetValue :false,
   	              textField  : '2'
   	            });
   	         
   	         	datepicker.on('selectedchange',function (e) {
   	        	 	var endDate = H.util.stringToDate(S.one('#J_endDate').val());
						var startDate   = e.value;
						if((endDate !='')&&(startDate.getTime() >= endDate.getTime()))
						{
							new H.widget.msgBox({
								    title:"错误提示",
								    content:'开始时间不能大于结束时间，请重新选择',
								    type:"info"
								});
							//S.one('#J_startDate').val('');
						}else{
							S.one('#J_startDate').val(e.text);
						}
   	         	});
   	         	datepicker2.on('selectedchange',function (e) {
		     	       	var endDate   =  e.value;
						var startTime = H.util.stringToDate(S.one('#J_startDate').val());
						var endTime = H.util.stringToDate(endDate);
						if((endTime.getTime() <= startTime.getTime())&&(startTime !='')){
							new H.widget.msgBox({
								    title:"错误提示",
								    content:'结束时间不能小于开始时间，请重新选择',
								    type:"info"
								});
							//S.one('#J_endDate').val('');
						}else{
							S.one('#J_endDate').val(e.text);
						}
   	        	 });
   	         	Event.on(DOM.query('.J_Tiger'),'mouseenter mouseleave',function(ev){
   	         		if(ev.type == 'mouseenter'){
   	         			DOM.addClass(ev.currentTarget,'current');
   	         		}else{
   	         			DOM.removeClass(ev.currentTarget,'current');
   	         		}
   	         	})
	   	        Event.on(DOM.query('.J_Page'),'click',function(ev){
	 	        	var v = DOM.attr(ev.currentTarget,'data');
	 				DOM.removeClass(DOM.query('#J_TopLeft .J_Page'),'active');
	 				DOM.addClass(ev.currentTarget,'active');
	 				DOM.html(DOM.get('#J_TopLeft .value'),v);
	 				DOM.val('#J_SelectItemPage',v);
	 				Smslist.searchTbItems();
	 	        })
	 	        Event.on("#J_LeftSearch", "click", function(){
					Smslist.searchTbItems();
				});
   	         	Smslist.searchTbItems();
   	         	Event.on("#J_TopCheckAll", "click", Smslist.checkAll);
   	         	Event.on("#J_BottonCheckAll", "click", Smslist.checkAll);
   	         	Event.on("#J_GetRetryCount", "click", function(){
				    Smslist.getRetryCount();
				});
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
					DOM.html('#sms_num',totalRecords);
					Smslist.renderItems(o.payload.body);
					var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
					Smslist.paginator = new showPages('Smslist.paginator').setRender(Smslist.handlePagination).setPageCount(pageCount).printHtml('#J_Paging',2);
					Smslist.paginator.setPageCount(pageCount).printHtml('#J_TopPaging',3); 
					
	    	    };
	    	    var Status = DOM.val(DOM.get('#J_Carestatus'));
	    	    var itemPage = DOM.val(DOM.get("#J_SelectItemPage"));//每页多少条
	    	    var data = Smslist.getData();
	    	    	data +="&page_size="+itemPage+"&status="+Status;
    	   		DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainLeftContent');
				new H.widget.asyncRequest().setURI(loadTbItemsUrl).setMethod("POST").setHandle(submitHandle).setData(data).send();
			},
			getData : function(){
				if(DOM.val(DOM.get("#J_SearchNick")) != '请输入旺旺、手机号'){
  	    	    	var buyer_Nick = encodeURIComponent(DOM.val(DOM.get("#J_SearchNick"))); //标题
  	    	    }else{
  	    	    	var buyer_Nick ='';
  	    	    }
  	    	    var Type = DOM.val(DOM.get('#J_Caretype'));
  	    	    var start_at = DOM.val('#J_startDate');
               	var end_at = DOM.val('#J_endDate');
                var history = DOM.val('#J_history');
       	    	var data = "buyer_nick="+buyer_Nick+"&type="+Type+"&start_at="+start_at+"&end_at="+end_at+"&history="+history; 		        	    
	 			return data ;
			},
			renderItems: function(c) {
	    	    DOM.html(DOM.get("#J_TbItemList"), c);
	    	    
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
	 				DOM.html('#sms_num',totalRecords);
	 				var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
	 				Smslist.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_Paging',2);
	 				Smslist.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_TopPaging',3);
	 				Smslist.renderItems(o.payload.body);
	 				DOM.hide('#J_LeftLoading');
					DOM.show('#J_MainLeftContent');
		    	};
		    	var itemPage = DOM.val(DOM.get("#J_SelectItemPage"));//每页多少条
		    	var Status = DOM.val(DOM.get('#J_Carestatus'));
		    	var data = Smslist.getData();
		    		data +="&page_size="+itemPage+"&page_id="+pageId+"&status="+Status;
				DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainLeftContent');
	    	    new H.widget.asyncRequest().setURI(loadTbItemsUrl).setMethod("POST").setHandle(submitHandle).setData(data).send();
			},
			retry :function(id){
				var submitHandle = function(o) {
					if(Smslist.paginator){
						Smslist.paginator.toPage(Smslist.paginator.page);
					}else{
						Smslist.searchTbItems();
					}
				};
				var data = "sms_id="+id;
				new H.widget.asyncRequest().setURI(retryUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			},
			//根据时间和短信类型批量重试
			getRetryCount :function(){
			    var submitHandle = function(o) {
			        if(o.payload.sms_balance == -1){
			            if(o.payload.sms_total <= 0){
    			            new H.widget.msgBox({
    			                title: "温馨提示",
    			                type: "error",
    			                content: "没有符合条件的记录需要重试."
    			            });
			            }else {
    			            new H.widget.msgBox({
    		                    title: "重试",
    		                    type: "confirm",
    		                    content: "需要重试的数目为"+o.payload.sms_total+"条，确定重试？",
    		                    buttons: [{ value: "确定" }],
    		                    success: function (result) {
    		                        if (result == "确定") {
    		                            Smslist.allretry();
    		                        }
    		                    }
    		                });
			            }
			        }else{
    			        new H.widget.msgBox({
    	                    title: "重试",
    	                    type: "confirm",
    	                    content: "需要重试的数目为"+o.payload.sms_total+"条，当前余额为"+o.payload.sms_balance+"条！重试只能发送一部分用户，确定重试？",
    	                    buttons: [{ value: "充值" }, { value: "重试" }],
    	                    success: function (result) {
        			            if (result == "充值") {
        			                window.location.href=smsOrderUrl;
        			            }else if (result == "重试") {
    	                            Smslist.allretry();
    	                        }
    	                    }
    	                });
			        }
			    };
			    var errorHandle = function(o){
			        new H.widget.msgBox({
			            title:"错误提示",
			            content:o.desc,
			            type:"error"
			        });
			    };
			    var data = Smslist.getData();
			    new H.widget.asyncRequest().setURI(getRetryCountUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},
			//重试
			allretry :function(){
				var submitHandle = function(o) {
					new H.widget.msgBox({
					    title:"成功提示",
					    content:o.payload,
					    type:"error",
						autoClose : true,
						timeOut : 1000
					});
	        	    window.location.reload(true);
				};
				var errorHandle = function(o){
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
	    	    };
        	    var data = Smslist.getData();
				new H.widget.asyncRequest().setURI(retryallUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},
	        
	}
}, {
    requires: ['utils/showPages/index','bui/select','bui/calendar']
});