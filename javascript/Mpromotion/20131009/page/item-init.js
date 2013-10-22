/*
combined files : 

utils/showPages/index
page/mods/item-handle
utils/beautifyForm/index
page/mods/check
page/item-init

*/
/**
 * @分页组件
 * @author  @sjs_stef
 */
KISSY.add('utils/showPages/index',function (S) {
    var DOM = S.DOM, Event = S.Event, doc = document;
  
    function showPages(name) { //初始化属性 
        var self = this; 
        if (!(self instanceof showPages)) { 
            return new showPages(name); 
        }   
        this.pageNum = 4 ;   
        this.name = name;      //对象名称
        this.page = 1;         //当前页数
        this.pageCount = 200;    //总页数
        this.argName = 'page'; //参数名    
    }

    S.mix(showPages.prototype,{
        jump: function() {
            return undefined;
        },
        
        //进行当前页数和总页数的验证
        checkPages: function() { 
            if (isNaN(parseInt(this.page))) this.page = 1;
            if (isNaN(parseInt(this.pageCount))) this.pageCount = 1;
            if (this.page < 1) this.page = 1;
            if (this.pageCount < 1) this.pageCount = 1;
            if (this.page > this.pageCount) this.page = this.pageCount;
            this.page = parseInt(this.page);
            this.pageCount = parseInt(this.pageCount);
        },
        
        //生成html代码    
        _createHtml: function(mode) { 
       
            var self = this, strHtml = '', prevPage = this.page - 1, nextPage = this.page + 1;   
            if (mode == '' || typeof(mode) == 'undefined') mode = 1;
        
            switch (mode) {
                case 1: 
                    //模式1 (页数)
                     strHtml += '<div class="page-bottom"> <div class="sabrosus">';
	   					strHtml += '<font class="number">';
	   					strHtml += '共'+this.pageCount+'页&nbsp;';
	   					strHtml += '<input style="" type="text"  class="page-input" id="pageInput' + self.name + '"  value="页码" onkeypress="return window.' + self.name + '.formatInputPage(event);" onfocus="this.className=\'page-input page-input-text-on \';if(this.value==\'页码\'){this.value = \'\';}" onblur="this.className=\'page-input\';if(this.value==\'\'){this.value = \'页码\'}">';
	   					strHtml += '<input type="button" value="Go" class="btm-go" onclick="javascript:var page = document.getElementById(\'pageInput' + self.name + '\').value; if(isNaN(Number(page))|| Number(page)==0) { var turnTo = 1;} else if(page>'+this.pageCount+'){ var turnTo = '+this.pageCount+';} else{var turnTo = page;}  window.' + self.name + '.toPage(turnTo);" >';
	   					strHtml += '</font>';	
	   				    if (prevPage < 1) {
	                        strHtml += '<span class="pre-none page-pic-no"></span>';
	                    } else {
	                        strHtml += '<span title="上一页" class="pre page-pic-no" onclick="' + self.name + '.toPage(' + prevPage + ');"></span>';
	                    }
	   					if (nextPage > this.pageCount) {
	                    	strHtml += '<span class="next-none page-pic-no"></span>';
	                    } else {
	                    	strHtml += '<span title="下一页" class="next page-pic-no" onclick="' + self.name + '.toPage(' + nextPage + ');"></span>';
	                    }
	   				 strHtml += '<div style="clear:both"></div></div></div> '; 
                    break;
                                 
                    case 2: 
    					//模式2 (前后缩略,页数,首页,前页,后页,尾页)
                    	
    					if(this.pageCount > 1){
    	                    strHtml += '<div class="page-bottom"> <div class="sabrosus">';
    	                    
    	                    if (this.pageCount > 5) {
    		   					strHtml += '<font class="number">';
    		   					strHtml += '共'+this.pageCount+'页&nbsp;';
    		   					strHtml += '<input style="" type="text"  class="page-input" id="pageInput' + self.name + '"  value="页码" onkeypress="return window.' + self.name + '.formatInputPage(event);" onfocus="this.className=\'page-input page-input-text-on \';if(this.value==\'页码\'){this.value = \'\';}" onblur="this.className=\'page-input\';if(this.value==\'\'){this.value = \'页码\'}">';
    		   					strHtml += '<input type="button" value="Go" class="btm-go" onclick="javascript:var page = document.getElementById(\'pageInput' + self.name + '\').value; if(isNaN(Number(page))|| Number(page)==0) { var turnTo = 1;} else if(page>'+this.pageCount+'){ var turnTo = '+this.pageCount+';} else{var turnTo = page;}  window.' + self.name + '.toPage(turnTo);" >';
    		   					strHtml += '</font>';	
    	                    }
    	                    
    	                    
    	                    if (prevPage < 1) {
    	                        strHtml += '<span class="pre-none page-pic-no"></span>';
    	                    } else {
    	                        strHtml += '<span title="上一页" class="pre page-pic-no" onclick="' + self.name + '.toPage(' + prevPage + ');"></span>';
    	                    }
    	                    
    	                    if (this.page != 1) {
    							//strHtml += ' <a class="a-padding" href="javascript:' + self.name  + '.toPage(1);">1</a>';
    						}
    						if(this.page - 2<=0){
    							var start = 1;
    								if (this.pageCount > this.page + 4) {
    	                           		var endPage = this.page + 4;
    	                           } else {
    	                             	var endPage = this.pageCount; 
    	                            }
    						}else if(this.page + 2>=this.pageCount){
    							var start = this.pageCount-4;
    							if (this.pageCount > this.page + 4) {
    	                       		var endPage = this.page + 4;
    	                        } else {
    	                         	var endPage = this.pageCount; 
    	                        }
    						}else {
    							var start = this.page - 2;
    							if (this.pageCount > this.page + 2) {
    		                           		var endPage = this.page + 2;
    		                           } else {
    		                             	var endPage = this.pageCount; 
    		                             }
    						}
    	                    for (var i = start; i <= endPage; i++) {
    	                    if (i > 0) {
    	                       	if (i == this.page) {
    	                           	strHtml += '<span class="current a-padding">'+ i + '</span>';
    	                        } else {
    	                           // if (i != 1 && i != this.pageCount) {
    	                              	strHtml += '<a class="a-padding" href="javascript:' + self.name + '.toPage(' + i + ');">' + i + '</a>';
    	                           // }
    						      }
    	                    }
    	                    }
    	                    if (this.page + 5 < this.pageCount) {
    							strHtml += '<a class="a-padding" title="" href="javascript:' + self.name + '.toPage(' + (this.page + 3) + ');">...</a>';
    						}
    				  	    if (this.page != this.pageCount) {
    							//strHtml += '<span title="Page ' + this.pageCount + '"><a href="javascript:' + self.name + '.toPage(' + this.pageCount + ');">' + this.pageCount + '</a></span>';
    						}
    						if (nextPage > this.pageCount) {
    	                    	strHtml += '<span class="next-none page-pic-no"></span>';
    	                    } else {
    	                    	strHtml += '<span title="下一页" class="next page-pic-no" onclick="' + self.name + '.toPage(' + nextPage + ');"></span>';
    	                      }
    						
    						
    						
    	                   strHtml += '<div style="clear:both"></div></div></div> ';
    					}
                       break;
    			   case 3 :
    				   strHtml += '<div class="page-top"><div class="sabrosus"><span class="count">' + this.page + ' / ' + this.pageCount + '</span>';
                       if (prevPage < 1) {
                           strHtml += ' <span class="pre-none page-pic-no"></span>';
                       } else {
                           strHtml += '<a class="border-left-dedede" href="javascript:' + self.name + '.toPage(' + prevPage + ');" title="上一页"><span class="pre page-pic-no"></span></a>';
                         }
                       if (nextPage > this.pageCount) {
                       	strHtml += '<span class="next-none page-pic-no"></span>';
                       } else {
                           strHtml += '<a href="javascript:' + self.name + '.toPage(' + nextPage + ');" title="下一页"><span class="next page-pic-no"></span></a>';
                         }
                      strHtml += '<div style="clear:both"></div></div></div>';
                      break;
                    
            }
            return strHtml; 
               
        },
         //限定输入页数格式
        formatInputPage : function(e){
            var ie = navigator.appName=="Microsoft Internet Explorer"?true:false;
            if(!ie) var key = e.which;
            else var key = event.keyCode;
            if (key == 8 || key == 46 || (key >= 48 && key <= 57)) return true;
            return false;
        },
      
        //页面跳转 返回将跳转的页数
        toPage: function( page ,flag) { 
            var turnTo = 1;
            var self = this;    
            if (typeof(page) == 'object') {
                turnTo = page.options[page.selectedIndex].value;
            } else {
                turnTo = page;
              }
            
            self.jump(turnTo,flag,'');
              
        },
              
        //显示html代码
        printHtml: function(contian, mode) {  
            this.checkPages();
            DOM.html(contian,this._createHtml(mode));
            return this;
        },
                   
        //设置总页数           
        setPageCount: function( pagecount ) {
            this.pageCount=pagecount;
            return this;
        },              
        
        getPageCount: function() {
            return this.pageCount;
        },
        
        //设置跳转 执行函数
        setRender: function(fn) {
            this.jump = fn;
            return this;
        },  
        setPageNum:function(page_num){
            this.pageNum = page_num;
            return this;
         },
        setPage:function(page){
            this.page = page;  
            return this; 
        }          

               
    });

    return showPages;
  
});
/**
 * @fileOverview 
 * @author  
 */
KISSY.add('page/mods/item-handle',function (S) {
    // your code here
    return itemHandle = {
		
			strProcess : function(str) {
				return str.replace(/\\/g, '\\\\').replace(/\"/g, '\\"').replace(/[\t\n&]/g, '%26');
			},
			
			checkPrice : function(v){
				if (KISSY.isNumber(v) === false || v<=0) {
					return false;
				} else {
					return true;
				}
			},
			isNull : function(str){
				if(str == null ||str == ""){
					return true;
				}else{
					return false;
				}
			},
			
			isDate : function(str){
				if (str == null)
				{
					return false;
				}
				if (str.length != 19 ){
					return false;
				}
				var yearStr = str.substring(0,4);
				var monthStr = str.substring(5,7);
				var dayStr = str.substring(8,10);
				var hour = str.substring(11,13);
				var mins = str.substring(14,16);
				var sec = str.substring(17,19);
				if(parseInt(yearStr)<2011)
				{
					return false;
				 }
				y = parseInt(yearStr,10);
				d = parseInt(dayStr,10);
				switch(monthStr){
					case '01':
					case '03':
					case '05':
					case '07':
					case '08':
					case '10':
					case '12':
					 if(d>31){
					return false;
					 }
					 break;
					case '02':
					 if((y%4==0 && d>29) || ((y%4!=0 && d>28))){
					return false;
					}
					 break;
					case '04':
					case '06':
					case '09':
					case '11':
					 if(d>30){
					return false;
					}
					 break;
					default:
					 return false;
				}
				if(parseInt(hour)>23 || parseInt(mins)>59 || parseInt(sec)>59){
					return false;
				}
				if(str.substring(4,5) != '-' || str.substring(7,8) != '-' || str.substring(13,14) != ':' || str.substring(16,17) != ':'){
					return false;
				}	
		        return true;
			},
			generalTgParams : function(id, error) {
				var r = [];
				var params = [];
				//获取定向营销活动参数
				result = itemHandle._generalTbSpecParams(id, error);
				
				paramsGeneral = result[0];
				var promoType = paramsGeneral[0];
				var promoValue = paramsGeneral[1];
				var decreaseNum = paramsGeneral[2];
				var error = result[1];
				if (error) {
					DOM.addClass(DOM.get('#J_PromoValue_'+id), 'text-error');
				} else {
					params.push(promoType);
					params.push(promoValue);
					var  promoStartTime = DOM.val(DOM.get('#J_Promo_Start_Time'));
					var  promoEndTime = DOM.val(DOM.get('#J_Promo_End_Time'));
					var  startNum = Number(DOM.val(DOM.get('#J_ItemParam_startNum_'+id)));
					var  minNum = Number(DOM.val(DOM.get('#J_ItemParam_minNum_'+id)));
					var  maxNum = Number(DOM.val(DOM.get('#J_ItemParam_maxNum_'+id)));
					var  maxBuy = Number(DOM.val(DOM.get('#J_ItemParam_maxBuy_'+id)));
					var  startAt = DOM.val(DOM.get('#J_ItemParam_startAt_'+id));
					var  EndAt = DOM.val(DOM.get('#J_ItemParam_endAt_'+id));
					var  lastBuy = DOM.val(DOM.get('#J_ItemParam_lastBuy_'+id));
					var  timeInterval = DOM.val(DOM.get('#J_ItemParam_time_interval_'+id));
					var tgType = DOM.val(DOM.get('#J_ItemParam_tgtype_'+id));
					if(!KISSY.isNumber(startNum) || startNum <0 ){
						new H.widget.msgBox({
						    title:"错误提示",
						    content:'团购初始参团人数必须大于等于0！',
						    type:"error"
						});
						DOM.get('#J_ItemParam_startNum_'+id).focus();
						DOM.addClass(DOM.get('#J_ItemParam_startNum_'+id), 'text-error');
						error = true;
					}else if(!KISSY.isNumber(minNum) || minNum <0 ){
						new H.widget.msgBox({
									    title:"错误提示",
									    content:'最少参团人数必须大于0！',
									    type:"error"
									
									});
						DOM.get('#J_ItemParam_minNum_'+id).focus();
						DOM.addClass(DOM.get('#J_ItemParam_minNum_'+id), 'text-error');
						error = true;
					}else if(!KISSY.isNumber(maxNum) || maxNum <0 || maxNum<minNum ){
						new H.widget.msgBox({
									    title:"错误提示",
									    content:'最大参团人数必须大于0且大于等于最小参团人数！',
									    type:"error"
									
									});
						DOM.get('#J_ItemParam_maxNum_'+id).focus();
						DOM.addClass(DOM.get('#J_ItemParam_maxNum_'+id), 'text-error');
						error = true;
					}else if(!KISSY.isNumber(maxBuy) || maxBuy <0 ){
						new H.widget.msgBox({
									    title:"错误提示",
									    content:'每人最大购买量必须大于0！',
									    type:"error"
									
									});
						DOM.get('#J_ItemParam_maxBuy_'+id).focus();
						DOM.addClass(DOM.get('#J_ItemParam_maxBuy_'+id), 'text-error');
						error = true;
					}else if(itemHandle.isNull(startAt)||!itemHandle.isDate(startAt)){
						new H.widget.msgBox({
									    title:"错误提示",
									    content:'团购开始时间必须为日期格式(例2010-01-01 18:00:00！',
									    type:"error"
									
									});
						DOM.get('#J_ItemParam_startAt_'+id).focus();
						DOM.addClass(DOM.get('#J_ItemParam_startAt_'+id), 'text-error');
						error = true;
					}else if(itemHandle.isNull(EndAt)||!itemHandle.isDate(EndAt)){
						new H.widget.msgBox({
									    title:"错误提示",
									    content:'团购结束时间必须为日期格式(例2010-01-01 18:00:00)）！',
									    type:"error"
									
									});
						DOM.get('#J_ItemParam_endAt_'+id).focus();
						DOM.addClass(DOM.get('#J_ItemParam_endAt_'+id), 'text-error');
						error = true;
					}else if(itemHandle.isNull(lastBuy)||!itemHandle.isDate(lastBuy)){
						new H.widget.msgBox({
									    title:"错误提示",
									    content:'付款截至时间必须为日期格式！',
									    type:"error"
									
									});
						DOM.get('#J_ItemParam_lastBuy_'+id).focus();
						DOM.addClass(DOM.get('#J_ItemParam_lastBuy_'+id), 'text-error');
						error = true;
					}else if(startAt < promoStartTime){
						new H.widget.msgBox({
									    title:"错误提示",
									    content:'团购开始时间不能早于活动开始时间'+promoStartTime+'！',
									    type:"error"
									
									});
						DOM.get('#J_ItemParam_startAt_'+id).focus();
						DOM.addClass(DOM.get('#J_ItemParam_startAt_'+id), 'text-error');
						error = true;
					}
				}
				params.push(startNum);
				params.push(minNum);
				params.push(maxNum);
				params.push(maxBuy);
				params.push(lastBuy);
				params.push(startAt);
				params.push(EndAt);
				params.push(decreaseNum);
				params.push(tgType);
				params.push(timeInterval);
				r.push(error);
				r.push(params);
				return r;
			},
			/**
			 * 定向营销参数
			 */
			_generalTbSpecParams : function (id, error) {
				var params = [];
				var isInt = DOM.get('#J_IsInt_'+id).value;
				var specPrice = Number(DOM.val(DOM.get('#J_SpecPrice_'+id)));
				var origPrice = Number(DOM.val(DOM.get('#J_ItemPrice_'+id)));
				var decreaseNum = Number(DOM.attr(DOM.get('#J_DecreaseNum_'+id),'title'));
				var isSku = Number(DOM.val(DOM.get('#J_IsSku_'+id)));
				//店铺折扣
				var storeDiscount = DOM.val(DOM.get('#J_Discount'));
				//最低折扣，减钱
				var minPromoValue = DOM.val('#J_minPrivilege');
				var joinType = DOM.val(DOM.get('#J_joinType'));
				
				var promoValue = 0;
				
				if(isSku == 1){
					var promoType = '1';
					promoValue = Number(DOM.val(DOM.get('#J_PromoValue_'+id)));
				}else{
					if (isInt != 0 || Number(DOM.val(DOM.get('#J_FinalType_'+id))) == 3) {
						var promoType = '0';
						promoValue = Number((origPrice - specPrice).toFixed(2));
					} else {
						var promoType = Number(DOM.get('#J_PromoType_'+id).value);
						
						if (promoType == '0') {
							promoValue = Number(DOM.val(DOM.get('#J_Promo2Value_'+id)));
						} else {
							promoValue = Number(DOM.val(DOM.get('#J_PromoValue_'+id)));						
						}
					}
				}
				
				if (specPrice >= origPrice || itemHandle.checkPrice(promoValue) === false || itemHandle.checkPrice(specPrice) == false) {
					new H.widget.msgBox({
					    title:"错误提示",
					    content:'特价金额有误（特价必须小于原价），请检查后再加入！',
					    type:"error"
					});
    				error = true;
    			}else{
    				
    				if (promoType == '0') {
    					
    					//判断优惠内容 “元”
    					if (type == 'tbspec' || type == 'tbspec_buyerLimit' || type == 'onetbspec' || type == 'tg'){
    							
    						if(DOM.val('#J_joinAgain') != 'again'){
    							if(joinType == 'all'){
    								var minimum = minPromoValue;
    							}else{
    								var minimum = promoValue;
    							}
    							
    							if(minimum <= 2){
    								new H.widget.msgBox({
    					                title: "温馨提醒",
    					                content: '您要加入的宝贝中有折扣等于或低于 <em class="color-red">2</em> 折，确定加入吗？',
    					                type: "confirm",
    					                buttons: [{ value: "确定" },{ value: "取消" }],
    					                success: function (result) {
    					                    if (result == "确定"){
    					                    	
    					                    	if(promoValue > Number((origPrice*((10 - storeDiscount)/10)).toFixed(2))){
    			    								new H.widget.msgBox({
    			    					                title: "请修改店铺最低折扣",
    			    					                content: '您设置的宝贝最低折扣率为 <em class="color-red">'+ minimum +'</em> 折，'+
    			    					                		 '您的店铺最低折扣为 <em class="color-red">'+ storeDiscount +'</em> 折可能会不生效，请修改店铺最低折扣低于宝贝折扣 '+
    			    					                		 '<a target="_blank" href="http://ecrm.taobao.com/promotion/show_other_activity.htm">修改店铺最低折扣>></a>',
    			    					                type: "confirm",
    			    					                buttons: [{ value: "已修改完折扣价，确定加入活动" }], 
    			    								 	success: function (result) {
    			    					                    if (result == "已修改完折扣价，确定加入活动"){
    			    					                    	DOM.val('#J_joinAgain','again');
    			    					                    	promotionControl.getLowestDisAdd();
    			    					                    }
    			    					                }
    			    					            });
    			    								error = true;
    			    							}
    					                    	
    					                    }
    					                }
    					            });
    								error = true;
    							}
    							
    						}
    					
    					}else{
    						if(promoValue >Number((origPrice*0.3).toFixed(2))){
    							new H.widget.msgBox({
								    title:"错误提示",
								    content:'优惠金额有误，折扣有效范围在 7.00~9.99之间！',
								    type:"error"
								});
    							error = true;
    						}
    					}
    					
    				} else {

    					//促销方式折七折以上限制
    					if (type == 'tbspec' || type == 'tbspec_buyerLimit' ||  type == 'tg' || type == 'onetbspec') {
    						
    						if(DOM.val('#J_joinAgain') != 'again'){
    							if(joinType == 'all'){
    								var minimum = minPromoValue;
    							}else{
    								var minimum = promoValue;
    							}
    							if(minimum <= 2){
    								new H.widget.msgBox({
    					                title: "温馨提醒",
    					                content: '您要加入的宝贝中有折扣等于或低于 <em class="color-red">2</em> 折，确定加入吗？',
    					                type: "confirm",
    					                buttons: [{ value: "确定" },{ value: "取消" }],
    					                success: function (result) {
    					                    if (result == "确定"){
    					                    	
    					                    	if(promoValue < storeDiscount){
    			    								new H.widget.msgBox({
    			    					                title: "请修改店铺最低折扣",
    			    					                content: '您设置的宝贝最低折扣为 <em class="color-red">'+ minimum +'</em> 折，您的店铺最低折扣为 '+
    			    					                		 '<em class="color-red">'+ storeDiscount +'</em> 折可能会不生效，请修改店铺最低折扣低于宝贝折扣 '+
    			    					                		 '<a target="_blank" href="http://ecrm.taobao.com/promotion/show_other_activity.htm">修改店铺最低折扣>></a>',
    			    					                type: "confirm",
    			    					                buttons: [{ value: "已修改完折扣，确定加入活动" }],
    			    					                success: function (result) {
    			    					                    if (result == "已修改完折扣，确定加入活动"){
    			    					                    	DOM.val('#J_joinAgain','again');
    			    					                    	promotionControl.getLowestDisAdd();
    			    					                    }
    			    					                }
    			    					            });
    			    								error = true;
    			    							}
    					                    	
    					                    }
    					                }
    					            });
    								error = true;
    							}
    							
    						}
    						
    					}else {
    						if (!KISSY.isNumber(promoValue) || promoValue < 7 || promoValue >= 10) {
    							new H.widget.msgBox({
    							    title:"错误提示",
    							    content:'传入了不合法或不正确的参数,有效范围在 7.00~9.99之间！',
    							    type:"error"
    							});
    							DOM.addClass(DOM.get('#J_PromoValue_' + id), 'text-error');
    							error = true;
    						}else{
    							var re = /(^[0-9]([.][0-9]{1,2})?$)|(^1[0-9]([.][0-9]{1,2})?$)|(^2[0-3]([.][0-9]{1,2})?$)|(^10([.]0{1,2})?$)/;
    							if (!re.test(promoValue)) {
    								new H.widget.msgBox({
    								    title:"错误提示",
    								    content:'传入了不合法或不正确的参数,有效范围在 7.00~9.99之间！',
    								    type:"error"
    								});
    								DOM.addClass(DOM.get('#J_PromoValue_' + id),'text-error');
    								error = true;
    							}
    						}
    					}
    						
    				}	
    				
    			}
				
				promoValue.toFixed(2);
				params.push(promoType);
				params.push(promoValue);
				params.push(decreaseNum);
				return [params,error];
			},
			generalSpecParams : function(id, error) {
				var r = [];
				var params = [];
				//特价
				var promoPrice = Number(DOM.val(DOM.get('#J_PromoPrice_'+id)));
				if (itemHandle.checkPrice(promoPrice) === false) {
    				error = true;
    				DOM.addClass(DOM.get('#J_PromoPrice_'+id), 'text-error');
    			}
				params.push(promoPrice);
    			//skus特价
				if (DOM.get('#J_ItemSkus_'+id) == null) {
					params.push('');
					r.push(error);
					r.push(params);
					return r;
				}
				var skusProperties = DOM.val(DOM.get('#J_ItemSkus_'+id));
				var skusPropName = DOM.val(DOM.get('#J_PropsName_'+id));
				var skusPropValue = DOM.val(DOM.get('#J_PropsValue_'+id));

				var skus = [];
				var skuOrigPrices = '';
				var skuPromoPrices = '';
				var origPriceEls = DOM.query('#J_SkuTable_'+id+' .J_SkuOrigPrice');
				var promoPriceEls = DOM.query('#J_SkuTable_'+id+' .J_SkuPromoPrice');
				var len = origPriceEls.length;
				for (var i=0; i<len ;i++) {
    				spp = Number(promoPriceEls[i].value);
    				sop = Number(origPriceEls[i].value);
    				if (itemHandle.checkPrice(spp) === false) {
    					DOM.addClass(promoPriceEls[i], 'text-error');
    					error = true;
        			} else {
    					DOM.removeClass(promoPriceEls[i], 'text-error');
            		}
					skuPromoPrices += promoPriceEls[i].value + ',';
					skuOrigPrices += origPriceEls[i].value + ',';
				}
				
				skuOrigPrices = skuOrigPrices.substring(0, (skuOrigPrices.length-1));
				skuPromoPrices = skuPromoPrices.substring(0, (skuPromoPrices.length-1));
    			
				skus.push(skuOrigPrices);
				skus.push(skuPromoPrices);
				skus.push(skusProperties);
				skus.push(skusPropName);
				skus.push(skusPropValue);

				params.push(skus);

				r.push(error);
				r.push(params);
				return r;
			},
			generalTbSpecParams : function(id, error) {
				var r = [];
				var params = [];
				//获取定向营销活动参数
				result = itemHandle._generalTbSpecParams(id, error);
				params = result[0];
				var error = result[1];
				if (error) {
					DOM.addClass(DOM.get('#J_PromoValue_'+id), 'text-error');
				}
				r.push(error);
				r.push(params);
				return r;
			},
			/**
			 * 阶梯价
			 */
			generalJtjParams : function(id, error){
				var params = [];
				var isSku = DOM.val('#J_IsSku_'+id);
				var origPrice = Number(DOM.val(DOM.get('#J_ItemPrice_'+id)));
				var promoType = DOM.query('#J_PromoType_'+id+' .J_promoType');
				var promoValue = DOM.query('#J_PromoType_'+id+' .J_PromoValue');
				var promoIsInt = DOM.query('#J_PromoType_'+id+' .J_PromoIsInt');
				if(promoIsInt.length<=0){
					var isInt = DOM.get('#J_IsInt_'+id).value;
				}
				var len = promoValue.length;
				for(var m = 0; m<len;m++){
					if(promoIsInt.length>0){
						var isInt = Number(DOM.val(promoIsInt[m]));
					}
					if (isInt != 0) {
						var newType = '0';
						var idd = promoValue[m].id.replace('PromoValue', 'SpecPrice');
						var specPrice = Number(DOM.val(DOM.get('#'+idd)));
						newValue = Number((origPrice - specPrice).toFixed(2));
					}else{
						var newType = Number(DOM.val(promoType[m]));
						
						if (newType == '0') {
							var idd = promoValue[m].id.replace('PromoValue', 'SpecPrice');
							var specPrice = Number(DOM.val(DOM.get('#'+idd)));
							newValue = Number((origPrice - specPrice).toFixed(2));
						} else {
							newValue = Number(DOM.val(promoValue[m]));						
						}
					}
					if ( specPrice >= origPrice) {
	    				DOM.addClass(promoValue[m], 'text-error');
						new H.widget.msgBox({
						    title:"错误提示",
						    content:'特价金额有误（特价必须小于原价），请检查后再加入！',
						    type:"error"
						});
						error = true;
    				}	
					
					//促销方式折七折以上限制
					if(isSku == '1' || newType == '1'){
						if(!KISSY.isNumber(newValue) || newValue <= 0 || newValue >=10){
							DOM.addClass(promoValue[m], 'text-error');
							new H.widget.msgBox({
							    title:"错误提示",
							    content:'传入了不合法或不正确的参数,有效范围在 0.00~9.99之间！',
							    type:"error"
							});
							error = true;
						} else {
							var re = /(^[0-9]([.][0-9]{1,2})?$)|(^1[0-9]([.][0-9]{1,2})?$)|(^2[0-3]([.][0-9]{1,2})?$)|(^10([.]0{1,2})?$)/;
							if(!re.test(newValue)){
								new H.widget.msgBox({
								    title:"错误提示",
								    content:'传入了不合法或不正确的参数,有效范围在 0.00~9.99之间！',
								    type:"error"
								});
								DOM.addClass(promoValue[m], 'text-error');
								error = true;
							}	
						}
					}else{
						if (itemHandle.checkPrice(newValue) === false) {
							DOM.addClass(promoValue[m], 'text-error');
		    				error = true;
		    			}
					}
					if(error == true){
						break;
					}
					param = [newType,newValue];
					params.push(param);
				}
				return [error,params];
				
			}
		
	}
	
	
}, {
    requires: []
});
/**
 * @美化按钮组件
 * @author  @sjs_stef
 */
KISSY.add('utils/beautifyForm/index',function (S) {
	var DOM = S.DOM, Event = S.Event,
	    d = document,
	    body = DOM.get('body'),
		safari = false;
		if(S.UA.safari != 'undefined' && S.UA.safari < 3){
			 safari = true;
		}
	if(S.UA.ie == 6){
		DOM.replaceClass('#J_BodyHtml','has-js','no-js');
	}	
	
	function beautifyForm(el, cfg) { //初始化属性 
	    var self = this; 
	    defaultCfg = {
	        init:true
	    };
	    if(self instanceof beautifyForm) {
	        var config = S.merge(defaultCfg, cfg);
	        self._init(el, config);
	    } else {
	        return new beautifyForm(el, cfg);
	    }
	}
	S.augment(beautifyForm,{
	    _init : function(target, cfg) {
	        var self = this;
//	        if(!target) {
//	            S.log('请输入需要渲染区域的id(_init)');
//	            return;
//	        }
	        self.renderAll(target);
	    },
	    //渲染pid下全部input，自动判断类型
	    renderAll: function(pid){
	        var self = this;
	        pid = typeof(pid) == 'undefined' ? '#J_BodyHtml': pid;
	        var al = DOM.filter (DOM.query(pid+' input'),function(i){if(i.type =='checkbox' || i.type =='radio')return true;});
//	        if(al.length < 1){
//	            S.log('此id下没有input(renderAll)');
//	            return;                
//	        }
//	        DOM.hasClass(body,'has-js') ? '' : DOM.addClass(body,'has-js');
	        for (var h = al.length - 1; h >= 0; h--) {
	            self.renderInput(al[h]);
	        };
	    },
	    //渲染单个input，自动判断类型
	    renderInput: function(id){
	        var self = this;
	        var i = DOM.get(id);
//	        var l = DOM.parent(i,'label') || DOM.parent(i,'span');
	        var l = DOM.parent(i);
	        if (l.tagName.toUpperCase() == 'LABEL' && l.className.indexOf('beautify_') > -1) {
	            if (l.className == 'beautify_check') {
	                self.renderCheckbox(i);
	            }else if (l.className == 'beautify_radio') {
	                self.renderRadio(i);
	            };
	        }else if(l.tagName.toUpperCase() == 'SPAN'){
	            if (DOM.hasClass(i,'beautify_input')) {
	                self.renderCheckPro(i);
	            }
	        }
	    },
	    //渲染pid下全部 高级选择框
	    renderAllCheckPro: function(pid){
	        var self = this;
	        var al = DOM.filter (DOM.query(pid+' input'),function(i){if((i.type =='checkbox' || i.type =='radio') && DOM.hasClass(i,'beautify_input'))return true;});
	        if(al.length < 1){
//	            S.log('此id下没有input(renderAllCheckPro)');
	            return;                
	        }
	        for (var h = al.length - 1; h >= 0; h--) {
	            self.renderCheckPro(al[h]);
	        };
	    },
	    //渲染pid下全部checkbox
	    renderAllCheckbox: function(pid){
	        var self = this;
	        var al = DOM.filter (DOM.query(pid+' input'),function(i){if(i.type =='checkbox')return true;});
	        if(al.length < 1){
	            S.log('此id下没有input(renderAllCheckbox)');
	            return;                
	        }
	        for (var h = al.length - 1; h >= 0; h--) {
	            self.renderCheckbox(al[h]);
	        };
	    },
	    //渲染pid下全部radio
	    renderAllRadio: function(pid){
	        var self = this;
	        var al = DOM.filter (DOM.query(pid+' input'),function(i){if(i.type =='radio')return true;});
	        if(al.length < 1){
	            S.log('此id下没有input(renderAllRadio)');
	            return;                
	        }
	        for (var h = al.length - 1; h >= 0; h--) {
	            self.renderRadio(al[h]);
	        };
	    },
	    //渲染单个高级选择框
	    renderCheckPro: function(id){
	        var self = this;
	        var i = DOM.get(id);
	        var isCheckbox = DOM.prop(i,"type") == "checkbox";
	        var l = DOM.parent(i,'label') || DOM.parent(i,'span');
	        if (!DOM.hasClass(i,'beautify_input')) {
	            S.log('input必须有class=”beautify_input“(renderCheckPro)');
	            return;
	        }
	        if(isCheckbox){
	        	if(safari && i.checked == true || i.checked){
	        		DOM.removeClass(l,'radio-checkoff-span');
	        		DOM.addClass(l,'radio-checkon-span');
	        		DOM.addClass(DOM.parent(l),'radio-checkstyle');
	        	}else{
	        		DOM.removeClass(l,'radio-checkon-span');
	        		DOM.addClass(l,'radio-checkoff-span');
	        		DOM.removeClass(DOM.parent(l),'radio-checkstyle');
	        	}
	        }else{
	        	if(safari && i.checked == true || i.checked){
	        		DOM.removeClass(l,'beautify_radio_off');
	        		DOM.addClass(l,'beautify_radio_on');
	        		DOM.addClass(DOM.parent(l),'radio-checkstyle');
	        	}else{
	        		DOM.removeClass(l,'beautify_radio_on');
	        		DOM.addClass(l,'beautify_radio_off');
	        		DOM.removeClass(DOM.parent(l),'radio-checkstyle');
	        	}
	        }
	        Event.on(l,'click',function(e){
	        	e.stopPropagation();
                if(e.target.tagName.toUpperCase() == 'LABEL'){
                	return ;
                }else{
                	 self.toggleCheckPro(i);
                }
	        })
	    },
	    //渲染单个checkbox
	    renderCheckbox: function(id){
	        var self = this;
	        var i = DOM.get(id);
	        var l = DOM.parent(i,'label') || DOM.parent(i,'span');
	        if (!DOM.hasClass(l,'beautify_check')) {
//	            S.log('input的父级标签应为”beautify_check“(renderCheckbox)');
	            return;
	        }
	        if(i.disabled == true){
	            if(safari && i.checked == true || i.checked){
	                l.className = 'beautify_check c_on_disable';
	            }else{
	                l.className = 'beautify_check beautify_check_disable';
	            }
	        }else {
	            if(safari && i.checked == true || i.checked){
	                l.className = 'beautify_check c_on';
	            }else{
	                l.className = 'beautify_check c_off';
	            }
	            Event.on(l,'click',function(e){
	            	e.stopPropagation();
	                if(e.target.tagName.toUpperCase() == 'LABEL'){
	                	return ;
	                }else{
	                	 self.toggleCheckbox(i);
	                }
	            })
	        }
	    },
	    //渲染单个radio
	    renderRadio: function(id){
	        var self = this;
	        var i = DOM.get(id);
	        var l = DOM.parent(i,'label') || DOM.parent(i,'span');
	        if (!DOM.hasClass(l,'beautify_radio')) {
//	            S.log('input的父级标签应为”beautify_radio“(renderRadio)');
	            return;
	        }
	        if(i.disabled == true){
	            if(safari && i.checked == true || i.checked){
	                l.className = 'beautify_radio r_on_disable';
	            }else{
	                l.className = 'beautify_radio beautify_radio_disable';
	            }
	        }else {
	            if(safari && i.checked == true || i.checked){
	                l.className = 'beautify_radio r_on';
	            }else{
	                l.className = 'beautify_radio r_off';
	            }
	            Event.on(l,'click',function(e){
	            	e.stopPropagation();
	                if(e.target.tagName.toUpperCase() == 'LABEL'){
	                	return ;
	                }else{
	                	 self.toggleRadio(i);
	                }
	            })
	        }
	    },
	    // checkbox单个设置为选中
	    setCheckboxOn: function(id) {
	        var i = DOM.get(id);
	        var l = DOM.parent(i,'label');
	        l.className = 'beautify_check c_on';
	        i.checked = true;
	    },
	    // checkbox单个设置为未选中
	    setCheckboxOff: function(id) {
	        var i = DOM.get(id);
	        var l = DOM.parent(i,'label');
	        l.className = 'beautify_check c_off';
	        i.checked = false;
	    },
	    // checkbox单个设置为选中 disabled 状态
	    setCheckboxDisabled: function(id) {
	        var i = DOM.get(id);
	        var l = DOM.parent(i,'label');
            if(safari && i.checked == true || i.checked){
                l.className = 'beautify_check c_on_disable';
            }else{
                l.className = 'beautify_check beautify_check_disable';
            }
	        i.disabled = true;
	    },
	    // checkbox单个设置为选中 disabled 状态
	    setCheckboxNoDisabled: function(id) {
	        var i = DOM.get(id);
	        var l = DOM.parent(i,'label');
	        if(safari && i.checked == true || i.checked){
                l.className = 'beautify_check c_on_disable';
            }else{
                l.className = 'beautify_check beautify_check_disable';
            }
	        i.disabled = false;
	    },
	    // checkbox切换
	    toggleCheckbox: function(id) {
	        var i = DOM.get(id);
	        var l = DOM.parent(i,'label');
	        if (l.className == 'beautify_check c_off') {
	            if(l.className == 'beautify_check c_on_disable'){
	                l.className = 'beautify_check c_on_disable';
	            }else{
	                l.className = 'beautify_check c_on';
	            }
	            if (safari){i.click();}
	        }else if(l.className == 'beautify_check c_on_disable'){
	            l.className = 'beautify_check c_on_disable';
	            if (safari) i.click();
	        }else if(l.className == 'beautify_check beautify_check_disable'){
	            l.className = 'beautify_check beautify_check_disable';
	            if (safari) i.click();
	        }else {
	            l.className = 'beautify_check c_off';
	            if (safari) i.click();
	        };
	    },
	    // radio切换
	    toggleRadio: function(id) {
	        var i = DOM.get(id);
	        var iName = DOM.attr(i,'name');
	        var l = DOM.parent(i,'label');
	        if (l.className == 'beautify_radio r_off' || i.checked) {
	            var ls = DOM.filter (DOM.query('input'),function(i){if(i.type =='radio')return true;});
	            // var ls = DOM.siblings(l);
	            for (var j = 0; j < ls.length; j++) {
	                var li =  DOM.parent(ls[j]);
	                //var lii = DOM.children(ls[j],'input');
	                //console.log(li);
	                if (li.className.indexOf('beautify_radio') == -1)  continue;
	                if (DOM.attr(ls[j],'name') !== iName)  continue;
	                li.className = 'beautify_radio r_off';
	            };
	            l.className = 'beautify_radio r_on';
	            if (safari) i.click();
	        }else if(l.className == 'beautify_radio beautify_radio_disable'){
	            l.className = 'beautify_radio beautify_radio_disable';
	            if (safari) i.click();
	        }else {
	            l.className = 'beautify_radio r_off';
	            if (safari) i.click();
	        };
	    },
	    // 普通radio切换
	    setRadioOn: function(id) {
	        var i = DOM.get(id);
	        var iName = DOM.attr(i,'name');
	        var l = DOM.parent(i,'label');
	        if (l.className == 'beautify_radio r_off' || i.checked) {
	            var ls = DOM.filter (DOM.query('input'),function(i){if(i.type =='radio')return true;});
	            for (var j = 0; j < ls.length; j++) {
	                var li =  DOM.parent(ls[j]);
	                if (li.className.indexOf('beautify_radio') == -1)  continue;
	                if (DOM.attr(ls[j],'name') !== iName)  continue;
	                li.className = 'beautify_radio r_off';
	            };
	            l.className = 'beautify_radio r_on';
	            i.checked = true;
	        };
	    },
	    // 高级选择框切换
	    toggleCheckPro: function(id) {
	        var i = DOM.get(id);
	        var isCheckbox = DOM.prop(i,"type") == "checkbox";
	        var iName = DOM.attr(i,'name');
	        var l = DOM.parent(id,'span');
	        if(isCheckbox){
		        if (DOM.hasClass(l,'radio-checkon-span')) {
		           DOM.removeClass(DOM.parent(l),'radio-checkstyle');
		           DOM.removeClass(l,'radio-checkon-span');
		           if (!DOM.hasClass(l,'radio-checkoff-span')){
		                DOM.addClass(l,'radio-checkoff-span');
		           };
		        }else{
		           DOM.addClass(DOM.parent(l),'radio-checkstyle');
		           DOM.toggleClass(l,'radio-checkon-span','radio-checkoff-span');
		        }
	        }else{
	        	if(DOM.hasClass(l,'beautify_radio_off')){
	        		var ls = DOM.filter (DOM.query('.beautify_input'),function(i){if(i.type =='radio')return true;});
		            for (var i = 0; i < ls.length; i++) {
		                var li = ls[i];
		                var lip = DOM.parent(ls[i]);
		                if (li.className.indexOf('beautify_input') == -1)  continue;
		                if (DOM.attr(li,'name') !== iName)  continue;
		                lip.className = 'beautify_radio_off';
		                DOM.removeClass(DOM.parent(lip),'radio-checkstyle');
		            };
		            DOM.addClass(DOM.parent(l),'radio-checkstyle');
		            l.className = 'beautify_radio_on';
		            if (safari) i.click();
	        	}else{
	        		DOM.addClass(DOM.parent(l),'radio-checkstyle');
		            l.className = 'beautify_radio_on';
		            if (safari) i.click();
	        	}
	        }
	    },
	    // 高级radio切换
	    setRadioPro: function(id) {
	    	  var i = DOM.get(id);
		      var iName = DOM.attr(i,'name');
		      var l = DOM.parent(id,'span');
    		  var ls = DOM.filter (DOM.query('.beautify_input'),function(i){if(i.type =='radio')return true;});
              for (var i = 0; i < ls.length; i++) {
	                var li = ls[i];
	                var lip = DOM.parent(ls[i]);
	                if (li.className.indexOf('beautify_input') == -1)  continue;
	                if (DOM.attr(li,'name') !== iName)  continue;
	                lip.className = 'beautify_radio_off';
	                DOM.removeClass(DOM.parent(lip),'radio-checkstyle');
	             };
	         DOM.addClass(DOM.parent(l),'radio-checkstyle');
             l.className = 'beautify_radio_on';
             DOM.get(id).checked = true;
	    },
	    // 高级radio设置为未选中
	    setRadioProOff: function(id) {
	    	  var i = DOM.get(id);
		      var iName = DOM.attr(i,'name');
		      var l = DOM.parent(id,'span');
    		  var ls = DOM.filter (DOM.query('.beautify_input'),function(i){if(i.type =='radio')return true;});
              for (var i = 0; i < ls.length; i++) {
	                var li = ls[i];
	                var lip = DOM.parent(ls[i]);
	                if (li.className.indexOf('beautify_input') == -1)  continue;
	                if (DOM.attr(li,'name') !== iName)  continue;
	                lip.className = 'beautify_radio_on';
	             };
             l.className = 'beautify_radio_off';
             DOM.get(id).checked = false;
	    },
	    // 高级checkbox on单个设置为选中
	    setCheckboxProOn: function(id) {
	    	  var i = DOM.get(id);
		        var iName = DOM.attr(i,'name');
		        var l = DOM.parent(id,'span');
		        DOM.addClass(DOM.parent(l),'radio-checkstyle');
		        DOM.toggleClass(l,'radio-checkon-span','radio-checkoff-span');
	            DOM.get(id).checked = true;
	    },
	    // 高级checkbox on单个设置为未选中
	    setCheckboxProOff: function(id) {
	    	  var i = DOM.get(id);
		        var iName = DOM.attr(i,'name');
		        var l = DOM.parent(id,'span');
	           DOM.removeClass(DOM.parent(l),'radio-checkstyle');
	           DOM.removeClass(l,'radio-checkon-span');
	           if (!DOM.hasClass(l,'radio-checkoff-span')){
	                DOM.addClass(l,'radio-checkoff-span');
	           };
	           DOM.get(id).checked = false;
	    }
	});
	return beautifyForm;
});
   		 
/**
 * @fileOverview 
 * @author  
 */
KISSY.add('page/mods/check',function (S) {
    // your code here
	
	return checkUtil = {
			/*违禁词限制*/
			checkSpecTitle : function(str){
				var result = [];
				var error = false;
				var msg = null;
				var re =/(淘宝)|(限时折扣)|(限时打折)|(良品)|(淘金币)|(天天特价)|(满就送)/i;
				if(re.test(str)){
				    var rt = re.exec(str);
				    if(rt != null){
						error = true;
						msg = '含有违禁字'+rt[0]+'！';
					}
				}
				result.push(error);
				result.push(msg);
				return result;
			},
			/*验证活动名称*/
			checkPromoName : function(promoName){
				var result = [];
				var error = false;
				var msg = null;
				var re=/^[\u4E00-\u9FA5\uf900-\ufa2d\A-Za-z0-9]{2,5}$/;
				if(!re.test(promoName)){
					if(promoName.length<2 || promoName.length >5){
						error = true;
						msg = '长度2~5个字符！';
					}else {
						var reg=/[^\u4E00-\u9FA5\uf900-\ufa2d\A-Za-z0-9]+/;
						var rt = promoName.match(reg);
						if(rt != null){
							error = true;
							msg = '含有非法字符'+rt[0]+'！';
						}
					}
				}
				result.push(error);
				result.push(msg);
				return result;
			},
			/*验证活动备注*/
			checkPromoDesc : function(promoDesc){
				var result = [];
				var error = false;
				var msg = null;
				var re=/^[\u4E00-\u9FA5\uf900-\ufa2d\w\s\，！。《》（）、—]{0,30}$/;
				if(!re.test(promoDesc)){
					if(promoDesc.length>30){
						error = true;
						msg = '长度30个字以内！';
					}else {
						var reg=/[^\u4E00-\u9FA5\uf900-\ufa2d\w\s\，！。《》（）、—]+/;
						var rt = promoDesc.match(reg);
						if(rt != null){
							error = true;
							msg = '含有非法字符'+rt[0]+'！';
						}
					}
				}
				result.push(error);
				result.push(msg);
				return result;
			},
			/*URL验证*/
			checkUrl : function(v){
				var result = [];
				var error = false;
				var msg = null;
				var reUrl = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/ ;
				if(!reUrl.test(v)){
						error = true;
						msg = '非法URl地址！';
				}
				result.push(error);
				result.push(msg);
				return result;
			},
			/*折扣验证*/
			checkDiscount : function(v){
				var result = [];
				var error = false;
				var msg = null;
				if(isNaN(Number(v)) || v <= 0 || v >=10){
					error = true;
					msg = '折扣范围在 0.00~9.99之间哦！';
				}else {
					var re = /(^[0-9]([.][0-9]{1,2})?$)|(^1[0-9]([.][0-9]{1,2})?$)|(^2[0-3]([.][0-9]{1,2})?$)|(^10([.]0{1,2})?$)/;
					if(!re.test(v)){
						error = true;
						msg = '折扣范围在 0.00~9.99之间哦！';
					}
				}
				result.push(error);
				result.push(msg);
				return result;
			},
	         /**
	         * JSON ajax 传参转换
	         * @param {Object} str
	         * @return {Object}
	         */
	        strProcess : function(str){
	                return str.replace(/\\/g, '\\\\').replace(/\"/g, '\\"').replace(/[\t\n&]/g, '%26').replace(/%/g, '%25');
	        },
            /**
             * 格式化数字
             * @example formatNumber(100.888,2); //结果为100.88
             * @param {Object} str
             * @return {date}
             */
	        FormatNumber: function(srcStr,nAfterDot){
                    var srcStr,nAfterDot;
                    var resultStr,nTen;
                    srcStr = ""+srcStr+"";
                    strLen = srcStr.length;
                    dotPos = srcStr.indexOf(".",0);
                    if (dotPos == -1){
                        resultStr = srcStr+".";
                        for (i=0;i<nAfterDot;i++){
                            resultStr = resultStr+"0";
                        }
                        return resultStr;
                    }else{if ((strLen - dotPos - 1) >= nAfterDot){
                            nAfter = dotPos + nAfterDot + 1;
                            nTen =1;
                            for(j=0;j<nAfterDot;j++){
                            nTen = nTen*10;
                            }
                            resultStr = Math.floor(parseFloat(srcStr)*nTen)/nTen;
                            return resultStr;
                        }else{
                            resultStr = srcStr;
                                for (i=0;i<(nAfterDot - strLen + dotPos + 1);i++){
                                resultStr = resultStr+"0";
                                }
                            return resultStr;
                        }
                    }
            },
			/*是否为空*/
			isNull : function(str){
				var result = [];
				var error = false;
				var msg = null;
				if(str == null ||str == ""){
					error = true;
					msg = '请填写，此项不能为空！';
				}
				result.push(error);
				result.push(msg);
				return result;
				
			}
	}
});

/**
 * @fileOverview 
 * @author  
 */
KISSY.add('page/item-init',function (S,showPages,itemHandle,Select,beautifyForm,Tooltip,Overly,itemCheck,Overlay,Calendar) {
    var DOM = S.DOM, Event = S.Event, tbTabArray = new Array('1','2'), promoTabArray = new Array('3','4','5');
    return promotionControl = {
    		isTarget:false,
    		processStatus : 0,  //到第三步 ，提示 是否将勾选宝贝加入活动 ，处理状态，
			paginator : null,
	    	promotionItemPaginator : null,
	    	msg : null,
	    	Form : null,
	    	tabs : null,
	    	skuPriceTip : null,
	    	select : null,
	    	select1 : null,
	    	isChanged : false, //是否编辑过
	    	isSelected : false, //是否选中过
	    	popResetPromoItemDialog : null,
	    	init : function() {
				  
			       //美化input
				   promotionControl.Form = new beautifyForm();
				   //店铺分类下拉框
				   promotionControl.select = new Select.Select({  
	                    render:'#J_SelectItemCid',
	                    valueField:'#J_SelectItemCidHide',
	                    items:cidItem
	               });
				   promotionControl.select.render();
				   promotionControl.select.setSelectedValue('0');
				   //智能排序下拉框
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
			       
			       
			       //显示内容类型tab切换
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
                               promotionControl.isTarget = false;
                               promotionControl.searchTbItems();
                               break;
                           case 3:
                               DOM.val('#J_PromoTabType','0');
                               DOM.hide('.J_TbCont');
                               DOM.show('.J_PromoCont');
                               promotionControl.loadPromotionItems();
                               break;
                           case 4:
                               DOM.val('#J_PromoTabType','4');
                               DOM.hide('.J_TbCont');
                               DOM.show('.J_PromoCont');
                               promotionControl.loadPromotionItems();
                               break;
                           case 5:
                               DOM.val('#J_PromoTabType','1');
                               DOM.hide('.J_TbCont');
                               DOM.show('.J_PromoCont');
                               promotionControl.loadPromotionItems();
                               break;
                       }
                       DOM.removeClass('#J_ControlBtm','fix-bottom');
                       DOM.removeClass('.J_ChooseShowType','current');
                       DOM.addClass(ev.currentTarget,'current');
                   })
                   
                    //高级筛选活动   
                    Event.on('#J_FilterItem','click',function(ev){
                    	if(!promotionControl.popResetPromoItemDialog){
	                    		if(DOM.hasClass(ev.currentTarget,'ing')){
                    				return ;
                    			}
                    			DOM.addClass(ev.currentTarget,'ing');
	                    	  	var submitHandle = function(o) {
		                    		 var str = '<div class="pop-reset-promoItem ks-clear" id="J_PopResetPromoItemBox">'+
		                    		 				'<div class="input_style"><span><input type="radio" id="J_filterCurrent" class="fl beautify_input" name="filterType" checked="checked" value="0"></span><label for="J_filterCurrent">&nbsp;筛选宝贝</label></div>'+
		                    		 				'<div class="input_style"><span><input type="radio" id="J_filterSimilar" class="fl beautify_input" name="filterType" value="1"></span><label for="J_filterSimilar">&nbsp;排除宝贝</label></div>'
		                    		 				+o.payload.body+'</div>';
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
						              	     	 if(ids == ''){
						              	     		DOM.val('#J_filter','1');
						              	     	 }
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
                  });
			       
				   //初始加载一次
				   if(isEditMode){
				       promotionControl.loadPromotionItems();
				   }else{
				       promotionControl.searchTbItems();
				   }
                   
				   //团购选择时间
			       new Calendar.DatePicker({
			            trigger:'.J_tiems',
			            showTime:true,
			            autoRender : true,
			            autoSetValue :true,
			            delegateTigger :true
				   })
			       
	                //点击批量设置按钮
	                Event.on('#J_editAll','click',function(e){
	                    DOM.show('#J_CancelEditAll');
	                    DOM.hide('#J_editAll');
	                    DOM.show('#J_BatchSet');
	                    if(!DOM.prop('#J_TopCheckAll','checked') && DOM.val('#J_CurrentTab') <= 2){
	                        DOM.show('#J_BatchTip');
	                    }
	                })
	                Event.on('#J_CancelEditAll','click',function(e){
	                    DOM.hide('#J_CancelEditAll');
	                    DOM.show('#J_editAll');
	                    DOM.hide('#J_BatchSet');
	                    DOM.hide('#J_BatchTip');
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
	                
	                //批量设置-输入框获得焦点
	                Event.on('#J_BatchSet input','focus change keyup',function(ev){
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
	                        if(type == 'jtj'){
	                        	promotionControl.editAllJtj();
	                        }else{
	                        	promotionControl.editAll();
	                        }
	                    }
	                })
	                
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

	                //li点击选中
	                Event.delegate(document,'click mouseenter mouseleave','.J_listItem',function(ev){
	                    var data = DOM.attr(ev.currentTarget,'data');
                        var currentTab = DOM.val('#J_CurrentTab');
	                    var promoBox = DOM.get('#J_PromoBox_'+data);
	                    var operation = DOM.get('#J_Operation_'+data);
	                    var promoType = DOM.val('#J_PromoType_'+data);
	                    var lastEditValue = DOM.val('#J_LastEditValue');
	                    var lastEditMode = DOM.val('#J_LastEditMode');
	                    if(ev.type == 'click'){
	                        DOM.hide('#J_BatchTip');
	                        var liCheckbox = DOM.get('#J_check'+data);
	                        if(!liCheckbox.disabled){
	                            if(!liCheckbox.checked){
	                                if(S.inArray(currentTab,tbTabArray)){
	                                    DOM.removeClass([promoBox,operation], 'ks-hidden');
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
                            var h = Number(DOM.height(joinInfo)+65);
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
				   
				    /*加入宝贝授权*/
				    var timeFunName = null;
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
                                         var handler = function(){
                                                 switch(promotionControl.processStatus){
                                                     case 1 :
                                                     case 2 :
                                                     case 3 :
                                                     case 4 :
                                                     case 6 :
                                                         clearInterval(timer);
                                                         break;
                                                     case 5 :
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
				Event.on('#J_PromoSave','click',function(){
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
				
	    	    Event.on('#J_SearchBtn','click',promotionControl.searchTbItems); //搜索淘宝宝贝
	    	    Event.on('#J_RightSearchBtn','click',promotionControl.loadPromotionItems); //搜索活动中宝贝
	    	    Event.on('#J_TopCheckAll','click',promotionControl.checkAll);  //淘宝宝贝全选
	        },
	        
	        //tab切换时重置选项
	        searchReset : function(){
	            DOM.val('#J_StartPrice','');
	            DOM.val('#J_EndPrice','');
	            DOM.val('#J_RightStartPrice','');
	            DOM.val('#J_RightEndPrice','');
	            if(DOM.val('#J_SearchTitle') != '关键字、商品链接、商品编码'){
	            	DOM.val('#J_SearchTitle','关键字、商品链接、商品编码');
	            }
	            if(DOM.val('#J_RightSearchTitle') != '关键字、商品链接、商品编码'){
	            	DOM.val('#J_RightSearchTitle','关键字、商品链接、商品编码');
	            }
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
                if(btnOffsetTop < custonHeight) {
                     DOM.removeClass('#J_ControlBtm','fix-bottom');
                     return true;
                 }else {
                     DOM.addClass('#J_ControlBtm','fix-bottom');
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
		            DOM.val('#J_minPrivilege',Math.min.apply(null,privilegeJson));
					var minPromoValue = DOM.val('#J_minPrivilege');
		 			new H.widget.msgBox({
		                title: "店铺折扣获取失败",
		                content: '您设置的宝贝最低折扣为 <em class="color-red">'+ minPromoValue +'</em> 折，请确保您的店铺最低折扣低于您的宝贝折扣 '+
		                		 '<a target="_blank" href="http://ecrm.taobao.com/promotion/show_other_activity.htm">修改店铺最低折扣>></a>',
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
//	        	var joinItemId = DOM.attr('#J_joinType','item-id');
	        	var joinItemId = DOM.val('#J_CurrentTab');
	        	if(joinType == 'all'){
    				if(joinItemId >= 3){
        				promotionControl.editPromoItem();
        			}else{
        				promotionControl.addSelectItemsToPromotion();
        			}
        		}else{
        			if(joinItemId >= 3){
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
			 			DOM.text('#J_storeDiscount','获取不到');
			 		};
					DOM.show('#J_loadingDiscount');
			 		DOM.hide('#J_storeDiscount');
			 		var isLoading = DOM.val('#J_isDiscount');
			 		var data = 'fg='+1;
			  	    new H.widget.asyncRequest().setURI(getLowestDisUrl).setMethod("GET").setHandle(sucess).setErrorHandle(error).setData(data).send(); 
	        	},500);
	        },
	        
	        //执行确定加入活动
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
			
			//搜索淘宝宝贝参数
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
    	    	var sortvalue = DOM.val('#J_SortValue'); //智能排序
    	    	if(sortvalue == 0 || sortvalue == 1){
					var itemOrder = 0; //排序方式
				}else{
					var itemOrder = sortvalue;//排序方式
				}
    	    	var itemPage = 10; //每页多少条
    	    	var startPrice = DOM.val(DOM.get("#J_StartPrice")); //价格开始
				var endPrice = DOM.val(DOM.get("#J_EndPrice")); //价格结束
    	    	var data = "q="+title+"&cid="+cid+"&type="+type;
            	    data +="&itemOrder="+itemOrder+"&pageSize="+itemPage;
					data +="&pid="+pid;
					data +="&is_filter="+is_filter;
					data +="&pids="+pids;
					data += "&start_price="+startPrice+"&end_price="+endPrice;
				return data ;
			},
	        
	        //搜索淘宝宝贝
	        searchTbItems : function() {
                var submitHandle = function(o) {
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
					
					if(o.payload.count_promo != 0){
                    	DOM.show('#J_CountPromo');
                    	DOM.html('#J_CountPromo',o.payload.count_promo);
                    }else{
                    	DOM.hide('#J_CountPromo');
                    }
	        	    
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
					
					pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
					
                    //底部悬浮
					DOM.addClass('#J_ControlBtm','fix-bottom');
                    window.onscroll=function() {
                        promotionControl.moveLayer();
                    };
                    
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
			renderItems : function(c) {
				DOM.html(DOM.get("#J_TbItemList"),c,true);
                promotionControl.Form.setCheckboxOff(DOM.get('#J_TopCheckAll'));
    			var oTriggers = DOM.query('#J_TbItemList .J_CheckBox');
                Event.on(oTriggers, "click", promotionControl.checkBoxClick);
                
                //输入框文本选中
                var inputs = DOM.filter (DOM.query('input'),function(i){if(i.type =='text')return true;})
            	Event.on(inputs,'focus',function(ev){
            		ev.currentTarget.select();
            	});

                //设置宝贝提示框
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
                    var cont = '<div class="ui-tip">'+
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
                            DOM.removeClass(ev.currentTarget,'text-error');
                            DOM.replaceClass(DOM.query('.J_SpecType','#J_TbItem_'+evId),'input-price-focus','input-price');
                            DOM.removeClass(ev.currentTarget,'input-price');
                            DOM.addClass(ev.currentTarget,'input-price-focus');
                            DOM.val('#J_PromoType_'+evId,evType);
                        }
                    }else if(ev.type == 'blur'){ 
                    	DOM.val('#J_LastEditMode',evType);
                        DOM.val('#J_LastEditValue',evValue);
                    }
                })
                
                promotionControl.Form.renderAll('#J_TbItemList');
			},
			
			//选择宝贝展开设置项
			checkBoxClick : function(e) {
				var id = this.value;
				var promoBox = DOM.get('#J_PromoBox_'+id);
				var operation = DOM.get('#J_Operation_'+id);
                var lastEditValue = DOM.val('#J_LastEditValue');
                var lastEditMode = DOM.val('#J_LastEditMode');
				DOM.hide('#J_BatchTip');
				var checkBoxs = DOM.query("#J_TbItemList .J_CheckBox");
    			var len = checkBoxs.length;
    			var allFlag = true;
				if(!this.checked){
                    promotionControl.Form.setCheckboxOff(DOM.get('#J_TopCheckAll'));
                    DOM.addClass([promoBox,operation], 'ks-hidden');
                    if(lastEditValue != 'none'){
                        if(lastEditMode == '1'){
                            DOM.val('#J_PromoValue_'+id,lastEditValue);
                            Event.fire('#J_PromoValue_'+id,'keyup');
                        }else{
                            DOM.val('#J_Promo2Value_'+id,lastEditValue);
                            Event.fire('#J_Promo2Value_'+id,'keyup');
                        }
                    }
        			for(i=0; i<len; i++){
						if(checkBoxs[i].disabled) continue;
						if(checkBoxs[i].checked){
							allFlag = false;
							break;
						} 
					}
        			if(allFlag){
        				DOM.replaceClass('#J_BtmAddToPromo','button-green ','button-gray');
        			}
				}else{
        			for(i=0; i<len; i++){
						if(checkBoxs[i].disabled) continue;
						if(!checkBoxs[i].checked){
							allFlag = false;
							break;
						} 
					}
        			if(allFlag){
						promotionControl.Form.setCheckboxOn('#J_TopCheckAll');
        			}
        			DOM.replaceClass('#J_BtmAddToPromo','button-gray','button-green');
				    DOM.removeClass([promoBox,operation], 'ks-hidden');
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
					
					//底部悬浮
					DOM.addClass('#J_ControlBtm','fix-bottom');
                    window.onscroll=function() {
                        promotionControl.moveLayer();
                    };
                    
	    			promotionControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_Paging',2);
	    			promotionControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_TopPaging',3);
	        	    promotionControl.renderItems(o.payload.body);
                    
                    if(o.payload.count_promo != 0){
                    	DOM.show('#J_CountPromo');
                    	DOM.html('#J_CountPromo',o.payload.count_promo);
                    }else{
                    	DOM.hide('#J_CountPromo');
                    }
	        	    
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
                        promotionControl.Form.setCheckboxOn(checkBoxs[i]);
                        DOM.replaceClass('#J_BtmAddToPromo','button-gray','button-green');
					}else{
						DOM.addClass(DOM.get('#J_PromoBox_'+iid), 'ks-hidden');
						DOM.addClass(DOM.get('#J_Operation_'+iid), 'ks-hidden');
                        promotionControl.Form.setCheckboxOff(checkBoxs[i]);
                        DOM.replaceClass('#J_BtmAddToPromo','button-green','button-gray');
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
                        promotionControl.Form.setCheckboxOn(checkBoxs[i]);
                    } else {
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
						//部分参与：满就送，订单限购，免邮
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
						DOM.val('#J_TotalPromoItems',totalRecords);
						
					} else { 
						DOM.get('#J_REmpty').style.display = '';
						DOM.css(DOM.query(".J_PromotionItemBtnHolder"),'display' ,'none');
					}
	        	    
	        	    if(o.payload.count_promo != 0){
                    	DOM.show('#J_CountPromo');
                    	DOM.html('#J_CountPromo',o.payload.count_promo);
                    }else{
                    	DOM.hide('#J_CountPromo');
                    }
	        	    
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
	        	    
	        	    DOM.html(DOM.get("#J_PromotionItemList"), o.payload.body,true);
	        	   
				    var oTriggers = DOM.query('#J_PromotionItemList .J_CheckBox');
	                Event.on(oTriggers, "click", function(ev){
                        DOM.hide('#J_BatchTip');
					});
					
	                //鼠标切换优惠输入框（打折或减价）效果改变
	                Event.on('.J_SpecType','focus',function(ev){
	                    var evId = DOM.attr(ev.currentTarget,'data');
	                    var evType = DOM.attr(ev.currentTarget,'promoType');
	                    if(!DOM.hasClass(ev.currentTarget,'input-price-focus')){
	                        DOM.removeClass(ev.currentTarget,'text-error');
                            DOM.replaceClass(DOM.query('.J_SpecType','#J_TbItem_'+evId),'input-price-focus','input-price');
                            DOM.removeClass(ev.currentTarget,'input-price');
                            DOM.addClass(ev.currentTarget,'input-price-focus'); 
                            DOM.val('#J_PromoType_'+evId,evType);
	                    }
	                })
	                
	                //输入框文本选中
	                var inputs = DOM.filter (DOM.query('input'),function(i){if(i.type =='text')return true;})
	            	Event.on(inputs,'focus',function(ev){
	            		ev.currentTarget.select();
	            	});
	                
	                //底部悬浮
	                DOM.addClass('#J_ControlBtm','fix-bottom');
        	        window.onscroll = function(){
                        promotionControl.moveLayer(); 
                    };
	                
                    promotionControl.Form.renderAll('#J_PromotionItemList');
	        	    pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
					promotionControl.promotionItemPaginator = new showPages('promotionControl.promotionItemPaginator').setRender(promotionControl.promotionItemPaginationHandle).setPageCount(pageCount).printHtml('#J_PromotionItemPaging',2);
					DOM.hide('#J_RightLoading');
					DOM.show('#J_MainRightContent');
		    	};
		    	 if(DOM.val(DOM.get("#J_SearchTitle")) != '关键字、商品链接、商品编码'){
        	    	var title = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle"))); //标题
        	    }else{
        	    	var title ='';
        	    }
        	    var status = DOM.val(DOM.get('#J_PromoTabType'));
        	    var itemPage = 10; //每页多少条
				var startPrice = DOM.val(DOM.get("#J_RightStartPrice"));
	    	    var endPrice = DOM.val(DOM.get("#J_RightEndPrice"));
	    	    var data = "promo_id="+promotionId+"&status="+status+"&title="+title+"&pageSize="+itemPage+"&start_price="+startPrice+"&end_price="+endPrice;
				DOM.show('#J_RightLoading');
				DOM.hide('#J_MainRightContent');
        	    new H.widget.asyncRequest().setURI(loadPromotionItemsUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			},
			
			promotionItemPaginationHandle : function(turnTo,flag) {
				pageId = turnTo;
	    		var submitHandle = function(o) {
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
						DOM.val('#J_TotalPromoItems',totalRecords);
					}else{ 
						DOM.get('#J_REmpty').style.display = '';
						DOM.css(DOM.query(".J_PromotionItemBtnHolder"),'display','none');
					}
	        	    
	        	    if(o.payload.count_promo != 0){
                    	DOM.show('#J_CountPromo');
                    	DOM.html('#J_CountPromo',o.payload.count_promo);
                    }else{
                    	DOM.hide('#J_CountPromo');
                    }
	        	    
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

                    DOM.html(DOM.get("#J_PromotionItemList"), o.payload.body);
	        	    
	        	    var oTriggers = DOM.query('#J_PromotionItemList .J_CheckBox');
		         	Event.on(oTriggers, "click", function(ev){
		         		DOM.hide('#J_BatchTip');
					});
	        	    
		         	//鼠标切换优惠输入框（打折或减价）效果改变
	                Event.on('.J_SpecType','focus',function(ev){
	                    var evId = DOM.attr(ev.currentTarget,'data');
	                    var evType = DOM.attr(ev.currentTarget,'promoType');
	                    if(!DOM.hasClass(ev.currentTarget,'input-price-focus')){
	                        DOM.removeClass(ev.currentTarget,'text-error');
                            DOM.replaceClass(DOM.query('.J_SpecType','#J_TbItem_'+evId),'input-price-focus','input-price');
                            DOM.removeClass(ev.currentTarget,'input-price');
                            DOM.addClass(ev.currentTarget,'input-price-focus');
                            DOM.val('#J_PromoType_'+evId,evType);
	                    }
	                })
	                
	                //输入框文本选中
	                var inputs = DOM.filter (DOM.query('input'),function(i){if(i.type =='text')return true;})
	            	Event.on(inputs,'focus',function(ev){
	            		ev.currentTarget.select();
	            	});
		         	
	        	    //底部悬浮
	                DOM.addClass('#J_ControlBtm','fix-bottom');
	    		    window.onscroll=function() {
                        promotionControl.moveLayer();
                    };
		    		
                    promotionControl.Form.renderAll('#J_PromotionItemList');
		    		pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
	    			promotionControl.promotionItemPaginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_PromotionItemPaging',2);
	    			if(flag != 'update'){
						DOM.hide('#J_RightLoading');
						DOM.show('#J_MainRightContent');
					}
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
	    	     var startPrice = DOM.val(DOM.get("#J_RightStartPrice"));
		    	 var endPrice = DOM.val(DOM.get("#J_RightEndPrice"));
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
			
			//加入判断是否有选择宝贝
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
				var privilegeJson = [];
				for(i=0; i<len; i++){
					if(checkBoxs[i].checked && !checkBoxs[i].disabled){
						var id = checkBoxs[i].value;
						var PreferentialType = DOM.val('#J_PromoType_'+id);
						var z = DOM.val(DOM.get('#J_PromoValue_'+id));
						privilegeJson.push(z);
					};
	            };
	            DOM.val('#J_minPrivilege',Math.min.apply(null,privilegeJson));

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
			
			//点击 加入活动  后的 按钮限制操作
			addBefore : function(){
				DOM.show(DOM.query('.J_adding'));
				DOM.attr('#J_BtmAddToPromo','disabled',true);
				DOM.replaceClass('#J_BtmAddToPromo','btm-caozuo-orange','btm-caozuo-gray-none');
			},
			
			//点击 加入活动  后的 按钮还原
			addAfter : function(){
				DOM.hide(DOM.query('.J_adding'));
				DOM.attr('#J_BtmAddToPromo','disabled',false);
				DOM.replaceClass('#J_BtmAddToPromo','btm-caozuo-gray-none','btm-caozuo-orange ');
			},
			
			/**
			 * 
			 * tb_item 与 promo_item  js
			 */
			getTjtSpecPrice : function(idd ,id,type){
				var v = Number(DOM.get('#J_PromoValue_'+idd).value);
				var t = Number(DOM.get('#J_Type_'+idd).value);
				var origPrice = Number(DOM.val(DOM.get('#J_ItemPrice_'+id)));
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
					if(!KISSY.isNumber(v) || v < 0 || v >=10){
						new H.widget.msgBox({
						    title:"错误提示",
						    content:'传入了不合法或不正确的参数,有效范围在 0.00~9.99之间！',
						    type:"error"
						});
						DOM.addClass(DOM.get('#J_PromoValue_'+idd), 'text-error');
						return false;
					}else{
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
				var t = DOM.val(DOM.get('#J_Type_'+idd));
				var origPrice = Number(DOM.val(DOM.get('#J_ItemPrice_'+id)));
				var specPrice = Number(DOM.val(DOM.get('#J_SpecPrice_'+idd)));
				var promoValue;
				var promoValueZ;
				promoValue = Math.floor((origPrice - specPrice)*100)/100;
				promoValueZ = Number(((specPrice/origPrice)*10).toFixed(2));
				DOM.val(DOM.get('.J_discountMoney'+idd),promoValue);
				DOM.val(DOM.get('.J_discount'+idd),promoValueZ);
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
			getSpecPrice : function(id,pid,type){	
                DOM.hide('#J_ZheWarn_'+id);
                var currentTab = DOM.val('#J_CurrentTab');
			    if(!promotionControl.isChanged && S.inArray(currentTab,promoTabArray)){
			        promotionControl.isChanged = true;
			        DOM.replaceClass('#J_PromoSave','.button-gray','.button-green');
			    }
			    var t = DOM.val(DOM.get('#J_PromoType_'+id));
			    if(t == '1'){
			        var v = DOM.val('#J_PromoValue_'+id);
			        if(v < 0 || v > 10 || isNaN(v)){DOM.val(DOM.get('#J_PromoValue_'+id),'10');}
			        if(v < 0.01 || v > 10 || isNaN(v)){v = 10;}
			        if(v != 10 && v.indexOf('.') >0 && v.toString().split(".")[1].length>2){v = Number(v).toFixed(2);DOM.val(DOM.get('#J_PromoValue_'+id),v);}
			    }else{
			        var v = DOM.val('#J_Promo2Value_'+id);
                    if(v < 0 || isNaN(v)){DOM.val(DOM.get('#J_Promo2Value_'+id),'0');v = 0;}
                    if(v.indexOf('.') >0 && v.toString().split(".")[1].length>2){v = Number(v).toFixed(2);DOM.val(DOM.get('#J_Promo2Value_'+id),v);}
			    }
				var isSku = Number(DOM.val(DOM.get('#J_IsSku_'+id)));
				var origPrice = Number(DOM.val(DOM.get('#J_ItemPrice_'+id)));
				var promoIsInt = Number(DOM.val(DOM.get('#J_PromoIsInt_'+id)));
				var specPrice;
				DOM.val(DOM.get('#J_FinalType_'+id),'0');
				if(isSku == 1){
					specPrice = (v / 10) * origPrice;
					specPrice = Math.floor(specPrice*100)/100;
				} else {
					//原来取整就取整
					var isInt = DOM.val(DOM.get('#J_IsInt_'+id));
					if(promoIsInt && isInt != 2){
						DOM.val('#J_IsInt_'+id,'1');
					}
					if (t == '1') {
						if (KISSY.one('#J_PromoBox_' + id + ' .duoguige')) {
							DOM.hide('#J_PromoBox_' + id + ' .duoguige');
						}
						specPrice = (v / 10) * origPrice;
						specPrice = Math.floor(specPrice*100)/100;
					} else {
						if (KISSY.one('#J_PromoBox_' + id + ' .duoguige')) {
							DOM.show('#J_PromoBox_' + id + ' .duoguige');
						}
						specPrice = Math.floor((origPrice - v)*100)/100;
					}
					//原来isInt = 2 就 是 取整 
					var isInt = DOM.val(DOM.get('#J_IsInt_'+id));
					if (isInt == 1) {
						specPrice = Math.floor(specPrice);
					}else if(isInt == 2){
						specPrice = itemCheck.FormatNumber(specPrice,1);
					}
					if (t == '1') {
					    var reduce = origPrice - specPrice;
                        DOM.val('#J_Promo2Value_'+id,Number(reduce).toFixed(2));
					}else{
					    var agio = specPrice/origPrice*10;
					    if(agio < 0.01){
					        DOM.show('#J_ZheWarn_'+id);
					    }
                        DOM.val('#J_PromoValue_'+id,Number(agio).toFixed(2));
					}
				}
				DOM.replaceClass('#J_BtmAddToPromo','button-gray','button-green');
				DOM.val(DOM.get('#J_SpecPrice_'+id),specPrice);
			},
			
			//由特价计算折扣和减钱
			getPromoValue : function(id,type){	
                DOM.hide('#J_ZheWarn_'+id);
                var currentTab = DOM.val('#J_CurrentTab');
                if(!promotionControl.isChanged && S.inArray(currentTab,promoTabArray)){
                    promotionControl.isChanged = true;
                    DOM.replaceClass('#J_PromoSave','.button-gray','.button-green');
                }
				// 编辑特价 改为 减钱 不取整  	#J_PromoIsInt_id 的值 设置为3			
				DOM.val('#J_IsInt_'+id,'0');
				DOM.val(DOM.get('#J_FinalType_'+id),'3');
				
				var t = DOM.val(DOM.get('#J_PromoType_'+id));
				
				var origPrice = Number(DOM.val(DOM.get('#J_ItemPrice_'+id)));
				var specPrice = DOM.val('#J_SpecPrice_'+id);
                if(specPrice < 0 || isNaN(specPrice)){DOM.val(DOM.get('#J_SpecPrice_'+id),origPrice);specPrice = origPrice;}
				var promoValue;
				var promo2Value;
				if (KISSY.one('#J_PromoBox_' + id + '.duoguige')) {
					DOM.show('#J_PromoBox_' + id + '.duoguige');
				}	
				promo2Value = Math.floor((origPrice - specPrice)*100)/100;
				DOM.val(DOM.get('#J_Promo2Value_'+id),promo2Value);
				promoValue = ((specPrice/origPrice)*10).toFixed(2);
				DOM.val(DOM.get('#J_PromoValue_'+id),promoValue);
				//修改特价优惠方式切换为减钱
				DOM.val(DOM.get('#J_PromoType_'+id),0);
                if(!DOM.hasClass('#J_Promo2Value_'+id,'input-price-focus')){
                    DOM.removeClass('#J_Promo2Value_'+id,'input-price');
                    DOM.addClass('#J_Promo2Value_'+id,'input-price-focus');
                    DOM.replaceClass('#J_PromoValue_'+id,'input-price-focus','input-price');
                }
				return;
			},
			
			checkSkuPrice : function(el){
				skupromoPrice = Number(DOM.val(el));
				if (itemHandle.checkPrice(skupromoPrice) === false) {
					DOM.addClass(el, 'text-error');
					el.value = '';
					return false;
				}
				id = el.id;
				id = id.replace('Promo', 'Orig');
				skuorigPrice = Number(DOM.val(DOM.get('#'+id)));
				DOM.removeClass(el,'text-error');
				return true;
			},
			
			forceDelItem : function(itemId) {
				var submitHandle = function(o) {
						DOM.hide('#J_RightLoading');
						DOM.show('#J_MainRightContent');
		        	    //DOM.query('#J_TbItem_'+itemId+' .J_CheckBox')[0].disabled = 'disabled'; 
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
                                 DOM.attr('#J_PausePromotionItems','disbaled',false);
                                 if(promotionControl.promotionItemPaginator){
                                     promotionControl.promotionItemPaginator.toPage(promotionControl.promotionItemPaginator.page);
                                 }else{
                                     promotionControl.loadPromotionItems();
                                 }
                                 DOM.hide('#J_RightLoading');
                                 DOM.show('#J_MainRightContent');
                             };
                             var errorHandle = function(o){
                                 DOM.attr('#J_PausePromotionItems','disbaled',false);
                                 new H.widget.msgBox({
                                     title:"错误提示",
                                     content:o.desc,
                                     type:"error",
                                     autoClose :true,
                                     timeOut:3000
                                 });
                                 DOM.hide('#J_RightLoading');
                                 DOM.show('#J_MainRightContent');
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
					 promotionControl.msg.hide();
				 	DOM.attr('#J_RestartPromotionItems','disbaled',false);
    	    		new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error",
						autoClose:true,
						timeOut :3000
					});
    	    	};
        	    var data = "pid="+pid+"&item_ids="+itemIds+"&form_key="+FORM_KEY;
        	    new H.widget.asyncRequest().setURI(restartPromotionItemUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},
			
			//重试
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
			
			//批量重试
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
				if (DOM.hasClass(itembox, 'ks-hidden')) {
					DOM.removeClass(itembox, 'ks-hidden');
					DOM.attr(DOM.get('#J_TbItem_'+promo_item_id+' .J_CheckBox'),'checked',true);
				} else {
					DOM.addClass(itembox, 'ks-hidden');
					DOM.attr(DOM.get('#J_TbItem_'+promo_item_id+' .J_CheckBox'),'checked',false);
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
		            DOM.val('#J_minPrivilege',Math.min.apply(null,privilegeJson));
		            
					for(i=0; i<len; i++){
						if(checkBoxs[i].checked && !checkBoxs[i].disabled){
							 var id = checkBoxs[i].value;
							 var title = itemCheck.strProcess(DOM.val(DOM.get('#J_ItemTitle_'+id)));
							 var picUrl = DOM.val(DOM.get('#J_ItemPic_'+id));
							 var price = DOM.val(DOM.get('#J_ItemPrice_'+id));
							 var updatePic = DOM.val(DOM.get('#J_ItemUpdatePic_'+id));
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
				console.log(json)
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
					return;
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
                    if(v1.indexOf('.') >0 && v1.toString().split(".")[1].length>2){v1 = Number(v1).toFixed(2);DOM.val(DOM.get('#J_value2ToAll'),v1);}
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
						    var skuUpPrice = DOM.query("#J_PromoBox_"+id+' .J_SkuUpPrice');
						    for(var z=0; z<skuUpPrice.length; z++){
						        if (t1 == '1') {
                                    DOM.val(DOM.get('#J_PromoType_'+id),1);
                                    if(!DOM.hasClass('#J_PromoValue_'+id,'input-price-focus')){
                                        DOM.removeClass('#J_PromoValue_'+id,'input-price');
                                        DOM.addClass('#J_PromoValue_'+id,'input-price-focus');
                                        DOM.replaceClass('#J_Promo2Value_'+id,'input-price-focus','input-price');
                                    }
                                    var reduce = origPrice - specPrice;
                                    DOM.val('#J_Promo2Value_'+id,Number(reduce).toFixed(2));
                                    DOM.val(DOM.get('#J_PromoValue_'+id) ,Number(v1).toFixed(2));
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
                                    DOM.val('#J_PromoValue_'+id,Number(agio).toFixed(2));
                                    DOM.val(DOM.get('#J_Promo2Value_'+id) ,Number(v1).toFixed(2));
	                                specPrice = Math.floor((origPrice - v1)*100)/100;
	                            }
						        DOM.html(skuUpPrice[z],Number(specPrice).toFixed(2));
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
							var isInt = DOM.val(DOM.get('#J_IsInt_'+id)); 
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
                                DOM.val('#J_Promo2Value_'+id,Number(reduce).toFixed(2));
                                DOM.val(DOM.get('#J_PromoValue_'+id) ,v1);
                            }else{
                                var agio = specPrice/origPrice*10;
                                DOM.val('#J_PromoValue_'+id,Number(agio).toFixed(2));
                                DOM.val(DOM.get('#J_Promo2Value_'+id),v1);
                            }
							DOM.val(DOM.get('#J_SpecPrice_'+id),Number(specPrice).toFixed(2));
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
								DOM.val(DOM.get('#J_PromoValue_'+id+i),v1);
								DOM.val(DOM.get('#J_SpecPrice_'+id+i),specPrice);
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
		                var specPrice = Number(DOM.val(DOM.get('#J_SpecPrice_'+id)));
						var isSku = Number(DOM.val(DOM.get('#J_IsSku_'+id)));
						var t1 = DOM.val(DOM.get('#J_PromoType_'+id));
		                if(t1 == '1'){
		                    var v1 = Number(DOM.val(DOM.get('#J_PromoValue_'+id)));
		                }else{
		                    var v1 = Number(DOM.val(DOM.get('#J_Promo2Value_'+id)));
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
									DOM.val(DOM.get('#J_IsInt_'+id),isInt);
								}else if(isInt == 2){
									specPrice = itemCheck.FormatNumber(specPrice,1);
									DOM.val(DOM.get('#J_IsInt_'+id),isInt);
								}else if(isInt == 0){
									DOM.val(DOM.get('#J_IsInt_'+id),isInt);
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
							DOM.val(DOM.get('#J_SpecPrice_'+id),specPrice);
						}
					}
				}			
			},
			// 阶梯价宝贝 批量设置取整
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

