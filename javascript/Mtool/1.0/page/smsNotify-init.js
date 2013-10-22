KISSY.add(function(S,showPages,Overlay,Calendar,Tooltip,beautifyForm){
	var S = KISSY,DOM = S.DOM, Event = S.Event;	
	return notifyControl = {
			panel : null,
		   	msg : null,
		   	msgTip : null,
		   	init : function() {
				notifyControl.Form = new beautifyForm();
				notifyControl.msgTip = new Tooltip.Tip({
					trigger : '#J_MsgNotice',
					alignType : 'top', 
					offset : 10,
					elCls : 'ui-tip',
					title : '10s之内付款的订单极有可能是软件操<br/>作，有可能是差评师'  
				})
				notifyControl.msgTip.render();	
	        	//测试
	        	Event.on('.J_Test','click',function(ev){
		 	          var dialog = new Overlay.Dialog({
			 	             title:'测试',
			 	             width:230,
			 	             height:150,
			 	             mask:false,
		     	             buttons:[
			     	                   {
			     	                     text:'确定',
			     	                     elCls : 'bui-button bui-button-primary',
			     	                     handler : function(){
			     	                       this.hide();
			     	                       notifyControl.test();
			     	                     }
			     	                   },{
			     	                     text:'取消',
			     	                     elCls : 'bui-button',
			     	                     handler : function(){
			     	                       this.hide();
			     	                     }
			     	                   }
			     	                 ],
			 	             bodyContent:'<div style="text-align:center;font-weight: bold;">确定要发送短信进行测试吗?</div>'
			 	           });	 	
			 	           dialog.show();
	        	}); 
	        	//保存
	        	Event.on('.J_Save','click',function(){
	        		var sms_content = DOM.val('#J_ContentBox');
	        		if(sms_content == ''){
						new H.widget.msgBox({
						    title:"错误提示",
						    content:"短信内容不能为空！",
						    type:"error"
						});	
	        		}else{
	        			notifyControl.save();
	        		}
	        	}); 	        	
	        	
			},
			test: function(){
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
				};
				var mobile = DOM.val('#J_Mobile');
				var sms_content = DOM.val('#J_ContentBox');
				var data = "sms_content="+sms_content+"&mobile="+mobile+"&model="+'ratedefense';
				new H.widget.asyncRequest().setURI(testRemindInfoTbItemsUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).setDataType('json').send();
			},			
			checkTitleLen: function(str){
				var len = str.length ;
				var signContent = DOM.val('#J_SignContent');
				DOM.html(DOM.get('#J_Zs_Num'),len);
				var signContent = DOM.val('#J_SignContent');
			},
			save: function(){
				var submitHandle = function(o) {
					new H.widget.msgBox({ 
			 			type: "sucess", 
			 			content: '保存成功',
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
				var checkBox = DOM.query('.J_CheckBox');
        		if(checkBox[0].checked == true  && checkBox[1].checked == true){
        			var condition  = [1,2];
        		}else if(checkBox[0].checked == true  && checkBox[1].checked == false){
        			var condition  = 1;
        		}else if(checkBox[0].checked == false  && checkBox[1].checked == true){
        			var condition  = 2;
        		}else if(checkBox[0].checked == false  && checkBox[1].checked == false){
        			var condition  = '';
        		}
				var mobile = DOM.val('#J_Mobile');
				var sms_content = DOM.val('#J_ContentBox');
				var data = "sms_content="+sms_content+"&mobile="+mobile+"&condition="+condition;
				new H.widget.asyncRequest().setURI(saveWarnTbItemsUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).setDataType('json').send();
			}
					 	
    	}
	
},{
	requires : ['utils/showPages/index','bui/overlay','bui/calendar','bui/tooltip','utils/beautifyForm/index']
});