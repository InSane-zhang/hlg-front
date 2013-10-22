/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,showPages,O) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	
	return	detailControl = {
			panel : null,
			init : function() {
				detailControl.Calendar('J_Birthday');
				Event.on('.J_Modify','click',function(){
					DOM.hide('#J_Proto');
					DOM.show('#J_NewForm');
				});
				Event.on('.hlg-save','click',function(){
					detailControl.save();
				});				
			},
			Calendar : function($id){
				var c =new KISSY.Calendar('#'+$id,{
							popup:true,
							triggerType:['click'],
							date :new Date(),
							maxDate:new Date()
						}).on('select timeSelect',function(e){
								var id = this.id,self = this;
								var startDate   = KISSY.Date.format(e.date,'yyyy-mm-dd');
								KISSY.one('#'+$id).val(startDate);
								self.hide();
							});
			},
			save : function(){
 	        	var submitHandle = function(o) {
 	        		//window.location.href= gethomeFromTbUrl;
 	        		window.location.reload();
 	        	}
         	    var errorHandle = function(o){
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error",
						autoClose : true,
						timeOut : 3000
					});
         	    };	
         	    new H.widget.asyncRequest().setURI(getupdateFromTbUrl).setMethod("POST").setForm('#J_NewForm').setHandle(submitHandle).setErrorHandle(errorHandle).setData(null).send();
			}			
	}
}, {
    requires: ['utils/showPages/index','overlay']
});