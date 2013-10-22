
/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,showPages,Overlay,Tooltip,Select) {
	
	var S= KISSY,DOM = S.DOM, Event = S.Event;
	return MemberList = {
	    	paginator : null,
	    	msg :null,
	    	isFisrst : true,
	    	init : function() {
				Event.on("#J_LeftSearch", "click", function(){
					MemberList.searchTbItems();
				});
				Event.on(".J_Import", "click", function(){
					window.location.href = DataImportUrl;
				});
				Event.on(doc, 'keydown', function(evt) {
					if ( evt.which === 13) {
						if(MemberList.paginator){
							MemberList.paginator.toPage(MemberList.paginator.page);
						}else{
							MemberList.searchTbItems();
						}
					}
				})
				
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
				
				MemberList.searchTbItems();
				
				Event.delegate(document,'click','.J_Detail',function(ev){
					var member_id = DOM.attr(ev.currentTarget,'data');
	 	        	var submitHandle = function(o) {
		     	        var dialog = new Overlay.Dialog({
		     	            title:'用户信息',
		     	            width:700,
		     	            height:500,
		     	            mask:false,
		     	            buttons:[
		     	                     {
		     	                     text:'关闭',
		     	                     elCls : 'bui-button',
		     	                     handler : function(){
		     	                       this.hide();
		     	                     }
		     	                   }
		     	                 ],
		     	            
		     	            bodyContent:o.payload.body
		     	          });
		     	          dialog.show();
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
	         	    data = 'member_id='+member_id;
	         	    new H.widget.asyncRequest().setURI(detailDataUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
				})
				
				 var promptHelp = new Tooltip.Tip({
					 trigger : '#J_MemberDataHelp',
					 alignType : 'top', 
					 offset : 10,
					 elCls : 'ui-tip',
					 title : '<div class="ui-tip-text">开启后新交易用户联系信息将自动<br/>导入该列表，关闭交易期间用户信<br/>息可手动导入！</div>'   
				 })
				 promptHelp.render();
				 
				 var promptHelp = new Tooltip.Tip({
					 trigger : '#J_MemberDataHelp_1',
					 alignType : 'top', 
					 offset : 10,
					 elCls : 'ui-tip',
					 title : '<div class="ui-tip-text">关闭后新交易用户联系信息将不会<br/>自动导入该列表，但你可以右侧手<br/>动导入！！</div>'   
				 })
				 promptHelp.render();
				
	        },
	        searchTbItems : function() {
		        
	            var submitHandle = function(o) {
					DOM.hide('#J_LeftLoading');
					DOM.show('#J_MainLeftContent');
	        	    totalRecords = o.payload.totalRecords;
					if(totalRecords > 0){
						DOM.css(DOM.get('#J_LEmpty') ,'display','none');
						DOM.css(DOM.query(".J_ItemSelectBtnHolder") ,'display' , '');
					} else {
						DOM.css(DOM.get('#J_LEmpty'), 'display' , '');
						DOM.css(DOM.query(".J_ItemSelectBtnHolder") , 'display' , 'none');
					}
					MemberList.renderItems(o.payload.body);
					var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
					MemberList.paginator = new showPages('MemberList.paginator').setRender(MemberList.handlePagination).setPageCount(pageCount).printHtml('#J_Paging',2);
	    	    };
	    	    var data = MemberList.getData();
	 			DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainLeftContent');
	    	    new H.widget.asyncRequest().setURI(loadTbItemsUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			},
			renderItems: function(c) {
	    	    DOM.html(DOM.get("#J_TbItemList"), c);
	        	
			},
			
	    	handlePagination : function(turnTo) {
		    	var pageId = turnTo;
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
	 				MemberList.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_Paging',2);
	 				MemberList.renderItems(o.payload.body);
	 				DOM.hide('#J_LeftLoading');
					DOM.show('#J_MainLeftContent');
		    	};
		    	var data = MemberList.getData();
				data +="&page_id="+pageId;
				DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainLeftContent');
	    	    new H.widget.asyncRequest().setURI(loadTbItemsUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			},
			getData : function(){
    	    	if(DOM.val(DOM.get("#J_SearchNick")) != '输入旺旺名称'){
   	    	    	var nick = encodeURIComponent(DOM.val(DOM.get("#J_SearchNick"))); //标题
   	    	    }else{
   	    	    	var nick ='';
   	    	    }
   	    	    var data = "nick="+nick;
   	    	    if(DOM.val(DOM.get("#J_SearchName")) != '输入姓名'){
   	    	    	var name = encodeURIComponent(DOM.val(DOM.get("#J_SearchName"))); //标题
   	    	    }else{
   	    	    	var name ='';
   	    	    }
   	    	    data += "&name="+name;
		        return data;  
	
			},
			open:function(){
				 var submitHandle = function(o) {
				 		//var str = '<span style="color: #FB8534;float:left;margin-right:10px">自动将在淘宝新交易的用户加入列表</span>'+ 
	              		 // 		  '<input class="btm-caozuo-orange" type="button" name="" value="关闭" onclick="MemberList.close()">';
						//DOM.html('#J_SaveConfigButton',str);
							new H.widget.msgBox({ 
					 			type: "sucess", 
					 			content: "成功开启！",
								dialogType:"msg", 
								autoClose:true, 
								timeOut:3000
							});
							window.location.reload();
					
		    	    };
		    	    var data = 'no_auto=0';
		    	    new H.widget.asyncRequest().setURI(saveConfigUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			},
			close:function(){
				 var submitHandle = function(o) {
			 		//var str = '<span style="color: #FB8534;float:left;margin-right:10px">自动将在淘宝新交易的用户加入列表</span>'+ 
              		//  		  '<input class="btm-caozuo-orange" type="button" name="" value="启用" onclick="MemberList.open()">';
					//DOM.html('#J_SaveConfigButton',str);
						new H.widget.msgBox({ 
				 			type: "sucess", 
				 			content: "成功关闭！",
							dialogType:"msg", 
							autoClose:true, 
							timeOut:3000
						});
			 		window.location.reload();
	    	    };
	    	    var data = 'no_auto=1';
	    	    new H.widget.asyncRequest().setURI(saveConfigUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();

				
			}
			
		
	

}
   
}, {
    requires: ['utils/showPages/index','bui/overlay','bui/tooltip','bui/select']
});