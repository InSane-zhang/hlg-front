/*
combined files : 

utils/showPages/index
page/market-init

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
KISSY.add('page/market-init',function (S,showPages,Overlay,Calendar) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	
	return marketControl = {
				msg : null,
				init : function(){
					 marketControl.searchTbItems();
					 Event.on('.J_NewMarket','click',function(ev){
						window.location.href=addPlanFromTbUrl;
					 })	
					 Event.on('.J_MsgBlack','click',function(ev){
							window.location.href=blackFromTbUrl;
						 })					 
					 Event.delegate(document,'click','.J_Delete',function(ev){
						 var data = DOM.attr(ev.currentTarget,'data');
						 new H.widget.msgBox({
						    title: "删除",
						    content: '确定要删除？',
						    type: "confirm",
						    buttons: [{ value: "确定删除" }, { value: "取消" }],
						    success: function (result) {
						        if (result == "确定删除") {
						        	marketControl.Delete(data);
						        }
						    }
						});
					 })
					 Event.delegate(document,'click','.J_UpdateTime',function(ev){
						 var data = DOM.attr(ev.currentTarget,'data');
						 marketControl.updateTime(data)
					 })					 
					 Event.delegate(document,'click','.J_Update',function(ev){
						 var data = DOM.attr(ev.currentTarget,'data');
						 window.location.href=updatePlansFromTbUrl+'&plan_id='+data;
					 })					 
//				     Event.on('.J_Update','click',function(){
//						  DOM.remove('.bui-dialog');
//				          var dialog = new Overlay.Dialog({
//				             title:'更改状态',
//				             width:340,
//				             height:186,
//				             mask:false,
//				             buttons:[
//			    	                   {
//			    	                     text:'确定',
//			    	                     elCls : 'bui-button bui-button-primary',
//			    	                     handler : function(){
//			    	                       this.hide();
//			    	                     }
//			    	                   },{
//			    	                     text:'取消',
//			    	                     elCls : 'bui-button',
//			    	                     handler : function(){
//			    	                       this.hide();
//			    	                     }
//			    	                   }
//			    	                 ],
//				             bodyContent:'<em class="doubt"></em>修改状态不可撤销，确定要修改为“发送已完成”的状态吗？'
//				           });
//				          dialog.show();
//					})
				     Event.on('.J_Detail','click',function(){
						  DOM.remove('.bui-dialog');
				          var dialog = new Overlay.Dialog({
				             title:'更改状态',
				             width:340,
				             height:186,
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
				             bodyContent:'<em class="doubt"></em>修改状态不可撤销，确定要修改为“发送已完成”的状态吗？'
				           });
				          dialog.show();
					})					
				},
				updateTime : function(plan_id){
					  DOM.remove('.bui-dialog');
			          var dialog = new Overlay.Dialog({
			             title:'修改时间',
			             width:340,
			             height:186,
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
			             bodyContent:'定时发送：<input id="J_SendTime" name="send_time" class="calendarImg timing" type="text" style="margin-left: 8px;">'
			           });
			          dialog.show();
			          DOM.val('#J_SendTime',DOM.html('.J_Time_'+plan_id));
			          var timing = new Calendar.DatePicker({
				            trigger:'.timing',
				            autoRender : true,
				            showTime:true
				         });
			          Event.on('.bui-button-primary','click',function(){
							var sucessHandle = function(o) {
		 	            		window.location.reload();
		 	            	};
					 		var errorHandle = function(o){
					 		};	  
					 		var send_time = DOM.val('#J_SendTime')
				    	    data= 'plan_id='+plan_id+'&send_time='+send_time;
				    	    new H.widget.asyncRequest().setURI(editPlanFromTbUrl).setMethod("POST").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();			        	  
			          })
				},				
				Delete : function(plan_id){
 	            	var sucessHandle = function(o) {
 	            		window.location.reload();
 	            	};
			 		var errorHandle = function(o){
			 		};	    	    
		    	    data= 'plan_id='+plan_id;
		    	    new H.widget.asyncRequest().setURI(deletePlansFromTbUrl).setMethod("POST").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();					
				},
				searchTbItems : function() {
		            var submitHandle = function(o) {
						DOM.hide('#J_Loading');
						DOM.show('#J_MainContent');
		        	    totalRecords = o.payload.totalRecords;
						if(totalRecords > 0){
	                        DOM.hide('#J_Empty');
	                        DOM.show(".J_ItemSelectBtnHolder");
	                        DOM.show(".J_Content");
	                    } else {
	                        DOM.show('#J_Empty');
	                        DOM.hide(".J_ItemSelectBtnHolder");
	                        DOM.hide(".J_Content");
						}
						marketControl.renderItems(o.payload.body);
						var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
						marketControl.paginator = new showPages('marketControl.paginator').setRender(marketControl.handlePagination).setPageCount(pageCount).printHtml('#J_Paging',2);
		    	    };
		    	    var data = "pageSize=10";
	    	   		DOM.show('#J_Loading');
					DOM.hide('#J_MainContent');
					new H.widget.asyncRequest().setURI(loadPlansFromTbUrl).setMethod("POST").setHandle(submitHandle).setData(data).send();
				},
	            renderItems: function(c) {
	                DOM.html(DOM.get("#J_PromotionItemList"), c);
	            },
	            handlePagination : function(turnTo) {
	                pageId = turnTo;
	                var submitHandle = function(o) {
	                     totalRecords = o.payload.totalRecords;
	                    if(totalRecords > 0){
	                        DOM.hide('#J_Empty');
	                        DOM.show(".J_ItemSelectBtnHolder");
	                    } else {
	                        DOM.show('#J_Empty');
	                        DOM.hide(".J_ItemSelectBtnHolder");
	                    }
	                    var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
	                    marketControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_Paging',2);
	                    marketControl.renderItems(o.payload.body);
	                    DOM.hide('#J_Loading');
	                    DOM.show('#J_MainContent');
	                };
	                var data = "pageSize=10"+"&page_id="+pageId;
	                DOM.show('#J_Loading');
	                DOM.hide('#J_MainContent');
	                new H.widget.asyncRequest().setURI(loadPlansFromTbUrl).setMethod("POST").setHandle(submitHandle).setData(data).send();
	            }				
		}
}, {
    requires: ['utils/showPages/index','bui/overlay','bui/calendar']
});      
