KISSY.add('page/memberItem-init',function (S,showPages,Select,Overlay) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	
	return	members = {
			paginator : null,
			dialog : null,
			init : function() {
				DOM.val(DOM.get("#J_Grade"),DOM.val('#J_GradeValue'));
				var items = [
				  {text:'会员等级',value:'5'},
				  {text:'潜在会员',value:'0'},
				  {text:'普通客户',value:'1'},
				  {text:'高级会员',value:'2'},
				  {text:'VIP会员',value:'3'},
				  {text:'至尊VIP会员',value:'4'}						  
				],
				select = new Select.Select({  
				  render:'#J_Member',   
				  valueField:'#J_Grade',
				  items:items
				});
				select.render();
				select.setSelectedValue('5');
							
				var items = [
				  {text:'10条',value:'10'},
				  {text:'20条',value:'20'},
				  {text:'30条',value:'30'},
				  {text:'40条',value:'40'},
				  {text:'50条',value:'50'},
				  {text:'100条',value:'100'}						  
				],
				select = new Select.Select({  
				  render:'#J_Page',   
				  valueField:'#J_SelectItemPage',
				  items:items
				});
				select.render();
				select.setSelectedValue('10');
				
				
				
				
				members.searchTbItems();
				Event.on('#J_SearchMembers','click',members.searchTbItems);
				Event.delegate(document,'click','.J_Update',function(ev){
					var buyer_nick = DOM.attr(ev.currentTarget,'data-nick');
					var grade = DOM.attr(ev.currentTarget,'data-grade');
	 	        		if(!members.dialog){
	 	        			members.dialog = new Overlay.Dialog({
			     	            title:'修改等级',
			     	            width:420,
			     	            height:230,
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
	 	        			var cont = '<input type="hidden" value="" name="proto_id"><ul class="ui-about-list"><li><div class="ui-side-list">买家昵称：</div><div class="ui-content-list" id="J_Buyer"></div></li><li><div class="ui-side-list">会员等级：</div><div class="ui-content-list"><div id="J_Member_1"><input name="grade" type="hidden" id="J_Grade_1" value=""></div></div></li></ul>';
	 	        			members.dialog.set('bodyContent',cont);
	 	        			members.dialog.render();
	 	        			var items = [
    			             {text:'会员等级',value:'0'},
    			             {text:'普通客户',value:'1'},
    			             {text:'高级会员',value:'2'},
    			             {text:'VIP会员',value:'3'},
    			             {text:'至尊VIP会员',value:'4'}						  
    			             ],
    			             select = new Select.Select({  
    			            	 render:'#J_Member_1',   
    			            	 valueField:'#J_Grade_1',
    			            	 items:items
    			             });
	 	        			select.render();
	 	        			select.setSelectedValue('0');		     	        
	 	        		}
		     	         members.dialog.show();
		     	         DOM.html('#J_Buyer',buyer_nick);
		     	         Event.remove('.bui-button-primary','click');
		     	         Event.on('.bui-button-primary','click',function(){
		 	         	    var submitHandle = function(o){
		 	         	    	members.dialog.hide();
		 	         	    	window.location.reload();
		 						new H.widget.msgBox({ 
							 			type: "sucess", 
							 			content: "修改成功",
										dialogType:"msg", 
										autoClose:true, 
										timeOut:3000
									});
			         	    };		     	        	 
		 	         	    var errorHandle = function(o){
		 	         	    	members.dialog.hide();
								new H.widget.msgBox({
								    title:"错误提示",
								    content:o.desc,
								    type:"error"
								});
			         	    };
		     	        	var buyer_nick = DOM.html('#J_Buyer');
		     	        	var grade = DOM.val('#J_Grade_1');
		     	        	data = 'buyer_nick='+buyer_nick+'&grade='+grade;
			         	    new H.widget.asyncRequest().setURI(updateMemberFromTbUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
		     	         })
		     	         
				});
			},
		       //搜索淘宝宝贝
	        searchTbItems : function() {
                var submitHandle = function(o) {
	        	    totalRecords = o.payload.totalRecords;
					if(totalRecords > 0){
						DOM.hide('#J_LEmpty');
						DOM.show(".J_ItemSelectBtnHolder");
					} else {
						DOM.show('#J_LEmpty');
						DOM.hide(".J_ItemSelectBtnHolder");    
					}
					members.renderItems(o.payload.body);
					pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
					members.paginator = new showPages('members.paginator').setRender(members.handlePagination).setPageCount(pageCount).printHtml('#J_Paging',2);
					members.paginator = new showPages('members.paginator').setRender(members.handlePagination).setPageCount(pageCount).printHtml('#J_TopPaging',3);
  					DOM.hide('#J_LeftLoading');
 					DOM.show('#J_MainLeftContent');
        	    };
        	    var errorHandle = function(o){
        	    	members.msg.setMsg(o.desc).show();
        	    };
        	    if(DOM.val(DOM.get("#J_SearchBuyerNick")) != '买家昵称'){
        	    	var buyerNick = encodeURIComponent(DOM.val(DOM.get("#J_SearchBuyerNick"))); //买家昵称
        	    }else{
        	    	var buyerNick ='';
        	    }
        	    
        	    var grade = DOM.val(DOM.get("#J_Grade"));
    	    	var itemPage = DOM.val(DOM.get("#J_SelectItemPage"));//每页多少条
				var data ="buyer_nick="+buyerNick+"&grade="+grade+"&pageSize="+itemPage;
				DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainLeftContent');
        	    new H.widget.asyncRequest().setURI(getItemsFromTbUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).setDataType('json').send();
			},
			// 渲染 TbItems
			renderItems: function(c) {
        	    DOM.html(DOM.get("#J_TbItemList"), c,true);
			},
			handlePagination : function(turnTo) {
		    	pageId = turnTo;
	    		var submitHandle = function(o) {
	    			 totalRecords = o.payload.totalRecords;
						if(totalRecords > 0){
							DOM.hide('#J_LEmpty');
							DOM.show(".J_ItemSelectBtnHolder");
						} else {
							DOM.show('#J_LEmpty');
							DOM.hide(".J_ItemSelectBtnHolder");    
						}
					 pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
					 members.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_Paging',2);
					 members.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_TopPaging',3);
					 members.renderItems(o.payload.body);
  					 DOM.hide('#J_LeftLoading');
 					 DOM.show('#J_MainLeftContent');
		    	};
		    	if(DOM.val(DOM.get("#J_SearchBuyerNick")) != '买家昵称'){
        	    	var buyerNick = encodeURIComponent(DOM.val(DOM.get("#J_SearchBuyerNick"))); //买家昵称
        	    }else{
        	    	var buyerNick ='';
        	    }
		    	var grade = DOM.val(DOM.get("#J_Grade"));
    	    	var itemPage = DOM.val(DOM.get("#J_SelectItemPage"));
    	    	var data = "buyer_nick="+buyerNick+"&grade="+grade+"&page_id="+pageId+"&pageSize="+itemPage;
				DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainLeftContent');    	    	
        	    new H.widget.asyncRequest().setURI(getItemsFromTbUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			}
	}
}, {
    requires: ['utils/showPages/index','bui/select','bui/overlay']
});
