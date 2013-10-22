//***  changeDetail   js* **/
KISSY.add(function(S,showPages){
	var S = KISSY,DOM = S.DOM, Event = S.Event;	
	return changeDetail = {
		    	paginator : null,
		    	page : null,
		    	msg :null,
		    	init : function() {
		    		Event.on('.J_ListBtn1','click',function(ev){
		    			var val = DOM.attr(ev.currentTarget,'data');
		    			DOM.val('#J_CycleType',val);
		    			DOM.removeClass('.J_ListBtn1','current');
		    			DOM.addClass(ev.currentTarget,'current');
		    			changeDetail.getChangeListAjax();
		    		})
					changeDetail.getChangeListAjax();
		        },
		        getChangeListAjax :function() {
                    var submitHandle = function(o) {
                    	DOM.hide('#J_LeftLoading');
    					DOM.show('#J_MainLeftContent');
    	        	    totalRecords = o.payload.totalRecords;
    					DOM.css(DOM.get('#J_NoteIcon') ,'display','none');
    					if(totalRecords > 0){
    						DOM.css(DOM.get('#J_LEmpty') ,'display','none');
    						DOM.css(DOM.query(".J_ItemSelectBtnHolder") ,'display' , '');
    					} else {
    						DOM.css(DOM.get('#J_LEmpty'), 'display' , '');
    						DOM.css(DOM.query(".J_ItemSelectBtnHolder") , 'display' , 'none');
    					}
                        DOM.html(DOM.get("#J_List"), o.payload.body,true);
    					var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
    					changeDetail.paginator = new showPages('changeDetail.paginator').setRender(changeDetail.handlePagination).setPageCount(pageCount).printHtml('#J_Paging',2);
                    };
                    var errorHandle = function(o){
                        DOM.html(DOM.get("#J_Chart1"), o.desc,true);
                    };
                    var show_cycle = DOM.val('#J_CycleType');
                    var type_id = DOM.val('#J_TypeId');
                    var page_size = 10;
                    var data = 'page_size='+page_size+'&show_cycle='+show_cycle+'&type_id='+type_id;
                    new H.widget.asyncRequest().setURI(getChangeListAjaxUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
                },
    	    	handlePagination : function(turnTo) {
    		    	pageId = turnTo;
    	    		var submitHandle = function(o) {
    	    			 totalRecords = o.payload.totalRecords;
    	 				if(totalRecords > 0){
    	 					DOM.css(DOM.get('#J_LEmpty') ,'display','none');
    	 					DOM.css(DOM.query(".J_ItemSelectBtnHolder") ,'display' , '');
    	 				} else {
    	 					DOM.css(DOM.get('#J_LEmpty'), 'display' , '');
    	 					DOM.css(DOM.query(".J_ItemSelectBtnHolder") , 'display' , 'none');
    	 				}
    	 				var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
    	 				changeDetail.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_Paging',2);
                        DOM.html(DOM.get("#J_List"), o.payload.body,true);
    	 				DOM.hide('#J_LeftLoading');
    					DOM.show('#J_MainLeftContent');
    		    	};
                    var show_cycle = DOM.val('#J_CycleType');
                    var type_id = DOM.val('#J_TypeId');
                    var page_size = 10;
                    var data = 'page_size='+page_size+'&show_cycle='+show_cycle+"&page_no="+pageId+'&type_id='+type_id;
    				 DOM.show('#J_LeftLoading');
    			    DOM.hide('#J_MainLeftContent');
    	    	    new H.widget.asyncRequest().setURI(getChangeListAjaxUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
    			}
		}
}, {
    requires: ['utils/showPages/index']
});
