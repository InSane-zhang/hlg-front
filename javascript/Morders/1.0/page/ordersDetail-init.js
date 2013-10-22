/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,showPages,Overlay,Select) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	
	return ordersDetailControl = {
		paginator : null,
		msg : null,
		handlePagination :null,
		panel : null,	
		init : function() {
			
			// 编辑input
			Event.delegate(document,'click','.J_EditTiger',function(ev){
				var p =DOM.parent(ev.currentTarget);
				DOM.addClass(p,'hover');
				DOM.get('input',p).focus();
			})
			// 失去焦点
			Event.delegate(document,'focusout','.J_ExpressNick',function(ev){
				KISSY.later(function(){
					DOM.removeClass('#J_ExpressNickBox','hover');
		 		},200,false,null);
			})
			// 收件人
			Event.delegate(document,'click','.J_ExpressNickSubmit',function(ev){
				var title = DOM.val('#J_ExpressNick_1');
				var submitHandle = function(o) {
					new H.widget.msgBox({ 
						type: "sucess", 
						content: "修改成功",
						dialogType:"msg", 
						autoClose:true, 
						timeOut:3000
					});
					DOM.val('#J_ExpressNick1',title);
					DOM.html(DOM.get("#J_ExpressNickBox .J_Name"),title);
				};
				var otitle = DOM.val('#J_ExpressNick1');
				if(otitle == title){
					return ;
				}
				var data = "item_id="+id+"&item_number="+title;
				new H.widget.asyncRequest().setURI().setMethod("GET").setHandle(submitHandle).setData(data).send();
			})
			// 失去焦点
			Event.delegate(document,'focusout','.J_ExpressTel',function(ev){
				KISSY.later(function(){
					DOM.removeClass('#J_ExpressTelBox','hover');
		 		},200,false,null);
			})
			// 联系电话
			Event.delegate(document,'click','.J_ExpressTelSubmit',function(ev){
				var title = DOM.val('#J_ExpressTel_1');
				var submitHandle = function(o) {
					new H.widget.msgBox({ 
						type: "sucess", 
						content: "修改成功",
						dialogType:"msg", 
						autoClose:true, 
						timeOut:3000
					});
					DOM.val('#J_ExpressTel1',title);
					DOM.html(DOM.get("#J_ExpressTelBox .J_Name"),title);
				};
				var otitle = DOM.val('#J_ExpressTel1');
				if(otitle == title){
					return ;
				}
				var data = "item_id="+id+"&item_number="+title;
				new H.widget.asyncRequest().setURI().setMethod("GET").setHandle(submitHandle).setData(data).send();
			})
			// 失去焦点
			Event.delegate(document,'focusout','.J_ExpressAdress',function(ev){
				KISSY.later(function(){
					DOM.removeClass('#J_ExpressAdressBox','hover');
		 		},200,false,null);
			})
			// 地址
			Event.delegate(document,'click','.J_ExpressAdressSubmit',function(ev){
				var title = DOM.val('#J_ExpressTel_1');
				var submitHandle = function(o) {
					new H.widget.msgBox({ 
						type: "sucess", 
						content: "修改成功",
						dialogType:"msg", 
						autoClose:true, 
						timeOut:3000
					});
					DOM.val('#J_ExpressAdress1',title);
					DOM.html(DOM.get("#J_ExpressAdressBox .J_Name"),title);
				};
				var otitle = DOM.val('#J_ExpressAdress1');
				if(otitle == title){
					return ;
				}
				var data = "item_id="+id+"&item_number="+title;
				new H.widget.asyncRequest().setURI().setMethod("GET").setHandle(submitHandle).setData(data).send();
			})
			// 失去焦点
			Event.delegate(document,'focusout','.J_ExpressYb',function(ev){
				KISSY.later(function(){
					DOM.removeClass('#J_ExpressYbBox','hover');
		 		},200,false,null);
			})
			// 邮编
			Event.delegate(document,'click','.J_ExpressYbSubmit',function(ev){
				var title = DOM.val('#J_ExpressTel_1');
				var submitHandle = function(o) {
					new H.widget.msgBox({ 
						type: "sucess", 
						content: "修改成功",
						dialogType:"msg", 
						autoClose:true, 
						timeOut:3000
					});
					DOM.val('#J_ExpressYb1',title);
					DOM.html(DOM.get("#J_ExpressYbBox .J_Name"),title);
				};
				var otitle = DOM.val('#J_ExpressYb1');
				if(otitle == title){
					return ;
				}
				var data = "item_id="+id+"&item_number="+title;
				new H.widget.asyncRequest().setURI().setMethod("GET").setHandle(submitHandle).setData(data).send();
			})
			// 失去焦点
			Event.delegate(document,'focusout','.J_ExpressNum',function(ev){
				KISSY.later(function(){
					DOM.removeClass('#J_ExpressNumBox','hover');
		 		},200,false,null);
			})
			// 快递单号
			Event.delegate(document,'click','.J_ExpressNumSubmit',function(ev){
				var title = DOM.val('#J_ExpressNum_1');
				var submitHandle = function(o) {
					new H.widget.msgBox({ 
						type: "sucess", 
						content: "修改成功",
						dialogType:"msg", 
						autoClose:true, 
						timeOut:3000
					});
					DOM.val('#J_ExpressNum1',title);
					DOM.html(DOM.get("#J_ExpressNumBox .J_Name"),title);
				};
				var otitle = DOM.val('#J_ExpressNum1');
				if(otitle == title){
					return ;
				}
				var data = "item_id="+id+"&item_number="+title;
				new H.widget.asyncRequest().setURI().setMethod("GET").setHandle(submitHandle).setData(data).send();
			})
			// 失去焦点
			Event.delegate(document,'focusout','.J_PrintShortName',function(ev){
				var id = DOM.attr(ev.currentTarget,'data');
				KISSY.later(function(){
					DOM.removeClass('#J_PrintShortNameBox_'+id,'hover');
		 		},200,false,null);
			})
			// 快递单号
			Event.delegate(document,'click','.J_PrintShortNameSubmit',function(ev){
				var id = DOM.attr(ev.currentTarget,'data');
				var title = DOM.val('#J_PrintShortName_'+id);
				var submitHandle = function(o) {
					new H.widget.msgBox({ 
						type: "sucess", 
						content: "修改成功",
						dialogType:"msg", 
						autoClose:true, 
						timeOut:3000
					});
					DOM.val('#J_PrintShortName'+id,title);
					DOM.html(DOM.get('#J_PrintShortNameBox_'+id+' .J_Name'),title);
				};
				var otitle = DOM.val('#J_PrintShortName'+id);
				if(otitle == title){
					return ;
				}
				var data = "item_id="+id+"&item_number="+title;
				new H.widget.asyncRequest().setURI().setMethod("GET").setHandle(submitHandle).setData(data).send();
			})
		}
	
	
		
	}
	
}, {
    requires: ['utils/showPages/index','bui/overlay','bui/select']
});