/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,showPages,O,LinkSelect) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	
	return senderControl = {
	    	paginator : null,
			handlePagination :null,
	    	isFisrst : true,
	    	init : function() {
				Event.on('#J_SavePost','click',function(){
					senderControl.posterSave();
				})	
				var a = new LinkSelect(["#s1","#s2","#s3"],tdist, {
	            	defval: {
 						text: "全部地区", val: "0"
 				 	},
					rootid: 1 //根节点的ID，默认为0
				});
				a.focus(2,DOM.val('#J_Country'));
//				if(DOM.val('#s1') == 0){
//					DOM.hide('#s2');
//					DOM.hide('#s3');
//				}else{
//					DOM.show('#s2');
//					DOM.show('#s3');
//				}
	        },
	        posterSave : function(data) {
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
    requires: ['utils/showPages/index','overlay','gallery/province/1.0/index']
});