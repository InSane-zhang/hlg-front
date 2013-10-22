/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,showPages,beautifyForm,Select,Switchable) {
    	// your code here
	 	var DOM = S.DOM, Event = S.Event;
    	return PromopropsItem = {
			    	panel : null,
	                msg : null,
	                currentMode : step,
	         		paginator : null,
					promotionItemPaginator: null,
	                init : function(){
    		
    						PromopropsItem.Form = new beautifyForm();
    						iconTabs = new Switchable.Tabs('#J_main',{
	   							 navCls:'ks-switchable-nav',
	   							 contentCls:'main-content',
	   							 activeTriggerCls:'current',
	   							 triggerType: 'click'
	   						}).on('switch',function(ev){
	   							var index = ev.currentIndex;
									if(index == 1){
										PromopropsItem.currentMode = '2';
										DOM.hide('.J_Seach_1');
										DOM.show('.J_Seach_2');
										if(PromopropsItem.promotionItemPaginator){
											PromopropsItem.promotionItemPaginator.toPage(PromopropsItem.promotionItemPaginator.page);
										}else{
											PromopropsItem.loadPromotionItems();
										}
										DOM.addClass('#J_Step_1','current');
									}else{
										PromopropsItem.currentMode = '1';
										DOM.show('.J_Seach_1');
										DOM.hide('.J_Seach_2');
										if(PromopropsItem.paginator){
											PromopropsItem.paginator.toPage(PromopropsItem.paginator.page);
										}else{
											PromopropsItem.searchTbItems();
										}
										
									}
	   						})
	   						Event.on(doc, 'keydown', function(evt) {
								if ( evt.which === 13) {
									if(PromopropsItem.paginator){
										PromopropsItem.paginator.toPage(PromopropsItem.paginator.page);
									}else{
										PromopropsItem.searchTbItems();
									}
								}
							})
							if(PromopropsItem.currentMode == 1){
								PromopropsItem.searchTbItems()
							}else{
								iconTabs.switchTo(1);
							}
    						   /*下一步*/
	   		     	         Event.on('#J_NextStep','click',function(ev){
	   		     	        	iconTabs.switchTo(1);
	   						 });	
	   						 /*上一步*/
	   		     	         Event.on('#J_BaceStep','click',function(ev){
	   		     	        	iconTabs.switchTo(0);
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
    						DOM.css(DOM.get('.bui-list-picker'),{'left':'-999px','top':'-999px'});
    						// 全部 出售中 库中
    						var Sellingitems = [
    					      {text:'全部',value:'0'},
    					      {text:'出售中',value:'1'},
    					      {text:'库中',value:'2'}
    					    ],
    					    SellingSelect = new Select.Select({  
    						    render:'#J_SelectItemSelling',
    					      	valueField:'#J_SearchSelling',
    					      	items:Sellingitems
    						});
    						SellingSelect.render();
    						SellingSelect.setSelectedValue('0');
    						
    						//默认排序
    						var items3 = [
    							{text:'默认排序',value:'3'},
    							{text:'上架时间:早',value:'0'},
    							{text:'上架时间:晚',value:'1'}
    								     
    						],
    						sortSelect = new Select.Select({  
    							render:'#J_SelectItemSort',
    							valueField:'#J_SelectItemSortHide',
    							items:items3
    						});
    						sortSelect.render();
    						sortSelect.setSelectedValue('0');
    						sortSelect.on('change', function(ev){
    							PromopropsItem.searchTbItems();
    						});
    						var items4 = [
    							{text:'状态',value:'0'},
    							{text:'等待处理',value:'2'},
    							{text:'处理失败',value:'1'},
    							{text:'成功加入',value:'3'}
    								     
    						],
    						statusSelect = new Select.Select({  
    							render:'#J_SearchStatusBox',
    							valueField:'#J_SearchStatus',
    							items:items4
    						});
    						statusSelect.render();
    						statusSelect.setSelectedValue(status);
    						statusSelect.on('change', function(ev){
    							PromopropsItem.loadPromotionItems();
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
	   			 					if (PromopropsItem.currentMode == '1' ) {
	   			 						 DOM.removeClass(DOM.query('#J_TopLeft .J_Page'),'active');
	   			 						 DOM.addClass(ev.currentTarget,'active');
	   			 						DOM.html(DOM.get('#J_TopLeft .value'),v);
	   			 						 DOM.val('#J_SelectItemPage',v);
	   			 						PromopropsItem.searchTbItems();
	   			 					}else{
	   			 						DOM.removeClass(DOM.query('#J_TopRight .J_Page'),'active');
	   			 						DOM.addClass(ev.currentTarget,'active');
	   			 						DOM.html(DOM.get('#J_TopRight .value'),v);
	   			 						 DOM.val('#J_RightSelectItemPage',v);
	   			 						PromopropsItem.loadPromotionItems();
	   			 					}
	   		     	          })
	   		     	  	
						
	   		     	          
	   		     	          
    		
						/*编辑活动*/
						 Event.delegate(document,'click','.J_Editor_Promo', function(ev) {
							if(!showPermissions('editor_promoprops','促销道具')){
								return ;
							} 
							var url = DOM.attr(ev.currentTarget,'data');
							var diff  = IsExpired();
						 	if(diff > -5000){
								var sucessHandle = function(o) {
									window.location.href=url;
						 		};
						 		var errorHandle = function(o){
						 			KISSY.Event.fire('.J_TopExpired','click');
						 		};
						 		var data = '';
						  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
							}else{
								window.location.href=url;
				 			}
						});

						/*加入宝贝授权*/
						Event.delegate(document,'click','.J_AddToPromo',function(ev){
								var id = DOM.attr(ev.currentTarget,'data');
								var sucess = function(o){
									DOM.val('#J_TotalPromoItems',o.payload);
									if(o.payload >= 150){
										new H.widget.msgBox({
												    title:"温馨提示",
												    content:'非全店类型道具卡宝贝数量不能大于150个，现在已经加入'+o.payload+'请删除多余的宝贝.',
												    type:"info"
												});
									}else{
										var diff  = IsExpired();
									 	if(diff > -5000){
											var sucessHandle = function(o) {
												if(id == '1'){
													PromopropsItem.addSelectItemsToPromotion();
												}
									 		};
									 		var errorHandle = function(o){
									 			KISSY.Event.fire('.J_TopExpired','click');
									 		};
									 		var data = '';
									  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
										}else{
											if(id == '1'){
												PromopropsItem.addSelectItemsToPromotion();
											}
							 			}
									}
								}
							  	var error = function(o){
							  		new H.widget.msgBox({
												    title:"错误提示",
												    content:o.desc,
												    type:"error"
												});
						 		};
						 		var data = 'promo_id='+pid;
						  	    new H.widget.asyncRequest().setURI(getPromoItemNumUrl).setMethod("GET").setHandle(sucess).setErrorHandle(error).setData(data).send();
						})
						Event.on('#J_RightSearchBtn','click',function(ev){
							if(PromopropsItem.currentMode == '1'){
								PromopropsItem.searchTbItems();
							} else if(PromopropsItem.currentMode == '2'){
								PromopropsItem.loadPromotionItems();
							}
						});	
						
		    	    	Event.on('#J_TopCheckAll','click',PromopropsItem.checkAll);  //淘宝宝贝全选
		    	    	
		    	    	
		 	    	    Event.on("#J_RightCheckAll", "click", PromopropsItem.rightCheckAll);
			    	    Event.on("#J_RightBottonCheckAll", "click", PromopropsItem.rightCheckAll);
			    	    
			    	    
		 	    	    Event.on('#J_BatchAddBtn','click',PromopropsItem.batchAddItems); //批量添加到活动中
		 	    	    Event.on('#J_RemovePromotionItems','click',PromopropsItem.removePromotionItemHandle); //从活动
	                }, 	
	         		searchTbItems : function(flag) {
		                var submitHandle = function(o) {
		                	DOM.removeClass(".J_ItemSelectBtnHolder",'ks-hidden');
			        	    totalRecords = o.payload.totalRecords;
							if(totalRecords > 0){
								DOM.get('#J_LEmpty').style.display = 'none';
								DOM.css(DOM.query(".J_ItemSelectBtnHolder"),'display' ,'');
							} else {
								DOM.get('#J_LEmpty').style.display = '';
								DOM.css(DOM.query(".J_ItemSelectBtnHolder"),'display' ,'none');
							}
							PromopropsItem.renderItems(o.payload.body);
							pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
							PromopropsItem.paginator = new showPages('PromopropsItem.paginator').setRender(PromopropsItem.handlePagination).setPageCount(pageCount).printHtml('#J_Paging',2);
							PromopropsItem.paginator.printHtml('#J_TopPaging',3);
							DOM.hide('#J_LeftLoading');
					    	DOM.show('#J_MainLeftContent');
		        	    };
		        	    var errorHandle = function(o){
							DOM.hide('#J_LeftLoading');
					    	DOM.show('#J_MainLeftContent');
        	    			new H.widget.msgBox({
										    title:"错误提示",
										    content:o.desc,
										    type:"error"
										});
		        	    };
			        	 if(DOM.val(DOM.get("#J_SearchTitle")) != '关键字、商品链接、商品编码'){
		        	    	var title = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle"))); //标题
		        	    }else{
		        	    	var title ='';
		        	    }
						var itemPage = DOM.val(DOM.get("#J_SelectItemPage"));//每页多少条
						var cid = DOM.val(DOM.get("#J_SelectItemCid")); //类目
		    	    	var type = DOM.val(DOM.get("#J_SearchSelling")); //出售中 库中
		    	    	var itemOrder = DOM.val(DOM.get("#J_SelectItemOrder"));//排序方式
		    	    	
		    	    	var data = "q="+title+"&cid="+cid+"&type="+type;
		            	    data +="&itemOrder="+itemOrder+"&pageSize="+itemPage;
							data +="&pid="+pid
//		    	    	if (type == 0) {
							//价格区间
							var startPrice = DOM.val(DOM.get("#J_StartPrice"));
							var endPrice = DOM.val(DOM.get("#J_EndPrice"));
							data += "&start_price="+startPrice+"&end_price="+endPrice;
//						}
						DOM.show('#J_LeftLoading');
					    DOM.hide('#J_MainLeftContent');
		        	    new H.widget.asyncRequest().setURI(getItemsFromTbUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).setDataType('json').send();
					},
					renderItems: function(c) {
						DOM.html(DOM.get("#J_TbItemList"), c ,true);
			            var lis = DOM.query("#J_TbItemList .J_TbItem");
			        	Event.on(lis, "mouseenter mouseleave click", function(ev){
			        		var el = DOM.get('.J_CheckBox',ev.currentTarget);
        					if(el.disabled) return;
			        			if(ev.type == 'mouseenter' ){
				            		DOM.addClass(ev.currentTarget, 'mouseover');
				        		}else if(ev.type == 'mouseleave'){
				        			DOM.removeClass(ev.currentTarget, 'mouseover');
				            	}else if(ev.type == 'click'){
							      	if(el.checked == false){
			        				DOM.addClass(ev.currentTarget,'selected');
			        				el.checked = true;
			        			}else{
			        				DOM.removeClass(ev.currentTarget,'selected');
			        				PromopropsItem.Form.setCheckboxOff(DOM.get('#J_TopCheckAll'));
			        				el.checked = false;
			        			}
			        		}
			        	});
	    				PromopropsItem.Form.setCheckboxOff(DOM.get('#J_TopCheckAll'));
					},
					checkAll : function(e) {
						checkBoxs = DOM.query('#J_TbItemList .J_CheckBox');
						len = checkBoxs.length;
						for(i=0; i<len; i++){
							var iid = checkBoxs[i].value;
							if(checkBoxs[i].disabled) continue;
							if(this.checked){
								checkBoxs[i].checked = true;
								DOM.addClass('#J_TbItem_'+iid,'selected');
							} else {
								checkBoxs[i].checked = false;
								DOM.removeClass('#J_TbItem_'+iid,'selected');
							}
						}
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
			    			PromopropsItem.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_Paging',2);
			    			PromopropsItem.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_TopPaging',3);
			    			PromopropsItem.renderItems(o.payload.body);
							DOM.hide('#J_LeftLoading');
					    	DOM.show('#J_MainLeftContent');
	//						PromopropsItem.msg.hide();
				    	};
			        	 if(DOM.val(DOM.get("#J_SearchTitle")) != '关键字、商品链接、商品编码'){
		        	    	var title = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle"))); //标题
		        	    }else{
		        	    	var title ='';
		        	    }
						var itemPage = DOM.val(DOM.get("#J_SelectItemPage"));//每页多少条
						var cid = DOM.val(DOM.get("#J_SelectItemCid")); //类目
		    	    	var type = DOM.val(DOM.get("#J_SearchSelling")); //出售中 库中
		    	    	var itemOrder = DOM.val(DOM.get("#J_SelectItemOrder"));//排序方式
		    	    	
		    	    	var data = "q="+title+"&cid="+cid+"&type="+type;
		            	    data +="&itemOrder="+itemOrder+"&pageSize="+itemPage;
							data +="&pid="+pid+"&page_id="+pageId
		    	    	if (type == 0) {
							//价格区间
							var startPrice = DOM.val(DOM.get("#J_StartPrice"));
							var endPrice = DOM.val(DOM.get("#J_EndPrice"));
							data += "&start_price="+startPrice+"&end_price="+endPrice;
						}
						DOM.show('#J_LeftLoading');
					    DOM.hide('#J_MainLeftContent');
		        	    new H.widget.asyncRequest().setURI(getItemsFromTbUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
					},
					addSelectItemsToPromotion :function(iid){
						if(!showPermissions('editor_promoprops','促销道具')){
							return ;
						}
						DOM.attr('#J_TopAddToPromo','disabled',true);
						DOM.addClass('#J_TopAddToPromo','button-disabled');
						
						checkBoxs = DOM.query("#J_TbItemList .J_CheckBox");
						var json = [];
						len = checkBoxs.length;
						var translateDiv = DOM.get("#J_Translate");
						for(i=0; i<len; i++){
							var flag = false;
							if(iid!=undefined){
								if(checkBoxs[i].value == iid && !checkBoxs[i].disabled)
									 flag = true;
							}else{
								if(checkBoxs[i].checked && !checkBoxs[i].disabled)
									 flag = true;
							}
							if(flag == true){
								var totalNum = Number(DOM.val('#J_TotalPromoItems'));	 
								totalNum = totalNum+1;
								if(totalNum >150){
									new H.widget.msgBox({
												    title:"温馨提示",
												    content:'非全店类型道具卡宝贝数量不能大于150个，当前已加入'+totalNum+'个宝贝，请删除多余的宝贝。',
												    type:"info"
												});
									break;
								}else{
									 DOM.val('#J_TotalPromoItems',totalNum);
								}
		                        var id = checkBoxs[i].value;
		                        var title = H.util.strProcess(DOM.val(DOM.get('#J_ItemTitle_'+id)));
		        				var picUrl = DOM.val(DOM.get('#J_ItemPic_'+id));
		        				var price = DOM.val(DOM.get('#J_ItemPrice_'+id));
								var outId = H.util.strProcess(DOM.val(DOM.get('#J_ItemOuterId_'+id)));
		        				o = '{"id":"' + id + '", "outer_id":"' + outId + '", "title":"' + title + '", "price":"' + price + '", "pic_url":"' + picUrl +'"}';
								o = eval('(' + o + ')');
		                        json.push(o);
		        				if(iid!=undefined){
		        					break;
		        				}
							}
			            }
						//alert(KISSY.JSON.stringify(json));
						if(json.length == 0){
							new H.widget.msgBox({
									    title:"错误提示",
									    content:'未选择任何宝贝！',
									    type:"error",
										autoClose:true,
										timeOut :2000
									
									});
							DOM.attr('#J_TopAddToPromo','disabled',false);
							DOM.removeClass('#J_TopAddToPromo','button-disabled');
							return;
						}
			            var itemsJson = KISSY.JSON.stringify(json);
			            var submitHandle = function(o) {
			            	DOM.attr('#J_TopAddToPromo','disabled',false);
							DOM.removeClass('#J_TopAddToPromo','button-disabled');
			            	if (o.payload.limit != null) {
								new H.widget.msgBox({
								    title:"操作失败",
								    content:o.payload.limit,
								    type:"error"
								});
		    				} 
	   						if(PromopropsItem.paginator){
								PromopropsItem.paginator.toPage(PromopropsItem.paginator.page);
							}else{
								PromopropsItem.searchTbItems();
							}
		        	    };
		        	    var errorHandle = function(o) {
		        	    	DOM.attr('#J_TopAddToPromo','disabled',false);
							DOM.removeClass('#J_TopAddToPromo','button-disabled');
							new H.widget.msgBox({
									    title:"错误提示",
									    content:o.desc,
									    type:"error"
									});
		            	};
		         	    var data = "pid="+pid+"&items="+itemsJson+"&form_key="+FORM_KEY;
		         	    new H.widget.asyncRequest().setURI(addPromoItemsUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
					},
	
					//搜索活动中宝贝
			    	loadPromotionItems :function() {
				    	var submitHandle = function(o) {
			        	    totalRecords = o.payload.totalRecords;
			        	    if(totalRecords > 0){
								DOM.get('#J_REmpty').style.display = 'none';	
								DOM.css(DOM.query(".J_PromotionItemBtnHolder"),'display','');
								if(totalRecords == 1){
									new H.widget.msgBox({
												    title:"温馨提示",
												    content:'非全店道具卡宝贝数量需大于1个，否则活动不会生效。',
												    type:"info"
												});
								}
//								if(totalRecords > 150){
//									var str = '<div class="point"><span>非全店类型道具卡宝贝数量不能大于150个，请删除多余的宝贝，或酌情分多次活动创建</span><br/><div style="width:80px;" class="btm-content btm-margin-30auto"><input name="" type="button" value="关闭" onclick="PromopropsItem.msg.hide()" class="btm-68-orange fl" style="display:inline" /></div></div>'; 
//									PromopropsItem.msg.setHeader('温馨提示').setMsg(str).showDialog();	
//								}
							} else {
								DOM.get('#J_REmpty').style.display = '';
								DOM.css(DOM.query(".J_PromotionItemBtnHolder"),'display','none');
							}
			        	    DOM.html(DOM.get("#J_PromotionItemList"), o.payload.body,true);
	//		        	    PromopropsItem.msg.hide();
							DOM.hide('#J_RightLoading');
							DOM.show('#J_MainRightContent');
			        	    pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
							PromopropsItem.renderPromoItems();
							PromopropsItem.promotionItemPaginator = new showPages('PromopropsItem.promotionItemPaginator').setRender(PromopropsItem.promotionItemPaginationHandle).setPageCount(pageCount).printHtml('#J_PromotionItemPaging',2);
				    	};
				    	 if(DOM.val(DOM.get("#J_RightSearchTitle")) != '关键字、商品链接、商品编码'){
	        	    		var title = encodeURIComponent(DOM.val(DOM.get("#J_RightSearchTitle"))); //标题
	        	   		 }else{
	        	    		var title ='';
	        	   		 }
		        	    var status = DOM.val(DOM.get('#J_SearchStatus'));
		        	    var itemPage = DOM.val(DOM.get("#J_RightSelectItemPage"));//每页多少条
		        	    var status = DOM.val(DOM.get('#J_SearchStatus'));
		        	    var data = "pid="+pid+"&status="+status+"&q="+title+"&page_size="+itemPage;
						DOM.show('#J_RightLoading');
						DOM.hide('#J_MainRightContent');
		        	    new H.widget.asyncRequest().setURI(loadPromotionItemsUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
					},
					
					renderPromoItems : function(){
						var lis = DOM.query("#J_PromotionItemList .J_TbItem");
			        	Event.on(lis, "mouseenter mouseleave", function(ev){
			        		var el = DOM.get('.J_CheckBox' ,ev.currentTarget);
			        		if(el.disabled) return;
			        		if(ev.type == 'mouseenter'){
								DOM.addClass(ev.currentTarget,'hover');
			        		}else if(ev.type == 'mouseleave'){
								DOM.removeClass(ev.currentTarget,'hover')
							}
			        	})
			        	PromopropsItem.Form.setCheckboxOff(DOM.get('#J_RightBottonCheckAll'));
	    				PromopropsItem.Form.setCheckboxOff(DOM.get('#J_RightCheckAll'));
	    				PromopropsItem.Form.renderAll('#J_PromotionItemList');
			        	
			        	Event.on(DOM.query('#J_PromotionItemList .J_CheckBox'),'click',function(ev){
			        		//ev.stopPropagation();
			        		var iid = ev.currentTarget.value;
			        		if(this.checked){
			        			var checkBoxs = DOM.query("#J_PromotionItemList .J_CheckBox");
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
			        				PromopropsItem.Form.setCheckboxOn(DOM.get('#J_RightBottonCheckAll'));
									PromopropsItem.Form.setCheckboxOn(DOM.get('#J_RightCheckAll'));
			        			}
			        		}else{
			        			PromopropsItem.Form.setCheckboxOff(DOM.get('#J_RightBottonCheckAll'));
			        			PromopropsItem.Form.setCheckboxOff(DOM.get('#J_RightCheckAll'));
			        		}
			        	});
					},
					promotionItemPaginationHandle : function(turnTo) {
						pageId = turnTo;
			    		var submitHandle = function(o) {
			    			DOM.get("#J_RightCheckAll").checked = false;
			    			totalRecords = o.payload.totalRecords;
			        	     if(totalRecords > 0){
								DOM.get('#J_REmpty').style.display = 'none';	
								DOM.css(DOM.query(".J_PromotionItemBtnHolder"),'display','');
								if(totalRecords == 1){
										new H.widget.msgBox({
												    title:"温馨提示",
												    content:'非全店道具卡宝贝数量需大于1个，否则活动不会生效。',
												    type:"info"
												});
								}
//								if(totalRecords > 150){
//									var str = '<div class="point"><span>非全店类型道具卡宝贝数量不能大于150个，请删除多余的宝贝，或酌情分多次活动创建</span><br/><div style="width:80px;" class="btm-content btm-margin-30auto"><input name="" type="button" value="关闭" onclick="PromopropsItem.msg.hide()" class="btm-68-orange fl" style="display:inline" /></div></div>'; 
//									PromopropsItem.msg.setHeader('温馨提示').setMsg(str).showDialog();	
//								}
							} else {
								DOM.get('#J_REmpty').style.display = '';
								DOM.css(DOM.query(".J_PromotionItemBtnHolder"),'display','none');
							}
				    		pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
			    			PromopropsItem.promotionItemPaginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_PromotionItemPaging',2);
			    			DOM.html(DOM.get("#J_PromotionItemList"), o.payload.body);
	//		    			PromopropsItem.msg.hide();
							PromopropsItem.renderPromoItems();
							DOM.hide('#J_RightLoading');
							DOM.show('#J_MainRightContent');
				    	};
	//			    	PromopropsItem.msg.setMsg('正在获取宝贝，请稍候').show();
						DOM.show('#J_RightLoading');
						DOM.hide('#J_MainRightContent');
				    	 if(DOM.val(DOM.get("#J_RightSearchTitle")) != '关键字、商品链接、商品编码'){
	        	    		var title = encodeURIComponent(DOM.val(DOM.get("#J_RightSearchTitle"))); //标题
	        	   		 }else{
	        	    		var title ='';
	        	   		 }
		        	    var status = DOM.val(DOM.get('#J_SearchStatus'));
		        	    var itemPage = DOM.val(DOM.get("#J_RightSelectItemPage"));//每页多少条
		        	    var status = DOM.val(DOM.get('#J_SearchStatus'));
		        	    var data = "pid="+pid+"&status="+status+"&q="+title+"&page_size="+itemPage+"&page_id="+pageId;
			        	new H.widget.asyncRequest().setURI(loadPromotionItemsUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
					},
					
					//将活动中宝贝移除
					removePromotionItemHandle : function(promo_itemid,pidi,type) {
						if(!showPermissions('editor_promoprops','促销道具')){
							return ;
						}
						DOM.attr('#J_RemovePromotionItems','disabled',true);
						DOM.addClass('#J_RemovePromotionItems','button-disabled');
						itemIds = [];
						if(promo_itemid && pidi){
							itemIds.push(promo_itemid);
							pid = pidi;
						}else{
							checkBoxs = DOM.query("#J_PromotionItemList .J_CheckBox");
							len = checkBoxs.length;
							for(i=0; i<len; i++){
			                    if(checkBoxs[i].checked && !checkBoxs[i].disabled){
			                    	itemIds.push(checkBoxs[i].value);
			                    }
							}
						}
						if(itemIds.length == 0){
							new H.widget.msgBox({
									    title:"错误提示",
									    content:'未选择任何宝贝！',
									    type:"error",
										autoClose:true,
										timeOut :3000
									
									});
								DOM.attr('#J_RemovePromotionItems','disabled',false);
								DOM.removeClass('#J_RemovePromotionItems','button-disabled');
							return ;
						}
						var submitHandle = function(o) {
							DOM.attr('#J_RemovePromotionItems','disabled',false);
							DOM.removeClass('#J_RemovePromotionItems','button-disabled');
							
							if(type != 'promoItems'){
				        		PromopropsItem.loadPromotionItems();
							}else{
									if(iconControl.paginator){
										iconControl.paginator.toPage(iconControl.paginator.page);
									}else{
										iconControl.searchPromoItems();
									}
							}
		        	    };
		        	    var data = "pid="+pid+"&item_ids="+itemIds+"&form_key="+FORM_KEY;
		        	    new H.widget.asyncRequest().setURI(removePromotionItemUrl).setMethod("POST").setHandle(submitHandle).setData(data).send();
					},
					//活动中宝贝全选
					rightCheckAll : function(e) {
						//e.stopPropagation();
						checkBoxs = DOM.query("#J_PromotionItemList .J_CheckBox");
						len = checkBoxs.length;
						for(i=0; i<len; i++){
							var iid = checkBoxs[i].value;
							if(checkBoxs[i].disabled) continue;
							if(this.checked){
								if(e.currentTarget.id == 'J_RightCheckAll'){
									PromopropsItem.Form.setCheckboxOn(DOM.get('#J_RightBottonCheckAll'));
								}else{
									PromopropsItem.Form.setCheckboxOn(DOM.get('#J_RightCheckAll'));
								}
								PromopropsItem.Form.setCheckboxOn(checkBoxs[i]);
							} else {
								if(e.currentTarget.id == 'J_RightCheckAll'){
									PromopropsItem.Form.setCheckboxOff(DOM.get('#J_RightBottonCheckAll'));
								}else{
									PromopropsItem.Form.setCheckboxOff(DOM.get('#J_RightCheckAll'));
								}
								PromopropsItem.Form.setCheckboxOff(checkBoxs[i]);
							}
						}
					},
					retry : function(itemId,force){
						if(!showPermissions('editor_promoprops','促销道具')){
							return ;
						}
						var submitHandle = function(o) {
							PromopropsItem.msg.hide();
							if(PromopropsItem.promotionItemPaginator){
								PromopropsItem.promotionItemPaginator.toPage(PromopropsItem.promotionItemPaginator.page);
							}else{
								PromopropsItem.loadPromotionItems();
							}
						};
						var data = "promo_item_id="+itemId+"&force="+force;
						PromopropsItem.msg = new H.widget.msgBox({
								    title:"",
									dialogType : 'loading',
								    content:'系统正在处理中，请稍候'	
								});
		        	    new H.widget.asyncRequest().setURI(retryUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
					}
			
					
				
					
		    	};
}, {
    requires: ['utils/showPages/index','utils/beautifyForm/index','bui/select','switchable']
});