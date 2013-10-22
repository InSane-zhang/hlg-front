/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,showPages) {
    // your code here
    // Promoprops_List   js
	var S = KISSY,DOM = S.DOM, Event = S.Event;	
	return list = {
    	paginator : null,
    	msg :null,
    	isFisrst : true,
    	init : function() {
			Event.on("#J_LeftSearch", "click", function(){
				list.searchItems();
			});
			Event.on(doc, 'keydown', function(evt) {
				if ( evt.which === 13) {
					if(list.paginator){
						list.paginator.toPage(list.paginator.page);
					}else{
						list.searchItems();
					}
				}
			})
			list.searchItems();
        },
        searchItems : function() {
	        
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
				list.renderItems(o.payload.body);
				var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
				list.paginator = new showPages('list.paginator').setRender(list.handlePagination).setPageCount(pageCount).printHtml('#J_Paging',2);
    	    };
    	    var data = list.getData();
 			DOM.show('#J_LeftLoading');
			DOM.hide('#J_MainLeftContent');
    	    new H.widget.asyncRequest().setURI(loadServiceStatUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
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
 				var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
 				list.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_Paging',2);
 				list.renderItems(o.payload.body);
 				DOM.hide('#J_LeftLoading');
				DOM.show('#J_MainLeftContent');
	    	};
	    	var data = list.getData();
			data +="&page_id="+pageId
			DOM.show('#J_LeftLoading');
			DOM.hide('#J_MainLeftContent');
    	    new H.widget.asyncRequest().setURI(loadServiceStatUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
		},
		getData : function(){
	    	if(DOM.val(DOM.get("#J_startDate")) != ''){
    	    	var start_date = encodeURIComponent(DOM.val(DOM.get("#J_startDate"))); //开始时间
    	    }else{
    	    	var start_date ='';
    	    }
    	    var data = "start_date="+start_date;
    	    if(DOM.val(DOM.get("#J_endDate")) != ''){
    	    	var end_date = encodeURIComponent(DOM.val(DOM.get("#J_endDate"))); //结束时间
    	    }else{
    	    	var end_date ='';
    	    }
    	    data += "&end_date="+end_date;
    	    
    	    if(DOM.val(DOM.get("#J_ShopId")) != ''){
    	    	var shop_id = encodeURIComponent(DOM.val(DOM.get("#J_ShopId"))); //结束时间
    	    }else{
    	    	var shop_id ='';
    	    }
    	    data += "&shop_id="+shop_id;
    	 
	        return data;  
		}
	}// end list

}, {
    requires: ['utils/showPages/index']
});