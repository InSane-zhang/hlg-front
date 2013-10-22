
/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,showPages,itemHandle,Select,beautifyForm,Tooltip,Overly,itemCheck,Overlay,Calendar) {
    var DOM = S.DOM, Event = S.Event, tbTabArray = new Array('1','2'), promoTabArray = new Array('3','4','5');
    return promotionControl = {
    		isTarget:false,
    		processStatus : 0,  //到第三步 ，提示 是否将勾选宝贝加入活动 ，处理状态，
			paginator : null,
	    	promotionItemPaginator : null,
	    	itemCache : null,
	    	promotionItemCache : null,
	    	panel : null,
	    	titlePanel : null,
	    	designIconPanel : null,
	    	initDesignFlag : false,
	    	initiconPanelFlag : false,
	    	iconPanel : null,
	    	iconArr : [],
	    	msg : null,
	    	bd : null,
	    	tabs : null,
	    	skuPriceTip : null,
	    	select : null,
	    	select1 : null,
	    	isChanged : false, //是否编辑过
	    	isSelected : false, //是否选中过
	    	popResetPromoItemDialog : null ,
		    	
	    	init : function() {
				  
    			   //团购选择时间
			       new Calendar.DatePicker({
			            trigger:'.J_tiems',
			            showTime:true,
			            autoRender : true,
			            autoSetValue :true,
			            delegateTigger :true
				   })
			       
			       //阶梯价					
					Event.delegate(document,'click','.J_jtjYouhui',function(ev){
						var data = DOM.attr(ev.currentTarget,'data');
						var t = DOM.attr(ev.currentTarget,'type');
						DOM.val('#J_Type_'+data,t);
						var id = DOM.query('.J_jtjYouhui','#J_jtjList'+data);
						DOM.removeAttr(id,'id');
						DOM.removeClass(id,'J_PromoValue');
						DOM.removeClass(id,'input-price-focus');
						DOM.addClass(id,'input-price');
						DOM.attr(ev.currentTarget,{id:'J_PromoValue_'+data});
						DOM.addClass(ev.currentTarget,'J_PromoValue');
						DOM.removeClass(ev.currentTarget,'input-price');
						DOM.addClass(ev.currentTarget,'input-price-focus');
					});
			       
    			   var timeFunName = null;
				   //初始加载一次
				   if(isEditMode){
				       promotionControl.loadPromotionItems();
				   }else{
				       promotionControl.searchTbItems();
	                    //筛选活动   
	                    Event.on('#J_FilterItem','click',function(ev){
	                    	if(!promotionControl.popResetPromoItemDialog){
		                    		if(DOM.hasClass(ev.currentTarget,'ing')){
	                    				return ;
	                    			}
	                    			DOM.addClass(ev.currentTarget,'ing');
		                    	  	var submitHandle = function(o) {
			                    		 var str = '<div class="pop-reset-promoItem ks-clear" id="J_PopResetPromoItemBox">'+
					                                 '<ul id="J_FilterList">'+
					                                     '<li class="filter-type"><div class="input_style" style="width:90px;margin:0px;"><span><input type="radio" id="J_filterCurrent" class="fl beautify_input" name="filterType" checked="checked" value="0"></span><label for="J_filterCurrent">&nbsp;筛选宝贝</label></div></li>'+
					                                     '<li class="filter-type"><div class="input_style" style="width:90px;margin:0px 0px 0px 40px;"><span><input type="radio" id="J_filterSimilar" class="fl beautify_input" name="filterType" value="1"></span><label for="J_filterSimilar">&nbsp;排除宝贝</label></div></li>'+
					                                 '</ul>'+o.payload.body+
					                             '</div>';
			                    		 promotionControl.popResetPromoItemDialog = new Overlay.Dialog({
						                     title : '排除活动',
						                     width : 360,
						                     mask:true,
						                     buttons:[
						                        {
						                          text:'确定',
						                          elCls : 'bui-button bui-button-primary',
						                          handler : function(){
						                              if(DOM.prop('#J_filterCurrent','checked')){
						                                  DOM.val('#J_filter','4');
						                              }
						                              if(DOM.prop('#J_filterSimilar','checked')){
						                                  DOM.val('#J_filter','3');
						                              }
						                              // DOM.val('#J_filter','1'); //需求：编辑宝贝--添加宝贝过滤已添加的，默认过滤；
						                               var areaInput = DOM.query('#J_PopResetPromoItemBox .J_check');
							                   		 	var len = areaInput.length;
							              	     	    var ids = [];
							              	     	   	for(var i = 0; i < len; i++){
							              	     	   		if(areaInput[i].disabled) continue;
							              	     	   		if(areaInput[i].checked == true){
							              	     	   			ids.push(DOM.val(areaInput[i]));
							              	     	   		}
							              	     	   	} 
							              	     	 DOM.val('#J_FilterGrade',ids.join(','));	
							              	     	 promotionControl.searchTbItems();
						                             this.hide();
						                          }
						                        },{
						                          text:'取消',
						                          elCls : 'bui-button J_buttonCancel',
						                          handler : function(){
						                             this.hide();
						                          }
						                        }
						                      ],
						                     bodyContent:str
						                 })
			                    		 promotionControl.popResetPromoItemDialog.show();
			                    		 DOM.removeClass(ev.currentTarget,'ing');
						                 promotionControl.Form.renderAll('#J_PopResetPromoItemBox');
						                 promotionControl.popResetPromoItemDialog.on('hide',function(){
						                	 var data = DOM.val('#J_FilterGrade');	
						                	 if(data){
						                		 DOM.addClass('#J_FilterItem','filter-btn-on');
						                	 }else{
						                		 DOM.removeClass('#J_FilterItem','filter-btn-on');
						                	 }
						                 })
						                 
						                 //全选 控制
						                 Event.on(DOM.query('.J_LeftCheckBox'),'click',function(ev){
						 					var v = DOM.val(ev.currentTarget);
						 					var checkBoxs = DOM.query('.J_check','#J_FilterTypeBox_'+v);				
						 			   		var len = checkBoxs.length;
						 			   		for(i=0; i<len; i++){
						 			   			if(checkBoxs[i].disabled) continue;
						 			   			if(ev.currentTarget.checked){
						 			   				promotionControl.Form.setCheckboxOn(checkBoxs[i]);
						 			   			} else {
						 			   				promotionControl.Form.setCheckboxOff(checkBoxs[i]);
						 			   			}
						 			   		  }
						 				 })
						 				 Event.on(DOM.query('#J_PopResetPromoItemBox .J_check'),'click',function(ev){
						 					var v = DOM.attr(ev.currentTarget,'data');
						 	        		if(this.checked){
						 	        			var checkBoxs = DOM.query("#J_FilterTypeBox_"+v+" .J_check");
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
						 	        				promotionControl.Form.setCheckboxOn(DOM.get('#J_FilterListPromoType_'+v));
						 	        			}
						 	        		}else{
						 	        			promotionControl.Form.setCheckboxOff(DOM.get('#J_FilterListPromoType_'+v));
						 	        		}
						 	        	})
		        				};
		        				var data = "";
		                	    new H.widget.asyncRequest().setURI(loadInPromoUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
	                    	}else{
	                    		promotionControl.popResetPromoItemDialog.show();
	                    	}
	                  })
				   }
				   //美化input
				   promotionControl.Form = new beautifyForm();
				   //渲染搜索框
				   promotionControl.select = new Select.Select({  
	                    render:'#J_SelectItemCid',
	                    valueField:'#J_SelectItemCidHide',
	                    items:cidItem
	                });
				   promotionControl.select.render();
				   promotionControl.select.setSelectedValue('0');
				   promotionControl.select1 = new Select.Select({  
                     render:'#J_SortType',
                     valueField:'#J_SortValue',
                     items:sortItems
				   });
				   promotionControl.select1.render();
				   promotionControl.select1.setSelectedValue('0');
				   promotionControl.select1.on('change',function(ev){
					   promotionControl.searchTbItems();
				   });
                   //显示内容切换
                   Event.on('.J_ChooseShowType','click',function(ev){
                       var val = Number(DOM.attr(ev.currentTarget,'data'));
                       DOM.val('#J_CurrentTab',val);
                       promotionControl.searchReset();
                       switch(val){
                           case 1:
                           case 2:
                               DOM.val('#J_TBTabType',val);
                               DOM.hide('.J_PromoCont');
                               DOM.show('.J_TbCont');
                               DOM.show('#J_FilterItem');
                               promotionControl.isTarget = false;
                               promotionControl.searchTbItems();
                               break;
                           case 3:
                               DOM.val('#J_PromoTabType','0');
                               promotionControl.loadPromotionItems();
                               DOM.hide('.J_TbCont');
                               DOM.hide('#J_FilterItem');
                               DOM.show('.J_PromoCont');
                               break;
                           case 4:
                               DOM.val('#J_PromoTabType','4');
                               promotionControl.loadPromotionItems();
                               DOM.hide('.J_TbCont');
                               DOM.hide('#J_FilterItem');
                               DOM.show('.J_PromoCont');
                               break;
                           case 5:
                               DOM.val('#J_PromoTabType','1');
                               promotionControl.loadPromotionItems();
                               DOM.hide('.J_TbCont');
                               DOM.hide('#J_FilterItem');
                               DOM.show('.J_PromoCont');
                               break;
                       }
                       DOM.removeClass('#J_ControlBtm','fix-bottom');
                       DOM.hide('#J_BottomPlaceHolder');
                       DOM.removeClass('.J_ChooseShowType','current');
                       DOM.addClass(ev.currentTarget,'current');
                   })
	                //点击批量设置按钮
	                Event.on('#J_editAll','click',function(e){
	                    DOM.show('#J_CancelEditAll');
	                    DOM.hide('#J_editAll');
	                    DOM.show('#J_BatchSet');
	                    if(DOM.val('#J_CurrentTab')>2){
	                        DOM.show('.J_BatchControlHolder');
	                        DOM.show('.J_CheckLabel');
	                    }
	                    if(!DOM.prop('#J_TopCheckAll','checked')){
	                        DOM.show('#J_BatchTip');
	                    }
	                })
	                Event.on('#J_CancelEditAll','click',function(e){
	                    DOM.hide('#J_CancelEditAll');
	                    DOM.show('#J_editAll');
	                    DOM.hide('#J_BatchSet');
	                    if(DOM.val('#J_CurrentTab')>2){
	                        DOM.hide('.J_BatchControlHolder');
	                        DOM.hide('.J_CheckLabel');
	                    }
	                    DOM.hide('#J_BatchTip');
	                })
	                //批量设置-输入框获得焦点
	                Event.on('#J_BatchSet input','focus keyup',function(ev){
	                    var data = DOM.attr(ev.currentTarget,'data');
	                    if(ev.type == 'focus'){
	                        if(data == '1'){
	                            DOM.val('#J_Zhe','1');
	                            DOM.val('#J_value2ToAll','');
	                        }else{
	                            DOM.val('#J_Zhe','0');
	                            DOM.val('#J_valueToAll','');
	                        }
	                    }else{
	                        promotionControl.Form.setCheckboxOff(DOM.get('#J_QuzhengTo1'));
	                        promotionControl.Form.setCheckboxOff(DOM.get('#J_QuzhengTo2'));
	                        promotionControl.editAll();
	                    }
	                })
	                //li点击选中
	                Event.delegate(document,'click mouseenter mouseleave','.list-item',function(ev){
	                    var data = DOM.attr(ev.currentTarget,'data');
                        var currentTab = DOM.val('#J_CurrentTab');
	                    var promoBox = DOM.get('#J_PromoBox_'+data);
	                    var operation = DOM.get('#J_Operation_'+data);
	                    var tejia = DOM.get('#J_tejia_'+data);
	                    var promoType = DOM.val('#J_PromoType_'+data);
	                    var lastEditValue = DOM.val('#J_LastEditValue');
	                    var lastEditMode = DOM.val('#J_LastEditMode');
	                    if(ev.type == 'click'){
	                        DOM.hide('#J_BatchTip');
	                        var liCheckbox = DOM.get('#J_check'+data);
	                        if(!liCheckbox.disabled){
//	                            if(promoType === undefined){
//	                                var textInput = DOM.filter (DOM.query('#J_PromoBox_'+data+' input'),function(i){if(i.type =='text')return true;});
//	                                if(DOM.get(textInput[0])){
//	                                    DOM.get(textInput[0]).focus();
//	                                    DOM.get(textInput[0]).select();
//	                                    Event.on(textInput,'click',function(ev){
//	                                        ev.halt();
//	                                        DOM.get(ev.currentTarget).focus();
//	                                        DOM.get(ev.currentTarget).select();
//	                                    })
//	                                }
//	                            }else{
//	                                if(promoType == '1'){
//	                                    DOM.get('#J_PromoValue_'+data).focus();
//	                                    DOM.get('#J_PromoValue_'+data).select();
//	                                }else{
//	                                    DOM.get('#J_Promo2Value_'+data).focus();
//	                                    DOM.get('#J_Promo2Value_'+data).select();
//	                                }
//	                                Event.on('#J_SpecPrice_'+data,'click',function(ev){
//	                                    ev.halt();
//	                                    DOM.get('#J_SpecPrice_'+data).focus();
//	                                    DOM.get('#J_SpecPrice_'+data).select();
//	                                })
//	                            }
	                            if(!liCheckbox.checked){
	                                if(S.inArray(currentTab,tbTabArray)){
	                                    DOM.removeClass([promoBox,operation,tejia], 'ks-hidden');
	                                    if(!promotionControl.isSelected){
	                                        promotionControl.isSelected = true;
	                                        DOM.replaceClass('#J_BtmAddToPromo','.button-gray','.button-green');
	                                    }
	                                }
	                                promotionControl.Form.setCheckboxOn(liCheckbox);
	                                if(lastEditValue != 'none'){
	                                    if(lastEditMode == '1'){
	                                        DOM.val('#J_PromoValue_'+data,lastEditValue);
	                                        Event.fire('#J_PromoValue_'+data,'keyup');
	                                    }else{
	                                        DOM.val('#J_Promo2Value_'+data,lastEditValue);
	                                        Event.fire('#J_Promo2Value_'+data,'keyup');
	                                    }
	                                }
	                            }
	                        }
	                    }else if(ev.type == 'mouseenter'){
	                        DOM.addClass(ev.currentTarget,'current');
	                    }else{
	                        DOM.removeClass(ev.currentTarget,'current');
	                    }
	                })
	                //sku多规格价格提示框
	                if(!promotionControl.skuPriceTip){
	                    promotionControl.skuPriceTip = new Overly({
	                        width:260,
	                        elCls:'J_ShowSkuPriceTip'
	                    });
	                }
                    Event.delegate(document,"mouseenter mouseleave", '.J_ShowSkuPrice',function (e) {
                        var t = $(e.target);
                        if(e.type == 'mouseenter'){
                            var joinInfo = DOM.siblings(e.currentTarget,'.J_ItemSkuPrice');
                            var joinInfoHtml = DOM.html(joinInfo);
                            var h = Number(DOM.height(joinInfo)+37);
                            var cont = '<div class="bui-tooltip bui-ext-position ui-tip x-align-bottom x-align-tc-bc">'+
                            joinInfoHtml+
                            '<s class="x-align-arrow"><s class="x-align-arrow-inner"></s></s>';
                            promotionControl.skuPriceTip.set("content", cont);
                            promotionControl.skuPriceTip.set('align', {
                                node:t,
                                points:["bc", "tc"],
                                offset: [0, -h]
                            });
                            promotionControl.skuPriceTip.show();
                        }else{
                            promotionControl.skuPriceTip.hide();
                        }
                    });
				   //加入活动弹窗不在提醒
				   Event.delegate(document,'click','#J_noLonger',function(ev){
					   if(ev.currentTarget.checked == true){
						   S.Cookie.set('noLonger','yes'[30]); 
					   }else if(ev.currentTarget.checked == false){
						   S.Cookie.remove('noLonger'); 
					   }
				    });
				    /*加入宝贝授权*/
					Event.delegate(document,'click dblclick','.J_AddToPromo',function(ev){
						promotionControl.processStatus = 0;
						if(!showPermissions('editor_promotion',"编辑促销活动")){
							promotionControl.processStatus = 1;
				   			return ;
				   		}
						promotionControl.addBefore();
						var id = DOM.attr(ev.currentTarget,'data');
						if(id == 1 ){
							DOM.val('#J_ExpiredActionType','addItems');
							DOM.val('#J_joinType','all');
						}else{
							DOM.val('#J_ExpiredActionType','addItem');
							DOM.attr('#J_ExpiredActionType','data',id);
							DOM.val('#J_joinType',id);
						}
						DOM.removeAttr('#J_joinType','item-id');
						DOM.val('#J_joinAgain','');
						if(ev.type == 'click'){
							 clearTimeout(timeFunName);
				        	 timeFunName = setTimeout(function () {
				        		var sucess = function(o){
				        			if(o.payload >= 150 && !KISSY.inArray(typeId,['130','10','22','2','32','107','105','207'])){
		        			        	promotionControl.addAfter();
										new H.widget.msgBox({
										    title:"温馨提示",
										    content:'非全店活动宝贝数量不能大于150个，现在已经加入'+o.payload+'请删除多余的宝贝，或酌情分多次活动创建',
										    type:"info"
										});
										promotionControl.processStatus = 2;
		        			        }else{
		        			        	var diff  = IsExpired();
						       			if(diff > -5000 ){
					      					var sucessHandle = function(o) {
					      						promotionControl.joinLowestDis(id);
					      			 		};
					      			 		var errorHandle = function(o){
					      			 			KISSY.Event.fire('.J_TopExpired','click');
									 			promotionControl.addAfter();
									 			promotionControl.processStatus = 3;
					      			 		};
					      			 		var data = '';
					      			  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
						      			}else{
						      				promotionControl.joinLowestDis(id);
						      			}
		        			        }
				        			
	                         	};
						 		var error = function(o){
						 			promotionControl.addAfter();
									new H.widget.msgBox({
									    title:"错误提示",
									    content:o.desc,
									    type:"error"
									});
						 		};
						 		var data = 'promo_id='+pid;
						  	    new H.widget.asyncRequest().setURI(getPromoItemNumUrl).setMethod("GET").setHandle(sucess).setErrorHandle(error).setData(data).send();
		                      }, 300); 
			        	 };
			        	 
			        	 if(ev.type == 'dblclick'){
							 clearTimeout(timeFunName);
							 var sucess = function(o){
			        			if(o.payload >= 150 && !KISSY.inArray(typeId,['130','10','22','2','32','107','105','207'])){
	        			        	promotionControl.addAfter();
									new H.widget.msgBox({
									    title:"温馨提示",
									    content:'非全店活动宝贝数量不能大于150个，现在已经加入'+o.payload+'请删除多余的宝贝，或酌情分多次活动创建',
									    type:"info"
									});
									promotionControl.processStatus = 2;
	        			        }else{
	        			        	var diff  = IsExpired();
					       			if(diff > -5000 ){
				      					var sucessHandle = function(o) {
				      						promotionControl.joinLowestDis(id);
				      			 		};
				      			 		var errorHandle = function(o){
				      			 			KISSY.Event.fire('.J_TopExpired','click');
								 			promotionControl.addAfter();
								 			promotionControl.processStatus = 3;
				      			 		};
				      			 		var data = '';
				      			  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
					      			}else{
					      				promotionControl.joinLowestDis(id);
					      			}
	        			        }
			        			
                         	};
					 		var error = function(o){
					 			promotionControl.addAfter();
								new H.widget.msgBox({
								    title:"错误提示",
								    content:o.desc,
								    type:"error"
								});
					 		};
					 		var data = 'promo_id='+pid;
					  	    new H.widget.asyncRequest().setURI(getPromoItemNumUrl).setMethod("GET").setHandle(sucess).setErrorHandle(error).setData(data).send();
			        	 }; 
					});
					/*完成添加*/
					Event.on('#J_AddFinish','click',function(ev){
					    if(promotionControl.hasItems() && !promotionControl.isTarget){
					        var str = '<div class="msgBoxImage ui-msg"><span class="img-32-4"></span></div><div class="msgBoxContent">确定修改勾选宝贝？</div>';
                            new Overlay.Dialog({
                                title : '操作提示',
                                width : 440,
                                mask:true,
                                buttons:[
                                   {
                                     text:'确定',
                                     elCls : 'bui-button bui-button-primary',
                                     handler : function(){
                                         Event.fire('#J_BtmAddToPromo','click');
//                                         var load = new H.widget.msgBox({
//                                             content:"系统处理中，请等待!",
//                                             dialogType: "loading"
//                                         });
                                         var handler = function(){
                                                 switch(promotionControl.processStatus){
                                                     case 1 :
                                                     case 2 :
                                                     case 3 :
                                                     case 4 :
                                                     case 6 :
//                                                         load.hide();
                                                         clearInterval(timer);
                                                         break;
                                                     case 5 :
//                                                         load.hide();
                                                         clearInterval(timer);
                                                         promotionControl.isTarget = true;
                                                         window.location.href = finishPageUrl;
                                                         break;
                                                 }
                                         }
                                         var timer = setInterval( handler , 100);
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
                        }else{
                            window.location.href = finishPageUrl;
                        }
					});
					
					/*更新店铺折扣*/
					promotionControl.getLowestDis();
					Event.on('#J_updateDiscount','click',function(){
						DOM.val('#J_isDiscount','1');
						var diff  = IsExpired();
		    			if(diff > -5000 ){
							var sucessHandle = function(o) {
								promotionControl.getLowestDis();
					 		};
					 		var errorHandle = function(o){
					 			KISSY.Event.fire('.J_TopExpired','click');
					 		};
					 		var data = '';
					  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
			   			}else{
			   				promotionControl.getLowestDis();
			   			}
					});	
					
				//编辑活动中的宝贝折扣获取id
				Event.delegate(document,'click','.J_isEdit',function(ev){
				   var id = DOM.attr(ev.currentTarget,'pid');
				   var item_id = DOM.attr(ev.currentTarget,'item-id');
				   DOM.val('#J_joinType',id);
				   DOM.attr('#J_joinType',{'item-id':item_id});
			    });
				Event.on('#J_EditPromoItem','click',function(){
					DOM.val('#J_joinType','all');
				});	

				/*编辑宝贝授权 重启宝贝。批量编辑*/
				Event.delegate(document,'click dblclick','.J_removeToPromo',function(ev){
				   if(!showPermissions('editor_promotion',"编辑促销活动")){
					   return ;
		   		   }
				   DOM.val('#J_joinAgain','');
				   DOM.val('#J_joinType',DOM.attr(ev.currentTarget,'item-id'));
				   var type = DOM.attr(ev.currentTarget,'tid');
				   DOM.val('#J_ExpiredActionType',type);
				   if(type == 'editorOne'){
					   var idd = DOM.attr(ev.currentTarget,'data');
					   DOM.attr('#J_ExpiredActionType','data',idd);
					}else if(type == 'restartOne'){
						  idd = DOM.attr(ev.currentTarget,'data');
						  pidd = DOM.attr(ev.currentTarget,'pid');
						  DOM.attr('#J_ExpiredActionType','data',idd);
						  DOM.attr('#J_ExpiredActionType','pid',pidd);
					}
				    var diff  = IsExpired();
	       			 if(diff > -5000 ){
	      					var sucessHandle = function(o) {
      						    if(type == 'editorOne'){
								   promotionControl.editItem(idd);
								}else if(type == 'editorAll'){
									promotionControl.editPromoItem();
								}else if(type == 'restartOne'){
									 promotionControl.restartPromotionItemHandle(idd,pidd)
								}else if(type == 'restartAll' ){
									promotionControl.restartPromotionItemHandle();
								}else if(type == 'batchRetryAll'){
									promotionControl.batchRetry();
								}
	      			 		};
	      			 		var errorHandle = function(o){
	      			 			KISSY.Event.fire('.J_TopExpired','click');
	      			 		};
	      			 		var data = '';
	      			  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
	      			}else{
	      				 if(type == 'editorOne'){
						   promotionControl.editItem(idd);
						}else if(type == 'editorAll'){
							promotionControl.editPromoItem();
						}else if(type == 'restartOne'){
							 promotionControl.restartPromotionItemHandle(idd,pidd)
						}else if(type == 'restartAll' ){
							promotionControl.restartPromotionItemHandle();
						}else if(type == 'batchRetryAll'){
							promotionControl.batchRetry();
						}
	      			}
				})
				/*批量加入授权*/
				Event.delegate(document,'click dblclick','#J_BatchAddItems',function(ev){
					DOM.val('#J_ExpiredActionType','batchAdd');
					if(ev.type == 'click'){
			        	 clearTimeout(timeFunName);
			        	 timeFunName = setTimeout(function () {
	                         if(!showPermissions('editor_promotion',"编辑促销活动")){
	     			   			return ;
	     			   		 }
	     					DOM.attr('#J_BatchAddItems','disabled',true);
	     					DOM.replaceClass('#J_BatchAddItems','btm-caozuo-gray','btm-caozuo-gray-none');
	     					var diff  = IsExpired();
			       			 if(diff > -5000 ){
			      					var sucessHandle = function(o) {
			      						promotionControl.batchAddItems();
			      			 		};
			      			 		var errorHandle = function(o){
			      			 			DOM.attr('#J_BatchAddItems','disabled',false);
		     							DOM.replaceClass('#J_BatchAddItems','btm-caozuo-gray-none','btm-caozuo-gray');
		     				 			KISSY.Event.fire('.J_TopExpired','click');
			      			 		};
			      			 		var data = '';
			      			  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
			      			}else{
			      				promotionControl.batchAddItems();
			      			}
	                      }, 300); 
		        	}
                    if(ev.type == 'dblclick') {
                   	 clearTimeout(timeFunName); 
	                   	if(!showPermissions('editor_promotion',"编辑促销活动")){
				   			return ;
				   		 }
						DOM.attr('#J_BatchAddItems','disabled',true);
						DOM.replaceClass('#J_BatchAddItems','btm-caozuo-gray','btm-caozuo-gray-none');
						 var diff  = IsExpired();
		       			 if(diff > -5000 ){
		      					var sucessHandle = function(o) {
		      						promotionControl.batchAddItems();
		      			 		};
		      			 		var errorHandle = function(o){
		      			 			DOM.attr('#J_BatchAddItems','disabled',false);
	     							DOM.replaceClass('#J_BatchAddItems','btm-caozuo-gray-none','btm-caozuo-gray');
	     				 			KISSY.Event.fire('.J_TopExpired','click');
		      			 		};
		      			 		var data = '';
		      			  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
		      			}else{
		      				promotionControl.batchAddItems();
		      			}
                    }
				});
				
				/*同步宝贝*/
				Event.on('#J_SyncItemsButton','click', function(ev){
					var box = DOM.parent(ev.currentTarget);
					DOM.hide(box);
				    var submitHandle = function(o) {
						new H.widget.msgBox({
						    title:"温馨提示",
						    content:'同步数据请求成功，请点击搜索查看宝贝。如无法显示请过1分钟左右再查看！',
						    type:"info"
						
						});
						KISSY.later(function(box){DOM.show(box);},60000,false,null,box)
			        }
					var data = "";
					new H.widget.asyncRequest().setURI(syncItemsUrl).setHandle(submitHandle).setMethod("GET").setData(data).setDataType('json').send();
				});	
				
	    	    Event.on('#J_SearchBtn','click',promotionControl.searchTbItems); //搜索淘宝宝贝
	    	    Event.on('#J_RightSearchBtn','click',promotionControl.loadPromotionItems); //搜索活动中宝贝
	    	    Event.on('#J_CheckAll','click',promotionControl.checkAll);  //淘宝宝贝全选
	    	    Event.on('#J_TopCheckAll','click',promotionControl.checkAll);  //淘宝宝贝全选
	    	    Event.on('#J_BottonCheckAll','click',promotionControl.checkAll);  //淘宝宝贝全选
	    	    Event.on('#J_RightCheckAll','click',promotionControl.rightCheckAll); //活动中宝贝全选
	    	    Event.on('#J_RightBottonCheckAll','click',promotionControl.rightCheckAll); //活动中宝贝全选
	    	  	Event.on('#J_RemovePromotionItems','click',promotionControl.removePromotionItemHandle); //从活动中移除宝贝
	    	    Event.on('#J_PausePromotionItems','click',promotionControl.pausePromotionItemHandle); //从活动中暂停宝贝
	    	     //@todo 等切换列表处理后删除
//				Event.on('#J_Sort .sort','click',function(ev){
//					if(DOM.hasClass(ev.currentTarget,'current')){
//						return ;
//					}
//					DOM.removeClass(DOM.query('#J_Sort .sort'),'current');
//					DOM.addClass(ev.currentTarget,'current');
//					var data = DOM.attr(ev.currentTarget,'data')+':desc';
//					DOM.val('#J_SortValue',data);
//					promotionControl.searchTbItems();
//					DOM.html('#J_SortName',DOM.html(ev.currentTarget));
//				});
			   
	        },
	        searchReset : function(){
	            DOM.val('#J_StartPrice','');
	            DOM.val('#J_EndPrice','');
	            DOM.val('#J_SearchTitle','');
	            promotionControl.select.setSelectedValue('0');
                Event.fire('#J_CancelEditAll','click');
                DOM.hide('.J_BatchControlHolder');
	        },
	        //底部按钮固定(悬浮）
	        moveLayer : function(){
	            var btnHeight = DOM.height('#J_ControlBtm');
	            var viewportHeight = DOM.viewportHeight();
                var mainOffsetTop = DOM.offset('#J_IndexMain').top;
                var mainHeight = DOM.height('#J_IndexMain');
	            var btnOffsetTop = mainOffsetTop + mainHeight + btnHeight + 20;
	            var scrollTop = DOM.scrollTop(document);
	            var custonHeight = Number(scrollTop + viewportHeight);
                 if (btnOffsetTop < custonHeight) {
                     DOM.removeClass('#J_ControlBtm','fix-bottom');
                     DOM.hide('#J_BottomPlaceHolder');
                     return true;
                 } else {
                     DOM.addClass('#J_ControlBtm','fix-bottom');
                     DOM.show('#J_BottomPlaceHolder');
                     return false;
                }
	        },
	        //点击更新店铺设置最低折扣
	        getLowestDis : function(){
	        	var sucess = function(o){
	        		DOM.hide('#J_loadingDiscount');
	        		DOM.show('#J_storeDiscount');
	        		DOM.val('#J_Discount',o.payload);
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
	        
	        //宝贝加入活动获取店铺折扣判断
	        joinLowestDis : function(id){
	        	var sucess = function(o){
	        		DOM.hide('#J_loadingDiscount');
	        		DOM.show('#J_storeDiscount');
	        		DOM.val('#J_Discount',o.payload);
	        		DOM.text('#J_storeDiscount',o.payload+' 折');
	        		if(id == '1'){
						promotionControl.addSelectItemsToPromotion();
					}else{
						promotionControl.addSelectItemsToPromotion(id);
					}
				};
		 		var error = function(o){
		 			DOM.hide('#J_loadingDiscount');
		 			DOM.show('#J_storeDiscount');
		 			DOM.text('#J_storeDiscount','获取不到');
		 			
		 			if(!(S.Cookie.get('noLonger'))){
		 				promotionControl.addAfter();		 				
			 			checkBoxs = DOM.query("#J_TbItemList .J_CheckBox");
						var len = checkBoxs.length;
						//把优惠内容保存，获取优惠内容中最小值
						var privilegeJson = [];
						for(i=0; i<len; i++){
							if(checkBoxs[i].checked && !checkBoxs[i].disabled){
								var iid = checkBoxs[i].value;
			    				var z = DOM.val(DOM.get('#J_PromoValue_'+iid));
								privilegeJson.push(z);
							};
			            };
			            //把最低优惠内容写入J_minPrivilege
			            var PreferentialType = DOM.val('#J_PromoType_'+iid);
			            if(PreferentialType == 1){
			            	DOM.val('#J_minPrivilege',Math.min.apply(null,privilegeJson));
			            }else{
			            	DOM.val('#J_minPrivilege',Math.max.apply(null,privilegeJson));
			            }						
						var minPromoValue = DOM.val('#J_minPrivilege');
			 			new H.widget.msgBox({
			                title: "店铺折扣获取失败",
			                content: '您设置的宝贝最低折扣为 <em class="color-red">'+ minPromoValue +'</em> 折，请确保您的店铺最低折扣低于您的宝贝折扣<br />'+
			                		 '<a style="margin-right:50px;" target="_blank" href="http://ecrm.taobao.com/promotion/show_other_activity.htm">修改店铺最低折扣>></a>'+
			                		 '<input type="checkbox" id="J_noLonger"/>&nbsp;30天不提醒',
			                type: "confirm",
			                buttons: [{ value: "已修改完折扣，确定加入活动" }],
			                success: function (result) {
			                    if (result == "已修改完折扣，确定加入活动"){
			                    	DOM.val('#J_joinAgain','again');
			                    	if(id == '1'){
			    						promotionControl.addSelectItemsToPromotion();
			    					}else{
			    						promotionControl.addSelectItemsToPromotion(id);
			    					}
			                    }
			                }
			            });
		 			}else{
		 				if(id == '1'){
    						promotionControl.addSelectItemsToPromotion();
    					}else{
    						promotionControl.addSelectItemsToPromotion(id);
    					}
		 			}
		 			
		 		};
		 		DOM.show('#J_loadingDiscount');
		 		DOM.hide('#J_storeDiscount');
		 		var isLoading = DOM.val('#J_isDiscount');
		 		var data = 'fg='+isLoading;
		  	    new H.widget.asyncRequest().setURI(getLowestDisUrl).setMethod("GET").setHandle(sucess).setErrorHandle(error).setData(data).send(); 
	        },
	        
	        //弹窗确定加入活动获取折扣
	        getLowestDisAgain : function(){
	        	var joinType = DOM.val(DOM.get('#J_joinType'));
	        	var joinItemId = DOM.attr('#J_joinType','item-id');
	        	if(joinType == 'all'){
    				if(joinItemId != undefined){
        				promotionControl.editPromoItem();
        			}else{
        				promotionControl.addSelectItemsToPromotion();
        			}
        		}else{
        			if(joinItemId != undefined){
        				promotionControl.editPromoItem(joinType,joinItemId);
        			}else{
        				promotionControl.addSelectItemsToPromotion(joinType);
        			}
        		};
        		clearTimeout(timeFunName);
	        	var timeFunName = setTimeout(function () {
	        		var sucess = function(o){
	            		DOM.hide('#J_loadingDiscount');
		        		DOM.show('#J_storeDiscount');
	        			DOM.val('#J_Discount',o.payload);
		        		DOM.text('#J_storeDiscount',o.payload+' 折');
					};
					var error = function(o){
			 			DOM.hide('#J_loadingDiscount');
			 			DOM.show('#J_storeDiscount');
			 			DOM.text('#J_storeDiscount',o.desc);
			 		};
					DOM.show('#J_loadingDiscount');
			 		DOM.hide('#J_storeDiscount');
			 		var isLoading = DOM.val('#J_isDiscount');
			 		var data = 'fg='+1;
			  	    new H.widget.asyncRequest().setURI(getLowestDisUrl).setMethod("GET").setHandle(sucess).setErrorHandle(error).setData(data).send(); 
	        	},500);
	        },
	        
	      //弹出确定加入活动
	        getLowestDisAdd : function(){
	        	var diff  = IsExpired();
    			if(diff > -5000 ){
					var sucessHandle = function(o) {
						promotionControl.getLowestDisAgain();
			 		};
			 		var errorHandle = function(o){
			 			KISSY.Event.fire('.J_TopExpired','click');
			 		};
			 		var data = '';
			  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
	   			}else{
	   				promotionControl.getLowestDisAgain();
	   			}
	        },
	        
	        //清除淘宝特价
	        deleteTbSpec : function(itemId,type){
				if(!showPermissions('editor_promotion',"编辑促销活动")){
		   			return ;
		   		}
	        	var submitHandle = function(o){
        				if(promotionControl.paginator){
							promotionControl.paginator.toPage(promotionControl.paginator.page);
						}else{
							promotionControl.searchPromoItems();
						}
	        	};
	        	var error = function(o){
					DOM.show('#J_deleteTbSpec_'+itemId);
					DOM.hide('#J_MinLoading_'+itemId);
	        	};
				DOM.hide('#J_deleteTbSpec_'+itemId);
				DOM.show('#J_MinLoading_'+itemId);
	        	var data = "item_id="+itemId;
	        	new H.widget.asyncRequest().setURI(delTbSpecUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(error).setData(data).setDataType('json').send();
	        },
	        //批量添加宝贝
	        batchAddItems: function() {
				if(!showPermissions('editor_promotion',"编辑促销活动")){
	   				return ;
		   		}
	        	var submitHandle = function(o) {
					new H.widget.msgBox({
						    title:"成功提示",
						    content:'操作成功',
						    type:"info"
						});
	        		S.later(function(){window.location.reload();},1000,false ,null,null);
	        	};
	            var data = "&pid="+pid;
	    		var cid = DOM.val(DOM.get("#J_SelectItemCid"));
	    		if(DOM.val(DOM.get("#J_SearchTitle")) != '关键字、商品链接、商品编码'){
	    			var title = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle"))); //标题
	        	}else{
	        	    var title ='';
	        	}
		    	var type = DOM.val(DOM.get("#J_SearchSelling"));
		    	data += "&title="+title+"&cid="+cid+"&type="+type;
	    	    var startPrice = DOM.val(DOM.get("#J_StartPrice"));
	    	    var endPrice = DOM.val(DOM.get("#J_EndPrice"));
	    	    data += "&start_price="+startPrice+"&end_price="+endPrice;
	        	DOM.attr('#J_BatchAddItems','disabled',true);
				DOM.replaceClass('#J_BatchAddItems','btm-caozuo-gray','btm-caozuo-gray-none');
	        	new H.widget.asyncRequest().setURI(batchAddUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			},
			getParamsData : function(){
				if(DOM.val(DOM.get("#J_SearchTitle")) != '关键字、商品链接、商品编码'){
        	    	var title = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle"))); //标题
        	    }else{
        	    	var title ='';
        	    }
				var is_filter = DOM.val('#J_filter');//过滤活动宝贝
				var pids = DOM.val('#J_FilterGrade'); //高级过滤
                var cid = DOM.val(DOM.get("#J_SelectItemCidHide")); //类目
    	    	var type = DOM.val(DOM.get("#J_TBTabType")); //出售中 库中
    	    	var sortvalue = DOM.val('#J_SortValue');
    	    	if(sortvalue == 0 || sortvalue == 1){
    	    	    //@todo 没有上架时间：早 晚 的差别，默认设为0（早）；
//					var itemOrder = DOM.val(DOM.get("#J_SelectItemOrder"));//排序方式
					var itemOrder = 0;//排序方式
				}else{
					var itemOrder = sortvalue;//排序方式
				}
    	    	var itemPage = DOM.val(DOM.get("#J_SelectItemPage"));//每页多少条
    	    	var data = "q="+title+"&cid="+cid+"&type="+type;
            	    data +="&itemOrder="+itemOrder+"&pageSize=10";
					data +="&pid="+pid;
					data +="&is_filter="+is_filter;
					data +="&pids="+pids;
//    	    	if (type == 0) {
					//价格区间
					var startPrice = DOM.val(DOM.get("#J_StartPrice"));
					var endPrice = DOM.val(DOM.get("#J_EndPrice"));
					data += "&start_price="+startPrice+"&end_price="+endPrice;
//				}
				return data ;
			},
	        
	       //搜索淘宝宝贝
	        searchTbItems : function() {
                var submitHandle = function(o) {
                	DOM.removeClass(".J_ItemSelectBtnHolder",'ks-hidden');
                	DOM.get("#J_NoteIcon").style.display = 'none';
	        	    totalRecords = o.payload.totalRecords;
					if(totalRecords > 0){
						DOM.get('#J_LEmpty').style.display = 'none';
						DOM.css(DOM.query(".J_ItemSelectBtnHolder"),'display' ,'');
					} else {
						DOM.get('#J_LEmpty').style.display = '';
						DOM.css(DOM.query(".J_ItemSelectBtnHolder"),'display' ,'none');
					}
					promotionControl.renderItems(o.payload.body);
					DOM.html('#J_CountPromo',o.payload.count_promo);
					DOM.html('#J_CountPause',o.payload.count_pause);
					DOM.html('#J_CountFail',o.payload.count_fail);
					pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
                    //底部悬浮
                    if(totalRecords > o.payload.pageNum){
                        DOM.addClass('#J_ControlBtm','fix-bottom');
                        DOM.show('#J_BottomPlaceHolder');
                        window.onscroll=function() {
                            promotionControl.moveLayer();
                        };
                    }
					promotionControl.paginator = new showPages('promotionControl.paginator').setRender(promotionControl.handlePagination).setPageCount(pageCount).printHtml('#J_Paging',2);
					promotionControl.paginator = new showPages('promotionControl.paginator').setRender(promotionControl.handlePagination).setPageCount(pageCount).printHtml('#J_TopPaging',3);
					DOM.hide('#J_TopPaging .count');
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
				var data = promotionControl.getParamsData();
				DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainLeftContent');
        	    new H.widget.asyncRequest().setURI(getItemsFromTbUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).setDataType('json').send();
			},
			// 渲染 TbItems
			renderItems: function(c) {
				DOM.html(DOM.get("#J_TbItemList"), c,true);
				var sortvalue = DOM.val('#J_SortValue');
    	    	if (sortvalue == 0 || sortvalue == 1) {
					DOM.hide(DOM.query('.J_NormVal'));
					DOM.html('#J_SortName','')
				}else{
					DOM.show(DOM.query('.J_NormVal'));
				}
                promotionControl.Form.setCheckboxOff(DOM.get('#J_TopCheckAll'));
                promotionControl.Form.setCheckboxOff(DOM.get('#J_BottonCheckAll'));
    			var oTriggers = DOM.query('#J_TbItemList .J_CheckBox');
                Event.on(oTriggers, "click", promotionControl.checkBoxClick);
//                @todo input框样式改变，已不需要
//                var inputs = DOM.filter (DOM.query('input'),function(i){if(i.type =='text')return true;})
//            	Event.on(inputs,'focus blur',function(ev){
//            		if(ev.type == 'focus'){
//            			DOM.removeClass(ev.target,'input-text text text-error');
//            			DOM.addClass(ev.target,'input-text-on');
//            		} else if(ev.type == 'blur'){
//            			DOM.removeClass(ev.target,'input-text-on');
//            			DOM.addClass(ev.target,'input-text');
//            		}
//            	});
                //已参加活动提示框
//                var joinTip = new Tooltip.Tips({
//                    tip : {
//                        trigger : '.J_ShowTbJoin', 
//                        alignType : 'top',
//                        elCls : 'ui-tip',
//                        title : 'll324',
//                        titleTpl : '<div class="ui-tip-text">3333{title}</div>',
//                        offset : 10 //距离左边的距离
//                    }
//                });
//                joinTip.render();
                //批量设置宝贝提示框
                var joinPopup = new Overly({
                    width:160,
                    elCls:'J_ShowTbJoinPop'
                });
                var showTimer = null;
                Event.on('.J_ShowTbJoin',"mouseenter", function (e) {
                    var t = $(e.target);
                    if(showTimer)showTimer.cancel();
                    var joinInfo = DOM.siblings(e.currentTarget,'.J_TbItemJoin');
                    var joinInfoHtml = DOM.html(joinInfo);
                    var h = Number(DOM.height(joinInfo)+57);
                    var cont = '<div class="bui-tooltip bui-ext-position ui-tip x-align-bottom x-align-tc-bc">'+
                                joinInfoHtml+
                                '<s class="x-align-arrow"><s class="x-align-arrow-inner"></s></s>';
                    joinPopup.set("content", cont);
                    joinPopup.set('align', {
                        node:t,
                        points:["bc", "tc"],
                        offset: [0, -h]
                    });
                    joinPopup.show();
                });
                Event.on('.J_ShowTbJoin',"mouseleave", function (e) {
                    showTimer = S.later(function(){
                        joinPopup.hide();
                    },1800,false);
                });
//                @todo 鼠标在pop继续显示
//                Event.on('.J_ShowTbJoinPop','mouseenter mouseleave',function(ev){
//                    if(ev.type == 'mouseenter'){
//                        showTimer.cancel();
//                    }else{
//                        joinPopup.hide();
//                    }
//                })
                //多种价格展示
                var pricePopup = new Overly({
                    width:160,
                    elCls:'J_ShowTbJoinPop'
                });
                Event.on('.J_ShowPriceTip',"mouseenter mouseleave", function (e) {
                    if(e.type == 'mouseenter'){
                        var t = $(e.target);
                        var joinInfo = DOM.siblings(e.currentTarget,'.J_PriceTip');
                        var joinInfoHtml = DOM.html(joinInfo);
                        var h = Number(DOM.height(joinInfo)+67);
                        var cont = '<div class="bui-tooltip bui-ext-position ui-tip x-align-bottom x-align-tc-bc">'+
                        joinInfoHtml+
                        '<s class="x-align-arrow"><s class="x-align-arrow-inner"></s></s>';
                        pricePopup.set("content", cont);
                        pricePopup.set('align', {
                            node:t,
                            points:["bc", "tc"],
                            offset: [0, -h]
                        });
                        pricePopup.show();
                    }else{
                        pricePopup.hide();
                    }
                });
                //鼠标切换优惠输入框（打折或减价）效果改变（focus） 及 保存编辑的状态供下次输入使用（blur）
                Event.on('.J_SpecType','focus blur',function(ev){
                    var evId = DOM.attr(ev.currentTarget,'data');
                    var evType = DOM.attr(ev.currentTarget,'promoType');
                    var evValue = DOM.val(ev.currentTarget);
                    if(ev.type == 'focus'){
                        if(!DOM.hasClass(ev.currentTarget,'input-price-focus')){
                            DOM.removeClass(ev.currentTarget,'input-price');
                            DOM.removeClass(ev.currentTarget,'text-error');
                            DOM.addClass(ev.currentTarget,'input-price-focus');
                            DOM.replaceClass(DOM.siblings(ev.currentTarget,'.J_SpecType'),'input-price-focus','input-price');
                            DOM.val('#J_PromoType_'+evId,evType);
                        }
                    }else{
                        DOM.val('#J_LastEditMode',evType);
                        DOM.val('#J_LastEditValue',evValue);
                    }
                })
                
                promotionControl.Form.renderAll('#J_TbItemList');
			},
			checkBoxClick : function(e) {
				var id = this.value;
				var promoBox = DOM.get('#J_PromoBox_'+id);
				var operation = DOM.get('#J_Operation_'+id);
				var tejia = DOM.get('#J_tejia_'+id);
                var lastEditValue = DOM.val('#J_LastEditValue');
                var lastEditMode = DOM.val('#J_LastEditMode');
				DOM.hide('#J_BatchTip');
				if(!this.checked){
                    promotionControl.Form.setCheckboxOff(DOM.get('#J_BottonCheckAll'));
                    promotionControl.Form.setCheckboxOff(DOM.get('#J_TopCheckAll'));
                    DOM.addClass([promoBox,operation,tejia], 'ks-hidden');
                    if(lastEditValue != 'none'){
                        if(lastEditMode == '1'){
                            DOM.val('#J_PromoValue_'+id,lastEditValue);
                            Event.fire('#J_PromoValue_'+id,'keyup');
                        }else{
                            DOM.val('#J_Promo2Value_'+id,lastEditValue);
                            Event.fire('#J_Promo2Value_'+id,'keyup');
                        }
                    }
				}else{
				    DOM.removeClass([promoBox,operation,tejia], 'ks-hidden');
				}
//				if (DOM.hasClass(promoBox, 'ks-hidden')) {
//					DOM.removeClass([promoBox,operation,tejia], 'ks-hidden');
//				} else {
//					DOM.addClass([promoBox,operation,tejia], 'ks-hidden');
//				}
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
	                    if(pageId != pageCount && totalRecords > o.payload.pageNum){
	                        //底部悬浮
	                        DOM.addClass('#J_ControlBtm','fix-bottom');
	                        DOM.show('#J_BottomPlaceHolder');
	                        window.onscroll=function() {
	                            promotionControl.moveLayer();
	                        };
	                    }
	    			promotionControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_Paging',2);
	    			promotionControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_TopPaging',3);
	        	    promotionControl.renderItems(o.payload.body);
                    DOM.html('#J_CountPromo',o.payload.count_promo);
                    DOM.html('#J_CountPause',o.payload.count_pause);
                    DOM.html('#J_CountFail',o.payload.count_fail);
					DOM.hide('#J_LeftLoading');
					DOM.show('#J_MainLeftContent');
		    	};
				var data = promotionControl.getParamsData();
				data+="&page_id="+pageId;
				DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainLeftContent');
        	    new H.widget.asyncRequest().setURI(getItemsFromTbUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			},

			//淘宝宝贝全选
			checkAll : function(e) {
                DOM.hide('#J_BatchTip');
				checkBoxs = DOM.query('#J_TbItemList .J_CheckBox');
				var len = checkBoxs.length;
				for(i=0; i<len; i++){
					var iid = checkBoxs[i].value;
					if(checkBoxs[i].disabled) continue;
					if(this.checked){
						DOM.removeClass(DOM.get('#J_PromoBox_'+iid), 'ks-hidden');
						DOM.removeClass(DOM.get('#J_Operation_'+iid), 'ks-hidden');
						DOM.removeClass(DOM.get('#J_tejia_'+iid), 'ks-hidden');
                        if(e.currentTarget.id == 'J_TopCheckAll'){
                            promotionControl.Form.setCheckboxOn(DOM.get('#J_BottonCheckAll'));
                        }else{
                            promotionControl.Form.setCheckboxOn(DOM.get('#J_TopCheckAll'));
                        }
                        promotionControl.Form.setCheckboxOn(checkBoxs[i]);
					} else {
						DOM.addClass(DOM.get('#J_tejia_'+iid), 'ks-hidden');
						DOM.addClass(DOM.get('#J_PromoBox_'+iid), 'ks-hidden');
						DOM.addClass(DOM.get('#J_Operation_'+iid), 'ks-hidden');
						if(e.currentTarget.id == 'J_TopCheckAll'){
                            promotionControl.Form.setCheckboxOff(DOM.get('#J_BottonCheckAll'));
                        }else{
                            promotionControl.Form.setCheckboxOff(DOM.get('#J_TopCheckAll'));
                        }
                        promotionControl.Form.setCheckboxOff(checkBoxs[i]);
					}
				}
			},
			//活动中宝贝全选
			rightCheckAll : function(e) {
                DOM.hide('#J_BatchTip');
                checkBoxs = DOM.query("#J_PromotionItemList .J_CheckBox");
                len = checkBoxs.length;
                for(i=0; i<len; i++){
                    var iid = checkBoxs[i].value;
                    if(checkBoxs[i].disabled) continue;
                    if(this.checked){
                        if(e.currentTarget.id == 'J_RightCheckAll'){
                            promotionControl.Form.setCheckboxOn(DOM.get('#J_RightBottonCheckAll'));
                        }else{
                            promotionControl.Form.setCheckboxOn(DOM.get('#J_RightCheckAll'));
                        }
                        promotionControl.Form.setCheckboxOn(checkBoxs[i]);
                    } else {
                        if(e.currentTarget.id == 'J_RightCheckAll'){
                            promotionControl.Form.setCheckboxOff(DOM.get('#J_RightBottonCheckAll'));
                        }else{
                            promotionControl.Form.setCheckboxOff(DOM.get('#J_RightCheckAll'));
                        }
                        promotionControl.Form.setCheckboxOff(checkBoxs[i]);
                    }
                }
			},
			//搜索活动中宝贝
	    	loadPromotionItems :function() {
		    	var submitHandle = function(o) {
	        	    totalRecords = o.payload.totalRecords;
	        	    if(totalRecords > 0){
						DOM.get('#J_REmpty').style.display = 'none';	
						DOM.css(DOM.query(".J_PromotionItemBtnHolder"),'display' ,'');
						//部分参与：满就送，订单限购，部分参与 免邮
						if(KISSY.inArray(typeId,['108','106','111','208']) && o.payload.sucNum == 1){
								new H.widget.msgBox({
								    title:"温馨提示",
								    content:'淘宝规定该活动宝贝数量至少<em style="color:red">2</em>个才可生效，请再添加宝贝！&nbsp;&nbsp;<a target="_blank" href="http://bangpai.taobao.com/group/thread/474028-276305668.htm">查看官方规则</a>',
								    type:"info",
								  	buttons: [{ value: "添加宝贝" }],
				   				 	success: function (result) {
										if(result == '添加宝贝'){
											tabs.switchTo(0)
										}
									}
								});
						}
//						if(totalRecords > 150){
//							var str = '<div class="point"><span>非全店活动宝贝数量不能大于150个，请删除多余的宝贝，或酌情分多次活动创建</span><br/><div style="width:80px;" class="btm-content btm-margin-30auto"><input name="" type="button" value="关闭" onclick="promotionControl.msg.hide()" class="btm-68-orange fl" style="display:inline" /></div></div>'; 
//							promotionControl.msg.setHeader('温馨提示').setMsg(str).showDialog();	
//						}
						DOM.val('#J_TotalPromoItems',totalRecords);
						
					} else { 
						DOM.get('#J_REmpty').style.display = '';
						DOM.css(DOM.query(".J_PromotionItemBtnHolder"),'display' ,'none');
					}
	        	    DOM.html('#J_CountPromo',o.payload.count_promo);
	        	    DOM.html('#J_CountPause',o.payload.count_pause);
	        	    DOM.html('#J_CountFail',o.payload.count_fail);
	        	    DOM.html(DOM.get("#J_PromotionItemList"), o.payload.body,true);
	        	   
				   var oTriggers = DOM.query('#J_PromotionItemList .J_CheckBox');
	                Event.on(oTriggers, "click", function(ev){
                        DOM.hide('#J_BatchTip');
						if(!this.checked){
                            promotionControl.Form.setCheckboxOff(DOM.get('#J_RightBottonCheckAll'));
                            promotionControl.Form.setCheckboxOff(DOM.get('#J_RightCheckAll'));
						}
					});
					DOM.hide('#J_RightLoading');
					DOM.show('#J_MainRightContent');
//					@todo input框状态旧版，待删除
//	        	    var inputs = DOM.filter (DOM.query('input'),function(i){if(i.type =='text')return true;})
//	        	    Event.on(inputs,'focus blur',function(ev){
//	            		if(ev.type == 'focus'){
//	            			DOM.removeClass(ev.target,'input-text text text-error');
//	            			DOM.addClass(ev.target,'input-text-on');
//	            		} else if(ev.type == 'blur'){
//	            			DOM.removeClass(ev.target,'input-text-on');
//	            			DOM.addClass(ev.target,'input-text');
//	            		}
//	            	});
	                //鼠标切换优惠输入框（打折或减价）效果改变
	                Event.on('.J_SpecType','focus',function(ev){
	                    var evId = DOM.attr(ev.currentTarget,'data');
	                    var evType = DOM.attr(ev.currentTarget,'promoType');
	                    if(!DOM.hasClass(ev.currentTarget,'input-price-focus')){
	                        DOM.removeClass(ev.currentTarget,'input-price');
	                        DOM.addClass(ev.currentTarget,'input-price-focus');
	                        DOM.replaceClass(DOM.siblings(ev.currentTarget,'.J_SpecType'),'input-price-focus','input-price');
	                        DOM.val('#J_PromoType_'+evId,evType);
	                    }
	                })
                    promotionControl.Form.renderAll('#J_PromotionItemList');
	        	    pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
	        	    //底部悬浮
	        	    if(totalRecords > o.payload.pageNum){
	        	        DOM.addClass('#J_ControlBtm','fix-bottom');
                        DOM.show('#J_BottomPlaceHolder');
	        	        window.onscroll=function() {
                            promotionControl.moveLayer();
                        };
	        	    }
					promotionControl.promotionItemPaginator = new showPages('promotionControl.promotionItemPaginator').setRender(promotionControl.promotionItemPaginationHandle).setPageCount(pageCount).printHtml('#J_PromotionItemPaging',2);
		    	};
		    	 if(DOM.val(DOM.get("#J_SearchTitle")) != '关键字、商品链接、商品编码'){
        	    	var title = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle"))); //标题
        	    }else{
        	    	var title ='';
        	    }
        	    var status = DOM.val(DOM.get('#J_PromoTabType'));
        	    var itemPage = 10//每页多少条
        	    var data = "promo_id="+promotionId+"&status="+status+"&title="+title+"&pageSize="+itemPage;
				var startPrice = DOM.val(DOM.get("#J_StartPrice"));
	    	    var endPrice = DOM.val(DOM.get("#J_EndPrice"));
	    	    data += "&start_price="+startPrice+"&end_price="+endPrice;
				DOM.show('#J_RightLoading');
				DOM.hide('#J_MainRightContent');
        	    new H.widget.asyncRequest().setURI(loadPromotionItemsUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			},
			
			promotionItemPaginationHandle : function(turnTo,flag) {
				pageId = turnTo;
	    		var submitHandle = function(o) {
	    			DOM.get("#J_RightCheckAll").checked = false;
	    			totalRecords = o.payload.totalRecords;
	        	    if(totalRecords > 0){
						DOM.get('#J_REmpty').style.display = 'none';	
						DOM.css(DOM.query(".J_PromotionItemBtnHolder"),'display' ,'');
						DOM.val('#J_TotalPromoItems',totalRecords);
						//部分参与：满就送，订单限购，部分参与 免邮
						if( KISSY.inArray(typeId,['108','106','111','208'])&& o.payload.sucNum == 1){
								new H.widget.msgBox({
									    title:"温馨提示",
									    content:'部分参与活动宝贝数量需<em style="color:red">至少两个</em>，否则活动不会生效！',
									    type:"info",
									  	buttons: [{ value: "添加宝贝" }],
					   				 	success: function (result) {
											if(result == '添加宝贝'){
												tabs.switchTo(0)
											}
										}
									});
						}
//						if(totalRecords > 150){
//							var str = '<div class="point"><span>非全店活动宝贝数量不能大于150个，请删除多余的宝贝，或酌情分多次活动创建</span><br/><div style="width:80px;" class="btm-content btm-margin-30auto"><input name="" type="button" value="关闭" onclick="promotionControl.msg.hide()" class="btm-68-orange fl" style="display:inline" /></div></div>'; 
//							promotionControl.msg.setHeader('温馨提示').setMsg(str).showDialog();	
//						}
						DOM.val('#J_TotalPromoItems',totalRecords);
					} else { 
						DOM.get('#J_REmpty').style.display = '';
						DOM.css(DOM.query(".J_PromotionItemBtnHolder"),'display' ,'none');
					}
                    promotionControl.Form.renderAll('#J_PromotionItemList');
		    		pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
		    		if(pageId != pageCount && totalRecords > o.payload.pageNum){
	                    //底部悬浮
		    		    DOM.addClass('#J_ControlBtm','fix-bottom');
                        DOM.show('#J_BottomPlaceHolder');
		    		    window.onscroll=function() {
	                        promotionControl.moveLayer();
	                    };
		    		}
	    			promotionControl.promotionItemPaginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_PromotionItemPaging',2);
                    DOM.html('#J_CountPromo',o.payload.count_promo);
                    if(o.payload.count_pause != 0){
                    	DOM.show('#J_pauseItem');
                    	DOM.html('#J_CountPause',o.payload.count_pause);
                    }else{
                    	DOM.hide('#J_pauseItem');
                    }
                    if(o.payload.count_fail != 0){
                    	DOM.show('#J_failureItem');
                    	DOM.html('#J_CountFail',o.payload.count_fail);
                    }else{
                    	DOM.hide('#J_failureItem');
                    }
                    if((o.payload.count_pause == 0) && (o.payload.count_fail == 0)){
                    	DOM.addClass('#J_InActivity','last');
                    }else{
                    	DOM.removeClass('#J_InActivity','last');
                    }
	    			DOM.html(DOM.get("#J_PromotionItemList"), o.payload.body);
					var oTriggers = DOM.query('#J_PromotionItemList .J_CheckBox');
		         	Event.on(oTriggers, "click", function(ev){
						if(!this.checked){
							DOM.attr('#J_RightCheckAll','checked',false);
						}
					});
					if(flag != 'update'){
						DOM.hide('#J_RightLoading');
						DOM.show('#J_MainRightContent');
					}
//                  @todo input框状态旧版，待删除
//	        	    var inputs = DOM.filter (DOM.query('input'),function(i){if(i.type =='text')return true;})
//	        	    Event.on(inputs,'focus blur',function(ev){
//	            		if(ev.type == 'focus'){
//	            			DOM.removeClass(ev.target,'input-text text text-error');
//	            			DOM.addClass(ev.target,'input-text-on');
//	            		} else if(ev.type == 'blur'){
//	            			DOM.removeClass(ev.target,'input-text-on');
//	            			DOM.addClass(ev.target,'input-text');
//	            		}
//	            	});
	                //鼠标切换优惠输入框（打折或减价）效果改变
	                Event.on('.J_SpecType','focus',function(ev){
	                    var evId = DOM.attr(ev.currentTarget,'data');
	                    var evType = DOM.attr(ev.currentTarget,'promoType');
	                    if(!DOM.hasClass(ev.currentTarget,'input-price-focus')){
	                        DOM.removeClass(ev.currentTarget,'input-price');
	                        DOM.removeClass(ev.currentTarget,'text-error');
	                        DOM.addClass(ev.currentTarget,'input-price-focus');
	                        DOM.replaceClass(DOM.siblings(ev.currentTarget,'.J_SpecType'),'input-price-focus','input-price');
	                        DOM.val('#J_PromoType_'+evId,evType);
	                    }
	                })
		    	};
				if(flag != 'update'){
					DOM.show('#J_RightLoading');
					DOM.hide('#J_MainRightContent');
				}
		    	 if(DOM.val(DOM.get("#J_SearchTitle")) != '关键字、商品链接、商品编码'){
        	    	var title = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle"))); //标题
        	    }else{
        	    	var title ='';
        	    }
	        	 var itemPage = 10;//每页多少条
	        	 var status = DOM.val(DOM.get('#J_PromoTabType'));
	        	 var data = "promo_id="+promotionId+"&status="+status+"&title="+title+"&page_id="+pageId+"&pageSize="+itemPage;
	        	 var startPrice = DOM.val(DOM.get("#J_StartPrice"));
	    	     var endPrice = DOM.val(DOM.get("#J_EndPrice"));
	    	     data += "&start_price="+startPrice+"&end_price="+endPrice; 
				new H.widget.asyncRequest().setURI(loadPromotionItemsUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			},
			
			//将活动中宝贝移除
			removePromotionItemHandle : function(promo_itemid,pidi,type) {
				if(!showPermissions('editor_promotion',"编辑促销活动")){
		   			return ;
		   		 }
				 if (type == 'promoItems') {
				 	var typeId = DOM.val('#J_TypeIdItem_'+promo_itemid);
				 }
				 if(typeId == 10){
				 	var diff  = IsExpired();
					 if(diff > -5000 ){
							var sucessHandle = function(o) {
								promotionControl.deletePromotionItemHandle(promo_itemid,pidi,type);
					 		};
					 		var errorHandle = function(o){
					 			KISSY.Event.fire('.J_TopExpired','click');
					 		};
					 		var data = '';
					  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
					 }else{
						promotionControl.deletePromotionItemHandle(promo_itemid,pidi,type);	
					 }
					
				 }else{
					promotionControl.deletePromotionItemHandle(promo_itemid,pidi,type);
				 }
			},
			deletePromotionItemHandle : function(promo_itemid,pidi,type){
			    
	             var str = '<div class="msgBoxImage ui-msg"><span class="img-32-4"></span></div><div class="msgBoxContent">确定删除吗？</div>';
	                new Overlay.Dialog({
	                    title : '删除提示',
	                    width : 440,
	                    mask:true,
	                    buttons:[
	                       {
	                         text:'确定',
	                         elCls : 'bui-button bui-button-primary',
	                         handler : function(){
	                             itemIds = [];
	                             if(type == 'promoItems'){
	                                 DOM.hide('#J_RemovePromo_'+promo_itemid);
	                                 DOM.show('#J_MinLoading_'+promo_itemid);
	                             }else{
	                                 DOM.attr('#J_RemovePromotionItems','disabled',true);
	                                 DOM.replaceClass('#J_RemovePromotionItems','btm-caozuo-orange','btm-caozuo-gray-none');
	                             }
	                             if(promo_itemid && pidi){
	                                 itemIds.push(promo_itemid);
	                                 pid = pidi;
	                             }else{
	                                 checkBoxs = DOM.query("#J_PromotionItemList .J_CheckBox");
	                                 var len = checkBoxs.length;
	                                 for(i=0; i<len; i++){
	                                     if(checkBoxs[i].checked && !checkBoxs[i].disabled){
	                                         itemIds.push(checkBoxs[i].value);
	                                     }
	                                 }
	                                 if(itemIds.length == 0){
	                                     new H.widget.msgBox({
	                                         title:"错误提示",
	                                         content:'未选择任何宝贝！',
	                                         type:"error",
	                                         autoClose:true,
	                                         timeOut :2000
	                                         
	                                     });
	                                     DOM.attr('#J_RemovePromotionItems','disabled',false);
	                                     DOM.replaceClass('#J_RemovePromotionItems','btm-caozuo-gray-none','btm-caozuo-orange');
	                                     return ;
	                                 }
	                             }
	                             var submitHandle = function(o) {
	                                 DOM.attr('#J_RemovePromotionItems','disabled',false);
	                                 DOM.replaceClass('#J_RemovePromotionItems','btm-caozuo-gray-none','btm-caozuo-orange');
	                                 if (promotionControl.promotionItemPaginator) {
	                                     promotionControl.promotionItemPaginator.toPage(promotionControl.promotionItemPaginator.page, 'update');
	                                 }else {
	                                     promotionControl.loadPromotionItems();
	                                 }
	                             };
	                             var data = "pid="+pid+"&item_ids="+itemIds+"&form_key="+FORM_KEY;
	                             //alert(data);return;
	                             new H.widget.asyncRequest().setURI(removePromotionItemUrl).setMethod("POST").setHandle(submitHandle).setData(data).send();
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
			    
			},
			hasItems: function() {
				checkBoxs = DOM.query("#J_TbItemList .J_CheckBox");
				var len = checkBoxs.length;
				var flag = false;
				for(i=0; i<len; i++){
					if(checkBoxs[i].checked && !checkBoxs[i].disabled){
						flag = true ;
						break;
					}
	            }
				return flag;
			},
			//添加宝贝到活动中
			addSelectItemsToPromotion: function(iid) {
				promotionControl.addBefore();
				checkBoxs = DOM.query("#J_TbItemList .J_CheckBox");
				var json = [];
				var longTitleItemIds = [];
				itemXml = '';
				var error = false;
				var len = checkBoxs.length;
				var translateDiv = DOM.get("#J_Translate");
				
				
				//把优惠内容保存，获取优惠内容中最小值
                var PreferentialType = DOM.val('#J_PromoType_'+id);
				var privilegeJson = [];
				for(i=0; i<len; i++){
					if(checkBoxs[i].checked && !checkBoxs[i].disabled){
						var id = checkBoxs[i].value;
						if(PreferentialType == 1){
						    var z = DOM.val(DOM.get('#J_PromoValue_'+id));
						}else{
						    var z = DOM.val(DOM.get('#J_Promo2Value_'+id)); 
						}
						privilegeJson.push(z);
					};
	            };
	            //把最低优惠内容写入J_minPrivilege
	            if(PreferentialType == 1){
	            	DOM.val('#J_minPrivilege',Math.min.apply(null,privilegeJson));
	            }else{
	            	DOM.val('#J_minPrivilege',Math.max.apply(null,privilegeJson));
	            }

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
						
						//无条件免邮，一口价，一件优惠 限时折扣 限购不限制 150个
						if(totalNum > 150 && !KISSY.inArray(typeId,['130','10','22','2','32','107','105','207'])){
							new H.widget.msgBox({
							    title:"温馨提示",
							    content:'非全店活动宝贝数量不能大于150个，现在已经加入'+totalNum+'请删除多余的宝贝，或酌情分多次活动创建！',
							    type:"info"
							});
							break;
						}else{
							 DOM.val('#J_TotalPromoItems',totalNum);
						}
						
						var id = checkBoxs[i].value;
    					var title = itemCheck.strProcess(DOM.val(DOM.get('#J_ItemTitle_'+id)));
        				var picUrl = DOM.val(DOM.get('#J_ItemPic_'+id));
        				var price = DOM.val(DOM.get('#J_ItemPrice_'+id));
        				var updatePic = DOM.val(DOM.get('#J_ItemUpdatePic_'+id));
						var outId = itemCheck.strProcess(DOM.val(DOM.get('#J_ItemOuterId_'+id)));
        				//var iconId = DOM.val(DOM.get('#J_ItemIcon_'+id));
        				var paramsStr = '';
        				
        				if (type == 'spec' ) {
        					r = itemHandle.generalSpecParams(id, error);
        					error = r[0];
        					params = r[1];
        					paramsStr = ', "params":' + KISSY.JSON.stringify(params);
        				} else if (type == 'tbspec'||type == 'onetbspec' || type == 'tbspec_buyerLimit') {
        					r = itemHandle.generalTbSpecParams(id, error);
        					error = r[0];
        					params = r[1];
        					paramsStr = ', "params":' + KISSY.JSON.stringify(params);
        				}else if(type == 'tg'){
							r = itemHandle.generalTgParams(id, error);
							error = r[0];
        					params = r[1];
        					paramsStr = ', "params":' + KISSY.JSON.stringify(params);
						}else if(type == 'jtj'){
							r = itemHandle.generalJtjParams(id, error);
							error = r[0];
        					params = r[1];
        					paramsStr = ', "params":' + KISSY.JSON.stringify(params);
						}
        				if (error === false) {
                        	o = '{"id":"' + id + '", "outer_id":"' + outId + '", "title":"' + title + '", "price":"' + price + '", "pic_url":"'+ picUrl +'", "update_pic":"'+ updatePic +'"'+ paramsStr + '}';
                        	o = eval('(' + o + ')');
							json.push(o);
        				}else{
        					break ;
        				}
        				if(iid!=undefined){
        					break;
        				}
        				
					}
	            }
				
				if (error) {
					promotionControl.addAfter();
					//到第三步 ，提示 是否将勾选宝贝加入活动，状态4 有一个错误，
					promotionControl.processStatus = 4;
					return ;
    			}
				if(json.length == 0){
					new H.widget.msgBox({
					    title:"错误提示",
					    content:'未选择任何宝贝！',
					    type:"error",
						autoClose:true,
						timeOut :2000
					});
					promotionControl.addAfter();
					return;
				}
				//alert(json);return false;
	            var itemsJson = KISSY.JSON.stringify(json);
	            var submitHandle = function(o) {
					promotionControl.addAfter();
	            	if (o.payload.limit != null) {
						status= '操作失败';
						new H.widget.msgBox({
						    title:"操作失败",
						    content:o.payload.limit,
						    type:"error"
						});
					
    				} else {
		            	var waitTime = o.payload.waitTime;
		            	var finishAt = o.payload.finishAt;
		            	var len = checkBoxs.length;
						if(promotionControl.paginator){
							promotionControl.paginator.toPage(promotionControl.paginator.page);
						}else{
							promotionControl.searchTbItems();
						}
    				}
	            	//到第三步 ，提示 是否将勾选宝贝加入活动，状态5 成功加入宝贝，
					promotionControl.processStatus = 5;
        	    };
        	    var errorHandle = function(o) {
        	    	//到第三步 ，提示 是否将勾选宝贝加入活动，状态6 加入宝贝错误，
					promotionControl.processStatus = 6;
					promotionControl.addAfter();
        	    	new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
            	};
         	    var data = "pid="+pid+"&items="+itemsJson+"&form_key="+FORM_KEY;
         	    new H.widget.asyncRequest().setURI(addItemsToPromotionUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},
			
			//点击 加入活动  后的 按钮还原
			addAfter : function(){
				DOM.show(DOM.query('.J_addItem'));
				DOM.hide(DOM.query('.J_adding'));
				DOM.attr('#J_TopAddToPromo','disabled',false);
				DOM.replaceClass('#J_TopAddToPromo','btm-caozuo-gray-none','btm-caozuo-orange ');
				DOM.attr('#J_BtmAddToPromo','disabled',false);
				DOM.replaceClass('#J_BtmAddToPromo','btm-caozuo-gray-none','btm-caozuo-orange ');
				
			},
			//点击 加入活动  后的 按钮限制操作
			addBefore : function(){
				DOM.hide(DOM.query('.J_addItem'));
				DOM.show(DOM.query('.J_adding'));
				DOM.attr('#J_TopAddToPromo','disabled',true);
				DOM.replaceClass('#J_TopAddToPromo','btm-caozuo-orange','btm-caozuo-gray-none');
				DOM.attr('#J_BtmAddToPromo','disabled',true);
				DOM.replaceClass('#J_BtmAddToPromo','btm-caozuo-orange','btm-caozuo-gray-none');
				
			},
			/**
			 * 
			 * tb_item 与 promo_item  js
			 */
			getTjtSpecPrice : function(idd ,id,type){
				var v = Number(DOM.get('#J_PromoValue_'+idd).value);
				var t = Number(DOM.get('#J_Type_'+idd).value);
				var origPrice = Number(DOM.get('#J_ItemPrice_'+id).value);
				if(type =='promoItem'){
					var isInt = 0;
				}else{	
					var isInt = DOM.get('#J_IsInt_'+id).value;
				}
				var specPrice;
				var discount;
				var discountMoney;
				if (t == '1') {
					specPrice = (v / 10) * origPrice;
					specPrice = Math.floor(specPrice*100)/100;
					discountMoney = origPrice - specPrice;
				} else {
					specPrice = Math.floor((origPrice - v)*100)/100;
					discount = Number((specPrice / origPrice)*10).toFixed(2);
				}
				if (isInt == 1) {
					specPrice = Math.floor(specPrice);
				}else if(isInt == 2){
					specPrice = itemCheck.FormatNumber(specPrice,1);
				}
					if (t == '1') {
						//促销方式七折以上限制
						if(!KISSY.isNumber(v) || v < 0 || v >=10){
								new H.widget.msgBox({
									    title:"错误提示",
									    content:'传入了不合法或不正确的参数,有效范围在 0.00~9.99之间！',
									    type:"error"
									
									});
							DOM.addClass(DOM.get('#J_PromoValue_'+idd), 'text-error');
							return false;
						} else {
							var re = /(^[0-9]([.][0-9]{1,2})?$)|(^1[0-9]([.][0-9]{1,2})?$)|(^2[0-3]([.][0-9]{1,2})?$)|(^10([.]0{1,2})?$)/;
							if(!re.test(v)){
								new H.widget.msgBox({
									    title:"错误提示",
									    content:'传入了不合法或不正确的参数,有效范围在 0.00~9.99之间！',
									    type:"error"
									
									});
								DOM.addClass(DOM.get('#J_PromoValue_'+idd), 'text-error');
								return false;
							}	
						}
					} else {
//						if(v >Number((origPrice*0.3).toFixed(2))){
//							promotionControl.msg.setMsg('<div class="point relative"><div class="point-w-1">优惠金额有误，优惠金额有效范围在 0.00~'+(origPrice*0.3).toFixed(2)+'之间</div></div>').showDialog();
//							DOM.addClass(DOM.get('#J_PromoValue_'+idd), 'text-error');
//							return false;
//						}
					}
					if(type =='promoItem'){
						DOM.val('#J_IsInt_'+idd,'0');
					}	
				DOM.removeClass(DOM.get('#J_PromoValue_'+idd), 'text-error');
				DOM.val(DOM.get('#J_SpecPrice_'+idd),specPrice);
				DOM.val(DOM.get('.J_discount'+idd),discount);
				DOM.val(DOM.get('.J_discountMoney'+idd),discountMoney);
			},
			
			getTjtPromoValue : function(idd, id,type){
				
				Event.fire(DOM.query('#options_J_Type_'+idd+' li')[1],'click');
				var t = DOM.get('#J_Type_'+idd).value;
				var origPrice = Number(DOM.get('#J_ItemPrice_'+id).value);
				var specPrice = Number(DOM.get('#J_SpecPrice_'+idd).value);
				var promoValue;
				if (t == '0') {
					promoValue = Math.floor((origPrice - specPrice)*100)/100;
					DOM.get('#J_PromoValue_'+idd).value = promoValue;
				}else{
					promoValue = Number(((specPrice/origPrice)*10).toFixed(2));
					DOM.get('#J_PromoValue_'+idd).value = promoValue;
				}
				if(type =='promoItem'){
					DOM.val('#J_IsInt_'+idd,'1');
				}
				return ;
			},
			showTitleParam : function(iid) {
				
				var tDiv = DOM.get('#J_ParamsTitle_'+iid);
				if (tDiv.style.display == 'none') {
					tDiv.style.display = '';
					DOM.get('#J_UpdateTitle_'+iid).value = '1';					
				} else {
					tDiv.style.display = 'none';
					DOM.get('#J_UpdateTitle_'+iid).value = '0';
				}
				return;
			},
			
			toggleSku : function(id) {
				var skuTable = DOM.get('#J_SkuTable_'+id);
				if (DOM.hasClass(skuTable, 'ks-hidden')) {
					DOM.removeClass(skuTable, 'ks-hidden');
				} else {
					DOM.addClass(skuTable, 'ks-hidden');
				}
				
			},

			checkPromoPrice : function(el){
				promoPrice = Number(el.value);
				if (itemHandle.checkPrice(promoPrice) === false) {
					DOM.addClass(el, 'text-error');
					el.value = '';
					return false;
				}
				id = el.id;
				id = id.replace('Promo', 'Item');
				itemPrice = Number(DOM.get('#'+id).value);
				//七折限制
//				discount = ((promoPrice/itemPrice)*10).toFixed(2);
//				if (itemPrice < promoPrice || discount<7) {
//					DOM.addClass(el, 'text-error');
//					promotionControl.msg.setMsg('<div class="point relative"><div class="point-w-1">折扣价不能低于7，请设置特价在'+(itemPrice*0.7).toFixed(2)+'~'+itemPrice+'，请检查</div></div>').showDialog();
//					el.value = '';
//					return false;
//				}
				DOM.removeClass(el, 'text-error');
				
				promotionControl.autoSkuPrice(el);
				return true;
			},
			
			autoSkuPrice : function(el) {
				value = el.value;
				id = el.id.replace('J_PromoPrice_', '');
				var promoPriceEls = DOM.query('#J_SkuTable_'+id+' .J_SkuPromoPrice');
				var len = promoPriceEls.length;
				for (var i=0; i<len ;i++) {
					promoPriceEls[i].value = value;
				}
				return;
			},
			//由折扣（减钱）计算特价
			getSpecPrice : function(id ,pid,type)
			{	
                DOM.hide('#J_ZheWarn_'+id);
                var currentTab = DOM.val('#J_CurrentTab');
			    if(!promotionControl.isChanged && S.inArray(currentTab,promoTabArray)){
			        promotionControl.isChanged = true;
			        DOM.replaceClass('#J_PromoSave','.button-gray','.button-green');
			    }
			    var t = DOM.get('#J_PromoType_'+id).value;
			    if(t == '1'){
			        var v = DOM.val('#J_PromoValue_'+id);
			        if(v < 0 || v > 10 || isNaN(v)){DOM.val(DOM.get('#J_PromoValue_'+id),'10');}
			        if(v < 0.01 || v > 10 || isNaN(v)){v = 10;}
			        if(v != 10 && v.indexOf('.') >0 && v.toString().split(".")[1].length>2){v = Number(v).toFixed(2);DOM.val(DOM.get('#J_PromoValue_'+id),v);}
			    }else{
			        var v = DOM.val('#J_Promo2Value_'+id);
                    if(v < 0 || isNaN(v)){DOM.val(DOM.get('#J_Promo2Value_'+id),'0');v = 0;}
			    }
				var isSku = Number(DOM.val(DOM.get('#J_IsSku_'+id)));
				var origPrice = Number(DOM.get('#J_ItemPrice_'+id).value);
				var promoIsInt = Number(DOM.val(DOM.get('#J_PromoIsInt_'+id)));
				var specPrice;
				DOM.val(DOM.get('#J_FinalType_'+id),'0');
				if(isSku == 1){
					specPrice = (v / 10) * origPrice;
					specPrice = Math.floor(specPrice*100)/100;
				} else {
					//原来取整就取整
					var isInt = DOM.get('#J_IsInt_'+id).value;
					if(promoIsInt && isInt !=2){
						DOM.val('#J_IsInt_'+id,'1');
					}
					if (t == '1') {
						if (KISSY.one('#J_PromoBox_' + id + ' .duoguige')) {
							DOM.hide('#J_PromoBox_' + id + ' .duoguige');
						}
						specPrice = (v / 10) * origPrice;
//						specPrice = Math.round(specPrice*100)/100; //旧版进行四舍五入,还有一种是直接进位 ceil 也改成
						specPrice = Math.floor(specPrice*100)/100;
						
					} else {
						if (KISSY.one('#J_PromoBox_' + id + ' .duoguige')) {
							DOM.show('#J_PromoBox_' + id + ' .duoguige');
						}
//						specPrice = Math.round((origPrice - v)*100)/100; //旧版进行四舍五入
						specPrice = Math.floor((origPrice - v)*100)/100;
					}
					//原来isInt = 2 就 是 取整 
					var isInt = DOM.get('#J_IsInt_'+id).value;
					if (isInt == 1) {
						specPrice = Math.floor(specPrice);
					}else if(isInt == 2){
						specPrice = itemCheck.FormatNumber(specPrice,1);
					}
					if (t == '1') {
					    var reduce = origPrice - specPrice;
                        DOM.val('#J_Promo2Value_'+id,reduce);
					}else{
					    var agio = specPrice/origPrice*10;
					    if(agio < 0.01){
					        DOM.show('#J_ZheWarn_'+id);
					    }
                        DOM.val('#J_PromoValue_'+id,agio);
					}
				}
				//DOM.val('#J_IsInt_'+id,'0');
				//keyup 编辑后更改保存按钮样式
				DOM.replaceClass('#J_BtmAddToPromo','button-gray','button-green');
				DOM.val(DOM.get('#J_SpecPrice_'+id),  specPrice);
			},
			//由特价计算折扣和减钱
			getPromoValue : function(id,type)
			{	
                DOM.hide('#J_ZheWarn_'+id);
                var currentTab = DOM.val('#J_CurrentTab');
                if(!promotionControl.isChanged && S.inArray(currentTab,promoTabArray)){
                    promotionControl.isChanged = true;
                    DOM.replaceClass('#J_PromoSave','.button-gray','.button-green');
                }
				// 编辑特价 改为 减钱 不取整  	#J_PromoIsInt_id 的值 设置为3			
				DOM.val('#J_IsInt_'+id,'0');
				DOM.val(DOM.get('#J_FinalType_'+id),'3');
				
				Event.fire(DOM.query('#options_J_PromoType_'+id+' li')[1],'click');
				
				var t = DOM.get('#J_PromoType_'+id).value;
				
				var origPrice = Number(DOM.get('#J_ItemPrice_'+id).value);
				var specPrice = DOM.val('#J_SpecPrice_'+id);
                if(specPrice < 0 || isNaN(specPrice)){DOM.val(DOM.get('#J_SpecPrice_'+id),origPrice);specPrice = origPrice;}
				var promoValue;
				var promo2Value;
				if (KISSY.one('#J_PromoBox_' + id + ' .duoguige')) {
						DOM.show('#J_PromoBox_' + id + ' .duoguige');
				}	
				promo2Value = Math.floor((origPrice - specPrice)*100)/100;
				DOM.get('#J_Promo2Value_'+id).value = promo2Value;
				promoValue = ((specPrice/origPrice)*10).toFixed(2);
				DOM.get('#J_PromoValue_'+id).value = promoValue;
				return ;
			},
			checkSkuPrice : function(el){
				skupromoPrice = Number(el.value);
				if (itemHandle.checkPrice(skupromoPrice) === false) {
					DOM.addClass(el, 'text-error');
					el.value = '';
					return false;
				}
				id = el.id;
				id = id.replace('Promo', 'Orig');
				skuorigPrice = Number(DOM.get('#'+id).value);
				//七折限制
//				discount = ((skupromoPrice/skuorigPrice)*10).toFixed(2);
//				if (skuorigPrice < skupromoPrice || discount<7) {
//					promotionControl.msg.setMsg('<div class="point relative"><div class="point-w-1">折扣价不能低于7，请设置特价在'+(skuorigPrice*0.7).toFixed(2)+'~'+skuorigPrice+'，请检查</div></div>').showDialog();
//					DOM.addClass(el, 'text-error');
//					el.value = '';
//					return false;
//				}
				DOM.removeClass(el, 'text-error');
				return true;
			},
			forceDelItem : function(itemId) {
				var submitHandle = function(o) {
						DOM.hide('#J_RightLoading');
						DOM.show('#J_MainRightContent');
		        	    //DOM.query('#J_Item_'+itemId+' .J_CheckBox')[0].disabled = 'disabled'; 
						//DOM.html(DOM.get('#J_main_desc'),o.desc);
						DOM.html(DOM.get('#J_Status_'+itemId), '<div class="status-success"><div>成功退出</div></div>');
						DOM.hide('#J_forceDelItem_'+itemId);
				};
				var data = "promo_item_id="+itemId;
				DOM.show('#J_RightLoading');
				DOM.hide('#J_MainRightContent');
        	    new H.widget.asyncRequest().setURI(forceDelUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			},
			
			//暂停
			pausePromotionItemHandle : function(promo_itemid,pidi) {
				if(!showPermissions('editor_promotion',"编辑促销活动")){
				   return ;
				}
				if(typeId == 10){
				 	var diff  = IsExpired();
					 if(diff > -5000 ){
							var sucessHandle = function(o) {
								promotionControl.pauseAction(promo_itemid,pidi);
					 		};
					 		var errorHandle = function(o){
					 			KISSY.Event.fire('.J_TopExpired','click');
					 		};
					 		var data = '';
					  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
					 }else{
						promotionControl.pauseAction(promo_itemid,pidi);	
					 }
				 }else{
					promotionControl.pauseAction(promo_itemid,pidi);
				 }
				
			},
			
			pauseAction : function(promo_itemid,pidi){
			    var str = '<div class="msgBoxImage ui-msg"><span class="img-32-4"></span></div><div class="msgBoxContent">确定暂停吗？</div>';
                new Overlay.Dialog({
                    title : '暂停提示',
                    width : 440,
                    mask:true,
                    buttons:[
                       {
                         text:'确定',
                         elCls : 'bui-button bui-button-primary',
                         handler : function(){
                             DOM.attr('#J_PausePromotionItems','disbaled',true);
                             itemIds = [];
                             DOM.show('#J_RightLoading');
                             DOM.hide('#J_MainRightContent');
                             if(promo_itemid && pidi){
                                 itemIds.push(promo_itemid);
                                 pid = pidi;
                             }else{
                                 checkBoxs = DOM.query("#J_PromotionItemList .J_CheckBox");
                                 var len = checkBoxs.length;
                                 for(i=0; i<len; i++){
                                     if(checkBoxs[i].checked && !checkBoxs[i].disabled){
                                         itemIds.push(checkBoxs[i].value);
                                     }
                                 }
                             }
                             if(itemIds.length == 0){
                                 DOM.attr('#J_PausePromotionItems','disbaled',false);
                                 DOM.hide('#J_RightLoading');
                                 DOM.show('#J_MainRightContent');
                                 new H.widget.msgBox({
                                     title:"错误提示",
                                     content:'未选宝贝！',
                                     type:"error",
                                     autoClose:true,
                                     timeOut :3000
                                     
                                 });
                                 return ;
                             }
                             var submitHandle = function(o) {
                                 DOM.hide('#J_RightLoading');
                                 DOM.show('#J_MainRightContent');
                                 DOM.attr('#J_PausePromotionItems','disbaled',false);
                                 if(promotionControl.promotionItemPaginator){
                                     promotionControl.promotionItemPaginator.toPage(promotionControl.promotionItemPaginator.page);
                                 }else{
                                     promotionControl.loadPromotionItems();
                                 }
                             };
                             var errorHandle = function(o){
                                 DOM.attr('#J_PausePromotionItems','disbaled',false);
                                 DOM.hide('#J_RightLoading');
                                 DOM.show('#J_MainRightContent');
                                 new H.widget.msgBox({
                                     title:"错误提示",
                                     content:o.desc,
                                     type:"error",
                                     autoClose :true,
                                     timeOut:3000
                                     
                                 });
                             };
                             var data = "pid="+pid+"&item_ids="+itemIds+"&form_key="+FORM_KEY;
                             new H.widget.asyncRequest().setURI(pausePromotionItemUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
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
			},
			
			//重启
			restartPromotionItemHandle : function(promo_itemid,pidi) {
				itemIds = [];
				DOM.attr('#J_RestartPromotionItems','disbaled',true);
				promotionControl.msg = new H.widget.msgBox({
								    title:"",
									dialogType : 'loading',
								    content:'正在处理中，请稍候'	
								});
				if(promo_itemid && pidi){
					itemIds.push(promo_itemid);
					pid = pidi;
				}else{
					checkBoxs = DOM.query("#J_PromotionItemList .J_CheckBox");
					var len = checkBoxs.length;
					for(i=0; i<len; i++){
	                    if(checkBoxs[i].checked && !checkBoxs[i].disabled){
	                    	itemIds.push(checkBoxs[i].value);
	                    }
					}
				}
				if(itemIds.length == 0){
					DOM.attr('#J_RestartPromotionItems','disbaled',false);
						promotionControl.msg.hide();
						new H.widget.msgBox({
									    title:"错误提示",
									    content:'未选宝贝！',
									    type:"error",
										autoClose:true,
										timeOut :2000
									
									});
					return ;
				}
				var submitHandle = function(o) {
					promotionControl.msg.hide();
					DOM.attr('#J_RestartPromotionItems','disbaled',false);
					if(promo_itemid && pidi){
						DOM.hide(DOM.prev(DOM.get('#J_RestartPromoItem_'+promo_itemid)));
						DOM.show(DOM.get('#J_RestartPromoItem_'+promo_itemid));
					}else{
						for(i=0; i<len; i++){
							if(checkBoxs[i].checked && !checkBoxs[i].disabled){
								DOM.get('#J_Status_'+checkBoxs[i].value).innerHTML = '<div class="status-pendding"><div>等待处理</div></div>';
								checkBoxs[i].disabled = 'disabled';
							}
						}
					}
		            var waitTime = o.payload.waitTime;
		            var finishAt = o.payload.finishAt;	
					if(promotionControl.promotionItemPaginator){
						promotionControl.promotionItemPaginator.toPage(promotionControl.promotionItemPaginator.page);
					}else{
						promotionControl.loadPromotionItems();
					}
        	    };
				 var errorHandle = function(o){
					 	DOM.attr('#J_RestartPromotionItems','disbaled',false);
						promotionControl.msg.hide();
		    	    		new H.widget.msgBox({
									    title:"错误提示",
									    content:o.desc,
									    type:"error",
										autoClose:true,
										timeOut :3000
									
									});
    	    	};
        	    var data = "pid="+pid+"&item_ids="+itemIds+"&form_key="+FORM_KEY;
        	    //alert(data);return;
        	    new H.widget.asyncRequest().setURI(restartPromotionItemUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},
			
			retry : function(itemId, force) {
				var submitHandle = function(o) {
					promotionControl.msg.hide();
	        	    if(promotionControl.promotionItemPaginator){
						promotionControl.promotionItemPaginator.toPage(promotionControl.promotionItemPaginator.page);
					}else{
						promotionControl.loadPromotionItems();
					}
				};
				var data = "promo_item_id="+itemId+"&force="+force;
				promotionControl.msg = new H.widget.msgBox({
								    title:"",
									dialogType : 'loading',
								    content:'正在处理中，请稍候'	
								});
        	    new H.widget.asyncRequest().setURI(retryUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			},
			batchRetry :function(){
				var submitHandle = function(o) {
					promotionControl.msg.hide();
					if(promotionControl.promotionItemPaginator){
						promotionControl.promotionItemPaginator.toPage(promotionControl.promotionItemPaginator.page);
					}else{
						promotionControl.loadPromotionItems();
					}
				};
				var data = "pid="+pid;
				promotionControl.msg = new H.widget.msgBox({
								    title:"",
									dialogType : 'loading',
								    content:'正在处理中，请稍候'	
								});
        	    new H.widget.asyncRequest().setURI(batchRetryUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
				
			},
			
			editItem : function(promo_item_id){
				var itembox = DOM.get('#J_itemBox_'+promo_item_id);
				var promoDetail = DOM.get('#J_itemPromoDetail_'+promo_item_id);
				if (DOM.hasClass(promoDetail, 'ks-hidden')) {
					DOM.removeClass(promoDetail, 'ks-hidden');
				} else {
					DOM.addClass(promoDetail, 'ks-hidden');
				}
				if (DOM.hasClass(itembox, 'ks-hidden')) {
					DOM.removeClass(itembox, 'ks-hidden');
					DOM.attr(DOM.get('#J_Item_'+promo_item_id+' .J_CheckBox'),'checked',true);
				} else {
					DOM.addClass(itembox, 'ks-hidden');
					DOM.attr(DOM.get('#J_Item_'+promo_item_id+' .J_CheckBox'),'checked',false);
				}
				checkBoxs = DOM.query("#J_PromotionItemList .J_CheckBox");
				var len = checkBoxs.length;
				var num = 0;
				for(i=0; i<len; i++){
                    if(checkBoxs[i].checked && !checkBoxs[i].disabled){
                    	num++
                    }
				}
				if(num >= 2){
					DOM.show('#J_EditPromoItem');
				}else{
					DOM.hide('#J_EditPromoItem');
				}
				
			},
			editPromoItem : function(promo_item_id,item_id){
				promotionControl.msg = new H.widget.msgBox({
				    title:"",
					dialogType : 'loading',
				    content:'正在处理中，请稍候'	
				});
				var json = [];
				var error = false;
				
				DOM.attr('#J_EditPromoItem','disabled',true);
				DOM.replaceClass('#J_EditPromoItem','btm-caozuo-orange','btm-caozuo-gray-none');
				//单品编辑
				if(promo_item_id && item_id){
	                var id = promo_item_id;
	                var title = itemCheck.strProcess(DOM.val(DOM.get('#J_ItemTitle_'+id)));
					var picUrl = DOM.val(DOM.get('#J_ItemPic_'+id));
					var price = DOM.val(DOM.get('#J_ItemPrice_'+id));
					var updatePic = DOM.val(DOM.get('#J_ItemUpdatePic_'+id));
					//var iconId = DOM.val(DOM.get('#J_ItemIcon_'+id));
					var paramsStr = '';
					if (type == 'spec') {
						r = itemHandle.generalSpecParams(id, error);
						error = r[0];
						params = r[1];
						paramsStr = ', "params":' + KISSY.JSON.stringify(params);
					} else if (type == 'tbspec' || type == 'onetbspec' || type == 'tbspec_buyerLimit') {
						r = itemHandle.generalTbSpecParams(id, error);
						error = r[0];
						params = r[1];
						paramsStr = ', "params":' + KISSY.JSON.stringify(params);
					}else if(type == 'tg'){
						r = itemHandle.generalTgParams(id, error);
						error = r[0];
						params = r[1];
						paramsStr = ', "params":' + KISSY.JSON.stringify(params);
					}else if(type == 'jtj'){
						r = itemHandle.generalJtjParams(id, error);
						error = r[0];
    					params = r[1];
    					paramsStr = ', "params":' + KISSY.JSON.stringify(params);
					}
					if (error === false) {
	                	o = '{"id":"' + item_id + '", "title":"' + title + '","price":"' + price + '", "pic_url":"' + picUrl +'", "update_pic":"' + updatePic +'"'+ paramsStr + '}';
	                	o = eval('(' + o + ')');
	                	json.push(o);
					}else{
						promotionControl.msg.hide();
						DOM.attr('#J_EditPromoItem','disabled',false);
						DOM.replaceClass('#J_EditPromoItem','btm-caozuo-gray-none','btm-caozuo-orange');
						return ;
	    			}
				}else{
				    //关闭批量编辑
				    Event.fire('#J_CancelEditAll','click');
                    promotionControl.Form.setCheckboxOff(DOM.get('#J_RightBottonCheckAll'));
                    promotionControl.Form.setCheckboxOff(DOM.get('#J_RightCheckAll'));
					//批量编辑
					checkBoxs = DOM.query("#J_PromotionItemList .J_CheckBox");
					var len = checkBoxs.length;
					//把优惠内容保存，获取优惠内容中最小值
					var privilegeJson = [];
					for(i=0; i<len; i++){
						if(checkBoxs[i].checked && !checkBoxs[i].disabled){
							var id = checkBoxs[i].value;
		    				var z = DOM.val(DOM.get('#J_PromoValue_'+id));
							privilegeJson.push(z);
						};
		            };
		            //把最低优惠内容写入J_minPrivilege
		            var PreferentialType = DOM.val('#J_PromoType_'+id);
		            if(PreferentialType == 1){
		            	DOM.val('#J_minPrivilege',Math.min.apply(null,privilegeJson));
		            }else{
		            	DOM.val('#J_minPrivilege',Math.max.apply(null,privilegeJson));
		            }
					
					for(i=0; i<len; i++){
						if(checkBoxs[i].checked && !checkBoxs[i].disabled){
							 var id = checkBoxs[i].value;
							 var title = itemCheck.strProcess(DOM.val(DOM.get('#J_ItemTitle_'+id)));
							 var picUrl = DOM.val(DOM.get('#J_ItemPic_'+id));
							 var price = DOM.val(DOM.get('#J_ItemPrice_'+id));
							 var updatePic = DOM.val(DOM.get('#J_ItemUpdatePic_'+id));
							 //var iconId = DOM.val(DOM.get('#J_ItemIcon_'+id));
							 var itemId = DOM.val(DOM.get('#J_ItemId_'+id));
							 var paramsStr = '';
								if (type == 'spec') {
									r = itemHandle.generalSpecParams(id, error);
									error = r[0];
									params = r[1];
									paramsStr = ', "params":' + KISSY.JSON.stringify(params);
								} else if (type == 'tbspec' || type == 'onetbspec' || type == 'tbspec_buyerLimit') {
									r = itemHandle.generalTbSpecParams(id, error);
									error = r[0];
									params = r[1];
									paramsStr = ', "params":' + KISSY.JSON.stringify(params);
								}else if(type == 'tg'){
									r = itemHandle.generalTgParams(id, error);
									error = r[0];
									params = r[1];
									paramsStr = ', "params":' + KISSY.JSON.stringify(params);
								}else if(type == 'jtj'){
									r = itemHandle.generalJtjParams(id, error);
									error = r[0];
		        					params = r[1];
		        					paramsStr = ', "params":' + KISSY.JSON.stringify(params);
								}
								if (error === false) {
				                	o = '{"promoItemId":"'+id+'","id":"' + itemId + '", "title":"' + title + '","price":"' + price + '", "pic_url":"' + picUrl +'", "update_pic":"' + updatePic +'"'+ paramsStr + '}';
				                	o = eval('(' + o + ')');
				                	json.push(o);
								}else{
									promotionControl.msg.hide();
									DOM.attr('#J_EditPromoItem','disabled',false);
									DOM.replaceClass('#J_EditPromoItem','btm-caozuo-gray-none','btm-caozuo-orange');
									return ;
				    			}
						}
					}
					
				}
				if(json.length == 0){
						promotionControl.msg.hide();
						new H.widget.msgBox({
									    title:"错误提示",
									    content:'未选宝贝！',
									    type:"error",
										autoClose:true,
										timeOut :3000
									
									});
					DOM.attr('#J_EditPromoItem','disabled',false);
					DOM.replaceClass('#J_EditPromoItem','btm-caozuo-gray-none','btm-caozuo-orange');
					return ;
				}
	            var itemsJson = KISSY.JSON.stringify(json);
	            var submitHandle = function(o) {
	            	promotionControl.msg.hide();
					DOM.attr('#J_EditPromoItem','disabled',false);
					DOM.replaceClass('#J_EditPromoItem','btm-caozuo-gray-none','btm-caozuo-orange');
	            	if(promotionControl.promotionItemPaginator){
						promotionControl.promotionItemPaginator.toPage(promotionControl.promotionItemPaginator.page);
					}else{
						promotionControl.loadPromotionItems();
					}
        	    };
        	    var errorHandle = function(o) {
        	    	promotionControl.msg.hide();
					DOM.attr('#J_EditPromoItem','disabled',false);
					DOM.replaceClass('#J_EditPromoItem','btm-caozuo-gray-none','btm-caozuo-orange');
					new H.widget.msgBox({
									    title:"错误提示",
									    content:o.desc,
									    type:"error"
									});
				
            	};
         	    //单品编辑
				if(promo_item_id && item_id){
					 var data = "promoItemId="+promo_item_id+"&items="+itemsJson+"&form_key="+FORM_KEY;
					 new H.widget.asyncRequest().setURI(editPromoItemUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
				}else{
					 var data = "&items="+itemsJson+"&form_key="+FORM_KEY;
					 new H.widget.asyncRequest().setURI(batchEditPromoItemUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();	
				}
			},
			//Tbspec宝贝 批量设置折扣
			editAll :function(){
			    var t1 = DOM.val('#J_Zhe');
                if(t1 == '1'){
                    var v1 = DOM.val('#J_valueToAll');
                    if(v1 < 0 || v1 > 10 || isNaN(v1)){DOM.val('#J_valueToAll','10');}
                    if(v1 < 0.01 || v1 > 10 || isNaN(v1)){v1 = 10;}
                    if(v1 != 10 && v1.indexOf('.') >0 && v1.toString().split(".")[1].length>2){v1 = Number(v1).toFixed(2);DOM.val(DOM.get('#J_valueToAll'),v1);}
                }else{
                    var v1 = DOM.val('#J_value2ToAll');
                    if(v1 < 0 || isNaN(v1)){DOM.val('#J_value2ToAll','0');v1 = 0;}
                }
                if(DOM.val('#J_CurrentTab')>2){
                    checkBoxs = DOM.query("#J_PromotionItemList .J_CheckBox");
                }else{
                    checkBoxs = DOM.query("#J_TbItemList .J_CheckBox");
                }
				var len = checkBoxs.length;
				for(m=0; m<len; m++){
					if(!checkBoxs[m].disabled){
						var id = checkBoxs[m].value;
						var origPrice = DOM.val('#J_ItemPrice_'+id);
						var isSku = Number(DOM.val(DOM.get('#J_IsSku_'+id)));
						var isSkuNumUp = Number(DOM.val(DOM.get('#J_IsSkuNumUp_'+id)));
						if(isSkuNumUp == '1'){
						    var skuUpPrice = DOM.query("#J_tejia_"+id+' .J_SkuUpPrice');
						    for(var z=0; z<skuUpPrice.length; z++){
						        if (t1 == '1') {
                                    DOM.val(DOM.get('#J_PromoType_'+id),1);
                                    if(!DOM.hasClass('#J_PromoValue_'+id,'input-price-focus')){
                                        DOM.removeClass('#J_PromoValue_'+id,'input-price');
                                        DOM.addClass('#J_PromoValue_'+id,'input-price-focus');
                                        DOM.replaceClass('#J_Promo2Value_'+id,'input-price-focus','input-price');
                                    }
                                    var reduce = origPrice - specPrice;
                                    DOM.val('#J_Promo2Value_'+id,reduce);
                                    DOM.val(DOM.get('#J_PromoValue_'+id) ,v1);
	                                specPrice = (v1 / 10) * origPrice;
	                                specPrice = Math.floor(specPrice*100)/100;
	                            } else {
                                    DOM.val(DOM.get('#J_PromoType_'+id),0);
                                    if(!DOM.hasClass('#J_Promo2Value_'+id,'input-price-focus')){
                                        DOM.removeClass('#J_Promo2Value_'+id,'input-price');
                                        DOM.addClass('#J_Promo2Value_'+id,'input-price-focus');
                                        DOM.replaceClass('#J_PromoValue_'+id,'input-price-focus','input-price');
                                    }
                                    var agio = specPrice/origPrice*10;
                                    DOM.val('#J_PromoValue_'+id,agio);
                                    DOM.val(DOM.get('#J_Promo2Value_'+id) ,v1);
	                                specPrice = Math.floor((origPrice - v1)*100)/100;
	                            }
						        DOM.html(skuUpPrice[z],specPrice);
						    }
						}else if(t1 == '0' && isSku == '1' ){
							
						} else {
							if (t1 == '1') {
								specPrice = (v1 / 10) * origPrice;
								specPrice = Math.floor(specPrice*100)/100;
							} else {
								specPrice = Math.floor((origPrice - v1)*100)/100;
							}
							if(isSku == 0){
								if(t1 == '1'){
									DOM.val(DOM.get('#J_PromoType_'+id),1);
				                    if(!DOM.hasClass('#J_PromoValue_'+id,'input-price-focus')){
				                        DOM.removeClass('#J_PromoValue_'+id,'input-price');
				                        DOM.addClass('#J_PromoValue_'+id,'input-price-focus');
				                        DOM.replaceClass('#J_Promo2Value_'+id,'input-price-focus','input-price');
				                    }
								}else{
									DOM.val(DOM.get('#J_PromoType_'+id),0);
                                    if(!DOM.hasClass('#J_Promo2Value_'+id,'input-price-focus')){
                                        DOM.removeClass('#J_Promo2Value_'+id,'input-price');
                                        DOM.addClass('#J_Promo2Value_'+id,'input-price-focus');
                                        DOM.replaceClass('#J_PromoValue_'+id,'input-price-focus','input-price');
                                    }
								}
							}
							var isInt = DOM.get('#J_IsInt_'+id).value;
							if (S.one('#J_PromoBox_' + id + ' .duoguige')) {
								if (isInt != 0 && t1 == '0') {
									DOM.show('#J_PromoBox_' + id + ' .duoguige');
								}
								else {
									DOM.hide('#J_PromoBox_' + id + ' .duoguige');
								}
							}	
                            if(t1 == '1'){
                                var reduce = origPrice - specPrice;
                                DOM.val('#J_Promo2Value_'+id,reduce);
                                DOM.val(DOM.get('#J_PromoValue_'+id) ,v1);
                            }else{
                                var agio = specPrice/origPrice*10;
                                DOM.val('#J_PromoValue_'+id,agio);
                                DOM.val(DOM.get('#J_Promo2Value_'+id) ,v1);
                            }
							DOM.val(DOM.get('#J_SpecPrice_'+id),  specPrice);
						}
					}
				}			
			},
			// 阶梯价宝贝 批量设置折扣
			editAllJtj :function(){
				var v1 = DOM.val('#J_valueToAll');
				var t1 = DOM.val('#J_Zhe');
				var checkBoxs = DOM.query("#J_TbItemList .J_CheckBox");
				var len = checkBoxs.length;
				var num = DOM.val('#J_laddersNum');
				for(m=0; m<len; m++){
					if(!checkBoxs[m].disabled){
						var id = checkBoxs[m].value;
						var origPrice = DOM.val('#J_ItemPrice_'+id);
						var isSku = Number(DOM.val(DOM.get('#J_IsSku_'+id)));
						if(t1 == '0' && isSku == 1 ){
						} else {
							if (t1 == '1') {
								specPrice = (v1 / 10) * origPrice;
								specPrice = Math.floor(specPrice*100)/100;
							} else {
								specPrice = Math.floor((origPrice - v1)*100)/100;
							}
							if(isSku == 0){
								
							}
							for(var i = 1;i<=num;i++){
								DOM.val(DOM.get('#J_PromoValue_'+id+i) ,v1);
								DOM.val(DOM.get('#J_SpecPrice_'+id+i),  specPrice);
								if(isSku == 0){
									if(t1 == '1'){
										DOM.val(DOM.get('#J_Type_'+id+i),1);
									}else{
										DOM.val(DOM.get('#J_Type_'+id+i),0);
									}
								}
							}
						}
					}
				}			
			},
			
			//Tbspec宝贝 批量设置取整
			editTbspecQuZheng :function(){
				var isInt = 0;
				if(DOM.prop('#J_QuzhengTo1','checked')){
					 isInt = 1; //去角
				}else if(!DOM.prop('#J_QuzhengTo1','checked') && DOM.prop('#J_QuzhengTo2','checked')){
					 isInt = 2; //去分
				}else if(!DOM.prop('#J_QuzhengTo1','checked') && !DOM.prop('#J_QuzhengTo2','checked')){
					 isInt = 0; //不取整
				}
                if(DOM.val('#J_CurrentTab')>2){
                    checkBoxs = DOM.query("#J_PromotionItemList .J_CheckBox");
                }else{
                    checkBoxs = DOM.query("#J_TbItemList .J_CheckBox");
                }
				var len = checkBoxs.length;
				for(m=0; m<len; m++){
					if(!checkBoxs[m].disabled){
						var id = checkBoxs[m].value;
						var origPrice = DOM.val('#J_ItemPrice_'+id);
		                var specPrice = Number(DOM.get('#J_SpecPrice_'+id).value);
						var isSku = Number(DOM.val(DOM.get('#J_IsSku_'+id)));
						var t1 = DOM.val(DOM.get('#J_PromoType_'+id));
		                if(t1 == '1'){
		                    var v1 = Number(DOM.get('#J_PromoValue_'+id).value);
		                }else{
		                    var v1 = Number(DOM.get('#J_Promo2Value_'+id).value);
		                }
						if(t1 == '0' && isSku == '1' ){
						} else {
							if (t1 == '1') {
								specPrice = (v1 / 10) * origPrice;
								specPrice = Math.floor(specPrice*100)/100;
							} else {
								specPrice = Math.floor((origPrice - v1)*100)/100;
							}
							if(isSku == 0){
								if (isInt == 1) {
									specPrice = Math.floor(specPrice);
									DOM.get('#J_IsInt_'+id).value = isInt;
								}else if(isInt == 2){
									specPrice = itemCheck.FormatNumber(specPrice,1);
									DOM.get('#J_IsInt_'+id).value = isInt;
								}else if(isInt == 0){
									DOM.get('#J_IsInt_'+id).value = isInt;
								}
							}
							if (S.one('#J_PromoBox_' + id + ' .duoguige')) {
								if (isInt != 0 && t1 == '0') {
									DOM.show('#J_PromoBox_' + id + ' .duoguige');
								}
								else {
									DOM.hide('#J_PromoBox_' + id + ' .duoguige');
								}
							}	
							DOM.val(DOM.get('#J_SpecPrice_'+id),  specPrice);
//							promotionControl.getPromoValue(id);
						}
					}
				}			
			},
			// 阶梯价宝贝 批量设置折扣
			editJtjQuZheng :function(){
				var isInt = 0;
				if(DOM.prop('#J_QuzhengTo1','checked')){
					 isInt = 1; //去角
				}else if(!DOM.prop('#J_QuzhengTo1','checked') && DOM.prop('#J_QuzhengTo2','checked')){
					 isInt = 2; //去分
				}else if(!DOM.prop('#J_QuzhengTo1','checked') && !DOM.prop('#J_QuzhengTo2','checked')){
					 isInt = 0; //不取整
				}
				var checkBoxs = DOM.query("#J_TbItemList .J_CheckBox");
				var len = checkBoxs.length;
				var num = DOM.val('#J_laddersNum');
				for(m=0; m<len; m++){
					if(!checkBoxs[m].disabled){
						var id = checkBoxs[m].value;
						var origPrice = DOM.val('#J_ItemPrice_'+id);
						var isSku = Number(DOM.val(DOM.get('#J_IsSku_'+id)));
						for(var i = 1;i<=num;i++){
							
							var v1 = DOM.val(DOM.get('#J_PromoValue_'+id+i));
							var t1 = DOM.val(DOM.get('#J_Type_'+id+i));
						
							if(t1 == '0' && isSku == 1 ){
							} else {
								if (t1 == '1') {
									specPrice = (v1 / 10) * origPrice;
									specPrice = Math.floor(specPrice*100)/100;
								} else {
									specPrice = Math.floor((origPrice - v1)*100)/100;
								}
								if(isSku == 0){
									if (isInt == 1) {
										specPrice = Math.floor(specPrice);
										DOM.get('#J_IsInt_'+id).value = isInt;
									}else if(isInt == 2){
										specPrice = itemCheck.FormatNumber(specPrice,1);
										DOM.get('#J_IsInt_'+id).value = isInt;
									}else if(isInt == 0){
										DOM.get('#J_IsInt_'+id).value = isInt;
									}
								}
								DOM.val(DOM.get('#J_SpecPrice_'+id+i),  specPrice);
							}
						}
					}
				}			
			}	 

		}
}, {
    requires: ['utils/showPages/index','./mods/item-handle','bui/select','utils/beautifyForm/index','bui/tooltip','overlay','./mods/check','bui/overlay','bui/calendar']
});