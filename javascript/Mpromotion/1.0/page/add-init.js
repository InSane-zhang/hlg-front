
/**
 * @fileOverview 
 * @author nihao sdfsd
 */
KISSY.add(function (S,checkUtil,itemHandle,beautifyForm,Select,Tooltip,Calendar,Overlay,XTemplate,showPages,Switchable) {
    var DOM = S.DOM, Event = S.Event;
	return promotionControl ={
			isEidt : promotionForm.id.value != '0' ? true: false,
			isChange : false,  
			NameError : false,
			DescError : false,
			tooltip : null,
			x : new beautifyForm,
			editMjsRemove : [],  //编辑排除的宝贝
			mjsData : eval('('+ mjsJson +')'),  //满就送层级
			mjsRemove : eval('('+ itemsJson +')'),  //排除的宝贝
			mjspartData : eval('('+ mjspartJson +')'),  //第N件优惠层级
			mjspartAttend : eval('('+ mjspartAttendJson +')'),  //第N件优惠参与宝贝
			mjspartNothing : eval('('+ mjspartNothingJson +')'),  //第N件优惠无关宝贝
			jtjData : eval('('+ jtjJson +')'),  //阶梯价层级
			init : function(){

				if(parentType == 'mjs' || parentType == 'mjscp'){
					if(!promotionControl.tooltip){
						promotionControl.tooltip = new Tooltip.Tip({
							 trigger : '.J_promptHelp',
							 alignType : 'top',
							 offset : 10,
							 elCls : 'ui-tip'
						 }).render()
					}
	        	}

				//优惠对象下拉框      
				if(parentType == 'tbspec' || parentType == 'freepost' || parentType == 'onetbspec' || parentType == 'buyerlimit' || parentType == 'mjscp'){
					var chooseItems = [{"text":"普通会员","value":"10"},{"text":"高级会员","value":"20"},{"text":"VIP会员","value":"30"},{"text":"至尊VIP","value":"40"}];
					var privileges = S.JSON.parse(privilegeObj)
					chooseItems = chooseItems.concat(privileges);
					var privilegeDown =  new Select.Select({  
	                  render:'#J_chooseObj',
	                  valueField:'#J_chooseObjHide',
	                  items:chooseItems,
	                  visibleMode : 'display'
	                })
					privilegeDown.render();
					var preferential = DOM.val('#J_Preferential');	
					privilegeDown.setSelectedValue(preferential);
					privilegeDown.on('change', function(ev){
						promotionControl.isChange = true;
					}); 
				}
				
				//页面加载时判断是否开通彩票协议
				if(parentType == 'mjscp'){
					promotionControl.loadingCheck();
				}
				
				//满就送,包邮,送彩票,阶梯价,第N件优惠层级初始化
				if(parentType == 'mjs' || parentType == 'mjscp' || parentType == 'freepost'){
					if(promotionControl.mjsData.length > 0){
						promotionControl.renderMjs()
					}
					if(promotionControl.mjsRemove.length > 0){
						promotionControl.renderRemoveItem() //渲染排除的宝贝
					}
				}else if(parentType == 'mjspartjtj'){
					if(promotionControl.mjspartData.length > 0){
						promotionControl.renderMjspart()
					}
					if(promotionControl.mjspartAttend.length > 0){
						promotionControl.renderMjspartAttend() //渲染参与宝贝
					}
					if(promotionControl.mjspartNothing.length > 0){
						promotionControl.renderMjspartNothing() //渲染无关宝贝
					}
				}else if(parentType == 'jtj'){
					if(promotionControl.jtjData.length > 0){
						promotionControl.renderJtj();  //阶梯价层级
					}
				};
				
				//增加层级
				if(parentType == 'mjs' || parentType == 'mjscp' || parentType == 'freepost'){
					Event.on('#J_addMjs','click',promotionControl.addMjs);		//满就送新增层级
				}else if(parentType == 'mjspartjtj'){
					Event.on('#J_addMjs','click',promotionControl.addMjspart); 	//第N件优惠新增层级 
				}else if(parentType == 'jtj'){
					Event.on('#J_addMjs','click',promotionControl.addJtj); 	//阶梯价层级 
				}
				
				//阶梯价选择时间
				if(parentType == 'jtj'){
					new Calendar.DatePicker({
	   	              trigger:'.J_tiems',
	   	              showTime:true,
	   	              autoRender : true,
	   	              autoSetValue :true,
	   	              delegateTigger :true
					})
				}

				//销毁弹窗						
				Event.delegate(document,'click','.bui-ext-close',function(){
					DOM.remove('.bui-dialog');
					if(parentType == 'mjs' || parentType == 'freepost'){
						if(DOM.val('#J_mjsSalesType') == 0){
	             	   		promotionControl.x.setRadioPro('#J_mjsJian');
	             	   	}else{
	             	   		promotionControl.x.setRadioPro('#J_mjsYuan');
	             	   	}
					}
				});
				
				//弹窗搜索宝贝
				Event.delegate(document,'click','#J_searchBtn',function(){
					 promotionControl.searchPromoItems();
				});

   	          	//点击排除，第N件优惠添加宝贝
   	          	Event.delegate(document,'click','.J_removeBtn',function(ev){
   	          		var pid =  DOM.attr(ev.currentTarget,'pid');
   	          		var chooseType = DOM.val('#J_SelectItemType');
   	          		var num = DOM.val('#J_setGiftNum');
   	          		if(parentType == 'mjspartjtj'){ //第N件优惠添加宝贝
	   	          		var itemType = DOM.val('#J_joinItemType');
	   					if(itemType == 'join'){
	   						promotionControl.addMjspartAttend(pid);
	         				promotionControl.renderMjspartAttend();
	   					}else{
	   						promotionControl.addMjspartNothing(pid);
	         				promotionControl.renderMjspartNothing();
	   					}
   	          		}else{ //满就送添加排除宝贝
   	          			if(chooseType == 'radio'){
   	          				promotionControl.addGiftItem(pid,num);
   	          			}else{
   	          				promotionControl.addRemoveItem(pid);
   	          				promotionControl.renderRemoveItem();
   	          			}
   	          		}
				});
				
				//点击取消排除,取消添加
				Event.delegate(document,'click','.J_cancelBtn',function(ev){
   	          		var pid =  DOM.attr(ev.currentTarget,'pid');
   	          		if(parentType == 'mjspartjtj'){ //第N件优惠添加宝贝
	   	          		var itemType = DOM.val('#J_joinItemType');
	   					if(itemType == 'join'){
	   						promotionControl.cancelMjspartAttend(pid);
	   	          			promotionControl.renderMjspartAttend();
	   					}else{
	   						promotionControl.cancelMjspartNothing(pid);
	         				promotionControl.renderMjspartNothing();
	   					}
	          		}else{ //满就送取消排除宝贝
	          			promotionControl.cancelRemoveItem(pid);
	   	          		promotionControl.renderRemoveItem();
	          		}
				});

	   	        //编辑弹窗宝贝点击取消排除
	   	        Event.delegate(document,'click','.J_editCancelBtn',function(ev){
	          		var pid =  DOM.attr(ev.currentTarget,'pid');
	          		promotionControl.editRemoveItem(pid);
				});
		        //编辑弹窗宝贝点击撤销
				 Event.delegate(document,'click','.J_editUndoBtn',function(ev){
		          	var pid =  DOM.attr(ev.currentTarget,'pid');
		          	promotionControl.editCancelItem(pid);
				});
				 
				//宝贝列表hover 
				Event.delegate(document,'mouseenter mouseleave','.J_listItem',function(ev){
					 if(ev.type == 'mouseenter'){
						 DOM.addClass(ev.currentTarget,'current')
					 }else if(ev.type == 'mouseleave'){
						 DOM.removeClass(ev.currentTarget,'current')
					 }
				});
				 
				//第N件优惠选择参与宝贝，无关宝贝  类型判断
				Event.on('.J_joinItem','click',function(ev){
					var itemType = DOM.attr(ev.currentTarget,'data');
					DOM.val('#J_joinItemType',itemType);
				})
				Event.on('.J_nothingItem','click',function(ev){
					var itemType = DOM.attr(ev.currentTarget,'data');
					DOM.val('#J_joinItemType',itemType);
				})
				 
				//改一口价调整方式				
				Event.on('#J_trimPrice','click',function(ev){
					if(ev.currentTarget.checked == true){
						DOM.val('#J_tiaozheng',1);
						DOM.hide('#J_batchBox');
					}
				})
				Event.on('#J_batchPrice','click',function(ev){
					if(ev.currentTarget.checked == true){
						DOM.val('#J_tiaozheng',0);
						promotionControl.x.setRadioOn('#J_onePrice1');
						DOM.show('#J_batchBox');
					}
				})
				
				//活动展示
				Event.on('#J_IsPromodesc','click',function(ev){
					if(ev.currentTarget.checked == true){
						promotionControl.checkTbItemNum(ev.currentTarget);
						DOM.val(ev.currentTarget,1);
						DOM.show('#J_PromodescBox');
						DOM.show('#J_editShopDesc');
					}else{
						DOM.val(ev.currentTarget,0)
						DOM.hide('#J_PromodescBox');
						DOM.hide('#J_editShopDesc');
					}
				})
				Event.on('#J_promoExplain','click',function(ev){
					if(ev.currentTarget.checked == true){
						DOM.show('#J_promoRemark');
						DOM.show('#J_promoDescText');
					}else{
						DOM.hide('#J_promoRemark');
						DOM.hide('#J_promoDescText');
					}
				})
				
				//团购设置是否循环倒计时
				Event.on('#J_caps','click',function(ev){
					if(ev.currentTarget.checked == true){
						DOM.val('#J_timeInterval',12)
					}else{
						DOM.val('#J_timeInterval',0)
					}
				})
				
				//活动范围选择		
				Event.on('#J_B','click',function(ev){
					if(ev.currentTarget.checked == true){
						DOM.hide('#J_setDiscount');
						DOM.hide('#J_overcomeItem');
						DOM.show('#J_PromoDescTempletBox');
						DOM.val('#J_RangeTypeValue','PART');
						if(parentType == 'tbspec'){
							DOM.val('#J_TypeId',2)
						}else if(parentType == 'mjs'){
							DOM.val('#J_TypeId',108);
						}else if(parentType == 'mjscp'){
							DOM.val('#J_TypeId',208);
						}else if(parentType == 'freepost'){
							DOM.val('#J_TypeId',106);
						}
						if(parentType == 'mjs' || parentType == 'mjscp' || parentType == 'freepost'){ 
//							changePromoDescTem(DOM.val('#J_TypeId'),'PART');
							DOM.val('#J_IsGetPart',1);
							DOM.val('#J_ProtoId',57);
						}
					}
				})
				
				Event.on('#J_Quandian','click',function(ev){
					if(ev.currentTarget.checked == true){
						DOM.show('#J_setDiscount');
						DOM.show('#J_overcomeItem');
						if(parentType == 'tbspec'){
							DOM.val('#J_TypeId',12)
						}else if(parentType == 'mjs'){
							if(promotionControl.mjsRemove.length > 0){
								DOM.val('#J_TypeId',117);
								DOM.hide('#J_PromoDescTempletBox');
								DOM.val('#J_RangeTypeValue','PART_NOT');
							}else{
								DOM.val('#J_TypeId',107);
								DOM.show('#J_PromoDescTempletBox');
								DOM.val('#J_RangeTypeValue','ALL');
							}
						}else if(parentType == 'mjscp'){
							if(promotionControl.mjsRemove.length > 0){
								DOM.val('#J_TypeId',217);
								DOM.hide('#J_PromoDescTempletBox');
								DOM.val('#J_RangeTypeValue','PART_NOT');
							}else{
								DOM.val('#J_TypeId',207);
								DOM.show('#J_PromoDescTempletBox');
								DOM.val('#J_RangeTypeValue','ALL');
							}
						}else if(parentType == 'freepost'){
							if(promotionControl.mjsRemove.length > 0){
								DOM.val('#J_TypeId',115);
								DOM.hide('#J_PromoDescTempletBox');
								DOM.val('#J_RangeTypeValue','PART_NOT');
							}else{
								DOM.val('#J_TypeId',105);
								DOM.show('#J_PromoDescTempletBox');
								DOM.val('#J_RangeTypeValue','ALL');
							}
						}
						if(parentType == 'mjs' || parentType == 'mjscp' || parentType == 'freepost'){ 
//							changePromoDescTem(DOM.val('#J_TypeId'),'ALL');
							DOM.val('#J_IsGetAll',1);
							DOM.val('#J_ProtoId',59);
						}
					}
				})
				
				//满就送优惠选择“元”		
				Event.on('#J_mjsYuan','click',function(ev){
					if(ev.currentTarget.checked == true){
						if(parentType == 'freepost'){
							if(DOM.get('#J_Quandian').checked == true){
								if(promotionControl.mjsRemove.length > 0){
									DOM.val('#J_TypeId',115);
									DOM.show('#J_overcomeItem');
								}else{
									DOM.val('#J_TypeId',105);
									DOM.show('#J_PromoDescTempletBox');
								}
							}else{
								DOM.val('#J_TypeId',106);
								DOM.show('#J_PromoDescTempletBox');
							}
							DOM.show('#J_object');
							DOM.show('#J_scope');
							DOM.show('#J_discountDetail');
						}
						if(DOM.val('#J_mjsSalesType') == 0){
							promotionControl.tempSaveMjs();
							var val = '';
							for(var k = 0; k < promotionControl.mjsData.length; k++){
								val += promotionControl.mjsData[k].con_value;
 	                	   	}
							if(val == '' || val == 0){
								promotionControl.isChange = true;
     	                	   	DOM.val('#J_mjsSalesType',1)
								promotionControl.renderMjs();
							}else{
								var str = '<div class="pop-reset-mjs">'+
									'<p>您将活动条件由 <b>满件优惠</b> 切换为 <b class="color-red">满元优惠</b></p>'+
									'<ul id="J_termMjsList"></ul>'+
								'</div>';
								new Overlay.Dialog({
									title : '重新设置层级条件',
									width : 520,
									mask:true,
				     	            buttons:[
			     	                   {
			     	                     text:'确定',
			     	                     elCls : 'bui-button bui-button-primary',
			     	                     handler : function(){
			     	                	   	promotionControl.isChange = true;
			     	                	   	DOM.val('#J_mjsSalesType',1)
			     	                	   	var replaceList = DOM.children('#J_termMjsList')
			     	                	   	for(var i = 0; i < replaceList.length; i++){
			     	                	   		promotionControl.mjsData[i].con_value = DOM.val(DOM.get('#J_replaceVal'+i));
			     	                	   	}
			     	                	   	promotionControl.renderMjs();
			     	                	   	this.destroy();
			     	                     }
			     	                   },{
			     	                     text:'取消',
			     	                     elCls : 'bui-button J_buttonCancel',
			     	                     handler : function(){
			     	                	   	if(DOM.val('#J_mjsSalesType') == 0){
			     	                	   		promotionControl.x.setRadioPro('#J_mjsJian');
			     	                	   	}
			     	                       	this.destroy();
			     	                     }
			     	                   }
			     	                 ],
			     	                 bodyContent:str
								}).show()
								promotionControl.replaceTerm();
							}
						}
					}
				})
				
				//满就送优惠选择“件”	
				Event.on('#J_mjsJian','click',function(ev){
					if(ev.currentTarget.checked == true){
						if(parentType == 'freepost'){
							if(DOM.get('#J_Quandian').checked == true){
								if(promotionControl.mjsRemove.length > 0){
									DOM.val('#J_TypeId',115);
									DOM.show('#J_overcomeItem');
								}else{
									DOM.val('#J_TypeId',105);
									DOM.show('#J_PromoDescTempletBox');
								}
							}else{
								DOM.val('#J_TypeId',106);
								DOM.show('#J_PromoDescTempletBox');
							}
							DOM.show('#J_object');
							DOM.show('#J_scope');
							DOM.show('#J_discountDetail');
						}
						if(DOM.val('#J_mjsSalesType') == 1){
							promotionControl.tempSaveMjs();
							var val = '';
							for(var k = 0; k < promotionControl.mjsData.length; k++){
								val += promotionControl.mjsData[k].con_value;
 	                	   	}
							if(val == '' || val == 0){
								promotionControl.isChange = true;
	 	                	   	DOM.val('#J_mjsSalesType',0)
								promotionControl.renderMjs();
							}else{
								var str = '<div class="pop-reset-mjs">'+
									'<p>您将活动条件由 <b>满元优惠</b> 切换为 <b class="color-red">满件优惠</b></p>'+
									'<ul id="J_termMjsList"></ul>'+
								'</div>';
								new Overlay.Dialog({
									title : '重新设置层级条件',
									width : 520,
									mask:true,
				     	            buttons:[
				 	                   {
				 	                     text:'确定',
				 	                     elCls : 'bui-button bui-button-primary',
				 	                     handler : function(){
				 	                	   	promotionControl.isChange = true;
				 	                	   	DOM.val('#J_mjsSalesType',0)
				 	                	   	var replaceList = DOM.children('#J_termMjsList')
				 	                	   	for(var i = 0; i < replaceList.length; i++){
				 	                	   		promotionControl.mjsData[i].con_value = DOM.val(DOM.get('#J_replaceVal'+i));
				 	                	   	}
				 	                	   	promotionControl.renderMjs();
				 	                	   	this.destroy();
				 	                     }
				 	                   },{
				 	                     text:'取消',
				 	                     elCls : 'bui-button J_buttonCancel',
				 	                     handler : function(){
				 	                	   	if(DOM.val('#J_mjsSalesType') == 1){
				 	                	   		promotionControl.x.setRadioPro('#J_mjsYuan');
				 	                	   	}
				 	                       	this.destroy();
				 	                     }
				 	                   }
				 	                 ],
				 	                bodyContent:str
								}).show();
							}
						}
						promotionControl.replaceTerm();
					}
				})
				
				//点击无条件免邮
				Event.on('#J_unconditional','click',function(ev){
					if(ev.currentTarget.checked == true){
						DOM.hide('#J_discountDetail');
						DOM.hide('#J_PromoDescTempletBox');
						DOM.hide('#J_object');
						DOM.hide('#J_scope');
						DOM.hide('#J_overcomeItem');
						DOM.val('#J_TypeId',130);
					}
				})
				
				//设置活动标签显示与隐藏
				Event.on('#J_promoName','focusin',function(ev){
					if(parentType == 'mjs' || parentType == 'freepost' || parentType == 'mjscp'){
						var showCase = S.one('#J_showCase');
						showCase.fadeIn(2);
					}else{
						DOM.show('.J_editFlag');
					}
				})
				S.each(DOM.query('.J_flagItem'),function(item){
					Event.on(item,'click',function(ev){
						var txt = DOM.text(ev.currentTarget);
						DOM.val('#J_promoName',txt);
						DOM.text('#J_previewFlag',txt);
					})
				})
				
				if(parentType != 'jtj' || parentType != 'spec'){
					 //选择活动时间
					 var datepicker = new Calendar.DatePicker({
	    	              trigger:'#J_startDate',
	    	              showTime:true,
	    	              autoRender : true,
	    	              autoSetValue :false
	    	         })
	    	         var datepicker2 = new Calendar.DatePicker({
	    	              trigger:'#J_endDate',
	    	              showTime:true,
	    	              autoRender : true,
	    	              autoSetValue :false
	    	         })
	    	         datepicker.on('selectedchange',function (e){
		        	 	var endDate = H.util.stringToDate(S.one('#J_endDate').val());
						var startDate   = e.value;
						if((endDate !='')&&(startDate.getTime() >= endDate.getTime())){
							DOM.hide('#J_endMsg');
							DOM.show('#J_endNote');
							DOM.show('#J_staartMsg');
							DOM.text('#J_staartMsg','开始时间不能大于结束时间，请重新选择');
						}else{
							DOM.hide('#J_endMsg');
							DOM.show('#J_endNote');
							DOM.hide('#J_staartMsg');
							S.one('#J_startDate').val(e.text);
							//写入详情展示
							var v = e.text.split(' ')[0].split('-');
							var text = v[0]+'年'+v[1]+'月'+v[2]+'日';
							DOM.text('#J_promoDescStart',text);
 
							var leftsecond = parseInt((endDate.getTime() - startDate.getTime()) / 1000);
			                d = parseInt((leftsecond / 86400) % 10000);
			                h = parseInt((leftsecond / 3600) % 24);
							str = '活动持续 '+d+' 天 '+h+' 小时';
							DOM.html("#J_endNote" , str);
							promotionControl.isChange = true;
						}
	    	         })
	    	         datepicker2.on('selectedchange',function (e){
		     	       	var endDate   =  e.value;
						var startTime = H.util.stringToDate(S.one('#J_startDate').val());
						var endTime = H.util.stringToDate(endDate);
						if((endTime.getTime() <= startTime.getTime())&&(startTime !='')){
							DOM.hide('#J_staartMsg');
							DOM.hide('#J_endNote');
							DOM.show('#J_endMsg')
							DOM.text('#J_endMsg','结束时间不能小于开始时间，请重新选择');
						}else{
							DOM.hide('#J_staartMsg');
							DOM.show('#J_endNote');
							DOM.hide('#J_endMsg');
							S.one('#J_endDate').val(e.text);
							//写入详情展示
							var v = e.text.split(' ')[0].split('-');
							var text = v[0]+'年'+v[1]+'月'+v[2]+'日';
							DOM.text('#J_promoDescEnd',text);
							
							var leftsecond = parseInt((endTime.getTime() - startTime.getTime()) / 1000);
			                d = parseInt((leftsecond / 86400) % 10000);
			                h = parseInt((leftsecond / 3600) % 24);
							str = '活动持续 '+d+' 天 '+h+' 小时';
							DOM.html("#J_endNote" , str);
							promotionControl.isChange = true;
						}
	    	         })
				}
				
	            //处理 input状态
	            promotionControl.handleInputs();
	            
	            //满就送弹窗排除宝贝
	            Event.delegate(document,'click','.J_chooseItem',function(ev){
	            	var type = DOM.attr(ev.currentTarget,'type');
	            	var num = DOM.attr(ev.currentTarget,'num');
					if(type == 'radio'){
						var tex = '选择宝贝';
						var tip = 'tip-add-details';
					}else{
						var tex = '排除宝贝';
						var tip = 'tip-details';
					}
					var str = '<div class="main-screen">'+
						'<input type="hidden" id="J_SelectItemType" value="'+ type +'">'+
						'<input type="hidden" id="J_setGiftNum" value="'+ num +'">'+
				    	'<ul>'+
					 		'<li class="fl"><div class="price-among"><span>价格区间</span><input type="text" class="price-start" id="J_startPrice"><i>-</i><input type="text" class="price-end" id="J_endPrice"></div></li>'+
					 		'<div class="uboxstyle-1 fl J_Seach_1" id="J_SelectItemCidBox"><input type="hidden" id="J_SelectItemCid"></div>'+
					 		'<li class="fr"><div class="search-promo"><input type="text" id="J_SearchTitle" onblur="this.className=\'search-input\';if(this.value==\'\'){this.value = \'关键字、链接、商品编码\'}" onfocus="this.className=\'search-input\';if(this.value==\'关键字、链接、商品编码\'){this.value = \'\';}" value="关键字、链接、商品编码" class="search-input"><a class="search-btn" id="J_searchBtn">搜索宝贝</a></div></li>'+
				        '</ul>'+
				    '</div>'+
				    '<div class="ui-list">'+
					    '<div class="loading" id="J_LeftLoading" style="display:none;"></div>'+
					    '<div class="list-bd" id="J_MainLeftContent">'+
					        '<div id="J_LEmpty" class="'+ tip +'"></div>'+
					        '<ul id="J_PromoItems" class="remove-list"></ul>'+
					    '</div>'+
						'<div id="J_PromotionItemPaging" class="ui-page"></div>'+
					'</div>';
					new Overlay.Dialog({
						title : tex,
						width : 700,
						height:625,
						mask:true,
						bodyStyle :{'padding-top' : '0'},
						footerStyle :{'display' : 'none'},
		 	            bodyContent:str
					}).show();
					
					//选择分类
				    promoSelect = new Select.Select({  
					    render:'#J_SelectItemCidBox',
				      	valueField:'#J_SelectItemCid',
				      	items:S.JSON.parse(sellerCats),
				      	visibleMode : 'display'
					});
					promoSelect.render();
					promoSelect.setSelectedValue('0');
				});
				
				//弹窗查看已排除全部宝贝
				Event.on('#J_hasMore','click',function(){
					var len = promotionControl.editMjsRemove.length;
					for(i = 0; i < len; i++){
						promotionControl.editMjsRemove.splice(i,len);
					}
					var str = '<div class="ui-list">'+
						    '<div class="list-bd" id="J_editRemoveList">'+
						        '<div class="edit-remove-item"><ul id="J_moreItemListUl" class="remove-list ks-switchable-content"></ul><div>'+
						        '<ul class="ks-switchable-nav"></ul>'+
						    '</div>'+
						'</div>';
					new Overlay.Dialog({
						title : '编辑已排除宝贝',
						width : 700,
						height:545,
						mask:true,
		 	            buttons:[
			                   {
			                     text:'确定',
			                     elCls : 'bui-button bui-button-primary',
			                     handler : function(){
				           			for(var i = 0; i < promotionControl.editMjsRemove.length; i++){
				           				for(var j = 0; j < promotionControl.mjsRemove.length; j++){
				           					if(promotionControl.mjsRemove[j].id == promotionControl.editMjsRemove[i].id){
				           						promotionControl.mjsRemove.splice(j,1);
					           				}
				           				}
				           			}
				           			promotionControl.renderRemoveItem();
				           			
				           			//活动类型切换
				    				if(promotionControl.mjsRemove.length == 0 || promotionControl.mjsRemove.length == ''){
				    					if(parentType == 'mjs'){
				    						DOM.val('#J_TypeId',107);
				    					}else if(parentType == 'freepost'){
				    						DOM.val('#J_TypeId',105);
				    					}else if(parentType == 'mjscp'){
											DOM.val('#J_TypeId',207);
										}
				    					DOM.show('#J_PromoDescTempletBox');
				    					DOM.val('#J_RangeTypeValue','ALL');
				    	          	}
				    				
			                	   	this.destroy();
			                     }
			                   },{
			                     text:'取消',
			                     elCls : 'bui-button J_buttonCancel',
			                     handler : function(){
			                       	this.destroy();
			                     }
			                   }
			                 ],
			                bodyContent:str
					}).show();
					promotionControl.renderMoreItem();
					var s = new Switchable.Slide('#J_editRemoveList',{
				        effect : 'scrolly',
				        easing : 'easeOutStrong',
				        steps : 5,
				        triggerType : 'click',
				        autoplay : false
				    });
				})
			
				//更新店铺折扣
				promotionControl.getPromoItemNum();
				Event.on('#J_updateDiscount','click',function(){
					DOM.val('#J_isDiscount','1');
				    var diff  = IsExpired();
	    			if(diff > -5000 ){
						var sucessHandle = function(o) {
							promotionControl.getPromoItemNum();
				 		};
				 		var errorHandle = function(o){
				 			KISSY.Event.fire('.J_TopExpired','click');
				 		};
				 		var data = '';
				  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
		   			}else{
		   				promotionControl.getPromoItemNum();
		   			}
			   })		

				// 活动保存 
				var timeFunName = null;
				Event.on('#J_BtnPublish','click dblclick',function(ev){
					if(!promotionControl.isChange && promotionControl.isEidt){
						window.location.href = nextTargerUrl;
						return ;
					};
					var topExpiredUrl = DOM.attr('.J_TopExpired','data');
					if(DOM.val('#J_TypeId') == 12){
						var promoName = DOM.val('#J_promoName'),
						shopDesc = DOM.val('#J_shopDesc'),
						startDate = DOM.val('#J_startDate'),
						endDate = DOM.val('#J_endDate'),
						onsale_num = DOM.val('#J_onsaleNum'),
						instock_num = DOM.val('#J_instockNum'),
						promo_discount = DOM.val('#J_promoDiscount');
						var str = '<div class="pop-is-promo">'+
								'<div class="ui-about-list" style="margin:0;">'+
									'<ul>'+
										'<li>'+
								            '<div class="ui-side-list">活动标签：</div>'+
								            '<div class="ui-content-list"><a class="promo-flag">'+ promoName +'</a></div> '+                            
								        '</li> '+
								        '<li>'+
								            '<div class="ui-side-list">活动备注：</div>'+
								            '<div class="ui-content-list">'+ shopDesc +'</div> '+                            
								        '</li> '+
								        '<li>'+
								            '<div class="ui-side-list">活动时间：</div>'+
								            '<div class="ui-content-list">'+ startDate +' - '+ endDate +' </div>  '+                           
								        '</li> '+
								        '<li>'+
								           ' <div class="ui-side-list">活动中宝贝：</div>'+
								           ' <div class="ui-content-list"><b class="color-red">'+ onsale_num +'</b> 件</div>'+                          
								        '</li> '+ 
								        '<li>'+
								           ' <div class="ui-side-list">活动折扣：</div>'+
								            '<div class="ui-content-list"><b class="color-red">'+ promo_discount +'</b> 折</div>'+                           
								        '</li> '+
									'</ul>'+
								'</div>	'+
							'</div>';
							new Overlay.Dialog({
			     	            title:'全店参与折扣',
			     	            width:450,
			     	            mask:true,
			     	            buttons:[{ 
			     	            	
		     	                     text:'确定',
		     	                     elCls : 'bui-button bui-button-primary',
		     	                     handler : function(){

		     	                	  if(ev.type == 'click'){
											clearTimeout(timeFunName);
								        	 timeFunName = setTimeout(function () {
								          		 var diff  = IsExpired();
								       			 if(diff > -5000){
								      					var sucessHandle = function(o) {
								      						promotionControl.save();
								      			 		};
								      			 		var errorHandle = function(o){
								      			 			new Overlay.Dialog({
								      		     	            title:'请授权',
								      		     	            width:400,
								      		     	            height:200,
								      		     	            mask:true,
								      		     	            buttons:[
								      		     	                   {
								      		     	                     text:'确定',
								      		     	                     elCls : 'bui-button bui-button-primary',
								      		     	                     handler : function(){
								      		     	                       this.destroy();
								      		     	                     }
								      		     	                   }
								      		     	                 ],
								      		     	            bodyContent:'<div class="pop-accredit">亲，授权已过期，请授权&nbsp;&nbsp;<a target="_blank" href="https://oauth.taobao.com/authorize?client_id=12029422&scope=item,promotion,usergrade&response_type=code&redirect_uri=http://promo.huanleguang.com">立即授权</a></div>'
								      		     	        }).show();
								      			 		};
								      			 		var data = '';
								      			  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
								      				}else{
								      					promotionControl.save();
								          			}
								              }, 300);  
								    	}
								        if(ev.type == 'dblclick') {
								        	clearTimeout(timeFunName); 
								       		 var diff  = IsExpired();
											 if(diff > -5000 ){
												var sucessHandle = function(o) {
							  						promotionControl.save();
										 		};
										 		var errorHandle = function(o){
													new Overlay.Dialog({
													       title:'请授权',
													       width:400,
													       height:200,
													       mask:true,
													       buttons:[
													              {
													                text:'确定',
													                elCls : 'bui-button bui-button-primary',
													                handler : function(){
													                  this.destroy();
													                }
													              }
													            ],
													  bodyContent:'<div class="pop-accredit">亲，授权已过期，请授权&nbsp;&nbsp;<a target="_blank" href="'+ topExpiredUrl +'">立即授权</a></div>'
													  }).show();
										 		};
										 		var data = '';
										  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
											}else{
												promotionControl.save();
							      			} 
								        }
								        
		     	                     }
		     	                   },{
		     	                     text:'关闭',
		     	                     elCls : 'bui-button J_buttonCancel',
		     	                     handler : function(){
		     	                       this.destroy();
		     	                     }
		     	                   }
		     	                 ],
		     	                 bodyContent:str
		     	          }).show()
					}else{
						if(ev.type == 'click'){
							clearTimeout(timeFunName);
				        	 timeFunName = setTimeout(function () {
				          		 var diff  = IsExpired();
				       			 if(diff > -5000){
				      					var sucessHandle = function(o) {
				      						promotionControl.save();
				      			 		};
				      			 		var errorHandle = function(o){
				      			 			new Overlay.Dialog({
											       title:'请授权',
											       width:400,
											       height:200,
											       mask:true,
											       buttons:[
											              {
											                text:'确定',
											                elCls : 'bui-button bui-button-primary',
											                handler : function(){
											                  this.destroy();
											                }
											              }
											            ],
											       bodyContent:'<div class="pop-accredit">亲，授权已过期，请授权&nbsp;&nbsp;<a target="_blank" href="'+ topExpiredUrl +'">立即授权</a></div>'
											  }).show();
				      			 		};
				      			 		var data = '';
				      			  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
				      				}else{
				      					promotionControl.save();
				          			}
				              }, 300);  
				    	}
				        if(ev.type == 'dblclick') {
				        	clearTimeout(timeFunName); 
				       		 var diff  = IsExpired();
							 if(diff > -5000 ){
								var sucessHandle = function(o) {
			  						promotionControl.save();
						 		};
						 		var errorHandle = function(o){
						 			new Overlay.Dialog({
									       title:'请授权',
									       width:400,
									       height:200,
									       mask:true,
									       buttons:[
									              {
									                text:'确定',
									                elCls : 'bui-button bui-button-primary',
									                handler : function(){
									                  this.destroy();
									                }
									              }
									            ],
									       bodyContent:'<div class="pop-accredit">亲，授权已过期，请授权&nbsp;&nbsp;<a target="_blank" href="'+ topExpiredUrl +'">立即授权</a></div>'
									  }).show();
						 		};
						 		var data = '';
						  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
							}else{
								promotionControl.save();
			      			} 
				        }
					}
				})
				
				//满就送，免邮 活动类型 满元，满件,无条件
				if(!promotionControl.isEidt){
					if(parentType == 'mjs'){
						if(mjsType == 0){
							promotionControl.x.setRadioPro('#J_mjsJian');
							Event.fire('#J_mjsJian','click');
						}
					}else if(parentType == 'freepost'){
						if(myType == 0){
							promotionControl.x.setRadioPro('#J_mjsJian');
							Event.fire('#J_mjsJian','click');
						}else if(myType == -1){
							promotionControl.x.setRadioPro('#J_unconditional');
							Event.fire('#J_unconditional','click');
						}
					}
				}
			},
			
			//获取店铺设置的折扣
	        getPromoItemNum : function(discount){
	        	var sucess = function(o){
	        		DOM.hide('#J_loadingDiscount');
	        		DOM.show('#J_storeDiscount');
	        		DOM.text('#J_storeDiscount',o.payload+' 折');
				};
		 		var error = function(o){
		 			DOM.hide('#J_loadingDiscount');
		 			DOM.show('#J_storeDiscount');
		 			DOM.text('#J_storeDiscount','获取不到');
		 		};
		 		DOM.show('#J_loadingDiscount');
		 		DOM.hide('#J_storeDiscount');
		 		var isLoading = DOM.val('#J_isDiscount');
		 		var data = 'fg='+isLoading;
		  	    new H.widget.asyncRequest().setURI(getLowestDisUrl).setMethod("GET").setHandle(sucess).setErrorHandle(error).setData(data).send(); 
	        },
	        
	        //改一口价切换焦点
	        onePriceWay : function(id){
	        	var pid = DOM.attr(id,'pid');
	        	promotionControl.x.setRadioOn('#J_onePrice'+pid);
	        }, 
	        
	        //阶梯价层级渲染
	        renderJtj : function(){
				var items = promotionControl.jtjData;
				var templet = DOM.html(DOM.get('#J_Rule_jtj'));
		        var data = { data: items };
		        var els = new XTemplate(templet).render(data);
		        DOM.html(DOM.get('#J_privilegeTier'), els );
		        for(var i = 0; i < items.length; i++){
		        	if(i > 0){
		        		var t = H.util.stringToDate(S.one('#J_EndDateJtj'+(i-1)).val());
		        		var start = t.getTime() + 86400000;
		        		var end = start + 86400000;
			        	var n = new Date(start).format("yyyy-MM-dd hh:mm:ss");
			        	var e = new Date(end).format("yyyy-MM-dd hh:mm:ss");
			        	DOM.val('#J_StartDateJtj'+i,n);
			        	DOM.val('#J_EndDateJtj'+i,e);
		        	}
	        	} 
	        },

	        //阶梯价新增层级
	        addJtj : function(){
	        	promotionControl.tempSaveJtj();
	        	var items = promotionControl.jtjData;
	        	if(items.length > 5){
	        		new H.widget.msgBox({
					    title:"温馨提示",
					    content:'活动最多设置6个阶梯',
					    type:"error",
						autoClose : true,
						timeOut : 3000
					})
					return ;
				}
	        	var item = {"start_data":"","end_data":""};
	        	promotionControl.jtjData.push(item);
	        	promotionControl.renderJtj();
	        },
	        
	        //阶梯价删除层级
	        deleJtj : function(num){
	        	promotionControl.tempSaveJtj();
				promotionControl.jtjData.splice(num,1);
	        	promotionControl.renderJtj();
			},
			
			//阶梯价保存参数
	        tempSaveJtj : function(){
	        	promotionControl.jtjData = [];
				var lis = DOM.children('#J_privilegeTier');
				KISSY.each(lis,function(currentLi,index){
					var item ={};
					item.start_data = DOM.val(DOM.get('.J_StartDateJtj',currentLi)); 
					item.end_data = DOM.val(DOM.get('.J_EndDateJtj',currentLi)); 
					promotionControl.jtjData.push(item);
				})
	        },
	        
	        //第N件优惠层级渲染
	        renderMjspart : function(){
				var items = promotionControl.mjspartData;
				if(items.length < 7){
		        	DOM.show('#J_addMjs')
		        }else{
		        	DOM.hide('#J_addMjs')
		        }
				var templet = DOM.html(DOM.get('#J_Rule_N'));
		        var data = { data: items };
		        var els = new XTemplate(templet).render(data);
		        DOM.html(DOM.get('#J_privilegeTier'), els );
		        if(items.length > 0){
		        	DOM.text('#J_maxPrivilege','第 '+ ((items.length)+1) +' 件起，原价购买 ');
		        }
		        var joinItemPrice = DOM.val('#J_joinItemPrice');
		        var total = 0;
		        for(i = 0; i < items.length; i++){
	        		total += Number(items[i].con_price);
	        		var totalPrices = joinItemPrice*(i+1);
	        		DOM.val('#J_decreaseMoney'+i,totalPrices - total);
	        		DOM.html('#J_privilegeData'+i,'拍下 '+ (i+1) +' 件时，订单总价 <b>'+ totalPrices +'</b> 元，优惠了<b> '+ (totalPrices - total) +'</b> 元');
		        }
	        },

	        //第N件优惠新增层级
	        addMjspart : function(){
	        	promotionControl.tempSaveMjspart();
	        	var items = promotionControl.mjspartData;
	        	var item = {"con_price":"","decrease_money":"","con_value":""};
	        	promotionControl.mjspartData.push(item);
	        	promotionControl.renderMjspart();
	        },
	        
	        //第N件删除层级
	        deleMjspart : function(num){
	        	promotionControl.tempSaveMjspart();
				promotionControl.mjspartData.splice(num,1);
	        	promotionControl.renderMjspart();
			},
			
			//第N件优惠保存参数
	        tempSaveMjspart : function(){
	        	promotionControl.mjspartData = [];
				var lis = DOM.children('#J_privilegeTier');
				KISSY.each(lis,function(currentLi,index){
					var item ={};
					item.con_price = DOM.val(DOM.get('.J_conPrice',currentLi)); 
					item.decrease_money = DOM.val(DOM.get('.J_decreaseMoney',currentLi)); 
					item.con_value = DOM.val(DOM.get('.J_con_value',currentLi)); 
					promotionControl.mjspartData.push(item);
				})
	        },
	        
	        //满就送更改条件
			replaceTerm : function(){
	        	promotionControl.tempSaveMjs();
				var items = promotionControl.mjsData;
				var templet = DOM.html(DOM.get('#J_replace_Mjs'));
		        var data = { data: items };
		        var els = new XTemplate(templet).render(data);
		        DOM.html(DOM.get('#J_termMjsList'), els);

		        for(i = 0; i < items.length; i++){
		        	var str = items[i].freeAreasName.split(',');
		        	if(str.length <= 18 && str != ''){
		        		DOM.text('#J_mailRegionPop'+i,'包邮：仅'+items[i].freeAreasName);
		        	}else if(str.length >= 19 && str.length < 29){
		        		DOM.text('#J_mailRegionPop'+i,'包邮：不包括'+items[i].free_post_areasName);
		        	}else if(str.length >= 29 && str.length < 35){
		        		DOM.text('#J_mailRegionPop'+i,'全国包邮：不含'+items[i].free_post_areasName);
		        	}else if(str.length == 35){
		        		DOM.text('#J_mailRegionPop'+i,'全国包邮');
		        	}
		        }
			},
			
	        //满就送层级渲染
	        renderMjs : function(){
				var items = promotionControl.mjsData;
				var templet = DOM.html(DOM.get('#J_Rule_Mjs'));
		        var data = { data: items };
		        var els = new XTemplate(templet).render(data);
		        DOM.html(DOM.get('#J_privilegeTier'), els );
		        //促销详情展示
		        var TempletDesc = DOM.html(DOM.get('#J_Templet_desc'));
		        var desc = new XTemplate(TempletDesc).render(data);
		        DOM.html(DOM.get('#J_promoShowList'), desc );
		        
		        for(var i = 0; i < items.length; i++){
		        	
		        	var str = items[i].freeAreasName.split(',');
		        	if(str.length <= 18 && str != ''){
		        		DOM.text('#J_mailRegion'+i,'包邮：仅'+items[i].freeAreasName);
		        		DOM.text('#J_freeMailList'+i,'仅'+items[i].freeAreasName);
		        	}else if(str.length >= 19 && str.length < 29){
		        		DOM.text('#J_mailRegion'+i,'包邮：不包括'+items[i].free_post_areasName);
		        		DOM.text('#J_freeMailList'+i,'不包括'+items[i].free_post_areasName);
		        	}else if(str.length >= 29 && str.length < 35){
		        		DOM.text('#J_mailRegion'+i,'全国包邮：不含'+items[i].free_post_areasName);
		        		DOM.text('#J_freeMailList'+i,'不含'+items[i].free_post_areasName);
		        	}else if(str.length == 35){
		        		DOM.text('#J_mailRegion'+i,'全国包邮');
		        		DOM.text('#J_freeMailList'+i,'');
		        	}
		        	
		        	 //表单美化
		        	 promotionControl.x.renderAllCheckbox('#J_tierItem'+i);
		        	 if(parentType == 'mjscp'){
		        		 promotionControl.x.renderAllRadio('#J_tierItem'+i);
		        	 }
		        	 
		        	 //是否上不封顶
					 Event.on('#J_enableMultiple_'+i,'click',function(ev){
						 var data = DOM.attr(ev.currentTarget,'data');
						 if(ev.currentTarget.checked == true){
							 DOM.val(ev.currentTarget,1);
							 DOM.show('#J_cappingNo'+data);
						 }else{
							 DOM.val(ev.currentTarget,0);
							 DOM.hide('#J_cappingNo'+data);
						 }
					 })
					 
					 //是否打折
					 Event.on('#J_isDiscount'+i,'click',function(ev){
						 var data = DOM.attr(ev.currentTarget,'data');
						 if(ev.currentTarget.checked == true){
							 DOM.val(ev.currentTarget,1);
							 DOM.show('#J_isShowDiscount'+data);
						 }else{ 
							 DOM.val(ev.currentTarget,0);
							 DOM.hide('#J_isShowDiscount'+data);
						 }
					 })
					 
					  //是否减钱
					 Event.on('#J_isDiscountMoney'+i,'click',function(ev){
						 var data = DOM.attr(ev.currentTarget,'data');
						 if(ev.currentTarget.checked == true){
							 DOM.val(ev.currentTarget,1);
							 DOM.show('#J_isShowMoney'+data);
						 }else{
							 DOM.val(ev.currentTarget,0);
							 DOM.hide('#J_isShowMoney'+data);
						 }
					 })

		        	 //是否送礼物
					 Event.on('#J_isSendGift'+i,'click',function(ev){
						 var data = DOM.attr(ev.currentTarget,'data')
						 if(ev.currentTarget.checked == true){
							 DOM.val(ev.currentTarget,1);
							 DOM.show('#J_giftEdit'+data);
							 DOM.show('#J_isShowGift'+data);
						 }else{
							 DOM.val(ev.currentTarget,0);
							 DOM.hide('#J_giftEdit'+data)
							 DOM.hide('#J_isShowGift'+data);
						 }
					 })
					 
					 //是否设置包邮地区
					 Event.on('#J_isSetArea'+i,'click',function(ev){
						 var data = DOM.attr(ev.currentTarget,'data')
						 if(ev.currentTarget.checked == true){
							 DOM.val(ev.currentTarget,1);
							 DOM.show('#J_areaEdit'+data);
							 DOM.show('#J_freeMailText'+data);
						 }else{
							 DOM.val(ev.currentTarget,0);
							 DOM.hide('#J_areaEdit'+data);
							 DOM.hide('#J_freeMailText'+data);
						 }
					 })
					 
					 //是否送彩票
					 Event.on('#J_isSendLottery'+i,'click',function(ev){
						 var data = DOM.attr(ev.currentTarget,'data')
						 promotionControl.checkCpAgreement(ev.currentTarget);
						 if(ev.currentTarget.checked == true){
							 DOM.val(ev.currentTarget,1);
							 DOM.show('#J_lotteryEdit'+data);
							 DOM.show('#J_isLottery'+data);
						 }else{
							 DOM.val(ev.currentTarget,0);
							 DOM.hide('#J_lotteryEdit'+data);
							 DOM.hide('#J_isLottery'+data)
						 }
					 })
					 Event.on('#J_ssq'+i,'click',function(ev){
						 var data = DOM.attr(ev.currentTarget,'data')
						 if(ev.currentTarget.checked == true){
							 DOM.val('#J_lotteryTypeId'+data,1);
							 DOM.text('#J_lotteryType'+data,'双色球');
						 }
					 })
					 Event.on('#J_3d'+i,'click',function(ev){
						 var data = DOM.attr(ev.currentTarget,'data')
						 if(ev.currentTarget.checked == true){
							 DOM.val('#J_lotteryTypeId'+data,2);
							 DOM.text('#J_lotteryType'+data,'3D');
						 }
					 })
					 Event.on('#J_qlc'+i,'click',function(ev){
						 var data = DOM.attr(ev.currentTarget,'data')
						 if(ev.currentTarget.checked == true){
							 DOM.val('#J_lotteryTypeId'+data,7);
							 DOM.text('#J_lotteryType'+data,'七乐彩');
						 }
					 })

					 //设置免邮地区
					 Event.on('#J_setRegion'+i,'click',function(ev){
						var pid = DOM.attr(ev.currentTarget,'pid')
						var str = '<div class="pop-area" id="J_areaList">'+
										'<div class="fast-area">'+
											'<a id="J_allArea">全选</a><a id="J_theArea">清空</a><a id="J_hotArea">江浙沪</a>'+
										'</div>'+
										'<div class="pop-area-list">'+
											'<ul>'+
												'<li id="J_hd">'+ 
													'<span class="sort-area"><label class="beautify_check" for="J_sortHd"><input type="checkbox" value="Hd" id="J_sortHd" class="J_areaSort">华东</label></span>'+
													'<label class="beautify_check" for="J_310000"><input pid="310000" value="上海" type="checkbox" id="J_310000" class="J_areaItem">上海</label>'+
													'<label class="beautify_check" for="J_320000"><input pid="320000" value="江苏" type="checkbox" id="J_320000" class="J_areaItem">江苏</label>'+
													'<label class="beautify_check" for="J_330000"><input pid="330000" value="浙江" type="checkbox" id="J_330000" class="J_areaItem">浙江</label>'+
													'<label class="beautify_check" for="J_350000"><input pid="350000" value="福建" type="checkbox" id="J_350000" class="J_areaItem">福建</label>'+
													'<label class="beautify_check" for="J_340000"><input pid="340000" value="安徽" type="checkbox" id="J_340000" class="J_areaItem">安徽</label>'+
													'<label class="beautify_check" for="J_360000"><input pid="360000" value="江西" type="checkbox" id="J_360000" class="J_areaItem">江西</label>'+
												'</li>'+
												'<li id="J_hb">'+
													'<span class="sort-area"><label class="beautify_check" for="J_sortHb"><input type="checkbox" value="Hb" id="J_sortHb" class="J_areaSort">华北</label></span>'+
													'<label class="beautify_check" for="J_110000"><input pid="110000" value="北京" type="checkbox" id="J_110000" class="J_areaItem">北京</label>'+
													'<label class="beautify_check" for="J_120000"><input pid="120000" value="天津" type="checkbox" id="J_120000" class="J_areaItem">天津</label>'+
													'<label class="beautify_check" for="J_130000"><input pid="130000" value="河北" type="checkbox" id="J_130000" class="J_areaItem">河北</label>'+
													'<label class="beautify_check" for="J_370000"><input pid="370000"  value="山东"type="checkbox" id="J_370000" class="J_areaItem">山东</label>'+
													'<label class="beautify_check" for="J_140000"><input pid="140000" value="山西" type="checkbox" id="J_140000" class="J_areaItem">山西</label>'+
													'<label class="beautify_check" for="J_150000"><input pid="150000" value="内蒙古" type="checkbox" id="J_150000" class="J_areaItem">内蒙古</label>'+
												'</li>'+
												'<li id="J_hn">'+
													'<span class="sort-area"><label class="beautify_check" for="J_sortHn"><input type="checkbox" value="Hn" id="J_sortHn" class="J_areaSort">华南</label></span>'+
													'<label class="beautify_check" for="J_440000"><input pid="440000" value="广东" type="checkbox" id="J_440000" class="J_areaItem">广东</label>'+
													'<label class="beautify_check" for="J_450000"><input pid="450000" value="广西" type="checkbox" id="J_450000" class="J_areaItem">广西</label>'+
													'<label class="beautify_check" for="J_460000"><input pid="460000" value="海南" type="checkbox" id="J_460000" class="J_areaItem">海南</label>'+
												'</li>'+
												'<li id="J_hz">'+
													'<span class="sort-area"><label class="beautify_check" for="J_sortHz"><input type="checkbox" value="Hz" id="J_sortHz" class="J_areaSort">华中</label></span>'+
													'<label class="beautify_check" for="J_410000"><input pid="410000" value="河南" type="checkbox" id="J_410000" class="J_areaItem">河南</label>'+
													'<label class="beautify_check" for="J_420000"><input pid="420000" value="湖北" type="checkbox" id="J_420000" class="J_areaItem">湖北</label>'+
													'<label class="beautify_check" for="J_430000"><input pid="430000" value="湖南" type="checkbox" id="J_430000" class="J_areaItem">湖南</label>'+
												'</li>'+
												'<li id="J_db">'+
													'<span class="sort-area"><label class="beautify_check" for="J_sortDb"><input type="checkbox" value="Db" id="J_sortDb" class="J_areaSort">东北</label></span>'+
													'<label class="beautify_check" for="J_210000"><input pid="210000" value="辽宁" type="checkbox" id="J_210000" class="J_areaItem">辽宁</label>'+
													'<label class="beautify_check" for="J_220000"><input pid="220000" value="吉林" type="checkbox" id="J_220000" class="J_areaItem">吉林</label>'+
													'<label class="beautify_check" for="J_230000"><input pid="230000" value="黑龙江" type="checkbox" id="J_230000" class="J_areaItem">黑龙江</label>'+
												'</li>'+
												'<li id="J_xn">'+
													'<span class="sort-area"><label class="beautify_check" for="J_sortXn"><input type="checkbox" value="Xn" id="J_sortXn" class="J_areaSort">西南</label></span>'+
													'<label class="beautify_check" for="J_500000"><input pid="500000" type="checkbox" value="重庆" id="J_500000" class="J_areaItem">重庆</label>'+
													'<label class="beautify_check" for="J_510000"><input pid="510000" type="checkbox" value="四川" id="J_510000" class="J_areaItem">四川</label>'+
													'<label class="beautify_check" for="J_520000"><input pid="520000" type="checkbox" value="贵州" id="J_520000" class="J_areaItem">贵州</label>'+
													'<label class="beautify_check" for="J_530000"><input pid="530000" type="checkbox" value="云南" id="J_530000" class="J_areaItem">云南</label>'+
												'</li>'+
												'<li id="J_xb">'+
													'<span class="sort-area"><label class="beautify_check" for="J_sortXb"><input type="checkbox" value="Xb" id="J_sortXb" class="J_areaSort">西北</label></span>'+
													'<label class="beautify_check" for="J_610000"><input pid="610000" type="checkbox" value="陕西" id="J_610000" class="J_areaItem">陕西</label>'+
													'<label class="beautify_check" for="J_620000"><input pid="620000" type="checkbox" value="甘肃" id="J_620000" class="J_areaItem">甘肃</label>'+
													'<label class="beautify_check" for="J_630000"><input pid="630000" type="checkbox" value="青海" id="J_630000" class="J_areaItem">青海</label>'+
													'<label class="beautify_check" for="J_640000"><input pid="640000" type="checkbox" value="宁夏" id="J_640000" class="J_areaItem">宁夏</label>'+
												'</li>'+
											'</ul>'+
										'</div>'+
										'<div class="pop-area-other">'+
											'<ul>'+
												'<li id="J_qt">'+
													'<span class="sort-area"><label class="beautify_check" for="J_sortQt"><input type="checkbox" value="Qt" id="J_sortQt" class="J_areaSort">其他</label></span>'+
													'<label class="beautify_check" for="J_540000"><input type="checkbox" pid="540000" value="西藏" id="J_540000" class="J_areaItem">西藏</label>'+
													'<label class="beautify_check" for="J_650000"><input type="checkbox" pid="650000" value="新疆" id="J_650000" class="J_areaItem">新疆</label>'+
													'<label class="beautify_check" for="J_810000"><input type="checkbox" pid="810000" value="香港" id="J_810000" class="J_areaItem">香港</label>'+
													'<label class="beautify_check" for="J_820000"><input type="checkbox" pid="820000" value="澳门" id="J_820000" class="J_areaItem">澳门</label>'+
													'<label class="beautify_check" for="J_710000"><input type="checkbox" pid="710000" value="台湾" id="J_710000" class="J_areaItem">台湾</label>'+
													'<label class="beautify_check" for="J_990000"><input type="checkbox" pid="990000" value="海外" id="J_990000" class="J_areaItem">海外</label>'+
												'</li>'+
											'</ul>'+
										'</div>'+
									'</div>';
						new Overlay.Dialog({
							title : '设置免邮地区',
							width : 480,
							height : 470,
							mask:true,
			 	            buttons:[
				                   {
				                     text:'确定',
				                     elCls : 'bui-button bui-button-primary',
				                     handler : function(){
				                	   	promotionControl.isChange = true;
				                	   	var areaInput = DOM.query('#J_areaList .J_areaItem');
				                	    var arr = [];
				                	    var ids = [];
				                	    var noArr = [];
				                	    var noIds = [];
				                	   	for(var i = 0; i < areaInput.length; i++){
				                	   		if(areaInput[i].checked == true){
				                	   			arr.push(areaInput[i].value);
				                	   			ids.push(DOM.attr(areaInput[i],'pid'));
				                	   		}else{
				                	   			noArr.push(areaInput[i].value);
				                	   			noIds.push(DOM.attr(areaInput[i],'pid'));
				                	   		}
				                	   	}   
				                	   	
				                	   	//保存不免邮地区,id
										DOM.val('#J_free_post_areasName'+pid,noArr.join(','));
										DOM.val('#J_free_post_areasId'+pid,noIds.join(','));
										//保存免邮地区,id
										DOM.val('#J_freeAreasName'+pid,arr.join(','));
										DOM.val('#J_freeAreasId'+pid,ids.join(','));
										
										promotionControl.tempSaveMjs()
										promotionControl.renderMjs();
				                	   	this.destroy();
				                     }
				                   },{
				                     text:'取消',
				                     elCls : 'bui-button J_buttonCancel',
				                     handler : function(){
				                       	this.destroy();
				                     }
				                   }
				                 ],
				                bodyContent:str
						}).show();
						
						promotionControl.x.renderAllCheckbox('#J_areaList');
						var areaArr = DOM.val('#J_freeAreasId'+pid);
						promotionControl.renderArea(areaArr);
					 })
					 
					 //上不封顶弹出说明
					 if(parentType == 'mjs'){
						 promotionControl.tooltip.set('title','<div class="ui-tip-text">当订单条件达到2倍以上时<br/><span class="color-red">减钱金额</span>和<span class="color-red">礼物件数</span>也等倍<br/>提供 （送彩票无效）</div>')
		        	 }

		        	 //送彩票弹出说明
		        	 if(parentType == 'mjscp'){
						 promotionControl.tooltip.set('title','<div class="ui-tip-text">买家的 “我的彩票  - 彩票详情“ 中显示</div>')
		        	  }

					 if(i > 0) promotionControl.miniMjs(i-1);
				}   
	        },
	        
	        //渲染设置地址弹窗
	        renderArea :function(arr){
	        	
		        //全选
				Event.on('#J_allArea','click',function(){
					var checkBoxs = DOM.query('#J_areaList input');
					for(var i = 0; i < checkBoxs.length; i++){
						promotionControl.x.setCheckboxOn(checkBoxs[i]);
					}
				})
				
				//反选
				Event.on('#J_theArea','click',function(){
					var checkBoxs = DOM.query('#J_areaList input');
					for(var i = 0; i < checkBoxs.length; i++){
						promotionControl.x.setCheckboxOff(checkBoxs[i]);
					}
				})
				
				//江浙沪
				Event.on('#J_hotArea','click',function(){
					var checkBoxs = DOM.query('#J_areaList input');
					for(var i = 0; i < checkBoxs.length; i++){
						promotionControl.x.setCheckboxOff(checkBoxs[i]);
					}
					promotionControl.x.setCheckboxOn('#J_310000');
					promotionControl.x.setCheckboxOn('#J_320000');
					promotionControl.x.setCheckboxOn('#J_330000');
				})
				 
				//华东
				Event.on('#J_sortHd','click',function(ev){
					promotionControl.checkAll('#J_hd','#J_sortHd');
				})
				Event.on(DOM.query('#J_hd .J_areaItem'),'click',function(ev){
	        		if(this.checked){
	        			var checkBoxs = DOM.query("#J_hd .J_areaItem");
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
							promotionControl.x.setCheckboxOn(DOM.get('#J_sortHd'));
	        			}
	        		}else{
	        			promotionControl.x.setCheckboxOff(DOM.get('#J_sortHd'));
	        		}
	        	})
	        	
	        	//华东
				Event.on('#J_sortHb','click',function(ev){
					promotionControl.checkAll('#J_hb','#J_sortHb');
				})
				Event.on(DOM.query('#J_hb .J_areaItem'),'click',function(ev){
	        		if(this.checked){
	        			var checkBoxs = DOM.query("#J_hb .J_areaItem");
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
							promotionControl.x.setCheckboxOn(DOM.get('#J_sortHb'));
	        			}
	        		}else{
	        			promotionControl.x.setCheckboxOff(DOM.get('#J_sortHb'));
	        		}
	        	})
	        	
	        	//华南
				Event.on('#J_sortHn','click',function(ev){
					promotionControl.checkAll('#J_hn','#J_sortHn');
				})
				Event.on(DOM.query('#J_hn .J_areaItem'),'click',function(ev){
	        		if(this.checked){
	        			var checkBoxs = DOM.query("#J_hn .J_areaItem");
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
							promotionControl.x.setCheckboxOn(DOM.get('#J_sortHn'));
	        			}
	        		}else{
	        			promotionControl.x.setCheckboxOff(DOM.get('#J_sortHn'));
	        		}
	        	})
	        	
	        	//华中
				Event.on('#J_sortHz','click',function(ev){
					promotionControl.checkAll('#J_hz','#J_sortHz');
				})
				Event.on(DOM.query('#J_hz .J_areaItem'),'click',function(ev){
	        		if(this.checked){
	        			var checkBoxs = DOM.query("#J_hz .J_areaItem");
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
							promotionControl.x.setCheckboxOn(DOM.get('#J_sortHz'));
	        			}
	        		}else{
	        			promotionControl.x.setCheckboxOff(DOM.get('#J_sortHz'));
	        		}
	        	})
	        				        	
	        	//东北
				Event.on('#J_sortDb','click',function(ev){
					promotionControl.checkAll('#J_db','#J_sortDb');
				})
				Event.on(DOM.query('#J_db .J_areaItem'),'click',function(ev){
	        		if(this.checked){
	        			var checkBoxs = DOM.query("#J_db .J_areaItem");
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
							promotionControl.x.setCheckboxOn(DOM.get('#J_sortDb'));
	        			}
	        		}else{
	        			promotionControl.x.setCheckboxOff(DOM.get('#J_sortDb'));
	        		}
	        	})
	        	
	        	//西南
				Event.on('#J_sortXn','click',function(ev){
					promotionControl.checkAll('#J_xn','#J_sortXn');
				})
				Event.on(DOM.query('#J_xn .J_areaItem'),'click',function(ev){
	        		if(this.checked){
	        			var checkBoxs = DOM.query("#J_xn .J_areaItem");
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
							promotionControl.x.setCheckboxOn(DOM.get('#J_sortXn'));
	        			}
	        		}else{
	        			promotionControl.x.setCheckboxOff(DOM.get('#J_sortXn'));
	        		}
	        	})
	        	
	        	//西北
				Event.on('#J_sortXb','click',function(ev){
					promotionControl.checkAll('#J_xb','#J_sortXb');
				})
				Event.on(DOM.query('#J_xb .J_areaItem'),'click',function(ev){
	        		if(this.checked){
	        			var checkBoxs = DOM.query("#J_xb .J_areaItem");
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
							promotionControl.x.setCheckboxOn(DOM.get('#J_sortXb'));
	        			}
	        		}else{
	        			promotionControl.x.setCheckboxOff(DOM.get('#J_sortXb'));
	        		}
	        	})
	        	
	        	//其他
				Event.on('#J_sortQt','click',function(ev){
					promotionControl.checkAll('#J_qt','#J_sortQt');
				})
				Event.on(DOM.query('#J_qt .J_areaItem'),'click',function(ev){
	        		if(this.checked){
	        			var checkBoxs = DOM.query("#J_qt .J_areaItem");
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
							promotionControl.x.setCheckboxOn(DOM.get('#J_sortQt'));
	        			}
	        		}else{
	        			promotionControl.x.setCheckboxOff(DOM.get('#J_sortQt'));
	        		}
	        	})
	        	
	        	//编辑时渲染已选择
	        	var str = arr.split(',');
		        var hdArr = ['310000','320000','330000','350000','340000','360000'];
		        var hbArr = ['110000','120000','130000','370000','140000','150000'];
		        var hnArr = ['440000','450000','460000'];
		        var hzArr = ['410000','420000','430000'];
		        var dbArr = ['210000','220000','230000'];
		        var xnArr = ['500000','510000','520000','530000'];
		        var xbArr = ['610000','620000','630000','640000'];
		        var qtArr = ['540000','650000','810000','820000','710000','990000'];
		        var hdArrY = [],hbArrY = [],hnArrY = [],hzArrY = [],dbArrY = [],xnArrY = [],xbArrY = [],qtArrY = [];
	        	for(var i = 0; i < str.length; i++){
	        		if(str != ''){
	        			promotionControl.x.setCheckboxOn('#J_'+str[i]);
	        		}
	        		for(var j = 0; j < hdArr.length; j++){
	        			if(hdArr[j] == str[i]){
	        				hdArrY.push(hdArr[j]);
	 	        		}
	        		}
	        		for(var j = 0; j < hbArr.length; j++){
	        			if(hbArr[j] == str[i]){
	        				hbArrY.push(hbArr[j]);
	 	        		}
	        		}
	        		for(var j = 0; j < hnArr.length; j++){
	        			if(hnArr[j] == str[i]){
	        				hnArrY.push(hnArr[j]);
	 	        		}
	        		}
	        		for(var j = 0; j < hzArr.length; j++){
	        			if(hzArr[j] == str[i]){
	        				hzArrY.push(hzArr[j]);
	 	        		}
	        		}
	        		for(var j = 0; j < dbArr.length; j++){
	        			if(dbArr[j] == str[i]){
	        				dbArrY.push(dbArr[j]);
	 	        		}
	        		}
	        		for(var j = 0; j < xnArr.length; j++){
	        			if(xnArr[j] == str[i]){
	        				xnArrY.push(xnArr[j]);
	 	        		}
	        		}
	        		for(var j = 0; j < xbArr.length; j++){
	        			if(xbArr[j] == str[i]){
	        				xbArrY.push(xbArr[j]);
	 	        		}
	        		}
	        		for(var j = 0; j < qtArr.length; j++){
	        			if(qtArr[j] == str[i]){
	        				qtArrY.push(qtArr[j]);
	 	        		}
	        		}
	        	}
				if(hdArrY.length == hdArr.length){
					promotionControl.x.setCheckboxOn('#J_sortHd');
				}
				if(hbArrY.length == hbArr.length){
					promotionControl.x.setCheckboxOn('#J_sortHb');
				}
				if(hnArrY.length == hnArr.length){
					promotionControl.x.setCheckboxOn('#J_sortHn');
				}
				if(hzArrY.length == hzArr.length){
					promotionControl.x.setCheckboxOn('#J_sortHz');
				}
				if(dbArrY.length == dbArr.length){
					promotionControl.x.setCheckboxOn('#J_sortDb');
				}
				if(xnArrY.length == xnArr.length){
					promotionControl.x.setCheckboxOn('#J_sortXn');
				}
				if(xbArrY.length == xbArr.length){
					promotionControl.x.setCheckboxOn('#J_sortXb');
				}
				if(qtArrY.length == qtArr.length){
					promotionControl.x.setCheckboxOn('#J_sortQt');
				}
	        },
	        
	        //地址勾选
	        checkAll : function(id,checkedId) {
				var checkBoxs = DOM.query('.J_areaItem',id);				
				var len = checkBoxs.length;
				for(i=0; i<len; i++){
					var iid = checkBoxs[i].value;
					if(checkBoxs[i].disabled) continue;
					if(DOM.get(checkedId).checked == true){
						promotionControl.x.setCheckboxOn(checkBoxs[i]);
					} else {
						promotionControl.x.setCheckboxOff(checkBoxs[i]);
					}
				}
			},
	        
	        //满就送新增层级
	        addMjs : function(){
				promotionControl.isChange = true;
				promotionControl.tempSaveMjs();
	        	var items = promotionControl.mjsData;
	        	if(items.length > 6){
	        		new H.widget.msgBox({
					    title:"温馨提示",
					    content:'满就送最多支持7个层级',
					    type:"error",
						autoClose : true,
						timeOut : 3000
					})
					return ;
				}
	        	promotionControl.msg = null;
	        	for(i=0;i<items.length;i++){
	        		var flag = promotionControl.checkRule(i,i);
					if(flag == true){
						return ;
					}
	        	}
	        	
	        	if(DOM.get('#J_mjsYuan').checked == true){
	        		var item = {"con_value":"","type":"1","discount_rate":"","discount_money":"","gift_name":"","gift_url":"","gift_pic":"","gift_id":"","enable_multiple":"","send_gift":"0","discount":"1","decrease":"0","free_postage":"0","is_sendLottery":"0","stake_count":"1","lottery_type_id":"1","sweety_words":"小店送您彩票啦，祝亲中奖！","free_post_areasName":"西藏,新疆,香港,澳门,台湾,海外","free_post_areasId":"540000,650000,810000,820000,710000,990000","freeAreasName":"上海,江苏,浙江,福建,安徽,江西,北京,天津,河北,山东,山西,内蒙古,广东,广西,海南,河南,湖北,湖南,吉林,吉林,黑龙江,重庆,四川,贵州,云南,陕西,甘肃,青海,宁夏","freeAreasId":"310000,320000,330000,350000,340000,360000,110000,120000,130000,370000,140000,150000,440000,450000,460000,410000,420000,430000,210000,220000,230000,500000,510000,520000,530000,610000,620000,630000,640000"};
	        	}else{
	        		var item = {"con_value":"","type":"0","discount_rate":"","discount_money":"","gift_name":"","gift_url":"","gift_pic":"","gift_id":"","enable_multiple":"","send_gift":"0","discount":"1","decrease":"0","free_postage":"0","is_sendLottery":"0","stake_count":"1","lottery_type_id":"1","sweety_words":"小店送您彩票啦，祝亲中奖！","free_post_areasName":"西藏,新疆,香港,澳门,台湾,海外","free_post_areasId":"540000,650000,810000,820000,710000,990000","freeAreasName":"上海,江苏,浙江,福建,安徽,江西,北京,天津,河北,山东,山西,内蒙古,广东,广西,海南,河南,湖北,湖南,吉林,吉林,黑龙江,重庆,四川,贵州,云南,陕西,甘肃,青海,宁夏","freeAreasId":"310000,320000,330000,350000,340000,360000,110000,120000,130000,370000,140000,150000,440000,450000,460000,410000,420000,430000,210000,220000,230000,500000,510000,520000,530000,610000,620000,630000,640000"};
	        	}
	        	promotionControl.mjsData.push(item);
	        	promotionControl.renderMjs();
	        },
	        
	        //满就送删除层级
	        deleMjs : function(num){
	        	promotionControl.isChange = true;
	        	promotionControl.tempSaveMjs();
				promotionControl.mjsData.splice(num,1);
	        	promotionControl.renderMjs();
			},
			
			//满就送放大层级
			maxiMjs : function(num){
				var contentBox = KISSY.one('#J_Content_Detail_'+num);
				var miniBox = KISSY.one('#J_Mini_Detail_'+num);
				DOM.show(DOM.get('.tier-stop','#J_tierItem'+num));
				DOM.hide(DOM.get('.tier-an','#J_tierItem'+num));		
				if (contentBox.css("display")==="none") {
					miniBox.slideUp(0.1)
					contentBox.slideDown(0.7);
				}
			},
			
			//满就送缩小层级
			miniMjs : function(num){
				var contentBox = KISSY.one('#J_Content_Detail_'+num);
				var miniBox = KISSY.one('#J_Mini_Detail_'+num);
				DOM.hide(DOM.get('.tier-stop','#J_tierItem'+num));
				DOM.show(DOM.get('.tier-an','#J_tierItem'+num));
				
				if(DOM.get('#J_mjsYuan').checked == true){
					var type = '元';
				}else{
					var type = '件';
				}
				var num = num,
				con_value = DOM.val('#J_conValue'+num) || 0 ,
				freeAreasName = DOM.text('#J_mailRegion'+num),	
				IsFreePost = DOM.get('#J_isSetArea'+num).checked
				
				if(parentType == 'mjs'){
					var decrease_money = DOM.val('#J_decreaseMoney'+num) || 0 ,
					discount_rate = DOM.val('#J_discountRate'+num) || 0 ,
					gift_name = DOM.val('#J_giftName'+num),
					gift_url = DOM.val('#J_giftUrl'+num),
					gift_pic = DOM.val('#J_giftPic'+num),
					enable_multiple = DOM.get('#J_enableMultiple_'+num).checked,
					discount = DOM.get('#J_isDiscount'+num).checked, 
					IsDecrease = DOM.get('#J_isDiscountMoney'+num).checked, 
					IsSend_gift = DOM.get('#J_isSendGift'+num).checked,
					is_sendLottery = false,
					lottery_type_id = 0,
					stake_count = 0,
					sweety_words = '';
				}else if(parentType == 'mjscp'){
					var decrease_money = DOM.val('#J_decreaseMoney'+num) || 0,
					IsDecrease = DOM.get('#J_isDiscountMoney'+num).checked, 
					is_sendLottery = DOM.get('#J_isSendLottery'+num).checked, 
					stake_count = DOM.val('#J_stakeCount'+num) || 1,
					sweety_words = DOM.val('#J_Content'+num) || '小店送您彩票啦，祝亲中奖！',
					lottery_type_id = Number(DOM.val('#J_lotteryTypeId'+num)) || Number(1),
					discount_rate = 0,
					discount = false, 
					gift_name = '',
					gift_url = '',
					gift_pic = '',
					enable_multiple = false,
					IsSend_gift = false;
				}else{
					var decrease_money = '',
					discount_rate = '',
					gift_name = '',
					gift_url = '',
					gift_pic = '',
					enable_multiple = false,
					discount = false, 
					IsDecrease = false, 
					IsSend_gift = false,
					is_sendLottery = false,
					lottery_type_id = 0,
					stake_count = 0,
					sweety_words = '';
				}
				
				var itemData = {num:num,type:type,con_value:con_value,decrease_money:decrease_money,discount_rate:discount_rate,gift_name:gift_name,gift_url:gift_url,enable_multiple:enable_multiple,enable_multiple:enable_multiple,discount:discount,IsDecrease:IsDecrease,IsFreePost:IsFreePost,IsSend_gift:IsSend_gift,is_sendLottery:is_sendLottery,lottery_type_id:lottery_type_id,stake_count:stake_count,sweety_words:sweety_words,freeAreasName:freeAreasName};
				if((con_value == 0 && discount == false && IsDecrease == false && IsFreePost == false && IsSend_gift == false && is_sendLottery == false) || (discount == false && IsDecrease == false && IsFreePost == false && IsSend_gift == false && is_sendLottery == false)){
					var els ='<span style="color:#F00">未设置优惠内容&nbsp;&nbsp;&nbsp;<a onclick="promotionControl.maxiMjs('+num+');" >[重新编辑]</a></span>';
				}else{
					var templet = DOM.html(DOM.get('#J_Templet_Mjs'));
			        var data = { data: itemData };
			        var els = new XTemplate(templet).render(itemData);
				}
				miniBox.html(els);
				if (contentBox.css("display")!="none") {
					miniBox.slideDown(0.7)
					contentBox.slideUp(0.3);
				}
			},
	        
	        //满就送保存参数
	        tempSaveMjs : function(){
	        	promotionControl.mjsData = [];
				var lis = DOM.children('#J_privilegeTier');
				var mjsType =  0;
				if(DOM.get('#J_mjsYuan').checked == true){
					mjsType = 1;
				}
				KISSY.each(lis,function(currentLi,index){
					var item ={};
					item.type = mjsType;
					item.con_value = DOM.val(DOM.get('.J_conValue',currentLi)); 
					item.free_post_areasName = DOM.val(DOM.get('.J_free_post_areasName',currentLi));
					item.free_post_areasId = DOM.val(DOM.get('.J_free_post_areasId',currentLi));
					item.freeAreasName = DOM.val(DOM.get('.J_freeAreasName',currentLi));
					item.freeAreasId = DOM.val(DOM.get('.J_freeAreasId',currentLi));
					if(DOM.get('#J_isSetArea'+index).checked == true){
						item.free_postage = 1;
					}else{
						item.free_postage = 0;
					}
					
					if(parentType == 'mjs'){
						item.discount_rate = DOM.val(DOM.get('.J_discountRate',currentLi));
						item.discount_money = DOM.val(DOM.get('.J_decreaseMoney',currentLi));
						item.gift_name = DOM.val(DOM.get('.J_giftName',currentLi));
						item.gift_url = DOM.val(DOM.get('.J_giftUrl',currentLi));
						item.gift_pic = DOM.val(DOM.get('.J_giftPic',currentLi));
						item.gift_id = DOM.val(DOM.get('.J_giftId',currentLi));
						if(DOM.get('#J_enableMultiple_'+index).checked == true){
							item.enable_multiple = 1;
						}else{
							item.enable_multiple = 0;
						}
						if(DOM.get('#J_isSendGift'+index).checked == true){
							item.send_gift = 1;
						}else{
							item.send_gift = 0;
						}
						if(DOM.get('#J_isDiscount'+index).checked == true){
							item.discount = 1;
						}else{
							item.discount = 0;
						}
						if(DOM.get('#J_isDiscountMoney'+index).checked == true){
							item.decrease = 1;
						}else{
							item.decrease = 0;
						}
						item.is_sendLottery = 0;
					}else if(parentType == 'mjscp'){
						item.discount_money = DOM.val(DOM.get('.J_decreaseMoney',currentLi));
						if(DOM.get('#J_isDiscountMoney'+index).checked == true){
							item.decrease = 1;
						}else{
							item.decrease = 0;
						}
						if(DOM.get('#J_isSendLottery'+index).checked == true){
							item.is_sendLottery = 1;
						}else{
							item.is_sendLottery = 0;
						}
						item.stake_count = DOM.val(DOM.get('.J_stakeCount',currentLi));
						item.sweety_words = DOM.val(DOM.get('.J_Content',currentLi));
						item.lottery_type_id = Number(DOM.val(DOM.get('.J_lotteryTypeId',currentLi)));
						item.discount = 0;
						item.discount_rate = 0;
						item.gift_name = '';
						item.gift_url = '';
						item.gift_pic = '';
						item.gift_id = '';
						item.enable_multiple = 0;
						item.send_gift = 0;
					}else{
						item.discount_rate = 0;
						item.discount_money = 0;
						item.gift_name = '';
						item.gift_url = '';
						item.gift_pic = '';
						item.gift_id = '';
						item.enable_multiple = 0;
						item.send_gift = 0;
						item.discount = 0;
						item.decrease = 0;
						item.is_sendLottery = 0;
					}
					promotionControl.mjsData.push(item);
				})
	        },
	        
	        //禁止输入中文，数值判断
	        clearNoNum : function(obj){
		        //先把非数字的都替换掉，除了数字和.
		        obj.value = obj.value.replace(/[^\d.]/g,"");
		        //必须保证第一个为数字而不是.
		        obj.value = obj.value.replace(/^\./g,"");
		        //保证只有出现一个.而没有多个.
		        obj.value = obj.value.replace(/\.{2,}/g,".");
		        //保证.只出现一次，而不能出现两次以上
		        obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
	        },
	        
	        //促销展示写入控制
	        setPreviewDesc : function(id,val,parentId){
	        	DOM.text(id,val);
	        	if(parentId){
	        		if(val != ''){
		        		DOM.show(parentId);
		        	}else{
		        		DOM.hide(parentId);
		        	}
	        	}
	        },
	        
	        //满就送层级有填写时自动勾选
	        autoCheck : function(val,id){
	        	if(val != ''){
	        		promotionControl.x.setCheckboxOn('#'+id);
	        	}else{
	        		promotionControl.x.setCheckboxOff('#'+id);
	        	}
	        },
	        
	        //搜索店铺宝贝
	        searchPromoItems : function() {
	            var submitHandle = function(o) {
	            	DOM.hide('#J_LeftLoading');
					DOM.show('#J_MainLeftContent');
	        	    totalRecords = o.payload.totalRecords;
					if(totalRecords > 0){
						DOM.get('#J_LEmpty').style.display = 'none';
					} else {
						DOM.get('#J_LEmpty').style.display = '';
					}
					DOM.html('#J_PromoItems',o.payload.body);
					pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
					promotionControl.paginator = new showPages('promotionControl.paginator').setRender(promotionControl.handlePagination).setPageCount(pageCount).printHtml('#J_PromotionItemPaging',2);
					
					var chooseType = DOM.val('#J_SelectItemType');
					if(chooseType == 'radio'){
						var itemType = DOM.val('#J_joinItemType');
						if(itemType == 'join'){
							var items = promotionControl.mjspartAttend;
						}else{
							var items = promotionControl.mjspartNothing;
						}
						DOM.text('.J_removeBtn','选择该宝贝');
						DOM.text('.J_cancelBtn','取消该宝贝');
						for(i = 0; i < items.length; i++){
							DOM.show('#J_cancelBtn'+items[i].id);
							DOM.hide('#J_removeBtn'+items[i].id);
							DOM.addClass('#J_listItem'+items[i].id,'choose');
						}
					}else{
						var items = promotionControl.mjsRemove;
						for(i = 0; i < items.length; i++){
							DOM.show('#J_cancelBtn'+items[i].id);
							DOM.hide('#J_removeBtn'+items[i].id);
							DOM.addClass('#J_listItem'+items[i].id,'choose');
						}
					}	
					
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
	    	    var start_price = DOM.val('#J_startPrice');
	    	    var end_price = DOM.val('#J_endPrice');
	    	    var cid = DOM.val('#J_SelectItemCid');
	    	    if(DOM.val(DOM.get("#J_SearchTitle")) != '关键字、链接、商品编码'){
	    	    	var q = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle")));
	    	    }else{
	    	    	var q ='';
	    	    }
	    	    var data = "&start_price="+start_price+"&end_price="+end_price+"&cid="+cid+"&q="+q+"&pageSize="+5;
				DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainLeftContent');
	    	    new H.widget.asyncRequest().setURI(loadItemFromTbUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).setDataType('json').send();
			},
	    	handlePagination : function(turnTo) {
		    	pageId = turnTo;
	    		var submitHandle = function(o) {
	    			totalRecords = o.payload.totalRecords;
	   				if(totalRecords > 0){
	   					DOM.get('#J_LEmpty').style.display = 'none';
	   				} else {
	   					DOM.get('#J_LEmpty').style.display = '';
	   				}
					pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
					DOM.html('#J_PromoItems',o.payload.body);
					promotionControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_PromotionItemPaging',2);
					DOM.hide('#J_LeftLoading');
					DOM.show('#J_MainLeftContent');
					
					var chooseType = DOM.val('#J_SelectItemType');
					if(chooseType == 'radio'){
						var itemType = DOM.val('#J_joinItemType');
						if(itemType == 'join'){
							var items = promotionControl.mjspartAttend;
						}else{
							var items = promotionControl.mjspartNothing;
						}
						DOM.text('.J_removeBtn','选择该宝贝');
						DOM.text('.J_cancelBtn','取消该宝贝');
						for(i = 0; i < items.length; i++){
							DOM.show('#J_cancelBtn'+items[i].id);
							DOM.hide('#J_removeBtn'+items[i].id);
							DOM.addClass('#J_listItem'+items[i].id,'choose');
						}
					}else{
						var items = promotionControl.mjsRemove;
						for(i = 0; i < items.length; i++){
							DOM.show('#J_cancelBtn'+items[i].id);
							DOM.hide('#J_removeBtn'+items[i].id);
							DOM.addClass('#J_listItem'+items[i].id,'choose');
						}
					}
//					if(parentType == 'mjspartjtj'){
//						var itemType = DOM.val('#J_joinItemType');
//						if(itemType == 'join'){
//							var items = promotionControl.mjspartAttend;
//						}else{
//							var items = promotionControl.mjspartNothing;
//						}
//						DOM.text('.J_removeBtn','添加该宝贝');
//						DOM.text('.J_cancelBtn','取消添加');
//						for(i = 0; i < items.length; i++){
//							DOM.show('#J_cancelBtn'+items[i].id);
//							DOM.hide('#J_removeBtn'+items[i].id);
//							DOM.addClass('#J_listItem'+items[i].id,'choose');
//						}
//					}	
		    	};
		    	var start_price = DOM.val('#J_startPrice');
	    	    var end_price = DOM.val('#J_endPrice');
	    	    var cid = DOM.val('#J_SelectItemCid');
	    	    if(DOM.val(DOM.get("#J_SearchTitle")) != '关键字、链接、商品编码'){
	    	    	var q = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle")));
	    	    }else{
	    	    	var q ='';
	    	    }
		    	var data = "&start_price="+start_price+"&end_price="+end_price+"&cid="+cid+"&q="+q+"&page_id="+pageId+"&pageSize="+5;
		        DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainLeftContent');
	    	    new H.widget.asyncRequest().setURI(loadItemFromTbUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			},
			
			//满就送选择礼物
			addGiftItem :function(pid,i){
				promotionControl.isChange = true;
	        	var title = H.util.strProcess(DOM.val(DOM.get('#J_ItemTitle_'+pid)));
				var picUrl = DOM.val(DOM.get('#J_ItemPic_'+pid));
				DOM.val('#J_giftName'+i,title);
				DOM.val('#J_giftUrl'+i,'http://item.taobao.com/item.htm?id='+pid);
				DOM.val('#J_giftPic'+i,picUrl+'_30x30.jpg');
				DOM.val('#J_giftId'+i,pid);
				
				DOM.attr('#J_giftImgUrl'+i,{href:'http://item.taobao.com/item.htm?id='+pid,title:title});
				DOM.attr('#J_giftImg'+i,{src:picUrl+'_30x30.jpg'});
				DOM.hide('#J_addGift'+i);
	        	DOM.show('#J_againGift'+i);
	        	DOM.show('#J_giftImgUrl'+i);
	        	//写入模板
	        	DOM.text('#J_giftLinkText'+i,title);
	        	DOM.attr('#J_giftLinkText'+i,{href:'http://item.taobao.com/item.htm?id='+pid});
	        	Event.fire('.bui-ext-close','click');
			},
			
			//选择排除的宝贝
			addRemoveItem :function(pid){
				promotionControl.isChange = true;
				var items = promotionControl.mjsRemove;
	        	var id = pid;
	        	var title = H.util.strProcess(DOM.val(DOM.get('#J_ItemTitle_'+pid)));
	        	var price = DOM.val(DOM.get('#J_ItemPrice_'+pid));
				var picUrl = DOM.val(DOM.get('#J_ItemPic_'+pid));
				var outId = H.util.strProcess(DOM.val(DOM.get('#J_ItemOuterId_'+pid)));
				o = '{"id":"' + id + '", "outer_id":"' + outId + '", "title":"' + title + '", "price":"' + price + '", "pic_url":"' + picUrl +'"}';
				o = eval('(' + o + ')');
	        	promotionControl.mjsRemove.push(o);
	        	DOM.hide('#J_removeBtn'+pid);
	        	DOM.show('#J_cancelBtn'+pid);

	        	//活动类型切换
				if(items.length > 0){
					if(parentType == 'mjs'){
						DOM.val('#J_TypeId',117);
					}else if(parentType == 'freepost'){
						DOM.val('#J_TypeId',115);
					}else if(parentType == 'mjscp'){
						DOM.val('#J_TypeId',217);
					}
					DOM.hide('#J_PromoDescTempletBox');
					DOM.val('#J_RangeTypeValue','PART_NOT');
	          	}
			},
			
			//取消已选择排除的宝贝
			cancelRemoveItem :function(pid){
				promotionControl.isChange = true;
				var items = promotionControl.mjsRemove;
				for(var i=0 ,len = items.length; i<len; i++) {
					if (items[i].id == pid) {
						promotionControl.mjsRemove.splice(i,1);
						break;
					}
				}
				promotionControl.renderRemoveItem();
	        	DOM.show('#J_removeBtn'+pid);
	        	DOM.hide('#J_cancelBtn'+pid);
	        	
	        	//活动类型切换
				if(items.length == 0){
					if(parentType == 'mjs'){
						DOM.val('#J_TypeId',107);
					}else if(parentType == 'freepost'){
						DOM.val('#J_TypeId',105);
					}else if(parentType == 'mjscp'){
						DOM.val('#J_TypeId',207);
					}
					DOM.show('#J_PromoDescTempletBox');
					DOM.val('#J_RangeTypeValue','ALL');
	          	}
			},
			
			//满就送排除页面宝贝模板渲染
			renderRemoveItem :function(){
				var items = promotionControl.mjsRemove;
				var templet = DOM.html(DOM.get('#J_remove_Mjs'));
		        var data = { data: items };
		        var els = new XTemplate(templet).render(data);
		        DOM.html(DOM.get('#J_itemListUl'),els);
		        
		        //排除宝贝hover 显示删除按钮
				Event.on(DOM.children('#J_itemListUl'),'mouseenter mouseleave',function(ev){
   	        	  	if(ev.type == 'mouseenter'){
   	        	  		DOM.addClass(ev.currentTarget,'current');
   	        	  	}else{
   	        	  		DOM.removeClass(ev.currentTarget,'current');
   	        	  	}
   	          	})
   	          	
   	          	if(items.length >　4){
	          		DOM.text('#J_MoreNum',items.length);
	          		DOM.show('#J_hasMore');
	          	}else{
	          		DOM.hide('#J_hasMore');
	          	}
				if(items.length >　0){
	          		DOM.show('#J_removeItemList');
	          	}else{
	          		DOM.hide('#J_removeItemList');
	          	}
   	          	
   	          	//活动类型切换
				if(items.length == 0){
					if(parentType == 'mjs'){
						DOM.val('#J_TypeId',107);
					}else if(parentType == 'freepost'){
						DOM.val('#J_TypeId',105);
					}else if(parentType == 'mjscp'){
						DOM.val('#J_TypeId',207);
					}
					DOM.show('#J_PromoDescTempletBox');
					DOM.val('#J_RangeTypeValue','ALL');
	          	}
			},
			
			//满就送查看全部已排除宝贝
			renderMoreItem :function(){
				var items = promotionControl.mjsRemove;
				var templet = DOM.html(DOM.get('#J_removeMore_Mjs'));
		        var data = { data: items };
		        var els = new XTemplate(templet).render(data);
		        DOM.html(DOM.get('#J_moreItemListUl'),els);
		    },
			
		    //编辑宝贝时取消已排除宝贝
			editRemoveItem :function(pid){
		    	promotionControl.isChange = true;
		    	var items = promotionControl.editMjsRemove;
	        	var id = pid;
	        	var title = H.util.strProcess(DOM.val(DOM.get('#J_ItemTitle_'+pid)));
	        	var price = DOM.val(DOM.get('#J_ItemPrice_'+pid));
				var picUrl = DOM.val(DOM.get('#J_ItemPic_'+pid));
				var outId = H.util.strProcess(DOM.val(DOM.get('#J_ItemOuterId_'+pid)));
				o = '{"id":"' + id + '", "outer_id":"' + outId + '", "title":"' + title + '", "price":"' + price + '", "pic_url":"' + picUrl +'"}';
				o = eval('(' + o + ')');
	        	promotionControl.editMjsRemove.push(o);
	        	DOM.hide('#J_editCancelBtn'+pid);
	        	DOM.show('#J_editUndoBtn'+pid);
			},
			
			//编辑已排除宝贝时撤销
			editCancelItem :function(pid){
				var items = promotionControl.editMjsRemove;
				for(var i=0 ,len = items.length; i<len; i++) {
					if (items[i].id == pid) {
						promotionControl.editMjsRemove.splice(i,1);
						break;
					}
				}
				DOM.show('#J_editCancelBtn'+pid);
	        	DOM.hide('#J_editUndoBtn'+pid);
			},
			
			//第N件优惠选择参与宝贝
			addMjspartAttend :function(pid){
				promotionControl.isChange = true;
				var items = promotionControl.mjspartAttend;
				for(var i=0 ,len = items.length; i<len; i++) {
					promotionControl.mjspartAttend.splice(i,1);
				}
				var itemType = DOM.val('#J_joinItemType');
	        	var id = pid;
	        	var title = H.util.strProcess(DOM.val(DOM.get('#J_ItemTitle_'+pid)));
	        	var price = DOM.val(DOM.get('#J_ItemPrice_'+pid));
				var picUrl = DOM.val(DOM.get('#J_ItemPic_'+pid));
				var outId = H.util.strProcess(DOM.val(DOM.get('#J_ItemOuterId_'+pid)));
				o = '{"id":"' + id + '", "outer_id":"' + outId + '", "title":"' + title + '", "price":"' + price + '", "pic_url":"' + picUrl +'"}';
				o = eval('(' + o + ')');
				if(itemType == 'join'){
					DOM.val('#J_joinItemPrice',o.price);
					DOM.val('.J_conPrice',o.price);
					promotionControl.mjspartAttend.push(o);
				}
				DOM.show('.J_removeBtn');
				DOM.hide('.J_cancelBtn');
	        	DOM.hide('#J_removeBtn'+pid);
	        	DOM.show('#J_cancelBtn'+pid);
			},
			
			//第N件优惠取消已选择
			cancelMjspartAttend :function(pid){
				promotionControl.isChange = true;
				var itemType = DOM.val('#J_joinItemType');
				var items = promotionControl.mjspartAttend;
				for(var i=0 ,len = items.length; i<len; i++) {
					if (items[i].id == pid) {
						promotionControl.mjspartAttend.splice(i,1);
						break;
					}
				}
				promotionControl.renderMjspartAttend();
	        	DOM.show('#J_removeBtn'+pid);
	        	DOM.hide('#J_cancelBtn'+pid);
	        	if(itemType == 'join'){
	        		DOM.val('#J_joinItemPrice',0);
				}
			},
			
			//第N件优惠选择宝贝模板渲染
			renderMjspartAttend :function(){
				var items = promotionControl.mjspartAttend;
				var templet = DOM.html(DOM.get('#J_attendItem'));
		        var data = { data: items };
		        var els = new XTemplate(templet).render(data);
		        DOM.html(DOM.get('#J_joinitemList'),els);
		        if(items.length > 0){
					DOM.hide('#J_chooseJoinItem');
					DOM.show('#J_againJoinItem');
					Event.fire('.bui-ext-close','click');
				}else{
					DOM.show('#J_chooseJoinItem');
					DOM.hide('#J_againJoinItem');
				}
			},

			//第N件优惠选择无关宝贝
			addMjspartNothing :function(pid){
				promotionControl.isChange = true;
				var items = promotionControl.mjspartNothing;
				for(var i=0 ,len = items.length; i<len; i++) {
					promotionControl.mjspartNothing.splice(i,1);
				}
	        	var id = pid;
	        	var title = H.util.strProcess(DOM.val(DOM.get('#J_ItemTitle_'+pid)));
	        	var price = DOM.val(DOM.get('#J_ItemPrice_'+pid));
				var picUrl = DOM.val(DOM.get('#J_ItemPic_'+pid));
				var outId = H.util.strProcess(DOM.val(DOM.get('#J_ItemOuterId_'+pid)));
				o = '{"id":"' + id + '", "outer_id":"' + outId + '", "title":"' + title + '", "price":"' + price + '", "pic_url":"' + picUrl +'"}';
				o = eval('(' + o + ')');
				promotionControl.mjspartNothing.push(o);
				DOM.show('.J_removeBtn');
				DOM.hide('.J_cancelBtn');
	        	DOM.hide('#J_removeBtn'+pid);
	        	DOM.show('#J_cancelBtn'+pid);
			},
			
			//第N件优惠取消无关宝贝
			cancelMjspartNothing :function(pid){
				promotionControl.isChange = true;
				var items = promotionControl.mjspartNothing;
				for(var i=0 ,len = items.length; i<len; i++) {
					if (items[i].id == pid) {
						promotionControl.mjspartNothing.splice(i,1);
						break;
					}
				}
				promotionControl.renderMjspartAttend();
	        	DOM.show('#J_removeBtn'+pid);
	        	DOM.hide('#J_cancelBtn'+pid);
			},
			
			//第N件优惠无关宝贝模板渲染
			renderMjspartNothing :function(){
				var items = promotionControl.mjspartNothing;
				var templet = DOM.html(DOM.get('#J_attendItem'));
		        var data = { data: items };
		        var els = new XTemplate(templet).render(data);
		        DOM.html(DOM.get('#J_irrelevanItemList'),els); 
		        if(items.length > 0){
					DOM.hide('#J_chooseNothingItem');
					DOM.hide('#J_promoTipN');
					DOM.show('#J_promoRemind');
					DOM.show('#J_againNothingItem');
					Event.fire('.bui-ext-close','click');
				}else{
					DOM.show('#J_chooseNothingItem');
					DOM.show('#J_promoTipN');
					DOM.hide('#J_promoRemind');
					DOM.hide('#J_againNothingItem');
				}
			},
			
			/*满就送错误查看*/
			checkAction : function(num){
				for(var m = 0; m < promotionControl.mjsData.length; m++){
					if(num == m){
						promotionControl.maxiMjs(num);
					}else{
						promotionControl.miniMjs(m);
					}
				}
				var $ = KISSY.Node.all;
				if(KISSY.one('#J_tierItem'+num)){
					var s =  KISSY.one('#J_tierItem'+num).offset();
					$(window).stop();
					$(window).animate({
						scrollTop:s.top
					},1,"easeOut");
				}
			},
			
			/*满就送参数验证*/
			checkRule :function(num ,n){
				var ParamsErrorBox1 = KISSY.one('#J_ParamsErrorBox1');
				var error = false;
				var con_value = DOM.val('#J_conValue'+num);
				var result = checkUtil.isNull(con_value);
				var error = result[0];
				if(error){
					if(promotionControl.msg){
						promotionControl.msg.hide();
					}
					DOM.html('#J_ParamsErrorMsg1',result[1]+'<a href="javascript:promotionControl.checkAction('+num+')">点此修改</a>');
					if (ParamsErrorBox1.css("display")==="none") {
						ParamsErrorBox1.slideDown();
					}
					DOM.val('#J_conValue'+num, '');
					DOM.addClass(DOM.get('#J_conValue'+num), 'text-error');
					return  error = true;
				}else{
					DOM.hide(ParamsErrorBox1);
					DOM.removeClass(DOM.get('#J_conValue'+num), 'text-error');
				}
				result = itemHandle.checkPrice(con_value);
				error = result[0];
				msg = result[1];
				if(error){
					if(promotionControl.msg){
						promotionControl.msg.hide();
					}
					DOM.html('#J_ParamsErrorMsg1',result[1]+'<a href="javascript:promotionControl.checkAction('+num+')">点此修改</a>');
					if (ParamsErrorBox1.css("display")==="none") {
						ParamsErrorBox1.slideDown();
					}
					DOM.val('#J_conValue'+num, '');
					//DOM.get('#J_conValue'+num).focus();
					DOM.addClass(DOM.get('#J_conValue'+num), 'text-error');
					return  error = true;
				}else{
					DOM.hide(ParamsErrorBox1);
					DOM.removeClass(DOM.get('#J_conValue'+num), 'text-error');
				}
				if(DOM.get('#J_mjsYuan').checked == true){
					var con_type = 1;
				}else{
					var con_type = 0;
				}
				if(parentType == 'mjscp'){
					if(DOM.get('#J_isSendLottery'+num).checked === false ){
						if(promotionControl.msg){
							promotionControl.msg.hide();
						}
						DOM.html('#J_ParamsErrorMsg1','层级'+(n+1)+'必须选中彩票！'+'<a href="javascript:promotionControl.checkAction('+num+')">点此修改</a>');
						if (ParamsErrorBox1.css("display")==="none") {
							ParamsErrorBox1.slideDown();
						}
						return  error=true;
					}else{
						DOM.hide(ParamsErrorBox1);
					}
					if(DOM.get('#J_isDiscountMoney'+num).checked === false && DOM.get('#J_isSetArea'+num).checked === false){
						if(promotionControl.msg){
							promotionControl.msg.hide();
						}
						DOM.html('#J_ParamsErrorMsg1','层级'+(n+1)+'的优惠内容必须选中彩票+至少其他一项！'+'<a href="javascript:promotionControl.checkAction('+num+')">点此修改</a>');
						if (ParamsErrorBox1.css("display")==="none") {
							ParamsErrorBox1.slideDown();
						}
						return  error=true;
					}else{
						DOM.hide(ParamsErrorBox1);
					}
					if(DOM.get('#J_isSendLottery'+num).checked === true){
						var cp_num = DOM.val('#J_stakeCount'+num);
						var result = H.util.isNull(cp_num);
						var error = result[0];
						if(error){
							if(promotionControl.msg){
								promotionControl.msg.hide();
							}
							DOM.html('#J_ParamsErrorMsg1',result[1]+'<a href="javascript:promotionControl.checkAction('+num+')">点此修改</a>');
							if (ParamsErrorBox1.css("display")==="none") {
								ParamsErrorBox1.slideDown();
							}
							DOM.addClass(DOM.get('#J_stakeCount'+num), 'text-error');
							return  error=true;
						}else{
							DOM.hide(ParamsErrorBox1);
							DOM.removeClass(DOM.get('#J_stakeCount'+num), 'text-error');
						}
						var str = KISSY.trim(DOM.val('#J_Content'+num));
						var len = str.replace(/[^\x00-\xff]/g,"**").length;
						if(len > 40){
							if(promotionControl.msg){
								promotionControl.msg.hide();
							}
							DOM.html('#J_ParamsErrorMsg1','彩票赠言不能超过40个字符<a href="javascript:promotionControl.checkAction('+num+')">点此修改</a>');
							if (ParamsErrorBox1.css("display")==="none") {
								ParamsErrorBox1.slideDown();
							}
							return error=true;
						}else{
							DOM.hide(ParamsErrorBox1);
						}
					}
				}else{
					if(DOM.get('#J_isDiscount'+num).checked === false && DOM.get('#J_isDiscountMoney'+num).checked === false && DOM.get('#J_isSetArea'+num).checked === false && DOM.get('#J_isSendGift'+num).checked === false){
						if(promotionControl.msg){
							promotionControl.msg.hide();
						}
						DOM.html('#J_ParamsErrorMsg1','层级'+(n+1)+'的优惠内容必须选择一项以上！'+'<a href="javascript:promotionControl.checkAction('+num+')">点此修改</a>');
						if (ParamsErrorBox1.css("display")==="none") {
							ParamsErrorBox1.slideDown();
						}
						return  error=true;
					}else{
						DOM.hide(ParamsErrorBox1);
					}
					if(DOM.get('#J_isDiscount'+num).checked === true){
						var discount_rate = DOM.val('#J_discountRate'+num);
						result = checkUtil.checkDiscount(discount_rate);
						error = result[0];
						msg = result[1];
						if(error){
							if(promotionControl.msg){
								promotionControl.msg.hide();
							}
							DOM.html('#J_ParamsErrorMsg1',msg+'<a href="javascript:promotionControl.checkAction('+num+')">点此修改</a>');
							if (ParamsErrorBox1.css("display")==="none") {
								ParamsErrorBox1.slideDown();
							}
							DOM.val('#J_isDiscount'+num, '');
							//DOM.get('#J_isDiscount'+num).focus();
							DOM.addClass(DOM.get('#J_isDiscount'+num), 'text-error');
							return error = true;
						}else{
							DOM.hide(ParamsErrorBox1);
							DOM.removeClass(DOM.get('#J_isDiscount'+num), 'text-error');
						}
					}
					if(con_type == 1){
						if(DOM.get('#J_isDiscount'+num).checked === true && DOM.get('#J_isDiscountMoney'+num).checked === true ){
							var isOver = (con_value*discount_rate)/10-decrease_money;
							if(isOver <=0){
								if(promotionControl.msg){
									promotionControl.msg.hide();
								}
								DOM.html('#J_ParamsErrorMsg1','层级'+(n+1)+'满'+con_value+'元打'+discount_rate+'折减'+decrease_money+'元后总价等于'+isOver+'小于0<a href="javascript:promotionControl.checkAction('+num+')">点此修改</a>');
								if (ParamsErrorBox1.css("display")==="none") {
									ParamsErrorBox1.slideDown();
								}
								DOM.val('#J_decreaseMoney'+num, '');
								DOM.addClass(DOM.get('#J_decreaseMoney'+num), 'text-error');
								return  error = true;
							}else{
								DOM.hide(ParamsErrorBox1);
								DOM.removeClass(DOM.get('#J_decreaseMoney'+num), 'text-error');
							}
						}
					}
					if(DOM.get('#J_isSendGift'+num).checked === true){
						var gift_name = DOM.val('#J_giftName'+num);
						var gift_url = DOM.val('#J_giftUrl'+num);
						var result = checkUtil.isNull(gift_name);
						var error = result[0];
						if(error){
							if(promotionControl.msg){
								promotionControl.msg.hide();
							}
							DOM.html('#J_ParamsErrorMsg1',result[1]+'<a href="javascript:promotionControl.checkAction('+num+')">点此修改</a>');
							if (ParamsErrorBox1.css("display")==="none") {
								ParamsErrorBox1.slideDown();
							}
							//DOM.get('#J_giftName'+num).focus();
							DOM.addClass(DOM.get('#J_giftName'+num), 'text-error');
							return  error = true;
						}else{
							DOM.hide(ParamsErrorBox1);
							DOM.removeClass(DOM.get('#J_giftName'+num), 'text-error');
						}
						var result = checkUtil.isNull(gift_url);
						var error = result[0];
						if(error){
							if(promotionControl.msg){
								promotionControl.msg.hide();
							}
							DOM.html('#J_ParamsErrorMsg1',result[1]+'<a href="javascript:promotionControl.checkAction('+num+')">点此修改</a>');
							if (ParamsErrorBox1.css("display")==="none") {
								ParamsErrorBox1.slideDown();
							}
							//DOM.get('#J_giftUrl'+num).focus();
							DOM.addClass(DOM.get('#J_giftUrl'+num), 'text-error');
							return  error = true;
						}else{
							DOM.hide(ParamsErrorBox1);
							DOM.removeClass(DOM.get('#J_giftUrl'+num), 'text-error');
						}
						
						var result = checkUtil.checkUrl(gift_url);
						var error = result[0];
						if(error){
							if(promotionControl.msg){
								promotionControl.msg.hide();
							}
							DOM.html('#J_ParamsErrorMsg1',result[1]+'<a href="javascript:promotionControl.checkAction('+num+')">点此修改</a>');
							if (ParamsErrorBox1.css("display")==="none") {
								ParamsErrorBox1.slideDown();
							}
							//DOM.get('#J_giftUrl'+num).focus();
							DOM.addClass(DOM.get('#J_giftUrl'+num), 'text-error');
							return  error=true;
						}else{
							DOM.hide(ParamsErrorBox1);
							DOM.removeClass(DOM.get('#J_giftUrl'+num), 'text-error');
						}
					}
				}
				if(DOM.get('#J_isDiscountMoney'+num).checked === true){
					var decrease_money = DOM.val('#J_decreaseMoney'+num);
					result = itemHandle.checkPrice(decrease_money);
					error = result[0];
					msg = result[1];
					if(error){
						if(promotionControl.msg){
							promotionControl.msg.hide();
						}
						if(DOM.val('#J_decreaseMoney'+num) == ''){
							DOM.html('#J_ParamsErrorMsg1','价格不能为空哦 <a href="javascript:promotionControl.checkAction('+num+')">点此修改</a>');
						}else{
							DOM.html('#J_ParamsErrorMsg1',result[1]+'<a href="javascript:promotionControl.checkAction('+num+')">点此修改</a>');
						}
						if (ParamsErrorBox1.css("display")==="none") {
							ParamsErrorBox1.slideDown();
						}
						DOM.val('#J_decreaseMoney'+num, '');
						//DOM.get('#J_decreaseMoney'+num).focus();
						DOM.addClass(DOM.get('#J_decreaseMoney'+num), 'text-error');
						return  error = true;
					}else{
						DOM.hide(ParamsErrorBox1);
						DOM.removeClass(DOM.get('#J_decreaseMoney'+num), 'text-error');
					}
					if(con_type == 1){
						var isOver = con_value-decrease_money;
						if(isOver <= 0){
							if(promotionControl.msg){
								promotionControl.msg.hide();
							}
							DOM.html('#J_ParamsErrorMsg1','层级'+(n+1)+'折扣价不能高于条件价<a href="javascript:promotionControl.checkAction('+num+')">点此修改</a>');
							if (ParamsErrorBox1.css("display")==="none") {
								ParamsErrorBox1.slideDown();
							}
							DOM.val('#J_decreaseMoney'+num, '');
							DOM.addClass(DOM.get('#J_decreaseMoney'+num), 'text-error');
							return  error = true;
						}else{
							DOM.hide(ParamsErrorBox1);
							DOM.removeClass(DOM.get('#J_decreaseMoney'+num), 'text-error');
						}
					}
				}
				if(DOM.get('#J_isSetArea'+num).checked === true){
					var areaList = DOM.val('#J_freeAreasName'+num).split(',');
					if(areaList.length == 0 || areaList == ''){
						var str = "层级"+(n+1)+"免邮地区未设置！";
						if(promotionControl.msg){
							promotionControl.msg.hide();
						}
						DOM.html('#J_ParamsErrorMsg1',str+'<a href="javascript:promotionControl.checkAction('+num+')">点此修改</a>');
						if (ParamsErrorBox1.css("display")==="none") {
							ParamsErrorBox1.slideDown();
						}
						//DOM.get('#J_isSetArea'+num).focus();
						return error=true;
					}else{
						DOM.hide(ParamsErrorBox1);
					}
				}
				return  error;
			},
			
			//是否签订彩票协议
			checkCpAgreement : function(el){
				if(DOM.val('#J_IsSign') == 1){
					return ;
				}
				promotionControl.x.setCheckboxOff(el)
			    var submitHandle = function(o) {
			    	if(o.payload.sign){
			    		DOM.val('#J_IsSign','1');
			    		promotionControl.x.setCheckboxOn(el);
				    }else{
						new H.widget.msgBox({
						    title:"签订协议",
						    content:'请先开通<a href="'+o.payload.sign_url+'" target="_blank">支付宝代购协议</a>',
						    type:"info"
						});
				    	DOM.val('#J_IsSign','0');
					}
			    };
			    var errorHandle = function(o){
			    	var ParamsErrorBox = KISSY.one('#J_ParamsErrorBox');
					DOM.html('#J_ParamsErrorMsg',o.desc);
					if (ParamsErrorBox.css("display")==="none") {
						ParamsErrorBox.slideDown();
					}
			 	};
			    var data ='';
			    new H.widget.asyncRequest().setURI(checkSignUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).setDataType('json').send();
			},
			
			//页面加载时候获取是否签订彩票协议
			loadingCheck : function(){
			    var submitHandle = function(o) {
			    	if(o.payload.sign){
			    		DOM.val('#J_IsSign','1');
				    }else{
						new H.widget.msgBox({
						    title:"签订协议",
						    content:'请先开通<a href="'+o.payload.sign_url+'" target="_blank">支付宝代购协议</a>',
						    type:"info"
						});
				    	DOM.val('#J_IsSign','0');
					}
			    };
			    var errorHandle = function(o){
					new H.widget.msgBox({
					    title:"温馨提示",
					    content:o.desc,
					    type:"info"
					});
			 	};
			    var data ='';
			    new H.widget.asyncRequest().setURI(checkSignUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).setDataType('json').send();
			},
			
			
			/*宝贝数 是否超过 3000*/
			checkTbItemNum : function(el){
				if(DOM.val('#J_RangeTypeValue') != 'ALL'){
					if(el.checked){
						DOM.show('#J_PromodescBox');
					}else{
						DOM.hide('#J_PromodescBox');
					}
					return ;
				}
				if(DOM.val('#J_TbItemsNum') == 1){
					var num = DOM.val('#J_TbItemsTotalNum');
					new H.widget.msgBox({
					    title:"温馨提示",
					    content:'宝贝数 0~1000才能使用全店详情模板，您店铺总共'+num+'个宝贝。',
					    type:"info"
					});
			    	DOM.prop(el,'checked',false);
			    	DOM.hide('#J_PromodescBox');
					return ;
				}
				if(DOM.val('#J_TbItemsNum') == 9999){
					if(el.checked){
						DOM.show('#J_PromodescBox');
					}else{
						DOM.hide('#J_PromodescBox');
					}
					return ;
				}
				DOM.prop(el,'checked',false);
			    var submitHandle = function(o) {
			    	if(o.payload.num >3000 || o.payload.num == 0){
						new H.widget.msgBox({
						    title:"温馨提示",
						    content:'宝贝数 0~1000才能使用全店详情模板，您店铺总共'+o.payload.num+'个宝贝。',
						    type:"info"
						});
				    	DOM.val('#J_TbItemsNum',1);
				    	DOM.prop(el,'checked',false);
				    	DOM.hide('#J_PromodescBox');
				    }else{
				    	DOM.prop(el,'checked',true);
				    	DOM.val('#J_TbItemsNum',9999);
					}
			    	DOM.val('#J_TbItemsTotalNum',o.payload.num)
			    };
			    var errorHandle = function(o){
			    	var ParamsErrorBox = KISSY.one('#J_ParamsErrorBox');
					DOM.html('#J_ParamsErrorMsg',o.payload.desc);
					if (ParamsErrorBox.css("display")==="none") {
						ParamsErrorBox.slideDown();
					}
			 	};
			    var data ='';
			    new H.widget.asyncRequest().setURI(getTbItemsNumUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).setDataType('json').send();
			},
			
			/*活动保存 验证*/
			save : function(type) {
				if(type == 'preview'){
					promotionControl.msg = {
						hide : function(){
							
						}
					}
				}else{
					promotionControl.msg = null;
					promotionControl.msg = new H.widget.msgBox({
					    title:"",
						dialogType : 'loading',
					    content:'正在保存中，请稍候'	
					})                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
				}
				var promoName = promotionForm.promo_name.value;
				var promoDesc = promotionForm.promo_desc.value;
				promotionControl.PromoNameAction(promoName);
				if(promotionControl.NameError == true){
					promotionControl.msg.hide();
					return ;
				}

				ParamsErrorBox = KISSY.one('#J_ParamsErrorBox');
				ParamsErrorBox1 = KISSY.one('#J_ParamsErrorBox1');
				ParamsErrorBox.hide();
				var typeId = promotionForm.type_id.value;
				if(typeId != '20'){
						if(S.one("#J_startDate")){
							var startDate = DOM.val('#J_startDate');
							var endDate = S.one('#J_endDate').val();
							if((endDate!='')&&(startDate>=endDate)){
								promotionControl.msg.hide();
								DOM.html('#J_ParamsErrorMsg','开始时间不能大于结束时间，请重新选择');
								if (ParamsErrorBox.css("display")==="none") {
									ParamsErrorBox.slideDown();
								}
								DOM.addClass('#J_startDate','text-error');
								return ;
							}else{
								DOM.hide(ParamsErrorBox);
							}
						}
						if(S.one("#J_endDate")){
							var endDate = S.one('#J_endDate').val();
							var n = new Date()
							var nowDate = new Date(n.getTime()+ (Number(DiffTime)));
							var startTime = H.util.stringToDate(S.one('#J_startDate').val());
							var endTime = H.util.stringToDate(endDate);
							var invalidate = H.util.stringToDate(invaliDate);
	
							if(endTime.getTime()<=startTime ){
								promotionControl.msg.hide();
								DOM.html('#J_ParamsErrorMsg','结束时间不能小于开始时间，请重新选择');
								if (ParamsErrorBox.css("display")==="none") {
									ParamsErrorBox.slideDown();
								}
								DOM.addClass('#J_endDate','text-error');
								return ;
							}else if(endTime.getTime() <= nowDate.getTime()){
								promotionControl.msg.hide();
								DOM.html('#J_ParamsErrorMsg','结束时间不能小于当前时间，请重新选择');
								if (ParamsErrorBox.css("display")==="none") {
									ParamsErrorBox.slideDown();
								}
								DOM.addClass('#J_endDate','text-error');
								return ;
							}else{
								DOM.hide(ParamsErrorBox);
							}
						}
				}
				switch(typeId) {
					case '10':
					case '11':
					case '12':
						var paramTypes = document.getElementsByName('params[type]');
						
						var len = paramTypes.length;
						for(var i=0; i<len; i++){
							if(paramTypes[i].checked){
								paramType = paramTypes[i].value;
								if(paramType == '1') {
									if(promotionControl.isEidt){
										var isChangeItem = document.getElementsByName('is_change_item').checked = false;
									}
									break;
								}
								switch(paramType){
									case '2':
										save = document.getElementsByName('params[save]');
										result = H.util.checkPrice(Math.abs(save[0].value));
										error = result[0];
										msg = result[1];
										if(error){
											promotionControl.msg.hide();
											DOM.html('#J_ParamsErrorMsg',msg);
											if (ParamsErrorBox.css("display")==="none") {
												ParamsErrorBox.slideDown();
											}
											save[0].value = '';
											save[0].focus();
											DOM.addClass(save[0], 'text-error');
											return ;
										}else{
											DOM.removeClass(save[0], 'text-error');
											DOM.hide(ParamsErrorBox);
										}
										break;
									case '3':
										spec = document.getElementsByName('params[spec]');
										result = H.util.checkPrice(spec[0].value);
										error = result[0];
										msg = result[1];
										if(error){
											promotionControl.msg.hide();
											DOM.html('#J_ParamsErrorMsg',msg);
											if (ParamsErrorBox.css("display")==="none") {
												ParamsErrorBox.slideDown();
											}
											spec[0].value = '';
											spec[0].focus();
											DOM.addClass(spec[0], 'text-error');
											return ;
										}else{
											DOM.removeClass(spec[0], 'text-error');
											DOM.hide(ParamsErrorBox);
										}
										break;
									case '4':
										discount = document.getElementsByName('params[discount]');
										result = H.util.checkPrice(discount[0].value);
										error = result[0];
										msg = result[1];
										if(error){
											promotionControl.msg.hide();
											DOM.html('#J_ParamsErrorMsg',msg);
											if (ParamsErrorBox.css("display")==="none") {
												ParamsErrorBox.slideDown();
											}
											discount[0].value = '';
											discount[0].focus();
											DOM.addClass(discount[0], 'text-error');
											return ;
										}else{
											DOM.hide(ParamsErrorBox);
											DOM.removeClass(discount[0], 'text-error');
										}
										break;
								}
								break;
							}
						} 
						break;
					case '2':
					case '9':
					case '32':	
						if(promotionControl.isEidt && typeId != 32){
							var isChangeItem = document.getElementsByName('is_change_item');
							var editFlag = isChangeItem[0].checked;	
						}else{
							var editFlag =true;	
						}
						if(editFlag){
							var paramType = document.getElementsByName('params[type]');
							type = paramType[0].value;
							discount = document.getElementsByName('params[value]');
							var result = checkUtil.isNull(discount[0].value);
							var error = result[0];
							if(promotionControl.isEidt){
								if(error){
									promotionControl.msg.hide();
									DOM.html('#J_ParamsErrorMsg',msg);
									if (ParamsErrorBox.css("display")==="none") {
										ParamsErrorBox.slideDown();
									}
									discount[0].focus();
									DOM.addClass(discount[0], 'text-error');
									return ;
								}else{
									DOM.hide(ParamsErrorBox);
									DOM.removeClass(discount[0], 'text-error');
								}
							}
							if(!error){
								if( typeId=='9' || typeId=='12' ){
									var maxDiscount = 0;
									var aaamsg = '折扣暂时不能低于7折!';
								}else{
									var maxDiscount = 0;
									var aaamsg = '折扣范围在0.00~9.99折!';
								}		
								if(discount[0].value>=10 || discount[0].value < maxDiscount){
									promotionControl.msg.hide();
									DOM.html('#J_ParamsErrorMsg',aaamsg);
									if (ParamsErrorBox.css("display")==="none") {
										ParamsErrorBox.slideDown();
									}
									discount[0].value = '';
									discount[0].focus();
									DOM.addClass(discount[0], 'text-error');
									return ;
								}else{
									DOM.hide(ParamsErrorBox);
									DOM.removeClass(discount[0], 'text-error');
								}
								result = checkUtil.checkDiscount(discount[0].value);
								error = result[0];
								msg = result[1];
								if(error){
									promotionControl.msg.hide();
									DOM.html('#J_ParamsErrorMsg',msg);
									if (ParamsErrorBox.css("display")==="none") {
										ParamsErrorBox.slideDown();
									}
									discount[0].value = '';
									discount[0].focus();
									DOM.addClass(discount[0], 'text-error');
									return ;
								}else{
									DOM.hide(ParamsErrorBox);
									DOM.removeClass(discount[0], 'text-error');
								}
							}

							if(typeId=='9'){
								var start_num = document.getElementsByName('params[start_num]');
								var min_num = document.getElementsByName('params[min_num]');
								var max_num = document.getElementsByName('params[max_num]');
								if(isNaN(Number(start_num[0].value)) || start_num[0].value <0 ){
										start_num[0].value = '0';
								}
								if(isNaN(Number(min_num[0].value)) || min_num[0].value <0 ){
										min_num[0].value = '0';
								}
								if(isNaN(Number(max_num[0].value)) || max_num[0].value <=0 || Number(max_num[0].value)<Number(min_num[0].value)){
									promotionControl.msg.hide();
									DOM.html('#J_ParamsErrorMsg','参团人数上限大于等于参团人数下限');
									if (ParamsErrorBox.css("display")==="none") {
										ParamsErrorBox.slideDown();
									}
									max_num[0].value = '';
									max_num[0].focus();
									DOM.addClass(max_num[0], 'text-error');
									return ;
								}else{
									DOM.hide(ParamsErrorBox);
									DOM.removeClass(max_num[0], 'text-error');
								}
							}
						}
						if(typeId=='32'){
								var limitNum = DOM.val('#J_LimitNumValue');
								result = H.util.checkPrice(limitNum);
								error = result[0];
								msg = result[1];
								if(error){
									promotionControl.msg.hide();
									DOM.html('#J_ParamsErrorMsg','限购 数量 大于0哦');
									if (ParamsErrorBox.css("display")==="none") {
										ParamsErrorBox.slideDown();
									}
									DOM.val('#J_LimitNumValue','');
									DOM.addClass('#J_LimitNumValue', 'text-error');
									return ;
								}else{
									DOM.hide(ParamsErrorBox);
									DOM.removeClass('#J_LimitNumValue', 'text-error');
								}
								DOM.val('#J_LimitNumValue',Number(limitNum).toFixed(0));
						}
						break;
					case '20' :
						var lists = DOM.children('#J_privilegeTier');						
						var len = lists.length;
						times = [];
						if(len>1){
							for(var p = 1; p<len;p++){
								var startTime = DOM.val('#J_StartDateJtj'+(p-1));
								var endTime = DOM.val('#J_StartDateJtj'+p);
								var nowDate = new Date();
								var sTime = H.util.stringToDate(startTime);
								var eTime = H.util.stringToDate(endTime);
								var invalidate = H.util.stringToDate(invaliDate);
								if(eTime.getTime()<=sTime.getTime()){
									promotionControl.msg.hide();
									DOM.html('#J_ParamsErrorMsg','时间有误，活动时间段不能重叠');
									if (ParamsErrorBox.css("display")==="none") {
										ParamsErrorBox.slideDown();
									}
									DOM.addClass(lists[p],'text-error');
									return;
								}else{
									DOM.hide(ParamsErrorBox);
									DOM.removeClass(lists[p], 'text-error');
								}
							}  
						}
						
						for(var q =0; q<promotionControl.jtjData.length;q++){
							var s = DOM.val('#J_StartDateJtj'+q);
							var e = DOM.val('#J_EndDateJtj'+q);
							var t =[s,e];	
							times.push(t);
						}
						DOM.val('#J_ladd',times);
						break;	
					case '105':
					case '106':
					case '115':	
						var con_value = DOM.val('#J_conValue0');
						var is_condition = DOM.val('#J_IsConditionValue');
						if(is_condition=='1'){
							spec = document.getElementsByName('params[value]');
							var result = checkUtil.isNull(con_value);
							var error = result[0];
							if(error){
								promotionControl.msg.hide();
								DOM.html('#J_ParamsErrorMsg1',result[1]);
								if (ParamsErrorBox1.css("display")==="none") {
									ParamsErrorBox1.slideDown();
								}
								DOM.val('#J_conValue0','');
								//DOM.get('#J_conValue0').focus();
								DOM.addClass('#J_conValue0','text-error');
								return ;
							}else{
								DOM.hide(ParamsErrorBox1);
								DOM.removeClass('#J_conValue0', 'text-error');
							}
							result = H.util.checkPrice(con_value);
							error = result[0];
							msg = result[1];
							if(error){
								promotionControl.msg.hide();
								DOM.html('#J_ParamsErrorMsg1',result[1]);
								if (ParamsErrorBox1.css("display")==="none") {
									ParamsErrorBox1.slideDown();
								}
								DOM.val('#J_conValue0','');
								//DOM.get('#J_conValue0').focus();
								DOM.addClass('#J_conValue0','text-error');
								return ;
							}else{
								DOM.hide(ParamsErrorBox1);
								DOM.removeClass('#J_conValue0', 'text-error');
							}
							var areaList = DOM.val('#J_freeAreasName0').split(',');
							if(areaList.length == 0 || areaList == ''){
								var str = "免邮地区未设置!";
								promotionControl.msg.hide();
								DOM.html('#J_ParamsErrorMsg1',str);
								if (ParamsErrorBox1.css("display")==="none") {
									ParamsErrorBox1.slideDown();
								}
								return ;
							}else{
								DOM.hide(ParamsErrorBox1);
							}
						}
						break;
					case '107':
					case '108':
					case '117':
						for(var n = 0; n<promotionControl.mjsData.length; n++){
							var flag = promotionControl.checkRule(n,n);
							if(flag == true){
								return ;
							}
							if(n>0){
								var con_value_pre = DOM.val('#J_conValue'+(n-1));
								var con_value_now = DOM.val('#J_conValue'+n);
								if(Number(con_value_pre)-Number(con_value_now) >=0){
									promotionControl.msg.hide();
									var str = "层级"+(n+1)+"满多少要大于层级"+n+'！';
									for(var m = 0; m<promotionControl.mjsData.length; m++){
										promotionControl.miniMjs(m);
									}
									promotionControl.maxiMjs(n);
									DOM.html('#J_ParamsErrorMsg1',str+'<a href="javascript:promotionControl.checkAction('+n+')">点此修改</a>');
									if (ParamsErrorBox1.css("display")==="none") {
										ParamsErrorBox1.slideDown();
									}
									DOM.addClass(DOM.get('#J_conValue'+n),'text-error');
									return ;
								}else{
									DOM.hide(ParamsErrorBox1);
									DOM.removeClass(DOM.get('#J_conValue'+n),'text-error');
								}
							}
						}
						break;
					case '110':
					case '111':
					case '120':
						DOM.val('#J_TypeId',32);
						break;
					case '118':  
						if(promotionControl.mjspartAttend.length == 0 || promotionControl.mjspartNothing.length == 0){
							promotionControl.msg.hide();
							DOM.html('#J_ParamsErrorMsg','请添加宝贝');
							if (ParamsErrorBox.css("display")==="none") {
								ParamsErrorBox.slideDown();
							}
							return ;
						}else{
							DOM.hide(ParamsErrorBox);
						}
						break;
					case '207':
					case '208':
					case '217':
						for(var n = 0; n<promotionControl.mjsData.length; n++){
							var flag = promotionControl.checkRule(n,n);
							if(flag == true){
								return ;
							}
							if(n>0){
								var con_value_pre = DOM.val('#J_conValue'+(n-1));
								var con_value_now = DOM.val('#J_conValue'+n);
								if(Number(con_value_pre)-Number(con_value_now) >=0){
									promotionControl.msg.hide();
									var str = "层级"+(n+1)+"满多少要大于层级"+n+'！';
									for(var m = 0; m<promotionControl.mjsData.length; m++){
										promotionControl.miniMjs(m);
									}
									promotionControl.maxiMjs(n);
									DOM.html('#J_ParamsErrorMsg1',str+'<a href="javascript:promotionControl.checkAction('+n+')">点此修改</a>');
									if (ParamsErrorBox1.css("display")==="none") {
										ParamsErrorBox1.slideDown();
									}
									DOM.addClass(DOM.get('#J_conValue'+n), 'text-error');
									return ;
								}else{
									DOM.hide(ParamsErrorBox1);
									DOM.removeClass(DOM.get('#J_conValue'+n),'text-error');
								}
							}
						}
						break;
					default:break;
				}

				if(promotionControl.isEidt){
		           if(type == 'preview'){
		        	   	var temId = DOM.val('#J_ProtoId');
			  			var sucessHandle = function(o) {
			  				ParamsErrorBox.hide();
					    	DOM.html(DOM.get('#J_PreviewBox_'+temId),o.payload.body);
					       	DOM.height(DOM.parent('#J_PreviewBox_'+temId, '.J_Height'),DOM.height(DOM.get('#J_PreviewBox_'+temId+' table')));
					       	if(prodescTempleteId){
							   if(!DOM.prop('#J_IsPromodesc','checked')){
						       		DOM.hide('#J_PromodescBox');
							   }
					       	}
						};
						var errorHandle = function(o){
							promotionControl.msg.hide();
				 			if(o.desc == 'need-oauth'){
								 KISSY.Event.fire('.J_TopExpired','click');
								 return ;
							}
							DOM.html('#J_ParamsErrorMsg',o.desc);
							if (ParamsErrorBox.css("display")==="none") {
								ParamsErrorBox.slideDown();
							}
							 DOM.scrollIntoView('#J_ParamsErrorMsg',window);
						};
						if(DOM.get('#J_promoExplain').checked == true){
							var promo_remark = encodeURIComponent(DOM.val(DOM.get("#J_promoRemark")));
						}
						var data ='&promo_remark='+promo_remark;
					    new H.widget.asyncRequest().setURI(privewPromodescUrl).setMethod("POST").setForm('#promotion_edit_form').setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
				  	}else{
						var sucessHandle = function(o) {
				 			promotionControl.msg.hide();
//				 			ParamsErrorBox.hide();
//				 			ParamsSucessBox = KISSY.one('#J_ParamsSucessBox')
//				 			DOM.html('#J_ParamsSucessMsg',o.desc);
//							if (ParamsSucessBox.css("display")==="none") {
//								ParamsSucessBox.slideDown();
//							}
//							DOM.scrollIntoView('#J_ParamsSucessMsg',window);
				 			window.location.href= sucessTargerUrl+'&pid='+o.pid;
				 		};
				 		var errorHandle = function(o){
				 			promotionControl.msg.hide();
				 			if(o.desc == 'need-oauth'){
								 KISSY.Event.fire('.J_TopExpired','click');
								 return ;
							}
							DOM.html('#J_ParamsErrorMsg',o.desc);
							if (ParamsErrorBox.css("display")==="none") {
								ParamsErrorBox.slideDown();
							}
							DOM.scrollIntoView('#J_ParamsErrorMsg',window);
				 		};
				 		var join_items = KISSY.JSON.stringify(promotionControl.mjspartAttend); //第N件优惠参与宝贝
				 		var nothing_items = KISSY.JSON.stringify(promotionControl.mjspartNothing); //第N件优惠无关宝贝
				 		var itemsJson = KISSY.JSON.stringify(promotionControl.mjsRemove);
				 		join_items = join_items.replace(/%25/g, '%!').replace(/&/g, '%26');
				 		nothing_items = nothing_items.replace(/%25/g, '%!').replace(/&/g, '%26');
				 		itemsJson = itemsJson.replace(/%25/g, '%!').replace(/&/g, '%26');
				 		var data = '&items='+itemsJson+"&join_items="+join_items+"&nothing_items="+nothing_items;
				  	    new H.widget.asyncRequest().setURI(editorSaveUrl).setMethod("POST").setForm('#promotion_edit_form').setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
				  	}
	          }else{
			  		if(type == 'preview'){
			  			var temId = DOM.val('#J_ProtoId');
			  			var sucessHandle = function(o) {
					    	DOM.html(DOM.get('#J_PreviewBox_'+temId),o.payload.body);
					    	DOM.height(DOM.parent('#J_PreviewBox_'+temId, '.J_Height'),DOM.height(DOM.get('#J_PreviewBox_'+temId+' table')));
						};
						var errorHandle = function(o){
							promotionControl.msg.hide();
				 			if(o.desc == 'need-oauth'){
								 KISSY.Event.fire('.J_TopExpired','click');
								 return ;
							}
							DOM.html('#J_ParamsErrorMsg',o.desc);
							if (ParamsErrorBox.css("display")==="none") {
								ParamsErrorBox.slideDown();
							}
							DOM.scrollIntoView('#J_ParamsErrorMsg',window);
						};
						if(DOM.get('#J_promoExplain').checked == true){
							var promo_remark = encodeURIComponent(DOM.val(DOM.get("#J_promoRemark")));
						}
						var data ='&promo_remark='+promo_remark;
					    new H.widget.asyncRequest().setURI(privewPromodescUrl).setMethod("POST").setForm('#promotion_edit_form').setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
			  		}else{
				  		var sucessHandle = function(o) {
				 			promotionControl.msg.hide();
				 			ParamsErrorBox.hide();
//				 			ParamsSucessBox = KISSY.one('#J_ParamsSucessBox')
//				 			DOM.html('#J_ParamsSucessMsg','成功创建活动！');
//							if (ParamsSucessBox.css("display")==="none") {
//								ParamsSucessBox.slideDown();
//							}
//							DOM.scrollIntoView('#J_ParamsSucessMsg',window);
							window.location.href=o.desc;
				 		};
				 		var errorHandle = function(o){
				 			promotionControl.msg.hide();
				 			if(o.desc == 'need-oauth'){
								 KISSY.Event.fire('.J_TopExpired','click');
								 return ;
							}
							DOM.html('#J_ParamsErrorMsg',o.desc);
							if (ParamsErrorBox.css("display")==="none") {
								ParamsErrorBox.slideDown();
							}
							 DOM.scrollIntoView('#J_ParamsErrorMsg',window);
				 		};
				 		var join_items = KISSY.JSON.stringify(promotionControl.mjspartAttend); //第N件优惠参与宝贝
				 		var nothing_items = KISSY.JSON.stringify(promotionControl.mjspartNothing); //第N件优惠无关宝贝
				 		var itemsJson = KISSY.JSON.stringify(promotionControl.mjsRemove);
				 		join_items = join_items.replace(/%25/g, '%!').replace(/&/g, '%26');
				 		nothing_items = nothing_items.replace(/%25/g, '%!').replace(/&/g, '%26');
				 		itemsJson = itemsJson.replace(/%25/g, '%!').replace(/&/g, '%26');
				 		var data = '&items='+itemsJson+"&join_items="+join_items+"&nothing_items="+nothing_items;
				  	    new H.widget.asyncRequest().setURI(SaveUrl).setMethod("POST").setForm('#promotion_edit_form').setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
				  	}
			  }
				return true;
		    },
		    
			/*活动名称 验证*/
			PromoNameAction : function(name){
				var result = checkUtil.isNull(name);
				var error = result[0];
				var msg = result[1];
				if(error){
					DOM.addClass(promotionForm.promo_name,'text-error');
					DOM.html('#J_PromoNameError',msg);
					DOM.hide('#J_PromoNameRequired');
					DOM.show('#J_PromoNameError');
					return promotionControl.NameError = true;
				}else{
					DOM.hide('#J_PromoNameError');
					DOM.show('#J_PromoNameRequired');
				}
				result = checkUtil.checkSpecTitle(name);
				error = result[0];
				msg = result[1];
				if(error){
					DOM.addClass(promotionForm.promo_name,'text-error');
					DOM.html('#J_PromoNameError',msg);
					DOM.hide('#J_PromoNameRequired');
					DOM.show('#J_PromoNameError');
					return promotionControl.NameError = true;
				}else{
					DOM.hide('#J_PromoNameError');
					DOM.show('#J_PromoNameRequired');
				}
				var typeId = DOM.val('#J_TypeId');
				if(typeId == '2' || typeId == '9' || typeId == '20' || typeId == '22' || typeId == '32'){
					result = checkUtil.checkPromoName(name);
					error = result[0];
					msg = result[1];
					if(error){
						DOM.addClass(promotionForm.promo_name,'text-error');
						DOM.html('#J_PromoNameError',msg);
						DOM.hide('#J_PromoNameRequired');
						DOM.show('#J_PromoNameError');
						return promotionControl.NameError = true;
					}else{
						DOM.hide('#J_PromoNameError');
						DOM.show('#J_PromoNameRequired');
					}
				}
				DOM.removeClass(promotionForm.promo_name,'text-error');
				DOM.hide('#J_PromoNameError');
				return promotionControl.NameError = false;
			},
			
			/*活动备注 验证*/
			PromoDescAction : function(desc){
				var result = checkUtil.isNull(desc);
				var error = result[0];
				var msg = result[1];
				if(!error){
					result = checkUtil.checkPromoDesc(desc);
					error = result[0];
					msg = result[1];
					if(error){
						DOM.addClass(promotionForm.promo_desc,'text-error');
						DOM.html('#J_PromoDescError',msg);
						DOM.hide('#J_PromoDescRequired');
						DOM.hide('#J_PromoDescSucess');
						DOM.show('#J_PromoDescError');
						return promotionControl.DescError = true;
					}
					result = checkUtil.checkSpecTitle(desc);
					error = result[0];
					msg = result[1];
					if(error){
						DOM.addClass(promotionForm.promo_desc,'text-error');
						DOM.html('#J_PromoDescError',msg);
						DOM.hide('#J_PromoDescRequired');
						DOM.hide('#J_PromoDescSucess');
						DOM.show('#J_PromoDescError');
						return promotionControl.DescError = true;
					}
				}
				DOM.removeClass(promotionForm.promo_desc,'text-error');
				DOM.hide('#J_PromoDescRequired');
				DOM.show('#J_PromoDescSucess');
				DOM.hide('#J_PromoDescError');
				return promotionControl.DescError = false;
			},

			handleInputs : function(){
				var inputs = DOM.filter (DOM.query('input'),function(i){if(i.type =='text')return true;})
				Event.on(inputs,'focus blur',function(ev){
					if(ev.type == 'focus'){
						if(DOM.hasClass(ev.target,'input-none')){
							DOM.removeClass(DOM.parent(ev.target),'input-text text text-error');
							DOM.addClass(DOM.parent(ev.target),'input-text-on');
						}else{
							DOM.removeClass(ev.target,'input-text text text-error');
							DOM.addClass(ev.target,'input-text-on');
						}
					} else if(ev.type == 'blur'){
						if(DOM.hasClass(ev.target,'input-none')){
							DOM.removeClass(DOM.parent(ev.target),'input-text-on');
							DOM.addClass(DOM.parent(ev.target),'input-text');
						}else{
							DOM.removeClass(ev.target,'input-text-on');
							DOM.addClass(ev.target,'input-text');
						}
					}
				})
			}
	}

}, {
    requires: ['./mods/check','./mods/item-handle','utils/beautifyForm/index','bui/select','bui/tooltip','bui/calendar','bui/overlay','xtemplate','utils/showPages/index','switchable']
});