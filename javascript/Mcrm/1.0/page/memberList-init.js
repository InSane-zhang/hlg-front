/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,showPages,O) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	
 	return memberControl = {
 	    	paginator : null,
 	    	panel: null,
 	    	init : function() {
 	    	    Event.on('.search-btn','click',memberControl.searchTbItems); 
 	    	    Event.on('.update-btn','click',memberControl.update);
 	    	    memberControl.searchTbItems(); 
 	    	    Event.delegate(document,'click','.J_Delete',function(ev){
 	    	    	var name = DOM.attr(ev.currentTarget,'name')
 	    	    	memberControl.deleteMember(name);
 	    	    });
 	        },
 	        update : function() {
                var submitHandle = function(o) {
                	DOM.hide('.update-btn');
                	DOM.show('.J_Notice');
        	    };
        	    var errorHandle = function(o){
					DOM.hide('#J_Loading');
					DOM.show('#J_MainLeftContent');
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error",
						autoClose : true,
						timeOut : 3000
					});
        	    };

        	    new H.widget.asyncRequest().setURI(upgradeMemberUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(null).setDataType('json').send();
			}, 	        
 	        deleteMember : function(id){
				
	 	        	memberControl.panel = new O.Dialog({
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
	 	        	memberControl.panel.set('bodyContent',cont);
	 	        	memberControl.panel.show();	
	 	        	Event.on('.hlg-cancle','click',function(){
	 	        		memberControl.panel.hide();	
	 	        	}); 
	 	        	Event.on('.hlg-submit','click',function(){
		 	        	var submitHandle = function(o) {
		 	        		memberControl.panel.hide();
		 	        		window.location.reload();
		 	        	}
		         	    var errorHandle = function(o){
		 					DOM.hide('#J_Loading');
		 					DOM.show('#J_MainLeftContent');
							new H.widget.msgBox({
							    title:"错误提示",
							    content:o.desc,
							    type:"error",
								autoClose : true,
								timeOut : 3000
							});
		         	    };	
		         	    var data ="ids="+id; 
		         	    new H.widget.asyncRequest().setURI(getdeleteMemberUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).setDataType('json').send();
	 	        	}); 
 	        },
 	        searchTbItems : function() {
                 var submitHandle = function(o) {
                 	DOM.removeClass(".J_ItemSelectBtnHolder",'ks-hidden');
 	        	    totalRecords = o.payload.totalRecords;
 					if(totalRecords > 0){
 						DOM.hide('#J_REmpty');
 						DOM.show('.J_ItemSelectBtnHolder');
 					} else {
 						DOM.show('#J_REmpty');
 						DOM.hide('.J_ItemSelectBtnHolder');
 					}
 					memberControl.renderItems(o.payload.body);
 					pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
 					memberControl.paginator = new showPages('memberControl.paginator').setRender(memberControl.handlePagination).setPageCount(pageCount).printHtml('#J_Paging',2);
  					DOM.hide('#J_LeftLoading');
 					DOM.show('#J_MainLeftContent');
         	    };
         	    var errorHandle = function(o){
 					DOM.hide('#J_Loading');
 					DOM.show('#J_MainLeftContent');
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error",
						autoClose : true,
						timeOut : 3000
					});
         	    };
         	    var name = DOM.val('.costom-input');
         	    if(name == '姓名'){
         	    	var name = ''
         	    }else{
         	    	var name = DOM.val('.costom-input');
         	    }
         	    var data ="name="+name; 
 				DOM.show('#J_LeftLoading');
 				DOM.hide('#J_MainLeftContent');
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
 						DOM.get('#J_REmpty').style.display = 'none';
 						DOM.css(DOM.query(".J_ItemSelectBtnHolder"),'display' ,'');
 					} else {
 						DOM.get('#J_REmpty').style.display = '';
 						DOM.css(DOM.query(".J_ItemSelectBtnHolder"),'display' ,'none');
 					}
 					pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
 	    			memberControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_Paging',2);
 	        	    memberControl.renderItems(o.payload.body);
 					DOM.hide('#J_LeftLoading');
 					DOM.show('#J_MainLeftContent');
 		    	};
     	    	var data ="page_id="+pageId;
     	    	if (type == 0) {
 					//价格区间
 					var startPrice = DOM.val(DOM.get("#J_StartPrice"));
 					var endPrice = DOM.val(DOM.get("#J_EndPrice"));
 					data += "&start_price="+startPrice+"&end_price="+endPrice;
 				}
 				DOM.show('#J_LeftLoading');
 				DOM.hide('#J_MainLeftContent');
         	    new H.widget.asyncRequest().setURI(getItemsFromTbUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
 			}
 	}
}, {
    requires: ['utils/showPages/index','overlay']
});