KISSY.add(function (S,showPages,Select,beautifyForm) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	
 	return crmItems = {
 	    	paginator : null,
 	    	init : function() {
 				Event.on('#J_SearchBtn','click',crmItems.searchTbItems); 
 	    	    Event.on('#J_Tab a','click',function(ev){
 	    	    	DOM.removeClass('#J_Tab a','current');
 	    	    	DOM.addClass(ev.currentTarget,'current');
 	    	    	var id = DOM.attr(ev.currentTarget,'data')
 	    	    	if(id== '2'){
 	    	    		DOM.show('.add');
 	    	    		DOM.hide('.hasadd');
 	    	    		crmItems.Form.setCheckboxOff(DOM.get('#J_BottonCheckAll'));
 	    	    	}else{
 	    	    		DOM.hide('.add');
 	    	    		DOM.show('.hasadd');
 	    	    		crmItems.Form.setCheckboxOff(DOM.get('#J_BottonCheckAll'));
 	    	    	}
 	    	    	crmItems.searchTbItems();
 	    	    	crmItems.Form = new beautifyForm();
 	    	    }); 
 	    	    Event.delegate(document,'click','.J_Status',function(ev){
    	    		var has_discount = DOM.attr(ev.currentTarget,'data');
    	    		var item_id = DOM.attr(ev.currentTarget,'data-id');
    	    		var json = [];
		        	var submitHandle = function(o) {
		        		//window.location.reload();
		        		crmItems.searchTbItems();
		        	};
	        	    var errorHandle = function(o){
						new H.widget.msgBox({
						    title:"错误提示",
						    content:o.desc,
						    type:"error"
						});
	        	    	return;
	        	    };
					var o = '{"has_discount":"' + has_discount + '","item_id":"' + item_id + '"}';
					o = eval('(' + o + ')');	
					json.push(o);
					var itemsJson = KISSY.JSON.stringify(json);
					var data = "items="+itemsJson;
	        	    new H.widget.asyncRequest().setURI(discountItemsFromTbUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
 	    	    }); 	
 	    	    Event.on('.J_BatchAdd','click',function(ev){
 		    	    var CheckBox = DOM.query('#J_TbItemList .c_on');
 		    	    var len = CheckBox.length;
 					var json = [];
 	        	    for(i=0; i<len; i++){ 
 						var has_discount = DOM.attr(CheckBox[i],'data');
 						var item_id = DOM.attr(CheckBox[i],'data-id');
						var o = '{"has_discount":"' + has_discount + '","item_id":"' + item_id + '"}';
						o = eval('(' + o + ')');	
						json.push(o);
 	        	    }
 					var itemsJson = KISSY.JSON.stringify(json);
		        	var submitHandle = function(o) {
		        		//window.location.reload();
		        		crmItems.searchTbItems();
		        		crmItems.Form.setCheckboxOff(DOM.get('#J_BottonCheckAll'));
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
		        	new H.widget.asyncRequest().setURI(discountItemsFromTbUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
 	    	    }); 	
 	    	    
				//选择分类
			    promoSelect = new Select.Select({  
				    render:'#J_SelectItemCidBox',
			      	valueField:'#J_SelectItemCid',
			      	items:S.JSON.parse(sellerCats),
			      	visibleMode : 'display'
				});
				promoSelect.render();
				promoSelect.setSelectedValue('0');
 	    	    
				var items = [
				  {text:'最新上架',value:'0'},
				  {text:'最晚上架',value:'1'}
				],
				select = new Select.Select({  
				  render:'#J_Arrival',
				  valueField:'#J_SelectItemOrder',
				  items:items
				});
				select.render();
				select.setSelectedValue('0'); 	
		        
				var items = [
				  {text:'10条',value:'10'},
				  {text:'20条',value:'20'},
				  {text:'30条',value:'30'},
				  {text:'40条',value:'40'},
				  {text:'50条',value:'50'},
				  {text:'100条',value:'100'}						  
				],
				select = new Select.Select({  
				  render:'#J_Page',
				  valueField:'#J_SelectItemPage',
				  items:items
				});
				select.render();
				select.setSelectedValue('10');

	        
				var items = [
				  {text:'全部',value:'0'},
				  {text:'出售中',value:'1'},
				  {text:'库中',value:'2'}						  
				],
				select = new Select.Select({  
				  render:'#J_Sell',
				  valueField:'#J_SearchSelling',
				  items:items
				});
				select.render();
	            select.on('change', function(ev){
//	            	if(this.value == '0'){
//			  	    	KISSY.DOM.width('#J_CenterPrame','');
//				  		KISSY.DOM.show('.J_price');
//				  	}else {
//				  		KISSY.DOM.hide('.J_price');
//				  		KISSY.DOM.width('#J_CenterPrame','');
//					}
	            });
				select.setSelectedValue('1');	        
				crmItems.searchTbItems(); 
				crmItems.Form = new beautifyForm();
				Event.on("#J_BottonCheckAll", "click", crmItems.checkAll);
 	    	    
 	        },
			checkAll : function(e) {
				//e.stopPropagation();
				checkBoxs = DOM.query("#J_TbItemList .J_CheckBox");
				len = checkBoxs.length;
				for(i=0; i<len; i++){
					var iid = checkBoxs[i].value;
					if(checkBoxs[i].disabled) continue;
					if(this.checked){
						crmItems.Form.setCheckboxOn(checkBoxs[i]);
					} else {
						crmItems.Form.setCheckboxOff(checkBoxs[i]);
					}
				}
			}, 	        
 	        searchTbItems : function() {
                 var submitHandle = function(o) {
 	        	    totalRecords = o.payload.totalRecords;
 					if(totalRecords > 0){
 						DOM.get('#J_LEmpty').style.display = 'none';
 						DOM.css(DOM.query(".J_ItemSelectBtnHolder"),'display' ,'');
 					} else {
 						DOM.get('#J_LEmpty').style.display = '';
 						DOM.css(DOM.query(".J_ItemSelectBtnHolder"),'display' ,'none');
 					}
 					crmItems.renderItems(o.payload.body);
 					pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
 					crmItems.paginator = new showPages('crmItems.paginator').setRender(crmItems.handlePagination).setPageCount(pageCount).printHtml('#J_Paging',2);
  					DOM.hide('#J_LeftLoading');
 					DOM.show('#J_MainLeftContent');
         	    };
         	    var errorHandle = function(o){
 					DOM.hide('#J_Loading');
 					DOM.show('#J_MainLeftContent');
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error",
						autoClose : true,
						timeOut : 3000
					});
         	    };
         	    if(DOM.val(DOM.get("#J_SearchTitle")) != '关键字、商品链接、商品编码'){
         	    	var title = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle"))); //标题
         	    }else{
         	    	var title ='';
         	    }
                var cid = DOM.val(DOM.get("#J_SelectItemCid")); //类目
     	    	var type = DOM.val(DOM.get("#J_SearchSelling")); //出售中 库中
//     	    	var itemOrder = DOM.val(DOM.get("#J_SelectItemOrder"));//排序方式
//     	    	var itemPage = DOM.val(DOM.get("#J_SelectItemPage"));//每页多少条
     	    	var has_discount = DOM.attr('#J_Tab .current','data');
     	    	var data = "q="+title+"&cid="+cid+"&type="+type+"&has_discount="+has_discount+"&pageSize="+10;
//             	    data +="&itemOrder="+itemOrder+"&pageSize="+itemPage;
//     	    	if (type == 0) {
// 					//价格区间
// 					var startPrice = DOM.val(DOM.get("#J_StartPrice"));
// 					var endPrice = DOM.val(DOM.get("#J_EndPrice"));
// 					data += "&start_price="+startPrice+"&end_price="+endPrice;
// 				}
 				DOM.show('#J_LeftLoading');
 				DOM.hide('#J_MainLeftContent');
         	    new H.widget.asyncRequest().setURI(getItemsFromTbUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).setDataType('json').send();
 			},
 			
 			// 渲染 TbItems
 			renderItems: function(c) {
         	    DOM.html(DOM.get("#J_TbItemList"), c,true);
         	    crmItems.Form = new beautifyForm();
	        	Event.on(DOM.query('#J_TbItemList .J_CheckBox'),'click',function(ev){
	        		//ev.stopPropagation();
	        		var iid = ev.currentTarget.value;
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
	        				crmItems.Form.setCheckboxOn(DOM.get('#J_BottonCheckAll'));
	        			}
	        		}else{
	        			crmItems.Form.setCheckboxOff(DOM.get('#J_BottonCheckAll'));
	        		}
	        	});         	    
 			},
 	    	handlePagination : function(turnTo) {
 		    	pageId = turnTo;
 	    		var submitHandle = function(o) {
 	    			 totalRecords = o.payload.totalRecords;
 					 if(totalRecords > 0){
 						DOM.get('#J_LEmpty').style.display = 'none';
 						DOM.css(DOM.query(".J_ItemSelectBtnHolder"),'display' ,'');
 					} else {
 						DOM.get('#J_LEmpty').style.display = '';
 						DOM.css(DOM.query(".J_ItemSelectBtnHolder"),'display' ,'none');
 					}
 					 pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
 	    			crmItems.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_Paging',2);
 	        	    crmItems.renderItems(o.payload.body);
 					DOM.hide('#J_LeftLoading');
 					DOM.show('#J_MainLeftContent');
 					crmItems.Form.setCheckboxOff(DOM.get('#J_BottonCheckAll'));
 		    	};
         	    if(DOM.val(DOM.get("#J_SearchTitle")) != '关键字、商品链接、商品编码'){
         	    	var title = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle"))); //标题
         	    }else{
         	    	var title ='';
         	    }
                var cid = DOM.val(DOM.get("#J_SelectItemCid")); //类目
     	    	var type = DOM.val(DOM.get("#J_SearchSelling")); //出售中 库中
//     	    	var itemOrder = DOM.val(DOM.get("#J_SelectItemOrder"));//排序方式
//     	    	var itemPage = DOM.val(DOM.get("#J_SelectItemPage"));//每页多少条
     	    	var has_discount = DOM.attr('#J_Tab .current','data');
     	    	var data = "q="+title+"&cid="+cid+"&type="+type+"&has_discount="+has_discount+"&pageSize="+10+"&page_id="+pageId;
//             	    data +="&itemOrder="+itemOrder+"&pageSize="+itemPage;
//     	    	if (type == 0) {
// 					//价格区间
// 					var startPrice = DOM.val(DOM.get("#J_StartPrice"));
// 					var endPrice = DOM.val(DOM.get("#J_EndPrice"));
// 					data += "&start_price="+startPrice+"&end_price="+endPrice;
// 				}
//     	    	data +="&page_id="+pageId;
 				DOM.show('#J_LeftLoading');
 				DOM.hide('#J_MainLeftContent');
         	    new H.widget.asyncRequest().setURI(getItemsFromTbUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
 			}
 	}
}, {
    requires: ['utils/showPages/index','bui/select','utils/beautifyForm/index']
});
