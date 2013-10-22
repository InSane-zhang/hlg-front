/*
combined files : 

utils/showPages/index
page/smsList-init

*/
/**
 * @分页组件
 * @author  @sjs_stef
 */
KISSY.add('utils/showPages/index',function (S) {
    var DOM = S.DOM, Event = S.Event, doc = document;
  
    function showPages(name) { //初始化属性 
        var self = this; 
        if (!(self instanceof showPages)) { 
            return new showPages(name); 
        }   
        this.pageNum = 4 ;   
        this.name = name;      //对象名称
        this.page = 1;         //当前页数
        this.pageCount = 200;    //总页数
        this.argName = 'page'; //参数名    
    }

    S.mix(showPages.prototype,{
        jump: function() {
            return undefined;
        },
        
        //进行当前页数和总页数的验证
        checkPages: function() { 
            if (isNaN(parseInt(this.page))) this.page = 1;
            if (isNaN(parseInt(this.pageCount))) this.pageCount = 1;
            if (this.page < 1) this.page = 1;
            if (this.pageCount < 1) this.pageCount = 1;
            if (this.page > this.pageCount) this.page = this.pageCount;
            this.page = parseInt(this.page);
            this.pageCount = parseInt(this.pageCount);
        },
        
        //生成html代码    
        _createHtml: function(mode) { 
       
            var self = this, strHtml = '', prevPage = this.page - 1, nextPage = this.page + 1;   
            if (mode == '' || typeof(mode) == 'undefined') mode = 1;
        
            switch (mode) {
                case 1: 
                    //模式1 (页数)
                     strHtml += '<div class="page-bottom"> <div class="sabrosus">';
	   					strHtml += '<font class="number">';
	   					strHtml += '共'+this.pageCount+'页&nbsp;';
	   					strHtml += '<input style="" type="text"  class="page-input" id="pageInput' + self.name + '"  value="页码" onkeypress="return window.' + self.name + '.formatInputPage(event);" onfocus="this.className=\'page-input page-input-text-on \';if(this.value==\'页码\'){this.value = \'\';}" onblur="this.className=\'page-input\';if(this.value==\'\'){this.value = \'页码\'}">';
	   					strHtml += '<input type="button" value="Go" class="btm-go" onclick="javascript:var page = document.getElementById(\'pageInput' + self.name + '\').value; if(isNaN(Number(page))|| Number(page)==0) { var turnTo = 1;} else if(page>'+this.pageCount+'){ var turnTo = '+this.pageCount+';} else{var turnTo = page;}  window.' + self.name + '.toPage(turnTo);" >';
	   					strHtml += '</font>';	
	   				    if (prevPage < 1) {
	                        strHtml += '<span class="pre-none page-pic-no"></span>';
	                    } else {
	                        strHtml += '<span title="上一页" class="pre page-pic-no" onclick="' + self.name + '.toPage(' + prevPage + ');"></span>';
	                    }
	   					if (nextPage > this.pageCount) {
	                    	strHtml += '<span class="next-none page-pic-no"></span>';
	                    } else {
	                    	strHtml += '<span title="下一页" class="next page-pic-no" onclick="' + self.name + '.toPage(' + nextPage + ');"></span>';
	                    }
	   				 strHtml += '<div style="clear:both"></div></div></div> '; 
                    break;
                                 
                    case 2: 
    					//模式2 (前后缩略,页数,首页,前页,后页,尾页)
                    	
    					if(this.pageCount > 1){
    	                    strHtml += '<div class="page-bottom"> <div class="sabrosus">';
    	                    
    	                    if (this.pageCount > 5) {
    		   					strHtml += '<font class="number">';
    		   					strHtml += '共'+this.pageCount+'页&nbsp;';
    		   					strHtml += '<input style="" type="text"  class="page-input" id="pageInput' + self.name + '"  value="页码" onkeypress="return window.' + self.name + '.formatInputPage(event);" onfocus="this.className=\'page-input page-input-text-on \';if(this.value==\'页码\'){this.value = \'\';}" onblur="this.className=\'page-input\';if(this.value==\'\'){this.value = \'页码\'}">';
    		   					strHtml += '<input type="button" value="Go" class="btm-go" onclick="javascript:var page = document.getElementById(\'pageInput' + self.name + '\').value; if(isNaN(Number(page))|| Number(page)==0) { var turnTo = 1;} else if(page>'+this.pageCount+'){ var turnTo = '+this.pageCount+';} else{var turnTo = page;}  window.' + self.name + '.toPage(turnTo);" >';
    		   					strHtml += '</font>';	
    	                    }
    	                    
    	                    
    	                    if (prevPage < 1) {
    	                        strHtml += '<span class="pre-none page-pic-no"></span>';
    	                    } else {
    	                        strHtml += '<span title="上一页" class="pre page-pic-no" onclick="' + self.name + '.toPage(' + prevPage + ');"></span>';
    	                    }
    	                    
    	                    if (this.page != 1) {
    							//strHtml += ' <a class="a-padding" href="javascript:' + self.name  + '.toPage(1);">1</a>';
    						}
    						if(this.page - 2<=0){
    							var start = 1;
    								if (this.pageCount > this.page + 4) {
    	                           		var endPage = this.page + 4;
    	                           } else {
    	                             	var endPage = this.pageCount; 
    	                            }
    						}else if(this.page + 2>=this.pageCount){
    							var start = this.pageCount-4;
    							if (this.pageCount > this.page + 4) {
    	                       		var endPage = this.page + 4;
    	                        } else {
    	                         	var endPage = this.pageCount; 
    	                        }
    						}else {
    							var start = this.page - 2;
    							if (this.pageCount > this.page + 2) {
    		                           		var endPage = this.page + 2;
    		                           } else {
    		                             	var endPage = this.pageCount; 
    		                             }
    						}
    	                    for (var i = start; i <= endPage; i++) {
    	                    if (i > 0) {
    	                       	if (i == this.page) {
    	                           	strHtml += '<span class="current a-padding">'+ i + '</span>';
    	                        } else {
    	                           // if (i != 1 && i != this.pageCount) {
    	                              	strHtml += '<a class="a-padding" href="javascript:' + self.name + '.toPage(' + i + ');">' + i + '</a>';
    	                           // }
    						      }
    	                    }
    	                    }
    	                    if (this.page + 5 < this.pageCount) {
    							strHtml += '<a class="a-padding" title="" href="javascript:' + self.name + '.toPage(' + (this.page + 3) + ');">...</a>';
    						}
    				  	    if (this.page != this.pageCount) {
    							//strHtml += '<span title="Page ' + this.pageCount + '"><a href="javascript:' + self.name + '.toPage(' + this.pageCount + ');">' + this.pageCount + '</a></span>';
    						}
    						if (nextPage > this.pageCount) {
    	                    	strHtml += '<span class="next-none page-pic-no"></span>';
    	                    } else {
    	                    	strHtml += '<span title="下一页" class="next page-pic-no" onclick="' + self.name + '.toPage(' + nextPage + ');"></span>';
    	                      }
    						
    						
    						
    	                   strHtml += '<div style="clear:both"></div></div></div> ';
    					}
                       break;
    			   case 3 :
    				   strHtml += '<div class="page-top"><div class="sabrosus"><span class="count">' + this.page + ' / ' + this.pageCount + '</span>';
                       if (prevPage < 1) {
                           strHtml += ' <span class="pre-none page-pic-no"></span>';
                       } else {
                           strHtml += '<a class="border-left-dedede" href="javascript:' + self.name + '.toPage(' + prevPage + ');" title="上一页"><span class="pre page-pic-no"></span></a>';
                         }
                       if (nextPage > this.pageCount) {
                       	strHtml += '<span class="next-none page-pic-no"></span>';
                       } else {
                           strHtml += '<a href="javascript:' + self.name + '.toPage(' + nextPage + ');" title="下一页"><span class="next page-pic-no"></span></a>';
                         }
                      strHtml += '<div style="clear:both"></div></div></div>';
                      break;
                    
            }
            return strHtml; 
               
        },
         //限定输入页数格式
        formatInputPage : function(e){
            var ie = navigator.appName=="Microsoft Internet Explorer"?true:false;
            if(!ie) var key = e.which;
            else var key = event.keyCode;
            if (key == 8 || key == 46 || (key >= 48 && key <= 57)) return true;
            return false;
        },
      
        //页面跳转 返回将跳转的页数
        toPage: function( page ,flag) { 
            var turnTo = 1;
            var self = this;    
            if (typeof(page) == 'object') {
                turnTo = page.options[page.selectedIndex].value;
            } else {
                turnTo = page;
              }
            
            self.jump(turnTo,flag,'');
              
        },
              
        //显示html代码
        printHtml: function(contian, mode) {  
            this.checkPages();
            DOM.html(contian,this._createHtml(mode));
            return this;
        },
                   
        //设置总页数           
        setPageCount: function( pagecount ) {
            this.pageCount=pagecount;
            return this;
        },              
        
        getPageCount: function() {
            return this.pageCount;
        },
        
        //设置跳转 执行函数
        setRender: function(fn) {
            this.jump = fn;
            return this;
        },  
        setPageNum:function(page_num){
            this.pageNum = page_num;
            return this;
         },
        setPage:function(page){
            this.page = page;  
            return this; 
        }          

               
    });

    return showPages;
  
});
/**
 * @fileOverview 
 * @author  
 */
KISSY.add('page/smsList-init',function (S,showPages,Select,Calendar) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	
	return Smslist = {
	    	paginator : null,
			handlePagination :null,
	    	isFisrst : true,
	    	init : function() {
				
				var items4 = [
					{text:'发送类型选择',value:'0'},
					{text:'等待付款通知',value:'1'},
					{text:'延迟发货通知',value:'12'},
					{text:'确认收货通知',value:'13'},
					{text:'领取通知',value:'21'},
					{text:'发货通知',value:'11'},
					{text:'到期通知',value:'22'},
					{text:'使用通知',value:'23'},
					{text:'其它通知',value:'0'},
					{text:'促销通知',value:'31'},
					{text:'中差评预警',value:'66'},
					{text:'差评防御',value:'88'}
				],
				statusSelect = new Select.Select({  
					render:'#J_CaretypeItem',
					valueField:'#J_Caretype',
					items:items4
				});
				statusSelect.render();
				statusSelect.setSelectedValue('0');
				var type = DOM.val('#J_Type');
				if(type != ''){
					statusSelect.setSelectedValue(type);
				}
				statusSelect.on('change', function(ev){
					Smslist.searchTbItems();
				});
				var items3 = [
					{text:'状态',value:'0'},
					{text:'发送成功',value:'2'},
					{text:'发送失败',value:'4'},
					{text:'余额不够',value:'5'}		
				],
				CarestatusSelect = new Select.Select({  
					render:'#J_CareItemstatus',
					valueField:'#J_Carestatus',
					items:items3
				});
				CarestatusSelect.render();
				CarestatusSelect.setSelectedValue('0');
				CarestatusSelect.on('change', function(ev){
					Smslist.searchTbItems();
				});
				var items2 = [
				    {text:'近期记录',value:'0'},
					{text:'历史记录',value:'_history'}
				
				],
				historySelect = new Select.Select({  
					render:'#J_historyItem',
					valueField:'#J_history',
					items:items2
				});
				historySelect.render();
				historySelect.setSelectedValue('0');
				historySelect.on('change', function(ev){
					Smslist.searchTbItems();
				});
				var datepicker = new Calendar.DatePicker({
   	              trigger:'#J_startDate',
   	              showTime:true,
   	              autoRender : true,
   	              autoSetValue :false,
   	              textField  : '2'
   	            });
   	         	var datepicker2 = new Calendar.DatePicker({
   	              trigger:'#J_endDate',
   	              showTime:true,
   	              autoRender : true,
   	              autoSetValue :false,
   	              textField  : '2'
   	            });
   	         
   	         	datepicker.on('selectedchange',function (e) {
   	        	 	var endDate = H.util.stringToDate(S.one('#J_endDate').val());
						var startDate   = e.value;
						if((endDate !='')&&(startDate.getTime() >= endDate.getTime()))
						{
							new H.widget.msgBox({
								    title:"错误提示",
								    content:'开始时间不能大于结束时间，请重新选择',
								    type:"info"
								});
							//S.one('#J_startDate').val('');
						}else{
							S.one('#J_startDate').val(e.text);
						}
   	         	});
   	         	datepicker2.on('selectedchange',function (e) {
		     	       	var endDate   =  e.value;
						var startTime = H.util.stringToDate(S.one('#J_startDate').val());
						var endTime = H.util.stringToDate(endDate);
						if((endTime.getTime() <= startTime.getTime())&&(startTime !='')){
							new H.widget.msgBox({
								    title:"错误提示",
								    content:'结束时间不能小于开始时间，请重新选择',
								    type:"info"
								});
							//S.one('#J_endDate').val('');
						}else{
							S.one('#J_endDate').val(e.text);
						}
   	        	 });
   	         	Event.on(DOM.query('.J_Tiger'),'mouseenter mouseleave',function(ev){
   	         		if(ev.type == 'mouseenter'){
   	         			DOM.addClass(ev.currentTarget,'current');
   	         		}else{
   	         			DOM.removeClass(ev.currentTarget,'current');
   	         		}
   	         	})
	   	        Event.on(DOM.query('.J_Page'),'click',function(ev){
	 	        	var v = DOM.attr(ev.currentTarget,'data');
	 				DOM.removeClass(DOM.query('#J_TopLeft .J_Page'),'active');
	 				DOM.addClass(ev.currentTarget,'active');
	 				DOM.html(DOM.get('#J_TopLeft .value'),v);
	 				DOM.val('#J_SelectItemPage',v);
	 				Smslist.searchTbItems();
	 	        })
	 	        Event.on("#J_LeftSearch", "click", function(){
					Smslist.searchTbItems();
				});
   	         	Smslist.searchTbItems();
   	         	Event.on("#J_TopCheckAll", "click", Smslist.checkAll);
   	         	Event.on("#J_BottonCheckAll", "click", Smslist.checkAll);
   	         	Event.on("#J_GetRetryCount", "click", function(){
				    Smslist.getRetryCount();
				});
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
					DOM.html('#sms_num',totalRecords);
					Smslist.renderItems(o.payload.body);
					var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
					Smslist.paginator = new showPages('Smslist.paginator').setRender(Smslist.handlePagination).setPageCount(pageCount).printHtml('#J_Paging',2);
					Smslist.paginator.setPageCount(pageCount).printHtml('#J_TopPaging',3); 
					
	    	    };
	    	    var Status = DOM.val(DOM.get('#J_Carestatus'));
	    	    var itemPage = DOM.val(DOM.get("#J_SelectItemPage"));//每页多少条
	    	    var data = Smslist.getData();
	    	    	data +="&page_size="+itemPage+"&status="+Status;
    	   		DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainLeftContent');
				new H.widget.asyncRequest().setURI(loadTbItemsUrl).setMethod("POST").setHandle(submitHandle).setData(data).send();
			},
			getData : function(){
				if(DOM.val(DOM.get("#J_SearchNick")) != '请输入旺旺、手机号'){
  	    	    	var buyer_Nick = encodeURIComponent(DOM.val(DOM.get("#J_SearchNick"))); //标题
  	    	    }else{
  	    	    	var buyer_Nick ='';
  	    	    }
  	    	    var Type = DOM.val(DOM.get('#J_Caretype'));
  	    	    var start_at = DOM.val('#J_startDate');
               	var end_at = DOM.val('#J_endDate');
                var history = DOM.val('#J_history');
       	    	var data = "buyer_nick="+buyer_Nick+"&type="+Type+"&start_at="+start_at+"&end_at="+end_at+"&history="+history; 		        	    
	 			return data ;
			},
			renderItems: function(c) {
	    	    DOM.html(DOM.get("#J_TbItemList"), c);
	    	    
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
	 				DOM.html('#sms_num',totalRecords);
	 				var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
	 				Smslist.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_Paging',2);
	 				Smslist.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_TopPaging',3);
	 				Smslist.renderItems(o.payload.body);
	 				DOM.hide('#J_LeftLoading');
					DOM.show('#J_MainLeftContent');
		    	};
		    	var itemPage = DOM.val(DOM.get("#J_SelectItemPage"));//每页多少条
		    	var Status = DOM.val(DOM.get('#J_Carestatus'));
		    	var data = Smslist.getData();
		    		data +="&page_size="+itemPage+"&page_id="+pageId+"&status="+Status;
				DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainLeftContent');
	    	    new H.widget.asyncRequest().setURI(loadTbItemsUrl).setMethod("POST").setHandle(submitHandle).setData(data).send();
			},
			retry :function(id){
				var submitHandle = function(o) {
					if(Smslist.paginator){
						Smslist.paginator.toPage(Smslist.paginator.page);
					}else{
						Smslist.searchTbItems();
					}
				};
				var data = "sms_id="+id;
				new H.widget.asyncRequest().setURI(retryUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			},
			//根据时间和短信类型批量重试
			getRetryCount :function(){
			    var submitHandle = function(o) {
			        if(o.payload.sms_balance == -1){
			            if(o.payload.sms_total <= 0){
    			            new H.widget.msgBox({
    			                title: "温馨提示",
    			                type: "error",
    			                content: "没有符合条件的记录需要重试."
    			            });
			            }else {
    			            new H.widget.msgBox({
    		                    title: "重试",
    		                    type: "confirm",
    		                    content: "需要重试的数目为"+o.payload.sms_total+"条，确定重试？",
    		                    buttons: [{ value: "确定" }],
    		                    success: function (result) {
    		                        if (result == "确定") {
    		                            Smslist.allretry();
    		                        }
    		                    }
    		                });
			            }
			        }else{
    			        new H.widget.msgBox({
    	                    title: "重试",
    	                    type: "confirm",
    	                    content: "需要重试的数目为"+o.payload.sms_total+"条，当前余额为"+o.payload.sms_balance+"条！重试只能发送一部分用户，确定重试？",
    	                    buttons: [{ value: "充值" }, { value: "重试" }],
    	                    success: function (result) {
        			            if (result == "充值") {
        			                window.location.href=smsOrderUrl;
        			            }else if (result == "重试") {
    	                            Smslist.allretry();
    	                        }
    	                    }
    	                });
			        }
			    };
			    var errorHandle = function(o){
			        new H.widget.msgBox({
			            title:"错误提示",
			            content:o.desc,
			            type:"error"
			        });
			    };
			    var data = Smslist.getData();
			    new H.widget.asyncRequest().setURI(getRetryCountUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},
			//重试
			allretry :function(){
				var submitHandle = function(o) {
					new H.widget.msgBox({
					    title:"成功提示",
					    content:o.payload,
					    type:"error",
						autoClose : true,
						timeOut : 1000
					});
	        	    window.location.reload(true);
				};
				var errorHandle = function(o){
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
	    	    };
        	    var data = Smslist.getData();
				new H.widget.asyncRequest().setURI(retryallUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},
	        
	}
}, {
    requires: ['utils/showPages/index','bui/select','bui/calendar']
});
