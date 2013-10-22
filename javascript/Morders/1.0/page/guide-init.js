/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,showPages,O,LinkSelect,Switchable,Select,Overlay,beautifyForm) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	
	return guideControl = {
		paginator : null,
		handlePagination :null,
	 	isFisrst : true,
		init : function() {	
			guideControl.Form = new beautifyForm();
			guideControl.Form.renderAll('#J_ExpressCheck');
			var a = new LinkSelect(["#s1","#s2","#s3"],tdist, {
	        	defval: {
						text: "全部地区", val: "0"
				 	},
				rootid: 1 //根节点的ID，默认为0
			});
			a.focus(2,DOM.val('#J_Country'));
			
			Event.remove('#J_SavePost');
			Event.on('#J_SavePost','click',function(){
				guideControl.posterSave();
			})	
			Event.remove('#J_SaveBtn');
			Event.on('#J_SaveBtn','click',function(){
				console.log(2)
				//guideControl.posterSave();
			})
		},
		//同步淘宝发件人信息
		updateSenders : function(){
        	var submitHandle = function(o) {
        		guideControl.msg.hide();
        		new H.widget.msgBox({ 
		 			type: "sucess", 
		 			content: "同步成功",
					dialogType:"msg", 
					autoClose:true, 
					timeOut:3000
				});					
    	    };
    	    var errorHandle = function(o){
    	    	guideControl.msg.hide(); 
    	    	new H.widget.msgBox({
				    title:"错误提示",
				    content:o.desc,
				    type:"error"
				});
    	    	return;
    	    };
    	    guideControl.msg = new H.widget.msgBox({
				dialogType : 'loading',
			    content:'正在同步发件人信息，请稍后...'	
    	    });
    	    var status = 3;
			var data = "status="+status;
    	    new H.widget.asyncRequest().setURI(loadUpdateUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
        },	
        posterSave : function(data) {
        	DOM.removeClass('.ui-step-item','current');
        	DOM.addClass(DOM.query('.ui-step-item')[1],'current');
        	DOM.hide('.main-content-1');
        	DOM.show('.main-content-2');
			
            var submitHandle = function(o) {	
				new H.widget.msgBox({ 
		 			type: "sucess", 
		 			content: "保存成功",
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
    	    new H.widget.asyncRequest().setURI(loadSaveUrl).setMethod("POST").setForm('#J_Sender').setHandle(submitHandle).setErrorHandle(errorHandle).setData(null).send();
		}
	}
}, {
    requires: ['utils/showPages/index','overlay','gallery/province/1.0/index','switchable','bui/select','bui/overlay','utils/beautifyForm/index']
});