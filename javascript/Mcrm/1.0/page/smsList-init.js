/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,showPages,O) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	
 	return smsControl = {
 	    	paginator : null,
 	    	panel: null,
 	    	init : function() {
 	    	    Event.on('#J_SearchBtn','click',smsControl.searchTbItems); 
 	    	    smsControl.searchTbItems(1); 
 	    	    Event.delegate(document,'click','.J_Delete',function(ev){
 	    	    	var name = DOM.attr(ev.currentTarget,'name');
 	    	    	smsControl.deleteMember(name)
 	    	    });
 	    	    Event.delegate(document,'click','.J_View',function(ev){
 	    	    	var name = DOM.attr(ev.currentTarget,'name');
 	    	    	smsControl.viewMember(name);
 	    	    });
 	    	    Event.delegate(document,'click','.J_retry',function(ev){
 	    	    	var name = DOM.attr(ev.currentTarget,'name');
 	    	    	
 	    	    	smsControl.retry(name);
 	    	    });
 	    	    Event.on(DOM.query('#J_Sort a'),'click',function(ev){
 	    			if(!DOM.hasClass(ev.currentTarget,'current')){
 	    				DOM.removeClass(DOM.query('#J_Sort a'),'current')
 	    				DOM.addClass(ev.currentTarget,'current');	
 	    			}	
 	    			var name = DOM.attr(ev.currentTarget,'name');
 	    			if(name == '1'){
 	    				DOM.hide('.J_user');
 	    			}else{
 	    				DOM.show('.J_user');
 	    				DOM.hide('.J_Modify');
 	    			}
 	    			smsControl.searchTbItems(name); 
 	    		})
 	        },
 	        retry : function(name){
                var submitHandle = function(o) {

        	    };
        	    var errorHandle = function(o){

        	    };  
        	    var data ="plan_id="+name;
        	    new H.widget.asyncRequest().setURI(retryPlanUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
 	        }, 	        
 	        viewMember : function(name){
 	        	smsControl.panel = new O.Dialog({
				      width: 460,
				      headerContent: '查看用户',
				      bodyContent: '', 
				      mask: false,
				      align: {
				          points: ['cc', 'cc']
				      },
				      closable :true,
				      draggable: true,
				      aria:true
				});	 
 	        	var el = DOM.val('.content_'+name)
 	        	var cont = '<ul class="hlg-dialog-content" style="width:440px;">'+el+'</ul>'
 	        	smsControl.panel.set('bodyContent',cont);
 	        	smsControl.panel.show();	
 	        	Event.on('.hlg-cancle','click',function(){
 	        		smsControl.panel.hide();	
 	        	}); 
 	        },
 	        deleteMember : function(id){
				
 	        	smsControl.panel = new O.Dialog({
				      width: 350,
				      headerContent: '删除',
				      bodyContent: '', 
				      mask: false,
				      align: {
				          points: ['cc', 'cc']
				      },
				      closable :true,
				      draggable: true,
				      aria:true
				});	  
 	        	var cont = '<div class="hlg-dialog-content">删除后无法恢复，确定删除吗？</div><div class="hlg-dialog-btn"><input class="hlg-submit" type="button" value="确定删除"><input class="hlg-cancle" type="button" value="取消"></div>'
 	        	smsControl.panel.set('bodyContent',cont);
 	        	smsControl.panel.show();	
 	        	Event.on('.hlg-cancle','click',function(){
 	        		smsControl.panel.hide();	
 	        	}); 
 	        	Event.on('.hlg-submit','click',function(){
	 	        	var submitHandle = function(o) {
	 	        		smsControl.panel.hide();
	 	        		window.location.reload();
	 	        	}
	         	    var errorHandle = function(o){

	         	    };	
	         	    var data ="plan_id="+id; 
	         	    new H.widget.asyncRequest().setURI(deletePlanUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).setDataType('json').send();
 	        	}); 
	        }, 	        
 	        searchTbItems : function(name) {
                 var submitHandle = function(o) {
                 	//DOM.removeClass(".J_ItemSelectBtnHolder",'ks-hidden');
 	        	    totalRecords = o.payload.totalRecords;
 					if(totalRecords > 0){
 						DOM.hide('#J_LEmpty');
 						DOM.show('.J_ItemSelectBtnHolder');
 					} else {
 						DOM.show('#J_LEmpty');
 						DOM.hide('.J_ItemSelectBtnHolder');
 					}
 					smsControl.renderItems(o.payload.body);  
 					pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
 					smsControl.paginator = new showPages('smsControl.paginator').setRender(smsControl.handlePagination).setPageCount(pageCount).printHtml('#J_Paging',2);
  					DOM.hide('#J_LeftLoading');
 					DOM.show('#J_MainLeftContent');
 	    			if(name == '1'){
 	    				DOM.show('.J_waitSend');
 	    				DOM.hide('.J_hasSend');
 	    			}else{
 	    				DOM.show('.J_hasSend');
 	    				DOM.hide('.J_waitSend');
 	    			}
         	    };
         	    var errorHandle = function(o){
 					DOM.hide('#J_Loading');
 					DOM.show('#J_MainLeftContent');
         	    };
         	    var pageSize = 10;
 				DOM.show('#J_LeftLoading');
 				DOM.hide('#J_MainLeftContent');
 				var data ="status="+name;
         	    new H.widget.asyncRequest().setURI(getItemsFromTbUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).setDataType('json').send();
 			},
 			
 			// 渲染 TbItems
 			renderItems: function(c) {
         	    DOM.html(DOM.get("#J_PromotionItemList"), c,true);
 			},
 	    	handlePagination : function(turnTo) {
 		    	pageId = turnTo;
 	    		var submitHandle = function(o) {
 	    			 totalRecords = o.payload.totalRecords;
 					 if(totalRecords > 0){
 						DOM.get('#J_LEmpty').style.display = 'none';
 						DOM.css(DOM.query(".J_ItemSelectBtnHolder"),'display' ,'');
 					} else {
 						DOM.get('#J_LEmpty').style.display = '';
 						DOM.css(DOM.query(".J_ItemSelectBtnHolder"),'display' ,'none');
 					}
 					pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
 	    			smsControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_Paging',2);
 	        	    smsControl.renderItems(o.payload.body);
 					DOM.hide('#J_LeftLoading');
 					DOM.show('#J_MainLeftContent');
 		    	};
     	    	var data ="page_id="+pageId+"&pageSize="+pageSize;
 				DOM.show('#J_LeftLoading');
 				DOM.hide('#J_MainLeftContent');
         	    new H.widget.asyncRequest().setURI(getItemsFromTbUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
 			}
 	}
}, {
    requires: ['utils/showPages/index','overlay']
});