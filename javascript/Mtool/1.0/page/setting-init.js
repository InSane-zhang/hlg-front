KISSY.add(function(S,showPages,Overlay,Calendar,Tooltip,beautifyForm,Select){
	var S = KISSY,DOM = S.DOM, Event = S.Event;	
	return defenseControl = {
			panel : null,
		   	msg : null,
		   	msgTip : null,
		   	init : function() {
				defenseControl.msgTip = new Tooltip.Tip({
					trigger : '#J_MsgNotice',
					alignType : 'top', 
					offset : 10,
					elCls : 'ui-tip',
					title : '买家信用的积分获取方式以及积分对于<br/>的等级，<a target="_blank" href="http://service.taobao.com/support/knowledge-847752.htm?spm=a1z0b.7.0.0.UWvvOM&qq-pf-to=pcqq.c2c">请点击这里参考！</a>'     
				})
				defenseControl.msgTip.render();	
				defenseControl.msgTip = new Tooltip.Tip({
					trigger : '#J_Msg',
					alignType : 'top', 
					offset : 10,
					elCls : 'ui-tip',
					title : '该消息通过淘宝"系统消息"提示给买家!'     
				})
				defenseControl.msgTip.render();	
				
				var items = [
				  {text:'未及时付款',value:'1'},
				  {text:'买家联系不上',value:'2'},
				  {text:'谢绝还价',value:'3'},
				  {text:'商品瑕疵',value:'4'},
				  {text:'协商不一致',value:'5'},
				  {text:'买家不想买',value:'6'},	
				  {text:'与买家协商一致',value:'7'}
				],
				select = new Select.Select({  
				  render:'#J_Return',
				  valueField:'#J_ReturnItems',
				  items:items
				});
				select.render();
				select.setSelectedValue('1');
				var num = DOM.val('#J_Num');  
				select.setSelectedValue(num);
				
 	            select.on('change', function(){
 	            	defenseControl.save();
 	            });
				Event.on('.switch','click',function(ev){
					if(DOM.hasClass(ev.currentTarget,'off')){
						DOM.removeClass(ev.currentTarget,'off');
						var id = DOM.attr(ev.currentTarget,'data-id');
						DOM.html('.switch-text-'+id,'已开启');
					}else{
						DOM.addClass(ev.currentTarget,'off');
						var id = DOM.attr(ev.currentTarget,'data-id');
						DOM.html('.switch-text-'+id,'已关闭');
					}
					var Switch = DOM.query('.switch');
					if(DOM.hasClass(Switch[0],'off')){
						var buyer_credit_enable = 0;
					}else{
						var buyer_credit_enable = 1;
					}
					if(DOM.hasClass(Switch[1],'off')){
						var rate_enable = 0;
					}else{
						var rate_enable = 1;
					}
					if(DOM.hasClass(Switch[2],'off')){
						var less_enable = 0;
					}else{
						var less_enable = 1;
					}
					if(DOM.hasClass(Switch[3],'off')){
						var more_enable = 0;
					}else{
						var more_enable = 1;
					}	
					if(DOM.hasClass(Switch[4],'off')){
						var hour_enable = 0;
					}else{
						var hour_enable = 1;
					}	
					if(DOM.hasClass(Switch[5],'off')){
						var refund_enable = 0;
					}else{
						var refund_enable = 1;
					}							
	                var submitHandle = function(o) {

	        	    };
	        	    var errorHandle = function(o){
						new H.widget.msgBox({
						    title:"错误提示",
						    content:o.desc,
						    type:"error"
						});
	        	    };
					var data = 'buyer_credit_enable='+buyer_credit_enable+'&rate_enable='+rate_enable+'&less_enable='+less_enable+'&more_enable='+more_enable+'&hour_enable='+hour_enable+'&refund_enable='+refund_enable+'&buyer_credit_enable='+buyer_credit_enable;
	        	    new H.widget.asyncRequest().setURI(addConfigTbItemsUrl).setMethod("POST").setForm('#J_SetContent').setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).setDataType('json').send();					
				})
				Event.on('.J_Confirm','click',function(ev){
	                var submitHandle = function(o) {
	                	DOM.hide(ev.currentTarget);
 						new H.widget.msgBox({ 
				 			type: "sucess", 
				 			content: "保存成功",
							dialogType:"msg", 
							autoClose:true, 
							timeOut:3000
						});
	                	return false;
	        	    };
	        	    var errorHandle = function(o){
						new H.widget.msgBox({
						    title:"错误提示",
						    content:o.desc,
						    type:"error"
						});
	        	    };
					var Switch = DOM.query('.switch');
					if(DOM.hasClass(Switch[0],'off')){
						var buyer_credit_enable = 0;
					}else{
						var buyer_credit_enable = 1;
					}
					if(DOM.hasClass(Switch[1],'off')){
						var rate_enable = 0;
					}else{
						var rate_enable = 1;
					}
					if(DOM.hasClass(Switch[2],'off')){
						var less_enable = 0;
					}else{
						var less_enable = 1;
					}
					if(DOM.hasClass(Switch[3],'off')){
						var more_enable = 0;
					}else{
						var more_enable = 1;
					}	
					if(DOM.hasClass(Switch[4],'off')){
						var hour_enable = 0;
					}else{
						var hour_enable = 1;
					}	
					if(DOM.hasClass(Switch[5],'off')){
						var refund_enable = 0;
					}else{
						var refund_enable = 1;
					}	
					var data = 'buyer_credit_enable='+buyer_credit_enable+'&rate_enable='+rate_enable+'&less_enable='+less_enable+'&more_enable='+more_enable+'&hour_enable='+hour_enable+'&refund_enable='+refund_enable+'&buyer_credit_enable='+buyer_credit_enable;
	        	    new H.widget.asyncRequest().setURI(addConfigTbItemsUrl).setMethod("POST").setForm('#J_SetContent').setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).setDataType('json').send();					
				})		
				
			},
			show : function(id) {
				DOM.show('.contain_'+id);
			},
			save : function() {						
                var submitHandle = function(o) {
						new H.widget.msgBox({ 
				 			type: "sucess", 
				 			content: "修改成功",
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
        	    };
        	    var seller_send_msg = DOM.val('#J_ReturnItems');
        	    var Switch = DOM.query('.switch');
				if(DOM.hasClass(Switch[0],'off')){
					var buyer_credit_enable = 0;
				}else{
					var buyer_credit_enable = 1;
				}
				if(DOM.hasClass(Switch[1],'off')){
					var rate_enable = 0;
				}else{
					var rate_enable = 1;
				}
				if(DOM.hasClass(Switch[2],'off')){
					var less_enable = 0;
				}else{
					var less_enable = 1;
				}
				if(DOM.hasClass(Switch[3],'off')){
					var more_enable = 0;
				}else{
					var more_enable = 1;
				}	
				if(DOM.hasClass(Switch[4],'off')){
					var hour_enable = 0;
				}else{
					var hour_enable = 1;
				}	
				if(DOM.hasClass(Switch[5],'off')){
					var refund_enable = 0;
				}else{
					var refund_enable = 1;
				}        	    
        	    var data = 'buyer_credit_enable='+buyer_credit_enable+'&rate_enable='+rate_enable+'&less_enable='+less_enable+'&more_enable='+more_enable+'&hour_enable='+hour_enable+'&refund_enable='+refund_enable+'&buyer_credit_enable='+buyer_credit_enable +'&seller_send_msg='+seller_send_msg;
        	    new H.widget.asyncRequest().setURI(addConfigTbItemsUrl).setMethod("POST").setForm('#J_SetContent').setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).setDataType('json').send();				
			},			
			hide : function(id) {
				DOM.hide('.contain_'+id);
			}			
					 	
    	}
	
},{
	requires : ['utils/showPages/index','bui/overlay','bui/calendar','bui/tooltip','utils/beautifyForm/index','bui/select']
});