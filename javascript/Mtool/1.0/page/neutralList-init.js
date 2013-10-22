KISSY.add('page/neutralList-init',function(S,showPages,Select,Calendar){
	var S = KISSY,DOM = S.DOM, Event = S.Event;
	return neutralList = {
	    	paginator : null,
	    	msg : null,
	    	
	    	init : function() {
				//默认排序
				var items3 = [
					{text:'中评',value:'neutral'},
					{text:'差评',value:'bad'}
						     
				],
				resultSelect = new Select.Select({  
					render:'#J_ResultItem',
					valueField:'#J_Result',
					items:items3
				});
				resultSelect.render();
				resultSelect.setSelectedValue('neutral');
				resultSelect.on('change', function(ev){
					 neutralList.searchTraderates();
				});
				Event.on('#J_SearchBtn','click',neutralList.searchTraderates); //活动中宝贝全选   	    
				 neutralList.searchTraderates();
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
	        },
	        open : function(ruleType){
	        	window.self.location = openRuleUrl+'&type='+ruleType;
	        	return;
	        },
	        view : function(ruleId){
	        	window.self.location = viewRuleUrl+'&rule_id='+ruleId;
	        	return;
	        },
			//搜索
			searchTraderates :function() {
		    	var submitHandle = function(o) {
		    		neutralList.msg.hide();
		    		totalRecords = o.payload.totalRecords;
		    		if(parseInt(totalRecords)==0){
		    			DOM.html(DOM.get("#J_ContentList"), '<li style="float:none;"><div class="no-details"><div><span class="no-details-pic no-details-cry"></span><span class="prompt-1">暂无记录！</span></div></div></li>',true);
		    		}else{
		    			DOM.html(DOM.get("#J_ContentList"), o.payload.body,true);
		    		}
	        	    pageCount = Math.ceil(totalRecords/o.payload.pageSize); 
					neutralList.paginator = new showPages('neutralList.paginator').setRender(neutralList.paginationHandle).setPageCount(pageCount).printHtml('#J_Paging',2);
		    	};
		    	neutralList.msg = new H.widget.msgBox({
											    title:"",
												dialogType : 'loading',
											    content:'系统正在处理'	
											});
        	    var data ="result="+DOM.val('#J_Result')+"&tid="+DOM.val('#J_Tid')+"&num_iid="+DOM.val('#J_Num_iid')+"&start_date="+DOM.val('#J_startDate')+"&end_date="+DOM.val('#J_endDate')
        	    new H.widget.asyncRequest().setURI(loadTraderatesUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			},
			paginationHandle : function(turnTo,flag) {
				pageId = turnTo;
	    		var submitHandle = function(o) {
	    			neutralList.msg.hide();
	    			totalRecords = o.payload.totalRecords;
		    		pageCount = Math.ceil(totalRecords/o.payload.pageSize); 
	    			neutralList.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_Paging',2);
	    			DOM.html(DOM.get("#J_ContentList"), o.payload.body);
		    	};
		    	neutralList.msg = new H.widget.msgBox({
											    title:"",
												dialogType : 'loading',
											    content:'系统正在处理'	
											});
		    	var data ="result="+DOM.val('#J_Result')+"&tid="+DOM.val('#J_Tid')+"&num_iid="+DOM.val('#J_Num_iid')+"&start_date="+DOM.val('#J_startDate')+"&end_date="+DOM.val('#J_endDate')+"&page_id="+pageId;
        	    new H.widget.asyncRequest().setURI(loadTraderatesUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			},
			strProcess : function(str) {
				return str.replace(/\\/g, '\\\\').replace(/\"/g, '\\"').replace(/[\\t\\n&]/g, '%26');
			}
    };
},{
	requires : ['utils/showPages/index','bui/select','bui/calendar']
});