/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,showPages,O) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	
	return shortControl = {
	    	paginator : null,
			handlePagination :null,
			handlePagination2 :null,
	    	isFisrst : true,
	    	init : function() {
				shortControl.searchTbItems();
				Event.on('#J_Search','click',function(){
					shortControl.searchTbItems();
				})
				Event.on('#J_WaitPay','click',function(ev){
					if(DOM.attr(ev.currentTarget,'checked')){
						var readyDelivery = DOM.val(ev.currentTarget);
						shortControl.readyDelivery(readyDelivery);
					}else{
						shortControl.searchTbItems();
					}
				})				
				Event.delegate(document,'click','.J_EditShort',function(ev){
					var data = DOM.attr(ev.currentTarget,'data');
					DOM.hide(ev.currentTarget);
					DOM.show('#J_ShowEditorShort_'+data)
					DOM.get('#J_InputShort_'+data).focus();
				})
				Event.delegate(document,'blur','.J_InputShort',function(ev){
					var data = DOM.attr(ev.currentTarget,'data');
					KISSY.later(function(){
						DOM.hide('#J_ShowEditorShort_'+data);
						DOM.show('#J_EditShort_'+data);
		 			},200,false,null);
			 	});
				Event.delegate(document,'click','.J_Save',function(ev){
					var data = DOM.attr(ev.currentTarget,'data');
					shortControl.shortSave(data);
				})	
				Event.delegate(document,'click','.details',function(ev){
					var data = DOM.attr(ev.currentTarget,'title');
					shortControl.shortDelete(data);
				})					
	        },
	        readyDelivery : function(num) {
	            var submitHandle = function(o) {
					DOM.hide('#J_LeftLoading');
					DOM.show('#J_MainLeftContent');
	        	    totalRecords = o.payload.totalRecords;
					if(totalRecords > 0){
						DOM.css(DOM.get('#J_LEmpty') ,'display','none');
						DOM.css(DOM.query(".J_ItemSelectBtnHolder") ,'display' , '');
					}else{
						DOM.css(DOM.get('#J_LEmpty'), 'display' , '');
						DOM.css(DOM.query(".J_ItemSelectBtnHolder") , 'display' , 'none');
					}
					shortControl.renderItems(o.payload.body);
					var pageCount = Math.ceil(totalRecords/o.payload.pageSize); 
					shortControl.paginator = new showPages('shortControl.paginator').setRender(shortControl.handlePagination2).setPageCount(pageCount).printHtml('#J_Paging',2);
					shortControl.paginator = new showPages('shortControl.paginator').setRender(shortControl.handlePagination2).setPageCount(pageCount).printHtml('#J_TopPaging',3);
	    	    };
	    	    var errorHandle = function(o){
					new H.widget.msgBox({
							    title:"错误提示",
							    content:o.desc,
							    type:"error"
							});
					DOM.hide('#J_LeftLoading');
					DOM.hide('#J_MainLeftContent');					
					DOM.css(DOM.get('#J_LEmpty'), 'display' , '');
					DOM.css(DOM.query(".J_ItemSelectBtnHolder") , 'display' , 'none');					
	    	    };	  
	 			DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainLeftContent');
				var pagesize =10;	
				var data = "readyDelivery="+num+"&pageSize="+pagesize;
	    	    new H.widget.asyncRequest().setURI(loadReadydeliveryUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},		        
	        shortDelete : function(num) {
	            var submitHandle = function(o) {
	            	DOM.html('#J_EditShort_'+num,'<span class="editItemNum"></span>编辑宝贝简称...')
	    	    };
	    	    var errorHandle = function(o){
					new H.widget.msgBox({
							    title:"错误提示",
							    content:o.desc,
							    type:"error"
							});				
	    	    };	    	    
	    	    var title = DOM.val('#J_InputShort_'+num);
				var data = "numIid="+num;
	    	    new H.widget.asyncRequest().setURI(loadSearchUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},		        
	        shortSave : function(num) {
	            var submitHandle = function(o) {
	            	DOM.html('#J_EditShort_'+num,DOM.val('#J_InputShort_'+num))
	    	    };
	    	    var errorHandle = function(o){
					new H.widget.msgBox({
							    title:"错误提示",
							    content:o.desc,
							    type:"error"
							});				
	    	    };	   
	    	    var title = DOM.val('#J_InputShort_'+num);
				var data ="short="+title+"&num_iid="+num;
	    	    new H.widget.asyncRequest().setURI(loadSearchUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},	        
	        searchTbItems : function() {
	            var submitHandle = function(o) {
					DOM.hide('#J_LeftLoading');
					DOM.show('#J_MainLeftContent');
	        	    totalRecords = o.payload.totalRecords;
					if(totalRecords > 0){
						DOM.css(DOM.get('#J_LEmpty') ,'display','none');
						DOM.css(DOM.query(".J_ItemSelectBtnHolder") ,'display' , '');
					}else{
						DOM.css(DOM.get('#J_LEmpty'), 'display' , '');
						DOM.css(DOM.query(".J_ItemSelectBtnHolder") , 'display' , 'none');
					}
					shortControl.renderItems(o.payload.body);
					var pageCount = Math.ceil(totalRecords/o.payload.pageSize); 
					shortControl.paginator = new showPages('shortControl.paginator').setRender(shortControl.handlePagination).setPageCount(pageCount).printHtml('#J_Paging',2);
					shortControl.paginator = new showPages('shortControl.paginator').setRender(shortControl.handlePagination).setPageCount(pageCount).printHtml('#J_TopPaging',3);
	    	    };
	    	    var errorHandle = function(o){
					new H.widget.msgBox({
							    title:"错误提示",
							    content:o.desc,
							    type:"error"
							});
					DOM.hide('#J_LeftLoading');
					DOM.hide('#J_MainLeftContent');					
					DOM.css(DOM.get('#J_LEmpty'), 'display' , '');
					DOM.css(DOM.query(".J_ItemSelectBtnHolder") , 'display' , 'none');					
	    	    };	    	    
   	    	    if(DOM.val(DOM.get("#J_SearchTitle")) != '关键字、商品链接、商品编码'){
   	    	    	var title = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle"))); 
   	    	    }else{
   	    	    	var title ='';
   	    	    }  
   	    	    var cid = DOM.val('#J_SelectItemCid')
	    	    var itemtype  = DOM.val('#J_Itemtype');
	    	    var pagesize =10;
	 			DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainLeftContent');
				var data = "type="+itemtype+"&q="+title+"&pageSize="+pagesize+"&cid="+cid;
	    	    new H.widget.asyncRequest().setURI(loadSearchUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},
			renderItems: function(c) {
	    	    DOM.html(DOM.get("#J_TbItemList"), c);
			},
	    	handlePagination : function(turnTo) {
		    	var pageId = turnTo;
	    		var submitHandle = function(o) {
	    			 totalRecords = o.payload.totalRecords;
	 				if(totalRecords > 0){
	 					DOM.css(DOM.get('#J_LEmpty') ,'display','none');
	 					DOM.css(DOM.query(".J_ItemSelectBtnHolder") ,'display' , '');
	 				} else {
	 					DOM.css(DOM.get('#J_LEmpty'), 'display' , '');
	 					DOM.css(DOM.query(".J_ItemSelectBtnHolder") , 'display' , 'none');
	 				}
	 				var pageCount = Math.ceil(totalRecords/o.payload.pageSize); 
	 				shortControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_Paging',2);
	 				shortControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_TopPaging',3);
	 				shortControl.renderItems(o.payload.body);
	 				DOM.hide('#J_LeftLoading');
					DOM.show('#J_MainLeftContent');
		    	};
		    	//var data = shortControl.getData();
		    	var pagesize =10;
   	    	    if(DOM.val(DOM.get("#J_SearchTitle")) != '关键字、商品链接、商品编码'){
   	    	    	var title = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle"))); 
   	    	    }else{
   	    	    	var title ='';
   	    	    }  
   	    	    var cid = DOM.val('#J_SelectItemCid')
	    	    var itemtype  = DOM.val('#J_Itemtype');
	    	    var pagesize =10;		    	
				data ="page_id="+pageId+"&pageSize="+pagesize+"&type="+itemtype+"&q="+title+"&pageSize="+pagesize+"&cid="+cid;
				DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainLeftContent');
	    	    new H.widget.asyncRequest().setURI(loadSearchUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			},
	    	handlePagination2 : function(turnTo) {
		    	var pageId = turnTo;
	    		var submitHandle = function(o) {
	    			 totalRecords = o.payload.totalRecords;
	 				if(totalRecords > 0){
	 					DOM.css(DOM.get('#J_LEmpty') ,'display','none');
	 					DOM.css(DOM.query(".J_ItemSelectBtnHolder") ,'display' , '');
	 				} else {
	 					DOM.css(DOM.get('#J_LEmpty'), 'display' , '');
	 					DOM.css(DOM.query(".J_ItemSelectBtnHolder") , 'display' , 'none');
	 				}
	 				var pageCount = Math.ceil(totalRecords/o.payload.pageSize); 
	 				shortControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_Paging',2);
	 				shortControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_TopPaging',3);
	 				shortControl.renderItems(o.payload.body);
	 				DOM.hide('#J_LeftLoading');
					DOM.show('#J_MainLeftContent');
		    	};
	    	    var pagesize =10;		    	
				data ="page_id="+pageId+"&pageSize="+pagesize+"&readyDelivery="+1;
				DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainLeftContent');
	    	    new H.widget.asyncRequest().setURI(loadReadydeliveryUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			}				
	}
}, {
    requires: ['utils/showPages/index','overlay']
});