/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,Tooltip) {
	var DOM = S.DOM, Event = S.Event;	
	return indexControl = {
				msg : null,
				init : function(){
		            indexControl.getStatusProgress();
				   },
    			  getStatusProgress : function() {
                    var submitHandle = function(o) {
    	        	    totalRecords = o.payload.totalRecords;
    	        	    var already=o.payload.already;
    	        	    var all=o.payload.all;
    	        	    var less=all-already;
    	        	    DOM.html('.J_already',already);
    	        	    DOM.html('.J_all',all);
    	        	    var percent=((already/all)*100).toFixed(2)+"%";
    	        	    DOM.css('#J_ui_progress', "width",percent);
    	        	    
    	        	    DOM.html('.J_less',less);
    	        	    if((all-already)== 0 ){
    	        	    	if(all==0){
    	        	    	    DOM.css('#J_ui_progress', "width",0);
    	        	    	    DOM.show('#container');                      		
                        		DOM.hide('.J_setSuccess');
                        		DOM.show('.J_lessTwo');
                        		DOM.hide('.J_lessOne');
    	        	    	}else{
    	        	    		DOM.show('#container');                      		
                        		DOM.hide('.J_setSuccess');
                        		DOM.show('.J_lessTwo');
                        		DOM.hide('.J_lessOne')
   
                	       } 
    	        	    }else{
    	        	    	DOM.show('#container');
        	    			DOM.show('.J_lessOne');
    	        	    }
            	    };		
            	    new H.widget.asyncRequest().setURI(getCostsSetUrl).setMethod("GET").setHandle(submitHandle).setData(null).send();
    			}      
		}
}, {
	requires: ['bui/tooltip']
});      