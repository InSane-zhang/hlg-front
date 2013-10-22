/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,showPages,Calendar,Tooltip) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	return babylibraryControl = {
			paginator : null,
	    	panel : null,
	    	msg : null,
	    	msg1 : null,
	    	inputChangeFlag:null,
			checkBoxs : null,
		    	init : function() {
//					babylibraryControl.Form = new beautifyForm();
//					//选择分类
//					promoSelect = new Select.Select({  
//					    render:'#J_SelectItemCidBox',
//				      	valueField:'#J_SelectItemCid', 
//				      	items:S.JSON.parse(sellerCats),
//				      	visibleMode : 'display'
//					});
//					promoSelect.render();
//					promoSelect.setSelectedValue('0');
//					DOM.css(DOM.get('.bui-list-picker'),{'left':'-999px','top':'-999px'});
					var promptHelp0 = new Tooltip.Tip({
						 trigger : '#J_promptHelp0',
						 alignType : 'top',
						 offset : 10,
						 elCls : 'ui-tip',
						 title : '<div class="ui-tip-text">在打印发货单时显示，方便配货员发货</div>'
					 })
					 promptHelp0.render();
					 var promptHelp1 = new Tooltip.Tip({
						 trigger : '#J_promptHelp1',
						 alignType : 'top',
						 offset : 10,
						 autoRender :'true',
						 elCls : 'ui-tip',
						 title : '<div class="ui-tip-text">设置宝贝宝贝成本价，了解店铺财务<br>动态<a  id="J_searchProfit" onclick="window.location.href=getBusinessUrl;"  style="margin-left:5px;">查看成交利润</a></div>'
					 })
					 promptHelp1.render();
					 var promptHelp2 = new Tooltip.Tip({
						 trigger : '#J_promptHelp2',
						 alignType : 'top',
						 offset : 10,
						 elCls : 'ui-tip',
						 title : '<div class="ui-tip-text">同步淘宝商家编码,方便管理宝贝</div>'
					 })
					 promptHelp2.render();
					 

					 Event.on('#J_SyncItemsButton','click', function(ev){
						 var submitHandle = function(o) {
				        		babylibraryControl.msg1.hide();
				        		new H.widget.msgBox({ 
						 			type: "sucess", 
						 			content: "宝贝同步成功",
									dialogType:"msg", 
									autoClose:true, 
									timeOut:3000
								});					
			        	    };
			        	    var errorHandle = function(o){
			        	    	babylibraryControl.msg1.hide();
			        	    	new H.widget.msgBox({
								    title:"错误提示",
								    content:o.desc,
								    type:"error"
								});
			        	    	return;
			        	    };
			        	    babylibraryControl.msg1 = new H.widget.msgBox({
								dialogType : 'loading',
							    content:'正在同步宝贝，请稍后...'	
			        	    });
							var data = "";
							new H.widget.asyncRequest().setURI(syncItemsUrl).setHandle(submitHandle).setMethod("GET").setData(null).send();
						 });	
					Event.on('.J_ChooseType','click',function(ev){
						DOM.removeClass(DOM.query('.J_ChooseType'),'current');
						DOM.addClass(ev.currentTarget,'current');
						var data = DOM.attr(ev.currentTarget,'data');
						DOM.val('#J_SearchType',data);
						if(data == 5){
							DOM.html('#J_SortName','利润价');
						}else{
							DOM.html('#J_SortName','&nbsp;');
						}
						babylibraryControl.searchTbItems();
					})
					babylibraryControl.searchTbItems();
					Event.on('#J_SearchBtn','click',babylibraryControl.searchTbItems); //搜索活动中宝贝  	 
				    Event.on('#J_TCheckAll','click',babylibraryControl.CheckAll); //活动中宝贝全选   	 
				    
				    // 定时上架
				    Event.delegate(document,'click','.J_ListUpTime',function(ev){
						var id = DOM.attr(ev.currentTarget,'data');
						var chooseRoleContentSubId = DOM.get('#J_ChooseRoleContent_'+id);
						DOM.css('#J_ChooseRoleContent_'+id,'visibility','visible');
					});
				    Event.delegate(document,'click','.J_iconDeletelink',function(ev){
						DOM.css('.J_ChooseRoleContent','visibility','hidden');
					})
					Event.delegate(document,'click','.J_submit',function(ev){
						var id = DOM.attr(ev.currentTarget,'data');
						DOM.css('#J_ChooseRoleContent_'+id,'visibility','hidden');
						var time= DOM.val('#J_startDate'+id);
						var submitHandle = function(o) {
							if(babylibraryControl.paginator){
								babylibraryControl.paginator.toPage(babylibraryControl.paginator.page);
							}else{
								babylibraryControl.searchTbItems();
							}
						};
						var data = "item_id="+id+"&listing_time="+time;
		        	    new H.widget.asyncRequest().setURI(timingListingUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
						
					})
					// 上架
					Event.delegate(document,'click','.J_ListUp',function(ev){
						var id = DOM.attr(ev.currentTarget,'data');
						var submitHandle = function(o) {
							if(babylibraryControl.paginator){
								babylibraryControl.paginator.toPage(babylibraryControl.paginator.page);
							}else{
								babylibraryControl.searchTbItems();
							}
						};
						var data = "item_id="+id ;
		        	    new H.widget.asyncRequest().setURI(listUpUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
					})
					
					// 下架
					Event.delegate(document,'click','.J_ListDown',function(ev){
						var id = DOM.attr(ev.currentTarget,'data');
						var submitHandle = function(o) {
							if(babylibraryControl.paginator){
								babylibraryControl.paginator.toPage(babylibraryControl.paginator.page);
							}else{
								babylibraryControl.searchTbItems();
							}
						};
						var data = "item_id="+id ;
		        	    new H.widget.asyncRequest().setURI(listDownUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
					})
					
					// 编辑input
					Event.delegate(document,'click','.J_EditTiger',function(ev){
						var p =DOM.parent(ev.currentTarget);
						DOM.addClass(p,'hover');
						DOM.get('input',p).focus();
					})
					Event.delegate(document,'focusout','.J_Huohao',function(ev){
						var id = DOM.attr(ev.currentTarget,'data');
						KISSY.later(function(){
							DOM.removeClass('#J_HuohaoBox'+id,'hover');
			 			},200,false,null);
					})
					Event.delegate(document,'focusout','.J_OriginPrice',function(ev){
						var id = DOM.attr(ev.currentTarget,'data');
						KISSY.later(function(){
							DOM.removeClass('#J_OriginPriceBox'+id,'hover');
			 			},200,false,null);
					})
					Event.delegate(document,'focusout','.J_ShortTitle',function(ev){
						var id = DOM.attr(ev.currentTarget,'data');
						KISSY.later(function(){
							DOM.removeClass('#J_ShortTitleBox'+id,'hover');
			 			},200,false,null);
					})
					
					Event.delegate(document,'click mouseenter mouseleave','.J_TitleTiger',function(ev){
							var flag = DOM.css(DOM.get('.rebate-text',ev.currentTarget),'display');
					    	if(ev.type == 'mouseenter'){
					    		 if( flag == 'none'){
					    			 DOM.addClass(ev.currentTarget,'current');
					    		 }
							}else if(ev.type == 'mouseleave'){
								 if( flag == 'none'){
									 DOM.removeClass(ev.currentTarget,'current');
					    		 }
							}else{
								 DOM.removeClass(ev.currentTarget,'current');
								DOM.hide(DOM.get('.J_Name',ev.currentTarget));
								DOM.show(DOM.get('.rebate-text',ev.currentTarget));
								
								DOM.get('.J_Title',ev.currentTarget).focus();
								var id = DOM.attr(ev.currentTarget,'data');
								DOM.val('#J_id',id);
								var title = DOM.val('#J_Title'+id);
								var itemTitle =H.util.strProcess(title);
								var titleLen = itemTitle.replace(/[^\x00-\xff]/g,"**").length;
								if(titleLen > 60){
									DOM.html(DOM.get('#J_Notice'+id), '宝贝标题超过淘宝限制（30个汉字）');
									DOM.html(DOM.get('#J_Zs'+id), '');	
									
								}else{
									var limitLen = 60-titleLen;
									DOM.html(DOM.get('#J_Notice'+id), '');
									DOM.html(DOM.get('#J_Zs'+id), "您还能输入<i style=\"margin:0 5px;\">"+limitLen+"</i>个字符");
								}
							}
					})
					
					Event.delegate(document,'focusout','.J_Title',function(ev){
						var id = DOM.attr(ev.currentTarget,'data');
						KISSY.later(function(){
							DOM.show(DOM.get('#J_TitleBox'+id+' .J_Name'));
							DOM.hide(DOM.get('#J_TitleBox'+id+' .rebate-text'));
			 			},200,false,null);
					})
					// 修改宝贝标题
					Event.delegate(document,'click','.J_TitleSubmit',function(ev){
						var id = DOM.attr(ev.currentTarget,'data');
						var title = DOM.val('#J_Title'+id);
						var submitHandle = function(o) {
 							new H.widget.msgBox({ 
						 			type: "sucess", 
						 			content: "修改成功",
									dialogType:"msg", 
									autoClose:true, 
									timeOut:3000
								});
 							DOM.val('#J_Origin0'+id,title);
							DOM.html(DOM.get('#J_TitleBox'+id+' .J_Name'),title);
						};
						var otitle = DOM.val('#J_Origin0'+id);
						if(otitle == title){
							return ;
						}
						var itemTitle =H.util.strProcess(title);
						var titleLen = itemTitle.replace(/[^\x00-\xff]/g,"**").length;
						if(titleLen > 60){
							new H.widget.msgBox({ 
					 			type: "error", 
					 			content: "宝贝标题超过淘宝限制（30个汉字）！",
								dialogType:"msg", 
								autoClose:true, 
								timeOut:3000
							});
							return false;
				        }
						var data = "item_id="+id+"&title="+encodeURIComponent(itemTitle);
		        	    new H.widget.asyncRequest().setURI(updateItemTitleUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
					})
					// 修改简称
					Event.delegate(document,'click','.J_ShortTitleSubmit',function(ev){
						var id = DOM.attr(ev.currentTarget,'data');
						var title = DOM.val('#J_ShortTitle'+id);
						var submitHandle = function(o) {
//							if(babylibraryControl.paginator){
//								babylibraryControl.paginator.toPage(babylibraryControl.paginator.page);
//							}else{
//								babylibraryControl.searchTbItems();
//							}
 							new H.widget.msgBox({ 
						 			type: "sucess", 
						 			content: "修改成功",
									dialogType:"msg", 
									autoClose:true, 
									timeOut:3000
								});
 							DOM.val('#J_Origin1'+id,title);
							DOM.html(DOM.get('#J_ShortTitleBox'+id+' .J_Name'),title);
						};
						var otitle = DOM.val('#J_Origin1'+id);
						
						if(otitle == title){
							return ;
						}
						var data = "item_id="+id+"&item_short="+title;
		        	    new H.widget.asyncRequest().setURI(updateItemUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
					});
					// 修改成本价
					Event.delegate(document,'click','.J_OriginPriceSubmit',function(ev){
						var id = DOM.attr(ev.currentTarget,'data');
						var title = DOM.val('#J_OriginPrice'+id);
						var submitHandle = function(o) {
							new H.widget.msgBox({ 
					 			type: "sucess", 
					 			content: "修改成功",
								dialogType:"msg", 
								autoClose:true, 
								timeOut:3000
							});
							DOM.val('#J_Origin2'+id,title);
							DOM.html(DOM.get('#J_OriginPriceBox'+id+' .J_Name'),title);
						};
						var otitle = DOM.val('#J_Origin2'+id);
						if(otitle == title){
							return ;
						}
						var data = "item_id="+id+"&item_const_price="+title;
		        	    new H.widget.asyncRequest().setURI(updateItemUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
					})
					// 修改货号
					Event.delegate(document,'click','.J_HuohaoSubmit',function(ev){
						var id = DOM.attr(ev.currentTarget,'data');
						var title = DOM.val('#J_Huohao'+id);
						var submitHandle = function(o) {
							new H.widget.msgBox({ 
					 			type: "sucess", 
					 			content: "修改成功",
								dialogType:"msg", 
								autoClose:true, 
								timeOut:3000
							});
							DOM.val('#J_Origin3'+id,title);
							DOM.html(DOM.get('#J_HuohaoBox'+id+' .J_Name'),title);
						};
						var otitle = DOM.val('#J_Origin3'+id);
						if(otitle == title){
							return ;
						}
						var data = "item_id="+id+"&outer_id="+title;
		        	    new H.widget.asyncRequest().setURI(updateItemTitleUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
					})
					
					//选择时间
					new Calendar.DatePicker({
		   	              trigger:'.calendarImg',
		   	              showTime:true,
		   	              autoRender : true,
		   	              autoSetValue :true,
		   	              delegateTigger :true,
		   	              minDate : new Date()
		   	              
					})

				    
			    },
				searchTbItems : function() {
			        var submitHandle = function(o) {
						DOM.hide('#J_RightLoading');
						DOM.show('#J_MainRightContent');
			    	    totalRecords = o.payload.totalRecords;
						if(totalRecords > 0){
							DOM.css(DOM.get('#J_REmpty') ,'display','none');
							DOM.css(DOM.query(".J_PromotionItemBtnHolder") ,'display' , '');
						} else {
							DOM.css(DOM.get('#J_REmpty'), 'display' , '');
							DOM.css(DOM.query(".J_PromotionItemBtnHolder") , 'display' , 'none');
						}
						DOM.html('#J_PromotionItemList' ,o.payload.body);
						var lis = DOM.query("#J_PromotionItemList .J_TbItem");
			        	Event.on(lis, "mouseenter mouseleave click", function(ev){
			        		if(ev.type == 'mouseenter'){
								DOM.addClass(ev.currentTarget,'current');
			        		}else if(ev.type == 'mouseleave'){
								DOM.removeClass(ev.currentTarget,'current');
							}
			        	});
						var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
						babylibraryControl.paginator = new showPages('babylibraryControl.paginator').setRender(babylibraryControl.handlePagination).setPageCount(pageCount).printHtml('#J_BottomPaging',2);
				    };
				    
				    var data = babylibraryControl.getParamsData();
				    
					DOM.show('#J_RightLoading');
					DOM.hide('#J_MainRightContent');
					var type = DOM.val(DOM.get("#J_SearchType")); 
					 if(KISSY.inArray(type,['1','2'])){
							var url  =getItemsFromUdpUrl;	
					 }else{
							var url  =getItemsFromTbUrl;
					 }
				    new H.widget.asyncRequest().setURI(url).setMethod("GET").setHandle(submitHandle).setData(data).send();
				},
				handlePagination : function(turnTo) {
			    	pageId = turnTo;
					var submitHandle = function(o) {
						
						DOM.hide('#J_RightLoading');
						DOM.show('#J_MainRightContent');
			    	    totalRecords = o.payload.totalRecords;
						if(totalRecords > 0){
							DOM.css(DOM.get('#J_REmpty') ,'display','none');
							DOM.css(DOM.query(".J_PromotionItemBtnHolder") ,'display' , '');
						} else {
							DOM.css(DOM.get('#J_REmpty'), 'display' , '');
							DOM.css(DOM.query(".J_PromotionItemBtnHolder") , 'display' , 'none');
						}
						DOM.html('#J_PromotionItemList' ,o.payload.body);
						var lis = DOM.query("#J_PromotionItemList .J_TbItem");
			        	Event.on(lis, "mouseenter mouseleave click", function(ev){
			        		if(ev.type == 'mouseenter'){
								DOM.addClass(ev.currentTarget,'current');
			        		}else if(ev.type == 'mouseleave'){
								DOM.removeClass(ev.currentTarget,'current');
							}
			        	});
						var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
						babylibraryControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_BottomPaging',2);
			    	};
			    	var data = babylibraryControl.getParamsData();
			    	data += "&page_id="+pageId;
			        DOM.show('#J_RightLoading');
					DOM.hide('#J_MainRightContent');
					var type = DOM.val(DOM.get("#J_SearchType")); 
					 if(KISSY.inArray(type,['1','2'])){
							var url  =getItemsFromUdpUrl;	
					 }else{
							var url  =getItemsFromTbUrl;
					 }
					
				    new H.widget.asyncRequest().setURI(url).setMethod("GET").setHandle(submitHandle).setData(data).send();
				},
				
				getParamsData : function(){
					
					
					if(DOM.val(DOM.get("#J_SearchTitle")) != '关键字、商品链接、商品编码'){
					    	var title = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle"))); //标题
				    }else{
				    	var title ='';
				    }
					var data = "q="+title+"&pageSize=10";
			    	var type = DOM.val(DOM.get("#J_SearchType")); 
			    	
			    	switch(type){
				    	case '1' :
				    		data+= '&sales=2';
				    	break;	
			    		case '2' :
				    		data+= '&sales=1';
				    	break;
			    		case '3' :
				    		data+= '&approve_status=onsale';
				    	break;	
			    		case '4' :
				    		data+= '&vip=1';
				    	break;	
			    		case '5' :
				    		data+= '&profit=2';
				    	break;	
			    		case '6' :
				    		data+= '&has_showcase=1';
				    	break;	
			    		case '7' :
				    		data+= '&approve_status=instock';
				    	break;	
			    	}
					return data
				},
				checkTitleNotice : function(str) {
					var id = DOM.val('#J_id');
					var len = str.replace(/[^\x00-\xff]/g,"**").length;
					if(len > 60){
						DOM.html(DOM.get('#J_Notice'+id), '标题超过淘宝限制（30个汉字）');
						DOM.html(DOM.get('#J_Zs'+id), '');	
						
					}else{
						var limitLen = 60-len;
						DOM.html(DOM.get('#J_Notice'+id), '');
						DOM.html(DOM.get('#J_Zs'+id), "您还能输入<i style=\"margin:0 5px;\">"+limitLen+"</i>个字符");
					}
				},
				
				//转义 正则
				escape : function(str){
					 if (str == null){
					 	return ""; 
					 } else{
			           return  str.replace(/\//g,'\\/').replace(/\./g,"\\.").replace(/\*/g,"\\*").replace(/\+/g,"\\+").replace(/\(/g,"\\(").replace(/\)/g,"\\)").replace(/\$/g,"\\$").replace(/\?/g,"\\?").replace(/\[/g,"\\[").replace(/\]/g,"\\]").replace(/\^/g,"\\^").replace(/\{/g,"\\{").replace(/\}/g,"\\}"); 
					}
					
				}
				
		
	}
				
}, {
    requires: ['utils/showPages/index','bui/calendar','bui/tooltip']
});