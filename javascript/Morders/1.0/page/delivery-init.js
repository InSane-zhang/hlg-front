/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,showPages,O,LinkSelect) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	return deliveryControl = {
	    	paginator : null,
			handlePagination :null,
	    	isFisrst : true,
	    	panel :null,
	    	panel2 :null,
	    	init : function() {
				deliveryControl.searchTbItems();
				var a = new LinkSelect(["#s1","#s2","#s3"],tdist, {
	            	defval: {
						text: "全部地区", val: "0"
				 	},
					rootid: 1 //根节点的ID，默认为0
				});
				Event.on('#J_Search','click',function(){
					deliveryControl.searchTbItems();
				})
				Event.on('#J_BatchSet','click',function(){
  					checked = DOM.query("#J_TbItemList .checked");
					var length = checked.length;
					if(length == 0){
						new H.widget.msgBox({
						    title:"提示",
						    content:'请至少选择一条订单',
						    type:"error"
						});
					}else{
						deliveryControl.batchSet();
					}
				})
				deliveryControl.Calendar('J_startDate');
				deliveryControl.Calendar('J_endDate');
				Event.delegate(document,'click','.edit',function(ev){
					var logisticCompany = DOM.attr(ev.currentTarget,'value'); 
					var expressId = DOM.attr(ev.currentTarget,'title');
					var type = DOM.attr(ev.currentTarget,'type');
					deliveryControl.edit(logisticCompany,expressId,type);
				})			
				Event.on('#J_Manage','click',function(){
					deliveryControl.manage();
				})	
				Event.on('#J_Delivery','click',function(){
  					checked = DOM.query("#J_TbItemList .checked");
					var length = checked.length;
					if(length == 0){
						new H.widget.msgBox({
						    title:"提示",
						    content:'请至少选择一条订单',
						    type:"error"
						});
					}else{
						deliveryControl.deliver();
					}					
				})				
				Event.on(DOM.query('.printFile'),'click',function(ev){
					if(DOM.hasClass(ev.currentTarget,'current')){
						
					}else{
						DOM.removeClass(DOM.query('.printFile'),'current')
						DOM.addClass(ev.currentTarget,'current');
					}
				})
				Event.delegate(document,'click','.J_CheckBox',function(ev){
					if(DOM.attr(ev.currentTarget,'checked')){
						DOM.addClass(ev.currentTarget,'checked')
					}else{
						DOM.removeClass(ev.currentTarget,'checked')
					}
					checkBoxs = DOM.query("#J_TbItemList .J_CheckBox");
					var len = checkBoxs.length;
					checked = DOM.query("#J_TbItemList .checked");
					var length = checked.length;	
					if(len == length){
						DOM.attr('.J_CheckedAll','checked','checked')
					}else if(length < len){
						DOM.attr('.J_CheckedAll','checked',false)
					}
				})				
	        },
	        deliver : function() {
  				var submitHandle = function(o) {

				};
				var errorHandle = function(o){
					new H.widget.msgBox({
							    title:"错误提示",
							    content:o.desc,
							    type:"error"
							});
				};	  
				var json = [];
				var checked = DOM.query("#J_TbItemList .checked");
				var length = checked.length;
				for(i=0; i<length; i++){
					var expressId = DOM.attr(DOM.parent(checked[i]),'title');
					var tid = DOM.attr(DOM.parent(checked[i]),'type'); 
					var logisticCompany = DOM.attr(DOM.parent(checked[i]),'value'); 
					var o = '{"expressId":"' + expressId + '","tid":"' + tid + '","logisticCompany":"' + logisticCompany + '"}';
					o = eval('(' + o + ')');						
					json.push(o);
				}
				var itemsJson = KISSY.JSON.stringify(json);
				var data = "delivers="+itemsJson;
				new H.widget.asyncRequest().setURI(loadSearchUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},	        
	        CheckAll : function(ev){
				checkBoxs = DOM.query("#J_TbItemList .J_CheckBox");
				var len = checkBoxs.length;
				for(i=0; i<len; i++){
					var iid = checkBoxs[i].value;
					if(checkBoxs[i].disabled) continue;
					if(ev.checked){
						checkBoxs[i].checked = true;
						DOM.addClass(checkBoxs[i],'checked')
					} else {
						checkBoxs[i].checked = false;
						DOM.removeClass(checkBoxs[i],'checked')
					}					
//					if(checkBoxs[i].checked = true){alert(i)}
				}
				
	        },  
	        batchSet : function(){
	        	var submitHandle = function(o) {
					if(!deliveryControl.panel2){
			        	deliveryControl.panel2 = new O.Dialog({
						      width: 360,
						      headerContent: '批量设置',
						      bodyContent: '',
						      mask: true,
						      align: {
						          points: ['cc', 'cc']
						      },
						      closable :true,
						      draggable: true,
						      aria:true
						  });
		        	}
					var cont = '<div id="" style="padding:15px;width:300px;margin:auto;"><ul style="overflow:hidden">'
					+'<li class="min-height-30 fl">'
					+'<div class="w-70 align-right fl">快递:</div>'
					+'<div class="fl ml6">'
					+o.payload.body
					+'</div>'
					+'</li>'
					+'<li class="min-height-30 fl">'
					+'<div class="w-70 align-right fl">起始单号:</div>'
					+'<div class="fl ml6 input-text"><input type="text" class="w-200 input-none" value="" name="expressId" id="J_ExpressNum"></div>'
					+'</li>'
					+'<li class="min-height-30 fl">'
					+'<div class="w-70 align-right fl">规则:</div>'
					+'<div class="fl ml6">依次递增</div><div class="fl ml6 input-text"><input type="text" class="w-100 input-none" value="1" name="regex" id="J_Regex"></div>'
					+'</li>'
					+'</ul><div style="width:160px;margin:15px auto 0 auto;overflow:hidden;"><input id="J_SaveExpressNum" class="btm-68-orange fl" type="button" name="确定" value="确定"><input class="btm-68-gray fl cancle" type="button" name="取消" value="取消"></div></div>';
					deliveryControl.panel2.set('bodyContent',cont);
					deliveryControl.panel2.show();
					Event.on('.cancle','click',function(){
						deliveryControl.panel2.hide();
					})	  
					Event.remove('#J_SaveExpressNum');
					Event.on('#J_SaveExpressNum','click',function(){
						deliveryControl.batchNum();
						deliveryControl.panel2.hide();
					})	
				};
        	    var errorHandle = function(o){
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
        	    };
				var listCompanies = 1; 
				var data = "listCompanies="+listCompanies;				
        	    new H.widget.asyncRequest().setURI(loadManageUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
	        },
	        batchNum : function(){
	        	var submitHandle = function(o) {
	        		DOM.html('#J_TbItemList',o.payload.body);
	        		DOM.attr('.J_CheckedAll','checked',false);
	        	};
        	    var errorHandle = function(o){
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
        	    };
				checked = DOM.query("#J_TbItemList .checked");
				var length = checked.length;
				var json = [];
        	    for(i=0; i<length; i++){ 
        	    	var id = checked[i].value
					var o = '{"tid":"' + id + '"}';
					o = eval('(' + o + ')');	
					json.push(o);
        	    }
				var itemsJson = KISSY.JSON.stringify(json);        	    
				var expressId = DOM.val('#J_ExpressNum');
				var logisticCompany = DOM.val('#J_Express');
				var regex = DOM.val('#J_Regex');
				var data = "logisticCompany="+logisticCompany+"&expressId="+expressId+"&regex="+regex+"&tids="+itemsJson;				
        	    new H.widget.asyncRequest().setURI(loadSearchUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
	        },	        
	        edit : function(id,num,type){
	        	var submitHandle = function(o) {
					if(!deliveryControl.panel){
			        	deliveryControl.panel = new O.Dialog({
						      width: 360,
						      headerContent: '编辑',
						      bodyContent: '',
						      mask: true,
						      align: {
						          points: ['cc', 'cc']
						      },
						      closable :true,
						      draggable: true,
						      aria:true
						  });
		        	}
					var cont = '<div id="" style="padding:15px;width:200px;margin:auto;"><ul><li class="min-height-30">选择快递：'
						+o.payload.body
						+'</li><li class="min-height-30">快递单号：<input id="J_ExpressText" type="text" value="" style="color:#666;"></li></ul><div style="width:160px;margin:15px auto 0 auto;overflow:hidden;"><input id="J_Modify" class="btm-68-orange fl" type="button" name="确定" value="确定"><input class="btm-68-gray fl cancle" type="button" name="取消" value="取消"></div></div>';
					deliveryControl.panel.set('bodyContent',cont);
					deliveryControl.panel.show();
					DOM.val('#J_ExpressText',num)
					DOM.val('#J_LogisticCompany',id)
					Event.on('.cancle','click',function(){
						deliveryControl.panel.hide();
					})	
					Event.remove('#J_Modify')
					var tid = type;
					Event.on('#J_Modify','click',function(type){
						DOM.html('#J_SinpleExpress_'+tid,DOM.val('#J_Express'));
						DOM.html('#J_SinpleNum_'+tid,DOM.val('#J_ExpressText'));
						deliveryControl.panel.hide();
					})
				};
        	    var errorHandle = function(o){
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
        	    };
				var listCompanies = 1; 
				var data = "listCompanies="+listCompanies;				
        	    new H.widget.asyncRequest().setURI(loadManageUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();				
	        },
			Calendar : function($id){
				var c =new KISSY.Calendar('#'+$id,{
							popup:true,
							triggerType:['click'],
							showTime:true,
							date :new Date(),
							maxDate:new Date()
						}).on('select timeSelect',function(e){
								var id = this.id,self = this;
								var startDate   = KISSY.Date.format(e.date,'yyyy-mm-dd HH:MM:ss');
								KISSY.one('#'+$id).val(startDate);
								self.hide();
							});
			},
	        searchTbItems : function() {
	            var submitHandle = function(o) {
					DOM.hide('#J_LeftLoading');
					DOM.show('#J_MainLeftContent');
	        	    totalRecords = o.payload.totalRecords;
	        	    DOM.html('#J_TotalRecords',totalRecords)
					if(totalRecords > 0){
						DOM.css(DOM.get('#J_LEmpty') ,'display','none');
						DOM.css(DOM.query(".J_ItemSelectBtnHolder") ,'display' , '');
					} else {
						DOM.css(DOM.get('#J_LEmpty'), 'display' , '');
						DOM.css(DOM.query(".J_ItemSelectBtnHolder") , 'display' , 'none');
					}
					deliveryControl.renderItems(o.payload.body);
					var pageCount = Math.ceil(totalRecords/o.payload.pageSize); 
					deliveryControl.paginator = new showPages('deliveryControl.paginator').setRender(deliveryControl.handlePagination).setPageCount(pageCount).printHtml('#J_Paging',2);
	    	    };
	    	    var errorHandle = function(o){
					new H.widget.msgBox({
							    title:"错误提示",
							    content:o.desc,
							    type:"error"
							});
	    	    };	    	    
   	    	    if(DOM.val(DOM.get("#J_SearchNick")) != '输入买家昵称'){
   	    	    	var nick = encodeURIComponent(DOM.val(DOM.get("#J_SearchNick")));
   	    	    }else{
   	    	    	var nick ='';
   	    	    }    	    	
	    	    var starttime = DOM.val('#J_startDate');
	    	    var endtime = DOM.val('#J_endDate');
	    	    var state = DOM.val('#s1');
	    	    var pagesize = DOM.val('#J_PageSize');
	 			DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainLeftContent');
				var data = "starttime="+starttime+"&endtime="+endtime+"&state="+state+"&buyernick="+nick+"&pagesize="+pagesize;
	    	    new H.widget.asyncRequest().setURI(loadSearchUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
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
	 				var pageCount = Math.ceil(totalRecords/o.payload.pageSize); 
	 				deliveryControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_Paging',2);
	 				deliveryControl.renderItems(o.payload.body);
	 				DOM.hide('#J_LeftLoading');
					DOM.show('#J_MainLeftContent');
		    	};
   	    	    if(DOM.val(DOM.get("#J_SearchNick")) != '输入买家昵称'){
   	    	    	var nick = encodeURIComponent(DOM.val(DOM.get("#J_SearchNick")));
   	    	    }else{
   	    	    	var nick ='';
   	    	    }    	    	
	    	    var starttime = DOM.val('#J_startDate');
	    	    var endtime = DOM.val('#J_endDate');
	    	    var state = DOM.val('#s1');
	    	    var pagesize = DOM.val('#J_PageSize');
				data ="page_id="+pageId+"&starttime="+starttime+"&endtime="+endtime+"&state="+state+"&buyernick="+nick+"&pagesize="+pagesize;;
				DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainLeftContent');
	    	    new H.widget.asyncRequest().setURI(loadSearchUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			}			
	}
}, {
    requires: ['utils/showPages/index','overlay','gallery/province/1.0/index']
});