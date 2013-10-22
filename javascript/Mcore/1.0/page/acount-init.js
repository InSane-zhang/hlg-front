
/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,showPages,Select,Calendar) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	
	return acountControl = {
				msg : null,
				paginator : null , //订购分页
				paginatorGive : null , //赠送分页
				initDinggouFlag : false,
				initGiveFlag : false,
				initIntegralFlag : false,
				currentMode : 'dinggou',
				init : function(){
					
					var items = [
	 	                  {text:'10条',value:'10'},
	 	                  {text:'20条',value:'20'},
	 	                  {text:'30条',value:'30'},
	 	                 {text:'40条',value:'40'}
	 	                ],
	 	                select = new Select.Select({  
	 	                  render:'#J_Select',
	 	                  valueField:'#hide',
	 	                  items:items
	 	                });
		 	            select.render();
		 	            select.on('change', function(ev){
		 	            });
		 	           select.setSelectedValue('10');
						var items1 = [
	     	                  {text:'全部',value:'100'},
	     	                  {text:'积分消费',value:'0'},
	     	                  {text:'兑换积分',value:'1'},
	     	                 {text:'提现',value:'2'},
	     	                {text:'登陆赠送积分',value:'3'},
	     	                {text:'邀请赠送积分',value:'4'}
	     	                ],
	     	                select1 = new Select.Select({  
	     	                  render:'#J_leibie',
	     	                  valueField:'#hide1',
	     	                  items:items1
	     	                });
	     	            select1.render();
	     	            select1.on('change', function(ev){
	     	            });
	     	           select1.setSelectedValue('100');
	     	           
	     	          var datepicker = new Calendar.DatePicker({
	     	              trigger:'#J_startDate',
	     	              showTime:true,
	     	              autoRender : true,
	     	              autoSetValue :false,
	     	              textField  : '2'
	     	            });
	     	         var datepicker2 = new Calendar.DatePicker({
	     	              trigger:'#J_endDate',
	     	              showTime:true,
	     	              autoRender : true,
	     	              autoSetValue :false,
	     	              textField  : '2'
	     	            });
	     	         
	     	        datepicker.on('selectedchange',function (e) {
	     	        	 	var endDate = H.util.stringToDate(S.one('#J_endDate').val());
							var startDate   = e.value;
							if((endDate !='')&&(startDate.getTime() >= endDate.getTime()))
							{
								new H.widget.msgBox({
									    title:"错误提示",
									    content:'开始时间不能大于结束时间，请重新选择',
									    type:"info"
									});
								//S.one('#J_startDate').val('');
							}else{
								S.one('#J_startDate').val(e.text);
							}
	     	         });
	     	        datepicker2.on('selectedchange',function (e) {
			     	       	var endDate   =  e.value;
							var startTime = H.util.stringToDate(S.one('#J_startDate').val());
							var endTime = H.util.stringToDate(endDate);
							if((endTime.getTime() <= startTime.getTime())&&(startTime !='')){
								new H.widget.msgBox({
									    title:"错误提示",
									    content:'结束时间不能小于开始时间，请重新选择',
									    type:"info"
									});
								//S.one('#J_endDate').val('');
							}else{
								S.one('#J_endDate').val(e.text);
							}
	     	         });
					Event.on('.J_Tab','click',function(ev){
						var v =DOM.attr(ev.currentTarget,'data');
						DOM.removeClass('.J_Tab','current');
						DOM.addClass(ev.currentTarget,'current');
						if(v == '1'){
							acountControl.show('dinggou');
						}else{
							acountControl.show('give');
						}
						
						
					})	
					Event.on('#J_RightSearchBtn','click',function(ev){
						if(acountControl.currentMode == 'dinggou'){
							acountControl.dingGou();
						} else if(acountControl.currentMode == 'give'){
							acountControl.Give();
						}
							
					});	
					Event.fire('#J_RightSearchBtn','click');
					
//					myCalendar('J_startDate',0);
//					myCalendar('J_endDate',7);
					
				},
				show : function(mode){
					acountControl.currentMode = mode;
					if (mode == 'dinggou' ) {
						if(!acountControl.initDinggouFlag){
							acountControl.dingGou();
							acountControl.initDinggouFlag = true;
						}
						DOM.get('#main-content-div-1').style.display = '';
						DOM.get('#main-content-div-2').style.display = 'none';
					}
					if (mode == 'give') {
						if(!acountControl.initGiveFlag){
							acountControl.Give();
							acountControl.initGiveFlag = true;	
						}
						DOM.get('#main-content-div-1').style.display = 'none';
						DOM.get('#main-content-div-2').style.display = '';
					}
				},
		
				dingGou : function(){
					var submitHandle = function(o) {
		        	    totalRecords = o.payload.totalRecords;
		        	    if(totalRecords > 0){
		   					DOM.get('#J_LEmpty').style.display = 'none';
							DOM.removeClass('.J_DinggouHolder','ks-hidden');
						} else {
							DOM.get('#J_LEmpty').style.display = '';
							DOM.addClass('.J_DinggouHolder','ks-hidden');
						}
						acountControl.render(o.payload.body);
						var pageCount = Math.ceil(totalRecords/o.payload.pageSize); 
						acountControl.paginator = new showPages('acountControl.paginator').setRender(acountControl.renderDinggou).setPageCount(pageCount).printHtml('#J_DingPaging',2);
						DOM.hide('#J_LeftLoading');
						DOM.show('#J_MainLeftContent');
		    	    };
					DOM.show('#J_LeftLoading');
					DOM.hide('#J_MainLeftContent');
		    	    var start_created = DOM.val('#J_startDate');
		    	    var end_created = DOM.val('#J_endDate');
		    	    var page_size = DOM.val('#hide');
		    	    var nick = DOM.val('#J_NickName');	    	    
		    	    data = 'start_created='+start_created+'&end_created='+end_created+'&page_size='+page_size+'&nick='+encodeURIComponent(nick);
		    	    new H.widget.asyncRequest().setURI(buyDetailUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
				},
				renderDinggou :function(turnTo){
					pageId = turnTo;
		    		var submitHandle = function(o) {
		    			DOM.hide('#J_LeftLoading');
						DOM.show('#J_MainLeftContent');
		    			totalRecords = o.payload.totalRecords;
		    			 if(totalRecords > 0){
			   					DOM.get('#J_LEmpty').style.display = 'none';
								DOM.removeClass('.J_DinggouHolder','ks-hidden');
							} else {
								DOM.get('#J_LEmpty').style.display = '';
								DOM.addClass('.J_DinggouHolder','ks-hidden');
						}
		   				acountControl.render(o.payload.body);
		 				var pageCount = Math.ceil(totalRecords/o.payload.pageSize); 
						acountControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_DingPaging',2);
			    	};
			    	DOM.show('#J_LeftLoading');
					DOM.hide('#J_MainLeftContent');
		    	    var start_created = DOM.val('#J_startDate');
		    	    var end_created = DOM.val('#J_endDate');
		    	    var page_size = DOM.val('#hide');
		    	    var nick = DOM.val('#J_NickName');	    	  
			    	data = 'start_created='+start_created+'&end_created='+end_created+'&page_size='+page_size+'&page_no='+pageId+'&nick='+nick;
			    	new H.widget.asyncRequest().setURI(buyDetailUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
				},
				Give : function(){
					var submitHandle = function(o) {
						 DOM.hide('#J_RightLoading');
						 DOM.show('#J_MainRightContent');
		        	    totalRecords = o.payload.totalRecords;
						if(totalRecords > 0){
							DOM.get('#J_REmpty').style.display = 'none';
							DOM.removeClass('.J_GiveHolder','ks-hidden');
						} else {
							DOM.get('#J_REmpty').style.display = '';
							DOM.addClass('.J_GiveHolder','ks-hidden');
						}
						acountControl.render(o.payload.body);
						var pageCount = Math.ceil(totalRecords/o.payload.pageSize); 
						acountControl.paginatorGive = new showPages('acountControl.paginatorGive').setRender(acountControl.renderGive).setPageCount(pageCount).printHtml('#J_GivePaging',2);
		    	    };
		    	    DOM.show('#J_RightLoading');
					DOM.hide('#J_MainRightContent');
			    	var start_created = DOM.val('#J_startDate');
			    	var end_created = DOM.val('#J_endDate');
			    	var page_size = DOM.val('#hide');
			    	var nick = DOM.val('#J_NickName');		    	    
		    	    data = 'start_created='+start_created+'&end_created='+end_created+'&page_size='+page_size+'&nick='+encodeURIComponent(nick);
		    	    new H.widget.asyncRequest().setURI(giftDetailUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
				},
				renderGive :function(turnTo){
					pageId = turnTo;
		    		var submitHandle = function(o) {
		    			 DOM.hide('#J_RightLoading');
						 DOM.show('#J_MainRightContent');
		    			totalRecords = o.payload.totalRecords;
		    			if(totalRecords > 0){
							DOM.get('#J_REmpty').style.display = 'none';
							DOM.removeClass('.J_GiveHolder','ks-hidden');
						} else {
							DOM.get('#J_REmpty').style.display = '';
							DOM.addClass('.J_GiveHolder','ks-hidden');
						}
		    			acountControl.render(o.payload.body);
		 				var pageCount = Math.ceil(totalRecords/o.payload.pageSize); 
						acountControl.paginatorGive.setPage(pageId).setPageCount(pageCount).printHtml('#J_GivePaging',2);
			    	};
			    	DOM.show('#J_RightLoading');
					DOM.hide('#J_MainRightContent');
			    	var start_created = DOM.val('#J_startDate');
			    	var end_created = DOM.val('#J_endDate');
			    	var page_size = DOM.val('#hide');
			    	var nick = DOM.val('#J_NickName');	
			    	data = 'start_created='+start_created+'&end_created='+end_created+'&page_size='+page_size+'&page_no='+pageId+'&nick='+nick;
			    	new H.widget.asyncRequest().setURI(giftDetailUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
				},
				render : function(o){
					if(acountControl.currentMode == 'dinggou'){
						var str = '';
						DOM.html('#J_DingGouContent',o);
					} else if(acountControl.currentMode == 'give'){
						DOM.html('#J_GiveContent',o);
					}
				}
	}
}, {
    requires: ['utils/showPages/index','bui/select','bui/calendar']
});