/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,showPages,TShop,ListParam,designControl,Switchable,Select,Overlay,beautifyForm) {   
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	
	return  list={
				tbItem : [],			//当前页获取宝贝
				selectItem : eval('('+ itemsJson+')'),   //已加入列表的宝贝
				preSelectItem : [], //预加入列表的宝贝（已选中）
				savedPics : [],//针对成人用品店已经保存的宝贝主图地址
				dialog : null,
				defaultItemFieldNames : {},
				defaultItemParams : eval('('+ defaultItemParamsJson+')'),
				defaultRateMess : {buyer_nick:"",buyer_level:"",content:""},
				listParams : eval('('+ listParamsJson+')'),
				designPics :  eval('('+ designPicsJson+')'),
			
				selectBoxPageNum : 100, //已选择宝贝 每页最大数
				paginator : null,  		//推荐宝贝 分页
				selectPaginator : null, //已推荐宝贝 分页
				panel : null,		    //对话框
				confirmPanel : null,    //保存对话框
				rate : 1,			    //设置原价倍数
				specRate : 1,			//设置特价倍数
				pageNum : 10,          //推荐宝贝 每页数量 
				msg : null,
				editFlag : false,
				initPreSelectTag : false, //标识是否已经有预览信息

				meal_price : {},
				meal_discount : {},
				meal_save : {},
				meal_meal_price : {},
				meal_url : {},
				lastedMealOffset : null,//最后一次选中的套餐的偏移量，主要用于切换搜索宝贝到套餐选择
				mealPageId : 1,
				mealPaginator : null,
				mealPageNum : 5,
				meals : [],
				useMeal : false,
				init : function() {
					//先定义-投手
                    S.each(list.defaultItemParams,function(item){
                        //自定义的宝贝级别参数名
                        list.defaultItemFieldNames[item.field_code] = item.field_name;
                    });
					//列表参数 宝贝参数 初始化
					ListParam.init(); 
				
					//默认排序
					var items1 = [
						{text:'12条',value:'12'},
						{text:'24条',value:'24'},
						{text:'36条',value:'36'}
					],
					sortSelect = new Select.Select({  
						render:'#J_SelectPage',
						valueField:'#J_SelectItemPage',
						items:items1
					});
					sortSelect.render();
					sortSelect.setSelectedValue('12');
					//选择分类
				    cidSelect = new Select.Select({  
					    render:'#J_SelectItemCidBox',
				      	valueField:'#J_SelectItemCid',
				      	items:S.JSON.parse(sellerCats),
				      	visibleMode : 'display'
					});
				    cidSelect.render();
				    cidSelect.setSelectedValue('0');
					DOM.css(DOM.query('.bui-list-picker'),{'left':'-999px','top':'-999px'});
					//选择活动
				    promoSelect = new Select.Select({  
					    render:'#J_PromoIdBox',
				      	valueField:'#J_PromoId',
				      	items:S.JSON.parse(ptomoLists),
				      	visibleMode : 'display'
					});
					promoSelect.render();
					promoSelect.setSelectedValue('0');
					//出售中
					var items2 = [
									{text:'全部',value:'0'},
									{text:'出售中',value:'1'},
									{text:'仓库中',value:'2'}
								],
				    sellSelect = new Select.Select({  
					    render:'#J_SearchSellingBox',
				      	valueField:'#J_SearchSelling',
				      	items:items2,
				      	visibleMode : 'display'
					});
				    sellSelect.render();
				    sellSelect.setSelectedValue('1');
					
					if(cid=='27' || hand_img_url=='1'){
						for(var k=0;k<list.selectItem.length;k++){
							var tempItem = list.selectItem[k];
							list.savedPics[tempItem.id] = tempItem.pic_url;
						}
					}
					window.iconTabs = new Switchable.Tabs('#J_main',{
							 		 navCls:'ks-switchable-nav',
							 		 contentCls:'main-content',
							 		 activeTriggerCls:'current',
							 		 triggerType: 'click'
							 	}).on('switch',function(ev){
								 		var index = ev.currentIndex;
								 		switch(index) {
								 			case 0:
								 				DOM.show('#J_Preview_Box');
								 				Event.remove('#J_SaveBtn');
								 				DOM.html('#J_SaveBtn','下一步');
								 				Event.on('#J_SaveBtn','click',function(){
								 				    list.preview();
								 				    iconTabs.switchTo(1);
							 				    });
								 				
								 				Event.remove('#J_PreviewBtn');
								 				if(list.preSelectItem.length>0 || list.selectItem.length>0){
								 					Event.on('#J_PreviewBtn','click',function(){list.preview();});
								 					DOM.attr('#J_PreviewBtn','disabled',false);
													DOM.removeClass('#J_PreviewBtn','button-disabled');
								 				}else{
								 					DOM.attr('#J_PreviewBtn','disabled',true);
													DOM.addClass('#J_PreviewBtn','button-disabled');
								 				}
								 			break;
								 			case 1:
								 				DOM.show('#J_Preview_Box');
								 				list.renderItems(list.tbItem);
								 				Event.remove('#J_SaveBtn');
								 				DOM.html('#J_SaveBtn','下一步');
								 				Event.on('#J_SaveBtn','click',function(){
								 					
								 					if(mtype==7 && !list.useMeal){
//								 							//弹框 输入套餐参数
								 							list.dialog.show();
								 					}else{
								 						list.addItems();
									 					list.preview();
									 					list.renderSelectItems(1);
									 					iconTabs.switchTo(2);
								 					}
								 					
								 				});
								 				Event.remove('#J_PreviewBtn');
								 				if(list.preSelectItem.length>0 || list.selectItem.length>0){
								 					Event.on('#J_PreviewBtn','click',function(){list.preview();});
								 					DOM.attr('#J_PreviewBtn','disabled',false);
													DOM.removeClass('#J_PreviewBtn','button-disabled');
								 				}else{
								 					DOM.attr('#J_PreviewBtn','disabled',true);
													DOM.addClass('#J_PreviewBtn','button-disabled');
								 				}
								 				DOM.addClass('#J_Step_1','current');
								 				DOM.addClass('#J_Step_2','current');
								 			break;
								 			case 2:
								 				if(mtype==7){
								 					if(meal_id != '0'){
								 						DOM.hide('.status-pendding');
								 					}else{
								 						DOM.show('.status-pendding');
								 					}
								 				}
								 				Event.remove('#J_SaveBtn');
								 				DOM.html('#J_SaveBtn','保存');
								 				Event.remove('#J_PreviewBtn');
								 				if(list.selectItem.length>0){
								 					Event.on('#J_PreviewBtn','click',function(){
								 						list.tempSave();
								 						list.preview();
								 					});
								 					Event.on('#J_SaveBtn','click',function(){
								 						list.tempSave();
								 						list.save()
								 					});
								 					DOM.attr('#J_PreviewBtn','disabled',false);
													DOM.removeClass('#J_PreviewBtn','button-disabled');
								 				}else{
								 					DOM.attr('#J_PreviewBtn','disabled',true);
													DOM.addClass('#J_PreviewBtn','button-disabled');
								 					DOM.hide('#J_Preview_Box');
								 				}
								 				DOM.addClass('#J_Step_1','current');
								 				DOM.addClass('#J_Step_2','current');
								 				break;	
								 		}
			 					})
			 					
					if(mtype==7){
						list.meals = eval('('+ mealListJson+')')
						if(list.meals.length>0){
							if(listId=='0') {
								list.useMeal = true;
							}else{
								if(meal_id != '0') list.useMeal = true;
							}
						}
						//查看有没有符合模板宝贝个数的套餐，有的话显示套餐列表，把initPreSelectTag设为true
						list.getMeals();
						list.getMealParam();
					}else{
						
						
					}
				 	if(list.useMeal){
				 		// 有官方搭配套餐的 处理
				 		DOM.hide('#J_FirstStepBox');
		 				DOM.show('#J_ToggleC');
				 		DOM.show('#J_IndexMain');
				 		DOM.show('#J_ShowMealDiv');//显示官方搭配套餐
				 		DOM.show('#J_StepBox');  //显示下一步 预览
				 	}else {
				 		// 没有官方搭配套餐的 处理
				 		if(mtype==7){
				 			DOM.show('#J_FirstStepBox');
				 			list.searchTbItems();
				 			Event.on('#J_NoOrderDapei','click',function(ev){
				 				DOM.show('#J_StepBox');
				 				DOM.show('#J_ToggleC');
				 				DOM.hide('#J_FirstStepBox');
				 				DOM.show('#J_ShowTbItemDiv');
				 				DOM.show('#J_IndexMain');
				 			});
				 			if(isShowFirst == 0){
				 				Event.fire('#J_NoOrderDapei','click');
				 			}
				 		}else{
				 			DOM.show('#J_StepBox');
			 				DOM.show('#J_ToggleC');
				 			list.searchTbItems();
				 			DOM.show('#J_IndexMain');
				 			DOM.show('#J_ShowTbItemDiv');
				 		}
				 	}
			 		//在编辑列表中显示已经选中的宝贝
				 	if (list.selectItem.length > 0) {
				 		list.renderSelectItems(1, true);
				 		list.editFlag = true;
				 	}
			 		
					Event.on('#J_SearchBtn','click',list.searchTbItems);
					Event.on('#J_ListBoxToggle','click',list.toggle);
					
//					Event.on('.J_TurnMealButt','click',function(){
//						var meal = list.meals;
//						var mealCheckTrue = false;
//						var mealLimitNum = '';
//						for(var i=0;i<meal.length;i++){
//    		                if(meal[i].item_list.length == limit){
//    		                    mealCheckTrue = true; 
//    		                    break;
//    		                }else{
//    		                    mealLimitNum += meal[i].item_list.length + ',';
//    		                }
//						}
//                        var delComma = new RegExp(",$","g");
//						mealLimitNum = mealLimitNum.replace(delComma,'');
//						if(!mealCheckTrue){
//						    new H.widget.msgBox({
//						        title:"错误提示",
//						        content:'您选中的模板规格支持的宝贝数为:'+limit+'个,与您的官方搭配套餐支持的宝贝数('+mealLimitNum+')不符!请返回第二步选择合适的“规格x宽度x个数”',
//						        type: "confirm",
//                                buttons: [{ value: "返回第二步" }, { value: "取消" }],
//                                success: function (result) {
//                                    if (result == "返回第二步") {
//                                        iconTabs.switchTo(0);
//                                    }
//                                }
//						    });
//                            return;
//						}
//						list.selectItem = [];
//						list.preSelectItem = [];
//						if(list.lastedMealOffset != null) {
//							meal_id = list.meals[list.lastedMealOffset].meal_id;
//							list.addMeal(list.lastedMealOffset);
//						}
//						list.preview();
//						list.renderSelectItems();
//						DOM.hide('#J_ShowTbItemDiv');
//						DOM.show('#J_ShowMealDiv');
//					})
					
					
					
					Event.on('#J_SaveBtn','click',function(){list.preview();iconTabs.switchTo(1);});
					Event.on('#J_PreviewBtn','click',function(){list.preview();});
			},
			// 设置 所有宝贝
			setAllItems : function(){
				var items = list.selectItem;
				var len = items.length;
				if (len==0) {
					return;
				}
				var itemParams = [];
				S.each(DOM.query('.J_SetAllItem'),function(item){
					var itemPar = {};
					itemPar.param_id = DOM.val(DOM.get('.J_Param_ParamId', item));
					itemPar.field_code = DOM.val(DOM.get('.J_Param_FieldCode', item));
					itemPar.value = DOM.val(DOM.get('.J_Param_Value', item));
					itemPar.field_name = list.defaultItemFieldNames[itemPar.field_code];
					itemParams.push(itemPar);
				})
				for (var i=0; i<len; i++) {
					id = items[i].id;
					//items[i].price = DOM.val(DOM.get('#J_Price_'+id));
					//items[i].spec_price = DOM.val(DOM.get('#J_SpecPrice_'+id));
					items[i].item_params = itemParams;
				}
				
				list.selectItem = items;
				list.renderSelectItems(1);	
   			    new H.widget.msgBox({
					type : "sucess",
					dialogType : 'msg',
				    content:'设置成功',
				    autoClose:true,
				    timeOut:3000
				});
				list.preview();
			},

			initPreSelectItem : function(){
				if(list.initPreSelectTag){
					return;
				}
				if(list.selectItem.length==0){
					if(mtype =='7'){
						var preInitNum = parseInt(limit);}
					else{
						if(irregular=='1'){
							var preInitNum = limit;
						}else{
							var preInitNum = 1;
						}
					}				
					for(i=0;i<preInitNum;i++){
						if(list.tbItem[i]){
							var theTbItem = list.tbItem[i];
							//alert(KISSY.JSON.stringify(firstTbItem));
							var item = {
								'id': theTbItem.num_iid,
								'title': theTbItem.title,
								'promo_title': theTbItem.title,
								'price': theTbItem.price,
								'spec_price': theTbItem.price,
								'volume': 0,
								'pic_url': theTbItem.pic_url,
								'order' : 99
							};
							item.item_params = list.defaultItemParams;
							item.rate_ids = '';
							//直接加入到selectItem
							//list.selectItem.push(item);
							list.preSelectItem.push(item);

							//2012-11-09
							if(hand_img_url=='1' && cid!='27'){
								var guige = DOM.val('#J_items_per_line').split('_');
								var item_w = guige['2']
								var url_suf = '_'+item_w+'x'+item_w+'.jpg';
//								if(url_suf=='_220x220.jpg'){
//									url_suf = '_b.jpg';
//								}
								list.savedPics[item.id] = item.pic_url+url_suf;
								//alert(list.savedPics[item.id]);
							}
						}
					}
				}
				list.initPreSelectTag = true;
				//DOM.show('#J_ShowTbItemDiv');
				list.preview();
			},
			getMealParam : function(){
				var str ='<ul class="ui-about-list" >';
				for(k=1; k<=5; k++){
	            	var list_par = DOM.get('#J_list_param'+k);
	            	if(list_par){
	                	switch(list_par.title){
	                		case '套餐原价':
								list.meal_price = list_par;
								str += '<li class=""><div class="ui-side-list">套餐原价：</div><div class="ui-content-list"><input type="text" id="J_MealPrice" title="套餐原价" class="input-text-3" value="'+list.meal_price.value+'"></div></li>';
	                    		DOM.hide(DOM.parent(list_par,2));
								break;
	                		case '套餐折扣':
	                			list.meal_discount = list_par;
	                			str += '<li class=""><div class="ui-side-list">套餐折扣：</div><div class="ui-content-list"><input type="text" id="J_MealDiscount" title="套餐折扣" class="input-text-3" value="'+list.meal_discount.value+'"></div></li>';
	                			DOM.hide(DOM.parent(list_par,2));
	                			break;
	                		case '节省的钱':
	                			list.meal_save = list_par;
	                			str += '<li class=""><div class="ui-side-list">节省的钱：</div><div class="ui-content-list"><input type="text" id="J_MealSave" title="节省的钱" class="input-text-3" value="'+list.meal_save.value+'"></div></li>';
	                			DOM.hide(DOM.parent(list_par,2));
	                			break;
	                		case '套餐现价':
	                			list.meal_meal_price = list_par;
	                			str += '<li class=""><div class="ui-side-list">套餐现价：</div><div class="ui-content-list"><input type="text" id="J_MealMealPrice" title="套餐现价" class="input-text-3" value="'+list.meal_meal_price.value+'"></div></li>';
	                			DOM.hide(DOM.parent(list_par,2));
	                    		break;
	                		case '套餐链接':
	                			list.meal_url = list_par;
	                			DOM.hide(DOM.parent(list_par,2));
	                			str += '<li class=""><div class="ui-side-list">套餐链接：</div><div class="ui-content-list">';
	                			str += '<label class="beautify_radio" for="J_ShopUrl"><input name="shop_url" class="J_radio" id="J_ShopUrl" value="1" type="radio" checked="checked">使用店铺地址</label>';
	                			str += '<label class="beautify_radio" for="J_ItemUrl"><input name="shop_url" class="J_radio" id="J_ItemUrl" value="1" type="radio">宝贝地址</label><br/>';
	                			str += '<input type="text" id="J_MealUrlForShop" title="套餐链接" class="input-text-3 dapeitaocan-mt8" value="'+shopUrl+'">';
	                			str += '<input type="text" style="display:none"id="J_MealUrlForItem" title="套餐链接" class="input-text-3" value="可以输入宝贝id即可" onfocus="if(this.value==\'可以输入宝贝id即可\'){this.value = \'\';}" onblur="if(this.value==\'\'){this.value = \'可以输入宝贝id即可\'}">';
	                			str += '</div></li>';
	                    		break;
	                	}
	            	}
	    		}
				str += '<li class="title-params"><div style="text-align: center;"><span style="color:#ffce55">如果需要生成搭配套餐链接功能，请订购</span><a href="" target="_blank">官方的搭配套餐</a></div></li></ul> '
			
				list.dialog = new Overlay.Dialog({
     	            title:'输入搭配信息<span class="color-v4" style="font-weight: 100;font-size: 12px;">本模板纯粹展示，无配套餐功能</span>',
     	            width:450,
     	            height:450,
     	            elAttrs :{id : 'J_DapeiDialog'},   
     	            mask:false,
     	            buttons:[
     	                   {
     	                     text:'确定',
     	                     elCls : 'bui-button bui-button-primary',
     	                     handler : function(){
     	                	    list.checkDapei();
     	                     }
     	                   },{
     	                     text:'关闭',
     	                     elCls : 'bui-button',
     	                     handler : function(){
     	                       this.hide();
     	                     }
     	                   }
     	                 ],
     	                bodyContent : str
     	          });
				list.dialog.render();
				list.beautifyForm = new beautifyForm();
				 Event.on('.J_radio','click',function(ev){
	            	 if(DOM.get('#J_ShopUrl').checked){
	            		 DOM.show('#J_MealUrlForShop');
	            		 DOM.hide('#J_MealUrlForItem');
	            	 }else{
	            		 DOM.hide('#J_MealUrlForShop');
	            		 DOM.show('#J_MealUrlForItem');
	            	 }
	             })
				//list.dialog.show();
			},
			// 没有官方搭配套餐的 填写 搭配套餐信息后的判断
			checkDapei : function(){
					list.meal_price.value = DOM.val('#J_MealPrice'); 
					list.meal_discount.value = DOM.val('#J_MealDiscount'); 
					list.meal_save.value = DOM.val('#J_MealSave'); 
					list.meal_meal_price.value =DOM.val('#J_MealMealPrice');  
					if(DOM.get('#J_ShopUrl').checked){
						list.meal_url.value = DOM.val('#J_MealUrlForShop');  
		           	 }else{
		           		list.meal_url.value = DOM.val('#J_MealUrlForItem');  
		           	}
				 	list.addItems();
					list.preview();
					list.renderSelectItems(1);
					iconTabs.switchTo(2);
					list.dialog.hide();
			},
			//选择套餐，显示变化、预览（直接加入selectItem）(宝贝不可取消,只可通过套餐来取消)
			selectMeal : function(offset){
				var meal = list.meals[offset];
				if(meal_id == meal.meal_id)return
				if(meal.item_list.length != limit){
						new H.widget.msgBox({
							    title:"错误提示",
							    content:'您选中的模板规格支持的宝贝数为:'+limit+'个!',
							    type:"error",
								autoClose : true,
								timeOut : 3000
							});
					return;
				}
				list.selectItem = [];
				list.preSelectItem = [];
				list.addMeal(offset);
				meal_id = meal.meal_id;
	    		list.lastedMealOffset = offset;
	    		//J_DapeiTaocan_
	    		DOM.replaceClass('.J_DapeiTaocan', 'chosen', 'choose');
	    		DOM.replaceClass('#J_DapeiTaocan_'+offset, 'choose', 'chosen');
				list.preview();
			},
			//套餐切换到搜索（清除已选套餐的宝贝），再切换回来时(清除已选的宝贝) 通过lastedMealOffset来添加套餐中的宝贝，设置套餐参数
			addMeal : function(offset){
				var meal = list.meals[offset];
				for(j=0;j<meal.item_list.length;j++){
					var mealItem = meal.item_list[j];
					var item = {
						'id': mealItem.id,
						'title': mealItem.title,
						'promo_title': mealItem.promo_title,
						'price': mealItem.price,
						'spec_price': mealItem.price,
						'volume': mealItem.volume,
						'pic_url': mealItem.pic_url,
						'order' : mealItem.order
					};
					item.item_params = list.defaultItemParams;
					item.rate_ids = '';
					list.selectItem.push(item);
				}
				//alert(meal.url);
				list.meal_price.value = meal.price;
	    		list.meal_discount.value = meal.discount;
	    		list.meal_save.value = meal.save;
	    		list.meal_meal_price.value = meal.meal_price;
	    		list.meal_url.value = meal.url;
			},
			//获取套餐信息
			getMeals : function() {
				var renderMeals = function(frontPageId){
					var start = list.mealPageNum * (frontPageId - 1);
	            	var end = list.mealPageNum * frontPageId;
	            	if (end > list.meals.length) {
	                	end = list.meals.length;
	                }
	                var str = '<div class="clear"></div>';
	                str += '<div class="dapeitaocan m-auto">';
	               
	            	for (i=start; i<end; i++) {
	                	var meal = list.meals[i];
	                	var items = meal.item_list;
						var len = items.length;
	                	//if(meal.status!='VALID' || len!=parseInt(limit)){
	                	if(meal.status!='VALID'){
	                		str += '<div id="J_DapeiTaocan_'+i+'" class="J_DapeiTaocan m-auto mt15 choose-fail relative" style="*zoom:1">';
	                	}else{
	                		if(meal.meal_id==meal_id){
	                			str += '<div id="J_DapeiTaocan_'+i+'" class="J_DapeiTaocan m-auto mt15 chosen relative" style="*zoom:1">';
	                    	}else{
	                    		str += '<div id="J_DapeiTaocan_'+i+'" class="J_DapeiTaocan m-auto mt15 choose relative" style="*zoom:1">';
	                    	}
	                	}
	                	
	                	str += '<div class="inner"><div class="taocan-choose fl relative" style="height:240px;">';
	                	str +=      '<div class="taocan-content">';
	                	str += 			'<span style=" padding:10px 0 0 0; color:#656d7a; display:block;font-weight: bold;">套餐名称：'+meal.meal_name+'</span><br/>';
	                	str += 			'原价：'+meal.price+'<br/>现价：'+meal.meal_price+'<br/> 当前状态：';
	                	if(meal.status != 'VALID'){
	                		str += '无效';	
	                	}else{
	                		str += '有效';
	                	}
	                	str += 			'<br/>';
	                	str += 		'</div>';
	                	
	                	str += 		'<div class="taocan-btm btm-style-1">';
	                	str += 			'<button class="button button-green" onclick="list.selectMeal('+i+')">选择此套餐</button>';
	                	str += 		'</div>';
	                	str += 		'<div class="taocan-btm btm-style-2">';
	                	str += 			'<button class="button button-green">已选择套餐</button>';
	                	str += 		'</div>';
	                	str += 		'<div class="taocan-btm btm-style-3">';
	                	str += 			'<button class="button button-gray">不可选套餐</button>';
	                	str += 		'</div>';
	                	
	                	str += 		'<div class="float-img"></div>';
	                	str += '</div>';
	                	str += '<div class="taocan-list fl">';
	                	str += 		'<ul>';
	                	
						
						for (j=0; j<len; j++) {
							var item = items[j];
							str += '<li class="w-153">';
		                	str += 		'<div class="baobei-img-h-140 center">';
		                	str += 			'<a href="http://item.taobao.com/item.htm?id='+item.id+'" target="_blank">';
		                	str += 				'<img border="0" src="'+item.pic_url+'_120x120.jpg">';
		                	str += 			'</a></div>';
		                	str += 		'<div class="text"> ';
		                	str += 			'<a target="_blank" href="http://item.taobao.com/item.htm?id='+item.id+'" style="text-decoration:none"><span style="color:#666666">'+item.title+'</span></a>';
		                	str += 		'</div>';
		                	str += 		'<span class="price">￥<span style="color:#ff0000; font-weight:bold">'+item.price+'</span></span>';
		                	str += '</li>';
						}
	                	str += 		'<div class="clear"></div>';
	                	str += 		'</ul>';
	                	str += '</div>';
	                	str += '<div class="opacity"></div>';
	                	str += '<div class="success-img"></div>';
	                	str += '<div class="clear"></div></div>';
	                	str += '</div>';
	            	}
	            	str += '</div>';
	            	
	            	DOM.html('#J_MealContainer', str);
				}
				
				var handlePagination = function(turnTo) {
					renderMeals(turnTo);
					//显示分页
					list.mealPaginator.setPage(turnTo).printHtml('#J_MealBottomPaging',2);
					//list.mealPaginator.setPage(turnTo).printHtml('#J_MealTopPaging',3);
				}
				
				var pageCount = Math.ceil(list.meals.length/list.mealPageNum); 
				list.mealPaginator = new showPages('list.mealPaginator').setRender(handlePagination).setPageCount(pageCount).printHtml('#J_MealBottomPaging',2);
				//list.mealPaginator.printHtml('#J_MealTopPaging',3);
				if(list.useMeal) {
					list.initPreMealItem();
				}
				handlePagination(list.mealPageId);
				if(list.useMeal && meal_id!='0'){
					list.preview();
				}
			},
			//初始化meal_id、mealPageId、设置套餐参数、把宝贝加入selectItem
			initPreMealItem : function(){
				if(list.initPreSelectTag){
					return;
				}
				var meals = list.meals;
				var len = meals.length;
				if(meal_id != '0'){
					for(i=0; i<len; i++){
						if(meals[i].meal_id==meal_id){
							list.lastedMealOffset = i;
							list.mealPageId = Math.ceil( (i+1)/list.mealPageNum);
							break;
						}
					}
				}else {
					var isSelect = false ;
					var str = '您的官方搭配套餐的宝贝个数为';
					var b= '';
					var provisionalTable = {};
					for(i=0; i<len; i++){
						if (!provisionalTable[meals[i].item_list.length]) {
							b += meals[i].item_list.length +'，';
							provisionalTable[meals[i].item_list.length] = true;
						}
						if(meals[i].status=='VALID' && meals[i].item_list.length==parseInt(limit)){
							list.addMeal(i);
							list.lastedMealOffset = i;
							meal_id = meals[i].meal_id;
							list.mealPageId = Math.ceil((i+1)/list.mealPageNum);
							isSelect = true ;
							break;
						}
					}
				}
				if(!isSelect){
					str += b+'!当前模板支持的宝贝个数为'+limit+'，请到设置模板里 <span style="color:#ffce55">(尺寸/宝贝数)</span>选择宝贝个数为'+b;
					 new Overlay.Dialog({
		     	            title:'温馨提示',
		     	            width:300,
		     	            height:100,
		     	            mask:false,
		     	            closeAction : 'destroy',
		     	            buttons:[
		     	                   {
		     	                     text:'确定',
		     	                     elCls : 'bui-button bui-button-primary',
		     	                     handler : function(){
		     	                       this.hide();
		     	                     }
		     	                   }
		     	                 ],
		     	            bodyContent:'<div class="point relative"><div class="point-w-2">'+str+'</div></div>'
		     	          }).show();
					
				}else{
					list.preview();
				}
				list.initPreSelectTag = true;
			},
			
			//搜索宝贝
			searchTbItems : function() {
	        	var submitHandle = function(o) {
		    	    	totalRecords = o.payload.totalRecords;
		    	    	list.tbItem = o.payload.items;
		    	    	DOM.get('#J_NoteIcon').style.display = 'none';
						if(totalRecords > 0){
							DOM.get('#J_LEmpty').style.display = 'none';
							DOM.css(DOM.query(".J_ItemSelectBtnHolder"), 'display','');
						} else {
							DOM.get('#J_LEmpty').style.display = '';
							DOM.css(DOM.query(".J_ItemSelectBtnHolder"), 'display','none');
						}
						pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
						list.renderItems(o.payload.items);
						 var handlePagination = function(turnTo) {
						    	pageId = turnTo;
					    		var submitHandle = function(o) {
					    			list.tbItem = o.payload.items;
					    			totalRecords = o.payload.totalRecords;
					    			if(totalRecords > 0){
										DOM.get('#J_NoteIcon').style.display = 'none';
										DOM.get('#J_LEmpty').style.display = 'none';
										DOM.css(DOM.query(".J_ItemSelectBtnHolder"), 'display','');
									} else {
										DOM.get('#J_LEmpty').style.display = '';
										DOM.css(DOM.query(".J_ItemSelectBtnHolder"), 'display','none');
									}
					    			pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
					        	    list.renderItems(o.payload.items);
					        	    DOM.hide('#J_LeftLoading');
									DOM.show('#J_MainLeftContent');
					        	    //list.msg.hide(false);
					    	        //list.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_TopPaging',3);
									list.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_BottomPaging',2);
						    	};
						    	 if(DOM.val(DOM.get("#J_SearchTitle")) != '关键字、商品链接、商品编码'){
						       	    	var title = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle"))); //标题
						       	    }else{
						       	    	var title ='';
						       	    }
						           	var ccid = DOM.val(DOM.get("#J_SelectItemCid")); //类目
						   	    	var type = DOM.val(DOM.get("#J_SearchSelling")); //出售中 库中
						   	    	var itemPage = DOM.val(DOM.get("#J_SelectItemPage"));//每页多少条
						   	    	var pid = DOM.val(DOM.get("#J_PromoId"));
						   	    	//价格区间
						   	    	var startPrice = DOM.val(DOM.get("#J_StartPrice"));
						        	    var endPrice = DOM.val(DOM.get("#J_EndPrice"));
						   	    	var data = "q="+title+"&cid="+ccid+"&type="+type;
						           	    data += "&start_price="+startPrice+"&end_price="+endPrice;
						           	    data +="&pageSize="+itemPage+"&pid="+pid+"&page_id="+pageId;
					        	//list.msg.setMsg('正在获取宝贝，请稍候').show();
						           	DOM.show('#J_LeftLoading');
									DOM.hide('#J_MainLeftContent');   	
					    	    new H.widget.asyncRequest().setURI(getItemsFromTbUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
							}
						//list.paginator = new showPages('list.paginator').setRender(handlePagination).setPageCount(pageCount).printHtml('#J_TopPaging',3);
						list.paginator = new showPages('list.paginator').setRender(handlePagination).setPageCount(pageCount).printHtml('#J_BottomPaging',2);
						//list.msg.hide(false);
						DOM.hide('#J_LeftLoading');
						DOM.show('#J_MainLeftContent');
						list.initPreSelectItem();
		    	};
		    	 var errorHandle = function(o){
		    	    	DOM.hide('#J_LeftLoading');
						DOM.show('#J_MainLeftContent');
		   			    new H.widget.msgBox({
							dialogType : 'loading',
						    content:o.desc
						});
		        };
	    	    if(DOM.val(DOM.get("#J_SearchTitle")) != '关键字、商品链接、商品编码'){
	       	    	var title = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle"))); //标题
	       	    }else{
	       	    	var title ='';
	       	    }
	           	var ccid = DOM.val(DOM.get("#J_SelectItemCid")); //类目
	   	    	var type = DOM.val(DOM.get("#J_SearchSelling")); //出售中 库中
	   	    	var itemPage = DOM.val(DOM.get("#J_SelectItemPage"));//每页多少条
	   	    	var pid = DOM.val(DOM.get("#J_PromoId"));
	   	    	//价格区间
	   	    	var startPrice = DOM.val(DOM.get("#J_StartPrice"));
	        	    var endPrice = DOM.val(DOM.get("#J_EndPrice"));
	   	    	var data = "q="+title+"&cid="+ccid+"&type="+type;
	           	    data += "&start_price="+startPrice+"&end_price="+endPrice;
	           	    data +="&pageSize="+itemPage+"&pid="+pid;
	        	//list.msg.setMsg('正在获取宝贝，请稍候').show();
	        	DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainLeftContent');
		    	new H.widget.asyncRequest().setURI(getItemsFromTbUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},

			//渲染宝贝
			renderItems : function(items) {
				var len = items.length;
				DOM.attr('#J_TCheckAll','checked',false);
				var els = '';
				for (var i=0; i<len; i++) {
					var disabled = '';
					var selected ='';
					var hasIn = false;
					if (list.hasSelected(items[i].num_iid)) {
						hasIn = true;
						disabled = 'disabled="disabled" checked="checked"'; 
						selected = 'uncheck'
					}else{
						if (list.hasPreSelected(items[i].num_iid)) {
							hasIn = true;
							disabled = 'checked="checked"'; 
							selected = 'selected'
						}
					}
					els +='<li class="J_TbItem relative '+selected+'" id="J_TbItem_'+items[i].num_iid+'">'
			            +'<div class="goods-img">'
	                 	+'<a target="_blank" href="http://item.taobao.com/item.htm?id='+items[i].num_iid+'" class="w-160">' 
	               		+'<img border="0"  src="'+items[i].pic_url+'_120x120.jpg" width="120" height="120">'
	                	+'</a>'
	             		+'</div>'
	             		+'<div class="goods-text">' 
	             		+'<a target="_blank"  href="http://item.taobao.com/item.htm?id='+items[i].num_iid+'">'
	                    +'<span class="goods-info">'+items[i].title+'</span>'
	              		+'</a><span class="goods-price">￥<b class="color-red">'+items[i].price+'</b></span>'
	             		+'</div>'
	             		+'<div class="ol-base"></div><div class="ol-mouseover"><div class="border"><span class="ol-text-ext">点击选择</span></div></div><div class="ol-click"><div class="ol-img-checked"></div><span class="ol-text-ext">点击取消</span><br/><a href="http://item.taobao.com/item.htm?id='+items[i].num_iid+'"target="_blank"><span class="ol-img-view"></span></a></div><div class="ol-uncheck"><span class="ol-text-ext">已加入活动<br/></span><a href="http://item.taobao.com/item.htm?id='+items[i].num_iid+'"target="_blank"><span class="ol-img-view"></span></a></div>';
				if(hasIn){
					els += '<span class="fl" style="display:none"><input type="checkbox"  id="J_CheckBox_'+items[i].num_iid+'" '+disabled+' class="J_CheckBox" name="selectedIds" value="'+items[i].num_iid+'">&nbsp;选择</span>';
				}else{
					els += '<span class="fl" style="display:none"><input type="checkbox"  id="J_CheckBox_'+items[i].num_iid+'"  class="J_CheckBox" name="selectedIds" value="'+items[i].num_iid+'">&nbsp;选择</span>';
				}	
				els +='</li>';
				}
				DOM.html(DOM.get('#J_ItemDataTable'), els);
				var lis = DOM.query("#J_ItemDataTable .J_TbItem");
	        	Event.on(lis, "mouseenter mouseleave click", function(ev){
	        		var el = DOM.get('.J_CheckBox',ev.currentTarget);
	        		if(el.disabled) return;
	        		if(ev.type == 'mouseenter' ){
	            		DOM.addClass(ev.currentTarget, 'mouseover');
	        		}else if(ev.type == 'mouseleave'){
	        			DOM.removeClass(ev.currentTarget, 'mouseover');
	            	}else if(ev.type == 'click'){
	        			if(el.checked == false){
	            			list.addPreItem(ev.currentTarget.id);
	        			}else{
	        				list.removePreItem(ev.currentTarget.id);
	        			}
	        			Event.remove('#J_PreviewBtn');
						if(list.preSelectItem.length>0 || list.selectItem.length>0){
							Event.on('#J_PreviewBtn','click',function(){
								list.preview();	
							});
							DOM.replaceClass(DOM.get('#J_PreviewBtn'), 'btm-gray-yulan','btm-orange-yulan');
						}else{
							DOM.replaceClass(DOM.get('#J_PreviewBtn'), 'btm-orange-yulan','btm-gray-yulan');
						}
	        			
	        		}
	        	});
	        	Event.on(DOM.query('#J_ItemDataTable .J_CheckBox'),'click',function(ev){
	        		ev.stopPropagation();
	        		var iid = ev.currentTarget.value;
	        		if(ev.currentTarget.checked == true){
	        			DOM.addClass('#J_TbItem_'+iid,'seleted');
	        		}else{
	        			DOM.removeClass('#J_TbItem_'+iid,'seleted');
	        		}
	        	});
			},

			renderSelectItems : function(pageId, initFlag) {
				items = list.selectItem;
				pageNum = list.selectBoxPageNum;
				var len = items.length;
				if (len < pageNum) {
					pageNum = len;
				}
				var start = len - (pageId -1) * pageNum - 1;
				var end = len - pageId * pageNum;
				if (end <0) end=0;
				var els = '';
				flag=0;
				var picUrlManual = '';
				var tempPicUrl = '';
				//for (var i=start; i>=end; i--) {
				for (var i=end; i<=start; i++) {
					picUrlManual = '';
					tempPicUrl = '';
					//alert('renderSelectItems:'+items[i].title);
					flag++;
					if (initFlag) {
						order = items[i].order;
						specPrice = items[i].spec_price;
					} else {
						order = ((pageId-1)*pageNum + flag);
						if(items[i].spec_price==undefined){
							specPrice = items[i].price;
						}else{
							specPrice = items[i].spec_price;
						}
					}
					if(cid=='27' || hand_img_url=='1'){
						if(list.savedPics[items[i].id]){
							tempPicUrl = list.savedPics[items[i].id];
							//alert('go:'+tempPicUrl);
						}
						picUrlManual = '<li class="clear w-280" >'+
			          						'<div class="ui-side-list">主图：</div>'+
											'<div class="ui-content-list">'+
		                 						'<input type="text" title="baobeiPic" id="J_PicUrl_'+items[i].id+'" value="'+tempPicUrl+'" name="picUrl" class="input-text-3 w-170">&nbsp;<b style="color:#F00; vertical-align:middle">*</b>'+
							 		'</div></li>'+
							 		'<li class="clear w-280" >'+
	                              	'<div class="ui-side-list">&nbsp;</div>'+
	              						'<div class="ui-content-list">'+
	                                         '<p style="color: #FB8534;">复制图片空间审核过的主图地址</p>'+
	             							 '</div></li>';
							 		
					}
	      				els +=  '<li class="list-item"><div class="list-div"><ul class="wc-detail-area">'+
								'<li style="width:5%;">'+
	                                  	'<input type="text" class="input-text-1 w-30" id="J_Order_'+items[i].id+'" name="order"  value="'+ order +'" >'+
	       						'</li>'+
	       						'<li style="width:15%;">'+
	               					'<a title="'+items[i].title+'" href="http://item.taobao.com/item.htm?id='+items[i].id+'" target="_blank">';
	      					//if(hand_img_url) 直接使用pic_url
								if(hand_img_url=='1'){
	 								els +=  '<img width="120" height="120" src="'+items[i].pic_url+'">';
	 							}else{
	 								els +=  '<img width="120" height="120" src="'+items[i].pic_url+'_120x120.jpg">';
	 							}
	                           els += 	'</a>'+
	      						'</li>'+
	      						'<li style="width:30%;">'+
	      						'<div class="item-box">'+                                                                                  
	                                  '<ul class="ui-about-list">'+
	                                  	'<li class="clear w-280" >'+
	                                      	'<div class="ui-side-list">标题：</div>'+
	                      						'<div class="ui-content-list">'+
	      											'<input type="hidden"  id="J_Title_'+items[i].id+'" value="'+items[i].title+'">'+
	                                                  '<input type="text" class="input-text-3 w-170" title="Title" id="J_PromoTitle_'+items[i].id+'" value="'+items[i].promo_title+'" >'+
	                     							 '</div></li><li class="clear w-280" ><div class="ui-side-list">原价：</div>'+
	                      						'<div class="ui-content-list">'+
	                                                  '<input type="text" title="price" name="price" id="J_Price_'+items[i].id+'" value="'+items[i].price+'" class="input-text-3 w-170">'+
	                     							 '</div></li>'+
	                                      '<li class="clear w-280" >'+
	                                      	'<div class="ui-side-list">特价：</div>'+
	                      						'<div class="ui-content-list">'+
	                                                 '<input type="text" title="specPrice" id="J_SpecPrice_'+items[i].id+'" value="'+specPrice+'" name="specPrice" class="input-text-3 w-170">'+
	                     							 '</div></li>'+
	                     							picUrlManual+
	                       							'</ul></div></li>'+ 	
	                     							  '<li style="width:50%;" id="J_ItemParams_'+items[i].id+'">'+
	                           							'<div class="item-box">'+                                                                                   
	                                                     '<ul class="ui-about-list">';
					oriPriceWriterHtml =''; //原价文案
					curPriceWriterHtml = ''; //现价文案
					tinyLabelsHtml = ''; //小标签
					itemParam1Html = ''; //宝贝参数1
					itemParam2Html = ''; //宝贝参数2
					itemParam3Html = ''; //宝贝参数3
					itemParam4Html = ''; //宝贝参数4
					itemParam5Html = ''; //宝贝参数5
					itemParam6Html = ''; //宝贝参数6
					var itemParams = items[i].item_params;
					S.each(itemParams, function(item){
						/*原价文案*/
						if(item['field_code'] == 'ori_price_writer'){
							oriPriceWriterHtml +='<li  class="J_ItemParams w-330 clear"> <div class="ui-side-list w-90">原价文案：</div>'+
								'<div class="ui-content-list"><div class="fl"><input type="text" id ="J_oriPriceWriter'+items[i].id+'" name="ori_price_writer" value="'+item['value']+'" title="ori_price_writer" class="J_Param_Value input-text-3 w-100">'+
								'<input type="hidden" class="J_Param_ParamId" value="'+item.param_id+'"/><input type="hidden" class="J_Param_FieldCode" value="'+item.field_code+'"/></div></td>'+
								' <div style="padding-left:5px;" class="fl">'+               
								    '<select id="J_OPrice_'+items[i].id+'" name="oripricewriter" onchange="KISSY.DOM.val(\'#J_oriPriceWriter'+items[i].id+'\',this.value)">';
								if(paramOptons['ori_price_writer']){
									S.each(paramOptons['ori_price_writer'],function(item){
										oriPriceWriterHtml+=  '<option value="'+item+'">'+item+'</option>';
									})
								}
							oriPriceWriterHtml+='</select></div></div></li>';
						}
						/*现价文案*/
						if(item['field_code'] == 'cur_price_writer'){
							curPriceWriterHtml +='<li  class="J_ItemParams w-330 clear"><div class="ui-side-list w-90">现价文案：</div>'+
								'<div class="ui-content-list"><div class=" fl"><input type="text" id ="J_curPriceWriter'+items[i].id+'" name="cur_price_writer" value="'+item['value']+'" title="cur_price_writer" class="J_Param_Value input-text-3 w-100">'+
								'<input type="hidden" class="J_Param_ParamId" value="'+item.param_id+'"/><input type="hidden" class="J_Param_FieldCode" value="'+item.field_code+'"/></div></td>'+
								' <div class="fl" style="padding-left:5px;">'+               
								    '<select id="J_CPrice_'+items[i].id+'" name="curpricewriter" onchange="KISSY.DOM.val(\'#J_curPriceWriter'+items[i].id+'\',this.value)">';
								if(paramOptons['cur_price_writer']){
									S.each(paramOptons['cur_price_writer'],function(item){
										curPriceWriterHtml+=  '<option value="'+item+'">'+item+'</option>';
									})
								}
							curPriceWriterHtml+='</select></div></div></li>';
						}
						/*小标签*/
						if(item['field_code'] == 'tiny_labels'){
							var defaultTiny = item['value'].split("#");
							tinyLabelsHtml +='<li  class="J_ItemParams "><div class="ui-side-list w-90">小标签：</div>'+
								'<div class="ui-content-list"><input type="hidden" class="J_Param_Value" id ="J_TinyLabels'+items[i].id+'"value="'+item['value']+'"/><input type="hidden" class="J_Param_ParamId" value="'+item.param_id+'"/><input type="hidden" class="J_Param_FieldCode" value="'+item.field_code+'"/>';
								if(paramOptons['tiny_labels']){
									S.each(paramOptons['tiny_labels'],function(ite){
										tinyLabelsHtml+= '<a href="#2"';
											S.each(defaultTiny,function(d){
												if( d !='' && d == ite){
													tinyLabelsHtml+= 'class="t-current"';
												}
											})
										tinyLabelsHtml+='><img src="'+ite+'" class="J_TinyLabels" onClick="var elem = this;list.selectTiny(elem)" data="'+items[i].id+'"/></a>&nbsp;&nbsp;';
									})
								}
							tinyLabelsHtml+='</div></li>';
						}
						/*宝贝参数1*/
						if(item['field_code'] == 'item_param1'){
							itemParam1Html +='<li  class="J_ItemParams"><div class="ui-side-list w-90">'+list.defaultItemFieldNames[item.field_code]+'：</div>'+
											 '<div class="ui-content-list"><input type="text"  name="item_param1" value="'+item['value']+'" title="item_param1" class="J_Param_Value input-text-3 w-170">'+
											 '<input type="hidden" class="J_Param_ParamId" value="'+item.param_id+'"/><input type="hidden" class="J_Param_FieldCode" value="'+item.field_code+'"/></div></li>';
						}
						/*宝贝参数2*/
						if(item['field_code'] == 'item_param2'){
							itemParam2Html +='<li  class="J_ItemParams"><div class="ui-side-list w-90">'+list.defaultItemFieldNames[item.field_code]+'：</div>'+
											 '<div class="ui-content-list"><input type="text"  name="item_param2" value="'+item['value']+'" title="item_param2" class="J_Param_Value input-text-3 w-170">'+
											 '<input type="hidden" class="J_Param_ParamId" value="'+item.param_id+'"/><input type="hidden" class="J_Param_FieldCode" value="'+item.field_code+'"/></div></li>';
						}
						/* 宝贝参数3*/
						if(item['field_code'] == 'item_param3'){
							itemParam3Html +='<li  class="J_ItemParams"><div class="ui-side-list w-90">'+list.defaultItemFieldNames[item.field_code]+'：</div>'+
											 '<div class="ui-content-list"><input type="text"  name="item_param3" value="'+item['value']+'" title="item_param3" class="J_Param_Value input-text-3 w-170">'+
											 '<input type="hidden" class="J_Param_ParamId" value="'+item.param_id+'"/><input type="hidden" class="J_Param_FieldCode" value="'+item.field_code+'"/></div></li>';
						}
						/*宝贝参数4*/
						if(item['field_code'] == 'item_param4'){
							itemParam4Html +='<li  class="J_ItemParams"><div class="ui-side-list w-90">'+list.defaultItemFieldNames[item.field_code]+'：</div>'+
											 '<div class="ui-content-list"><input type="text"  name="item_param4" value="'+item['value']+'" title="item_param4" class="J_Param_Value input-text-3 w-170">'+
											 '<input type="hidden" class="J_Param_ParamId" value="'+item.param_id+'"/><input type="hidden" class="J_Param_FieldCode" value="'+item.field_code+'"/></div></li>';
						}
						/*宝贝参数5*/
						if(item['field_code'] == 'item_param5'){
							itemParam5Html +='<li  class="J_ItemParams"><div class="ui-side-list w-90">'+list.defaultItemFieldNames[item.field_code]+'：</div>'+
											 '<div class="ui-content-list"><input type="text"  name="item_param5" value="'+item['value']+'" title="item_param5" class="J_Param_Value input-text-3 w-170">'+
											 '<input type="hidden" class="J_Param_ParamId" value="'+item.param_id+'"/><input type="hidden" class="J_Param_FieldCode" value="'+item.field_code+'"/></div></li>';
						}
						/* 宝贝参数6*/
						if(item['field_code'] == 'item_param6'){
							itemParam6Html +='<li  class="J_ItemParams"><div class="ui-side-list w-90">'+list.defaultItemFieldNames[item.field_code]+'：</div>'+
											 '<div class="ui-content-list"><input type="text"  name="item_param6" value="'+item['value']+'" title="item_param6" class="J_Param_Value input-text-3 w-170">'+
											 '<input type="hidden" class="J_Param_ParamId" value="'+item.param_id+'"/><input type="hidden" class="J_Param_FieldCode" value="'+item.field_code+'"/></div></li>';
						}
					})
					els += oriPriceWriterHtml+curPriceWriterHtml+tinyLabelsHtml+itemParam1Html+itemParam2Html+itemParam3Html+itemParam4Html+itemParam5Html+itemParam6Html;
					els += '</ul></div></li></ul>';
					els += '<div class="wc-operate-area" style="padding-top:13px;">';
					/* 宝贝评价*/
					if (hasRate) {
						if (items[i].rate_ids==undefined) {
							items[i].rate_ids='';
						}
						els += '<div>'+
								'<input type="hidden" id="J_RateMess_'+items[i].id+'" value="'+items[i].rate_ids+'"/>'+
								'<a href="#2" onclick="H.rateControl.showItemRates('+items[i].id+')">设置宝贝评价</a></div>';
					}
				
					els += '<div  class="item-status"><div class="status-pendding"><a href="javascript:list.removeItem('+items[i].id+');"   title="从推荐列表删除中">取消选择</a></div></div>';
					els += '</li></ul></div></li>';
				}
				
				DOM.html(DOM.get('#J_SelectItemBox'), els );
				if(len>0){
					DOM.hide('#J_RightEmpty');
					DOM.css(DOM.query('.J_selectItemHoder'),'display','');
				}else{
					DOM.show('#J_RightEmpty');
					DOM.css(DOM.query('.J_selectItemHoder'),'display','none');
				}	
				
				//判断是否有小标签，没有则隐藏容器
				if(DOM.html('#J_AllItemParams') == '') {
					DOM.hide('#J_SelectItemParamBox');
				}
				if(itemParams==undefined || itemParams.length==0){
					DOM.hide('#J_SelectItemParamBox');
				}
//				// input 边框变化  
//				var inputs = DOM.filter (DOM.query('input'),function(i){if(i.type =='text')return true;})
//				Event.on(inputs,'focus blur',function(ev){
//					if(ev.type == 'focus'){
//						DOM.removeClass(ev.target,'input-text-3 text text-error');
//						DOM.addClass(ev.target,'input-text-on');
//					} else if(ev.type == 'blur'){
//						DOM.removeClass(ev.target,'input-text-on');
//						DOM.addClass(ev.target,'input-text-3');
//					}
//				})
				
			},
			//小标签选择
			selectTiny :function(el){
				var id = DOM.attr(el,'data');
				var src = DOM.attr(el,'src');
				var paramVlaue = DOM.val('#J_TinyLabels'+id);
				if(DOM.hasClass(DOM.parent(el),'t-current')){
					paramVlaue = paramVlaue.replace('#'+src,'');
					paramVlaue = paramVlaue.replace(src+'#','');
					paramVlaue = paramVlaue.replace(src,'');
					DOM.removeClass(DOM.parent(el),'t-current');
					DOM.addClass(DOM.parent(el),'e-current');
				}else{
					if(paramVlaue==''){
						paramVlaue+=src;
					}else{
						paramVlaue+='#'+src;
					}
					DOM.addClass(DOM.parent(el),'t-current');
					DOM.removeClass(DOM.parent(el),'e-current');
				}
				DOM.val('#J_TinyLabels'+id,paramVlaue);

			},
			
			reInitSelectBox : function() {
				var len = list.selectItem.length;
				var pageNum = list.selectBoxPageNum;
				if (len > pageNum) {
					pageCount = Math.ceil(len/pageNum); 
					var handleSelectPagination = function(page) {
						 pageId = page;
						 var len = list.selectItem.length;
						 var pageCount = Math.ceil(len/list.selectBoxPageNum); 
			        	 list.renderSelectItems(pageId);
						 list.selectPaginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_BottomSelectPaging',2);		
					}
					list.selectPaginator = new showPages('list.selectPaginator').setRender(handleSelectPagination).setPageCount(pageCount).printHtml('#J_BottomSelectPaging',2);
				}
				list.renderSelectItems(1);
			},

			addItems : function() {
				var items = list.preSelectItem;
				var len = items.length;
				if(len==0 && !list.editFlag){
	   			    new H.widget.msgBox({
					    title:"错误提示",
					    content:'未选择宝贝'	,
					    autoClose:true,
					    timeOut:1000
					});
				}
				for(i=0; i<len; i++){
					var item = items[i];
					//alert('addItems:'+item.title)
					DOM.show('#J_status_'+item.id);
	    			DOM.hide(DOM.prev('#J_status_'+item.id));
	    			DOM.attr(DOM.get('#J_CheckBox_'+item.id),{'disabled':"disabled",'checked':"checked"});
	    			item.item_params = list.defaultItemParams;
					item.rate_ids = '';
					list.selectItem.push(item);
				}
				list.preSelectItem = [];
			},

			addPreItem : function(liId) { 
				if (list.preSelectItem.length + list.selectItem.length >= limit) {
					new H.widget.msgBox({
					    title:"错误提示",
					    content:'列表数量超过模板限制（'+limit+'个）',
					    type:"error"
					});
					return ;
				}
				DOM.addClass('#'+liId,'selected');
				DOM.get('.J_CheckBox','#'+liId).checked= true;
				var id = liId.substr(9);
				DOM.show('#J_status_'+id);
				DOM.hide(DOM.prev('#J_status_'+id));
				DOM.attr(DOM.get('#J_CheckBox_'+id),{'checked':"checked"});
				
				var items = list.tbItem;
				
				var itemsLen = items.length;
				for(var i=0; i<itemsLen; i++) {
					
					if (items[i].num_iid == id) {
						//alert('addPreItem:'+items[i].title);
						var item = {
							'id': id,
							'title': items[i].title,
							'promo_title': items[i].title,
							'price': items[i].price,
							'spec_price': items[i].price,
							'volume': 0,
							'pic_url': items[i].pic_url,
							'order' : 99
						};
						if(items[i].spec_price){
							item.spec_price = items[i].spec_price;
						}
						//@todo
						item.item_params = list.defaultItemParams;
						item.rate_ids = '';
						//alert(KISSY.JSON.stringify(item.item_params));
						list.preSelectItem.push(item);

						//2012-11-09
						if(hand_img_url=='1' && cid!='27'){
							var guige = DOM.val('#J_items_per_line').split('_');
							var item_w = guige['2']
							var url_suf = '_'+item_w+'x'+item_w+'.jpg';
							list.savedPics[id] = items[i].pic_url+url_suf;
							//alert(list.savedPics[id]);
						}
						
						break;
					}
				}
				DOM.replaceClass(DOM.get('#J_PreviewBtn'), 'btm-gray-yulan','btm-orange-yulan');
//				list.msg.hide();
			},
			
			hasSelected : function(id) {
				var items = list.selectItem;
				var itemsLen = items.length;
				for(var i=0; i<itemsLen; i++) {
					if (items[i].id == id) {
						return true;
						break;
					}
				}
				return false;
			},

			hasPreSelected : function(id) {
				var items = list.preSelectItem;
				var itemsLen = items.length;
				for(var i=0; i<itemsLen; i++) {
					if (items[i].id == id) {
						return true;
						break;
					}
				}
				return false;
			},

			removePreItem : function(liId) {
				DOM.removeClass('#'+liId,'selected');
				DOM.get('.J_CheckBox','#'+liId).checked= false;
				DOM.attr('#J_TCheckAll','checked',false);
				var id = liId.substr(9);
				var items = list.preSelectItem;
				var itemsLen = items.length;
				for(var i=0; i<itemsLen; i++) {
					if (items[i].id == id) {
						list.preSelectItem.splice(i,1);
						break;
					}
				}
			},
			
			removeItem : function(id,flag) {
				DOM.removeClass('#J_TbItem_'+id,'selected');
				if(DOM.get('.J_CheckBox','#J_TbItem_'+id)){
					DOM.get('.J_CheckBox','#J_TbItem_'+id).checked= false;
				}
				DOM.attr('#J_TCheckAll','checked',false);
				
				var items = list.selectItem;
				var itemsLen = items.length;
				for(var i=0; i<itemsLen; i++) {
					if (items[i].id == id) {
						//alert('del');
						list.selectItem.splice(i,1);
						break;
					}
				}
				list.renderSelectItems(1);
				list.preview();
				if(list.selectItem.length<=0){
					DOM.hide('#J_Preview_Box');
				}
			},

			//for post
			strProcess : function(str) {
				//return str.replace(/\\/g, '\\\\').replace(/\"/g, '\\"').replace(/&/g, '%26');
				//return str.replace(/\"/g, '\\"').replace(/&/g, '%26');
				return str.replace(/\\/g, '\\\\').replace(/\"/g, '\\"').replace(/[\t\n&]/g, '%26').replace(/%/g, '%25');
			},
			
			preview : function() {
				if(iconTabs.activeIndex==2){
					var items = list.selectItem;
				} else {
					var items = list.selectItem.concat(list.preSelectItem);
				}
				var len = items.length;
				if(len<=0){
					DOM.hide('#J_ContentDetail');
					//DOM.hide('#J_ToggleC');
					DOM.replaceClass(DOM.get('#J_PreviewBtn'), 'btm-gray-yulan','btm-orange-yulan');
					return false;
				}else{
					DOM.show('#J_ContentDetail');
				}
				if(iconTabs.activeIndex==1 && irregular=='1' && len!=limit){
					new H.widget.msgBox({
					    title:"错误提示",
					    content:'此模板仅支持('+limit+')个宝贝，您当前已选中('+len+')个宝贝!',
					    type:"error"
					});
					return;
				}
				var postItems = list.generatePostItems(items);
				var itemsJson = KISSY.JSON.stringify(postItems);
				//alert(itemsJson);
				var postListParams = new Array();
				S.each(DOM.query('.J_ListParams'),function(item, i){
					var listPar = {};
					listPar.param_id = DOM.val(DOM.get('.J_Param_ParamId', item));
					listPar.field_code = DOM.val(DOM.get('.J_Param_FieldCode', item));
					listPar.value = list.strProcess(DOM.val(DOM.get('.J_Param_Value', item)));
					if(listPar.value.indexOf('undefined')>=0){
						listPar.value = DOM.val('#J_items_per_line_default');
					}
					postListParams.push(listPar);
				})
				var listParamsJson = KISSY.JSON.stringify(postListParams);
				var submitHandle = function(o) {
					DOM.html(DOM.get('#J_ContentDetail'),o.payload);
					//DOM.show('#J_ToggleC');
					var listBox = S.one('#J_Preview_Box');
					if (listBox.css("display")==="none") {
						listBox.slideDown();
					}
					S.each(DOM.query('.J_DesignDiv'),function(ddiv){
						var dev_id = ddiv.id;
						var rawDid = dev_id.substr(12);
						designControl.getDesignContent(rawDid);
					})
	    	    };
	    	    var errorHandle = function(o) {
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
	        	};
				//第一次预览designPics为空，之后从预览的内容中获取(class=J_DesignDiv)
				var designPics = [],data ='';
				if(!KISSY.isEmptyObject(list.designPics)){
					S.each(list.designPics , function(item,i){
	            		designPics.push(i+','+item['designId']);
	            	});
					//如果删除了海报 ，不传值
					if(KISSY.inArray(designPics[0].split(',')[1],g_ds_del_list)){
						data += "designPics=[]";
					}else{
						var designPics = KISSY.JSON.stringify(designPics);
						data += "designPics="+designPics;
					}
				}else{
					data += "designPics=[]";
				}
	        	
				itemsJson = itemsJson.replace(/%25/g, '%!').replace(/&/g, '%26');
		        listParamsJson = listParamsJson.replace(/%25/g, '%!');
	     	    data += "&items="+itemsJson+"&listParams="+listParamsJson+"&proto_id="+protoId+"&form_key="+FORM_KEY;
	    	    new H.widget.asyncRequest().setURI(previewUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},
			
			tempSave : function() {
				var items = list.selectItem;
				var len = items.length;
				if (len==0) {
					return;
				}
				for (var i=0; i<len; i++) {
					id = items[i].id;
					items[i].title = DOM.val(DOM.get('#J_Title_'+id));
					items[i].promo_title = DOM.val(DOM.get('#J_PromoTitle_'+id)) ;
					items[i].price = DOM.val(DOM.get('#J_Price_'+id));
					items[i].spec_price = DOM.val(DOM.get('#J_SpecPrice_'+id));
					//items[i].pic_url = DOM.val(DOM.get('#J_PicUrl_'+id));
					items[i].volume = DOM.val(DOM.get('#J_Volume_'+id));
					items[i].order = DOM.val(DOM.get('#J_Order_'+id));
					//显示处理的时候&amp;或变成& 所以保存的时候需要还原
					//items[i].promo_title = items[i].promo_title.replace('&','&amp;').replace('"','&quot;');
					//items[i].title = items[i].title.replace('&','&amp;').replace('"','&quot;');
					//alert('tempSave:'+items[i].title)
					if(hasRate) {
						items[i].rate_ids = DOM.val(DOM.get('#J_RateMess_'+id));
					}
					
					var itemParams = [];
					S.each(DOM.query('#J_ItemParams_'+id+' .J_ItemParams'),function(item, i){
						var itemPar = {};
						itemPar.param_id = DOM.val(DOM.get('.J_Param_ParamId', item));
						itemPar.field_code = DOM.val(DOM.get('.J_Param_FieldCode', item));
						itemPar.value = DOM.val(DOM.get('.J_Param_Value', item));
						itemPar.field_name = list.defaultItemFieldNames[itemPar.field_code];
						itemParams.push(itemPar);
					})
					items[i].item_params = itemParams;
					
				}
				list.selectItem = items;
			},
			
			
			toggle : function(el) {
				var listBox = S.one('#J_ListBox');
				if (listBox.css("display")==="none") {
					listBox.slideDown(0.8,function(){
						DOM.html('#J_ListBoxToggle','隐藏模版预览')
					});
				} else {
					listBox.slideUp(0.8,function(){
						DOM.html('#J_ListBoxToggle','显示模版预览')
					});
					
				}
			},

			generatePostItems : function(items, isSave){
				var postItems = new Array();
				var itemsLen = items.length;
				for(var i=0; i<itemsLen; i++) {
					//alert(items[i].promo_title);
					var item = {
						'id': items[i].id,
						'title': list.strProcess(items[i].title),
						'promo_title': list.strProcess(items[i].promo_title),
						'price': items[i].price,
						'spec_price': items[i].spec_price,
						'volume': items[i].volume,
						'pic_url': items[i].pic_url,
						'order' : items[i].order,
						'rate_ids' : items[i].rate_ids
					};
					if(cid=='27' || hand_img_url=='1'){
						if(cid=='27'){
							item.pic_url = '';
						}
						if(iconTabs.activeIndex==2){
							item.pic_url = DOM.val(DOM.get('#J_PicUrl_'+items[i].id));
							list.savedPics[items[i].id] = item.pic_url
						}
						//alert(item.pic_url);
						//2012-11-09
						if(cid=='27' && !isSave && item.pic_url==''){
							item.pic_url = items[i].pic_url

							if(hand_img_url=='1'){
								var guige = DOM.val('#J_items_per_line').split('_');
								var item_w = guige['2']
								var url_suf = '_'+item_w+'x'+item_w+'.jpg';
								if(url_suf=='_220x220.jpg'){
									url_suf = '_b.jpg';
								}
								item.pic_url = item.pic_url + url_suf;
							}
							
						}
						//2012-11-09
						if( (cid!='27' && hand_img_url=='1') || (cid=='27' && list.savedPics[items[i].id]) ){
							item.pic_url = list.savedPics[items[i].id];
							item.pic_url = (item.pic_url+'').replace(/_220x220\.jpg$/,'_b.jpg');
						}
						//alert(item.pic_url);
					}
					var saveParams = new Array();
					var item_params = items[i].item_params;
					for(var j=0; j<item_params.length; j++) {
						var param = {
							'param_id': item_params[j].param_id,
							'field_code': item_params[j].field_code,
							'value': list.strProcess(item_params[j].value),
							'field_name': item_params[j].field_name
						};
						saveParams.push(param);
					}
					item.item_params = saveParams;
					postItems.push(item);	
				}
				return postItems;
			},
			
			save : function() {
				var items = list.selectItem;
				var len = items.length;
				if (len==0) {
					new H.widget.msgBox({
					    title:"错误提示",
					    content:'您还没有选择推荐宝贝哦',
					    type:"error"
					});
					return;
				}
				if(irregular=='1' && len!=limit){
					new H.widget.msgBox({
					    title:"错误提示",
					    content:'此模板仅支持('+limit+')个宝贝，您当前已选中('+len+')个宝贝!',
					    type:"error"
					});
					return;
				}
				
				if(cid=='27' || hand_img_url=='1'){
					for(var i=0;i<len;i++){
						if( DOM.val(DOM.get('#J_PicUrl_'+items[i].id))=='' ){
							new H.widget.msgBox({
							    title:"错误提示",
							    content:'请填写第'+DOM.val(DOM.get('#J_Order_'+items[i].id))+'个宝贝的主图地址',
							    type:"error"
							});
							return;
						}
					}
				}
				list.msg =  new H.widget.msgBox({
									dialogType : 'loading',
								    content:'提交中，请稍候！'	
								});
				var postItems = list.generatePostItems(items, 1);
				
				var itemsJson = KISSY.JSON.stringify(postItems);
				var postListParams = new Array();
				S.each(S.all('.J_ListParams'),function(item, i){
					var listPar = {};
					listPar.param_id = DOM.val(DOM.get('.J_Param_ParamId', item));
					listPar.field_code = DOM.val(DOM.get('.J_Param_FieldCode', item));
					listPar.value = list.strProcess(DOM.val(DOM.get('.J_Param_Value', item)));
					if(listPar.value.indexOf('undefined')>=0){
						listPar.value = DOM.val('#J_items_per_line_default');
					}
					postListParams.push(listPar);
				})
				var listParamsJson = KISSY.JSON.stringify(postListParams);		
				var submitHandle = function(o) {
						DOM.html(DOM.get('#J_ContentDetail'),o.payload.body);
						list.msg.hide();
						listId = o.payload.list_id;
						var url = createUrl+"&listId="+listId;
							if (isVersionPer('material',false)) {
								new H.widget.msgBox({
									    title: "保存成功",
									    content: '保存成功，你可以去查看列表或者升级到尊享版去投放',
									    type: "confirm",
									    buttons: [{ value: "升级" }, { value: "查看列表" }],
									    success: function (result) {
									        if (result == "升级") {
												 isVersionPer('material'); 	
									        }else{
												window.location.href = listUrl;
											}
									    }
									});
							}else {
								if (list.editFlag == true) {
									var str = '重新投放';
								}else {
									var str = '去投放 ';
								}
								new H.widget.msgBox({
									    title: "保存成功",
									    content: '保存成功，你可以去查看列表,投放列表',
									    type: "confirm",
									    buttons: [{ value: str }, { value: "查看列表" }, { value: "返回编辑" }],
									    success: function(result){
											if (result == str) {
												window.location.href = url
											}
											else 
												if (result == "查看列表") {
													window.location.href = listUrl;
												}
										}
									});
							}	  
	    	    };
	    	    var errorHandle = function(o) {
					list.msg.hide();
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
					
	        	};
	        	var data = '';
	        	if(mtype==7){
	           	  	data = "&meal_id="+meal_id+"&";
	            }else {
	            	data = "&meal_id=0&";
	            }
	        	//第一次预览designPics为空，之后从预览的内容中获取(class=J_DesignDiv)
				var designPics = [];
				if(!KISSY.isEmptyObject(list.designPics)){
					S.each(list.designPics , function(item,i){
	            		designPics.push(i+','+item['designId']);
	            	});
					//如果删除了海报 ，不传值
					if(KISSY.inArray(designPics[0].split(',')[1],g_ds_del_list)){
						data += "designPics=[]";
					}else{
						var designPics = KISSY.JSON.stringify(designPics);
						data += "designPics="+designPics;
					}
				}else{
					data += "designPics=[]";
				}
				itemsJson = itemsJson.replace(/%25/g, '%!').replace(/&/g, '%26');
		        listParamsJson = listParamsJson.replace(/%25/g, '%!');
				
	     	    data += "&items="+itemsJson+"&listParams="+listParamsJson+"&list_id="+listId+"&proto_id="+protoId+"&form_key="+FORM_KEY;
	    	    new H.widget.asyncRequest().setURI(saveUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},
    	 
    		designFinish : function(fromDid, designId, xmlPath) {
        		designControl.designFinish(fromDid, designId, xmlPath)
    		}
			

		}
}, {
    requires: ['utils/showPages/index','./mods/tshop','./mods/listParam','./mods/designControl','switchable','bui/select','bui/overlay','utils/beautifyForm/index']
});