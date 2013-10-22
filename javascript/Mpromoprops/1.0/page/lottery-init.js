/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,showPages,Select,Calendar,beautifyForm) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	return LotteryControl = {
			    	paginator : null,
			    	msg :null,
			    	init : function() {
		
				     	select = new Select.Select({  
			              render:'#J_CardTypeBox',
			              valueField:'#J_CardType',
			              items:items
			            });
			            select.render();
			            select.on('change', function(ev){
			            });
			            var x = new beautifyForm();
			            var datepicker = new Calendar.DatePicker({
		     	              trigger:'#J_startDate',
		     	              showTime:false,
		     	              autoRender : true,
		     	              autoSetValue :false,
		     	              textField  : '2'
		     	            });
		     	         var datepicker2 = new Calendar.DatePicker({
		     	              trigger:'#J_endDate',
		     	              showTime:false,
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
	             		Event.on("#J_LeftSearch", "click", function(){
							LotteryControl.searchTbItems();
						});
						Event.on(doc, 'keydown', function(evt) {
							if ( evt.which === 13) {
								if(LotteryControl.paginator){
									LotteryControl.paginator.toPage(LotteryControl.paginator.page);
								}else{
									LotteryControl.searchTbItems();
								}
							}
						});
						LotteryControl.searchTbItems();
					},
					searchTbItems : function() {
				        
			            var submitHandle = function(o) {
							DOM.hide('#J_LeftLoading');
							DOM.show('#J_MainLeftContent');
			        	    totalRecords = o.payload.totalRecords;
							DOM.html('#J_UserNum',totalRecords);
							if(totalRecords > 0){
								DOM.css(DOM.get('#J_LEmpty') ,'display','none');
								DOM.css(DOM.query(".J_ItemSelectBtnHolder") ,'display' , '');
							} else {
								DOM.css(DOM.get('#J_LEmpty'), 'display' , '');
								DOM.css(DOM.query(".J_ItemSelectBtnHolder") , 'display' , 'none');
							}
							DOM.html(DOM.get("#J_PromotionItemList"), o.payload.body);
							var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
							LotteryControl.paginator = new showPages('LotteryControl.paginator').setRender(LotteryControl.handlePagination).setPageCount(pageCount).printHtml('#J_BottomPaging',2);
			    	    };
			    	    var data = LotteryControl.getData();
			 			DOM.show('#J_LeftLoading');
						DOM.hide('#J_MainLeftContent');
			    	    new H.widget.asyncRequest().setURI(loadTbItemsUrl).setMethod("POST").setHandle(submitHandle).setData(data).send();
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
			 				var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
			 				LotteryControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_BottomPaging',2);
			 				DOM.html(DOM.get("#J_PromotionItemList"), o.payload.body);
			 				DOM.hide('#J_LeftLoading');
							DOM.show('#J_MainLeftContent');
				    	};
				    	var data = LotteryControl.getData();
						data +="&page_id="+pageId
						   DOM.show('#J_LeftLoading');
							DOM.hide('#J_MainLeftContent');
			    	    new H.widget.asyncRequest().setURI(loadTbItemsUrl).setMethod("POST").setHandle(submitHandle).setData(data).send();
					},
					getData : function(){
		    	    	 if(DOM.val(DOM.get("#J_SearchName")) != '输入昵称'){
		   	    	    	var nick = encodeURIComponent(DOM.val(DOM.get("#J_SearchName"))); //标题
		   	    	    }else{
		   	    	    	var nick ='';
		   	    	    }
		    	    	var start_date = DOM.val(DOM.get("#J_startDate"));
		    	    	var end_date = DOM.val(DOM.get("#J_endDate"));
		   				var lottery_type = DOM.val(DOM.get("#J_CardType"));
//		   				var channel = DOM.val(DOM.get("#J_CardChannel"));
		   				if(DOM.prop('#J_WinFee',"checked")){
		   					var win_fee = 1
		   				}else{
		   					var win_fee = 0
		   				}
				        var data = "page_size=10&buyerNick="+nick+"&start_date="+start_date+"&end_date="+end_date+"&lottery_type="+lottery_type+"&win_fee="+win_fee;
//				        var data = "page_size=10&buyerNick="+nick+"&start_date="+start_date+"&end_date="+end_date+"&lottery_type="+lottery_type+"&channel="+channel+"&win_fee="+win_fee;
				        	
				        return data;  
			
					}
					
		    	}

	
}, {
    requires: ['utils/showPages/index','bui/select','bui/calendar','utils/beautifyForm/index']
});