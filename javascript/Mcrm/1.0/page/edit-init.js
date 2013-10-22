/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,beautifyForm,Overlay,Calendar,Tooltip) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	
	return editControl = {
				msg : null,
				init : function(){	             
	 	             DOM.html('.J_CurrentMsg',DOM.val('#J_ContentBox'));
	 	             editControl.checkTitleLen(DOM.val('#J_ContentBox'));
		 	         Event.delegate(document, 'click', '.J_AddReplace', function(ev){
						var tem = DOM.html(ev.currentTarget);
						var textarea = DOM.get('#J_ContentBox')
						var pos = editControl.getCursorPosition(textarea);
						editControl.add(textarea,pos,tem);
						editControl.checkTitleLen(DOM.val('#J_ContentBox'));
					 });	
		 	        
		 	         Event.on('.J_Confirm','click',function(){
	 	            	var sucessHandle = function(o) {
	 	            		window.location.href=successPlanFromTbUrl;
	 	            	};
				 		var errorHandle = function(o){
				 		};
				 		var content = DOM.val('#J_ContentBox');
				 		var plan_id = DOM.val('#J_PlanId');
				 		var sign_content = DOM.val('#J_SignContent');
				 		
				 		var data = 'content='+content+'&plan_id='+plan_id+'&sign_content='+sign_content;
				  	    new H.widget.asyncRequest().setURI(updatePlanFromTbUrl).setMethod("POST").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
		 	        	return false;
		 	         })
			 	     Event.on('.J_Test','click',function(){
			 			  DOM.remove('.bui-dialog');
			 	          var dialog = new Overlay.Dialog({
			 	             title:'测试',
			 	             width:330,
			 	             height:160,
			 	             mask:false,
		     	             buttons:[
			     	                   {
			     	                     text:'确定',
			     	                     elCls : 'bui-button bui-button-primary',
			     	                     handler : function(){
			     	                       this.hide();
			     	                     }
			     	                   },{
			     	                     text:'取消',
			     	                     elCls : 'bui-button',
			     	                     handler : function(){
			     	                       this.hide();
			     	                     }
			     	                   }
			     	                 ],
			 	             bodyContent:'<br/>手机号码：<input type="text" id="J_Cellphone" class="input-text-2 J_Placeholder" value="" placeholder="请输入手机号码">'
			 	           });
			 	          dialog.show();
			 	          Event.on('.bui-button-primary','click',function(){
			 	            	var content = DOM.val('#J_ContentBox');
			 	            	var signContent = DOM.val('#J_SignContent');
			 	            	if(signContent == ''||content == ''){
						 			  DOM.remove('.bui-dialog');
						 	          var dialog = new Overlay.Dialog({
						 	             title:'提示',
						 	             width:230,
						 	             height:200,
						 	             mask:false,
					     	             buttons:[
						     	                   {
						     	                     text:'确定',
						     	                     elCls : 'bui-button bui-button-primary',
						     	                     handler : function(){
						     	                       this.hide();
						     	                     }
						     	                   },{
						     	                     text:'取消',
						     	                     elCls : 'bui-button',
						     	                     handler : function(){
						     	                       this.hide();
						     	                     }
						     	                   }
						     	                 ],
						 	             bodyContent:''
						 	           });	 	
						 	           dialog.show();
						 	           if(content == ''){
						 	        	  dialog.set('bodyContent','<div style="padding-top: 40px;text-align: center;font-size:14px;font-weight:bold;">请输入短信内容</div>');
						 	        	  return false;
						 	           }else if(signContent == ''){
						 	        	 dialog.set('bodyContent','<div style="padding-top: 40px;text-align: center;font-size:14px;font-weight:bold;">请输入店铺名称</div>');
						 	        	 return false;
						 	           }
			 	             	}
			 	            	var sucessHandle = function(o) {
						 		};
						 		var errorHandle = function(o){
						 		};
						 		var mobiles = DOM.val('#J_Cellphone');
						 		var sign_content = DOM.val('#J_SignContent');
						 		var content = DOM.val('#J_ContentBox');
						 		var data = 'mobiles='+mobiles+'&sign_content='+sign_content+'&content='+content;
						  	    new H.widget.asyncRequest().setURI(planManualSendFromTbUrl).setMethod("POST").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
			 	          })
			 		})
			 		
				},	
				updateSign : function(){
					var html = DOM.html('.J_CurrentMsg');
					html.replace(DOM.val('#J_Sign'),DOM.val('#J_SignContent'));
					editControl.checkTitleLen(DOM.val('#J_ContentBox'));
				},				
				getCursorPosition: function(textarea){
					var rangeData = {
						text: "",
						start: 0,
						end: 0
					};
					textarea.focus();
					if (textarea.setSelectionRange) { // W3C
						rangeData.start = textarea.selectionStart;
						rangeData.end = textarea.selectionEnd;
						rangeData.text = (rangeData.start != rangeData.end) ? textarea.value.substring(rangeData.start, rangeData.end) : "";
					}
					else 
						if (document.selection) { // IE
							var i, oS = document.selection.createRange(),   // Don't: oR = textarea.createTextRange()
							oR = document.body.createTextRange();
							oR.moveToElementText(textarea);
							rangeData.text = oS.text;
							rangeData.bookmark = oS.getBookmark();
							// object.moveStart(sUnit [, iCount])
							// Return Value: Integer that returns the number of units moved.
							for (i = 0; oR.compareEndPoints('StartToStart', oS) < 0 && oS.moveStart("character", -1) !== 0; i++) {
								// Why? You can alert(textarea.value.length)
								if (textarea.value.charAt(i) == '\n') {
									i++;
								}
							}
							rangeData.start = i;
							rangeData.end = rangeData.text.length + rangeData.start;
						}
					return rangeData;
				},
				checkTitleLen: function(str){
					var len = str.replace(/【买家姓名】/g, "123").replace(/【店铺名称】/g, DOM.val('#J_SignContent')).length ;
					var signContent = DOM.val('#J_SignContent');
					DOM.html(DOM.get('#J_Zs_Num'),len);
					var num = Math.ceil(len/67);
					//alert(num)
					DOM.html(DOM.get('.J_MsgNum'),num);
					str = str.replace(/【店铺名称】/g,DOM.val('#J_SignContent'));
					DOM.html('.J_CurrentMsg',str);
					var signContent = DOM.val('#J_SignContent');
					
					
				},			
				add: function (textarea, rangeData, text) {
					var oValue, nValue, oR, sR, nStart, nEnd, st;
					if (textarea.setSelectionRange) { // W3C
						oValue = textarea.value;
						nValue = oValue.substring(0, rangeData.start) + text + oValue.substring(rangeData.end);
						nStart = nEnd = rangeData.start + text.length;
						st = textarea.scrollTop;
						textarea.value = nValue;
						// Fixbug:
						// After textarea.values = nValue, scrollTop value to 0
						if(textarea.scrollTop != st) {
							textarea.scrollTop = st;
						}
						textarea.setSelectionRange(nStart, nEnd);
					} else if (textarea.createTextRange) { // IE
						sR = document.selection.createRange();
						sR.text = text;
						sR.setEndPoint('StartToEnd', sR);
						sR.select();
					}
				}				
		}
}, {
    requires: ['utils/beautifyForm/index','bui/overlay','bui/calendar','bui/tooltip']
});      