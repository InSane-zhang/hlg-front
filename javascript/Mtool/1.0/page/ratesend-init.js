/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,showPages,Select,beautifyForm,Calendar) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	
	return ratesendControl = {
			paginator : null,
	    	panel : null,
	    	msg : null,
	    	lottery_type : null,
	    	url : '',
	    	init : function(){
				ratesendControl.Form = new beautifyForm();
		        var starttime = new Calendar.DatePicker({
		            trigger:'.timing',
		            autoRender : true,
		            showTime : true
		        });	
				if(htmlType == 'index'){
					//彩票
					var items3 = [
						{text:'双色球',value:'1'},
						{text:'3D',value:'2'},
						{text:'七乐彩',value:'7'}	     
					],
					sortSelect = new Select.Select({  
						render:'#J_CpTypeItem',
						valueField:'#J_CpType',
						items:items3
					});
					sortSelect.render();
					sortSelect.setSelectedValue(lotteryType);
					
					//注数
					var items2 = [
						{text:'1注',value:'1'},
						{text:'2注',value:'2'},
						{text:'3注',value:'3'},
						{text:'4注',value:'4'},
						{text:'5注',value:'5'}
					],
					cpNumSelect = new Select.Select({  
						render:'#J_CpNumItem',
						valueField:'#J_CpNum',
						items:items2
					});
					cpNumSelect.render();
					cpNumSelect.setSelectedValue(stakeCount);
					ratesendControl.checkCpAgreement();
					Event.on('#J_sure','click',ratesendControl.open);
				}else{
					ratesendControl.searchTbItems();
				}
				Event.on('#J_open','click',function(){
					new H.widget.msgBox({
						title:"温馨提示",
					    content:'亲，只要开启后订单中宝贝全部好评就会赠送彩票哦！',
					    type:"info" 
					});
				});	
				
				Event.on('#J_Save','click',function(){
					var len = DOM.val('#J_Length');
					if(len > '25'){
						new H.widget.msgBox({
						    title:"错误提示",
						    content:'彩票赠言不能超过25个字',
						    type:"error"
						});
	        	    	return;
					}else{
						ratesendControl.save();
					}
				});		
				Event.on('#J_SearchBtn','click',function(){
					ratesendControl.searchTbItems();
				});				
			},
			save : function() {
		        var submitHandle = function(o) {
					new H.widget.msgBox({ 
			 			type: "sucess", 
			 			content: o.desc,
						dialogType:"msg", 
						autoClose:true, 
						timeOut:3000
					});
			    };
			    var errorHandle = function(o){
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
        	    	return;
			    };
			    new H.widget.asyncRequest().setURI(saveSendUrl).setMethod("POST").setForm('#J_Form').setHandle(submitHandle).setErrorHandle(errorHandle).setData(null).send();
			},			
			/*是否签订彩票协议*/
			checkCpAgreement : function(el){
				if(DOM.val('#J_IsSign') == 1){
					return ;
				}
			    var submitHandle = function(o) {
			    	if(o.payload.sign){
			    		DOM.val('#J_IsSign','1');
				    }else{
				    	
				    	ratesendControl.url = o.payload.sign_url;
						new H.widget.msgBox({
								    title:"签订协议",
								    content:'请先开通<a href="'+o.payload.sign_url+'" target="_blank">支付宝代购协议</a>',
								    type:"info",
								    buttons: [{ value: "ok" }],
								    success:function(result){
										if(result == 'ok'){
											var url = ratesendControl.url;
											window.open(url, '_blank');
										}
							
									}
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
			open : function() {
		    	if(!showPermissions('editor_tool','工具箱')){return ;}
				if(isVersionPer('tool')){return ;}
				if(DOM.val('#J_IsSign') == 0){
					new H.widget.msgBox({
					    title:"签订协议",
					    content:'请先开通<a href="'+ratesendControl.url+'" target="_blank">支付宝代购协议</a>',
					    type:"info",
					    buttons: [{ value: "ok" }],
					    success:function(result){
							if(result == 'ok'){
								var url = ratesendControl.url;
								window.open(url, '_blank');
							}
				
						}
					});
					return ;
				}
				
				ParamsErrorBox = KISSY.one('#J_ParamsErrorBox');
				ParamsSucessBox = KISSY.one('#J_ParamsSucessBox');
				
		        var submitHandle = function(o) {
		        	ParamsErrorBox.hide();
		        	DOM.html('#J_ParamsSucessMsg',o.desc);
	    	    	if (ParamsSucessBox.css("display")==="none") {
	    	    		ParamsSucessBox.slideDown();
	    	    	};
	    	    	KISSY.later(function(){
	    	    		ParamsSucessBox.slideUp();
	        	    },3000,false)
			    };
			    var errorHandle = function(o){
			    	ParamsSucessBox.hide();
			    	DOM.html('#J_ParamsErrorMsg',o.desc);
	    	    	if (ParamsErrorBox.css("display")=== "none") {
	    	    		ParamsErrorBox.slideDown();
	    	    	};
	    	    	KISSY.later(function(){
	    	    		ParamsErrorBox.slideUp();
	        	    },3000,false)
					return;
			    };
			    if(DOM.get('#J_open').checked == true){
			    	var sureUrl = openUrl;
			    	
			    }else if(DOM.get('#J_closed').checked == true){
			    	var sureUrl = closeUrl;
			    }
		    	var lottery_type = DOM.val(DOM.get("#J_CpType"));
		    	var stake_count = DOM.val(DOM.get("#J_CpNum"));
		    	var lottery_content = DOM.val(DOM.get("#J_CareBox_0"));
		    	
		    	var data = "lottery_type="+lottery_type+"&stake_count="+stake_count+"&lottery=1"+"&lottery_content="+lottery_content;
			    new H.widget.asyncRequest().setURI(sureUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},
			
			searchTbItems : function() {
		        var submitHandle = function(o) {
					DOM.hide('#J_LeftLoading');
					DOM.show('#J_MainLeftContent');
		    	    totalRecords = o.payload.totalRecords;
					DOM.css(DOM.get('#J_NoteIcon') ,'display','none');
					if(totalRecords > 0){
						DOM.css(DOM.get('#J_LEmpty') ,'display','none');
						DOM.css(DOM.query(".J_PromotionItemBtnHolder") ,'display' , '');
					} else {
						DOM.css(DOM.get('#J_LEmpty'), 'display' , '');
						DOM.css(DOM.query(".J_PromotionItemBtnHolder") , 'display' , 'none');
					}
					DOM.html('#J_StatList' ,o.payload.body);
					var pageCount = Math.ceil(totalRecords/o.payload.pageSize); 
					ratesendControl.paginator = new showPages('ratesendControl.paginator').setRender(ratesendControl.handlePagination).setPageCount(pageCount).printHtml('#J_StatPaging',2);
			    };
				var start_time = DOM.val('#J_start_date');
				var end_time = DOM.val('#J_end_date');
				var q = DOM.val('#J_Search');
				if(q == '订单号、用户昵称'){
					var q = '';
				}else{
					q = q;
				}			    
			    var data="start_time="+start_time+"&end_time="+end_time+"&q="+q;
				DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainLeftContent');
			    new H.widget.asyncRequest().setURI(getSendTradeAjaxUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			},
			handlePagination : function(turnTo) {
		    	pageId = turnTo;
				var submitHandle = function(o) {
					
					DOM.hide('#J_LeftLoading');
					DOM.show('#J_MainLeftContent');
		    	    totalRecords = o.payload.totalRecords;
					DOM.css(DOM.get('#J_NoteIcon') ,'display','none');
					if(totalRecords > 0){
						DOM.css(DOM.get('#J_LEmpty') ,'display','none');
						DOM.css(DOM.query(".J_PromotionItemBtnHolder") ,'display' , '');
					} else {
						DOM.css(DOM.get('#J_LEmpty'), 'display' , '');
						DOM.css(DOM.query(".J_PromotionItemBtnHolder") , 'display' , 'none');
					}
					DOM.html('#J_StatList' ,o.payload.body);
					var pageCount = Math.ceil(totalRecords/o.payload.pageSize); 
					ratesendControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_StatPaging',2);
		    	};
		    	var data="page_id="+pageId
		        DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainLeftContent');
			    new H.widget.asyncRequest().setURI(getSendTradeAjaxUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			},

			checkTitleLen : function(str ,id) {
				var len = str.replace(/[^\x00-\xff]/g,"*").length;
				DOM.html(DOM.get('#J_Notice_'+id), '');
				DOM.html(DOM.get('#J_Zs_'+id), "已经输入"+len+"字符");
				DOM.val('#J_Length',len);
			}
				
				
			}
}, {
    requires: ['utils/showPages/index','bui/select','utils/beautifyForm/index','bui/calendar']
});