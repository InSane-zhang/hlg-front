/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,showPages,Select) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	
	return list = {
	    	Paginator : null,
	    	msg :null,
	    	init : function() {

				var items = [
				  {text:'上架时间：早',value:'0'},
				  {text:'上架时间：晚',value:'1'}
		   	    ],
		   	    select = new Select.Select({  
		   		    render:'#J_SelectPage',
		   	      	valueField:'#J_PageHide',
		   	      	items:items
		   		});
		   		select.render();
	   			select.setSelectedValue('0');
		   		var items1 = [
   		   	      {text:'10条',value:'10'},
   		   	      {text:'20条',value:'20'},
   		   	      {text:'30条',value:'30'},
   		   	      {text:'40条',value:'40'},
   		   	      {text:'50条',value:'50'},
   		   	      {text:'100条',value:'100'}
   		   	    ],
   		   	    select1 = new Select.Select({  
   		   		    render:'#J_SelectOrder',
   		   	      	valueField:'#J_OrderHide',
   		   	      	items:items1
   		   		});
   		   		select1.render();
	   			select1.setSelectedValue('10');
	              select2 = new Select.Select({  
		            	  render:'#J_SelectCid',
		            	  valueField:'#J_CidHide',
		            	  items:cidItem
	              });
	   			select2.render();
	   			select2.setSelectedValue('0');
	   			var items3 = [
	   			              {text:'全部',value:'0'},
	   			              {text:'出售中',value:'1'},
	   			              {text:'库中',value:'2'}
	   			              ],
	              select3 = new Select.Select({  
		            	  render:'#J_SelectSell',
		            	  valueField:'#J_SellHide',
		            	  items:items3
	              });
	   			select3.render();
	   			select3.setSelectedValue('0');
				list.searchTbItems();
				Event.on('#J_Sort .sort','click',function(ev){
					DOM.removeClass(DOM.query('#J_Sort .sort'),'current');
					DOM.addClass(ev.currentTarget,'current');
					var data = DOM.attr(ev.currentTarget,'data')+':desc';
					DOM.val('#J_SortValue',data);
					list.searchTbItems();
				});
				Event.on('#J_target','mouseenter mouseleave',function(ev){
					if(ev.type == 'mouseenter'){					
						DOM.addClass(ev.currentTarget,'mouseenter');
						DOM.show('.yuanjiao');
						}else if(ev.type == 'mouseleave'){
							DOM.removeClass(ev.currentTarget,'mouseenter');
							DOM.hide('.yuanjiao');
						}
				});
				
				if(S.one('#J_SyncItemsButton')){
					/*同步宝贝*/
					Event.on('#J_SyncItemsButton','click', function(ev){
						var box = DOM.parent(ev.currentTarget);
						DOM.hide(box);
					    var submitHandle = function(o) {
								new H.widget.msgBox({
									    title:"温馨提示",
									    content:'同步数据请求成功，请点击搜索查看宝贝。如无法显示请过1分钟左右再查看',
									    type:"info"
									});
							KISSY.later(function(box){DOM.show(box);},60000,false,null,box)
				        }
						var data = "";
						new H.widget.asyncRequest().setURI(syncItemsUrl).setHandle(submitHandle).setMethod("GET").setData(data).setDataType('json').send();
					});	
					
				}
				
	        },
		   searchTbItems : function() {
	            var submitHandle = function(o) {
					DOM.hide('#J_LeftLoading');
					DOM.show('#J_MainLeftContent');
	        	    totalRecords = o.payload.totalRecords;
					DOM.css(DOM.get('#J_NoteIcon') ,'display','none');
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
	        	var data = list.getParamsData();
	 			DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainLeftContent');
	    	    new H.widget.asyncRequest().setURI(loadTbItemsUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			},
			getParamsData : function(){
				 if(DOM.val(DOM.get("#J_SearchTitle")) != '关键字、商品链接、商品编码'){
	    	    	var title = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle"))); //标题
	    	    }else{
	    	    	var title ='';
	    	    }
				var itemPage = DOM.val(DOM.get("#J_OrderHide"));//每页多少条
					var cid = DOM.val(DOM.get("#J_CidHide")); //类目
	    	    	var type = DOM.val(DOM.get("#J_SellHide")); //出售中 库中
	    	    	var sortvalue = DOM.val('#J_SortValue');
	    	    	if(sortvalue == 0 || sortvalue == 1){
						var itemOrder = DOM.val(DOM.get("#J_PageHide"));//排序方式
					}else{
						var itemOrder = sortvalue;//排序方式
					}
	    	    	var data = "q="+title+"&cid="+cid+"&type="+type;
	            	    data +="&itemOrder="+itemOrder+"&pageSize="+itemPage;
					
	    	    	if (type == 0) {
						//价格区间
						var startPrice = DOM.val(DOM.get("#J_StartPrice"));
						var endPrice = DOM.val(DOM.get("#J_EndPrice"));
						data += "&start_price="+startPrice+"&end_price="+endPrice;
					}
				return data ;	
				
			},
			renderItems: function(c) {
	    	    DOM.html(DOM.get("#J_TbItemList"), c);
	        	var lis = DOM.query("#J_TbItemList .J_TbItem");
	        	Event.on(lis, "mouseenter mouseleave", function(ev){
	        		if(ev.type == 'mouseenter'){
						DOM.addClass(ev.currentTarget,'mouseover');
	        		}else if(ev.type == 'mouseleave'){
						DOM.removeClass(ev.currentTarget,'mouseover');
					}
	        	});
	        	
	        	//添加样式
	        	var data;	        	
	        	S.each(S.all('#J_Sort .sort'), function(v,k) {
	        		if(DOM.hasClass(v, 'current')) {
	        			data = DOM.attr(v, 'data');
	        		}
	        		return data;
	        	})
	        	S.each(S.all('#J_TbItemList li'), function(v, k) {
	    			if(DOM.attr(v, 'data') == data) {
	    				DOM.addClass(v, 'current-row');
	    			}
	    		})
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
					//list.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_TopPaging',3);
	        	    list.renderItems(o.payload.body);
	 				DOM.hide('#J_LeftLoading');
					DOM.show('#J_MainLeftContent');
		    	};
		    	var data = list.getParamsData();
		         data += "&page_id="+pageId;
				 DOM.show('#J_LeftLoading');
			    DOM.hide('#J_MainLeftContent');
	    	    new H.widget.asyncRequest().setURI(loadTbItemsUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			}
	
	}
}, {
    requires: ['utils/showPages/index','bui/select']
});