KISSY.add(function(S,showPages,Overlay,Calendar,Tooltip,beautifyForm){
	var S = KISSY,DOM = S.DOM, Event = S.Event;	
	return historyControl = {
			panel : null,
		   	msg : null,
		   	msgTip : null,
		   	init : function() {
				historyControl.searchTbItems();
				Event.add('#J_SearchBtn','click',function(){
					historyControl.searchTbItems();
				});
		 	           
			},
	        searchTbItems : function() {
                var submitHandle = function(o) {
	        	    totalRecords = o.payload.totalRecords;
					if(totalRecords > 0){
						DOM.hide('#J_Empty');
					} else {
						DOM.show('#J_Empty');
					}
					historyControl.renderItems(o.payload.body);
					pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
					historyControl.paginator = new showPages('historyControl.paginator').setRender(historyControl.handlePagination).setPageCount(pageCount).printHtml('#J_Paging',2);
					//historyControl.paginator = new showPages('historyControl.paginator').setRender(historyControl.handlePagination).setPageCount(pageCount).printHtml('#J_TopPaging',3);
  					DOM.hide('#J_LeftLoading');
 					DOM.show('#J_MainContent');
        	    };
        	    var errorHandle = function(o){
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
        	    	return;
        	    };
				DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainContent');
				var start_date = DOM.val('#J_startDate');
				var end_date = DOM.val('#J_endDate');
				var q = DOM.val('#J_SearchTitle');
				if(q == '关键字、宝贝标题、宝贝ID'){
					var q = '';
				}else{
					q = q;
				}
				
				var data = "start_date="+start_date+"&end_date="+end_date+"&q="+q+'&page_size='+10;
        	    new H.widget.asyncRequest().setURI(loadTbItemsUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).setDataType('json').send();
			},
			// 渲染 TbItems
			renderItems: function(c) {
        	    DOM.html(DOM.get("#J_TbItemList"), c,true);      	    
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
					 historyControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_Paging',2);
					 historyControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_TopPaging',3);
					 historyControl.renderItems(o.payload.body);
  					 DOM.hide('#J_LeftLoading');
 					 DOM.show('#J_MainContent');
		    	};
				var start_date = DOM.val('#J_startDate');
				var end_date = DOM.val('#J_endDate');
				var q = DOM.val('#J_SearchTitle');
				if(q == '关键字、宝贝标题、宝贝ID'){
					var q = '';
				}else{
					q = q;
				}
				
				var data = "start_date="+start_date+"&end_date="+end_date+"&q="+q+'&page_size='+10+"&page_id="+pageId;
				DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainContent');    	    	
        	    new H.widget.asyncRequest().setURI(loadTbItemsUrl).setMethod("POST").setHandle(submitHandle).setData(data).send();
			}			
					 	
    	}
	
},{
	requires : ['utils/showPages/index','bui/overlay','bui/calendar','bui/tooltip','utils/beautifyForm/index']
});