/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,showPages,Select,Tooltip) {
	var DOM = S.DOM, Event = S.Event;	
	return 	indexControl = {
		    	paginator : null,
		    	listItemsPaginator : null,
		    	init : function() {
		               indexControl.getLessBaobei();
						  //时间
						var items3 = [
							{text:'最近一个月',value:'30'},
							{text:'最近2个月',value:'60'},
							{text:'最近3个月',value:'90'}								     
						],
						sortSelect = new Select.Select({  
							render:'#J_SelectItemSort',
							valueField:'#J_SelectItemSortHide',
							items:items3
						});
						sortSelect.render();
						sortSelect.setSelectedValue('30');
						sortSelect.on('change', function(ev){
							indexControl.searchTbItems();
						});
						//状态
						var items4 = [
							{text:'利润最高',value:'profit:desc'},
							{text:'利润最低',value:'profit:asc'}								     
						],
						statusSelect = new Select.Select({  
							render:'#J_SearchProfitBox',
							valueField:'#J_SearchStatus',
							items:items4
						});
						statusSelect.render();
						statusSelect.setSelectedValue('profit:desc');
						statusSelect.on('change', function(ev){
							indexControl.searchTbItems();
						});	
						Event.on('#J_RightSearchBtn','click',function(ev){
						  indexControl.searchTbItems();
						});	
						 Event.on(DOM.query('.J_Tiger'),'mouseenter mouseleave',function(ev){
		     	        	  if(ev.type == 'mouseenter'){
		     	        		  DOM.addClass(ev.currentTarget,'current');
		     	        	  }else{
		     	        		 DOM.removeClass(ev.currentTarget,'current');
		     	        	  }
		     	          });
		     	          Event.on(DOM.query('.J_Page'),'click',function(ev){
     	        	         var v = DOM.attr(ev.currentTarget,'data');
	 						 DOM.removeClass(DOM.query('#J_TopLeft .J_Page'),'active');
	 						 DOM.addClass(ev.currentTarget,'active');
	 						 DOM.html(DOM.get('#J_TopLeft .value'),v);
	 						 DOM.val('#J_SelectItemPage',v);
	     	        	    indexControl.searchTbItems();
		     	          }); 
		     	         indexControl.searchTbItems();
		     	         indexControl.getProductsItems();
		     	         
		        },
		        getProductsItems:function(){
		        	var submitHandle = function(o) {
		        		DOM.html('#J_saleList',o.payload.body);
		        	};
		        	 new H.widget.asyncRequest().setURI(getProductsUrl).setMethod("GET").setHandle(submitHandle).setData(null).send();
		        },
		        
		        getLessBaobei:function(){
		        	 var submitHandle = function(o) {
	    	        	    totalRecords = o.payload.totalRecords;
	    	        	    var already=o.payload.already;
	    	        	    var all=o.payload.all;
	    	        	    var less=all-already;
	    	        	    if((all-already)!= 0 ){ 
	    	        	    	DOM.html('#J_less',less);
	    	        	    	DOM.show('#J_lessNumbers');
	                	       }else{
	                	    	   DOM.hide('#J_lessNumbers');  
	                	       }       	
	            	    };
	            	    new H.widget.asyncRequest().setURI(getCostsSetUrl).setMethod("GET").setHandle(submitHandle).setData(null).send();
		        },
				 searchTbItems : function() {
		            var submitHandle = function(o) {
						DOM.hide('#J_RightLoading');
						DOM.show('#J_MainRightContent');
		        	    totalRecords = o.payload.totalRecords;
		        	    DOM.html('#J_totalRecords',totalRecords);
		        	    var sales=o.payload.countResults.sales;
		        	    var profit=o.payload.countResults.profit;
		        	    DOM.html('#J_allSale',sales);
		        	    DOM.html('#J_income',profit);
						if(totalRecords > 0){
							DOM.css(DOM.get('#J_REmpty') ,'display','none');
							DOM.css(DOM.query(".J_ItemSelectBtnHolder") ,'display' , '');
						} else {
							DOM.css(DOM.get('#J_REmpty'), 'display' , '');
							DOM.css(DOM.query(".J_ItemSelectBtnHolder") , 'display' , 'none');
						}
						indexControl.renderItems(o.payload.body);
						 Event.on(DOM.query('.J_tip'),'mouseover click',function(ev){
							 var i=DOM.attr(ev.currentTarget,'data');
							 var data_date=DOM.attr(ev.currentTarget,'data-date');
							 var promptHelp = new Tooltip.Tip({
								 trigger : '#J_finaceWarn'+i,
								 alignType : 'top',
								 offset : 10,
								 elCls : 'ui-tip',
								 title : '<div style="height:34px;width:178px;color:#555555;line-height:34px;"><span style="color:#999999;">上架时间：'+data_date+'</span></div>'
							 })
							 promptHelp.render();
						 });
						var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
						indexControl.paginator = new showPages('indexControl.paginator').setRender(indexControl.handlePagination).setPageCount(pageCount).printHtml('#J_BottomPaging',2);
						indexControl.paginator.setPageCount(pageCount).printHtml('#J_TopPaging',3);
		    	    };
		        	 if(DOM.val(DOM.get("#J_SearchTitle")) != '宝贝链接、产品ID'){
		    	    	var title = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle"))); //标题
		    	    }else{
		    	    	var title ='';
		    	     } 
						var itemPage = DOM.val(DOM.get("#J_SelectItemPage"));//每页多少条
						var orderby=DOM.val('#J_SearchStatus');
						var days=DOM.val('#J_SelectItemSortHide');
		    	    	var data = "q="+title+"&page_size="+itemPage+"&orderby="+orderby+"&days="+days;
			 			DOM.show('#J_RightLoading');
						DOM.hide('#J_MainRightContent');
			    	    new H.widget.asyncRequest().setURI(loadProductItemsUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
				 },
				 renderItems: function(c) {
		    	    DOM.html(DOM.get("#J_BaobeiItemList"), c);
		        	var lis = DOM.query("#J_BaobeiItemList .J_TbItem");
		        	Event.on(lis, "mouseenter mouseleave click", function(ev){
		        		var el = DOM.get('.J_CheckBox',ev.currentTarget);
		        		if(el.disabled) return;
		        		if(ev.type == 'mouseenter'){
							DOM.addClass(ev.currentTarget,'current');
		        		}else if(ev.type == 'mouseleave'){
							DOM.removeClass(ev.currentTarget,'current');
						}
		        	});	
				},	
		    	handlePagination : function(turnTo) {
			    	pageId = turnTo;
		    		var submitHandle = function(o) {
		    			 totalRecords = o.payload.totalRecords;
		 				if(totalRecords > 0){
		 					DOM.css(DOM.get('#J_REmpty') ,'display','none');
		 					DOM.css(DOM.query(".J_ItemSelectBtnHolder") ,'display' , '');
		 				} else {
		 					DOM.css(DOM.get('#J_REmpty'), 'display' , '');
		 					DOM.css(DOM.query(".J_ItemSelectBtnHolder") , 'display' , 'none');
		 				}
		 				var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
		    			indexControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_BottomPaging',2);
						indexControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_TopPaging',3);
		        	    indexControl.renderItems(o.payload.body);
		 				DOM.hide('#J_RightLoading');
						DOM.show('#J_MainRightContent');
			    	};
			    		 if(DOM.val(DOM.get("#J_SearchTitle")) != '宝贝链接、产品ID'){
		    	    	var title = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle"))); //标题
		    	    }else{
		    	    	var title ='';
		    	    }
					var itemPage = DOM.val(DOM.get("#J_SelectItemPage"));//每页多少条
					var orderby=DOM.val('#J_SearchStatus');
					var days=DOM.val('#J_SelectItemSortHide');
	    	    	var data = "q="+title+"&page_size="+itemPage+"&orderby="+orderby+"&days="+days; 
				        data += "&page_id="+pageId;
					    DOM.show('#J_RightLoading');
						DOM.hide('#J_MainRightContent');
		    	    new H.widget.asyncRequest().setURI(loadProductItemsUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
				}		
				
		}
}, {
    requires: ['utils/showPages/index','bui/select','bui/tooltip',]
});